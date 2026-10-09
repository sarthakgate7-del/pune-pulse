import { City, LocationSpot, NeighborhoodComparison, SafeNavigationRoute, CitizenReport } from '../types';

export const CITIES: City[] = [
  {
    id: 'sf',
    name: 'San Francisco',
    country: 'United States',
    center: [37.7749, -122.4194],
    zoom: 13,
    weather: {
      temp: '16°C (61°F)',
      condition: 'Partly Cloudy with Coastal Fog',
      humidity: '72%',
      alert: 'Late evening Karl the Fog reducing visibility on Twin Peaks'
    },
    trafficStatus: 'Moderate',
    safetyIndex: 74,
    cleanlinessIndex: 68,
    transitScore: 86,
    currency: 'USD ($)',
    emergencyNumber: '911'
  },
  {
    id: 'nyc',
    name: 'New York City',
    country: 'United States',
    center: [40.7128, -74.0060],
    zoom: 13,
    weather: {
      temp: '19°C (66°F)',
      condition: 'Clear Sky',
      humidity: '58%',
    },
    trafficStatus: 'Heavy',
    safetyIndex: 81,
    cleanlinessIndex: 72,
    transitScore: 94,
    currency: 'USD ($)',
    emergencyNumber: '911'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    center: [51.5074, -0.1278],
    zoom: 13,
    weather: {
      temp: '14°C (57°F)',
      condition: 'Light Drizzle',
      humidity: '84%',
      alert: 'Wet pavement along Thames Path; watch cycling tracks'
    },
    trafficStatus: 'Moderate',
    safetyIndex: 85,
    cleanlinessIndex: 82,
    transitScore: 92,
    currency: 'GBP (£)',
    emergencyNumber: '999'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    center: [35.6762, 139.6503],
    zoom: 13,
    weather: {
      temp: '18°C (64°F)',
      condition: 'Brisk & Sunny',
      humidity: '50%',
    },
    trafficStatus: 'Light',
    safetyIndex: 96,
    cleanlinessIndex: 97,
    transitScore: 99,
    currency: 'JPY (¥)',
    emergencyNumber: '110'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    center: [18.9220, 72.8347],
    zoom: 13,
    weather: {
      temp: '30°C (86°F)',
      condition: 'Humid & Breezy',
      humidity: '78%',
      alert: 'High tide alert at Marine Drive promenade between 4 PM - 6 PM'
    },
    trafficStatus: 'Heavy',
    safetyIndex: 78,
    cleanlinessIndex: 65,
    transitScore: 88,
    currency: 'INR (₹)',
    emergencyNumber: '112'
  }
];

