import { WeatherData, TemperatureUnit } from '@/types/weather';
import { getWeatherInfo, convertTemp, formatDay } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export default function DailyForecast({ weather, unit }: Props) {
  const { daily } = weather;

  return (
    <div className="glass-card-static animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-glass text-sm font-semibold uppercase tracking-wider mb-4">📅 15-Day Forecast</h3>
      <div className="space-y-1">
        {daily.time.map((date, i) => {
          const info = getWeatherInfo(daily.weatherCode[i]);
          const Icon = info.icon;
          const maxTemp = convertTemp(daily.temperatureMax[i], unit);
          const minTemp = convertTemp(daily.temperatureMin[i], unit);
          const range = maxTemp - minTemp || 1;
          
          return (
            <div
              key={date}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <span className="text-glass text-sm w-24 flex-shrink-0">{formatDay(date)}</span>
              <Icon className="w-5 h-5 text-glass flex-shrink-0" />
              <span className="text-glass-muted text-sm w-10 text-right">{minTemp}°</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full mx-2 relative overflow-hidden">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{
                    left: `${((minTemp - convertTemp(Math.min(...daily.temperatureMin), unit)) / (convertTemp(Math.max(...daily.temperatureMax), unit) - convertTemp(Math.min(...daily.temperatureMin), unit) || 1)) * 100}%`,
                    width: `${(range / (convertTemp(Math.max(...daily.temperatureMax), unit) - convertTemp(Math.min(...daily.temperatureMin), unit) || 1)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-glass font-medium text-sm w-10">{maxTemp}°</span>
              {daily.precipitationSum[i] > 0 && (
                <span className="text-primary text-xs w-12 text-right">{Math.round(daily.precipitationSum[i])}mm</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
