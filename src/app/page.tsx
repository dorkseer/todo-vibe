"use client";

import { useTodos } from "@/hooks/useTodos";
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";

export default function Home() {
  const { todos, isLoaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Todo Vibe
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {todos.length === 0
            ? "Start adding your tasks"
            : `${todos.filter((t) => !t.completed).length} of ${todos.length} remaining`}
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </div>
    </div>
  );
}
