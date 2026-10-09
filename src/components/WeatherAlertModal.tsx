import { X, CloudRain, AlertTriangle, ShieldAlert, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';
import { WeatherAlertInfo, CityWeatherAlertResponse } from '../types';

interface WeatherAlertModalProps {
  weatherData: CityWeatherAlertResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSwitchScenario: (scenario: 'heavy_rain' | 'dam_discharge' | 'clear') => void;
}

export function WeatherAlertModal({ weatherData, isOpen, onClose, onSwitchScenario }: WeatherAlertModalProps) {
  if (!isOpen || !weatherData) return null;

  const alert = weatherData.alert;
  const isCritical = alert?.severity === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 border-b ${isCritical ? 'bg-red-500 text-white' : alert ? 'bg-amber-500 text-white' : 'bg-stone-900 text-white'} flex items-start justify-between`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <CloudRain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider uppercase opacity-90 flex items-center gap-2">
                <span>{alert ? alert.severity : 'STANDARD'} CITY ADVISORY</span>
                <span>·</span>
                <span>{alert ? alert.issuedBy : 'IMD Pune Weather Center'}</span>
              </div>
              <h2 className="text-lg font-bold leading-tight mt-0.5">
                {alert ? alert.headline : 'Current Pune Weather Overview'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700 flex-1">
          {/* Real-time Atmospheric Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Temperature</div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{weatherData.temp}</div>
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Rainfall Acc.</div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{weatherData.rainfallMm} mm/hr</div>
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Wind Velocity</div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{weatherData.windSpeed}</div>
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Air Humidity</div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{weatherData.humidity}</div>
            </div>
          </div>

          {alert ? (
            <>
              {/* Detailed Meteorological Advisory */}
              <div>
                <h3 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Official Warning Briefing
                </h3>
                <p className="text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                  {alert.details}
                </p>
              </div>

              {/* Precautionary Action Box */}
              <div className={`p-3.5 rounded-xl border ${isCritical ? 'bg-red-50/70 border-red-200 text-red-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Mandatory Public Safety Advisory</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed font-medium">
                  {alert.precautionaryAction}
                </p>
              </div>

              {/* High Risk Impact Areas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                    Critical Impact & Waterlogged Corridors
                  </h3>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.validUntil}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {alert.impactAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="font-medium text-xs">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="font-semibold text-sm">Clear City Conditions</div>
              <p className="text-xs text-emerald-700 mt-1">
                No severe rainfall or dam overflow warnings are currently in effect for Pune.
              </p>
            </div>
          )}

          {/* Emergency Hotlines */}
          <div className="p-3.5 bg-stone-900 text-white rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-stone-400 font-medium">PMC Monsoon Disaster Control Room</div>
              <div className="text-base font-bold text-white mt-0.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-red-400" />
                <span>020-25501269 / 112</span>
              </div>
            </div>
            <a
              href="tel:02025501269"
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0"
            >
              Call Disaster Cell
            </a>
          </div>

          {/* Test API Scenarios Selector (Interactive live API verification) */}
          <div className="pt-2 border-t border-stone-100">
            <div className="text-[11px] font-semibold text-stone-500 mb-2">
              Test Live Weather API Scenarios:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSwitchScenario('heavy_rain')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  weatherData.scenario === 'heavy_rain'
                    ? 'bg-red-600 text-white border-red-600 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                🌧️ 68mm Red Alert
              </button>
              <button
                type="button"
                onClick={() => onSwitchScenario('dam_discharge')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  weatherData.scenario === 'dam_discharge'
                    ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                🌊 Dam Spillway
              </button>
              <button
                type="button"
                onClick={() => onSwitchScenario('clear')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  weatherData.scenario === 'clear'
                    ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                ☀️ Clear Skies
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <span className="text-stone-500">Live API Data · Last updated 1 min ago</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors"
          >
            Close Advisory
          </button>
        </div>
      </div>
    </div>
  );
}
