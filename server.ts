import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory citizen reports store tailored for Pune
const citizenReports: any[] = [
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
    description: 'Paved footpath is pitch dark under dense banyan tree canopy between Lane 4 and Lane 5. Walkers advised to use opposite sidewalk with hotel lighting.',
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
    description: 'Irrigation department announced controlled water release. Baba Bhide Bridge riverside causeway closed for parking. Please park vehicles on JM Road.',
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
    description: 'Water ponding near highway underpass has drained. PMPML electric buses running on schedule now.',
    locationName: 'Wakad Flyover, Hinjawadi Entry',
    coordinates: [18.5987, 73.7632],
    status: 'Verified by 14 citizens',
    upvotes: 27,
    timestamp: '4 hours ago',
    severity: 'Low'
  }
];

// In-memory weather alert state (defaults to high-priority heavy rain alert as requested)
let currentWeatherScenario: 'heavy_rain' | 'dam_discharge' | 'clear' = 'heavy_rain';

const weatherScenarios = {
  heavy_rain: {
    temp: '22°C (71°F)',
    condition: 'Heavy Monsoon Downpour',
    humidity: '92%',
    windSpeed: '28 km/h gusting to 45 km/h',
    rainfallMm: 68,
    hasHighPriorityAlert: true,
    alert: {
      id: 'alert-rain-01',
      type: 'heavy_rain',
      severity: 'CRITICAL',
      headline: 'IMD Red Alert: Intense Downpour (68mm) & Flash Waterlogging Warning across Pune',
      issuedBy: 'India Meteorological Department (IMD Pune) & PMC Disaster Management Cell',
      details: 'Severe localized convective downpours triggering rapid surface runoff along Mutha riverbed, Alka Talkies chowk, and Sinhagad Road underpasses. High accumulation expected in Deccan Gymkhana bowl.',
      precautionaryAction: 'Avoid low-lying subways, Baba Bhide causeway, and Wakad underpasses. Stay off two-wheelers during peak rainfall bursts. PMC helpline: 020-25501269.',
      validUntil: 'Active until 04:00 AM',
      impactAreas: ['Baba Bhide Causeway', 'Alka Talkies Chowk', 'Sinhagad Road Underpasses', 'Wakad Bridge Highway Merge', 'Dadar-Range Hills Underpass']
    }
  },
  dam_discharge: {
    temp: '24°C (75°F)',
    condition: 'Overcast with Intermittent Drizzle',
    humidity: '84%',
    windSpeed: '18 km/h',
    rainfallMm: 32,
    hasHighPriorityAlert: true,
    alert: {
      id: 'alert-dam-02',
      type: 'dam_discharge',
      severity: 'WARNING',
      headline: 'Khadakwasla Dam Spillway Alert: 11,500 Cusecs Water Discharge into Mutha River',
      issuedBy: 'Maharashtra Irrigation Department & Pune Municipal Corporation',
      details: 'Catchment dams (Panshet, Varasgaon, Temghar) filled above 95% capacity. Regulated release into Mutha riverbed commenced. Riverside parking roads submerged.',
      precautionaryAction: 'Baba Bhide Bridge closed to all traffic. Relocate parked two-wheelers from riverbed immediately to JM Road or Kelkar Road.',
      validUntil: 'Active until 11:30 PM tonight',
      impactAreas: ['Mutha Riverside Causeway', 'Deccan Riverbed Parking', 'Pulachi Wadi', 'Shivane Low-Lying Causeway']
    }
  },
  clear: {
    temp: '26°C (79°F)',
    condition: 'Pleasant Deccan Breeze & Clear',
    humidity: '54%',
    windSpeed: '12 km/h',
    rainfallMm: 0,
    hasHighPriorityAlert: false,
    alert: null
  }
};

// Weather alerts API
app.get('/api/weather-alerts', (req, res) => {
  const city = (req.query.city as string) || 'Pune';
  const scenarioQuery = req.query.scenario as 'heavy_rain' | 'dam_discharge' | 'clear' | undefined;
  const activeScenario = scenarioQuery && weatherScenarios[scenarioQuery] ? scenarioQuery : currentWeatherScenario;
  const data = weatherScenarios[activeScenario];

  res.json({
    city,
    ...data,
    lastUpdated: 'Live sync 1 min ago',
    scenario: activeScenario
  });
});

app.post('/api/weather-alerts/scenario', (req, res) => {
  const { scenario } = req.body;
  if (scenario && weatherScenarios[scenario as keyof typeof weatherScenarios]) {
    currentWeatherScenario = scenario;
    return res.json({ success: true, scenario: currentWeatherScenario });
  }
  res.status(400).json({ error: 'Invalid scenario. Must be heavy_rain, dam_discharge, or clear.' });
});

// Citizen reports API
app.get('/api/reports', (req, res) => {
  const city = req.query.city as string;
  if (city) {
    const filtered = citizenReports.filter(r => r.city.toLowerCase() === city.toLowerCase());
    return res.json(filtered.length > 0 ? filtered : citizenReports);
  }
  res.json(citizenReports);
});