export const CITY_SPOTS: LocationSpot[] = [
  // SAN FRANCISCO
  {
    id: 'sf-1',
    name: 'Dragon Gate & Waverly Place',
    category: 'culture',
    cityId: 'sf',
    coordinates: [37.7907, -122.4057],
    neighborhood: 'Chinatown',
    rating: 4.8,
    reviewCount: 3120,
    costLevel: 'Free',
    description: 'Oldest Chinatown in North America. Stroll under ornate painted balconies, traditional herbalist shops, and historical temples.',
    safetyScore: 88,
    cleanlinessScore: 80,
    accessibilityScore: 82,
    verifiedTips: ['Visit before 5 PM to see the bakeries fresh out of oven', 'Waverly Place has peaceful alley views with pagoda roofs', 'Very safe pedestrian area during daytime'],
    bestTimeToVisit: 'Morning & Early Afternoon',
    tags: ['Historic Landmark', 'Cultural Heritage', 'Walking Tour', 'Photography'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'sf-2',
    name: 'El Farolito Taqueria',
    category: 'food',
    cityId: 'sf',
    coordinates: [37.7527, -122.4184],
    neighborhood: 'Mission District',
    rating: 4.7,
    reviewCount: 4580,
    costLevel: '$',
    description: 'Legendary late-night Mission-style burrito institution. Celebrated carne asada super burritos packed with avocado and melted cheese.',
    safetyScore: 78,
    cleanlinessScore: 74,
    accessibilityScore: 85,
    verifiedTips: ['Cash preferred or debit card ready', 'Peak queue at midnight, moves quickly', 'Stick to 24th St transit corridor when walking late'],
    bestTimeToVisit: 'Late Evening (10 PM - 1 AM)',
    tags: ['Street Food', 'Budget Gem', 'Late Night', 'Local Favorite'],
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'sf-3',
    name: 'Ferry Building Artisan Marketplace',
    category: 'attraction',
    cityId: 'sf',
    coordinates: [37.7955, -122.3937],
    neighborhood: 'Embarcadero',
    rating: 4.9,
    reviewCount: 7800,
    costLevel: '$$',
    description: 'Iconic 1898 clock tower terminal turned premier sustainable food hall with panoramic bay views and waterfront promenades.',
    safetyScore: 94,
    cleanlinessScore: 92,
    accessibilityScore: 95,
    verifiedTips: ['Farmers market runs Tuesdays and Saturdays', 'Wide paved promenades ideal for strollers and wheelchairs', 'Safe well-lit public transit hub connecting ferries, BART, and Muni'],
    bestTimeToVisit: '11:00 AM - 3:00 PM',
    tags: ['Food Hall', 'Waterfront', 'Farmers Market', 'Safe Corridor'],
    isHeritage: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'sf-4',
    name: 'Tenderloin & 6th St Intersection Alert',
    category: 'hazard',
    cityId: 'sf',
    coordinates: [37.7818, -122.4110],
    neighborhood: 'Tenderloin / Mid-Market',
    rating: 2.1,
    reviewCount: 140,
    costLevel: 'Free',
    description: 'High frequency of citizen-reported erratic behavior, dim alleyways, and street obstructions. Caution advised after twilight.',
    safetyScore: 36,
    cleanlinessScore: 38,
    accessibilityScore: 60,
    verifiedTips: ['Use Market Street main sidewalk instead of cutting through Turk or Ellis after dark', 'Avoid displaying open smartphones or luggage', 'BART station entrances are monitored but stay vigilant'],
    bestTimeToVisit: 'Broad daylight only',
    tags: ['Hazard Zone', 'Poor Lighting', 'High Incident Rate'],
    hazardAlert: 'Reported safety caution zone: avoid dimly lit side alleys after 8 PM.',
    crowdStatus: 'Congested'
  },
  {
    id: 'sf-5',
    name: 'The Green Orchard Hostel & Suites',
    category: 'stay',
    cityId: 'sf',
    coordinates: [37.7879, -122.4230],
    neighborhood: 'Nob Hill / Lower Pacific',
    rating: 4.6,
    reviewCount: 920,
    costLevel: '$$',
    description: 'Charming boutique heritage hotel in a calm, highly walkable residential neighborhood with historic cable car access.',
    safetyScore: 92,
    cleanlinessScore: 90,
    accessibilityScore: 84,
    verifiedTips: ['Cable car stop directly across the corner', 'Very quiet at night compared to downtown', 'Complimentary neighborhood walking map at desk'],
    bestTimeToVisit: 'Check-in 3:00 PM',
    tags: ['Boutique Stay', 'Safe Neighborhood', 'Historic District'],
    crowdStatus: 'Quiet'
  },

  // NEW YORK CITY
  {
    id: 'nyc-1',
    name: 'Washington Square Park & Arch',
    category: 'culture',
    cityId: 'nyc',
    coordinates: [40.7308, -73.9973],
    neighborhood: 'Greenwich Village',
    rating: 4.8,
    reviewCount: 9400,
    costLevel: 'Free',
    description: 'Heart of bohemian New York culture. Filled with outdoor chess players, street musicians, NYU students, and marble triumphal arch.',
    safetyScore: 87,
    cleanlinessScore: 79,
    accessibilityScore: 90,
    verifiedTips: ['Lively and well-patrolled until midnight', 'Best acoustic folk performances near fountain', 'Surrounded by historic brick row houses'],
    bestTimeToVisit: 'Afternoon to Sunset',
    tags: ['Historic Arch', 'Live Music', 'Public Park', 'Safe Hangout'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'nyc-2',
    name: 'Joe\'s Pizza on Carmine St',
    category: 'food',
    cityId: 'nyc',
    coordinates: [40.7305, -74.0021],
    neighborhood: 'West Village',
    rating: 4.8,
    reviewCount: 12400,
    costLevel: '$',
    description: 'The definitive New York street slice since 1975. Crispy, thin crust with sweet San Marzano tomato sauce and fresh mozzarella.',
    safetyScore: 91,
    cleanlinessScore: 82,
    accessibilityScore: 88,
    verifiedTips: ['Order the classic plain cheese or fresh mozzarella slice', 'Lines look long but clear in 3 minutes', 'Cash or tap to pay'],
    bestTimeToVisit: '12:00 PM - 2:00 AM',
    tags: ['Classic NY Slice', 'Budget Gem', 'Late Night', 'Must Try'],
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'nyc-3',
    name: 'The High Line Elevated Park',
    category: 'attraction',
    cityId: 'nyc',
    coordinates: [40.7480, -74.0048],
    neighborhood: 'Chelsea / Meatpacking',
    rating: 4.9,
    reviewCount: 18200,
    costLevel: 'Free',
    description: 'Continuous 1.45-mile elevated park built on historic freight rail line with native wild flowers, modern art, and Hudson River views.',
    safetyScore: 96,
    cleanlinessScore: 94,
    accessibilityScore: 96,
    verifiedTips: ['Elevators located at Gansevoort, 14th, 23rd, and 30th streets', 'Security staff present at all entries', 'No bicycles or scooters allowed—truly pedestrian safe'],
    bestTimeToVisit: 'Early morning (8:00 AM - 10:00 AM)',
    tags: ['Elevated Park', 'Art Installations', 'Scenic Stroll', 'Accessible'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Moderate'
  },
  {
    id: 'nyc-4',
    name: 'Port Authority / 8th Ave Concourse Hazard Watch',
    category: 'hazard',
    cityId: 'nyc',
    coordinates: [40.7570, -73.9902],
    neighborhood: 'Midtown West',
    rating: 2.5,
    reviewCount: 310,
    costLevel: 'Free',
    description: 'High foot-traffic pinch point with frequent complaints of aggressive solicitation, pickpocketing, and narrow construction walkways.',
    safetyScore: 52,
    cleanlinessScore: 46,
    accessibilityScore: 70,
    verifiedTips: ['Keep bags zipped in front during peak commute rush', 'Use 7th Ave or Broadway as alternate walking corridors at night', 'Follow uniformed transit police booths'],
    bestTimeToVisit: 'Commute hours only',
    tags: ['Crowd Bottleneck', 'Pickpocket Risk', 'Construction'],
    hazardAlert: 'Heavy congestion & reported theft alert during evening rush hour.',
    crowdStatus: 'Congested'
  },

  // LONDON
  {
    id: 'ldn-1',
    name: 'Borough Market & Southwark Heritage',
    category: 'food',
    cityId: 'london',
    coordinates: [51.5055, -0.0910],
    neighborhood: 'Southwark / London Bridge',
    rating: 4.8,
    reviewCount: 15600,
    costLevel: '$$',
    description: 'London’s oldest food market dating back to the 12th century beneath Victorian railway arches. Artisan cheeses, scotch eggs, oysters, and hot ciders.',
    safetyScore: 92,
    cleanlinessScore: 88,
    accessibilityScore: 86,
    verifiedTips: ['Go on Thursday or Friday morning for less intense queues', 'Try the famous toasted sourdough cheese toastie', 'Direct access from London Bridge station'],
    bestTimeToVisit: '10:00 AM - 2:00 PM',
    tags: ['Historic Market', 'Artisan Food', 'Victorian Arches'],
    isHeritage: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'ldn-2',
    name: 'Covent Garden Piazza & Street Performers',
    category: 'culture',
    cityId: 'london',
    coordinates: [51.5117, -0.1239],
    neighborhood: 'West End',
    rating: 4.8,
    reviewCount: 11200,
    costLevel: 'Free',
    description: '17th-century public square designed by Inigo Jones. Cobbled plaza, Royal Opera House, and licensed world-class street acrobats.',
    safetyScore: 94,
    cleanlinessScore: 91,
    accessibilityScore: 90,
    verifiedTips: ['Completely pedestrianized car-free zone', 'Well-lit with high visibility well into the night', 'Transport police stationed near Underground'],
    bestTimeToVisit: 'Afternoon & Evening',
    tags: ['Pedestrian Zone', 'Street Theatre', 'Historic Square'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },

  // TOKYO
  {
    id: 'tky-1',
    name: 'Senso-ji Temple & Nakamise-dori',
    category: 'culture',
    cityId: 'tokyo',
    coordinates: [35.7147, 139.7967],
    neighborhood: 'Asakusa',
    rating: 4.9,
    reviewCount: 22000,
    costLevel: 'Free',
    description: 'Tokyo\'s oldest and most significant Buddhist temple founded in 645 AD. The Thunder Gate (Kaminarimon) opens to a historic street of traditional craft shops.',
    safetyScore: 98,
    cleanlinessScore: 97,
    accessibilityScore: 92,
    verifiedTips: ['Visit at 7 PM when crowds disperse and temple pagoda is illuminated', 'Try warm freshly pressed ningyo-yaki bean cakes', 'Extremely safe, spotless public restrooms'],
    bestTimeToVisit: 'Early morning (7 AM) or Night illumination (8 PM)',
    tags: ['Ancient Temple', 'Lantern Gate', 'Traditions', 'Heritage'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'tky-2',
    name: 'Omoide Yokocho (Memory Lane)',
    category: 'food',
    cityId: 'tokyo',
    coordinates: [35.6931, 139.6995],
    neighborhood: 'Shinjuku',
    rating: 4.7,
    reviewCount: 7800,
    costLevel: '$',
    description: 'Post-war atmospheric alley packed with tiny 6-seat yakitori stalls grilled over binchotan charcoal. Rich retro atmosphere.',
    safetyScore: 93,
    cleanlinessScore: 89,
    accessibilityScore: 72,
    verifiedTips: ['Most stalls charge a small table cover (otoshi) with a snack', 'Cash only in most stalls', 'Very safe despite narrow alley footprint'],
    bestTimeToVisit: '6:00 PM - 9:00 PM',
    tags: ['Yakitori Alleys', 'Budget Dining', 'Retro Showa Era'],
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },

  // MUMBAI
  {
    id: 'mum-1',
    name: 'Gateway of India & Taj Mahal Palace',
    category: 'culture',
    cityId: 'mumbai',
    coordinates: [18.9220, 72.8347],
    neighborhood: 'Colaba',
    rating: 4.8,
    reviewCount: 34000,
    costLevel: 'Free',
    description: 'Grand Indo-Saracenic basalt arch monument facing Mumbai Harbour, adjacent to the legendary 1903 Taj Mahal Palace hotel.',
    safetyScore: 86,
    cleanlinessScore: 75,
    accessibilityScore: 82,
    verifiedTips: ['Security baggage scan required at entry gate', 'Sunset ferry ride gives spectacular sea view of the arch', 'Polite tourist police visible across plaza'],
    bestTimeToVisit: '5:00 PM - 7:00 PM',
    tags: ['Colonial Heritage', 'Harbour Vista', 'Historic Monument'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'mum-2',
    name: 'Sardar Refreshments & Pav Bhaji',
    category: 'food',
    cityId: 'mumbai',
    coordinates: [18.9710, 72.8180],
    neighborhood: 'Tardeo',
    rating: 4.6,
    reviewCount: 6800,
    costLevel: '$',
    description: 'Legendary Mumbai street food destination renowned for butter-drenched spicy mashed vegetable curry served with toasted soft pav buns.',
    safetyScore: 82,
    cleanlinessScore: 76,
    accessibilityScore: 80,
    verifiedTips: ['Ask for extra lime and chopped onions', 'Best accompanied with fresh spiced buttermilk (chaas)', 'Quick turnover, wait time usually under 10 minutes'],
    bestTimeToVisit: '7:00 PM - 11:00 PM',
    tags: ['Iconic Street Food', 'Budget Feast', 'Local Cult Classic'],
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'mum-3',
    name: 'Hindmata Dadar Waterlogging Alert Zone',
    category: 'hazard',
    cityId: 'mumbai',
    coordinates: [19.0178, 72.8478],
    neighborhood: 'Dadar / Lower Parel',
    rating: 2.2,
    reviewCount: 180,
    costLevel: 'Free',
    description: 'Low-lying transit bowl susceptible to rapid water stagnation during sudden downpours, causing taxi snarls and delayed local train feeder buses.',
    safetyScore: 48,
    cleanlinessScore: 42,
    accessibilityScore: 55,
    verifiedTips: ['Take elevated flyover route instead of surface road during rain', 'Check live monsoon pump updates before booking cabs', 'Keep emergency rain poncho in bag'],
    bestTimeToVisit: 'Dry weather only',
    tags: ['Monsoon Hazard', 'Traffic Bottleneck', 'Waterlogging Risk'],
    hazardAlert: 'Sudden rain advisory: avoid surface junctions in low-lying sections.',
    crowdStatus: 'Congested'
  }
];

export const NEIGHBORHOOD_COMPARISONS: Record<string, NeighborhoodComparison[]> = {
  sf: [
    {
      id: 'sf-nh-1',
      name: 'North Beach & Telegraph Hill',
      cityId: 'sf',
      safetyRating: 9.2,
      cleanlinessRating: 8.8,
      affordabilityRating: 6.5,
      transitRating: 8.4,
      vibeRating: 9.4,
      bestFor: ['Historic Italian cafes', 'Evening sidewalk strolls', 'Coit Tower views', 'Jazz & poetry heritage'],
      watchOutFor: ['Steep hills requiring sturdy shoes', 'Street parking is very difficult'],
      summary: 'One of SF’s safest and most charming neighborhoods. High foot traffic until late, excellent street lighting, and deep historic character.',
      verdict: 'Top Pick'
    },
    {
      id: 'sf-nh-2',
      name: 'Mission District (Valencia Corridor)',
      cityId: 'sf',
      safetyRating: 7.8,
      cleanlinessRating: 7.2,
      affordabilityRating: 7.9,
      transitRating: 9.1,
      vibeRating: 9.6,
      bestFor: ['Top-tier taco spots', 'Independent bookstores', 'Mural alleyways', 'Vibrant nightlife'],
      watchOutFor: ['Mission St corridor can get rowdy after 11 PM', 'Bicycle theft risk—lock frames securely'],
      summary: 'Unbeatable food culture and lively daytime vibe. Valencia St is heavily pedestrianized and well-lit, while Mission St requires basic street awareness.',
      verdict: 'Balanced Hub'
    },
    {
      id: 'sf-nh-3',
      name: 'Mid-Market & Tenderloin',
      cityId: 'sf',
      safetyRating: 4.2,
      cleanlinessRating: 4.0,
      affordabilityRating: 8.5,
      transitRating: 9.5,
      vibeRating: 5.8,
      bestFor: ['Budget Southeast Asian food (Little Saigon)', 'Historic theaters', 'Direct central transit'],
      watchOutFor: ['High visible homelessness and erratic behavior', 'Poorly lit cross streets (Turk, Ellis, Eddy)', 'Not recommended for solo walkers late at night'],
      summary: 'Centrally located with incredible authentic banh mi and historic playhouses, but faces significant municipal challenges and lowest safety ratings in the city.',
      verdict: 'Caution After Dusk'
    },
    {
      id: 'sf-nh-4',
      name: 'Richmond District (Inner & Outer)',
      cityId: 'sf',
      safetyRating: 9.4,
      cleanlinessRating: 8.9,
      affordabilityRating: 7.8,
      transitRating: 7.9,
      vibeRating: 8.3,
      bestFor: ['Authentic dim sum', 'Proximity to Golden Gate Park', 'Family-friendly atmosphere', 'Ocean breeze'],
      watchOutFor: ['Frequent evening fog and cool temperatures', 'Further from downtown BART lines'],
      summary: 'Extremely safe, clean, and peaceful residential neighborhood packed with budget-friendly international food.',
      verdict: 'Top Pick'
    }
  ],
  nyc: [
    {
      id: 'nyc-nh-1',
      name: 'Greenwich Village & West Village',
      cityId: 'nyc',
      safetyRating: 9.3,
      cleanlinessRating: 8.6,
      affordabilityRating: 5.2,
      transitRating: 9.6,
      vibeRating: 9.8,
      bestFor: ['Historic brownstones', 'Legendary comedy clubs', 'Quaint tree-lined streets', 'World-class dining'],
      watchOutFor: ['High prices for accommodations and sit-down dinners', 'Confusing diagonal street grid'],
      summary: 'Quintessential romantic NYC with active street life, safe walking at all hours, and boundless cultural history.',
      verdict: 'Top Pick'
    },
    {
      id: 'nyc-nh-2',
      name: 'Lower East Side (LES) & Chinatown',
      cityId: 'nyc',
      safetyRating: 8.1,
      cleanlinessRating: 6.8,
      affordabilityRating: 8.4,
      transitRating: 9.2,
      vibeRating: 9.2,
      bestFor: ['Budget dumpling feasts', 'Vintage thrift shops', 'Indie music venues', 'Cocktail lounges'],
      watchOutFor: ['Weekend crowds can be loud and disorderly near bars', 'Trash collection on narrow sidewalks'],
      summary: 'The best contrast of historic immigrant heritage and energetic nightlife. Superb affordability for food seekers.',
      verdict: 'Budget Friendly'
    },
    {
      id: 'nyc-nh-3',
      name: 'Times Square & Hell’s Kitchen (East)',
      cityId: 'nyc',
      safetyRating: 7.2,
      cleanlinessRating: 6.9,
      affordabilityRating: 4.8,
      transitRating: 9.9,
      vibeRating: 7.0,
      bestFor: ['Broadway shows', 'Major subway hub connectivity', 'Spectacular neon lights'],
      watchOutFor: ['Aggressive costumed performers and ticket scalpers', 'Overpriced tourist traps', 'Crushing crowd density'],
      summary: 'Electrifying visual energy and supreme transit access, but ranks lowest in tranquility and authenticity.',
      verdict: 'Balanced Hub'
    }
  ],
  london: [
    {
      id: 'ldn-nh-1',
      name: 'Covent Garden & Bloomsbury',
      cityId: 'london',
      safetyRating: 9.4,
      cleanlinessRating: 9.1,
      affordabilityRating: 5.5,
      transitRating: 9.7,
      vibeRating: 9.5,
      bestFor: ['Literary history', 'British Museum', 'Theatres', 'Paved pedestrian plazas'],
      watchOutFor: ['Premium prices on food around tourist squares'],
      summary: 'Exceptionally safe, cultured, and pedestrian-friendly day and night.',
      verdict: 'Top Pick'
    },
    {
      id: 'ldn-nh-2',
      name: 'Shoreditch & Spitalfields',
      cityId: 'london',
      safetyRating: 8.0,
      cleanlinessRating: 7.4,
      affordabilityRating: 7.2,
      transitRating: 8.9,
      vibeRating: 9.4,
      bestFor: ['Street art tours', 'Brick Lane curry houses', 'Vintage markets', 'Vibrant nightlife'],
      watchOutFor: ['Boisterous pub crawl crowds on Friday/Saturday nights'],
      summary: 'East London’s creative engine. Great daytime culture and vintage shopping with spirited night energy.',
      verdict: 'Balanced Hub'
    }
  ],
  tokyo: [
    {
      id: 'tky-nh-1',
      name: 'Yanaka & Ueno (Old Tokyo)',
      cityId: 'tokyo',
      safetyRating: 9.9,
      cleanlinessRating: 9.8,
      affordabilityRating: 8.5,
      transitRating: 9.4,
      vibeRating: 9.6,
      bestFor: ['Traditional Showa-era wooden houses', 'Quiet temples', 'Affordable street snacks', 'Friendly craft artisans'],
      watchOutFor: ['Shops close early (mostly by 6:00 PM)'],
      summary: 'Surviving pre-war charm with unrivaled safety and tranquil walking paths.',
      verdict: 'Top Pick'
    },
    {
      id: 'tky-nh-2',
      name: 'Kabukicho / Shinjuku East',
      cityId: 'tokyo',
      safetyRating: 8.7,
      cleanlinessRating: 8.9,
      affordabilityRating: 6.8,
      transitRating: 9.9,
      vibeRating: 9.1,
      bestFor: ['Neon nightlife', 'Karaoke', 'Late night ramen', 'Godzilla road'],
      watchOutFor: ['Touting outside bars (ignore street promoters)', 'Dense evening throngs'],
      summary: 'Japan\'s most famous entertainment district. Very safe by global standards, but requires vigilance against bar scams.',
      verdict: 'Caution After Dusk'
    }
  ],
  mumbai: [
    {
      id: 'mum-nh-1',
      name: 'Colaba & Fort Heritage Precinct',
      cityId: 'mumbai',
      safetyRating: 8.9,
      cleanlinessRating: 7.6,
      affordabilityRating: 7.0,
      transitRating: 8.8,
      vibeRating: 9.5,
      bestFor: ['Victorian Gothic architecture', 'Cafe Leopold & Mondegar', 'Art galleries in Kala Ghoda', 'Sea promenade'],
      watchOutFor: ['Persistent street hawkers near Causeway', 'Monsoon humidity'],
      summary: 'The historic soul of Mumbai. High security presence, wide pavements, and fascinating heritage walks.',
      verdict: 'Top Pick'
    },
    {
      id: 'mum-nh-2',
      name: 'Bandra West & Bandstand',
      cityId: 'mumbai',
      safetyRating: 8.8,
      cleanlinessRating: 8.0,
      affordabilityRating: 6.2,
      transitRating: 8.5,
      vibeRating: 9.6,
      bestFor: ['Arabian Sea sunset walks', 'Hip artisan cafes', 'Portuguese heritage villages', 'Celebrity spotting'],
      watchOutFor: ['Evening autorickshaw queues', 'Narrow old lanes'],
      summary: 'Vibrant, cosmopolitan, and highly walkable with great seaside breezes.',
      verdict: 'Top Pick'
    }
  ]
};

export const SAFE_ROUTES: Record<string, SafeNavigationRoute[]> = {
  sf: [
    {
      id: 'sf-route-1',
      cityId: 'sf',
      fromName: 'Union Square (Central Hub)',
      toName: 'Ferry Building (Waterfront)',
      standard: {
        type: 'standard',
        title: 'Direct Fastest Walk via Market St',
        duration: '16 mins',
        distance: '1.2 km',
        safetyScore: 78,
        lightingQuality: 'Moderate',
        steps: [
          'Head east down Market Street towards 4th St',
          'Pass BART entrances at Montgomery Station',
          'Continue along Market past 1st St to the plaza'
        ],
        path: [
          [37.7879, -122.4075],
          [37.7885, -122.4040],
          [37.7910, -122.3995],
          [37.7940, -122.3960],
          [37.7955, -122.3937]
        ],
        highlights: ['Shortest travel time', 'Flat paved sidewalk'],
        warnings: ['Heavy bus exhaust and construction diversions near 3rd St', 'Noticeable panhandling around Montgomery transit stairs']
      },
      saferRoute: {
        type: 'safe',
        title: 'Well-Lit Heritage Corridor via Post & Embarcadero',
        duration: '21 mins',
        distance: '1.5 km',
        safetyScore: 95,
        lightingQuality: 'Well-Lit & Monitored',
        steps: [
          'Walk east along Post Street through the Financial District retail zone',
          'Turn left on Montgomery St past landmark banking buildings with 24/7 security',
          'Take California Street cable car route straight down to Embarcadero Plaza',
          'Cross at designated pedestrian signal to Ferry Building'
        ],
        path: [
          [37.7879, -122.4075],
          [37.7892, -122.4045],
          [37.7925, -122.4020],
          [37.7938, -122.3975],
          [37.7955, -122.3937]
        ],
        highlights: [
          '+17 Safety Score upgrade',
          'Continuous 24/7 building security & camera coverage',
          'Bright LED streetlights and wide sidewalks',
          'Avoids crowded transit station grates'
        ]
      }
    },
    {
      id: 'sf-route-2',
      cityId: 'sf',
      fromName: 'Chinatown Dragon Gate',
      toName: 'North Beach Washington Square',
      standard: {
        type: 'standard',
        title: 'Grant Avenue Direct Route',
        duration: '14 mins',
        distance: '1.1 km',
        safetyScore: 84,
        lightingQuality: 'Moderate',
        steps: [
          'Walk north directly along Grant Avenue through tourist retail',
          'Cross Broadway tunnel overpass',
          'Enter Columbus Avenue towards Washington Square Park'
        ],
        path: [
          [37.7907, -122.4057],
          [37.7940, -122.4065],
          [37.7975, -122.4068],
          [37.8008, -122.4100]
        ],
        highlights: ['Direct straight shot', 'Passing souvenir shops'],
        warnings: ['Narrow congested sidewalks with delivery crates', 'Dim lighting near Broadway intersection']
      },
      saferRoute: {
        type: 'safe',
        title: 'Columbus Avenue Open Vista Walk',
        duration: '17 mins',
        distance: '1.3 km',
        safetyScore: 96,
        lightingQuality: 'Well-Lit & Monitored',
        steps: [
          'Walk east one block to Kearny St then merge onto Columbus Ave',
          'Stroll past Sentinel Building and City Lights Bookstore with active sidewalk cafes',
          'Enjoy wide open sightlines and bright street lamps all the way to Washington Square'
        ],
        path: [
          [37.7907, -122.4057],
          [37.7920, -122.4040],
          [37.7960, -122.4055],
          [37.7985, -122.4075],
          [37.8008, -122.4100]
        ],
        highlights: [
          'High public visibility with open-air dining tables',
          'Broad sidewalks free of delivery clutter',
          'Historic literary landmarks with pleasant evening ambiance'
        ]
      }
    }
  ],
  nyc: [
    {
      id: 'nyc-route-1',
      cityId: 'nyc',
      fromName: 'Washington Square Park',
      toName: 'High Line Park (Gansevoort St)',
      standard: {
        type: 'standard',
        title: 'Direct West 4th St Walk',
        duration: '18 mins',
        distance: '1.4 km',
        safetyScore: 82,
        lightingQuality: 'Moderate',
        steps: [
          'Exit Washington Square Park west onto Washington Place',
          'Follow West 4th St across 7th Ave S',
          'Cut through Gansevoort St towards Meatpacking'
        ],
        path: [
          [40.7308, -73.9973],
          [40.7325, -74.0010],
          [40.7360, -74.0055],
          [40.7395, -74.0080]
        ],
        highlights: ['Classic West Village zig-zag'],
        warnings: ['Irregular street intersections can disorient walkers at night']
      },
      saferRoute: {
        type: 'safe',
        title: 'Well-Lit Hudson St & 8th Ave Stroll',
        duration: '22 mins',
        distance: '1.7 km',
        safetyScore: 95,
        lightingQuality: 'Well-Lit & Monitored',
        steps: [
          'Walk north on 5th Ave to 8th St (St. Mark’s / Greenwich Ave)',
          'Follow Greenwich Ave down wide, brightly illuminated commercial strip',
          'Turn onto 14th St and enter High Line pedestrian stairs'
        ],
        path: [
          [40.7308, -73.9973],
          [40.7335, -73.9995],
          [40.7370, -74.0040],
          [40.7395, -74.0080]
        ],
        highlights: [
          'Broad continuous avenues with 100% active storefront lighting',
          'Staffed subway station exits along the route',
          'Smooth ADA-compliant crosswalk curb ramps'
        ]
      }
    }
  ]
};
