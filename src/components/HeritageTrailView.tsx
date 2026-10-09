import { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Navigation,
  Clock,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  X,
  CheckCircle2,
} from 'lucide-react';
import { City, HeritageTrail, HeritageStop } from '../types';
import { CityMap } from './CityMap';

interface HeritageTrailViewProps {
  city: City;
  trail: HeritageTrail;
  onExitTrail: () => void;
  weatherAlertActive?: boolean;
}

export function HeritageTrailView({
  city,
  trail,
  onExitTrail,
  weatherAlertActive = false,
}: HeritageTrailViewProps) {
  const [selectedStopId, setSelectedStopId] = useState<string>(trail.stops[0].id);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const activeStop = trail.stops.find((s) => s.id === selectedStopId) || trail.stops[0];

  // Web Speech API Audio Synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();

      const text = `${activeStop.name}. Built in ${activeStop.yearBuilt} during the ${activeStop.era}. ${activeStop.audioGuideSummary}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
      };

      window.speechSynthesis.speak(utterance);

      // Progress interval
      const duration = activeStop.audioDurationSeconds || 40;
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 1;
        setAudioProgress(Math.min(100, Math.round((elapsed / duration) * 100)));
        if (elapsed >= duration) {
          clearInterval(interval);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        window.speechSynthesis.cancel();
      };
    } else {
      window.speechSynthesis.cancel();
      setAudioProgress(0);
    }
  }, [isPlayingAudio, activeStop]);

  // Handle stop switch
  const handleSelectStop = (stop: HeritageStop) => {
    setSelectedStopId(stop.id);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleNextStop = () => {
    const currentIndex = trail.stops.findIndex((s) => s.id === activeStop.id);
    if (currentIndex < trail.stops.length - 1) {
      handleSelectStop(trail.stops[currentIndex + 1]);
    }
  };

  const handlePrevStop = () => {
    const currentIndex = trail.stops.findIndex((s) => s.id === activeStop.id);
    if (currentIndex > 0) {
      handleSelectStop(trail.stops[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Heritage Trail Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-semibold text-purple-700">🏛️ Curated Heritage Walk</span>
            <span aria-hidden="true">·</span>
            <span>{city.name} Historical District</span>
            <span aria-hidden="true">·</span>
            <span>8th to 19th Century</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {trail.title}
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            {trail.subtitle}
          </p>

          {/* Trail Metrics Unboxed Metadata (Rule 1.A) */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-3 border-t border-stone-100">
            <span>Distance: <strong className="text-stone-900">{trail.totalDistance}</strong></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Duration: <strong className="text-stone-900">{trail.estimatedDuration}</strong></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Stops: <strong className="text-stone-900">{trail.stopsCount} Monuments</strong></span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Safety: <strong className="text-emerald-700">{trail.safetyScore}/100</strong> (Well-Lit Peth Promenade)</span>
          </div>
        </div>

        <button
          onClick={onExitTrail}
          className="self-start md:self-center px-4 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <X className="w-4 h-4" />
          <span>Exit Trail</span>
        </button>
      </div>

      {/* Audio Guide Floating Player Bar */}
      <div className="bg-stone-900 text-white p-4 rounded-xl shadow-md border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            {activeStop.order}
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Audio Guide · Stop {activeStop.order} of {trail.stops.length}</span>
            </div>
            <div className="font-bold text-stone-100 text-sm truncate mt-0.5">
              {activeStop.name} ({activeStop.marathiName})
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            onClick={handlePrevStop}
            disabled={activeStop.order === 1}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Previous Monument"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all shadow-xs"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Listen Audio Guide</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextStop}
            disabled={activeStop.order === trail.stops.length}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Next Monument"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Trail Stops Itinerary + Interactive Google Maps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Sequential Stops Cards */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
          <div className="text-xs text-stone-500 pb-1 flex items-center justify-between">
            <span>Walking Itinerary (North to South)</span>
            <span className="text-stone-400">Click any stop to listen & center</span>
          </div>

          {trail.stops.map((stop) => {
            const isSelected = stop.id === activeStop.id;

            return (
              <div
                key={stop.id}
                onClick={() => handleSelectStop(stop)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {stop.order}
                    </span>
                    <div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        {stop.era} · Built {stop.yearBuilt}
                      </div>
                      <h3 className="font-bold text-stone-900 text-base leading-snug">
                        {stop.name}
                      </h3>
                      <div className="text-xs text-stone-500 mt-0.5 font-medium">
                        {stop.marathiName}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md shrink-0">
                    {stop.entryFee}
                  </span>
                </div>

                {/* Brief Summary */}
                <p className="mt-2.5 text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {stop.audioGuideSummary}
                </p>

                {/* Architectural Highlights */}
                <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
                  {stop.architecturalHighlights.slice(0, 3).map((item, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Walking Tip to Next Stop */}
                {stop.walkingTipToNext && (
                  <div className="mt-3 p-2 bg-stone-50 rounded-lg text-[11px] text-stone-600 flex items-start gap-1.5 border border-stone-200/60">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>{stop.walkingTipToNext}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Map with Continuous Trail Polyline */}
        <div className="lg:col-span-7 h-[640px]">
          <CityMap
            city={city}
            spots={[]}
            onSelectSpot={() => {}}
            showSafetyHeatmap={false}
            weatherAlertActive={weatherAlertActive}
            heritageTrail={trail}
            selectedHeritageStopId={activeStop.id}
            onSelectHeritageStop={handleSelectStop}
          />
        </div>
      </div>
    </div>
  );
}