app.post('/api/reports', (req, res) => {
  const { city, category, title, description, locationName, coordinates, photoUrl, severity } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const newReport = {
    id: `rep-${Date.now()}`,
    city: city || 'Pune',
    category: category || 'hazard',
    title,
    description,
    locationName: locationName || 'Reported Pune Location',
    coordinates: coordinates || [18.5204, 73.8567],
    photoUrl: photoUrl || null,
    status: 'Verified by Citizen Network',
    upvotes: 1,
    timestamp: 'Just now',
    severity: severity || 'Medium'
  };

  citizenReports.unshift(newReport);
  res.status(201).json(newReport);
});

app.post('/api/reports/:id/upvote', (req, res) => {
  const { id } = req.params;
  const report = citizenReports.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  report.upvotes = (report.upvotes || 0) + 1;
  res.json({ success: true, upvotes: report.upvotes });
});

// AI City Guide API
app.post('/api/ask-city-ai', async (req, res) => {
  const { prompt, city, context } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const selectedCity = city || 'Pune';

  // If Gemini API is available
  if (ai) {
    try {
      const systemInstruction = `You are PunePulse, a street-smart, warm, and authentic local guide for Pune City (Maharashtra, India).
Your task is to provide concise, practical, honest advice for navigating Pune's cultural treasures, iconic food (Misal, Bakarwadi, Bun Maska Chai, Mastani, SPDP), heritage landmarks (Shaniwar Wada, Aga Khan Palace, Sinhagad, Pataleshwar), and real urban realities (University Circle metro construction traffic, Hinjawadi commute, narrow Peth alleys, Khadakwasla dam releases).
Keep responses under 140 words using bullet points for quick readability on mobile.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Question about ${selectedCity}: "${prompt}". Context: ${JSON.stringify(context || {})}`,
        config: {
          systemInstruction,
        }
      });

      const reply = response.text || 'No response generated.';
      return res.json({ reply, source: 'gemini' });
    } catch (err: any) {
      console.error('Gemini API call failed, falling back to local urban knowledge:', err?.message);
    }
  }

  // Fallback smart response engine specifically calibrated for Pune
  const fallbackPuneReplies: Record<string, string> = {
    food: `Iconic Food Picks in Pune:
• Breakfast Misal: Head to Bedekar Tea Stall (Narayan Peth) or Kata Kirr (Karve Nagar) for authentic Puneri misal with slice bread.
• Iconic Bun Maska & Chai: Cafe Goodluck at Deccan Gymkhana (open since 1935).
• Evening Snack: SPDP (Sev Potato Dahi Puri) & filter coffee at Vaishali on FC Road.
• Dessert: Mango or Kesar Mastani at Sujata Mastani (Sadashiv Peth).
• Souvenir: Fresh Bakarwadi from Chitale Bandhu (Bajirao Road).`,
    safety: `Safe Navigation Tips for Pune:
• Pune is ranked among India's safest cities for solo walkers and women, especially along FC Road, JM Road, Koregaon Park, and Kothrud.
• After 9:30 PM: Prefer well-lit arterial roads (JM Road, Senapati Bapat Road, North Main Road) over interior Peth alleys.
• Emergency Helpline: Dial 112 for Police and 108 for Medical assistance across Pune.`,
    traffic: `Pune Traffic & Commute Shortcuts:
• University Circle / Ganeshkhind Road: Heavy metro work delays during 9-11 AM & 6-8:30 PM. Bypass via Senapati Bapat Road or Range Hills.
• Hinjawadi IT Corridor: Wakad bridge bottlenecks during evening shift changes. Take Bhumkar Chowk alternate underpass.
• Peth Areas: Avoid driving 4-wheelers inside Laxmi Road / Tulshibaug; park at Mandai multi-level parking and explore on foot.`,
    history: `Heritage Highlights of Pune:
• Shaniwar Wada: 1732 Peshwa palace fortress in Kasba Peth. Visit the Dilli Darwaza bastions.
• Aga Khan Palace: Italian arches & Mahatma Gandhi memorial in tranquil Kalyani Nagar gardens.
• Pataleshwar Caves: 8th-century monolithic Shiva rock temple carved from single basalt rock on JM Road.
• Sinhagad Fort: 1,300m high Maratha fortress. Try fresh Pitla Bhakri and Kanda Bhaji at the top!`,
    general: `Pune Street-Smart Tips:
• Best transport: Pune Metro (Line 1 & 2) for rapid transit, or prepaid PMPML e-buses.
• Weather: Evenings cool down pleasantly thanks to Deccan plateau breezes.
• Local customs: Traditional Peth shops observe 1:00 PM - 4:00 PM afternoon siesta.`
  };

  const lower = prompt.toLowerCase();
  let selectedCategory = 'general';
  if (lower.includes('food') || lower.includes('misal') || lower.includes('eat') || lower.includes('chai') || lower.includes('cafe')) {
    selectedCategory = 'food';
  } else if (lower.includes('safe') || lower.includes('night') || lower.includes('women') || lower.includes('dark')) {
    selectedCategory = 'safety';
  } else if (lower.includes('traffic') || lower.includes('jam') || lower.includes('university') || lower.includes('hinjawadi')) {
    selectedCategory = 'traffic';
  } else if (lower.includes('history') || lower.includes('wada') || lower.includes('heritage') || lower.includes('fort') || lower.includes('aga khan')) {
    selectedCategory = 'history';
  }

  res.json({
    reply: fallbackPuneReplies[selectedCategory],
    source: 'pune-urban-knowledge-engine'
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PunePulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
