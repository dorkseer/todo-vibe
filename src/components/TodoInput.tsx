"use client";

import { useState, FormEvent } from "react";

interface TodoInputProps {
  onAdd: (title: string, description?: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description || undefined);
    setTitle("");
    setDescription("");
    setShowDescription(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add
        </button>
      </div>
      {showDescription ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          rows={2}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="self-start text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          + Add description
        </button>
      )}
    </form>
  );
}
