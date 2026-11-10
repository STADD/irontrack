"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";

export interface ExerciseOption {
  id: string;
  name: string;
  muscleGroup: string;
  machine: string;
  previous: string;
}

interface ExerciseSelectorProps {
  exercises: ExerciseOption[];
  existingIds: string[];
  onSelect: (exercise: ExerciseOption) => void;
  disabled?: boolean;
}

export default function ExerciseSelector({
  exercises,
  existingIds,
  onSelect,
  disabled = false,
}: ExerciseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      exercises.filter(
        (exercise) =>
          !existingIds.includes(exercise.id) &&
          `${exercise.name} ${exercise.muscleGroup} ${exercise.machine}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [exercises, existingIds, search]
  );

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 py-4 text-sm font-semibold text-lime-400 transition hover:border-lime-400 hover:bg-lime-400/5 disabled:opacity-50"
      >
        <Plus size={18} />
        Add exercise
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exercise-selector-title"
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#111113] p-5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3
                id="exercise-selector-title"
                className="text-lg font-semibold text-white"
              >
                Select exercise
              </h3>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
                aria-label="Close exercise selector"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3">
              <Search
                size={18}
                className="text-zinc-500"
              />

              <input
                autoFocus
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search exercises..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none"
              />
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto">
              {filtered.map((exercise) => (
                <button
                  type="button"
                  key={exercise.id}
                  onClick={() => {
                    onSelect(exercise);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-zinc-900 p-4 text-left transition hover:bg-zinc-800"
                >
                  <span>
                    <span className="block text-sm font-medium text-white">
                      {exercise.name}
                    </span>

                    <span className="mt-1 block text-xs text-zinc-500">
                      {exercise.machine || "No equipment"} ·{" "}
                      {exercise.muscleGroup || "Uncategorized"}
                    </span>
                  </span>

                  <Plus
                    size={18}
                    className="shrink-0 text-lime-400"
                  />
                </button>
              ))}

              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-500">
                  {exercises.length === 0
                    ? "The exercise library is empty. Apply the exercise-library migration to add the starter catalogue."
                    : "No exercises found."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}