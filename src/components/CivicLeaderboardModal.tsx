import { useState } from 'react';
import {
  X,
  Trophy,
  Award,
  TrendingUp,
  Medal,
  MapPin,
  User,
  Plus,
  ShieldCheck,
  Zap,
  Sparkles,
  Maximize2,
  Minimize2,
  ExternalLink,
} from 'lucide-react';
import { CivicUserProfile, CivicLeaderboardEntry } from '../types';

interface CivicLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CivicUserProfile | null;
  onOpenReportModal: () => void;
  onOpenSignInModal: () => void;
}

export function CivicLeaderboardModal({
  isOpen,
  onClose,
  currentUser,
  onOpenReportModal,
  onOpenSignInModal,
}: CivicLeaderboardModalProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const userPoints = currentUser?.points || 120;
  const userReports = currentUser?.reportsSubmitted || 2;
  const userName = currentUser?.name || 'You (Citizen Contributor)';
  const userNeighborhood = currentUser?.neighborhood || 'Pune Central';

  const baseLeaderboard: CivicLeaderboardEntry[] = [
    { rank: 1, name: 'Tanvi Joshi', neighborhood: 'Kothrud', points: 420, reportsCount: 9, badge: 'Pune Urban Hero 🥇' },
    { rank: 2, name: 'Rohan Deshmukh', neighborhood: 'Deccan Gymkhana', points: 340, reportsCount: 7, badge: 'Civic Guardian 🥈' },
    { rank: 3, name: 'Aditi Sharma', neighborhood: 'Koregaon Park (KP)', points: 280, reportsCount: 6, badge: 'Civic Guardian 🥉' },
    { rank: 4, name: userName, neighborhood: userNeighborhood, points: userPoints, reportsCount: userReports, badge: userPoints >= 250 ? 'Civic Guardian ⭐' : 'Active Punekar ⭐', isCurrentUser: true },
    { rank: 5, name: 'Nikhil Patil', neighborhood: 'Shivajinagar', points: 190, reportsCount: 4, badge: 'Active Punekar' },
    { rank: 6, name: 'Sneha Kulkarni', neighborhood: 'Viman Nagar', points: 150, reportsCount: 3, badge: 'Active Punekar' },
    { rank: 7, name: 'Amit Verma', neighborhood: 'Hinjawadi', points: 110, reportsCount: 2, badge: 'Active Punekar' },
    { rank: 8, name: 'Vikram Shinde', neighborhood: 'Aundh', points: 80, reportsCount: 1, badge: 'Street Observer' },
    { rank: 9, name: 'Pooja Nair', neighborhood: 'Camp (Cantonment)', points: 60, reportsCount: 1, badge: 'Street Observer' },
  ];

  // Dynamically sort strictly by Civic Points
  const sortedOverall = [...baseLeaderboard]
    .map((e) => (e.isCurrentUser ? { ...e, name: userName, points: userPoints, neighborhood: userNeighborhood, reportsCount: userReports } : e))
    .sort((a, b) => b.points - a.points)
    .map((e, idx) => ({ ...e, rank: idx + 1 }));

  const filteredLeaderboard = sortedOverall.filter((entry) => {
    if (selectedNeighborhood === 'all') return true;
    return entry.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
  });

  const currentUserEntry = sortedOverall.find((e) => e.isCurrentUser);

  const handlePopOut = () => {
    const popoutUrl = `${window.location.origin}${window.location.pathname}?view=leaderboard#leaderboard-window`;
    const popout = window.open(
      popoutUrl,
      'PuneLeaderboardWindow',
      'width=880,height=750,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
    );
    if (popout) popout.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className={`bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          isMaximized ? 'w-full h-full max-w-full max-h-full rounded-none' : 'w-full max-w-2xl max-h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Pune Citizen Rankings & Leaderboard</h2>
                <span className="text-[10px] font-bold bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full uppercase">
                  Civic Karma
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Citizens ranked on verified problem reports, waterlogging alerts, and street verifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePopOut}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-700/60 transition-colors cursor-pointer"
              title="Pop out into separate window"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-700/60 transition-colors cursor-pointer"
              title={isMaximized ? 'Restore size' : 'Maximize window'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-700/60 transition-colors cursor-pointer"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current User Standing Bar */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              #{currentUserEntry?.rank || 4}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm">
                  {userName}
                </span>
                <span className="text-[10px] font-semibold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  {currentUser?.level || 'Active Punekar'}
                </span>
              </div>
              <div className="text-[11px] text-stone-600 mt-0.5">
                Neighborhood: <strong>{userNeighborhood}</strong> · Points: <strong className="text-amber-800">{userPoints} pts</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!currentUser && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSignInModal();
                }}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Sign In to Claim Points
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenReportModal();
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Problem (+50 pts)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700 flex-1">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Rank 2 */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center flex flex-col items-center justify-center">
              <span className="text-xl">🥈</span>
              <div className="text-xs font-bold text-stone-900 mt-1 truncate max-w-full">
                {sortedOverall[1]?.name}
              </div>
              <div className="text-[10px] text-stone-500">{sortedOverall[1]?.neighborhood}</div>
              <div className="text-xs font-extrabold text-stone-800 mt-1">
                {sortedOverall[1]?.points} pts
              </div>
            </div>

            {/* Rank 1 */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-center flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl">🥇</span>
              <div className="text-xs font-bold text-stone-900 mt-1 truncate max-w-full">
                {sortedOverall[0]?.name}
              </div>
              <div className="text-[10px] text-stone-500">{sortedOverall[0]?.neighborhood}</div>
              <div className="text-xs font-extrabold text-amber-900 mt-1">
                {sortedOverall[0]?.points} pts
              </div>
            </div>

            {/* Rank 3 */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center flex flex-col items-center justify-center">
              <span className="text-xl">🥉</span>
              <div className="text-xs font-bold text-stone-900 mt-1 truncate max-w-full">
                {sortedOverall[2]?.name}
              </div>
              <div className="text-[10px] text-stone-500">{sortedOverall[2]?.neighborhood}</div>
              <div className="text-xs font-extrabold text-stone-800 mt-1">
                {sortedOverall[2]?.points} pts
              </div>
            </div>
          </div>

          {/* Neighborhood Filter Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Filter by Neighborhood:
            </span>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-hidden focus:border-stone-400"
            >
              <option value="all">All Pune Neighborhoods</option>
              <option value="Kothrud">Kothrud</option>
              <option value="Deccan">Deccan Gymkhana</option>
              <option value="Koregaon">Koregaon Park (KP)</option>
              <option value="Shivajinagar">Shivajinagar</option>
              <option value="Viman">Viman Nagar</option>
              <option value="Hinjawadi">Hinjawadi</option>
              <option value="Aundh">Aundh</option>
              <option value="Camp">Camp (Cantonment)</option>
            </select>
          </div>

          {/* Full Rankings Table */}
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Rank</th>
                  <th className="py-2.5 px-3 font-semibold">Citizen Contributor</th>
                  <th className="py-2.5 px-3 font-semibold">Neighborhood</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Reports Filed</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Civic Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLeaderboard.map((item) => (
                  <tr
                    key={item.name}
                    className={`transition-colors ${
                      item.isCurrentUser
                        ? 'bg-amber-100/60 font-bold text-amber-950'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-stone-900">
                        {item.rank === 1 ? '🥇 #1' : item.rank === 2 ? '🥈 #2' : item.rank === 3 ? '🥉 #3' : `#${item.rank}`}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[140px] sm:max-w-none">{item.name}</span>
                        {item.isCurrentUser && (
                          <span className="text-[10px] bg-amber-300 text-amber-950 px-1.5 py-0.2 rounded-sm font-extrabold">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-stone-500">{item.neighborhood}</td>
                    <td className="py-3 px-3 text-right font-medium">{item.reportsCount}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-stone-900">
                      {item.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Points Rules Legend */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span><strong>Point Rules:</strong> +50 pts per reported issue / gem · +10 pts per verification</span>
            </div>
            <span className="text-stone-400">Monthly Top 10 recognized by PMC civic cell</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500">Live Pune Community Honor Roll</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
