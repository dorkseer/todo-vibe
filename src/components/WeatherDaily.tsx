import { View, Text, Image } from "react-native";
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
    <View className="gap-1">
      {daily.map((day) => (
        <View
          key={day.date}
          className="flex-row items-center gap-3 rounded-lg px-2 py-1.5"
        >
          <Text className="w-10 text-sm text-zinc-500 dark:text-zinc-400">
            {formatDay(day.date)}
          </Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${day.icon}.png` }}
            style={{ width: 32, height: 32 }}
            accessibilityLabel={day.description}
          />
          <View className="flex-1 flex-row items-center justify-end gap-2">
            <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {day.tempHigh}°
            </Text>
            <Text className="text-sm text-zinc-400 dark:text-zinc-500">
              {day.tempLow}°
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
