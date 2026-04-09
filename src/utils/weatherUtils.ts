import {
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, CloudSun, CloudMoon,
  type LucideIcon,
} from 'lucide-react';
import { WeatherType, TemperatureUnit } from '@/types/weather';

export function getWeatherInfo(code: number, isDay: boolean = true): { icon: LucideIcon; label: string; type: WeatherType } {
  if (code === 0) return { icon: isDay ? Sun : Moon, label: 'Clear sky', type: isDay ? 'clear' : 'night' };
  if (code <= 2) return { icon: isDay ? CloudSun : CloudMoon, label: 'Partly cloudy', type: 'cloudy' };
  if (code === 3) return { icon: Cloud, label: 'Overcast', type: 'cloudy' };
  if (code <= 48) return { icon: CloudFog, label: 'Foggy', type: 'fog' };
  if (code <= 57) return { icon: CloudDrizzle, label: 'Drizzle', type: 'rain' };
  if (code <= 67) return { icon: CloudRain, label: 'Rain', type: 'rain' };
  if (code <= 77) return { icon: CloudSnow, label: 'Snow', type: 'snow' };
  if (code <= 82) return { icon: CloudRain, label: 'Rain showers', type: 'rain' };
  if (code <= 86) return { icon: CloudSnow, label: 'Snow showers', type: 'snow' };
  return { icon: CloudLightning, label: 'Thunderstorm', type: 'storm' };
}

export function convertTemp(temp: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') return Math.round((temp * 9) / 5 + 32);
  return Math.round(temp);
}

