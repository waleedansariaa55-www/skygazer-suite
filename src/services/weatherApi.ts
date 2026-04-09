import { GeoLocation, WeatherData, AirQuality } from '@/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1';
const AQ_URL = 'https://air-quality-api.open-meteo.com/v1';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (query.length < 2) return [];
  const res = await fetch(
    `${GEO_URL}/search?name=${encodeURIComponent(query)}&count=6&language=en`
  );
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    latitude: r.latitude,
    longitude: r.longitude,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation> {
  const res = await fetch(
    `${GEO_URL}/search?name=&latitude=${lat}&longitude=${lon}&count=1`
  );
  const data = await res.json();
  if (data.results?.length) {
    const r = data.results[0];
    return { latitude: lat, longitude: lon, name: r.name, country: r.country, admin1: r.admin1 };
  }
  return { latitude: lat, longitude: lon, name: 'Current Location', country: '' };
}

export async function fetchWeather(lat: number, lon: number, location: GeoLocation): Promise<WeatherData> {
  const [weatherRes, aqRes] = await Promise.all([
    fetch(
      `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,uv_index_max` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day` +
      `&timezone=auto&forecast_days=16`
    ),
    fetch(`${AQ_URL}/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10`).catch(() => null),
  ]);

  const weather = await weatherRes.json();
  let airQuality: AirQuality | null = null;

  if (aqRes) {
    try {
      const aq = await aqRes.json();
      airQuality = {
        usAqi: aq.current?.us_aqi ?? 0,
        pm25: aq.current?.pm2_5 ?? 0,
        pm10: aq.current?.pm10 ?? 0,
      };
    } catch { /* ignore */ }
  }

  return {
    current: {
      temperature: weather.current.temperature_2m,
      humidity: weather.current.relative_humidity_2m,
      weatherCode: weather.current.weather_code,
      windSpeed: weather.current.wind_speed_10m,
      windDirection: weather.current.wind_direction_10m,
      isDay: !!weather.current.is_day,
    },
    hourly: {
      time: weather.hourly.time,
      temperature: weather.hourly.temperature_2m,
      humidity: weather.hourly.relative_humidity_2m,
      precipitationProbability: weather.hourly.precipitation_probability,
      precipitation: weather.hourly.precipitation,
      weatherCode: weather.hourly.weather_code,
      windSpeed: weather.hourly.wind_speed_10m,
      windDirection: weather.hourly.wind_direction_10m,
      uvIndex: weather.hourly.uv_index,
    },
    daily: {
      time: weather.daily.time,
      weatherCode: weather.daily.weather_code,
      temperatureMax: weather.daily.temperature_2m_max,
      temperatureMin: weather.daily.temperature_2m_min,
      sunrise: weather.daily.sunrise,
      sunset: weather.daily.sunset,
      precipitationSum: weather.daily.precipitation_sum,
      windSpeedMax: weather.daily.wind_speed_10m_max,
      uvIndexMax: weather.daily.uv_index_max,
    },
    airQuality,
    location,
  };
}
