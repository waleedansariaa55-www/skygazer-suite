import { useState, useCallback, useEffect } from 'react';
import { Cloud, Loader2 } from 'lucide-react';
import { GeoLocation, TemperatureUnit } from '@/types/weather';
import { useWeather } from '@/hooks/useWeather';
import WeatherBackground from '@/components/weather/WeatherBackground';
import SearchBar from '@/components/weather/SearchBar';
import CurrentWeather from '@/components/weather/CurrentWeather';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import WeatherCharts from '@/components/weather/WeatherCharts';
import WeatherDetails from '@/components/weather/WeatherDetails';
import WeatherAlerts from '@/components/weather/WeatherAlerts';
import LifestyleIndex from '@/components/weather/LifestyleIndex';
import CropRecommendations from '@/components/weather/CropRecommendations';

export default function Index() {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('weather-favorites') || '[]');
    } catch { return []; }
  });

  const { weather, loading, error, loadWeather, detectLocation } = useWeather();

  useEffect(() => {
    localStorage.setItem('weather-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleUnit = useCallback(() => {
    setUnit(u => u === 'celsius' ? 'fahrenheit' : 'celsius');
  }, []);

  const toggleFavorite = useCallback((city: GeoLocation) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.latitude === city.latitude && f.longitude === city.longitude);
      if (exists) return prev.filter(f => !(f.latitude === city.latitude && f.longitude === city.longitude));
      return [...prev, city];
    });
  }, []);

  const isFavorite = weather
    ? favorites.some(f => f.latitude === weather.location.latitude && f.longitude === weather.location.longitude)
    : false;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <WeatherBackground weather={weather} />

      <div className="relative z-10 min-h-screen">
        {!weather ? (
          /* Landing View */
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="animate-fade-in text-center mb-8">
              <Cloud className="w-16 h-16 text-glass mx-auto mb-4 animate-float" />
              <h1 className="text-5xl md:text-6xl font-extralight text-glass tracking-tight mb-3">
                Weather
              </h1>
              <p className="text-glass-muted text-lg">
                Search a city or detect your location
              </p>
            </div>

            <div className="w-full max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <SearchBar
                onSelectCity={loadWeather}
                onDetectLocation={detectLocation}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                loading={loading}
              />
            </div>

            {loading && (
              <div className="mt-8 flex items-center gap-3 text-glass-muted animate-fade-in">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Fetching weather data...</span>
              </div>
            )}

            {error && (
              <div className="mt-6 glass rounded-xl px-5 py-3 text-destructive text-sm animate-scale-in">
                {error}
              </div>
            )}

            {/* Quick access favorites */}
            {favorites.length > 0 && !loading && (
              <div className="mt-8 flex flex-wrap gap-2 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {favorites.map((city, i) => (
                  <button
                    key={i}
                    onClick={() => loadWeather(city)}
                    className="glass-subtle rounded-full px-4 py-2 text-glass-muted text-sm hover:bg-white/10 hover:text-glass transition-all"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Dashboard View */
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Search Bar */}
            <SearchBar
              onSelectCity={loadWeather}
              onDetectLocation={detectLocation}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              loading={loading}
              currentCity={weather.location.name}
            />

            {/* Current Weather */}
            <CurrentWeather
              weather={weather}
              unit={unit}
              onToggleUnit={toggleUnit}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />

            {/* Alerts */}
            <WeatherAlerts weather={weather} />

            {/* Hourly */}
            <HourlyForecast weather={weather} unit={unit} />

            {/* Details Grid */}
            <WeatherDetails weather={weather} />

            {/* Charts */}
            <WeatherCharts weather={weather} unit={unit} />

            {/* Lifestyle + Crop side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LifestyleIndex weather={weather} />
              <CropRecommendations weather={weather} />
            </div>

            {/* 15-day forecast */}
            <DailyForecast weather={weather} unit={unit} />

            {/* Footer */}
            <div className="text-center text-glass-subtle text-xs py-6">
              Powered by Open-Meteo • Data updates every 15 minutes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
