"use client";

import { useState, useRef, useEffect } from "react";
import { Todo } from "@/types/todo";

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

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
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

  return (
    <li className="group flex items-start gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 transition-colors hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          todo.completed
            ? "border-zinc-400 bg-zinc-400 dark:border-zinc-500 dark:bg-zinc-500"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
        }`}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-base outline-none focus:border-zinc-400 dark:border-zinc-600 dark:focus:border-zinc-500"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={2}
              className="rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-zinc-400 dark:border-zinc-600 dark:focus:border-zinc-500"
            />
          </>
        ) : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
              className={`cursor-default text-base select-none ${
                todo.completed
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {todo.title}
            </span>
            {todo.description && (
              <p className="whitespace-pre-wrap text-sm text-zinc-500 dark:text-zinc-400">
                {todo.description}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex shrink-0 items-start gap-3">
        <div className="mt-0.5 text-right text-xs leading-tight text-zinc-400 dark:text-zinc-500">
          <div>{dateLine}</div>
          <div>{timeLine}</div>
        </div>

        {isEditing ? (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
              aria-label="Confirm edit"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleDiscard}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
              aria-label="Discard edit"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => {
                setEditTitle(todo.title);
                setEditDescription(todo.description ?? "");
                setIsEditing(true);
              }}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label="Edit todo"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
              aria-label="Delete todo"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
