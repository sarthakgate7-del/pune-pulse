import { City, LocationSpot, NeighborhoodComparison, SafeNavigationRoute, CitizenReport, HeritageTrail } from '../types';

export const PUNE_CITY: City = {
  id: 'pune',
  name: 'Pune',
  country: 'India (Maharashtra)',
  center: [18.5204, 73.8567],
  zoom: 13,
  weather: {
    temp: '26°C (79°F)',
    condition: 'Pleasant Breeze & Clear',
    humidity: '54%',
    alert: 'Pleasant evening cooling; Mutha river discharge normal at Khadakwasla'
  },
  trafficStatus: 'Moderate',
  safetyIndex: 91,
  cleanlinessIndex: 84,
  transitScore: 86,
  currency: 'INR (₹)',
  emergencyNumber: '112'
};

export const PUNE_SPOTS: LocationSpot[] = [
  // HERITAGE & CULTURE
  {
    id: 'pune-1',
    name: 'Shaniwar Wada Fort Palace',
    category: 'culture',
    cityId: 'pune',
    coordinates: [18.5196, 73.8553],
    neighborhood: 'Kasba Peth / Shaniwar Peth',
    rating: 4.8,
    reviewCount: 38200,
    costLevel: '$$', // Small ASI entry fee
    description: '1732 seat of the Peshwa rulers of the Maratha Empire. Marvel at the imposing Dilli Darwaza with elephant-deterrent spikes, courtyards, fountain foundations, and lush rampart gardens.',
    safetyScore: 92,
    cleanlinessScore: 85,
    accessibilityScore: 80,
    verifiedTips: [
      'Enter via Dilli Darwaza; security guards stationed at all entrances',
      'Climb the fortress bastions for panoramic views of Kasba Peth and the historic skyline',
      'Audio guides and evening sound & light show available in Marathi and English'
    ],
    bestTimeToVisit: '9:00 AM - 11:30 AM or 4:30 PM - 6:30 PM',
    tags: ['Maratha Heritage', 'Historic Fort', 'ASI Monument', 'Peshwa History'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'pune-2',
    name: 'Aga Khan Palace & Gandhi Memorial',
    category: 'culture',
    cityId: 'pune',
    coordinates: [18.5529, 73.9015],
    neighborhood: 'Kalyani Nagar / Nagar Road',
    rating: 4.9,
    reviewCount: 24500,
    costLevel: '$',
    description: 'Built in 1892 by Sultan Muhammed Shah Aga Khan III. Served as the prison for Mahatma Gandhi, Kasturba Gandhi, and Mahadev Desai during the 1942 Quit India Movement. Houses Gandhi\'s samadhi amid 19-acre Italian-arched gardens.',
    safetyScore: 97,
    cleanlinessScore: 96,
    accessibilityScore: 92,
    verifiedTips: [
      'Very calm and peaceful sanctuary away from Nagar Road traffic',
      'Wide stone paths and ramps suitable for elderly and wheelchairs',
      'Photography permitted in outdoor lawns and museum corridors'
    ],
    bestTimeToVisit: '10:00 AM - 1:00 PM',
    tags: ['Freedom Struggle', 'National Monument', 'Serene Gardens', 'Heritage Architecture'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Quiet'
  },
  {
    id: 'pune-3',
    name: 'Pataleshwar Cave Temple (8th Century)',
    category: 'culture',
    cityId: 'pune',
    coordinates: [18.5283, 73.8497],
    neighborhood: 'Shivajinagar / JM Road',
    rating: 4.7,
    reviewCount: 14200,
    costLevel: 'Free',
    description: 'Monolithic rock-cut cave temple dedicated to Lord Shiva, carved from single basalt rock during the Rashtrakuta period. Features massive stone pillars, Nandi mandapa, and natural underground cool temperature.',
    safetyScore: 94,
    cleanlinessScore: 88,
    accessibilityScore: 84,
    verifiedTips: [
      'Free public heritage monument managed by ASI right on busy JM Road',
      'Naturally cool respite even on warm sunny afternoons',
      'Adjacent to Jangli Maharaj temple; peaceful shaded benches for reading'
    ],
    bestTimeToVisit: '8:30 AM - 11:00 AM',
    tags: ['Rock Cut Cave', 'Ancient Monument', 'Free Heritage', 'Centuries Old'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Quiet'
  },
  {
    id: 'pune-4',
    name: 'Dagdusheth Halwai Ganpati Temple & Tulshibaug',
    category: 'culture',
    cityId: 'pune',
    coordinates: [18.5165, 73.8560],
    neighborhood: 'Budhwar Peth',
    rating: 4.9,
    reviewCount: 65000,
    costLevel: 'Free',
    description: 'One of the most revered and ornate Ganesh shrines in Maharashtra, founded in 1893. The deity is adorned with gold and jewels, attracting devotees from across the globe. Adjoins the bustling heritage market lanes of Tulshibaug.',
    safetyScore: 88,
    cleanlinessScore: 82,
    accessibilityScore: 78,
    verifiedTips: [
      '24/7 high police security and bag screening queues',
      'Morning 6 AM aarti is serene and less crowded than evening',
      'Keep footwear at designated temple token counters',
      'Narrow lanes nearby: park two-wheelers at Mandai parking complex'
    ],
    bestTimeToVisit: 'Early morning (6:30 AM - 8:30 AM)',
    tags: ['Revered Shrine', 'Cultural Epicenter', 'Historic Market', 'Tulshibaug'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },

  // FOOD & LOCAL GEMS
  {
    id: 'pune-5',
    name: 'Cafe Goodluck (Since 1935)',
    category: 'food',
    cityId: 'pune',
    coordinates: [18.5173, 73.8415],
    neighborhood: 'Deccan Gymkhana / FC Road',
    rating: 4.8,
    reviewCount: 28900,
    costLevel: '$',
    description: 'Pune\'s most legendary Irani cafe at Goodluck Chowk. Celebrated for freshly baked bun maska dipped in steaming hot Irani chai, mutton keema pav, egg bhurji, and caramel custard.',
    safetyScore: 95,
    cleanlinessScore: 86,
    accessibilityScore: 85,
    verifiedTips: [
      'Peak rush between 8 AM - 10 AM and 5 PM - 8 PM; table sharing is common and fun',
      'Order bun maska with extra dollop of white butter and Kadak Chai',
      'FC Road Metro Station is just a 4-minute walk away'
    ],
    bestTimeToVisit: '7:30 AM - 9:30 AM or Late Evening',
    tags: ['Iconic Irani Cafe', 'Bun Maska Chai', 'Student Institution', 'Budget Legend'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'pune-6',
    name: 'Vaishali Restaurant',
    category: 'food',
    cityId: 'pune',
    coordinates: [18.5208, 73.8407],
    neighborhood: 'Fergusson College (FC) Road',
    rating: 4.8,
    reviewCount: 36000,
    costLevel: '$',
    description: 'The cultural beating heart of FC Road where generations of students, professors, artists, and leaders gather. Famous for SPDP (Sev Potato Dahi Puri), Mysore Masala Dosa, and frothy South Indian Filter Coffee in the garden courtyard.',
    safetyScore: 96,
    cleanlinessScore: 92,
    accessibilityScore: 88,
    verifiedTips: [
      'Wait for courtyard garden seating under the tree canopy',
      'The SPDP here is the gold standard of Pune street snack culture',
      'Well-lit pedestrian sidewalks and bustling crowd outside until 11 PM'
    ],
    bestTimeToVisit: '4:00 PM - 7:00 PM',
    tags: ['FC Road Iconic', 'SPDP', 'Filter Coffee', 'Student Hangout'],
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'pune-7',
    name: 'Bedekar Tea Stall (Authentic Puneri Misal)',
    category: 'food',
    cityId: 'pune',
    coordinates: [18.5147, 73.8504],
    neighborhood: 'Narayan Peth',
    rating: 4.7,
    reviewCount: 18400,
    costLevel: '$',
    description: 'Traditional Puneri Misal in the heart of old Peth. Unlike Kolhapur spicy misal, Bedekar misal has a subtle hint of jaggery, poha base, crunchy farsan, lemon, and sliced bread with a side of extra rassa (tarri).',
    safetyScore: 90,
    cleanlinessScore: 84,
    accessibilityScore: 75,
    verifiedTips: [
      'Opens 7:30 AM and misal sells out by 1:30 PM; Monday is weekly off',
      'Ask for "Shev" and lemon wedge to balance the tarri',
      'Narrow Peth alley: approach on foot or two-wheeler from Laxmi Road'
    ],
    bestTimeToVisit: '8:00 AM - 10:30 AM',
    tags: ['Puneri Misal', 'Historic Peth Food', 'Breakfast Gem', 'Local Tradition'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'pune-8',
    name: 'Sujata Mastani (Since 1968)',
    category: 'food',
    cityId: 'pune',
    coordinates: [18.5126, 73.8519],
    neighborhood: 'Sadashiv Peth',
    rating: 4.8,
    reviewCount: 19800,
    costLevel: '$',
    description: 'Pune\'s quintessential dessert creation: Mastani is an ultra-thick, luscious fruit shake crowned with rich homemade ice cream scoops, dry fruits, and tutti frutti. Named in honor of Peshwa Bajirao\'s beloved warrior-queen Mastani.',
    safetyScore: 94,
    cleanlinessScore: 90,
    accessibilityScore: 85,
    verifiedTips: [
      'Try the classic Mango Mastani or Kesar Pista Mastani',
      'Eat with a spoon first, then drink with a straw',
      'Multiple branches across Pune, but the Sadashiv Peth original has classic charm'
    ],
    bestTimeToVisit: 'Post lunch (2 PM) or after dinner (9 PM)',
    tags: ['Pune Special Dessert', 'Mango Mastani', 'Sweet Tooth', 'Authentic Tradition'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Moderate'
  },
  {
    id: 'pune-9',
    name: 'Kayani Bakery (Shrewsbury Biscuits & Mawa Cake)',
    category: 'food',
    cityId: 'pune',
    coordinates: [18.5140, 73.8767],
    neighborhood: 'East Street, Camp (Pune Cantonment)',
    rating: 4.7,
    reviewCount: 22100,
    costLevel: '$',
    description: 'Founded in 1955 by Parsi brothers on East Street. World-famous for buttery, melt-in-mouth Shrewsbury biscuits, dense mawa cakes, and Brazilian walnut cookies packed in iconic brown paper boxes.',
    safetyScore: 94,
    cleanlinessScore: 89,
    accessibilityScore: 82,
    verifiedTips: [
      'Biscuits come out hot in batches at 7:30 AM and 3:30 PM; queues form quickly',
      'Cash and UPI accepted; limits per customer during festive rush',
      'Cantonment area has wide, disciplined pavements and great evening walking ambiance'
    ],
    bestTimeToVisit: '3:30 PM sharp for fresh evening batch',
    tags: ['Kayani Bakery', 'Shrewsbury Biscuits', 'Camp Heritage', 'Parsi Bakery'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'pune-10',
    name: 'German Bakery & Koregaon Park Cafes',
    category: 'food',
    cityId: 'pune',
    coordinates: [18.5362, 73.8938],
    neighborhood: 'Koregaon Park (Lane 1)',
    rating: 4.6,
    reviewCount: 31000,
    costLevel: '$$',
    description: 'Iconic bohemian cafe on Lane 1 surrounded by Koregaon Park\'s towering banyan and rain trees. Serving herbal teas, apple strudel, German sausages, salads, and artisan espresso.',
    safetyScore: 95,
    cleanlinessScore: 93,
    accessibilityScore: 90,
    verifiedTips: [
      'Outdoor patio seating has lovely evening ambient lights and breeze',
      'Very safe, cosmopolitan neighborhood with wide sidewalks and night patrolling',
      'Right next to Osho Ashram precinct and boutique stores'
    ],
    bestTimeToVisit: '5:00 PM - 10:00 PM',
    tags: ['Artisan Bakery', 'Koregaon Park', 'Outdoor Dining', 'Cosmopolitan'],
    crowdStatus: 'Bustling'
  },

  // ATTRACTIONS & STAY
  {
    id: 'pune-11',
    name: 'Osho Teerth Park & Nala Zen Garden',
    category: 'attraction',
    cityId: 'pune',
    coordinates: [18.5398, 73.8967],
    neighborhood: 'Koregaon Park (Lane 2 / 3)',
    rating: 4.8,
    reviewCount: 8200,
    costLevel: 'Free',
    description: 'A miraculous ecological transformation of a former sewage canal into a pristine 12-acre Japanese-style Zen garden with bamboo groves, wooden bridges, koi ponds, and natural waterfalls.',
    safetyScore: 98,
    cleanlinessScore: 96,
    accessibilityScore: 86,
    verifiedTips: [
      'Open morning (6 AM - 9 AM) and evening (3 PM - 6 PM)',
      'Pin-drop silence maintained; ideal for quiet reflection or birdwatching',
      'Extremely safe, guarded park maintained with precision'
    ],
    bestTimeToVisit: '6:30 AM - 8:30 AM',
    tags: ['Zen Garden', 'Ecological Wonder', 'Quiet Oasis', 'Bamboo Walks'],
    isBudgetFriendly: true,
    crowdStatus: 'Quiet'
  },
  {
    id: 'pune-12',
    name: 'Sinhagad Fort Ridge & Kanda Bhaji Stalls',
    category: 'attraction',
    cityId: 'pune',
    coordinates: [18.3663, 73.7559],
    neighborhood: 'Sinhagad Ghats (Southwest Ridge)',
    rating: 4.9,
    reviewCount: 52000,
    costLevel: 'Free',
    description: 'The "Lion\'s Fort" perched at 1,312 meters atop Bhuleshwar range. Famous for Tanaji Malusare\'s heroic 1670 battle. Visitors hike or take ghat e-buses to savor steaming hot Pitla Bhakri with thecha, Kanda Bhaji, and fresh Matka Dahi.',
    safetyScore: 89,
    cleanlinessScore: 78,
    accessibilityScore: 68,
    verifiedTips: [
      'PMDC/PMPML runs frequent electric feeder buses from base to top parking',
      'Must-try: Village women cooking fresh jowar bhakri on firewood stoves',
      'Wear grippy shoes; rocks can be slippery during wet spells'
    ],
    bestTimeToVisit: 'Sunrise (6:00 AM - 9:00 AM) for mist and cool valley breezes',
    tags: ['Mountain Fortress', 'Pitla Bhakri', 'Trek & View', 'Maratha Valor'],
    isHeritage: true,
    isBudgetFriendly: true,
    crowdStatus: 'Bustling'
  },
  {
    id: 'pune-13',
    name: 'Viman Nagar Lifestyle & Symbiosis Boulevard',
    category: 'stay',
    cityId: 'pune',
    coordinates: [18.5620, 73.9168],
    neighborhood: 'Viman Nagar',
    rating: 4.7,
    reviewCount: 14500,
    costLevel: '$$',
    description: 'One of Pune\'s most modern, youthful, and convenient hubs near Pune International Airport. Packed with boutique hotels, student food alleys, Phoenix Marketcity, and safe 24/7 cafes.',
    safetyScore: 94,
    cleanlinessScore: 90,
    accessibilityScore: 92,
    verifiedTips: [
      'Just 8 minutes from Pune Airport (PNQ)',
      'Cabs and auto-rickshaws easily available at all hours',
      'Wide well-lit avenues with active college crowd until late'
    ],
    bestTimeToVisit: 'Anytime; very safe residential and retail hub',
    tags: ['Near Airport', 'Modern Hub', 'Safe For Solo Travelers', 'Great Cafes'],
    crowdStatus: 'Moderate'
  },

  // REAL URBAN CHAOS & HAZARDS TO NAVIGATE
  {
    id: 'pune-14',
    name: 'University Circle / SPPU Flyover Construction Bottleneck',
    category: 'hazard',
    cityId: 'pune',
    coordinates: [18.5362, 73.8276],
    neighborhood: 'Shivajinagar / Ganeshkhind Road',
    rating: 2.2,
    reviewCount: 420,
    costLevel: 'Free',
    description: 'Multi-level metro and flyover construction junction connecting Aundh, Baner, Pashan, and Shivajinagar. Frequent slow-moving traffic jams, barricaded lane merges, and uneven asphalt.',
    safetyScore: 56,
    cleanlinessScore: 50,
    accessibilityScore: 58,
    verifiedTips: [
      'Avoid between 9:00 AM - 11:00 AM and 6:30 PM - 8:30 PM',
      'Use Senapati Bapat Road or Range Hills alternate corridor to bypass the main circle',
      'Pedestrians: use the dedicated temporary zebra crossings with traffic warden guidance'
    ],
    bestTimeToVisit: 'Afternoon non-peak hours (1:00 PM - 4:00 PM)',
    tags: ['Traffic Choke Point', 'Construction Zone', 'Metro Work', 'Avoid Peak Hours'],
    hazardAlert: 'Heavy congestion & ongoing metro construction diversions. Plan +15 mins buffer.',
    crowdStatus: 'Congested'
  },
  {
    id: 'pune-15',
    name: 'Hinjawadi Wakad Bridge & IT Park Phase 1 Junction',
    category: 'hazard',
    cityId: 'pune',
    coordinates: [18.5987, 73.7632],
    neighborhood: 'Hinjawadi / Wakad Flyover',
    rating: 2.0,
    reviewCount: 560,
    costLevel: 'Free',
    description: 'Major transit bottleneck where Pune-Bangalore highway meets the Rajiv Gandhi Infotech Park. Long queues of IT company shuttles, water logging during monsoon showers, and congested two-wheeler lanes.',
    safetyScore: 62,
    cleanlinessScore: 58,
    accessibilityScore: 64,
    verifiedTips: [
      'Peak gridlock between 6:00 PM - 8:30 PM heading towards Wakad',
      'Take the Bhumkar Chowk alternate underpass if coming from Baner',
      'Keep offline maps ready as mobile networks occasionally drop under the bridge'
    ],
    bestTimeToVisit: 'Midday (11:00 AM - 4:00 PM)',
    tags: ['IT Corridor Gridlock', 'Monsoon Waterlogging', 'Highway Merge', 'Peak Jam'],
    hazardAlert: 'Severe commute bottleneck during evening IT shifts (6 PM - 8:30 PM).',
    crowdStatus: 'Congested'
  },
  {
    id: 'pune-16',
    name: 'Swargate Bus Terminal & Jedhe Chowk Crowds',
    category: 'hazard',
    cityId: 'pune',
    coordinates: [18.5018, 73.8596],
    neighborhood: 'Swargate / Shankar Sheth Road',
    rating: 2.8,
    reviewCount: 310,
    costLevel: 'Free',
    description: 'Massive inter-city MSRTC and PMPML bus depot intersection. Extremely high footfall, congested pedestrian subways, and occasional citizen reports of pickpocketing during rush hours.',
    safetyScore: 68,
    cleanlinessScore: 60,
    accessibilityScore: 72,
    verifiedTips: [
      'Keep wallets and mobile phones in zippered front pockets',
      'Use newly opened Swargate Underground Metro Station for clean, safe grade-separated transit',
      'Avoid poorly lit corners behind the old depot platforms after 10 PM'
    ],
    bestTimeToVisit: 'Daylight hours',
    tags: ['High Footfall', 'Pickpocket Caution', 'Bus Hub', 'Subway Caution'],
    hazardAlert: 'Crowded transit interchange: remain vigilant of belongings around bus platforms.',
    crowdStatus: 'Congested'
  }
];

export const PUNE_NEIGHBORHOODS: NeighborhoodComparison[] = [
  {
    id: 'pune-nh-1',
    name: 'Koregaon Park (KP) & Kalyani Nagar',
    cityId: 'pune',
    safetyRating: 9.5,
    cleanlinessRating: 9.3,
    affordabilityRating: 5.6,
    transitRating: 8.6,
    vibeRating: 9.8,
    bestFor: [
      'Lush green canopy and quiet residential lanes (Lanes 1 to 7)',
      'World-class artisan cafes, Italian trattorias, and craft breweries',
      'Osho Teerth Zen Garden and peaceful evening walks',
      'Safe for solo evening walks and women'
    ],
    watchOutFor: [
      'High rents and upscale dining prices',
      'Weekend evening parking scarcity near popular restaurant hubs'
    ],
    summary: 'Pune’s most cosmopolitan, leafy, and upscale neighborhood. Superb night security, wide tree-lined lanes, and an unmatched European-style cafe culture.',
    verdict: 'Top Pick'
  },
  {
    id: 'pune-nh-2',
    name: 'FC Road, Deccan Gymkhana & BMCC',
    cityId: 'pune',
    safetyRating: 9.3,
    cleanlinessRating: 8.4,
    affordabilityRating: 8.8,
    transitRating: 9.4,
    vibeRating: 9.7,
    bestFor: [
      'Electrifying student energy and affordable street shopping',
      'Iconic food institutions: Goodluck Cafe, Vaishali, Rupali, Wadeshwar',
      'Direct Pune Metro access (Deccan Gymkhana & Chhatrapati Sambhaji Udyan stations)',
      'Historic Fergusson College campus architecture'
    ],
    watchOutFor: [
      'Heavy pedestrian crowds and pavement book stalls on weekends',
      'Two-wheeler traffic can be fast-paced on one-way stretches'
    ],
    summary: 'The energetic student and cultural core of Pune. Highly walkable, safe until late night with constant police patrolling, and paradise for budget foodies.',
    verdict: 'Top Pick'
  },
  {
    id: 'pune-nh-3',
    name: 'Kothrud & Karve Nagar',
    cityId: 'pune',
    safetyRating: 9.6,
    cleanlinessRating: 8.9,
    affordabilityRating: 7.8,
    transitRating: 8.9,
    vibeRating: 8.8,
    bestFor: [
      'Authentic Maharashtrian cultural ethos and family-safe parks',
      'Pune Metro Line 2 (Vanaz to Ramwadi) direct connectivity',
      'Traditional sweets, organic vegetable markets, and cultural theaters (Yashwantrao Chavan)',
      'Lowest crime rate and peaceful retirement neighborhoods'
    ],
    watchOutFor: [
      'Early closing hours for traditional shops (most shut by 9:30 PM)',
      'Chandani Chowk junction traffic during highway weekend rushes'
    ],
    summary: 'Often recognized among India’s fastest-growing residential hubs with rich cultural roots. Exceptional safety, clean residential societies, and great family amenities.',
    verdict: 'Top Pick'
  },
  {
    id: 'pune-nh-4',
    name: 'Old Peth Areas (Sadashiv, Narayan, Kasba, Budhwar)',
    cityId: 'pune',
    safetyRating: 8.4,
    cleanlinessRating: 6.8,
    affordabilityRating: 9.2,
    transitRating: 7.8,
    vibeRating: 9.4,
    bestFor: [
      'Shaniwar Wada, Lal Mahal, and deep Peshwa architectural history',
      'Legendary authentic Puneri Misal, Sujata Mastani, and Bakarwadi',
      'Traditional brassware, copperware, and textile markets in Tulshibaug',
      'Ganesh festival cultural celebrations and dhol-tasha heritage'
    ],
    watchOutFor: [
      'Extremely narrow one-way historic lanes; virtually impossible for 4-wheelers',
      'High noise levels and dense two-wheeler buzz during trading hours',
      'Dim lighting in winding internal wada alleys after 9 PM'
    ],
    summary: 'The historic soul and 300-year-old memory of Pune. Incredible for walking food tours and heritage sights during daytime, but traffic chaos for vehicles.',
    verdict: 'Budget Friendly'
  },
  {
    id: 'pune-nh-5',
    name: 'Hinjawadi & Wakad (IT Belt)',
    cityId: 'pune',
    safetyRating: 7.4,
    cleanlinessRating: 7.2,
    affordabilityRating: 7.0,
    transitRating: 5.5,
    vibeRating: 7.0,
    bestFor: [
      'Walk-to-work convenience for tech campuses (Infosys, TCS, Wipro, Cognizant)',
      'Modern high-rise gated societies with gyms and swimming pools',
      'Multi-cuisine delivery restaurants and weekend sports arenas'
    ],
    watchOutFor: [
      'Infamous peak hour traffic jams at Wakad bridge and Shivaji Chowk',
      'Incomplete pedestrian walkways and construction dust from ongoing Metro Line 3',
      'Poor street lighting on isolated connecting link roads at night'
    ],
    summary: 'Modern IT powerhouse with great gated societies, but suffers from Pune\'s most acute commuting friction and unfinished public footpaths.',
    verdict: 'Caution After Dusk'
  },
  {
    id: 'pune-nh-6',
    name: 'Camp (Pune Cantonment) & MG Road',
    cityId: 'pune',
    safetyRating: 9.2,
    cleanlinessRating: 8.8,
    affordabilityRating: 7.4,
    transitRating: 8.5,
    vibeRating: 9.2,
    bestFor: [
      'Disciplined Cantonment board roads and heritage colonial bungalows',
      'Kayani Bakery (Shrewsbury biscuits) and Marz-O-Rin chicken sandwiches',
      'MG Road evening walking plaza and Parsi deli specialties',
      'Clean, orderly environment with visible military/cantonment oversight'
    ],
    watchOutFor: [
      'Strict Cantonment traffic rules (zero tolerance for illegal parking or wrong side driving)',
      'Vehicle toll booths at Cantonment entry points for commercial vehicles'
    ],
    summary: 'A wonderful blend of British colonial heritage and Parsi culinary traditions. Wide, well-swept roads, very safe, and pleasant for relaxed family evening walks.',
    verdict: 'Top Pick'
  }
];

export const PUNE_SAFE_ROUTES: SafeNavigationRoute[] = [
  {
    id: 'pune-route-1',
    cityId: 'pune',
    fromName: 'FC Road (Goodluck Cafe, Deccan)',
    toName: 'Shaniwar Wada Fort (Kasba Peth)',
    standard: {
      type: 'standard',
      title: 'Direct Narayan Peth Alleys Walk',
      duration: '22 mins',
      distance: '1.9 km',
      safetyScore: 76,
      lightingQuality: 'Moderate',
      steps: [
        'Exit Goodluck Chowk east onto Fergusson College Road',
        'Cross Karve Road junction towards Z-Bridge pedestrian crossover',
        'Walk through narrow Narayan Peth internal lanes past old wadas',
        'Navigate dense two-wheeler traffic near Appa Balwant Chowk into Shaniwar Wada plaza'
      ],
      path: [
        [18.5173, 73.8415],
        [18.5165, 73.8465],
        [18.5160, 73.8500],
        [18.5180, 73.8530],
        [18.5196, 73.8553]
      ],
      highlights: ['Direct passage', 'Passes classic local sweet shops'],
      warnings: [
        'Z-Bridge steps and narrow Narayan Peth lanes are congested with delivery bikes',
        'Intermittent dim street lighting in residential wada alleys after 8:30 PM'
      ]
    },
    saferRoute: {
      type: 'safe',
      title: 'Well-Lit JM Road & Chhatrapati Sambhaji Bridge Promenade',
      duration: '26 mins',
      distance: '2.3 km',
      safetyScore: 96,
      lightingQuality: 'Well-Lit & Monitored',
      steps: [
        'Walk north along brightly illuminated Jangli Maharaj (JM) Road sidewalk',
        'Turn onto Chhatrapati Sambhaji Bridge (Lakdi Pul) with wide dedicated pedestrian railings',
        'Pass Sambhaji Park entrance with continuous LED streetlights and municipal CCTV',
        'Enter Shaniwar Wada via the grand open plaza of Dilli Darwaza'
      ],
      path: [
        [18.5173, 73.8415],
        [18.5220, 73.8440],
        [18.5235, 73.8480],
        [18.5215, 73.8520],
        [18.5196, 73.8553]
      ],
      highlights: [
        '+20 Safety Score upgrade',
        '100% brightly illuminated arterial road with wide, clean footpaths',
        'Continuous active storefronts, juice centers, and traffic police presence',
        'Zero blind turns or dark alleys'
      ]
    }
  },
  {
    id: 'pune-route-2',
    cityId: 'pune',
    fromName: 'Pune Railway Station (Central)',
    toName: 'Koregaon Park (German Bakery / Lane 1)',
    standard: {
      type: 'standard',
      title: 'Direct Mangaldas Underpass Route',
      duration: '18 mins',
      distance: '2.1 km',
      safetyScore: 72,
      lightingQuality: 'Moderate',
      steps: [
        'Exit Station South Gate onto Raja Bahadur Mill Road',
        'Pass under Mangaldas railway overbridge',
        'Cut through Sangamvadi link path toward North Main Road'
      ],
      path: [
        [18.5289, 73.8744],
        [18.5310, 73.8810],
        [18.5340, 73.8870],
        [18.5362, 73.8938]
      ],
      highlights: ['Shortest direct auto/walk route'],
      warnings: [
        'Dim railway underpass sections with sparse pedestrian sidewalks',
        'High speeding traffic coming off the highway connector'
      ]
    },
    saferRoute: {
      type: 'safe',
      title: 'Illuminated Bund Garden & South Main Road Corridor',
      duration: '23 mins',
      distance: '2.6 km',
      safetyScore: 95,
      lightingQuality: 'Well-Lit & Monitored',
      steps: [
        'Head east along Bund Garden Road past Police Commissionerate & Council Hall',
        'Cross Fitzgerald Bridge over the serene Mula-Mutha river with bright LED lamps',
        'Turn into tree-lined Koregaon Park South Main Road with 24/7 private security guards',
        'Reach German Bakery on Lane 1 via paved walkway'
      ],
      path: [
        [18.5289, 73.8744],
        [18.5325, 73.8790],
        [18.5370, 73.8860],
        [18.5375, 73.8910],
        [18.5362, 73.8938]
      ],
      highlights: [
        'Guarded diplomatic and administrative corridor with active police patrols',
        'Broad river bridge with safe, separated pedestrian walkway',
        'Continuous ambient lighting and CCTV throughout Koregaon Park lanes'
      ]
    }
  },
  {
    id: 'pune-route-3',
    cityId: 'pune',
    fromName: 'Viman Nagar (Phoenix Marketcity)',
    toName: 'Kalyani Nagar (Jogger’s Park & Aga Khan Palace)',
    standard: {
      type: 'standard',
      title: 'Direct Vadgaon Sheri Internal Cut',
      duration: '16 mins',
      distance: '1.7 km',
      safetyScore: 74,
      lightingQuality: 'Moderate',
      steps: [
        'Exit Phoenix Marketcity rear gate',
        'Cut across Vadgaon Sheri village residential lanes',
        'Enter Kalyani Nagar via canal culvert'
      ],
      path: [
        [18.5620, 73.9168],
        [18.5580, 73.9120],
        [18.5550, 73.9060],
        [18.5529, 73.9015]
      ],
      highlights: ['Saves 600 meters of walking'],
      warnings: [
        'Narrow lane with open drains and occasional stray dogs after dark',
        'Uneven road surface without proper sidewalks'
      ]
    },
    saferRoute: {
      type: 'safe',
      title: 'Well-Lit East Avenue & Nagar Road Boulevard',
      duration: '21 mins',
      distance: '2.2 km',
      safetyScore: 95,
      lightingQuality: 'Well-Lit & Monitored',
      steps: [
        'Walk down Viman Nagar Central Avenue past Symbiosis Law School',
        'Follow Nagar Road wide pedestrian sidewalk with BRTS lighting',
        'Turn onto Kalyani Nagar Main Road past Aga Khan Palace heritage gates'
      ],
      path: [
        [18.5620, 73.9168],
        [18.5600, 73.9100],
        [18.5560, 73.9050],
        [18.5529, 73.9015]
      ],
      highlights: [
        '+21 Safety Score upgrade',
        'Broad, well-paved sidewalks with tactile paving',
        'Active college students and residential watchmen stationed along the entire path',
        'Easy emergency auto-rickshaw availability'
      ]
    }
  }
];

export const PUNE_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'pune-rep-1',
    city: 'Pune',
    category: 'traffic',
    title: 'University Circle Metro Pier Work: 15-min delay on Ganeshkhind Rd',
    description: 'Crane maneuvering for Pune Metro Line 3 pier erection near E-Square. Traffic moving at walking pace towards Shivajinagar. Recommended diversion: Senapati Bapat Road or Range Hills.',
    locationName: 'Ganeshkhind Road near E-Square, Shivajinagar',
    coordinates: [18.5362, 73.8276],
    status: 'Verified by 24 citizens',
    upvotes: 42,
    timestamp: '18 mins ago',
    severity: 'High'
  },
  {
    id: 'pune-rep-2',
    city: 'Pune',
    category: 'hazard',
    title: 'Two streetlights not working on North Main Rd near Lane 4',
    description: 'Paved footpath is pitch dark under dense banyan tree canopy between Lane 4 and Lane 5. Joggers and walkers please use the opposite sidewalk with bright hotel security lights.',
    locationName: 'North Main Road, Koregaon Park',
    coordinates: [18.5380, 73.8980],
    status: 'Reported to PMC Ward Office',
    upvotes: 19,
    timestamp: '45 mins ago',
    severity: 'Medium'
  },
  {
    id: 'pune-rep-3',
    city: 'Pune',
    category: 'gem',
    title: 'Secret terrace sit-out with vintage Marathi books & organic filter coffee',
    description: 'Hidden on 2nd floor above an old bungalow near Prabhat Road Lane 14. Super quiet, breezy tree-top views, free Wi-Fi, and delicious sabudana vada on weekends.',
    locationName: 'Lane 14, Prabhat Road, Deccan',
    coordinates: [18.5140, 73.8350],
    status: 'Community approved',
    upvotes: 68,
    timestamp: '2 hours ago',
    severity: 'Low'
  },
  {
    id: 'pune-rep-4',
    city: 'Pune',
    category: 'weather',
    title: 'Khadakwasla Dam water discharge alert: Mutha riverbed precautions',
    description: 'Irrigation department announced 2,500 cusecs controlled water release. Baba Bhide Bridge / riverside causeway closed for parking. Park vehicles on JM Road.',
    locationName: 'Bhide Bridge, Mutha Riverbed, Deccan',
    coordinates: [18.5190, 73.8475],
    status: 'PMC Official Advisory',
    upvotes: 84,
    timestamp: '3 hours ago',
    severity: 'High'
  },
  {
    id: 'pune-rep-5',
    city: 'Pune',
    category: 'hazard',
    title: 'Wakad Bridge IT commute bottleneck easing after 8:30 PM',
    description: 'Water ponding near the highway underpass has cleared. PMPML electric buses running on schedule now.',
    locationName: 'Wakad Flyover, Hinjawadi Entry',
    coordinates: [18.5987, 73.7632],
    status: 'Verified by 14 citizens',
    upvotes: 27,
    timestamp: '4 hours ago',
    severity: 'Low'
  }
];

export const PUNE_HERITAGE_TRAIL: HeritageTrail = {
  id: 'pune-heritage-trail-1',
  title: 'Peshwa & Maratha Heritage Walking Trail',
  subtitle: 'A historical journey through 1,200 years of rock-cut temples, fortified bastions, and wada architecture',
  totalDistance: '2.4 km',
  estimatedDuration: '45 mins walking (1.5 hrs with sightseeing)',
  stopsCount: 5,
  recommendedStartingPoint: 'Pataleshwar Cave Temple (JM Road)',
  bestTime: 'Morning (8:00 AM - 11:30 AM) or Late Afternoon (4:00 PM - 6:30 PM)',
  safetyScore: 94,
  path: [
    [18.5283, 73.8497], // Pataleshwar Caves
    [18.5260, 73.8480], // JM Road south
    [18.5235, 73.8475], // Sambhaji Park
    [18.5215, 73.8520], // Sambhaji Bridge (Lakdi Pul)
    [18.5200, 73.8540], // Kasba Peth entrance
    [18.5196, 73.8553], // Shaniwar Wada
    [18.5186, 73.8568], // Lal Mahal
    [18.5170, 73.8565], // Nana Wada & Kasba Ganpati
    [18.5155, 73.8548], // Bajirao Road corridor
    [18.5140, 73.8535], // Vishrambaug Wada
  ],
  stops: [
    {
      id: 'heritage-stop-1',
      order: 1,
      name: 'Pataleshwar Cave Temple',
      marathiName: 'पाताळेश्वर गुहा मंदिर',
      era: 'Rashtrakuta Dynasty',
      yearBuilt: '8th Century AD (~750 AD)',
      coordinates: [18.5283, 73.8497],
      neighborhood: 'Shivajinagar / JM Road',
      durationMinutes: 20,
      audioDurationSeconds: 42,
      entryFee: 'Free Admission',
      audioGuideSummary: 'Welcome to Pataleshwar Cave, Pune’s oldest architectural wonder. Carved entirely from a single monolithic basalt rock in the 8th century during the Rashtrakuta dynasty, this underground temple honors Lord Shiva. Notice the monumental massive pillars and the circular Nandi pavilion. Even on hot summer afternoons, the natural stone subterranean interior remains remarkably cool and serene.',
      historicalSignificance: 'Predates the Maratha Empire and Peshwa capital; one of the oldest rock-cut monuments in the Deccan plateau.',
      architecturalHighlights: [
        'Monolithic basalt rock excavation',
        'Circular umbrella-roofed Nandi Mandapa',
        'Incomplete underground sanctum sanctorum',
        'Naturally cool micro-climate'
      ],
      walkingTipToNext: 'Head south on JM Road sidewalk, cross Chhatrapati Sambhaji Bridge into Kasba Peth (approx. 850m, 10 min walk).'
    },
    {
      id: 'heritage-stop-2',
      order: 2,
      name: 'Shaniwar Wada Fort Palace',
      marathiName: 'शनिवार वाडा',
      era: 'Peshwa Era (Maratha Empire Capital)',
      yearBuilt: '1732 AD',
      coordinates: [18.5196, 73.8553],
      neighborhood: 'Kasba Peth',
      durationMinutes: 30,
      audioDurationSeconds: 48,
      entryFee: '₹25 (ASI Token)',
      audioGuideSummary: 'You stand before Shaniwar Wada, the legendary fortified seat of the Peshwas, founded on a Saturday in 1732 by Peshwa Baji Rao the First. For over a century, this palace commanded the Maratha Empire spanning from Attock to Cuttack. Gaze at the imposing Dilli Darwaza, clad with steel spikes designed to repel war elephants. Inside, explore the stone foundations of the seven-story palace and the famous lotus-shaped fountain, Hazari Karanje.',
      historicalSignificance: 'The political and military headquarters of the Maratha Empire under the Peshwa prime ministers.',
      architecturalHighlights: [
        'Dilli Darwaza with elephant-deterrent spikes',
        'Stone ramparts & five historic gateways',
        'Sixteen-petal lotus fountain (Hazari Karanje)',
        'Lush municipal garden courtyards'
      ],
      walkingTipToNext: 'Exit through Dilli Darwaza and walk 180 meters east across the paved plaza to Lal Mahal on your right.'
    },
    {
      id: 'heritage-stop-3',
      order: 3,
      name: 'Lal Mahal (The Red Palace)',
      marathiName: 'लाल महाल',
      era: 'Early Maratha Swarajya',
      yearBuilt: '1630 AD',
      coordinates: [18.5186, 73.8568],
      neighborhood: 'Kasba Peth',
      durationMinutes: 15,
      audioDurationSeconds: 38,
      entryFee: 'Free / ₹5',
      audioGuideSummary: 'This is Lal Mahal, the historic Red Palace built in 1630 by Shahaji Raje Bhosale for his wife Jijabai and young son Shivaji. Within these walls, Chhatrapati Shivaji Maharaj grew up and mastered martial arts. In April 1663, Shivaji executed a legendary surprise night raid here, cutting off the fingers of Mughal governor Shaista Khan.',
      historicalSignificance: 'Childhood home of Chhatrapati Shivaji Maharaj and site of the legendary 1663 raid against Shaista Khan.',
      architecturalHighlights: [
        'Distinctive red brick and basalt exterior',
        'Historical oil paintings depicting Shivaji Maharaj\'s life',
        'Sculpture garden & Jijamata memorial hall'
      ],
      walkingTipToNext: 'Walk 200 meters south along Kasba Peth lane to reach Nana Wada and Kasba Ganpati Mandir.'
    },
    {
      id: 'heritage-stop-4',
      order: 4,
      name: 'Nana Wada & Kasba Ganpati',
      marathiName: 'नाना वाडा व ग्रामदैवत कसबा गणपती',
      era: 'Peshwa Regency',
      yearBuilt: '1780s AD',
      coordinates: [18.5170, 73.8565],
      neighborhood: 'Kasba Peth / Budhwar Peth',
      durationMinutes: 20,
      audioDurationSeconds: 40,
      entryFee: 'Free Admission',
      audioGuideSummary: 'Nana Wada was the personal residence of Nana Phadnavis, the mastermind statesman who unified the Maratha confederacy during challenging European colonial pressures. Admire the intricately carved teakwood pillars, pointed cypress-wood arches, and multi-courtyard layout. Directly adjacent stands Kasba Ganpati, consecrated by Jijabai in 1639 as the protector Gramdaivat of Pune.',
      historicalSignificance: 'Residence of Maratha statesman Nana Phadnavis and the spiritual founding shrine of modern Pune.',
      architecturalHighlights: [
        'Classic timber wada courtyard architecture',
        'Intricate Gujarati-style carved wooden brackets',
        '17th-century silver-plated temple sanctorum'
      ],
      walkingTipToNext: 'Walk 400 meters south along Bajirao Road past Tulshibaug to reach Vishrambaug Wada.'
    },
    {
      id: 'heritage-stop-5',
      order: 5,
      name: 'Vishrambaug Wada',
      marathiName: 'विश्रामबाग वाडा',
      era: 'Late Peshwa Period',
      yearBuilt: '1807 AD',
      coordinates: [18.5140, 73.8535],
      neighborhood: 'Bajirao Road / Sadashiv Peth',
      durationMinutes: 25,
      audioDurationSeconds: 44,
      entryFee: '₹5 (Heritage Gallery)',
      audioGuideSummary: 'Vishrambaug Wada is a majestic three-story timber-framed mansion constructed in 1807 by Peshwa Bajirao the Second. Take in the breathtaking teak facade with carved pillars styled after cypress trees (suru) and ornate overhanging wooden balconies. Today, it houses an exhibition on the lifestyle and documents of the Peshwa era, celebrating the pinnacle of traditional Pune craftsmanship.',
      historicalSignificance: 'Last grand wada erected during the Peshwa regime, preserving authentic 19th-century Deccan wooden craftsmanship.',
      architecturalHighlights: [
        'Iconic timber balcony facade on Bajirao Road',
        'Suru (cypress tree) carved teak pillars',
        'Meghadambari ornamental balcony',
        'Pune Municipal Heritage Archive & Gallery'
      ],
      walkingTipToNext: 'Congratulations! You have completed the Heritage Walking Trail. Enjoy warm Sujata Mastani or Puneri Misal nearby on Bajirao Road.'
    }
  ]
};

