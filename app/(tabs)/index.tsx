import { View, Text, ActivityIndicator, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTodos } from "@/hooks/useTodos";
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";
import { WeatherWidget } from "@/components/WeatherWidget";

export default function TodoScreen() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos();
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" color="#a1a1aa" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-4 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className={`mx-auto w-full max-w-5xl ${isWide ? "flex-row gap-8" : ""}`}>
          {/* Todo section */}
          <View className={isWide ? "flex-1 max-w-xl" : ""}>
            <View className={`mb-10 ${isWide ? "" : "items-center"}`}>
              <Text className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Todo Vibe
              </Text>
              <Text className="mt-2 text-zinc-500 dark:text-zinc-400">
                {todos.length === 0
                  ? "Start adding your tasks"
                  : `${todos.filter((t) => !t.completed).length} of ${todos.length} remaining`}
              </Text>
            </View>

            <View className="gap-6">
              <TodoInput onAdd={addTodo} />
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            </View>
          </View>

          {/* Weather sidebar on wide screens */}
          {isWide && (
            <View className="w-80 shrink-0">
              <WeatherWidget />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
