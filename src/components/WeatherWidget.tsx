import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useWeather } from "@/hooks/useWeather";
import { WeatherCurrent } from "./WeatherCurrent";
import { WeatherHourly } from "./WeatherHourly";
import { WeatherDaily } from "./WeatherDaily";
import { WarningIcon } from "./icons/WarningIcon";
import { RefreshIcon } from "./icons/RefreshIcon";

function timeAgo(timestamp: number) {
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} min ago`;
}

export function WeatherWidget() {
  const { weatherData, error, isLoading, refresh } = useWeather();

  return (
    <View className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <Text className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Weather
      </Text>

      {isLoading && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#a1a1aa" />
        </View>
      )}

      {error && !isLoading && (
        <View className="items-center gap-3 py-6">
          <WarningIcon size={32} color="#d4d4d8" />
          <Text className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {error.message}
          </Text>
          {error.code !== "GEOLOCATION_DENIED" && (
            <Pressable
              onPress={refresh}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 dark:bg-zinc-800"
            >
              <Text className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Try Again
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {weatherData && !isLoading && (
        <View className="gap-4">
          <WeatherCurrent current={weatherData.current} />

          <View>
            <Text className="mb-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
              Next 6 Hours
            </Text>
            <WeatherHourly hourly={weatherData.hourly} />
          </View>

          <View>
            <Text className="mb-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
              5-Day Forecast
            </Text>
            <WeatherDaily daily={weatherData.daily} />
          </View>

          <View className="flex-row items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <Text className="text-xs text-zinc-400 dark:text-zinc-500">
              Updated {timeAgo(weatherData.fetchedAt)}
            </Text>
            <Pressable
              onPress={refresh}
              className="rounded-lg p-1.5"
              accessibilityLabel="Refresh weather"
            >
              <RefreshIcon size={16} color="#a1a1aa" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
