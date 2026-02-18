import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { Todo } from "@/types/todo";

const STORAGE_KEY = "todo-vibe-todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          setTodos(JSON.parse(stored) as Todo[]);
        } catch {
          // ignore corrupt data
        }
      }
      setIsLoaded(true);
    });
  }, []);

  // Persist to AsyncStorage whenever todos change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = useCallback((title: string, description?: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const desc = description?.trim();
    setTodos((prev) => [
      {
        id: randomUUID(),
        title: trimmed,
        description: desc || undefined,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: string, title: string, description?: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const desc = description?.trim();
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title: trimmed, description: desc || undefined } : todo
      )
    );
  }, []);

  return { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo };
}
