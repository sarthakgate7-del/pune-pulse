import { useState } from 'react';
import {
  X,
  AlertTriangle,
  Sparkles,
  CloudRain,
  Navigation,
  Mic,
  Camera,
  CheckCircle2,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CitizenReport } from '../types';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (
    report: Omit<CitizenReport, 'id' | 'upvotes' | 'timestamp' | 'status'>,
    points?: number
  ) => void;
  cityName?: string;
}

export function ReportIssueModal({
  isOpen,
  onClose,
  onSubmitReport,
  cityName = 'Pune',
}: ReportIssueModalProps) {
  const [formCategory, setFormCategory] = useState<'hazard' | 'gem' | 'traffic' | 'weather'>('hazard');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSeverity, setFormSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [formPhotoPreset, setFormPhotoPreset] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [submittedToast, setSubmittedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculateReportPoints = (category: string, severity: string): number => {
    if (category === 'gem') return 45;
    if (severity === 'High') return 60;
    if (severity === 'Medium') return 50;
    return 35;
  };

  const currentAwardPoints = calculateReportPoints(formCategory, formSeverity);

  const handleStartVoiceRecording = () => {
    if (hasVoiceNote) {
      setHasVoiceNote(false);
      return;
    }
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsRecordingVoice(false);
          setHasVoiceNote(true);
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    // Approximate Pune coordinates based on location or default
    const lat = 18.5204 + (Math.random() - 0.5) * 0.05;
    const lng = 73.8567 + (Math.random() - 0.5) * 0.05;

    onSubmitReport(
      {
        city: cityName,
        category: formCategory,
        title: formTitle.trim(),
        description: `${formDescription.trim()}${
          hasVoiceNote ? ' [Audio Memo Attached (6s)]' : ''
        }${formPhotoPreset ? ` [Photo Evidence: ${formPhotoPreset}]` : ''}`,
        locationName: formLocation.trim() || 'Pune City Center',
        coordinates: [lat, lng],
        photoUrl: formPhotoPreset
          ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600'
          : null,
        severity: formSeverity,
      },
      currentAwardPoints
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    setSubmittedToast(`+${currentAwardPoints} Civic Points awarded!`);

    setTimeout(() => {
      // Reset form and close
      setFormTitle('');
      setFormLocation('');
      setFormDescription('');
      setHasVoiceNote(false);
      setFormPhotoPreset(null);
      setSubmittedToast(null);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-white">
                Report Urban Problem
              </h3>
              <span className="text-[11px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs flex items-center gap-1">
                <Zap className="w-3 h-3 fill-stone-950" />
                +{currentAwardPoints} Civic Points
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              Inform fellow citizens and municipal cells. Points bank immediately to your Punekar profile.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedToast ? (
          <div className="p-8 text-center space-y-3 bg-stone-50">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">Report Successfully Submitted!</h4>
            <p className="text-sm font-semibold text-amber-600">{submittedToast}</p>
            <p className="text-xs text-stone-500">
              Your update is now broadcast live to PunePulse citizens & civic ward teams.
            </p>
          </div>
        ) : (
          /* Modal Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
            {/* Category Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Select Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setFormCategory('hazard')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    formCategory === 'hazard'
                      ? 'bg-red-50 border-red-300 text-red-900 font-semibold ring-2 ring-red-400/20'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base mb-0.5">⚠️</div>
                  <div className="font-medium">Safety Hazard</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormCategory('traffic')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    formCategory === 'traffic'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold ring-2 ring-amber-400/20'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base mb-0.5">🚦</div>
                  <div className="font-medium">Traffic Jam</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormCategory('weather')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    formCategory === 'weather'
                      ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold ring-2 ring-sky-400/20'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base mb-0.5">🌧️</div>
                  <div className="font-medium">Rain / Flood</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormCategory('gem')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    formCategory === 'gem'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold ring-2 ring-emerald-400/20'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="text-base mb-0.5">✨</div>
                  <div className="font-medium">Hidden Gem</div>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Report Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Broken streetlight causing dark blind spot near Paud Road"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Specific Location / Chowk in Pune <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deccan Goodluck Chowk, FC Road, Pune"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Description & Advisory for Citizens <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide helpful details (e.g., alternative bypass route, exact landmark, water depth, hazard level)..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Severity & Media Attachments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Urgency / Severity Level
                </label>
                <select
                  value={formSeverity}
                  onChange={(e: any) => setFormSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-hidden focus:border-stone-400"
                >
                  <option value="Low">Low - Informational / Gem (+35-45 pts)</option>
                  <option value="Medium">Medium - Moderate Delay / Dim Area (+50 pts)</option>
                  <option value="High">High - Severe Hazard / Waterlogging (+60 pts)</option>
                </select>
              </div>

              {/* Voice Memo Recording */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Voice Memo
                </label>
                <button
                  type="button"
                  onClick={handleStartVoiceRecording}
                  className={`w-full py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isRecordingVoice
                      ? 'bg-red-50 border-red-300 text-red-700 animate-pulse font-semibold'
                      : hasVoiceNote
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>
                    {isRecordingVoice
                      ? `Recording... ${recordingSeconds}s`
                      : hasVoiceNote
                      ? '✓ Voice Note Attached (6s)'
                      : 'Record 6s Voice Note'}
                  </span>
                </button>
              </div>
            </div>

            {/* Photo Attachment Presets */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Attach Evidence Photo
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFormPhotoPreset(formPhotoPreset === 'Pothole Camera Evidence' ? null : 'Pothole Camera Evidence')}
                  className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    formPhotoPreset === 'Pothole Camera Evidence'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Street Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormPhotoPreset(formPhotoPreset === 'Waterlogging Evidence' ? null : 'Waterlogging Evidence')}
                  className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    formPhotoPreset === 'Waterlogging Evidence'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Waterlog Snapshot</span>
                </button>
                {formPhotoPreset && (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Attached
                  </span>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Submit & Collect +{currentAwardPoints} pts</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
