import { WeatherData, WeatherType } from '@/types/weather';
import { getWeatherInfo, getBackgroundClass } from '@/utils/weatherUtils';
import heroBg from '@/assets/hero-bg.jpg';

interface Props {
  weather: WeatherData | null;
}

function RainEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${15 + Math.random() * 25}px`,
            animation: `rain-drop ${0.8 + Math.random() * 0.6}s linear ${Math.random() * 2}s infinite`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

function SnowEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `snow-fall ${3 + Math.random() * 4}s linear ${Math.random() * 5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function WeatherBackground({ weather }: Props) {
  if (!weather) {
    return (
      <div className="fixed inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>
    );
  }

  const { type } = getWeatherInfo(weather.current.weatherCode, weather.current.isDay);
  const bgClass = getBackgroundClass(type);

  return (
    <div className={`fixed inset-0 z-0 ${bgClass} animate-gradient transition-all duration-1000`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      {type === 'rain' && <RainEffect />}
      {type === 'snow' && <SnowEffect />}
    </div>
  );
}
