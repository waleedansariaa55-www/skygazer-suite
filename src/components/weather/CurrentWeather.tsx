import { MapPin, Star, Droplets, Wind } from 'lucide-react';
import { WeatherData, TemperatureUnit, GeoLocation } from '@/types/weather';
import { getWeatherInfo, convertTemp, tempUnit } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onToggleFavorite: (city: GeoLocation) => void;
  isFavorite: boolean;
}

export default function CurrentWeather({ weather, unit, onToggleUnit, onToggleFavorite, isFavorite }: Props) {
  const { current, location } = weather;
  const info = getWeatherInfo(current.weatherCode, current.isDay);
  const Icon = info.icon;

  return (
    <div className="text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-glass-muted" />
        <span className="text-glass text-lg font-medium">{location.name}</span>
        {location.country && <span className="text-glass-muted text-sm">{location.country}</span>}
        <button
          onClick={() => onToggleFavorite(location)}
          className="ml-1 transition-colors"
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'fill-current text-weather-sunny' : 'text-glass-muted hover:text-weather-sunny'}`} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 my-4">
        <Icon className="w-16 h-16 text-glass animate-float" />
        <div>
          <button
            onClick={onToggleUnit}
            className="text-7xl font-extralight text-glass tracking-tighter hover:text-primary transition-colors cursor-pointer"
            title="Toggle °C / °F"
          >
            {convertTemp(current.temperature, unit)}{tempUnit(unit)}
          </button>
        </div>
      </div>

      <p className="text-glass text-lg mb-4">{info.label}</p>

      <div className="flex items-center justify-center gap-6 text-glass-muted text-sm">
        <span className="flex items-center gap-1.5">
          <Droplets className="w-4 h-4" />
          {current.humidity}%
        </span>
        <span className="flex items-center gap-1.5">
          <Wind className="w-4 h-4" />
          {Math.round(current.windSpeed)} km/h
        </span>
        <span>
          H: {convertTemp(weather.daily.temperatureMax[0], unit)}° &nbsp;
          L: {convertTemp(weather.daily.temperatureMin[0], unit)}°
        </span>
      </div>
    </div>
  );
}
