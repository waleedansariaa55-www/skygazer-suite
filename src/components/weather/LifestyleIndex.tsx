import { Plane, Dumbbell, TreePine } from 'lucide-react';
import { WeatherData } from '@/types/weather';
import { getLifestyleIndex } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
}

export default function LifestyleIndex({ weather }: Props) {
  const now = new Date();
  const hourIdx = weather.hourly.time.findIndex(t => new Date(t) >= now);
  const idx = Math.max(0, hourIdx);

  const lifestyle = getLifestyleIndex(
    weather.current.temperature,
    weather.current.windSpeed,
    weather.hourly.precipitationProbability[idx] || 0,
    weather.hourly.uvIndex[idx] || 0
  );

  const items = [
    { key: 'travel', icon: Plane, label: 'Travel', ...lifestyle.travel },
    { key: 'sports', icon: Dumbbell, label: 'Sports', ...lifestyle.sports },
    { key: 'outdoor', icon: TreePine, label: 'Outdoor', ...lifestyle.outdoor },
  ];

  return (
    <div className="glass-card-static animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <h3 className="text-glass text-sm font-semibold uppercase tracking-wider mb-4">🧠 Lifestyle Index</h3>
      <div className="grid grid-cols-3 gap-4">
        {items.map(({ key, icon: Icon, label, score, label: scoreLabel }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke={score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 97.4} 97.4`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-5 h-5 text-glass" />
              </div>
            </div>
            <span className="text-glass text-xs font-medium">{label}</span>
            <span className="text-glass-muted text-xs">{scoreLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
