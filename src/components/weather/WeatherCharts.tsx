import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { convertTemp, formatDay } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export default function WeatherCharts({ weather, unit }: Props) {
  const chartData = weather.daily.time.slice(0, 15).map((date, i) => ({
    day: formatDay(date).replace(',', ''),
    max: convertTemp(weather.daily.temperatureMax[i], unit),
    min: convertTemp(weather.daily.temperatureMin[i], unit),
    rain: Math.round(weather.daily.precipitationSum[i] * 10) / 10,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="glass-strong rounded-lg px-3 py-2 text-xs">
        <p className="text-glass font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="text-xs">
            {p.name}: {p.value}{p.name === 'rain' ? 'mm' : '°'}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="glass-card-static">
        <h3 className="text-glass text-sm font-semibold uppercase tracking-wider mb-4">📈 Temperature Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tempMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="max" stroke="hsl(35, 95%, 55%)" fill="url(#tempMax)" strokeWidth={2} name="max" />
            <Area type="monotone" dataKey="min" stroke="hsl(195, 100%, 50%)" fill="url(#tempMin)" strokeWidth={2} name="min" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card-static">
        <h3 className="text-glass text-sm font-semibold uppercase tracking-wider mb-4">🌧️ Rainfall Forecast</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rain" fill="hsl(195, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} name="rain" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
