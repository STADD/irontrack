
"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";

const availableExercises = [
  {
    id: "chest-press",
    name: "Chest Press",
    muscleGroup: "Chest",
    machine: "Machine",
    previous: "45 kg × 10 reps",
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    machine: "Cable Machine",
    previous: "55 kg × 10 reps",
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscleGroup: "Legs",
    machine: "Machine",
    previous: "120 kg × 12 reps",
  },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    muscleGroup: "Shoulders",
    machine: "Machine",
    previous: "30 kg × 10 reps",
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    muscleGroup: "Arms",
    machine: "Cable Machine",
    previous: "20 kg × 12 reps",
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    muscleGroup: "Arms",
    machine: "Cable Machine",
    previous: "25 kg × 12 reps",
  },
];

interface ExerciseSelectorProps {
  onSelect: (exercise: (typeof availableExercises)[number]) => void;
  existingIds: string[];
}

export default function ExerciseSelector({
  onSelect,
  existingIds,
}: ExerciseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = availableExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.toLowerCase()) &&
    !existingIds.includes(exercise.id)
  );

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 py-4 text-sm font-semibold text-lime-400 transition hover:border-lime-400 hover:bg-lime-400/5"
      >
        <Plus size={18} />
        Add exercise
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#111113] p-5">

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Select exercise
              </h3>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3">
              <Search size={18} className="text-zinc-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none"
              />
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto">
              {filtered.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => {
                    onSelect(exercise);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-zinc-900 p-4 text-left transition hover:bg-zinc-800"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {exercise.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {exercise.machine} · {exercise.muscleGroup}
                    </p>
                  </div>

                  <Plus size={18} className="text-lime-400" />
                </button>
              ))}

              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No exercises found.
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
