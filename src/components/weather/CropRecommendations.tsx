import { WeatherData } from '@/types/weather';
import { getCropRecommendations } from '@/utils/weatherUtils';

interface Props {
  weather: WeatherData;
}

export default function CropRecommendations({ weather }: Props) {
  const crops = getCropRecommendations(
    weather.current.temperature,
    weather.current.humidity,
    weather.daily.precipitationSum[0]
  );

  if (crops.length === 0) return null;

  return (
    <div className="glass-card-static animate-fade-in" style={{ animationDelay: '0.7s' }}>
      <h3 className="text-glass text-sm font-semibold uppercase tracking-wider mb-4">🌱 Crop Recommendations</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {crops.map((crop) => (
          <div key={crop.name} className="glass-subtle rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors">
            <span className="text-2xl">{crop.emoji}</span>
            <div>
              <p className="text-glass text-sm font-medium">{crop.name}</p>
              <p className="text-glass-subtle text-xs">{crop.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
