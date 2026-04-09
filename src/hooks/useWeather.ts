import { useState, useCallback } from 'react';
import { GeoLocation, WeatherData } from '@/types/weather';
import { fetchWeather, searchCities } from '@/services/weatherApi';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (location: GeoLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(location.latitude, location.longitude, location);
      setWeather(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use reverse geocoding to get city name
        try {
          const cities = await searchCities(`${latitude}`);
          const location: GeoLocation = cities[0] || {
            latitude,
            longitude,
            name: 'Current Location',
            country: '',
          };
          location.latitude = latitude;
          location.longitude = longitude;
          await loadWeather(location);
        } catch {
          await loadWeather({ latitude, longitude, name: 'Current Location', country: '' });
        }
      },
      (err) => {
        setError('Location access denied. Please search for a city.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [loadWeather]);

  return { weather, loading, error, loadWeather, detectLocation };
}
