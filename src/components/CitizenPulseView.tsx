import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Sparkles,
  Navigation,
  CloudRain,
  ThumbsUp,
  Plus,
  Camera,
  Mic,
  CheckCircle2,
  X,
  MessageSquare,
  Volume2,
  Trophy,
  Award,
  Zap,
  TrendingUp,
  User,
} from 'lucide-react';
import { CitizenReport, City, CivicLeaderboardEntry, CivicUserStats } from '../types';
import confetti from 'canvas-confetti';

interface CitizenPulseViewProps {
  city: City;
  reports: CitizenReport[];
  onUpvoteReport: (id: string) => void;
  onSubmitReport: (report: Omit<CitizenReport, 'id' | 'upvotes' | 'timestamp' | 'status'>, awardedPoints?: number) => void;
  onOpenUserWindow?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenReportModal?: () => void;
}

export function CitizenPulseView({
  city,
  reports,
  onUpvoteReport,
  onSubmitReport,
  onOpenUserWindow,
  onOpenLeaderboard,
  onOpenReportModal,
}: CitizenPulseViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'hazard' | 'gem' | 'traffic' | 'weather'>('all');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointsToast, setPointsToast] = useState<string | null>(null);

  // Civic Points & Stats State (persisted in localStorage)
  const [userStats, setUserStats] = useState<CivicUserStats>(() => {
    try {
      const saved = localStorage.getItem('pune_civic_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      points: 120,
      reportsSubmitted: 2,
      upvotesGiven: 4,
      level: 'Active Punekar',
      rank: 4,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('pune_civic_stats', JSON.stringify(userStats));
    } catch {}
  }, [userStats]);

  // Compute Level based on Points
  const getLevel = (pts: number) => {
    if (pts >= 500) return 'Pune Urban Hero';
    if (pts >= 250) return 'Civic Guardian';
    if (pts >= 100) return 'Active Punekar';
    return 'Street Observer';
  };

  // Base Leaderboard Seed Data
  const baseLeaderboard: CivicLeaderboardEntry[] = [
    { rank: 1, name: 'Tanvi Joshi', neighborhood: 'Kothrud', points: 420, reportsCount: 9, badge: 'Pune Urban Hero 🥇' },
    { rank: 2, name: 'Rohan Deshmukh', neighborhood: 'Deccan Gymkhana', points: 340, reportsCount: 7, badge: 'Civic Guardian 🥈' },
    { rank: 3, name: 'Aditi Sharma', neighborhood: 'Koregaon Park', points: 280, reportsCount: 6, badge: 'Civic Guardian 🥉' },
    { rank: 4, name: 'You (Active Contributor)', neighborhood: 'Pune Central', points: userStats.points, reportsCount: userStats.reportsSubmitted, badge: `${userStats.level} ⭐`, isCurrentUser: true },
    { rank: 5, name: 'Nikhil Patil', neighborhood: 'Shivajinagar', points: 150, reportsCount: 3, badge: 'Active Punekar' },
    { rank: 6, name: 'Sneha Kulkarni', neighborhood: 'Viman Nagar', points: 110, reportsCount: 2, badge: 'Active Punekar' },
    { rank: 7, name: 'Amit Verma', neighborhood: 'Hinjawadi', points: 80, reportsCount: 1, badge: 'Street Observer' },
  ];

  // Dynamically sort leaderboard based on points
  const sortedLeaderboard = [...baseLeaderboard]
    .map((entry) => (entry.isCurrentUser ? { ...entry, points: userStats.points, badge: `${getLevel(userStats.points)} ⭐` } : entry))
    .sort((a, b) => b.points - a.points)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const currentRank = sortedLeaderboard.find((e) => e.isCurrentUser)?.rank || 4;

  // New report form state
  const [formCategory, setFormCategory] = useState<'hazard' | 'gem' | 'traffic' | 'weather'>('hazard');
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSeverity, setFormSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [formPhoto, setFormPhoto] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const filteredReports = reports.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.category === activeFilter;
  });

  const triggerPointsToast = (msg: string) => {
    setPointsToast(msg);
    setTimeout(() => setPointsToast(null), 4000);
  };

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

  const handleUpvoteWithPoints = (id: string) => {
    onUpvoteReport(id);

    // Award +10 points for verifying/upvoting
    const newPts = userStats.points + 10;
    setUserStats((prev) => ({
      ...prev,
      points: newPts,
      upvotesGiven: prev.upvotesGiven + 1,
      level: getLevel(newPts),
    }));

    triggerPointsToast('+10 Civic Points for verifying an urban alert!');
  };

  const calculateReportPoints = (category: string, severity: string): number => {
    if (category === 'gem') return 45;
    if (severity === 'High') return 60;
    if (severity === 'Medium') return 50;
    return 35;
  };

  const currentAwardPoints = calculateReportPoints(formCategory, formSeverity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const awardedPts = calculateReportPoints(formCategory, formSeverity);

    onSubmitReport(
      {
        city: city.name,
        category: formCategory,
        title: formTitle.trim(),
        description: formDescription.trim(),
        locationName: formLocation.trim() || `${city.name} Central`,
        coordinates: city.center,
        severity: formSeverity,
        photoUrl: formPhoto,
      },
      awardedPts
    );

    // Award dynamic points based on the problem reported!
    const newPts = userStats.points + awardedPts;
    setUserStats((prev) => ({
      ...prev,
      points: newPts,
      reportsSubmitted: prev.reportsSubmitted + 1,
      level: getLevel(newPts),
    }));

    triggerPointsToast(`🎉 +${awardedPts} Civic Points Earned for ${formSeverity} severity report! Helps keep Pune safe.`);

    // Reset and close
    setFormTitle('');
    setFormLocation('');
    setFormDescription('');
    setFormPhoto(null);
    setHasVoiceNote(false);
    setIsModalOpen(false);

    try {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Subtle Toast for Earned Points */}
      {pointsToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-stone-700 animate-slide-up text-xs font-semibold">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{pointsToast}</span>
          <button
            onClick={() => setPointsToast(null)}
            className="text-stone-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Crowdsourced Urban Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>{city.name}</span>
            <span aria-hidden="true">·</span>
            <span>Civic Contribution Network</span>
          </div>
          <h2 className="text-lg font-semibold text-stone-900">
            Citizen Pulse & Community Reports
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Report road hazards, waterlogging, broken streetlights, or share hidden food gems to earn civic karma.
          </p>
        </div>

        {/* Action Buttons: Add Problem, My Profile, Toggle Ranks */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onOpenUserWindow && (
            <button
              onClick={onOpenUserWindow}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>My Punekar Profile ({userStats.points} pts)</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenLeaderboard) {
                onOpenLeaderboard();
              } else {
                setShowLeaderboard(!showLeaderboard);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              showLeaderboard
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Civic Ranks</span>
          </button>

          <button
            onClick={() => {
              if (onOpenReportModal) {
                onOpenReportModal();
              } else {
                setIsModalOpen(true);
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report a Problem (+50 pts)</span>
          </button>
        </div>
      </div>

      {/* Simple Unobtrusive Gamification Summary Card */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 font-bold text-sm">
            #{currentRank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 text-sm">
                Your Civic Score: {userStats.points} Points
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {getLevel(userStats.points)}
              </span>
            </div>
            <p className="text-stone-500 text-[11px] mt-0.5">
              Ranked #{currentRank} among Pune contributors · {userStats.reportsSubmitted} problems reported · {userStats.upvotesGiven} alerts verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-stone-500 text-xs sm:self-center">
          <span className="flex items-center gap-1 text-stone-600">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>+50 pts per report</span>
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="flex items-center gap-1 text-stone-600">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
            <span>+10 pts per verify</span>
          </span>
        </div>
      </div>

      {/* Optional Subtle Leaderboard Drawer / Section */}
      {showLeaderboard && (
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-stone-900 text-sm">
                Pune Citizen Contributor Leaderboard
              </h3>
            </div>
            <span className="text-[11px] text-stone-500">
              Community points reset monthly
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Rank</th>
                  <th className="py-2.5 px-3 font-semibold">Citizen Contributor</th>
                  <th className="py-2.5 px-3 font-semibold">Neighborhood</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Problems Reported</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Civic Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedLeaderboard.map((user) => (
                  <tr
                    key={user.name}
                    className={user.isCurrentUser ? 'bg-amber-50/70 font-semibold text-amber-950' : 'hover:bg-stone-50 text-stone-700'}
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-bold">
                        {user.rank === 1 ? '🥇 #1' : user.rank === 2 ? '🥈 #2' : user.rank === 3 ? '🥉 #3' : `#${user.rank}`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {user.isCurrentUser && (
                          <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-sm font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-500">{user.neighborhood}</td>
                    <td className="py-2.5 px-3 text-right">{user.reportsCount}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                      {user.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-medium text-stone-600 overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
          }`}
        >
          All Updates ({reports.length})
        </button>
        <button
          onClick={() => setActiveFilter('hazard')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeFilter === 'hazard' ? 'bg-white text-red-700 shadow-xs font-semibold' : 'hover:text-stone-900'
          }`}
        >
          ⚠️ Safety & Road Hazards
        </button>
        <button
          onClick={() => setActiveFilter('traffic')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeFilter === 'traffic' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'hover:text-stone-900'
          }`}
        >
          🚦 Traffic Snarls
        </button>
        <button
          onClick={() => setActiveFilter('weather')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeFilter === 'weather' ? 'bg-white text-sky-700 shadow-xs font-semibold' : 'hover:text-stone-900'
          }`}
        >
          🌧️ Monsoon & Weather
        </button>
        <button
          onClick={() => setActiveFilter('gem')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            activeFilter === 'gem' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'hover:text-stone-900'
          }`}
        >
          ✨ Community Gems
        </button>
      </div>

      {/* Reports Grid */}
      <div className="space-y-3.5">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
            No citizen reports found for this filter in {city.name}. Be the first to report and earn +50 civic points!
          </div>
        ) : (
          filteredReports.map((report) => {
            const isHazard = report.category === 'hazard';
            const isTraffic = report.category === 'traffic';
            const isWeather = report.category === 'weather';
            const isGem = report.category === 'gem';

            return (
              <div
                key={report.id}
                className={`p-4 bg-white rounded-xl border transition-all ${
                  isHazard
                    ? 'border-red-200/90 hover:border-red-300'
                    : isTraffic
                    ? 'border-amber-200/90 hover:border-amber-300'
                    : isWeather
                    ? 'border-sky-200/90 hover:border-sky-300'
                    : 'border-emerald-200/90 hover:border-emerald-300'
                } shadow-xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-medium text-stone-700">
                        {isHazard ? '⚠️ Safety Hazard' : isTraffic ? '🚦 Traffic Advisory' : isWeather ? '🌧️ Weather Alert' : '✨ Hidden Gem'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{report.locationName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span className={report.severity === 'High' ? 'text-red-600 font-semibold' : 'text-stone-500'}>
                        {report.severity} Priority
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-stone-900 leading-snug">
                      {report.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="pt-2 flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{report.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Upvote & Earn Points Button */}
                  <div className="shrink-0 flex items-center sm:flex-col gap-2">
                    <button
                      onClick={() => handleUpvoteWithPoints(report.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
                      title="Confirm this alert and earn +10 Civic Points"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-stone-500" />
                      <span>{report.upvotes}</span>
                      <span className="text-[11px] font-normal text-stone-400 hidden sm:inline">Confirm (+10 pts)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-stone-900">
                    Submit Real-Time Citizen Report
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    +{currentAwardPoints} Civic Points for {formSeverity} Severity
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Help fellow Punekars navigate traffic, avoid dark streets, or find great food.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Report Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormCategory('hazard')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      formCategory === 'hazard'
                        ? 'bg-red-50 border-red-300 text-red-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    ⚠️ Safety Hazard
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormCategory('traffic')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      formCategory === 'traffic'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    🚦 Traffic Jam
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormCategory('weather')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      formCategory === 'weather'
                        ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    🌧️ Rain / Water
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormCategory('gem')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      formCategory === 'gem'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    ✨ Hidden Gem
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterlogging near Alka Talkies Chowk"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Specific Street / Chowk / Area
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sambhaji Bridge, Deccan, Pune"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Details & Street Advice
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what's happening and how others can avoid danger or enjoy the spot..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-400"
                />
              </div>

              {/* Severity & Media Attachments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Urgency / Severity
                  </label>
                  <select
                    value={formSeverity}
                    onChange={(e: any) => setFormSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:border-stone-400"
                  >
                    <option value="Low">Low - Informational / Gem</option>
                    <option value="Medium">Medium - Delays / Dim Lighting</option>
                    <option value="High">High - Severe Hazard / Gridlock</option>
                  </select>
                </div>

                {/* Voice Note Simulation */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Voice Memo Note
                  </label>
                  <button
                    type="button"
                    onClick={handleStartVoiceRecording}
                    className={`w-full py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
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
                        ? '✓ Voice Memo Attached (6s)'
                        : 'Record 6s Voice Memo'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Publish Report & Collect +{currentAwardPoints} pts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
