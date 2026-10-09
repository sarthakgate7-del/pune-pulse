import { X, ShieldCheck, Sparkles, Navigation, Clock, CheckCircle2, AlertTriangle, Volume2 } from 'lucide-react';
import { LocationSpot } from '../types';
import { useState } from 'react';

interface SpotDetailModalProps {
  spot: LocationSpot | null;
  onClose: () => void;
  onNavigateToSpot: (spot: LocationSpot) => void;
}

export function SpotDetailModal({ spot, onClose, onNavigateToSpot }: SpotDetailModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!spot) return null;

  const isHazard = spot.category === 'hazard';

  const handleSpeakTip = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const textToRead = `${spot.name} in ${spot.neighborhood}. ${spot.description}. Safety tip: ${spot.verifiedTips.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`p-5 border-b ${isHazard ? 'bg-red-50/70 border-red-200' : 'bg-stone-50/70 border-stone-200'} flex items-start justify-between`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <span>{spot.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{spot.category}</span>
              <span aria-hidden="true">·</span>
              <span>{spot.costLevel}</span>
            </div>
            <h2 className="text-xl font-semibold text-stone-900 leading-tight">
              {spot.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm text-stone-700 flex-1">
          {/* Hazard Alert Banner */}
          {spot.hazardAlert && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-xs tracking-wide uppercase text-red-700">Citizen Caution Advisory</div>
                <p className="mt-0.5 text-xs text-red-800">{spot.hazardAlert}</p>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-stone-700 leading-relaxed text-sm">
            {spot.description}
          </p>

          {/* Key Urban Metrics Row */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <div>
              <div className="text-xs text-stone-500 font-medium">Safety Score</div>
              <div className="mt-1 flex items-center gap-1.5 font-semibold text-base text-stone-900">
                <ShieldCheck className={`w-4 h-4 ${spot.safetyScore >= 80 ? 'text-emerald-600' : spot.safetyScore >= 60 ? 'text-amber-600' : 'text-red-600'}`} />
                <span>{spot.safetyScore}</span>
                <span className="text-xs text-stone-400 font-normal">/100</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-500 font-medium">Cleanliness</div>
              <div className="mt-1 flex items-center gap-1.5 font-semibold text-base text-stone-900">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>{spot.cleanlinessScore}</span>
                <span className="text-xs text-stone-400 font-normal">/100</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-500 font-medium">Crowd Level</div>
              <div className="mt-1 font-semibold text-sm text-stone-800">
                {spot.crowdStatus || 'Normal'}
              </div>
            </div>
          </div>

          {/* Best Time to Visit */}
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-100/60 p-2.5 rounded-lg">
            <Clock className="w-4 h-4 text-stone-500 shrink-0" />
            <span><strong>Recommended timing:</strong> {spot.bestTimeToVisit}</span>
          </div>

          {/* Verified Local Tips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
                Street-Smart Local Tips
              </h3>
              {'speechSynthesis' in window && (
                <button
                  onClick={handleSpeakTip}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
                  title="Listen to tips aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Stop Voice' : 'Listen Tips'}</span>
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {spot.verifiedTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100">
            {spot.tags.map((tag) => (
              <span key={tag} className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onNavigateToSpot(spot);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Plan Safe Route Here</span>
          </button>
        </div>
      </div>
    </div>
  );
}
