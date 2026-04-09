import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { WeatherData } from '@/types/weather';
import { getWeatherAlerts } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
}

export default function WeatherAlerts({ weather }: Props) {
  const { daily, current } = weather;
  const now = new Date();
  const hourIdx = weather.hourly.time.findIndex(t => new Date(t) >= now);
  const uvNow = hourIdx >= 0 ? weather.hourly.uvIndex[hourIdx] : 0;

  const alerts = getWeatherAlerts(
    current.weatherCode,
    daily.temperatureMax[0],
    daily.temperatureMin[0],
    daily.windSpeedMax[0],
    uvNow,
    daily.precipitationSum[0]
  );

  if (alerts.length === 0) return null;

  const severityStyles = {
    danger: 'border-red-500/30 bg-red-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info: 'border-primary/30 bg-primary/10',
  };

  const severityIcons = {
    danger: ShieldAlert,
    warning: AlertTriangle,
    info: Info,
  };

  return (
    <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <h3 className="text-glass text-sm font-semibold uppercase tracking-wider mb-3">⚠️ Weather Alerts</h3>
      {alerts.map((alert, i) => {
        const AlertIcon = severityIcons[alert.severity];
        return (
          <div
            key={i}
            className={`rounded-xl border px-4 py-3 flex items-start gap-3 backdrop-blur-lg ${severityStyles[alert.severity]}`}
          >
            <AlertIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-glass" />
            <div>
              <p className="text-glass font-medium text-sm">{alert.type}</p>
              <p className="text-glass-muted text-xs mt-0.5">{alert.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
