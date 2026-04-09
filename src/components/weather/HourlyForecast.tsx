import { WeatherData, TemperatureUnit } from '@/types/weather';
import { getWeatherInfo, convertTemp, formatHour } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export default function HourlyForecast({ weather, unit }: Props) {
  const now = new Date();
  const currentHourIndex = weather.hourly.time.findIndex(t => new Date(t) >= now);
  const startIdx = Math.max(0, currentHourIndex);
  const hours = Array.from({ length: 24 }, (_, i) => startIdx + i).filter(
    i => i < weather.hourly.time.length
  );

  return (
    <div className="glass-card-static animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-glass text-sm font-semibold uppercase tracking-wider mb-4">🕒 Hourly Forecast</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {hours.map((i) => {
          const info = getWeatherInfo(weather.hourly.weatherCode[i], true);
          const Icon = info.icon;
          const isNow = i === startIdx;
          return (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all ${
                isNow ? 'bg-white/15 border border-white/20' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-glass-muted text-xs">{isNow ? 'Now' : formatHour(weather.hourly.time[i])}</span>
              <Icon className="w-6 h-6 text-glass" />
              <span className="text-glass font-medium text-sm">{convertTemp(weather.hourly.temperature[i], unit)}°</span>
              <span className="text-primary text-xs">{weather.hourly.precipitationProbability[i]}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
