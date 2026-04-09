export interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
}

export interface HourlyData {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitationProbability: number[];
  precipitation: number[];
  weatherCode: number[];
  windSpeed: number[];
  windDirection: number[];
  uvIndex: number[];
}

export interface DailyData {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  precipitationSum: number[];
  windSpeedMax: number[];
  uvIndexMax: number[];
}

export interface AirQuality {
  usAqi: number;
  pm25: number;
  pm10: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
  airQuality: AirQuality | null;
  location: GeoLocation;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'night';