export function tempUnit(unit: TemperatureUnit): string {
  return unit === 'celsius' ? '°C' : '°F';
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

export function getAqiLevel(aqi: number): { label: string; color: string; description: string } {
  if (aqi <= 50) return { label: 'Good', color: '#22c55e', description: 'Air quality is satisfactory' };
  if (aqi <= 100) return { label: 'Moderate', color: '#eab308', description: 'Acceptable air quality' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#f97316', description: 'Sensitive groups may be affected' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', description: 'Everyone may experience effects' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#a855f7', description: 'Health alert: serious effects' };
  return { label: 'Hazardous', color: '#7f1d1d', description: 'Emergency conditions' };
}

export function getUvLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: '#22c55e' };
  if (uv <= 5) return { label: 'Moderate', color: '#eab308' };
  if (uv <= 7) return { label: 'High', color: '#f97316' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
}

export function getBackgroundClass(type: WeatherType): string {
  const map: Record<WeatherType, string> = {
    clear: 'weather-gradient-clear',
    cloudy: 'weather-gradient-cloudy',
    rain: 'weather-gradient-rain',
    snow: 'weather-gradient-snow',
    storm: 'weather-gradient-storm',
    night: 'weather-gradient-night',
    fog: 'weather-gradient-fog',
  };
  return map[type] || 'weather-gradient-default';
}

export function getWeatherAlerts(
  weatherCode: number,
  tempMax: number,
  tempMin: number,
  windSpeed: number,
  uvMax: number,
  precipSum: number
): { type: string; message: string; severity: 'warning' | 'danger' | 'info' }[] {
  const alerts: { type: string; message: string; severity: 'warning' | 'danger' | 'info' }[] = [];
  if (tempMax >= 40) alerts.push({ type: '🔥 Extreme Heat', message: `Temperature may reach ${Math.round(tempMax)}°C. Stay hydrated!`, severity: 'danger' });
  else if (tempMax >= 35) alerts.push({ type: '☀️ Heat Advisory', message: `High temperature of ${Math.round(tempMax)}°C expected.`, severity: 'warning' });
  if (tempMin <= -10) alerts.push({ type: '🥶 Extreme Cold', message: `Temperature may drop to ${Math.round(tempMin)}°C. Bundle up!`, severity: 'danger' });
  else if (tempMin <= 0) alerts.push({ type: '❄️ Frost Warning', message: `Freezing temperature of ${Math.round(tempMin)}°C expected.`, severity: 'warning' });
  if (windSpeed >= 60) alerts.push({ type: '🌪️ High Wind', message: `Wind speeds up to ${Math.round(windSpeed)} km/h.`, severity: 'danger' });
  else if (windSpeed >= 40) alerts.push({ type: '💨 Wind Advisory', message: `Strong winds of ${Math.round(windSpeed)} km/h expected.`, severity: 'warning' });
  if (uvMax >= 8) alerts.push({ type: '☀️ UV Alert', message: `Very high UV index of ${Math.round(uvMax)}. Use sunscreen!`, severity: 'warning' });
  if (precipSum >= 20) alerts.push({ type: '🌧️ Heavy Rain', message: `${Math.round(precipSum)}mm of precipitation expected.`, severity: 'warning' });
  if (weatherCode >= 95) alerts.push({ type: '⛈️ Thunderstorm', message: 'Thunderstorm activity expected. Seek shelter!', severity: 'danger' });
  return alerts;
}

export function getLifestyleIndex(temp: number, windSpeed: number, precipProb: number, uvIndex: number) {
  const travelScore = Math.max(0, Math.min(100, 100 - Math.abs(temp - 22) * 3 - precipProb * 0.5 - windSpeed * 0.5));
  const sportsScore = Math.max(0, Math.min(100, 100 - Math.abs(temp - 20) * 2 - precipProb * 0.8 - windSpeed * 0.3));
  const outdoorScore = Math.max(0, Math.min(100, 100 - Math.abs(temp - 24) * 2 - precipProb * 0.7 - uvIndex * 3));
  return {
    travel: { score: Math.round(travelScore), label: travelScore >= 70 ? 'Great' : travelScore >= 40 ? 'Fair' : 'Poor' },
    sports: { score: Math.round(sportsScore), label: sportsScore >= 70 ? 'Great' : sportsScore >= 40 ? 'Fair' : 'Poor' },
    outdoor: { score: Math.round(outdoorScore), label: outdoorScore >= 70 ? 'Great' : outdoorScore >= 40 ? 'Fair' : 'Poor' },
  };
}

export function getCropRecommendations(temp: number, humidity: number, precipitation: number) {
  const crops: { name: string; emoji: string; reason: string }[] = [];
  if (temp >= 25 && temp <= 35 && humidity >= 50) {
    crops.push({ name: 'Rice', emoji: '🌾', reason: 'Warm & humid - ideal for rice' });
    crops.push({ name: 'Tomatoes', emoji: '🍅', reason: 'Thrives in warm weather' });
    crops.push({ name: 'Mangoes', emoji: '🥭', reason: 'Perfect tropical conditions' });
  }
  if (temp >= 20 && temp <= 30) {
    crops.push({ name: 'Corn', emoji: '🌽', reason: 'Optimal growing temperature' });
    crops.push({ name: 'Peppers', emoji: '🌶️', reason: 'Warm weather favorite' });
  }
  if (temp >= 15 && temp <= 25) {
    crops.push({ name: 'Wheat', emoji: '🌾', reason: 'Moderate temps are perfect' });
    crops.push({ name: 'Potatoes', emoji: '🥔', reason: 'Cool to moderate climate crop' });
    crops.push({ name: 'Lettuce', emoji: '🥬', reason: 'Loves mild weather' });
  }
  if (temp >= 10 && temp < 20) {
    crops.push({ name: 'Carrots', emoji: '🥕', reason: 'Prefers cooler conditions' });
    crops.push({ name: 'Peas', emoji: '🫛', reason: 'Cool weather crop' });
    crops.push({ name: 'Spinach', emoji: '🥗', reason: 'Thrives in cool temps' });
  }
  if (temp < 10) {
    crops.push({ name: 'Kale', emoji: '🥬', reason: 'Cold-hardy leafy green' });
    crops.push({ name: 'Garlic', emoji: '🧄', reason: 'Tolerates cold well' });
  }
  if (precipitation > 5 && humidity > 60) {
    crops.push({ name: 'Mushrooms', emoji: '🍄', reason: 'Loves moisture' });
  }
  // Deduplicate by name
  const seen = new Set<string>();
  return crops.filter(c => { if (seen.has(c.name)) return false; seen.add(c.name); return true; }).slice(0, 6);
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatHour(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', hour12: true });
}
