import { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Todo } from "@/types/todo";
import { CheckIcon } from "./icons/CheckIcon";
import { EditIcon } from "./icons/EditIcon";
import { TrashIcon } from "./icons/TrashIcon";
import { ConfirmIcon } from "./icons/ConfirmIcon";
import { DiscardIcon } from "./icons/DiscardIcon";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description?: string) => void;
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const dateLine = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeLine = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return { dateLine, timeLine };
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function formatTimeSince(createdAt: number, now: number) {
  const elapsed = Math.max(0, now - createdAt);
  const totalMinutes = Math.floor(elapsed / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d, ${hours}h, ${minutes}m since started`;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description ?? "");
  const [now, setNow] = useState(Date.now());
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isEditing]);

  function handleSave() {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onEdit(todo.id, trimmed, editDescription || undefined);
    } else {
      setEditTitle(todo.title);
      setEditDescription(todo.description ?? "");
    }
    setIsEditing(false);
  }

  function handleDiscard() {
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? "");
    setIsEditing(false);
  }

  const { dateLine, timeLine } = formatDate(todo.createdAt);
  const isOverdue = now - todo.createdAt >= THREE_DAYS_MS;

  return (
    <View className="flex flex-row items-start gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Checkbox */}
      <Pressable
        onPress={() => onToggle(todo.id)}
        className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md border-2 ${
          todo.completed
            ? "border-zinc-400 bg-zinc-400 dark:border-zinc-500 dark:bg-zinc-500"
            : "border-zinc-300 dark:border-zinc-600"
        }`}
        accessibilityLabel={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && <CheckIcon size={12} color="#fff" />}
      </Pressable>

      {/* Content */}
      <View className="min-w-0 flex-1 gap-1">
        {isEditing ? (
          <>
            <TextInput
              ref={inputRef}
              value={editTitle}
              onChangeText={setEditTitle}
              onSubmitEditing={handleSave}
              className="rounded-lg border border-zinc-300 px-2 py-1 text-base text-zinc-900 dark:border-zinc-600 dark:text-zinc-100"
            />
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Add a description (optional)"
              placeholderTextColor="#a1a1aa"
              multiline
              numberOfLines={2}
              className="rounded-lg border border-zinc-300 px-2 py-1 text-sm text-zinc-900 dark:border-zinc-600 dark:text-zinc-100"
            />
          </>
        ) : (
          <>
            <Text
              className={`text-base ${
                todo.completed
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {todo.title}
            </Text>
            {todo.description && (
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                {todo.description}
              </Text>
            )}
          </>
        )}
      </View>

      {/* Right side: date info + action buttons */}
      <View className="shrink-0 flex-row items-start gap-3">
        <View className="mt-0.5 items-end">
          <Text className="text-xs text-zinc-400 dark:text-zinc-500">
            {dateLine}
          </Text>
          <Text className="text-xs text-zinc-400 dark:text-zinc-500">
            {timeLine}
          </Text>
          <Text
            className={`mt-1 text-xs ${
              isOverdue
                ? "text-red-500 dark:text-red-400"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {formatTimeSince(todo.createdAt, now)}
          </Text>
        </View>

        {isEditing ? (
          <View className="flex-row gap-1">
            <Pressable
              onPress={handleSave}
              className="rounded-lg p-1.5"
              accessibilityLabel="Confirm edit"
            >
              <ConfirmIcon size={16} color="#22c55e" />
            </Pressable>
            <Pressable
              onPress={handleDiscard}
              className="rounded-lg p-1.5"
              accessibilityLabel="Discard edit"
            >
              <DiscardIcon size={16} color="#ef4444" />
            </Pressable>
          </View>
        ) : (
          <View className="flex-row gap-1">
            <Pressable
              onPress={() => {
                setEditTitle(todo.title);
                setEditDescription(todo.description ?? "");
                setIsEditing(true);
              }}
              className="rounded-lg p-1.5"
              accessibilityLabel="Edit todo"
            >
              <EditIcon size={16} color="#a1a1aa" />
            </Pressable>
            <Pressable
              onPress={() => onDelete(todo.id)}
              className="rounded-lg p-1.5"
              accessibilityLabel="Delete todo"
            >
              <TrashIcon size={16} color="#a1a1aa" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
