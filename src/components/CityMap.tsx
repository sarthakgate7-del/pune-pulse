import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocationSpot, City, HeritageTrail, HeritageStop } from '../types';
import { Train, Navigation, Layers, Compass, CloudRain, AlertTriangle, ShieldCheck, Sun, Moon } from 'lucide-react';

interface CityMapProps {
  city: City;
  spots: LocationSpot[];
  selectedSpotId?: string | null;
  onSelectSpot: (spot: LocationSpot) => void;
  showSafetyHeatmap?: boolean;
  activePolyline?: {
    standard?: [number, number][];
    safe?: [number, number][];
  };
  weatherAlertActive?: boolean;
  heritageTrail?: HeritageTrail | null;
  selectedHeritageStopId?: string | null;
  onSelectHeritageStop?: (stop: HeritageStop) => void;
}

// Pune Metro Lines & Stations Data
const PUNE_METRO_PURPLE: [number, number][] = [
  [18.6288, 73.8016], // PCMC
  [18.6012, 73.8160], // Bhosari
  [18.5790, 73.8320], // Dapodi
  [18.5615, 73.8430], // Khadki
  [18.5310, 73.8520], // Shivajinagar
  [18.5262, 73.8570], // Civil Court Interchange
  [18.5140, 73.8560], // Kasba Peth / Mandai
  [18.5018, 73.8596], // Swargate
];

const PUNE_METRO_AQUA: [number, number][] = [
  [18.5070, 73.7990], // Vanaz
  [18.5100, 73.8120], // Anand Nagar
  [18.5125, 73.8210], // Ideal Colony
  [18.5150, 73.8340], // Garware College
  [18.5185, 73.8440], // Deccan Gymkhana
  [18.5220, 73.8490], // Sambhaji Udyan
  [18.5250, 73.8530], // PMC Building
  [18.5262, 73.8570], // Civil Court Interchange
  [18.5280, 73.8680], // Mangalwar Peth
  [18.5290, 73.8750], // Pune Railway Station
  [18.5340, 73.8820], // Ruby Hall Clinic
  [18.5380, 73.8900], // Bund Garden
  [18.5480, 73.9030], // Kalyani Nagar
  [18.5550, 73.9180], // Ramwadi
];

// Major Traffic Corridors in Pune
const PUNE_TRAFFIC_CORRIDORS = [
  {
    name: 'Ganeshkhind Rd (University Circle Work)',
    status: 'Congested (12 km/h)',
    color: '#dc2626', // Red
    path: [
      [18.5310, 73.8520],
      [18.5330, 73.8400],
      [18.5362, 73.8276],
      [18.5450, 73.8100]
    ] as [number, number][],
    advice: 'Metro Pier construction: 15 min delays. Use Senapati Bapat Rd.'
  },
  {
    name: 'Hinjawadi Wakad IT Bridge',
    status: 'Slow Flow (18 km/h)',
    color: '#d97706', // Amber
    path: [
      [18.5987, 73.7632],
      [18.5940, 73.7480],
      [18.5880, 73.7380]
    ] as [number, number][],
    advice: 'Evening shuttle rush: use Bhumkar Chowk bypass.'
  },
  {
    name: 'JM Road & FC Road Corridor',
    status: 'Smooth Flow (35 km/h)',
    color: '#16a34a', // Green
    path: [
      [18.5173, 73.8415],
      [18.5240, 73.8460],
      [18.5290, 73.8500]
    ] as [number, number][],
    advice: 'Well-lit arterial street, normal speed.'
  },
  {
    name: 'Bund Garden & Nagar Road BRTS',
    status: 'Fast Flow (40 km/h)',
    color: '#16a34a', // Green
    path: [
      [18.5380, 73.8900],
      [18.5480, 73.9030],
      [18.5550, 73.9180]
    ] as [number, number][],
    advice: 'Clear traffic with active bus corridors.'
  }
];

// Mutha Riverbed Waterlogging Hazard Polygon
const MUTHA_RIVERBED_FLOOD_ZONE: [number, number][] = [
  [18.5200, 73.8440],
  [18.5190, 73.8475], // Bhide Bridge
  [18.5160, 73.8505], // Z-Bridge
  [18.5140, 73.8530], // Pulachi Wadi
  [18.5150, 73.8545],
  [18.5180, 73.8520],
  [18.5210, 73.8485],
  [18.5225, 73.8450],
];

