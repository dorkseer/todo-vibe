import { View, Text, Image, ScrollView } from "react-native";
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2 pb-1">
        {hourly.map((hour) => (
          <View
            key={hour.time}
            className="items-center gap-1 rounded-lg border border-zinc-100 px-3 py-2 dark:border-zinc-800"
          >
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatHour(hour.time)}
            </Text>
            <Image
              source={{ uri: `https://openweathermap.org/img/wn/${hour.icon}.png` }}
              style={{ width: 32, height: 32 }}
              accessibilityLabel={hour.description}
            />
            <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {hour.temp}°
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
