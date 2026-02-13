import { HourlyForecast } from "@/types/weather";

interface WeatherHourlyProps {
  hourly: HourlyForecast[];
}

function formatHour(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
    hour: "numeric",
  });
}

export function WeatherHourly({ hourly }: WeatherHourlyProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {hourly.map((hour) => (
        <div
          key={hour.time}
          className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-zinc-100 px-3 py-2 dark:border-zinc-800"
        >
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatHour(hour.time)}
          </span>
          <img
            src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
            alt={hour.description}
            className="h-8 w-8"
          />
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {hour.temp}°
          </span>
        </div>
      ))}
    </div>
  );
}
