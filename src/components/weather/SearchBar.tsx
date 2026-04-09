import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, X, Loader2 } from 'lucide-react';
import { GeoLocation } from '@/types/weather';
import { searchCities } from '@/services/weatherApi';

interface Props {
  onSelectCity: (city: GeoLocation) => void;
  onDetectLocation: () => void;
  favorites: GeoLocation[];
  onToggleFavorite: (city: GeoLocation) => void;
  loading: boolean;
  currentCity?: string;
}

export default function SearchBar({ onSelectCity, onDetectLocation, favorites, onToggleFavorite, loading, currentCity }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowFavorites(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    setQuery('');
    setShowSuggestions(false);
    onSelectCity(city);
  };

  const isFavorite = (city: GeoLocation) =>
    favorites.some(f => f.latitude === city.latitude && f.longitude === city.longitude);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="glass-strong rounded-2xl flex items-center gap-3 px-4 py-3">
        <Search className="w-5 h-5 text-glass-muted flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-glass flex-1 outline-none placeholder:text-glass-subtle text-sm"
        />
        {query && (
          <button onClick={() => { setQuery(''); setSuggestions([]); }} className="text-glass-muted hover:text-glass">
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onDetectLocation}
          disabled={loading}
          className="text-glass-muted hover:text-primary transition-colors flex-shrink-0"
          title="Detect location"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
        </button>
        {favorites.length > 0 && (
          <button
            onClick={() => { setShowFavorites(!showFavorites); setShowSuggestions(false); }}
            className="text-weather-sunny hover:text-accent transition-colors flex-shrink-0"
            title="Favorites"
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-50">
          {suggestions.map((city, i) => (
            <button
              key={`${city.latitude}-${city.longitude}-${i}`}
              onClick={() => handleSelect(city)}
              className="w-full flex items-center justify-between px-4 py-3 text-glass hover:bg-white/10 transition-colors text-left"
            >
              <div>
                <span className="font-medium">{city.name}</span>
                <span className="text-glass-muted text-sm ml-2">
                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(city); }}
                className="text-glass-muted hover:text-weather-sunny transition-colors"
              >
                <Star className={`w-4 h-4 ${isFavorite(city) ? 'fill-current text-weather-sunny' : ''}`} />
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Favorites dropdown */}
      {showFavorites && favorites.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-50">
          <div className="px-4 py-2 text-glass-subtle text-xs uppercase tracking-wider border-b border-white/10">
            Favorites
          </div>
          {favorites.map((city, i) => (
            <button
              key={`fav-${i}`}
              onClick={() => { handleSelect(city); setShowFavorites(false); }}
              className="w-full flex items-center justify-between px-4 py-3 text-glass hover:bg-white/10 transition-colors text-left"
            >
              <span>{city.name}, {city.country}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(city); }}
                className="text-weather-sunny hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
