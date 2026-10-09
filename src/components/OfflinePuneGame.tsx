import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Award, ShieldAlert, Sparkles, Trophy, WifiOff } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OfflinePuneGameProps {
  onAwardCivicPoints?: (points: number, reason: string) => void;
  isOfflineMode?: boolean;
}

type Lane = 0 | 1 | 2; // 0 = Left, 1 = Center, 2 = Right

interface Obstacle {
  id: number;
  lane: Lane;
  y: number; // 0 to 100 (%)
  type: 'pothole' | 'barricade' | 'puddle' | 'bakarwadi' | 'gold_coin' | 'shield';
  isCollectible: boolean;
  points: number;
  label: string;
}

export function OfflinePuneGame({ onAwardCivicPoints, isOfflineMode = false }: OfflinePuneGameProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [playerLane, setPlayerLane] = useState<Lane>(1);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [hasShield, setHasShield] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('pune_game_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [earnedCivicPoints, setEarnedCivicPoints] = useState(0);
  const [hasBankedPoints, setHasBankedPoints] = useState(false);

  const obstaclesRef = useRef<Obstacle[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const gameSpeedRef = useRef<number>(0.65);
  const nextIdRef = useRef<number>(1);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API for synthetic offline retro sounds
  const playSound = (type: 'horn' | 'collect' | 'crash' | 'shield') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'horn') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(494, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'crash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'shield') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {}
  };

  const startGame = () => {
    obstaclesRef.current = [];
    setPlayerLane(1);
    setScore(0);
    setDistance(0);
    setGemsCollected(0);
    setHasShield(false);
    setEarnedCivicPoints(0);
    setHasBankedPoints(false);
    gameSpeedRef.current = 0.65;
    lastSpawnRef.current = performance.now();
    setGameState('playing');
    playSound('horn');
  };

  const moveLeft = () => {
    if (gameState !== 'playing') return;
    setPlayerLane((prev) => (prev > 0 ? ((prev - 1) as Lane) : 0));
  };

  const moveRight = () => {
    if (gameState !== 'playing') return;
    setPlayerLane((prev) => (prev < 2 ? ((prev + 1) as Lane) : 2));
  };

  const honkHorn = () => {
    playSound('horn');
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          moveLeft();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          moveRight();
        } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          honkHorn();
        }
      } else if (gameState === 'idle' || gameState === 'gameover') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;

    const gameLoop = (timestamp: number) => {
      // Advance distance & speed
      setDistance((d) => d + 1);
      setScore((s) => s + 1);
      gameSpeedRef.current = Math.min(1.4, 0.65 + Math.floor(distance / 500) * 0.08);

      // Spawn obstacles / collectibles
      if (timestamp - lastSpawnRef.current > Math.max(900, 1600 - gameSpeedRef.current * 400)) {
        lastSpawnRef.current = timestamp;
        const randomLane = Math.floor(Math.random() * 3) as Lane;
        const randType = Math.random();

        let newObstacle: Obstacle;
        if (randType < 0.28) {
          // Pothole
          newObstacle = {
            id: nextIdRef.current++,
            lane: randomLane,
            y: -10,
            type: 'pothole',
            isCollectible: false,
            points: 0,
            label: '🕳️ Pothole',
          };
        } else if (randType < 0.5) {
          // Metro Barricade
          newObstacle = {
            id: nextIdRef.current++,
            lane: randomLane,
            y: -10,
            type: 'barricade',
            isCollectible: false,
            points: 0,
            label: '🚧 PMC Metro Work',
          };
        } else if (randType < 0.65) {
          // Water Puddle
          newObstacle = {
            id: nextIdRef.current++,
            lane: randomLane,
            y: -10,
            type: 'puddle',
            isCollectible: false,
            points: 0,
            label: '🌊 Rain Puddle',
          };
        } else if (randType < 0.82) {
          // Chitale Bakarwadi
          newObstacle = {
            id: nextIdRef.current++,
            lane: randomLane,
            y: -10,
            type: 'bakarwadi',
            isCollectible: true,
            points: 25,
            label: '🥟 Bakarwadi Gem',
          };
        } else if (randType < 0.94) {
          // Peshwa Gold Coin
          newObstacle = {
            id: nextIdRef.current++,
            lane: randomLane,
            y: -10,
            type: 'gold_coin',
            isCollectible: true,
            points: 50,
            label: '👑 Peshwa Coin',
          };
        } else {
          // Safety Shield
          newObstacle = {
            id: nextIdRef.current++,
            lane: randomLane,
            y: -10,
            type: 'shield',
            isCollectible: true,
            points: 30,
            label: '🛡️ Safety Shield',
          };
        }

        obstaclesRef.current.push(newObstacle);
      }

      // Move obstacles downwards
      const remaining: Obstacle[] = [];
      let collision = false;

      for (const item of obstaclesRef.current) {
        item.y += gameSpeedRef.current;

        // Check collision zone (rickshaw is at y ~ 75% to 88%)
        const inPlayerHitbox = item.y >= 72 && item.y <= 86 && item.lane === playerLane;

        if (inPlayerHitbox) {
          if (item.isCollectible) {
            playSound('collect');
            setScore((s) => s + item.points);
            setGemsCollected((g) => g + 1);
            if (item.type === 'shield') {
              setHasShield(true);
              playSound('shield');
            }
            continue; // Collected!
          } else {
            // Hit obstacle
            if (hasShield) {
              // Shield absorbed
              playSound('shield');
              setHasShield(false);
              continue;
            } else {
              collision = true;
              break;
            }
          }
        }

        if (item.y <= 105) {
          remaining.push(item);
        }
      }

      if (collision) {
        playSound('crash');
        setGameState('gameover');

        // Calculate Civic Points reward based on score
        setScore((finalScore) => {
          const awarded = Math.min(35, Math.max(10, Math.floor(finalScore / 40)));
          setEarnedCivicPoints(awarded);

          setHighScore((prevHigh) => {
            if (finalScore > prevHigh) {
              try {
                localStorage.setItem('pune_game_high_score', finalScore.toString());
              } catch {}
              return finalScore;
            }
            return prevHigh;
          });

          return finalScore;
        });

        return;
      }

      obstaclesRef.current = remaining;
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    requestRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [gameState, playerLane, hasShield, distance]);

  const handleBankPoints = () => {
    if (hasBankedPoints || earnedCivicPoints <= 0) return;
    if (onAwardCivicPoints) {
      onAwardCivicPoints(earnedCivicPoints, `Offline Game: Rickshaw Patrol score ${score}`);
    }
    setHasBankedPoints(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="bg-stone-900 text-white rounded-2xl border border-stone-800 shadow-xl overflow-hidden flex flex-col">
      {/* Game Header Bar */}
      <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-stone-100">Pune Rickshaw Patrol</h3>
              {isOfflineMode && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  <WifiOff className="w-2.5 h-2.5" />
                  Offline Mode Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              Dodge Paud Road potholes & collect Pune gems to earn civic karma
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors text-xs"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* Main Track / Canvas Canvas View */}
      <div className="relative w-full h-80 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 overflow-hidden select-none">
        {/* Track Asphalt & 3 Lanes Lines */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-dashed border-stone-600/50 relative">
            <span className="absolute top-2 left-2 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
              FC Road
            </span>
          </div>
          <div className="flex-1 border-r border-dashed border-stone-600/50 relative">
            <span className="absolute top-2 left-2 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
              JM Road
            </span>
          </div>
          <div className="flex-1 relative">
            <span className="absolute top-2 left-2 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
              Deccan
            </span>
          </div>
        </div>

        {/* Top Floating Dashboard overlay */}
        <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between text-xs font-mono pointer-events-none">
          <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-stone-700/80 flex items-center gap-3">
            <span>
              Dist: <strong className="text-amber-400">{distance}m</strong>
            </span>
            <span>
              Score: <strong className="text-emerald-400">{score}</strong>
            </span>
            <span>
              Gems: <strong className="text-purple-400">🥟 {gemsCollected}</strong>
            </span>
          </div>

          <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-stone-700/80 flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>High: <strong>{highScore}</strong></span>
          </div>
        </div>

        {/* Shield Indicator */}
        {hasShield && (
          <div className="absolute top-11 right-3 z-20 bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <span>🛡️ Active City Shield</span>
          </div>
        )}

        {/* Obstacles & Collectibles in Lanes */}
        {obstaclesRef.current.map((item) => {
          const lanePercent = item.lane === 0 ? '16.6%' : item.lane === 1 ? '50%' : '83.3%';
          return (
            <div
              key={item.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 flex flex-col items-center"
              style={{
                left: lanePercent,
                top: `${item.y}%`,
              }}
            >
              {item.type === 'pothole' && (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-7 rounded-full bg-stone-950 border-2 border-stone-700 shadow-inner flex items-center justify-center text-[10px]">
                    🕳️
                  </div>
                  <span className="text-[9px] text-red-400 font-bold bg-stone-950/80 px-1 rounded-sm mt-0.5">
                    Khadde
                  </span>
                </div>
              )}

              {item.type === 'barricade' && (
                <div className="flex flex-col items-center">
                  <div className="w-9 h-8 bg-amber-600 rounded-sm border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-black shadow-xs">
                    🚧
                  </div>
                  <span className="text-[8px] text-amber-300 font-bold bg-stone-950/80 px-1 rounded-sm mt-0.5">
                    Metro
                  </span>
                </div>
              )}

              {item.type === 'puddle' && (
                <div className="flex flex-col items-center">
                  <div className="w-11 h-6 rounded-full bg-blue-600/70 border border-blue-400/80 shadow-md flex items-center justify-center text-xs">
                    🌊
                  </div>
                  <span className="text-[8px] text-blue-300 font-bold bg-stone-950/80 px-1 rounded-sm mt-0.5">
                    Puddle
                  </span>
                </div>
              )}

              {item.type === 'bakarwadi' && (
                <div className="flex flex-col items-center animate-bounce">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-base shadow-lg shadow-amber-400/20">
                    🥟
                  </div>
                  <span className="text-[8px] text-amber-300 font-extrabold bg-stone-950/80 px-1 rounded-sm mt-0.5">
                    +25
                  </span>
                </div>
              )}

              {item.type === 'gold_coin' && (
                <div className="flex flex-col items-center animate-spin">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-stone-950 font-black flex items-center justify-center text-sm shadow-lg shadow-yellow-400/30">
                    👑
                  </div>
                  <span className="text-[8px] text-yellow-300 font-extrabold bg-stone-950/80 px-1 rounded-sm mt-0.5">
                    +50
                  </span>
                </div>
              )}

              {item.type === 'shield' && (
                <div className="flex flex-col items-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-base shadow-lg shadow-emerald-400/30">
                    🛡️
                  </div>
                  <span className="text-[8px] text-emerald-300 font-extrabold bg-stone-950/80 px-1 rounded-sm mt-0.5">
                    Shield
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Player: Pune Auto-Rickshaw */}
        <div
          className={`absolute bottom-6 transform -translate-x-1/2 transition-all duration-150 flex flex-col items-center z-10 ${
            hasShield ? 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' : ''
          }`}
          style={{
            left: playerLane === 0 ? '16.6%' : playerLane === 1 ? '50%' : '83.3%',
          }}
        >
          {/* Rickshaw Body */}
          <div className="relative w-12 h-14 bg-gradient-to-b from-yellow-400 via-yellow-500 to-green-700 rounded-t-xl rounded-b-md border-2 border-stone-950 shadow-2xl flex flex-col items-center justify-between p-1">
            {/* Top Roof Yellow */}
            <div className="w-full h-3 bg-yellow-300 rounded-t-md border-b border-black/30 flex items-center justify-center">
              <span className="text-[7px] font-black text-stone-900 tracking-tighter">PUNE MH-12</span>
            </div>

            {/* Windshield */}
            <div className="w-9 h-4 bg-sky-200/90 rounded-sm border border-stone-800 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-black/40" />
            </div>

            {/* Headlights & Bumper */}
            <div className="w-full flex items-center justify-between px-1">
              <div className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_6px_rgba(251,191,36,1)]" />
              <div className="text-[7px] font-mono font-bold text-white">CNG</div>
              <div className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_6px_rgba(251,191,36,1)]" />
            </div>
          </div>
        </div>

        {/* Idle Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl mb-2">
              🛺
            </div>
            <h4 className="text-base font-bold text-stone-100">Punekar Street Dodger</h4>
            <p className="text-xs text-stone-300 max-w-xs mt-1">
              Navigate Pune's streets without internet! Dodge potholes & construction barricades, collect Chitale Bakarwadi and earn civic karma points.
            </p>

            <button
              onClick={startGame}
              className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Start Driving (Press Space)</span>
            </button>
            <span className="text-[10px] text-stone-400 mt-2">
              Controls: ⬅️ Left / ➡️ Right Arrow Keys or A / D
            </span>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center z-30 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center text-xl mb-1">
              💥
            </div>
            <h4 className="text-base font-extrabold text-stone-100">Bumper to Bumper Crash!</h4>
            <p className="text-xs text-stone-400 mt-0.5">
              Hit a pothole on Paud Road! Your Pune driving run ended.
            </p>

            <div className="grid grid-cols-3 gap-2 w-full max-w-xs my-3 text-xs">
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <div className="text-[10px] text-stone-400">Score</div>
                <div className="font-extrabold text-amber-400 text-sm">{score}</div>
              </div>
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <div className="text-[10px] text-stone-400">Gems</div>
                <div className="font-extrabold text-purple-400 text-sm">🥟 {gemsCollected}</div>
              </div>
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <div className="text-[10px] text-stone-400">Civic Pts</div>
                <div className="font-extrabold text-emerald-400 text-sm">+{earnedCivicPoints} pts</div>
              </div>
            </div>

            {/* Bank Points to Profile button */}
            {onAwardCivicPoints && !hasBankedPoints && (
              <button
                onClick={handleBankPoints}
                className="mb-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <Award className="w-4 h-4 text-emerald-200" />
                <span>Bank +{earnedCivicPoints} Civic Points to Profile</span>
              </button>
            )}

            {hasBankedPoints && (
              <div className="mb-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Points credited to your Pune Civic Profile!</span>
              </div>
            )}

            <button
              onClick={startGame}
              className="px-4 py-2 bg-stone-200 hover:bg-white text-stone-900 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Drive Again (Spacebar)</span>
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Mobile & Touch Game Controls */}
      <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={moveLeft}
            disabled={gameState !== 'playing'}
            className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-amber-600 text-stone-200 disabled:opacity-40 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>⬅️ Left Lane</span>
          </button>

          <button
            onClick={honkHorn}
            disabled={gameState !== 'playing'}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-40 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Honk Horn"
          >
            <span>📯 Honk</span>
          </button>

          <button
            onClick={moveRight}
            disabled={gameState !== 'playing'}
            className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 active:bg-amber-600 text-stone-200 disabled:opacity-40 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Right Lane ➡️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
