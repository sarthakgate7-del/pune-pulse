# PunePulse — Smart Pune City Explorer & Safe Navigator

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg)](https://tailwindcss.com/)

**PunePulse** is a hyper-local smart city explorer, live safety navigator, and gamified civic engagement platform built specifically for the vibrant urban landscape of **Pune, Maharashtra**.

---

## 🌟 Key Features

### 1. 🗺️ Interactive Live Pune Map & Urban Zones
- **High-Fidelity Pune Mapping**: Integrated with Google Maps Platform and interactive street-level telemetry covering prominent neighborhoods: *Deccan Gymkhana*, *FC Road*, *Kothrud*, *Koregaon Park*, *Shivajinagar*, *Kasba Peth*, *Hinjawadi*, and *Swargate*.
- **Safety Heatmaps**: Visualizes pedestrian safety scores, lighting conditions, and accident-prone blind spots.
- **Dynamic Weather & Flood Warning Ribbon**: Real-time alerts for heavy rainfall, Khadakwasla dam discharge notices, and monsoon waterlogging.

### 2. 🏛️ Pune Heritage Trail with Audio Guide
- Curated heritage walking tour covering iconic Peshwa monuments:
  - *Shaniwar Wada Fort Palace*
  - *Lal Mahal (Historic Residence of Chhatrapati Shivaji Maharaj)*
  - *Nana Wada (Historic Peshwa Administrative Office)*
  - *Kasba Ganpati (Gramdaivat of Pune)*
  - *Vishrambaug Wada (Peshwa Bajirao II Palace)*
- Interactive audio summaries with text-to-speech narration, verified walking routes, and crowd statuses.

### 3. 🛡️ Safe Route Navigator
- Compares **Standard Fastest Route** vs. **Verified Safer Route** (lit corridors, CCTV-monitored lanes, active police beat proximity).
- Step-by-step turn guidance with emergency hotline quick-triggers (112, 108, PMC Disaster Cell).

### 4. ⚡ Floating 'Quick Actions' Controller
- Persistent floating button anchored at the bottom-right corner of the screen.
- **Report Urban Issue**: Instantly opens problem submission modal without switching tabs.
- **Trigger Safety Check**: Instant area scan of street lighting, police presence, and safe haven proximity.
- **Emergency Hotlines**: Direct one-tap dialers for Pune Police (112), Ambulance (108), and PMC Disaster Management (`020-25501269`).

### 5. 🏆 Punekar Civic Points & Leaderboard
- **Dynamic Point Awards**:
  - High Severity Hazards (potholes, open drains, live wires): **+60 pts**
  - Medium Severity Traffic & Delays: **+50 pts**
  - Hidden Urban Gems & Culture Spots: **+45 pts**
  - Informational Street Updates: **+35 pts**
  - Upvoting / Verifying Community Alerts: **+10 pts**
  - Proactive Safety Check-In: **+20 pts**
- **Punekar Identity Portal (`CivicUserWindow`)**: Dedicated user window with personalized resident badge, citizen ID (`PUN-2026-8492`), points ledger, and rank standings.
- **City-wide Civic Leaderboard**: Displays top community contributors across Pune wards.

### 6. 🎮 Pune Rickshaw Patrol (Offline Arcade Game)
- Built-in retro mini-game playable anytime, especially when offline or experiencing poor mobile reception!
- Dodge potholes, navigate congested Pune chowks, collect Puneri gems, and honk the rickshaw horn.
- **Bank Score to Civic Karma**: Converts in-game high scores into bonus Civic Points deposited into your user profile.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Build Tool**: Vite
- **Backend / API**: Express with Node.js proxy routes for live weather alerts and citizen report aggregation
- **Mapping**: Google Maps JavaScript API with interactive polyline overlays & markers
- **Sound & VFX**: HTML5 Web Audio API synthesizers and Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shrihari077/PunePulse---Smart-Pune-City-Explorer-Safe-Navigator.git
   cd PunePulse---Smart-Pune-City-Explorer-Safe-Navigator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Google Maps API key (optional for prototyping):
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License
MIT License. Built for Pune citizens and urban explorers.
