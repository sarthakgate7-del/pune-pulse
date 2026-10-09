import { useState, useMemo } from 'react';
import { ShieldCheck, Clock, Navigation, AlertTriangle, Phone, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { City, LocationSpot, SafeNavigationRoute } from '../types';
import { SAFE_ROUTES } from '../data/cityData';
import { PUNE_SAFE_ROUTES } from '../data/puneData';
import { CityMap } from './CityMap';

interface SafeRouteViewProps {
  city: City;
  spots: LocationSpot[];
  routes?: SafeNavigationRoute[];
  preselectedDestination?: LocationSpot | null;
}

export function SafeRouteView({ city, spots, routes, preselectedDestination }: SafeRouteViewProps) {
  const cityRoutes =
    routes ||
    (city.id === 'pune' ? PUNE_SAFE_ROUTES : SAFE_ROUTES[city.id] || []);

  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    cityRoutes[0]?.id || ''
  );
  const [activeMode, setActiveMode] = useState<'safe' | 'standard'>('safe');
  const [sosStatus, setSosStatus] = useState<string | null>(null);

  // Active route selection
  const activeRoute = useMemo(() => {
    return cityRoutes.find((r) => r.id === selectedRouteId) || cityRoutes[0];
  }, [cityRoutes, selectedRouteId]);

  const activeOption = activeRoute
    ? activeMode === 'safe'
      ? activeRoute.saferRoute
      : activeRoute.standard
    : null;

  const handleTriggerSOS = () => {
    setSosStatus(`Emergency info copied! In ${city.name}, emergency dispatch is dial ${city.emergencyNumber}.`);
    navigator.clipboard?.writeText?.(`Emergency in ${city.name}: I need assistance near ${activeRoute?.fromName || city.name}. Local emergency: ${city.emergencyNumber}`);
    setTimeout(() => setSosStatus(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Route Selector Header Card */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Urban Navigation Engine</span>
            <span aria-hidden="true">·</span>
            <span>{city.name}</span>
            <span aria-hidden="true">·</span>
            <span>Accident & Dim-Zone Avoidance</span>
          </div>
          <h2 className="text-lg font-semibold text-stone-900">
            Compare Standard vs. Verified Safe Route
          </h2>
        </div>

        {/* Route Preset Dropdown */}
        {cityRoutes.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 whitespace-nowrap">Popular Corridor:</span>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-hidden focus:border-stone-400"
            >
              {cityRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fromName} → {r.toName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeRoute ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Route Comparison Controls & Step Guidance */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mode Switcher Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setActiveMode('safe')}
                className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeMode === 'safe'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Well-Lit Safe Route</span>
              </button>

              <button
                onClick={() => setActiveMode('standard')}
                className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeMode === 'standard'
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Fastest Standard</span>
              </button>
            </div>

            {/* Safety Differential Card */}
            <div className={`p-4 rounded-xl border ${activeMode === 'safe' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-stone-50 border-stone-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-500 font-medium">Route Safety Index</div>
                  <div className="text-2xl font-bold text-stone-900 mt-0.5 flex items-baseline gap-1">
                    <span className={activeMode === 'safe' ? 'text-emerald-700' : 'text-stone-700'}>
                      {activeOption?.safetyScore}
                    </span>
                    <span className="text-xs text-stone-400 font-normal">/100</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-500 font-medium">Est. Duration & Distance</div>
                  <div className="text-sm font-semibold text-stone-900 mt-0.5">
                    {activeOption?.duration} ({activeOption?.distance})
                  </div>
                </div>
              </div>

              {/* Lighting & Hazard Assessment */}
              <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-600">
                <span>Street Lighting: <strong>{activeOption?.lightingQuality}</strong></span>
                {activeMode === 'safe' ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> +17 Safety Boost
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Risk Intersections
                  </span>
                )}
              </div>
            </div>

            {/* Route Highlights / Warnings */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Route Security Analysis
              </h3>
              
              {activeMode === 'safe' ? (
                <ul className="space-y-2">
                  {activeRoute.saferRoute.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <strong>Caution:</strong> Cuts through transit alleys with intermittent night lighting and higher reported theft.
                  </div>
                  {activeRoute.standard.warnings?.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step-by-Step Directions */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Step-by-Step Walk Guide
              </h3>
              <ol className="space-y-2.5">
                {activeOption?.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-stone-700">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-semibold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Quick Emergency Hotkey Card */}
            <div className="p-4 bg-stone-900 text-white rounded-xl flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-stone-400">Local Emergency Hotline</div>
                <div className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span>Dial {city.emergencyNumber} in {city.name}</span>
                </div>
              </div>
              <button
                onClick={handleTriggerSOS}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Copy SOS Alert
              </button>
            </div>
            {sosStatus && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
                {sosStatus}
              </div>
            )}
          </div>

          {/* Right Column: Route Map Visualization */}
          <div className="lg:col-span-7 h-[580px]">
            <CityMap
              city={city}
              spots={spots.filter((s) => s.cityId === city.id)}
              onSelectSpot={() => {}}
              showSafetyHeatmap={true}
              activePolyline={{
                standard: activeRoute.standard.path,
                safe: activeRoute.saferRoute.path,
              }}
            />
            <div className="mt-2 text-center text-xs text-stone-500">
              <span className="inline-block w-4 h-1 bg-emerald-600 rounded-full mr-1.5 align-middle"></span>
              Solid green line: Well-lit safer route
              <span className="mx-2">·</span>
              <span className="inline-block w-4 h-1 border-b-2 border-dashed border-stone-400 mr-1.5 align-middle"></span>
              Dashed line: Standard fastest route
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
          No preset routes mapped for {city.name} yet. Check the Explore tab to view all safety zones.
        </div>
      )}
    </div>
  );
}
