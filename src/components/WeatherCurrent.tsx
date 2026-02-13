import { CurrentWeather } from "@/types/weather";

interface WeatherCurrentProps {
  current: CurrentWeather;
}

export function WeatherCurrent({ current }: WeatherCurrentProps) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
        alt={current.description}
        className="h-16 w-16"
      />
      <div>
        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {current.temp}°F
        </div>
        <div className="text-sm capitalize text-zinc-500 dark:text-zinc-400">
          {current.description}
        </div>
        <div className="text-xs text-zinc-400 dark:text-zinc-500">
          {current.locationName} · Feels like {current.feelsLike}°F
        </div>
      </div>
    </div>
  );
}
