import { X } from 'lucide-react';
import { OfflinePuneGame } from './OfflinePuneGame';

interface OfflineGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardCivicPoints: (points: number, reason: string) => void;
  isOfflineMode?: boolean;
}

export function OfflineGameModal({
  isOpen,
  onClose,
  onAwardCivicPoints,
  isOfflineMode = false,
}: OfflineGameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-base">🛺</span>
            <span className="font-bold text-xs sm:text-sm">Pune Offline Mini-Game · Rickshaw Patrol</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto">
          <OfflinePuneGame
            isOfflineMode={isOfflineMode}
            onAwardCivicPoints={(pts, reason) => {
              onAwardCivicPoints(pts, reason);
            }}
          />
        </div>
      </div>
    </div>
  );
}
