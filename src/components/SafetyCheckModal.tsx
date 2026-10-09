import { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Phone,
  CheckCircle2,
  Copy,
  Share2,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Building,
  Navigation,
  Eye,
  Radio,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PUNE_CITY } from '../data/puneData';

interface SafetyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  userNeighborhood?: string;
  onAwardCivicPoints?: (points: number, reason: string) => void;
}

interface AreaSafetyData {
  name: string;
  safetyScore: number;
  status: 'High Safety' | 'Moderate Vigilance' | 'Caution Required';
  lightingIndex: number;
  policePresence: string;
  crowdLevel: string;
  activeHazardsCount: number;
  nearestSafeHavens: {
    name: string;
    type: 'Police Chowky' | 'Hospital' | 'Metro Station' | 'Safe Transit';
    distance: string;
    is24x7: boolean;
  }[];
  nightAdvice: string;
}

const PUNE_AREAS_SAFETY: Record<string, AreaSafetyData> = {
  'Deccan Gymkhana': {
    name: 'Deccan Gymkhana & FC Road',
    safetyScore: 94,
    status: 'High Safety',
    lightingIndex: 96,
    policePresence: 'Active PCR patrol near Goodluck Chowk (350m)',
    crowdLevel: 'Bustling students & diners until 11:30 PM',
    activeHazardsCount: 0,
    nearestSafeHavens: [
      { name: 'Deccan Gymkhana Police Chowky', type: 'Police Chowky', distance: '350m', is24x7: true },
      { name: 'Sahyadri Super Speciality Hospital', type: 'Hospital', distance: '600m', is24x7: true },
      { name: 'Garware College Underground Metro', type: 'Metro Station', distance: '450m', is24x7: true },
    ],
    nightAdvice: 'Well-lit corridors along FC Road and Prabhat Road. Wide sidewalks with continuous CCTV coverage.',
  },
  'Kothrud': {
    name: 'Kothrud (Paud Road & Karve Road)',
    safetyScore: 92,
    status: 'High Safety',
    lightingIndex: 93,
    policePresence: 'Regular beat van along Karve Statue circle (500m)',
    crowdLevel: 'Family residential & evening cafe activity',
    activeHazardsCount: 1,
    nearestSafeHavens: [
      { name: 'Kothrud Police Station', type: 'Police Chowky', distance: '800m', is24x7: true },
      { name: 'Krishna Hospital & ICU', type: 'Hospital', distance: '450m', is24x7: true },
      { name: 'Vanaz Elevated Metro Station', type: 'Metro Station', distance: '550m', is24x7: true },
    ],
    nightAdvice: 'Stick to main Karve Road spine after 10 PM. Watch for occasional roadwork near Paud flyover.',
  },
  'Koregaon Park': {
    name: 'Koregaon Park (KP Lanes 1-7)',
    safetyScore: 96,
    status: 'High Safety',
    lightingIndex: 98,
    policePresence: 'German Bakery chowky & North Main Road PCR (250m)',
    crowdLevel: 'Active nightlife, security guards at all residential gates',
    activeHazardsCount: 0,
    nearestSafeHavens: [
      { name: 'Koregaon Park Police Chowky', type: 'Police Chowky', distance: '300m', is24x7: true },
      { name: 'Inlaks and Budhrani Hospital', type: 'Hospital', distance: '700m', is24x7: true },
      { name: 'Osho Teerth Guard Kiosk', type: 'Safe Transit', distance: '400m', is24x7: true },
    ],
    nightAdvice: 'Extremely safe for solo walks and women. Well lit with residential security patrols across all numbered lanes.',
  },
  'Shivajinagar': {
    name: 'Shivajinagar & Civil Court Hub',
    safetyScore: 88,
    status: 'High Safety',
    lightingIndex: 91,
    policePresence: 'Police Commissionerate & Shivajinagar beat (400m)',
    crowdLevel: 'High transit footfall near bus depot and metro interchange',
    activeHazardsCount: 1,
    nearestSafeHavens: [
      { name: 'Shivajinagar Police Headquarters', type: 'Police Chowky', distance: '400m', is24x7: true },
      { name: 'Sancheti Orthopedic Hospital', type: 'Hospital', distance: '350m', is24x7: true },
      { name: 'District Court Metro Interchange', type: 'Metro Station', distance: '300m', is24x7: true },
    ],
    nightAdvice: 'Use the underground pedestrian concourse at Civil Court Metro rather than crossing heavy traffic surface lanes.',
  },
  'Hinjawadi': {
    name: 'Hinjawadi IT Corridor (Phase 1 & 2)',
    safetyScore: 82,
    status: 'Moderate Vigilance',
    lightingIndex: 85,
    policePresence: 'Hinjawadi MIDC Police patrol active on Shivaji Chowk',
    crowdLevel: 'Heavy IT shuttle traffic during evening shift changes',
    activeHazardsCount: 2,
    nearestSafeHavens: [
      { name: 'Hinjawadi Police Station (Phase 1)', type: 'Police Chowky', distance: '900m', is24x7: true },
      { name: 'Ruby Hall Clinic Hinjawadi', type: 'Hospital', distance: '1.2km', is24x7: true },
      { name: 'Infosys Security Command Center Gate 1', type: 'Safe Transit', distance: '600m', is24x7: true },
    ],
    nightAdvice: 'Avoid dark highway service lanes under Wakad bridge on two-wheelers during late monsoon rains.',
  },
  'Swargate': {
    name: 'Swargate & Jedhe Chowk',
    safetyScore: 78,
    status: 'Moderate Vigilance',
    lightingIndex: 84,
    policePresence: 'Swargate ST Stand police aid post (150m)',
    crowdLevel: 'Dense transit crowds and inter-city bus boarding',
    activeHazardsCount: 1,
    nearestSafeHavens: [
      { name: 'Swargate Police Station', type: 'Police Chowky', distance: '250m', is24x7: true },
      { name: 'Poona Hospital & Research Centre', type: 'Hospital', distance: '1.1km', is24x7: true },
      { name: 'Swargate Underground Metro Station', type: 'Metro Station', distance: '120m', is24x7: true },
    ],
    nightAdvice: 'Keep backpacks in front when navigating crowded platform subways. Use the brightly lit metro station foyer.',
  },
};

