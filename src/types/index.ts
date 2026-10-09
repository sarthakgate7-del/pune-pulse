export interface City {
  id: string;
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  weather: {
    temp: string;
    condition: string;
    humidity: string;
    alert?: string;
  };
  trafficStatus: 'Light' | 'Moderate' | 'Heavy' | 'Gridlock';
  safetyIndex: number; // 0 - 100
  cleanlinessIndex: number;
  transitScore: number;
  currency: string;
  emergencyNumber: string;
}

export type SpotCategory = 'food' | 'culture' | 'attraction' | 'stay' | 'hazard';

export interface LocationSpot {
  id: string;
  name: string;
  category: SpotCategory;
  cityId: string;
  coordinates: [number, number];
  neighborhood: string;
  rating: number;
  reviewCount: number;
  costLevel: '$' | '$$' | '$$$' | 'Free';
  description: string;
  safetyScore: number; // 0 - 100
  cleanlinessScore: number; // 0 - 100
  accessibilityScore: number; // 0 - 100
  verifiedTips: string[];
  bestTimeToVisit: string;
  tags: string[];
  isHeritage?: boolean;
  isBudgetFriendly?: boolean;
  crowdStatus?: 'Quiet' | 'Moderate' | 'Bustling' | 'Congested';
  hazardAlert?: string;
}

export interface NeighborhoodComparison {
  id: string;
  name: string;
  cityId: string;
  safetyRating: number; // 1-10
  cleanlinessRating: number; // 1-10
  affordabilityRating: number; // 1-10
  transitRating: number; // 1-10
  vibeRating: number; // 1-10
  bestFor: string[];
  watchOutFor: string[];
  summary: string;
  verdict: 'Top Pick' | 'Balanced Hub' | 'Caution After Dusk' | 'Budget Friendly';
}

export interface RouteOption {
  type: 'standard' | 'safe';
  title: string;
  duration: string;
  distance: string;
  safetyScore: number; // 0-100
  lightingQuality: 'Poor' | 'Moderate' | 'Well-Lit & Monitored';
  steps: string[];
  path: [number, number][];
  highlights: string[];
  warnings?: string[];
}

export interface SafeNavigationRoute {
  id: string;
  cityId: string;
  fromName: string;
  toName: string;
  standard: RouteOption;
  saferRoute: RouteOption;
}

export interface WeatherAlertInfo {
  id: string;
  type: 'heavy_rain' | 'dam_discharge' | 'flood_warning' | 'clear' | 'storm';
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  headline: string;
  issuedBy: string;
  details: string;
  precautionaryAction: string;
  validUntil: string;
  impactAreas: string[];
}

export interface CityWeatherAlertResponse {
  city: string;
  temp: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  rainfallMm: number;
  lastUpdated: string;
  hasHighPriorityAlert: boolean;
  alert: WeatherAlertInfo | null;
  scenario: string;
}

export interface CitizenReport {
  id: string;
  city: string;
  category: 'hazard' | 'gem' | 'traffic' | 'weather';
  title: string;
  description: string;
  locationName: string;
  coordinates: [number, number];
  photoUrl?: string | null;
  status: string;
  upvotes: number;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface CivicLeaderboardEntry {
  rank: number;
  name: string;
  neighborhood: string;
  points: number;
  reportsCount: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface CivicUserStats {
  points: number;
  reportsSubmitted: number;
  upvotesGiven: number;
  level: string;
  rank: number;
}

export interface UserReportHistoryItem {
  id: string;
  title: string;
  category: 'hazard' | 'gem' | 'traffic' | 'weather';
  severity: 'Low' | 'Medium' | 'High';
  locationName: string;
  pointsEarned: number;
  timestamp: string;
  status: string;
}

export interface CivicUserProfile {
  id: string;
  name: string;
  neighborhood: string;
  emailOrPhone: string;
  points: number;
  reportsSubmitted: number;
  upvotesGiven: number;
  level: string;
  joinedDate: string;
  avatarColor: string;
  citizenId?: string;
  reportedProblems?: UserReportHistoryItem[];
  offlineGameHighScore?: number;
}


export interface HeritageStop {
  id: string;
  order: number;
  name: string;
  marathiName: string;
  era: string;
  yearBuilt: string;
  coordinates: [number, number];
  neighborhood: string;
  durationMinutes: number;
  audioGuideSummary: string;
  audioDurationSeconds: number;
  historicalSignificance: string;
  architecturalHighlights: string[];
  walkingTipToNext?: string;
  entryFee: string;
}

export interface HeritageTrail {
  id: string;
  title: string;
  subtitle: string;
  totalDistance: string;
  estimatedDuration: string;
  stopsCount: number;
  recommendedStartingPoint: string;
  bestTime: string;
  safetyScore: number;
  path: [number, number][];
  stops: HeritageStop[];
}


