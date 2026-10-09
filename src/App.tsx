import { useState, useEffect } from 'react';
import {
  Compass,
  ShieldCheck,
  BarChart3,
  Users,
  Bot,
  CloudSun,
  Shield,
  PhoneCall,
  MapPin,
  Train,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  CloudRain,
  ChevronRight,
  Sliders,
  Trophy,
  User,
  WifiOff,
  Wifi,
  Gamepad2,
} from 'lucide-react';
import { PUNE_CITY, PUNE_SPOTS, PUNE_NEIGHBORHOODS, PUNE_SAFE_ROUTES, PUNE_CITIZEN_REPORTS } from './data/puneData';
import { LocationSpot, CitizenReport, CityWeatherAlertResponse, CivicUserProfile, UserReportHistoryItem } from './types';
import { ExploreView } from './components/ExploreView';
import { SafeRouteView } from './components/SafeRouteView';
import { CompareView } from './components/CompareView';
import { CitizenPulseView } from './components/CitizenPulseView';
import { CityAiModal } from './components/CityAiModal';
import { WeatherAlertModal } from './components/WeatherAlertModal';
import { CivicUserWindow } from './components/CivicUserWindow';
import { CivicLeaderboardModal } from './components/CivicLeaderboardModal';
import { OfflineGameModal } from './components/OfflineGameModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { SafetyCheckModal } from './components/SafetyCheckModal';
import { QuickActionsFloatingButton } from './components/QuickActionsFloatingButton';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'safe-route' | 'compare' | 'citizen-pulse'>('explore');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isUserWindowOpen, setIsUserWindowOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isOfflineGameModalOpen, setIsOfflineGameModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSafetyCheckModalOpen, setIsSafetyCheckModalOpen] = useState(false);
  const [reports, setReports] = useState<CitizenReport[]>(PUNE_CITIZEN_REPORTS);
  const [selectedSpotForNavigation, setSelectedSpotForNavigation] = useState<LocationSpot | null>(null);
  const [weatherAlertData, setWeatherAlertData] = useState<CityWeatherAlertResponse | null>(null);

  // Online / Offline State & Simulation
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // User Civic Profile (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<CivicUserProfile>(() => {
    try {
      const saved = localStorage.getItem('pune_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'punekar-1',
      citizenId: 'PUN-2026-8492',
      name: 'Rohan Deshmukh',
      neighborhood: 'Deccan Gymkhana',
      emailOrPhone: 'rohan.deshmukh@pune.gov.in',
      points: 230,
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
  });

  // Track online/offline browser events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      // Automatically prompt offline game when connection drops
      setIsOfflineGameModalOpen(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save profile updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pune_user_profile', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  // Check URL hash / params for standalone popup windows
  useEffect(() => {
    if (window.location.hash === '#user-window' || window.location.search.includes('view=user-portal')) {
      setIsUserWindowOpen(true);
    } else if (window.location.hash === '#leaderboard-window' || window.location.search.includes('view=leaderboard')) {
      setIsLeaderboardModalOpen(true);
    }
  }, []);

  // Fetch dynamic weather alerts from API
  const fetchWeatherAlerts = (scenario?: string) => {
    const url = scenario
      ? `/api/weather-alerts?city=Pune&scenario=${scenario}`
      : `/api/weather-alerts?city=Pune`;
    fetch(url)
      .then((res) => res.json())
      .then((data: CityWeatherAlertResponse) => {
        setWeatherAlertData(data);
      })
      .catch((err) => {
        console.error('Failed to fetch weather alerts from API:', err);
      });
  };

  useEffect(() => {
    fetchWeatherAlerts();
    const interval = setInterval(() => {
      fetchWeatherAlerts();
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live citizen reports on mount
  useEffect(() => {
    fetch('/api/reports?city=Pune')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReports(data);
        }
      })
      .catch(() => {
        // Fallback to pre-loaded rich dataset
      });
  }, []);

  const handleSwitchWeatherScenario = (newScenario: 'heavy_rain' | 'dam_discharge' | 'clear') => {
    fetch('/api/weather-alerts/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: newScenario }),
    })
      .then(() => {
        fetchWeatherAlerts(newScenario);
      })
      .catch(() => {
        fetchWeatherAlerts(newScenario);
      });
  };

  const handleUpvoteReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );

    // Award +10 points to current user for community verification
    setCurrentUser((prev) => {
      const newPoints = prev.points + 10;
      return {
        ...prev,
        points: newPoints,
        upvotesGiven: prev.upvotesGiven + 1,
        level: newPoints >= 500 ? 'Pune Urban Hero' : newPoints >= 250 ? 'Civic Guardian' : 'Active Punekar',
      };
    });

    fetch(`/api/reports/${id}/upvote`, { method: 'POST' }).catch(() => {});
  };

  // Dynamic point calculation based on reported problem severity and category!
  const calculateReportPoints = (category: string, severity: string): number => {
    if (category === 'gem') return 45;
    if (severity === 'High') return 60;
    if (severity === 'Medium') return 50;
    return 35;
  };

  const handleSubmitReport = (
    newReportData: Omit<CitizenReport, 'id' | 'upvotes' | 'timestamp' | 'status'>,
    awardedPoints?: number
  ) => {
    const pointsToAward = awardedPoints ?? calculateReportPoints(newReportData.category, newReportData.severity);

    const optimisticReport: CitizenReport = {
      ...newReportData,
      id: `rep-${Date.now()}`,
      upvotes: 1,
      status: 'Verified by Citizen Network',
      timestamp: 'Just now',
    };

    setReports((prev) => [optimisticReport, ...prev]);

    // Give user points based on the problem they reported & record in history!
    setCurrentUser((prev) => {
      const newPoints = prev.points + pointsToAward;
      const newReportHistoryItem: UserReportHistoryItem = {
        id: optimisticReport.id,
        title: newReportData.title,
        category: newReportData.category,
        severity: newReportData.severity,
        locationName: newReportData.locationName,
        pointsEarned: pointsToAward,
        timestamp: 'Just now',
        status: 'Verified by PMC Ward Cell',
      };

      return {
        ...prev,
        points: newPoints,
        reportsSubmitted: prev.reportsSubmitted + 1,
        level: newPoints >= 500 ? 'Pune Urban Hero' : newPoints >= 250 ? 'Civic Guardian' : 'Active Punekar',
        reportedProblems: [newReportHistoryItem, ...(prev.reportedProblems || [])],
      };
    });

    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReportData),
    }).catch(() => {});
  };

  // Handle points banked from Offline Game
  const handleAwardCivicPoints = (points: number, reason: string) => {
    setCurrentUser((prev) => {
      const newPoints = prev.points + points;
      return {
        ...prev,
        points: newPoints,
        level: newPoints >= 500 ? 'Pune Urban Hero' : newPoints >= 250 ? 'Civic Guardian' : 'Active Punekar',
      };
    });
  };

  const handleNavigateToSpot = (spot: LocationSpot) => {
    setSelectedSpotForNavigation(spot);
    setActiveTab('safe-route');
  };

  const hasHighPriority = weatherAlertData?.hasHighPriorityAlert;
  const alert = weatherAlertData?.alert;
  const isCurrentlyOffline = !isOnline || isSimulatedOffline;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Offline Alert Ribbon when Internet is Not Connected (or Simulation Active) */}
      {isCurrentlyOffline && (
        <div className="bg-amber-900 text-amber-100 text-xs py-2 px-4 border-b border-amber-800 shadow-xs relative transition-all">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500 text-stone-950 font-black uppercase tracking-wide text-[10px] shrink-0">
                <WifiOff className="w-3 h-3" />
                OFFLINE MODE
              </span>
              <span className="font-semibold text-amber-100 truncate">
                {isSimulatedOffline ? 'Simulated Offline Connection' : 'No Internet Connection detected'}
              </span>
              <span className="hidden md:inline text-amber-300 text-[11px]">
                · Local Pune map, emergency guides & heritage trails remain fully operational!
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsOfflineGameModalOpen(true)}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>🛺 Play Rickshaw Patrol Game (+Pts)</span>
              </button>

              {isSimulatedOffline && (
                <button
                  onClick={() => setIsSimulatedOffline(false)}
                  className="px-2 py-1 bg-black/40 hover:bg-black/60 text-amber-200 hover:text-white rounded-md text-[11px] transition-colors cursor-pointer"
                >
                  Exit Offline Mode
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Notification Ribbon - Dynamically displays High Priority Weather Alert from API */}
      {hasHighPriority && alert ? (
        <div className="bg-red-950 text-white text-xs py-2 px-4 border-b border-red-800 shadow-xs relative transition-all">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
            {/* Left: High Priority Alert Headline & Pulse Beacon */}
            <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis flex-1">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-red-600 text-white font-extrabold uppercase tracking-wide text-[10px] shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                {alert.severity} WEATHER ALERT
              </span>
              <span className="font-semibold text-red-100 truncate">
                {alert.headline}
              </span>
              <span className="hidden xl:inline text-red-300 text-[11px] truncate">
                · Rainfall: {weatherAlertData.rainfallMm} mm/hr · {alert.validUntil}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                onClick={() => setIsWeatherModalOpen(true)}
                className="px-2.5 py-1 bg-red-800/80 hover:bg-red-700 text-white rounded-md font-semibold text-[11px] flex items-center gap-1 transition-colors border border-red-700 cursor-pointer"
              >
                <span>Safety Advisory & Impact Areas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() =>
                  handleSwitchWeatherScenario(
                    weatherAlertData.scenario === 'heavy_rain' ? 'dam_discharge' : 'clear'
                  )
                }
                className="px-2 py-1 bg-black/30 hover:bg-black/50 text-red-200 hover:text-white rounded-md text-[11px] font-medium transition-colors border border-red-900 cursor-pointer"
                title="Cycle through API weather scenarios"
              >
                Toggle Alert Mode
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Weather Ribbon */
        <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 border-b border-stone-800 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="flex items-center gap-1.5 font-medium text-stone-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Pune Live Pulse
              </span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <button
                onClick={() => setIsWeatherModalOpen(true)}
                className="text-stone-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                title="View Pune weather details"
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                {weatherAlertData ? weatherAlertData.temp : PUNE_CITY.weather.temp} (
                {weatherAlertData ? weatherAlertData.condition : PUNE_CITY.weather.condition})
              </button>
              <span aria-hidden="true" className="text-stone-600 hidden md:inline">·</span>
              <span className="hidden md:inline text-stone-400">
                City Safety Index: <strong className="text-emerald-400">{PUNE_CITY.safetyIndex}/100</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-400 shrink-0">
              {/* Simulator for Offline Game */}
              <button
                onClick={() => {
                  setIsSimulatedOffline(!isSimulatedOffline);
                  if (!isSimulatedOffline) {
                    setIsOfflineGameModalOpen(true);
                  }
                }}
                className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  isSimulatedOffline
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
                title="Test Offline Mode & play the Pune Rickshaw Patrol game"
              >
                <Gamepad2 className="w-3 h-3" />
                <span>{isSimulatedOffline ? 'Offline Mode Active' : 'Test Offline Game'}</span>
              </button>

              <button
                onClick={() => handleSwitchWeatherScenario('heavy_rain')}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline cursor-pointer"
                title="Test Heavy Rain Warning alert from API"
              >
                <CloudRain className="w-3 h-3" />
                <span className="hidden sm:inline">Simulate Rain</span>
              </button>
              <span aria-hidden="true" className="text-stone-700 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Emergency: <strong>112</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & City Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-stone-900">
                  PunePulse
                </h1>
                <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  Pune, Maharashtra
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Exploring, Experiencing & Navigating the Oxford of the East
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Separate Window 1: Punekar User Profile & Civic Score Window */}
            <button
              onClick={() => setIsUserWindowOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-950 rounded-xl text-xs font-semibold transition-all border border-amber-200 shadow-2xs cursor-pointer"
              title="Open Separate Punekar Citizen Profile & Points Window"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-stone-900 leading-tight flex items-center gap-1">
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-amber-800 bg-amber-200/80 px-1 rounded-sm">
                    {currentUser.points} pts
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 leading-tight">
                  {currentUser.neighborhood}
                </div>
              </div>
              <div className="sm:hidden font-bold text-stone-900 text-xs">
                {currentUser.points} pts
              </div>
            </button>

            {/* Separate Window 2: Civic Rankings Leaderboard */}
            <button
              onClick={() => setIsLeaderboardModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200/70 text-stone-800 rounded-xl text-xs font-semibold transition-all border border-stone-200/80 cursor-pointer"
              title="Open Separate Pune Citizen Rankings Window"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Leaderboard</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Ask AI Guide</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>
          </div>
        </div>

        {/* 4 Main Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-stone-100">
          <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-2 text-xs font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. Explore & Map</span>
            </button>

            <button
              onClick={() => setActiveTab('safe-route')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'safe-route'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>2. Safe Route Navigator</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>3. Best vs. Worst (Compare)</span>
            </button>

            <button
              onClick={() => setActiveTab('citizen-pulse')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'citizen-pulse'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>4. Citizen Pulse ({reports.length})</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* City Summary Banner */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-stone-900">Pune Urban Overview:</span>
            <span className="text-stone-600 ml-1.5">
              From Peshwa heritage in Kasba Peth to tree-shaded cafes in Koregaon Park and tech campuses in Hinjawadi.
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-500 shrink-0">
            <span>Cleanliness: <strong className="text-stone-800">{PUNE_CITY.cleanlinessIndex}/100</strong></span>
            <span aria-hidden="true">·</span>
            <span>Transit: <strong className="text-stone-800">{PUNE_CITY.transitScore}/100</strong></span>
            <span aria-hidden="true">·</span>
            <span>Traffic: <strong className="text-amber-700">{PUNE_CITY.trafficStatus}</strong></span>
          </div>
        </div>

        {/* Tab 1: Explore & Interactive Map */}
        {activeTab === 'explore' && (
          <ExploreView
            city={PUNE_CITY}
            spots={PUNE_SPOTS}
            onNavigateToSpot={handleNavigateToSpot}
            weatherAlertActive={Boolean(weatherAlertData?.hasHighPriorityAlert)}
          />
        )}

        {/* Tab 2: Safe Route Navigator */}
        {activeTab === 'safe-route' && (
          <SafeRouteView
            city={PUNE_CITY}
            spots={PUNE_SPOTS}
            routes={PUNE_SAFE_ROUTES}
            preselectedDestination={selectedSpotForNavigation}
          />
        )}

        {/* Tab 3: Best vs. Worst Neighborhoods */}
        {activeTab === 'compare' && (
          <CompareView city={PUNE_CITY} neighborhoods={PUNE_NEIGHBORHOODS} />
        )}

        {/* Tab 4: Citizen Pulse & Crowd Reports */}
        {activeTab === 'citizen-pulse' && (
          <CitizenPulseView
            city={PUNE_CITY}
            reports={reports}
            onUpvoteReport={handleUpvoteReport}
            onSubmitReport={handleSubmitReport}
            onOpenUserWindow={() => setIsUserWindowOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}
      </main>

      {/* SEPARATE WINDOW 1: Punekar User Profile, Points Breakdown & Embedded Offline Game */}
      <CivicUserWindow
        isOpen={isUserWindowOpen}
        onClose={() => setIsUserWindowOpen(false)}
        currentUser={currentUser}
        onSignIn={(user) => setCurrentUser(user)}
        onSignOut={() => {
          const guest: CivicUserProfile = {
            id: `guest-${Date.now()}`,
            citizenId: `PUN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            name: 'Guest Punekar',
            neighborhood: 'Deccan Gymkhana',
            emailOrPhone: 'guest@pune.gov.in',
            points: 100,
            reportsSubmitted: 1,
            upvotesGiven: 2,
            level: 'Street Observer',
            joinedDate: 'October 2026',
            avatarColor: '#78716c',
            reportedProblems: [],
          };
          setCurrentUser(guest);
        }}
        onOpenReportModal={() => {
          setIsReportModalOpen(true);
        }}
        onOpenLeaderboard={() => {
          setIsUserWindowOpen(false);
          setIsLeaderboardModalOpen(true);
        }}
        onAwardCivicPoints={handleAwardCivicPoints}
        isOfflineMode={isCurrentlyOffline}
      />

      {/* SEPARATE WINDOW 2: Pune Citizen Rankings & Leaderboard */}
      <CivicLeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        currentUser={currentUser}
        onOpenReportModal={() => {
          setIsLeaderboardModalOpen(false);
          setIsReportModalOpen(true);
        }}
        onOpenSignInModal={() => {
          setIsLeaderboardModalOpen(false);
          setIsUserWindowOpen(true);
        }}
      />

      {/* SEPARATE WINDOW 3: Standalone Offline Game Modal */}
      <OfflineGameModal
        isOpen={isOfflineGameModalOpen}
        onClose={() => setIsOfflineGameModalOpen(false)}
        onAwardCivicPoints={handleAwardCivicPoints}
        isOfflineMode={isCurrentlyOffline}
      />

      {/* Instant Report Problem Modal (Available from Quick Actions without changing tabs) */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
        cityName={PUNE_CITY.name}
      />

      {/* Instant Safety Check Modal (Available from Quick Actions without changing tabs) */}
      <SafetyCheckModal
        isOpen={isSafetyCheckModalOpen}
        onClose={() => setIsSafetyCheckModalOpen(false)}
        userNeighborhood={currentUser.neighborhood}
        onAwardCivicPoints={handleAwardCivicPoints}
      />

      {/* Floating 'Quick Actions' Button in Bottom Right */}
      <QuickActionsFloatingButton
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onTriggerSafetyCheck={() => setIsSafetyCheckModalOpen(true)}
        onOpenUserProfile={() => setIsUserWindowOpen(true)}
        onOpenOfflineGame={() => setIsOfflineGameModalOpen(true)}
        userPoints={currentUser.points}
      />

      {/* High-Priority Weather Alert Advisory Modal */}
      <WeatherAlertModal
        weatherData={weatherAlertData}
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        onSwitchScenario={handleSwitchWeatherScenario}
      />

      {/* City AI Assistant Modal */}
      <CityAiModal
        city={PUNE_CITY}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">PunePulse</span>
            <span>·</span>
            <span>Smart City Life Explorer & Safe Navigator</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <span>Police: <strong>112</strong></span>
            <span>·</span>
            <span>Medical: <strong>108</strong></span>
            <span>·</span>
            <span>PMC Disaster Cell: <strong>020-25501269</strong></span>
            <span>·</span>
            <span>Pune Metro: <strong>1800 270 5501</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