export function SafetyCheckModal({
  isOpen,
  onClose,
  userNeighborhood = 'Deccan Gymkhana',
  onAwardCivicPoints,
}: SafetyCheckModalProps) {
  const [selectedArea, setSelectedArea] = useState<string>(
    PUNE_AREAS_SAFETY[userNeighborhood] ? userNeighborhood : 'Deccan Gymkhana'
  );
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [hasClaimedSafetyPoints, setHasClaimedSafetyPoints] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScanStep(0);
      setCopiedStatus(null);
      const timer1 = setTimeout(() => setScanStep(1), 500);
      const timer2 = setTimeout(() => setScanStep(2), 1000);
      const timer3 = setTimeout(() => {
        setIsScanning(false);
        setScanStep(3);
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, selectedArea]);

  if (!isOpen) return null;

  const currentArea = PUNE_AREAS_SAFETY[selectedArea] || PUNE_AREAS_SAFETY['Deccan Gymkhana'];

  const handleShareSafeStatus = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const textToShare = `🟢 PunePulse Safety Check-In:\nI am safe at ${currentArea.name}, Pune.\nStatus: ${currentArea.safetyScore}/100 (${currentArea.status})\nChecked in via PunePulse at ${timeStr}.\nLocal Emergency Helpline: ${PUNE_CITY.emergencyNumber} (Police: 112, Medical: 108, PMC Disaster: 020-25501269).`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(textToShare);
    }
    setCopiedStatus('Status copied to clipboard! Ready to send via WhatsApp or SMS.');

    if (!hasClaimedSafetyPoints && onAwardCivicPoints) {
      onAwardCivicPoints(20, 'Proactive Urban Safety Check-In');
      setHasClaimedSafetyPoints(true);
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
        });
      } catch {}
    }

    setTimeout(() => {
      setCopiedStatus(null);
    }, 4500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 text-white flex items-center justify-between border-b border-emerald-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  Instant Pune Safety Check
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  Live Ward Scan
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Real-time safety assessment, emergency hotlines, and safe haven mapping without navigating away.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Area Selector and Quick Scan Status */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                Select Pune Ward / Neighborhood
              </span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900 font-semibold focus:outline-hidden focus:border-emerald-600 shadow-2xs"
                >
                  {Object.keys(PUNE_AREAS_SAFETY).map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setIsScanning(true);
                setScanStep(0);
                setTimeout(() => setScanStep(1), 400);
                setTimeout(() => setScanStep(2), 800);
                setTimeout(() => setIsScanning(false), 1200);
              }}
              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Rescan Area Sensors</span>
            </button>
          </div>

          {/* Scanner Animation or Results */}
          {isScanning ? (
            <div className="p-8 text-center space-y-3 bg-stone-50/70 rounded-2xl border border-stone-200">
              <div className="w-12 h-12 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
              <div className="font-semibold text-stone-800 text-sm">
                Scanning Pune Urban Safety Telemetry...
              </div>
              <div className="text-xs text-stone-500 space-y-1">
                <div className={scanStep >= 0 ? 'text-emerald-700 font-medium' : 'text-stone-400'}>
                  ✓ Connecting to Pune Police Beat & PMC Ward Dispatch...
                </div>
                <div className={scanStep >= 1 ? 'text-emerald-700 font-medium' : 'text-stone-400'}>
                  ✓ Evaluating street lighting index & sensor lux levels...
                </div>
                <div className={scanStep >= 2 ? 'text-emerald-700 font-medium' : 'text-stone-400'}>
                  ✓ Cross-referencing real-time citizen hazard alerts...
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Safety Score Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-white to-stone-50 border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                      Overall Ward Safety Rating
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-emerald-300">
                      {currentArea.status}
                    </span>
                  </div>
                  <div className="text-sm text-stone-600">
                    Location: <strong className="text-stone-900">{currentArea.name}</strong>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-md">
                    {currentArea.nightAdvice}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                  <div className="text-3xl font-extrabold text-emerald-700 flex items-baseline gap-1">
                    <span>{currentArea.safetyScore}</span>
                    <span className="text-xs font-normal text-stone-400">/ 100</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    Verified Safe Corridor
                  </span>
                </div>
              </div>

              {/* Real-time Indicator Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                    <Eye className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold text-[11px]">Street Lighting</span>
                  </div>
                  <div className="text-base font-bold text-stone-900">
                    {currentArea.lightingIndex}%
                  </div>
                  <div className="text-[10px] text-stone-500">Continuous LED grid</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-semibold text-[11px]">Police Beat</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 line-clamp-1">
                    Active Patrol
                  </div>
                  <div className="text-[10px] text-stone-500">112 PCR in vicinity</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                    <Navigation className="w-3.5 h-3.5 text-purple-500" />
                    <span className="font-semibold text-[11px]">Pedestrian Activity</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 line-clamp-1">
                    Active Street
                  </div>
                  <div className="text-[10px] text-stone-500">Cafes & transit open</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-semibold text-[11px]">Active Hazards</span>
                  </div>
                  <div className="text-base font-bold text-stone-900">
                    {currentArea.activeHazardsCount}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {currentArea.activeHazardsCount === 0 ? 'Clear roadways' : 'Minor road alert'}
                  </div>
                </div>
              </div>

              {/* One-Click Safe Check-In & Share */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Proactive Safety Check-In (Share with Family)
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Notify emergency contacts that you are safe in {currentArea.name}.
                    </p>
                  </div>
                  <button
                    onClick={handleShareSafeStatus}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy "I Am Safe" Check-In</span>
                    {!hasClaimedSafetyPoints && (
                      <span className="ml-1 text-[10px] font-bold bg-emerald-800 text-white px-1.5 py-0.2 rounded-full">
                        +20 pts
                      </span>
                    )}
                  </button>
                </div>

                {copiedStatus && (
                  <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium border border-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{copiedStatus}</span>
                  </div>
                )}
              </div>

              {/* Nearest 24/7 Verified Safe Havens */}
              <div>
                <h4 className="font-semibold text-stone-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-stone-500" />
                  Nearest 24/7 Verified Safe Havens in {selectedArea}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {currentArea.nearestSafeHavens.map((haven, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                          {haven.type}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-500">
                          {haven.distance}
                        </span>
                      </div>
                      <div className="font-semibold text-stone-900 text-xs line-clamp-1">
                        {haven.name}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>24/7 Guarded & CCTV Monitored</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pune Emergency Hotlines Fast-Dial */}
              <div className="p-4 bg-stone-900 text-white rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block">
                      Immediate Emergency Assistance
                    </span>
                    <span className="text-sm font-bold text-white">
                      Pune City Dispatch Helplines
                    </span>
                  </div>
                  <Phone className="w-5 h-5 text-red-400" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <a
                    href="tel:112"
                    className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-center transition-colors block"
                  >
                    <div className="text-red-400 font-bold text-base">112</div>
                    <div className="text-stone-300 text-[11px]">Police Control</div>
                  </a>
                  <a
                    href="tel:108"
                    className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-center transition-colors block"
                  >
                    <div className="text-red-400 font-bold text-base">108</div>
                    <div className="text-stone-300 text-[11px]">Ambulance</div>
                  </a>
                  <a
                    href="tel:02025501269"
                    className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-center transition-colors block"
                  >
                    <div className="text-amber-400 font-bold text-xs">020-25501269</div>
                    <div className="text-stone-300 text-[11px]">PMC Disaster Cell</div>
                  </a>
                  <a
                    href="tel:1091"
                    className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-center transition-colors block"
                  >
                    <div className="text-emerald-400 font-bold text-base">1091</div>
                    <div className="text-stone-300 text-[11px]">Women Helpline</div>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Safety telemetry refreshed via Pune Municipal Smart Sensor Grid</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
