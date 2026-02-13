"use client";

import { useWeather } from "@/hooks/useWeather";
import { WeatherCurrent } from "./WeatherCurrent";
import { WeatherHourly } from "./WeatherHourly";
import { WeatherDaily } from "./WeatherDaily";

function timeAgo(timestamp: number) {
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} min ago`;
}

function LoadingSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex flex-col gap-2">
          <div className="h-7 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-20 w-14 shrink-0 rounded-lg bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
    </div>
  );
}

export function WeatherWidget() {
  const { weatherData, error, isLoading, refresh } = useWeather();

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Weather
      </h2>

      {isLoading && <LoadingSkeleton />}

      {error && !isLoading && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <svg
            className="h-8 w-8 text-zinc-300 dark:text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {error.message}
          </p>
          {error.code !== "GEOLOCATION_DENIED" && (
            <button
              onClick={refresh}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {weatherData && !isLoading && (
        <div className="flex flex-col gap-4">
          <WeatherCurrent current={weatherData.current} />

          <div>
            <h3 className="mb-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
              Next 6 Hours
            </h3>
            <WeatherHourly hourly={weatherData.hourly} />
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
              5-Day Forecast
            </h3>
            <WeatherDaily daily={weatherData.daily} />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Updated {timeAgo(weatherData.fetchedAt)}
            </span>
            <button
              onClick={refresh}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label="Refresh weather"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M20.016 4.356v4.992"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
