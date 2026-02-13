import { DailyForecast } from "@/types/weather";

interface WeatherDailyProps {
  daily: DailyForecast[];
}

function formatDay(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    weekday: "short",
  });
}

export function WeatherDaily({ daily }: WeatherDailyProps) {
  return (
    <div className="flex flex-col gap-1">
      {daily.map((day) => (
        <div
          key={day.date}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5"
        >
          <span className="w-10 text-sm text-zinc-500 dark:text-zinc-400">
            {formatDay(day.date)}
          </span>
          <img
            src={`https://openweathermap.org/img/wn/${day.icon}.png`}
            alt={day.description}
            className="h-8 w-8"
          />
          <div className="flex flex-1 items-center justify-end gap-2 text-sm">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {day.tempHigh}°
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">
              {day.tempLow}°
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
