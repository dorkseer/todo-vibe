import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WeatherWidget } from "@/components/WeatherWidget";

export default function WeatherScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950" edges={["top"]}>
      <ScrollView contentContainerClassName="p-4">
        <WeatherWidget />
      </ScrollView>
    </SafeAreaView>
  );
}
