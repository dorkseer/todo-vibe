import { View, Text, Image } from "react-native";
import { CurrentWeather } from "@/types/weather";

interface WeatherCurrentProps {
  current: CurrentWeather;
}

export function WeatherCurrent({ current }: WeatherCurrentProps) {
  return (
    <View className="flex-row items-center gap-4">
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${current.icon}@2x.png` }}
        style={{ width: 64, height: 64 }}
        accessibilityLabel={current.description}
      />
      <View>
        <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {current.temp}°F
        </Text>
        <Text className="text-sm capitalize text-zinc-500 dark:text-zinc-400">
          {current.description}
        </Text>
        <Text className="text-xs text-zinc-400 dark:text-zinc-500">
          {current.locationName} · Feels like {current.feelsLike}°F
        </Text>
      </View>
    </View>
  );
}
