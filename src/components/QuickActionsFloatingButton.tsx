import { useState, useEffect, useRef } from 'react';
import {
  Zap,
  X,
  AlertTriangle,
  ShieldCheck,
  Phone,
  User,
  Gamepad2,
  ChevronUp,
  Award,
  Sparkles,
  Radio,
} from 'lucide-react';

interface QuickActionsFloatingButtonProps {
  onOpenReportModal: () => void;
  onTriggerSafetyCheck: () => void;
  onOpenUserProfile: () => void;
  onOpenOfflineGame: () => void;
  userPoints?: number;
}

export function QuickActionsFloatingButton({
  onOpenReportModal,
  onTriggerSafetyCheck,
  onOpenUserProfile,
  onOpenOfflineGame,
  userPoints = 230,
}: QuickActionsFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Actions Menu Popover */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Quick Actions Menu"
          className="mb-3 w-80 max-w-[calc(100vw-3rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xl overflow-hidden p-2.5 space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Menu Title Header */}
          <div className="px-3 py-2 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-xl flex items-center justify-between mb-1.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-400/20 text-amber-400">
                <Zap className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="text-xs font-bold tracking-tight block">Pune Quick Actions</span>
                <span className="text-[10px] text-stone-300">Instant Urban Assist · No Tab Switch</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              {userPoints} pts
            </span>
          </div>

          {/* Action 1: Report Urban Problem (Primary Request) */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onOpenReportModal();
            }}
            className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-stone-900 text-xs group-hover:text-amber-900 transition-colors">
                  Report Urban Issue
                </span>
                <span className="text-[10px] font-extrabold bg-amber-500 text-white px-1.5 py-0.2 rounded-md shadow-2xs">
                  +35 to +60 pts
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-tight mt-0.5">
                Submit pothole, waterlogging, or traffic jam instantly.
              </p>
            </div>
          </button>

          {/* Action 2: Trigger Instant Safety Check (Primary Request) */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onTriggerSafetyCheck();
            }}
            className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/80 transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-stone-900 text-xs group-hover:text-emerald-900 transition-colors">
                  Trigger Safety Check
                </span>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-md shadow-2xs flex items-center gap-0.5">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  Live Scan
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-tight mt-0.5">
                Scan street lighting, police presence & share "I'm Safe" status.
              </p>
            </div>
          </button>

          {/* Action 3: Punekar Profile & Points Window */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onOpenUserProfile();
            }}
            className="w-full p-2 rounded-xl text-left flex items-center gap-3 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-stone-900 text-xs">Punekar Identity Portal</div>
              <div className="text-[11px] text-stone-500">Points breakdown, badge rank & ID card</div>
            </div>
          </button>

          {/* Action 4: Offline Rickshaw Patrol */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onOpenOfflineGame();
            }}
            className="w-full p-2 rounded-xl text-left flex items-center gap-3 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-stone-900 text-xs">Pune Rickshaw Patrol</div>
              <div className="text-[11px] text-stone-500">Play offline arcade & bank civic points</div>
            </div>
          </button>

          {/* Fast Emergency Numbers Bar */}
          <div className="pt-2 mt-1 border-t border-stone-200/80 px-2 flex items-center justify-between text-[11px] text-stone-600">
            <span className="font-medium text-stone-500">Fast Helplines:</span>
            <div className="flex items-center gap-2">
              <a
                href="tel:112"
                className="font-bold text-red-600 hover:text-red-700 underline"
                title="Call 112 Police"
              >
                112 Police
              </a>
              <span>·</span>
              <a
                href="tel:108"
                className="font-bold text-red-600 hover:text-red-700 underline"
                title="Call 108 Ambulance"
              >
                108 Medical
              </a>
              <span>·</span>
              <a
                href="tel:02025501269"
                className="font-medium text-stone-700 hover:underline"
                title="Call PMC Disaster Cell"
              >
                PMC Cell
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title="Open Quick Actions (Report Issue / Safety Check)"
        className={`group relative flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold text-xs tracking-wide shadow-xl transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-stone-900 hover:bg-stone-800 ring-2 ring-stone-900/40 ring-offset-2'
            : 'bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 hover:from-black hover:via-amber-900 hover:to-black hover:scale-105 active:scale-95 shadow-stone-900/30 ring-2 ring-amber-500/40 ring-offset-1'
        }`}
      >
        {/* Pulse beacon dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>

        {/* Icon & Label */}
        {isOpen ? (
          <>
            <X className="w-4 h-4 text-white" />
            <span>Close Actions</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400/40 group-hover:rotate-12 transition-transform" />
            <span>Quick Actions</span>
            <span className="ml-1 text-[10px] font-bold bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded-full">
              New
            </span>
          </>
        )}
      </button>
    </div>
  );
}
