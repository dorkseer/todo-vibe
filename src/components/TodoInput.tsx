import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";

interface TodoInputProps {
  onAdd: (title: string, description?: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  function handleSubmit() {
    if (!title.trim()) return;
    onAdd(title, description || undefined);
    setTitle("");
    setDescription("");
    setShowDescription(false);
  }

  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-row gap-3">
        <TextInput
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleSubmit}
          placeholder="What needs to be done?"
          placeholderTextColor="#a1a1aa"
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <Pressable
          onPress={handleSubmit}
          className="rounded-xl bg-zinc-900 px-6 py-3 dark:bg-zinc-100"
        >
          <Text className="text-sm font-medium text-white dark:text-zinc-900">
            Add
          </Text>
        </Pressable>
      </View>
      {showDescription ? (
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description (optional)"
          placeholderTextColor="#a1a1aa"
          multiline
          numberOfLines={2}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      ) : (
        <Pressable onPress={() => setShowDescription(true)}>
          <Text className="text-sm text-zinc-400">+ Add description</Text>
        </Pressable>
      )}
    </View>
  );
}
