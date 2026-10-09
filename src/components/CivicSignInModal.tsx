import { useState } from 'react';
import { X, User, MapPin, Mail, Phone, Award, ShieldCheck, CheckCircle2, LogOut } from 'lucide-react';
import { CivicUserProfile } from '../types';
import confetti from 'canvas-confetti';

interface CivicSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CivicUserProfile | null;
  onSignIn: (user: CivicUserProfile) => void;
  onSignOut: () => void;
}

const PUNE_NEIGHBORHOODS_LIST = [
  'Kothrud',
  'Deccan Gymkhana',
  'Koregaon Park (KP)',
  'Shivajinagar',
  'Camp (Cantonment)',
  'Viman Nagar',
  'Hinjawadi',
  'Aundh',
  'Baner',
  'Sadashiv Peth',
  'Kasba Peth',
  'Hadapsar',
  'Wakad',
  'Bavdhan',
  'Karve Nagar'
];

export function CivicSignInModal({
  isOpen,
  onClose,
  currentUser,
  onSignIn,
  onSignOut,
}: CivicSignInModalProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood || 'Deccan Gymkhana');
  const [emailOrPhone, setEmailOrPhone] = useState(currentUser?.emailOrPhone || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isNew = !currentUser;
    const initialPoints = currentUser ? currentUser.points : 170; // 120 base + 50 welcome bonus!

    const userProfile: CivicUserProfile = {
      id: currentUser?.id || `punekar-${Date.now()}`,
      name: name.trim(),
      neighborhood,
      emailOrPhone: emailOrPhone.trim() || 'punekar@pune.gov.in',
      points: initialPoints,
      reportsSubmitted: currentUser ? currentUser.reportsSubmitted : 2,
      upvotesGiven: currentUser ? currentUser.upvotesGiven : 5,
      level: initialPoints >= 250 ? 'Civic Guardian' : 'Active Punekar',
      joinedDate: currentUser ? currentUser.joinedDate : 'October 2026',
      avatarColor: currentUser?.avatarColor || '#7c3aed',
    };

    onSignIn(userProfile);
    onClose();

    if (isNew) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <h2 className="text-base font-bold">
                {currentUser ? 'Your Punekar Civic Profile' : 'Sign In as a Pune Citizen'}
              </h2>
              <p className="text-[11px] text-stone-300">
                Track civic karma, report problems, and rank on the city leaderboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {currentUser ? (
          <div className="p-6 space-y-5 text-xs text-stone-700">
            {/* User Stats Card */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                    Civic Level
                  </div>
                  <div className="text-base font-bold text-amber-950 mt-0.5">
                    {currentUser.level} ⭐
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                    Total Points
                  </div>
                  <div className="text-xl font-extrabold text-stone-900">
                    {currentUser.points} pts
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-stone-600">
                <span>Neighborhood: <strong>{currentUser.neighborhood}</strong></span>
                <span>Reports: <strong>{currentUser.reportsSubmitted}</strong></span>
                <span>Verified: <strong>{currentUser.upvotesGiven}</strong></span>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="space-y-2">
              <div className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider">
                Earn More Civic Points
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                  <div className="font-bold text-stone-900">+50 Points</div>
                  <div className="text-stone-500 mt-0.5">Report any road hazard, waterlogging, or gem</div>
                </div>
                <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                  <div className="font-bold text-stone-900">+10 Points</div>
                  <div className="text-stone-500 mt-0.5">Verify another citizen's reported issue</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-purple-700 shrink-0" />
              <div className="text-[11px]">
                <strong>Welcome Civic Bonus:</strong> Earn +50 instant Civic Points upon signing in!
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name / Punekar Handle
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Deshmukh or Aditi Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                />
              </div>
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Primary Neighborhood in Pune
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                >
                  {PUNE_NEIGHBORHOODS_LIST.map((nh) => (
                    <option key={nh} value={nh}>
                      {nh}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. 98220XXXXX or punekar@example.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-stone-500 hover:text-stone-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors shadow-xs"
              >
                Sign In & Collect +50 Pts
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
