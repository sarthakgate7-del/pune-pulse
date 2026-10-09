import { useState } from 'react';
import { ShieldCheck, Sparkles, DollarSign, Train, Compass, Check, AlertCircle } from 'lucide-react';
import { City, NeighborhoodComparison } from '../types';
import { NEIGHBORHOOD_COMPARISONS } from '../data/cityData';
import { PUNE_NEIGHBORHOODS } from '../data/puneData';

interface CompareViewProps {
  city: City;
  neighborhoods?: NeighborhoodComparison[];
}

export function CompareView({ city, neighborhoods }: CompareViewProps) {
  const cityNeighborhoods =
    neighborhoods ||
    (city.id === 'pune' ? PUNE_NEIGHBORHOODS : NEIGHBORHOOD_COMPARISONS[city.id] || []);

  // Default to selecting the first 2 neighborhoods
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return cityNeighborhoods.slice(0, 2).map((n) => n.id);
  });

  const toggleNeighborhood = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // replace the oldest one
        setSelectedIds([...selectedIds.slice(1), id]);
      }
    }
  };

  const selectedDistricts = cityNeighborhoods.filter((n) => selectedIds.includes(n.id));

  // Determine winners
  const highestSafety = [...selectedDistricts].sort((a, b) => b.safetyRating - a.safetyRating)[0];
  const highestAffordability = [...selectedDistricts].sort((a, b) => b.affordabilityRating - a.affordabilityRating)[0];
  const highestTransit = [...selectedDistricts].sort((a, b) => b.transitRating - a.transitRating)[0];

  return (
    <div className="space-y-6">
      {/* Header & Selector Bar */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Neighborhood Evaluator</span>
            <span aria-hidden="true">·</span>
            <span>{city.name}</span>
            <span aria-hidden="true">·</span>
            <span>Best vs. Worst Comparison</span>
          </div>
          <h2 className="text-lg font-semibold text-stone-900">
            Compare Neighborhoods Side-by-Side
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Select up to 3 districts to evaluate safety, cleanliness, transit, and value.
          </p>
        </div>

        {/* Neighborhood Selector Chips (interactive button filters) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
          {cityNeighborhoods.map((n) => {
            const isSelected = selectedIds.includes(n.id);
            return (
              <button
                key={n.id}
                onClick={() => toggleNeighborhood(n.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {n.name.split('&')[0]} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Verdict Highlights */}
      {selectedDistricts.length >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              🛡️ Safest Choice
            </div>
            <div className="text-sm font-bold text-emerald-950 mt-1">
              {highestSafety?.name}
            </div>
            <div className="text-xs text-emerald-700 mt-0.5">
              Score: {highestSafety?.safetyRating}/10 · Well-lit and lower incident rates
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              💰 Most Affordable
            </div>
            <div className="text-sm font-bold text-amber-950 mt-1">
              {highestAffordability?.name}
            </div>
            <div className="text-xs text-amber-700 mt-0.5">
              Score: {highestAffordability?.affordabilityRating}/10 · Budget dining & stays
            </div>
          </div>

          <div className="bg-sky-50/70 border border-sky-200/80 p-3.5 rounded-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-800">
              🚆 Best Transit Access
            </div>
            <div className="text-sm font-bold text-sky-950 mt-1">
              {highestTransit?.name}
            </div>
            <div className="text-xs text-sky-700 mt-0.5">
              Score: {highestTransit?.transitRating}/10 · Direct trains and walkable buses
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Cards Comparison */}
      <div className={`grid grid-cols-1 ${selectedDistricts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-5 items-stretch`}>
        {selectedDistricts.map((district) => {
          const isCaution = district.verdict === 'Caution After Dusk';
          const isTopPick = district.verdict === 'Top Pick';

          return (
            <div
              key={district.id}
              className={`flex flex-col bg-white rounded-2xl border ${
                isCaution ? 'border-amber-200' : isTopPick ? 'border-emerald-200' : 'border-stone-200'
              } p-5 shadow-xs`}
            >
              {/* Header */}
              <div className="pb-3 border-b border-stone-100">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>{city.name}</span>
                  <span className={`font-semibold ${isCaution ? 'text-amber-700' : isTopPick ? 'text-emerald-700' : 'text-stone-700'}`}>
                    {district.verdict}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  {district.name}
                </h3>
              </div>

              {/* Metrics Rating Grid */}
              <div className="py-4 space-y-2.5 border-b border-stone-100 text-xs">
                {/* Safety */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                    <span>Safety Index</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${district.safetyRating >= 8 ? 'bg-emerald-600' : district.safetyRating >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${district.safetyRating * 10}%` }}
                      />
                    </div>
                    <span className="font-semibold text-stone-900 w-6 text-right">{district.safetyRating}</span>
                  </div>
                </div>

                {/* Cleanliness */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                    <span>Cleanliness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-600"
                        style={{ width: `${district.cleanlinessRating * 10}%` }}
                      />
                    </div>
                    <span className="font-semibold text-stone-900 w-6 text-right">{district.cleanlinessRating}</span>
                  </div>
                </div>

                {/* Affordability */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <DollarSign className="w-3.5 h-3.5 text-stone-500" />
                    <span>Affordability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${district.affordabilityRating * 10}%` }}
                      />
                    </div>
                    <span className="font-semibold text-stone-900 w-6 text-right">{district.affordabilityRating}</span>
                  </div>
                </div>

                {/* Transit */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Train className="w-3.5 h-3.5 text-stone-500" />
                    <span>Transit & Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${district.transitRating * 10}%` }}
                      />
                    </div>
                    <span className="font-semibold text-stone-900 w-6 text-right">{district.transitRating}</span>
                  </div>
                </div>

                {/* Vibe */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Compass className="w-3.5 h-3.5 text-stone-500" />
                    <span>Vibe & Energy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-600"
                        style={{ width: `${district.vibeRating * 10}%` }}
                      />
                    </div>
                    <span className="font-semibold text-stone-900 w-6 text-right">{district.vibeRating}</span>
                  </div>
                </div>
              </div>

              {/* Summary Description */}
              <p className="py-3 text-xs text-stone-600 leading-relaxed border-b border-stone-100">
                {district.summary}
              </p>

              {/* Best For (Pros) */}
              <div className="pt-3 pb-2 space-y-2 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                  Best For
                </div>
                <ul className="space-y-1.5">
                  {district.bestFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Watch Out For (Cons) */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                  Watch Out For
                </div>
                <ul className="space-y-1.5">
                  {district.watchOutFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
