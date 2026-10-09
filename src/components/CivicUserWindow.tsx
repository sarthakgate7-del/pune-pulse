import { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Mail,
  Phone,
  Award,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  Trophy,
  AlertTriangle,
  Sparkles,
  Flame,
  Calendar,
  Gamepad2,
  Plus,
  TrendingUp,
  FileText,
  ThumbsUp,
  Clock,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { CivicUserProfile, UserReportHistoryItem } from '../types';
import { OfflinePuneGame } from './OfflinePuneGame';
import confetti from 'canvas-confetti';

interface CivicUserWindowProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CivicUserProfile | null;
  onSignIn: (user: CivicUserProfile) => void;
  onSignOut: () => void;
  onOpenReportModal: () => void;
  onOpenLeaderboard: () => void;
  onAwardCivicPoints: (points: number, reason: string) => void;
  isOfflineMode?: boolean;
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
  'Karve Nagar',
];

export function CivicUserWindow({
  isOpen,
  onClose,
  currentUser,
  onSignIn,
  onSignOut,
  onOpenReportModal,
  onOpenLeaderboard,
  onAwardCivicPoints,
  isOfflineMode = false,
}: CivicUserWindowProps) {
  const [activeWindowTab, setActiveWindowTab] = useState<'profile' | 'reports' | 'game' | 'edit'>('profile');
  const [isMaximized, setIsMaximized] = useState(false);

  // Edit / Sign In form states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editNeighborhood, setEditNeighborhood] = useState(currentUser?.neighborhood || 'Deccan Gymkhana');
  const [editPhoneEmail, setEditPhoneEmail] = useState(currentUser?.emailOrPhone || '');

  if (!isOpen) return null;

  // Default fallback user if not signed in yet
  const user = currentUser || {
    id: 'punekar-guest',
    citizenId: 'PUN-2026-8492',
    name: 'You (Citizen Contributor)',
    neighborhood: 'Deccan Gymkhana',
    emailOrPhone: 'punekar@pune.gov.in',
    points: 170,
    reportsSubmitted: 3,
    upvotesGiven: 6,
    level: 'Active Punekar',
    joinedDate: 'October 2026',
    avatarColor: '#d97706',
    reportedProblems: [
      {
        id: 'rep-hist-1',
        title: 'Deep Waterlogged Pothole near Paud Road Flyover',
        category: 'hazard',
        severity: 'High',
        locationName: 'Paud Road, Kothrud',
        pointsEarned: 60,
        timestamp: 'Yesterday at 4:30 PM',
        status: 'Verified by PMC Ward Cell',
      },
      {
        id: 'rep-hist-2',
        title: 'Traffic Signal Sensor Malfunction at Deccan Goodluck Chowk',
        category: 'traffic',
        severity: 'Medium',
        locationName: 'FC Road / Deccan',
        pointsEarned: 50,
        timestamp: '3 days ago',
        status: 'Resolved & Repaired',
      },
      {
        id: 'rep-hist-3',
        title: 'Hidden 80-year-old Pithla Bhakri Stall in Kasba Peth',
        category: 'gem',
        severity: 'Low',
        locationName: 'Kasba Peth Ganpati lane',
        pointsEarned: 45,
        timestamp: '1 week ago',
        status: 'Verified by Citizen Network',
      },
    ],
  };

  const reportedProblemsList: UserReportHistoryItem[] = user.reportedProblems || [
    {
      id: 'rep-hist-1',
      title: 'Deep Waterlogged Pothole near Paud Road Flyover',
      category: 'hazard',
      severity: 'High',
      locationName: 'Paud Road, Kothrud',
      pointsEarned: 60,
      timestamp: 'Yesterday at 4:30 PM',
      status: 'Verified by PMC Ward Cell',
    },
    {
      id: 'rep-hist-2',
      title: 'Traffic Signal Sensor Malfunction at Deccan Goodluck Chowk',
      category: 'traffic',
      severity: 'Medium',
      locationName: 'FC Road / Deccan',
      pointsEarned: 50,
      timestamp: '3 days ago',
      status: 'Resolved & Repaired',
    },
    {
      id: 'rep-hist-3',
      title: 'Hidden 80-year-old Pithla Bhakri Stall in Kasba Peth',
      category: 'gem',
      severity: 'Low',
      locationName: 'Kasba Peth Ganpati lane',
      pointsEarned: 45,
      timestamp: '1 week ago',
      status: 'Verified by Citizen Network',
    },
  ];

  const totalPointsFromReports = reportedProblemsList.reduce((acc, curr) => acc + curr.pointsEarned, 0);

  // Level progression
  const nextLevelThreshold = user.points >= 500 ? 1000 : user.points >= 250 ? 500 : user.points >= 100 ? 250 : 100;
  const prevLevelThreshold = user.points >= 500 ? 500 : user.points >= 250 ? 250 : user.points >= 100 ? 100 : 0;
  const progressPercent = Math.min(
    100,
    Math.max(10, Math.round(((user.points - prevLevelThreshold) / (nextLevelThreshold - prevLevelThreshold)) * 100))
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const isNew = !currentUser;
    const initialPoints = currentUser ? currentUser.points : 170;

    const updatedProfile: CivicUserProfile = {
      id: currentUser?.id || `punekar-${Date.now()}`,
      citizenId: currentUser?.citizenId || `PUN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: editName.trim(),
      neighborhood: editNeighborhood,
      emailOrPhone: editPhoneEmail.trim() || 'punekar@pune.gov.in',
      points: initialPoints,
      reportsSubmitted: currentUser ? currentUser.reportsSubmitted : 3,
      upvotesGiven: currentUser ? currentUser.upvotesGiven : 6,
      level: initialPoints >= 500 ? 'Pune Urban Hero' : initialPoints >= 250 ? 'Civic Guardian' : 'Active Punekar',
      joinedDate: currentUser ? currentUser.joinedDate : 'October 2026',
      avatarColor: currentUser?.avatarColor || '#d97706',
      reportedProblems: currentUser?.reportedProblems || reportedProblemsList,
    };

    onSignIn(updatedProfile);
    setActiveWindowTab('profile');

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

  const handlePopOutWindow = () => {
    // Open a neat dedicated pop-out window with window.open
    const popoutUrl = `${window.location.origin}${window.location.pathname}?view=user-portal#user-window`;
    const popout = window.open(
      popoutUrl,
      'PuneCitizenWindow',
      'width=880,height=750,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
    );
    if (popout) {
      popout.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in">
      {/* Window Frame Container */}
      <div
        className={`bg-white rounded-2xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isMaximized ? 'w-full h-full max-w-full max-h-full rounded-none' : 'w-full max-w-3xl max-h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Title Bar */}
        <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800 select-none">
          {/* Left: Window Identity */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shadow-xs">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm tracking-tight">
                  Pune Citizen Portal · Punekar Profile
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-sm font-mono">
                  {user.citizenId || 'PUN-2026-8492'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Window Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePopOutWindow}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              title="Pop out into separate browser window"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              title={isMaximized ? 'Restore window size' : 'Maximize window'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
              title="Close window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Window Navigation Sub-Tabs */}
        <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between gap-2 overflow-x-auto text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveWindowTab('profile')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeWindowTab === 'profile'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen Profile & Score</span>
            </button>

            <button
              onClick={() => setActiveWindowTab('reports')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeWindowTab === 'reports'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Reported Problems & Points ({reportedProblemsList.length})</span>
            </button>

            <button
              onClick={() => setActiveWindowTab('game')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeWindowTab === 'game'
                  ? 'bg-white text-purple-900 shadow-2xs font-bold border border-purple-200'
                  : 'text-purple-700 hover:bg-purple-100/60'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Offline Game: Rickshaw Patrol 🛺</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditName(user.name);
              setEditNeighborhood(user.neighborhood);
              setEditPhoneEmail(user.emailOrPhone);
              setActiveWindowTab('edit');
            }}
            className="px-2.5 py-1 text-stone-500 hover:text-stone-900 text-xs flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden sm:inline">Edit Details</span>
          </button>
        </div>

        {/* Window Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-stone-800 text-xs">
          {/* ================= TAB 1: PROFILE & STATS ================= */}
          {activeWindowTab === 'profile' && (
            <div className="space-y-5">
              {/* Top Punekar Civic Identity Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-64 bg-amber-500/10 -skew-x-12 transform translate-x-16 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Avatar & Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg border-2 border-white/20 shrink-0"
                      style={{ backgroundColor: user.avatarColor || '#d97706' }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
                        <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full uppercase">
                          {user.level} ⭐
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-stone-300 text-xs mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <strong>{user.neighborhood}</strong>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          {user.emailOrPhone}
                        </span>
                        <span>·</span>
                        <span className="text-stone-400">Joined: {user.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Civic Points Badge */}
                  <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                      Total Civic Points
                    </div>
                    <div className="text-2xl font-black text-white mt-0.5">
                      {user.points} <span className="text-sm font-semibold text-stone-300">pts</span>
                    </div>
                    <div className="text-[10px] text-stone-300 mt-0.5">
                      Ranked <strong>#4 City-Wide</strong>
                    </div>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 text-stone-300">
                    <span>
                      Civic Rank Progress: <strong>{user.level}</strong>
                    </span>
                    <span>
                      {user.points} / {nextLevelThreshold} pts ({nextLevelThreshold - user.points} pts to next rank)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Key Stats Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-[11px] font-semibold">Problems Reported</span>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl font-bold text-stone-900 mt-1">
                    {reportedProblemsList.length}
                  </div>
                  <div className="text-[10px] text-amber-800 mt-0.5 font-medium">
                    +{totalPointsFromReports} Civic Points earned
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-[11px] font-semibold">Issues Verified</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-bold text-stone-900 mt-1">{user.upvotesGiven}</div>
                  <div className="text-[10px] text-emerald-800 mt-0.5 font-medium">
                    +{user.upvotesGiven * 10} pts from community audits
                  </div>
                </div>

                <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-[11px] font-semibold">City Standings</span>
                    <Trophy className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-xl font-bold text-stone-900 mt-1">#4 in Pune</div>
                  <button
                    onClick={onOpenLeaderboard}
                    className="text-[10px] text-purple-700 hover:text-purple-900 mt-0.5 font-bold underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View Pune Leaderboard Window</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Civic Points System Formula Card */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-xs">How Civic Points are Awarded</h4>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">Pune Municipal Corporation System</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-red-200">
                    <div className="font-bold text-red-600">+60 Points</div>
                    <div className="font-semibold text-stone-800 mt-0.5">High Severity Hazard</div>
                    <div className="text-stone-500 text-[10px]">Deep potholes, open manholes, waterlogging</div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                    <div className="font-bold text-amber-600">+50 Points</div>
                    <div className="font-semibold text-stone-800 mt-0.5">Medium Severity Alert</div>
                    <div className="text-stone-500 text-[10px]">Signal fault, traffic jam, fallen branches</div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <div className="font-bold text-emerald-600">+45 Points</div>
                    <div className="font-semibold text-stone-800 mt-0.5">Local Heritage & Gem</div>
                    <div className="text-stone-500 text-[10px]">Hidden eateries, heritage wada discoveries</div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-blue-200">
                    <div className="font-bold text-blue-600">+10 Points</div>
                    <div className="font-semibold text-stone-800 mt-0.5">Citizen Verification</div>
                    <div className="text-stone-500 text-[10px]">Upvoting and verifying fellow reports</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReportModal();
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Report a New Problem (+50-60 pts)</span>
                  </button>

                  <button
                    onClick={() => setActiveWindowTab('game')}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Play Rickshaw Game</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="text-stone-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: REPORTED PROBLEMS & POINTS HISTORY ================= */}
          {activeWindowTab === 'reports' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">
                    Your Reported Problems & Earned Points
                  </h4>
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    Every verified report earns Civic Karma based on severity. PMC monitors these entries.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Report Another Problem</span>
                </button>
              </div>

              {/* List of User's Reported Problems */}
              <div className="space-y-2.5">
                {reportedProblemsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5 ${
                            item.severity === 'High'
                              ? 'bg-red-600'
                              : item.category === 'gem'
                              ? 'bg-purple-600'
                              : 'bg-amber-600'
                          }`}
                        >
                          {item.severity === 'High' ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : item.category === 'gem' ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-stone-900 text-xs sm:text-sm">{item.title}</h5>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.severity === 'High'
                                  ? 'bg-red-100 text-red-800'
                                  : item.severity === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {item.severity} Severity
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              {item.locationName}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {item.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Earned Point Badge */}
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold rounded-lg text-xs border border-emerald-200">
                          +{item.pointsEarned} pts
                        </span>
                        <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{item.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: OFFLINE GAME ================= */}
          {activeWindowTab === 'game' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs text-purple-900">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-700" />
                  <span>
                    <strong>Offline Mini-Game:</strong> No internet needed! Dodge Paud Road potholes & earn bonus Civic Karma.
                  </span>
                </div>
                <span className="font-bold bg-purple-200/80 px-2 py-0.5 rounded-md text-[10px]">
                  Scores Bank to Profile
                </span>
              </div>

              {/* Playable Offline Game Instance */}
              <OfflinePuneGame
                isOfflineMode={isOfflineMode}
                onAwardCivicPoints={(pts, reason) => {
                  onAwardCivicPoints(pts, reason);
                }}
              />
            </div>
          )}

          {/* ================= TAB 4: EDIT PROFILE ================= */}
          {activeWindowTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg mx-auto py-2">
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-stone-700 text-xs">
                Update your Pune resident profile to personalize your reports and neighborhood standing.
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1 text-xs">
                  Full Name / Punekar Handle
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Rohan Deshmukh or Aditi Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1 text-xs">
                  Your Primary Pune Neighborhood
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <select
                    value={editNeighborhood}
                    onChange={(e) => setEditNeighborhood(e.target.value)}
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

              <div>
                <label className="block font-semibold text-stone-800 mb-1 text-xs">
                  Mobile Number / Email (for PMC alerts)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={editPhoneEmail}
                    onChange={(e) => setEditPhoneEmail(e.target.value)}
                    placeholder="e.g. 98220XXXXX or punekar@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveWindowTab('profile')}
                  className="px-3 py-2 text-stone-500 hover:text-stone-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Window Footer Status Bar */}
        <div className="px-4 py-2.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Punekar Citizen ID: <strong>{user.citizenId || 'PUN-2026-8492'}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLeaderboard}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              Open Pune Leaderboard
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-md font-semibold transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
