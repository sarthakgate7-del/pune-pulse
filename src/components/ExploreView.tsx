import { useState, useMemo } from 'react';
import { Search, MapPin, Shield, Star, AlertTriangle, Compass, ArrowRight, Volume2 } from 'lucide-react';
import { City, LocationSpot, SpotCategory } from '../types';
import { PUNE_HERITAGE_TRAIL } from '../data/puneData';
import { CityMap } from './CityMap';
import { SpotDetailModal } from './SpotDetailModal';
import { HeritageTrailView } from './HeritageTrailView';

interface ExploreViewProps {
  city: City;
  spots: LocationSpot[];
  onNavigateToSpot: (spot: LocationSpot) => void;
  weatherAlertActive?: boolean;
}

export function ExploreView({ city, spots, onNavigateToSpot, weatherAlertActive }: ExploreViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<LocationSpot | null>(null);
  const [viewMode, setViewMode] = useState<'map-split' | 'map-only' | 'list-only'>('map-split');
  const [isHeritageTrailActive, setIsHeritageTrailActive] = useState(false);

  // Filter spots based on active category and query
  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      const matchesCity = spot.cityId === city.id;
      if (!matchesCity) return false;

      const matchesCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'food' && spot.category === 'food') ||
        (selectedCategory === 'culture' && spot.category === 'culture') ||
        (selectedCategory === 'attraction' && (spot.category === 'attraction' || spot.category === 'stay')) ||
        (selectedCategory === 'hazard' && spot.category === 'hazard');

      const matchesSearch =
        searchQuery === '' ||
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCat && matchesSearch;
    });
  }, [spots, city.id, selectedCategory, searchQuery]);

  // If Heritage Trail mode is active
  if (isHeritageTrailActive) {
    return (
      <HeritageTrailView
        city={city}
        trail={PUNE_HERITAGE_TRAIL}
        onExitTrail={() => setIsHeritageTrailActive(false)}
        weatherAlertActive={weatherAlertActive}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Heritage Trail Teaser Callout */}
      <div className="p-3.5 bg-gradient-to-r from-purple-50 via-white to-amber-50 rounded-xl border border-purple-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
            🏛️
          </div>
          <div>
            <span className="font-bold text-stone-900">
              Peshwa & Maratha Heritage Walking Trail (2.4 km):
            </span>
            <span className="text-stone-600 ml-1.5">
              5 historic monuments with audio-guide summaries from Pataleshwar to Vishrambaug Wada.
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsHeritageTrailActive(true)}
          className="self-start sm:self-center px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Launch Heritage Trail & Audio Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Controls Bar: Search & Category Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={`Search ${city.name} spots, food, heritage, or streets...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border border-stone-200 focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-400 text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Category Segmented Tabs (Interactive Filter Controls as permitted by constitution) */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto text-xs font-medium text-stone-600">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            All Places ({spots.filter((s) => s.cityId === city.id).length})
          </button>
          <button
            onClick={() => setSelectedCategory('food')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'food' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            🍴 Food & Misal Gems
          </button>
          <button
            onClick={() => setSelectedCategory('culture')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'culture' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            🏛️ Heritage & Forts
          </button>
          <button
            onClick={() => setSelectedCategory('attraction')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'attraction' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            ✨ Parks & Stay
          </button>
          <button
            onClick={() => setSelectedCategory('hazard')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === 'hazard' ? 'bg-red-50 text-red-700 font-semibold shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            ⚠️ Safety & Traffic Alerts
          </button>
        </div>

        {/* View Mode Toggle for Small Devices */}
        <div className="hidden lg:flex items-center gap-1 text-xs text-stone-500">
          <span className="text-stone-400">Layout:</span>
          <button
            onClick={() => setViewMode('map-split')}
            className={`px-2 py-1 rounded-sm ${viewMode === 'map-split' ? 'bg-stone-200 text-stone-900 font-medium' : 'hover:text-stone-900'}`}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode('map-only')}
            className={`px-2 py-1 rounded-sm ${viewMode === 'map-only' ? 'bg-stone-200 text-stone-900 font-medium' : 'hover:text-stone-900'}`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('list-only')}
            className={`px-2 py-1 rounded-sm ${viewMode === 'list-only' ? 'bg-stone-200 text-stone-900 font-medium' : 'hover:text-stone-900'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Main Split Layout: Interactive Map + Spot Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Map Container */}
        {(viewMode === 'map-split' || viewMode === 'map-only') && (
          <div className={viewMode === 'map-only' ? 'lg:col-span-12 h-[600px]' : 'lg:col-span-7 h-[540px]'}>
            <CityMap
              city={city}
              spots={filteredSpots}
              selectedSpotId={selectedSpot?.id}
              onSelectSpot={(spot) => setSelectedSpot(spot)}
              weatherAlertActive={weatherAlertActive}
            />
          </div>
        )}

        {/* Spot Cards List */}
        {(viewMode === 'map-split' || viewMode === 'list-only') && (
          <div className={viewMode === 'list-only' ? 'lg:col-span-12 space-y-3' : 'lg:col-span-5 space-y-3 max-h-[540px] overflow-y-auto pr-1'}>
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span>Found {filteredSpots.length} locations in {city.name}</span>
              <span className="text-stone-400">Click card for safety tips & details</span>
            </div>

            {filteredSpots.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
                No spots matched your search in {city.name}. Try selecting "All Places" or resetting the search filter.
              </div>
            ) : (
              filteredSpots.map((spot) => {
                const isSelected = selectedSpot?.id === spot.id;
                const isHazard = spot.category === 'hazard';

                return (
                  <div
                    key={spot.id}
                    onClick={() => setSelectedSpot(spot)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 shadow-xs'
                        : isHazard
                        ? 'border-red-200 bg-red-50/40 hover:border-red-300'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {/* Unboxed Metadata (Rule 1.A) */}
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span>{spot.neighborhood}</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{spot.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{spot.costLevel}</span>
                        </div>
                        <h3 className="font-semibold text-stone-900 text-base leading-snug">
                          {spot.name}
                        </h3>
                      </div>

                      {/* Safety Score / Rating Display */}
                      <div className="text-right shrink-0">
                        {isHazard ? (
                          <div className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Caution</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-stone-900 text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{spot.rating}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Safety: {spot.safetyScore}/100
                        </div>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {spot.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                      <span className="text-stone-500">
                        {spot.isHeritage ? '🏛️ Historic Heritage' : spot.isBudgetFriendly ? '💰 Budget Friendly' : '✨ Top Rated'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpot(spot);
                        }}
                        className="text-stone-900 font-medium hover:underline flex items-center gap-1"
                      >
                        View Details & Tips →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Spot Detail Modal */}
      <SpotDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        onNavigateToSpot={onNavigateToSpot}
      />
    </div>
  );
}
