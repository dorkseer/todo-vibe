export interface Coordinates {
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  locationName: string;
}

export interface HourlyForecast {
  time: number;
  temp: number;
  icon: string;
  description: string;
}

export interface DailyForecast {
  date: number;
  tempHigh: number;
  tempLow: number;
  icon: string;
  description: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  fetchedAt: number;
}

export interface WeatherError {
  message: string;
  code:
    | "GEOLOCATION_DENIED"
    | "GEOLOCATION_UNAVAILABLE"
    | "API_ERROR"
    | "NETWORK_ERROR";
}
