"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo } from "@/types/todo";

const STORAGE_KEY = "todo-vibe-todos";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Todo[];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (avoids SSR hydration mismatch)
  useEffect(() => {
    setTodos(loadTodos());
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever todos change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
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

  const editTodo = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title: trimmed } : todo
      )
    );
  }, []);

  return { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo };
}
