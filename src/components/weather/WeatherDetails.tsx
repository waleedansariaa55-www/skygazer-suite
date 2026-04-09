import { Wind, Droplets, Sun, Eye, Sunrise, Sunset, Navigation, Gauge } from 'lucide-react';
import { WeatherData } from '@/types/weather';
import { getWindDirection, getAqiLevel, getUvLevel, formatTime } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
}

function DetailCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="glass-card flex flex-col gap-2">
      <div className="flex items-center gap-2 text-glass-muted text-xs uppercase tracking-wider">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="text-glass text-2xl font-light" style={color ? { color } : {}}>
        {value}
      </div>
      {sub && <div className="text-glass-muted text-xs">{sub}</div>}
    </div>
  );
}

export default function WeatherDetails({ weather }: Props) {
  const { current, daily, hourly, airQuality } = weather;
  const now = new Date();
  const currentHourIdx = hourly.time.findIndex(t => new Date(t) >= now);
  const uvNow = currentHourIdx >= 0 ? hourly.uvIndex[currentHourIdx] : 0;
  const uvInfo = getUvLevel(uvNow);
  const aqiInfo = airQuality ? getAqiLevel(airQuality.usAqi) : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <DetailCard
        icon={Wind}
        label="Wind"
        value={`${Math.round(current.windSpeed)} km/h`}
        sub={`Direction: ${getWindDirection(current.windDirection)}`}
      />
      <DetailCard
        icon={Droplets}
        label="Humidity"
        value={`${current.humidity}%`}
        sub={current.humidity > 70 ? 'High moisture' : current.humidity < 30 ? 'Very dry' : 'Comfortable'}
      />
      <DetailCard
        icon={Sun}
        label="UV Index"
        value={`${Math.round(uvNow)}`}
        sub={uvInfo.label}
        color={uvInfo.color}
      />
      <DetailCard
        icon={Eye}
        label="Feels Like"
        value={`${Math.round(current.temperature)}°`}
        sub="Based on wind & humidity"
      />
      <DetailCard
        icon={Sunrise}
        label="Sunrise"
        value={formatTime(daily.sunrise[0])}
      />
      <DetailCard
        icon={Sunset}
        label="Sunset"
        value={formatTime(daily.sunset[0])}
      />
      {aqiInfo && (
        <DetailCard
          icon={Gauge}
          label="Air Quality"
          value={`${airQuality!.usAqi} AQI`}
          sub={aqiInfo.description}
          color={aqiInfo.color}
        />
      )}
      <DetailCard
        icon={Navigation}
        label="Wind Gust"
        value={`${Math.round(daily.windSpeedMax[0])} km/h`}
        sub="Maximum today"
      />
    </div>
  );
}