export function CityMap({
  city,
  spots,
  selectedSpotId,
  onSelectSpot,
  showSafetyHeatmap = true,
  activePolyline,
  weatherAlertActive = false,
  heritageTrail = null,
  selectedHeritageStopId = null,
  onSelectHeritageStop,
}: CityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const safetyCirclesLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const metroLayerRef = useRef<L.LayerGroup | null>(null);
  const trafficLayerRef = useRef<L.LayerGroup | null>(null);
  const floodRiskLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocLayerRef = useRef<L.LayerGroup | null>(null);
  const heritageTrailLayerRef = useRef<L.LayerGroup | null>(null);

  // Map Layer Visibility Controls
  const [showMetro, setShowMetro] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showFloodZone, setShowFloodZone] = useState(true);
  const [mapTheme, setMapTheme] = useState<'google' | 'satellite' | 'dark' | 'voyager'>('google');
  const [locatingUser, setLocatingUser] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const googleMapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB_zyQcMixJpP5ksiWoPcDxet6mn-wK8zA';

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: city.center,
        zoom: city.zoom,
        zoomControl: false,
      });

      // Google Maps or CartoDB Default Tiles
      const initialTileUrl = googleMapsApiKey
        ? `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleMapsApiKey}`
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tile = L.tileLayer(initialTileUrl, {
        attribution: '&copy; Google Maps Platform &copy; OpenStreetMap',
        maxZoom: 20,
      }).addTo(map);

      tileLayerRef.current = tile;

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      safetyCirclesLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      metroLayerRef.current = L.layerGroup().addTo(map);
      trafficLayerRef.current = L.layerGroup().addTo(map);
      floodRiskLayerRef.current = L.layerGroup().addTo(map);
      userLocLayerRef.current = L.layerGroup().addTo(map);
      heritageTrailLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Map Tile Layer on theme switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (mapTheme === 'google' && googleMapsApiKey) {
      tileUrl = `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleMapsApiKey}`;
      attribution = '&copy; Google Maps Platform';
    } else if (mapTheme === 'satellite' && googleMapsApiKey) {
      tileUrl = `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${googleMapsApiKey}`;
      attribution = '&copy; Google Maps Satellite Imagery';
    } else if (mapTheme === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CartoDB Dark Matter &copy; OpenStreetMap';
    }

    const newTile = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [mapTheme, googleMapsApiKey]);

  // Pan to city center when city changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(city.center, city.zoom);
    }
  }, [city]);

  // Render Pune Metro Lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const metroLayer = metroLayerRef.current;
    if (!map || !metroLayer) return;

    metroLayer.clearLayers();

    if (showMetro && city.id === 'pune') {
      // Purple Line (PCMC - Swargate)
      const purplePolyline = L.polyline(PUNE_METRO_PURPLE, {
        color: '#7c3aed',
        weight: 5,
        opacity: 0.9,
      }).bindTooltip('🚇 Pune Metro Line 1 (Purple Line: PCMC ↔ Swargate)', { sticky: true });
      metroLayer.addLayer(purplePolyline);

      // Aqua Line (Vanaz - Ramwadi)
      const aquaPolyline = L.polyline(PUNE_METRO_AQUA, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.9,
      }).bindTooltip('🚇 Pune Metro Line 2 (Aqua Line: Vanaz ↔ Ramwadi)', { sticky: true });
      metroLayer.addLayer(aquaPolyline);

      // Station node markers
      const keyStations: { name: string; coord: [number, number]; line: string }[] = [
        { name: 'Civil Court Central Interchange', coord: [18.5262, 73.8570], line: 'Purple & Aqua' },
        { name: 'Shivajinagar Station', coord: [18.5310, 73.8520], line: 'Purple Line' },
        { name: 'Swargate Terminal', coord: [18.5018, 73.8596], line: 'Purple Line' },
        { name: 'Deccan Gymkhana', coord: [18.5185, 73.8440], line: 'Aqua Line' },
        { name: 'Pune Railway Station Metro', coord: [18.5290, 73.8750], line: 'Aqua Line' },
        { name: 'Kalyani Nagar', coord: [18.5480, 73.9030], line: 'Aqua Line' },
      ];

      keyStations.forEach((stn) => {
        const stationMarker = L.circleMarker(stn.coord, {
          radius: 6,
          fillColor: '#ffffff',
          color: '#1e293b',
          weight: 3,
          fillOpacity: 1,
        }).bindTooltip(`<b>${stn.name}</b><br/><span style="color:#64748b;font-size:11px;">Metro ${stn.line} · Trains every 7 mins</span>`);
        metroLayer.addLayer(stationMarker);
      });
    }
  }, [showMetro, city]);

  // Render Pune Live Traffic Corridors
  useEffect(() => {
    const map = mapInstanceRef.current;
    const trafficLayer = trafficLayerRef.current;
    if (!map || !trafficLayer) return;

    trafficLayer.clearLayers();

    if (showTraffic && city.id === 'pune') {
      PUNE_TRAFFIC_CORRIDORS.forEach((corridor) => {
        const trafficLine = L.polyline(corridor.path, {
          color: corridor.color,
          weight: 6,
          opacity: 0.85,
        }).bindTooltip(
          `<b>🚦 ${corridor.name}</b><br/><span>Speed: ${corridor.status}</span><br/><span style="color:#64748b;font-size:11px;">${corridor.advice}</span>`,
          { sticky: true }
        );
        trafficLayer.addLayer(trafficLine);
      });
    }
  }, [showTraffic, city]);

  // Render Flood Risk / Waterlogging Zone (Mutha Riverbed)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const floodLayer = floodRiskLayerRef.current;
    if (!map || !floodLayer) return;

    floodLayer.clearLayers();

    if (showFloodZone && city.id === 'pune') {
      const floodZone = L.polygon(MUTHA_RIVERBED_FLOOD_ZONE, {
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.28,
        weight: 2,
        dashArray: '4, 4',
      }).bindTooltip(
        '<b>🌊 Mutha Riverbed & Baba Bhide Bridge Hazard Zone</b><br/><span style="font-size:11px;color:#0369a1;">High risk of rapid waterlogging during Khadakwasla dam discharge. Causeway closed to traffic.</span>',
        { sticky: true }
      );
      floodLayer.addLayer(floodZone);

      // Warning marker in center of Bhide bridge
      const warningIcon = L.divIcon({
        className: 'flood-warning-icon',
        html: `
          <div style="background-color: #ef4444; color: white; width: 28px; height: 28px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            ⚠️
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const floodMarker = L.marker([18.5190, 73.8475], { icon: warningIcon })
        .bindTooltip('<b>Baba Bhide Bridge Causeway</b><br/>Waterlogging Danger Zone during heavy showers');
      floodLayer.addLayer(floodMarker);
    }
  }, [showFloodZone, city]);

  // Update Markers and Safety Heatmap
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const safetyLayer = safetyCirclesLayerRef.current;
    if (!map || !markersLayer || !safetyLayer) return;

    markersLayer.clearLayers();
    safetyLayer.clearLayers();

    // Render Safety Heat circles if enabled
    if (showSafetyHeatmap) {
      spots.forEach((spot) => {
        if (spot.category === 'hazard') {
          const hazardCircle = L.circle(spot.coordinates, {
            radius: 280,
            color: '#dc2626',
            fillColor: '#ef4444',
            fillOpacity: 0.18,
            weight: 1.5,
            dashArray: '4, 4',
          });
          hazardCircle.bindTooltip(`⚠️ Caution Zone: ${spot.name}`, { sticky: true });
          safetyLayer.addLayer(hazardCircle);
        } else if (spot.safetyScore >= 92) {
          const safeCircle = L.circle(spot.coordinates, {
            radius: 220,
            color: '#059669',
            fillColor: '#10b981',
            fillOpacity: 0.08,
            weight: 1,
          });
          safetyLayer.addLayer(safeCircle);
        }
      });
    }

    // Render Spot Markers with custom SVG DivIcon
    spots.forEach((spot) => {
      const isSelected = spot.id === selectedSpotId;

      let iconBg = '#2563eb';
      let badgeLabel = '📍';

      if (spot.category === 'hazard') {
        iconBg = '#dc2626';
        badgeLabel = '⚠️';
      } else if (spot.category === 'food') {
        iconBg = '#d97706';
        badgeLabel = '🍴';
      } else if (spot.category === 'culture') {
        iconBg = '#7c3aed';
        badgeLabel = '🏛️';
      } else if (spot.category === 'stay') {
        iconBg = '#0284c7';
        badgeLabel = '🏨';
      } else if (spot.category === 'attraction') {
        iconBg = '#059669';
        badgeLabel = '✨';
      }

      const iconHtml = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '38px' : '30px'};
          height: ${isSelected ? '38px' : '30px'};
          background-color: ${iconBg};
          border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
          border-radius: 9999px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          font-size: ${isSelected ? '16px' : '13px'};
          cursor: pointer;
          transition: transform 0.15s ease;
        ">
          ${badgeLabel}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-city-marker',
        html: iconHtml,
        iconSize: isSelected ? [38, 38] : [30, 30],
        iconAnchor: isSelected ? [19, 19] : [15, 15],
      });

      const marker = L.marker(spot.coordinates, { icon: customIcon });

      marker.on('click', () => {
        onSelectSpot(spot);
        map.panTo(spot.coordinates, { animate: true });
      });

      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 12px; font-weight: 600;">${spot.name}</div><div style="font-size: 11px; color: #64748b;">${spot.neighborhood} · Safety: ${spot.safetyScore}/100</div>`,
        { direction: 'top', offset: [0, -10] }
      );

      markersLayer.addLayer(marker);
    });
  }, [spots, selectedSpotId, showSafetyHeatmap, onSelectSpot]);

  // Update Route Polyline if present
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();

    if (activePolyline?.standard && activePolyline.standard.length > 0) {
      const standardLine = L.polyline(activePolyline.standard, {
        color: '#64748b',
        weight: 4,
        opacity: 0.8,
        dashArray: '6, 8',
      });
      routeLayer.addLayer(standardLine);
    }

    if (activePolyline?.safe && activePolyline.safe.length > 0) {
      const safeLine = L.polyline(activePolyline.safe, {
        color: '#059669',
        weight: 6,
        opacity: 0.95,
      });
      routeLayer.addLayer(safeLine);

      const bounds = L.latLngBounds([
        ...(activePolyline.standard || []),
        ...activePolyline.safe,
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [activePolyline]);

  // Update Heritage Trail Polyline & Milestone Stops
  useEffect(() => {
    const map = mapInstanceRef.current;
    const heritageLayer = heritageTrailLayerRef.current;
    if (!map || !heritageLayer) return;

    heritageLayer.clearLayers();

    if (heritageTrail) {
      // Trail continuous polyline in royal purple
      const trailLine = L.polyline(heritageTrail.path, {
        color: '#7c3aed',
        weight: 6,
        opacity: 0.95,
      }).bindTooltip(`🏛️ ${heritageTrail.title} (${heritageTrail.totalDistance})`, { sticky: true });
      heritageLayer.addLayer(trailLine);

      // Numbered Milestone Markers for each stop
      heritageTrail.stops.forEach((stop) => {
        const isSelected = stop.id === selectedHeritageStopId;
        const iconHtml = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            background-color: ${isSelected ? '#e11d48' : '#7c3aed'};
            color: #ffffff;
            font-weight: 800;
            border-radius: 9999px;
            border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            font-size: ${isSelected ? '16px' : '13px'};
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            ${stop.order}
          </div>
        `;

        const customMarker = L.marker(stop.coordinates, {
          icon: L.divIcon({
            className: 'heritage-stop-marker',
            html: iconHtml,
            iconSize: isSelected ? [38, 38] : [30, 30],
            iconAnchor: isSelected ? [19, 19] : [15, 15],
          }),
        });

        customMarker.on('click', () => {
          if (onSelectHeritageStop) onSelectHeritageStop(stop);
          map.panTo(stop.coordinates, { animate: true });
        });

        customMarker.bindTooltip(
          `<b>Stop ${stop.order}: ${stop.name}</b><br/><span style="color:#64748b;font-size:11px;">${stop.era} (${stop.yearBuilt}) · Audio Guide Available</span>`,
          { direction: 'top', offset: [0, -10] }
        );

        heritageLayer.addLayer(customMarker);
      });

      // Fit bounds to the whole trail
      const bounds = L.latLngBounds(heritageTrail.path);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [heritageTrail, selectedHeritageStopId, onSelectHeritageStop]);

  // Geolocation Handler
  const handleLocateMe = () => {
    const map = mapInstanceRef.current;
    const userLayer = userLocLayerRef.current;
    if (!map || !userLayer) return;

    setLocatingUser(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          userLayer.clearLayers();

          const userMarker = L.circleMarker(coords, {
            radius: 8,
            fillColor: '#2563eb',
            color: '#ffffff',
            weight: 3,
            fillOpacity: 1,
          }).bindTooltip('<b>Your Location</b>', { permanent: true, direction: 'top' });

          userLayer.addLayer(userMarker);
          map.setView(coords, 14, { animate: true });
          setLocatingUser(false);
        },
        () => {
          // Fallback to central Deccan Gymkhana
          const fallback: [number, number] = [18.5185, 73.8440];
          setUserLocation(fallback);
          map.setView(fallback, 14, { animate: true });
          setLocatingUser(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocatingUser(false);
    }
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(city.center, city.zoom, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] overflow-hidden rounded-2xl border border-stone-200 shadow-xs bg-stone-100">
      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Top-Left Live Status Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200/90 shadow-xs text-xs flex items-center gap-2 text-stone-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Live Pune City Map</span>
          <span className="text-stone-400">·</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
            Google Maps API Active
          </span>
        </div>

        {weatherAlertActive && (
          <div className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shadow-sm animate-bounce">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Heavy Downpour: Waterlogged Riverbed Active</span>
          </div>
        )}
      </div>

      {/* Top-Right Interactive Layer Toggles & Style Switcher */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Layer Toggles Pill Bar */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-xs flex items-center gap-1 text-[11px] font-medium text-stone-700">
          <button
            onClick={() => setShowMetro(!showMetro)}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              showMetro ? 'bg-purple-100 text-purple-900 font-semibold' : 'hover:bg-stone-100 text-stone-500'
            }`}
            title="Toggle Pune Metro Lines 1 & 2"
          >
            <Train className="w-3 h-3 text-purple-600" />
            <span>Metro</span>
          </button>

          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              showTraffic ? 'bg-amber-100 text-amber-900 font-semibold' : 'hover:bg-stone-100 text-stone-500'
            }`}
            title="Toggle Live Traffic Congestion Arteries"
          >
            <span>🚦 Traffic</span>
          </button>

          <button
            onClick={() => setShowFloodZone(!showFloodZone)}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              showFloodZone ? 'bg-sky-100 text-sky-900 font-semibold' : 'hover:bg-stone-100 text-stone-500'
            }`}
            title="Toggle Mutha River Flood Hazard Polygon"
          >
            <CloudRain className="w-3 h-3 text-sky-600" />
            <span>Riverbed</span>
          </button>
        </div>

        {/* Theme Switcher Button */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-xs flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setMapTheme('google')}
            className={`px-2 py-0.5 rounded-md transition-colors ${mapTheme === 'google' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
            title="Google Maps Standard"
          >
            Google Maps
          </button>
          <button
            onClick={() => setMapTheme('satellite')}
            className={`px-2 py-0.5 rounded-md transition-colors ${mapTheme === 'satellite' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
            title="Google Maps Satellite Hybrid"
          >
            Satellite
          </button>
          <button
            onClick={() => setMapTheme('dark')}
            className={`px-2 py-0.5 rounded-md transition-colors ${mapTheme === 'dark' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
            title="Night Dark Mode"
          >
            Night
          </button>
        </div>
      </div>

      {/* Floating Action Buttons: Locate Me & Reset View (Bottom-Left) */}
      <div className="absolute bottom-4 left-3 z-10 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={handleLocateMe}
          className="bg-white hover:bg-stone-50 text-stone-800 px-3 py-2 rounded-xl border border-stone-200 shadow-md text-xs font-semibold flex items-center gap-1.5 transition-all"
          title="Locate my current position in Pune"
        >
          <Navigation className={`w-3.5 h-3.5 text-blue-600 ${locatingUser ? 'animate-spin' : ''}`} />
          <span>{locatingUser ? 'Locating...' : 'Locate Me'}</span>
        </button>

        <button
          onClick={handleResetCenter}
          className="bg-white hover:bg-stone-50 text-stone-700 px-2.5 py-2 rounded-xl border border-stone-200 shadow-md text-xs font-medium transition-all"
          title="Center on Pune Heritage Core (Deccan / Shaniwar Wada)"
        >
          <Compass className="w-3.5 h-3.5 text-stone-600" />
        </button>
      </div>

      {/* Bottom Legend */}
      <div className="absolute bottom-3 right-12 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-stone-200 text-[10px] text-stone-600 hidden md:flex items-center gap-3">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600 inline-block"/> Misal & Food</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600 inline-block"/> Heritage</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"/> Attractions</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block"/> Traffic/Hazards</span>
      </div>
    </div>
  );
}
