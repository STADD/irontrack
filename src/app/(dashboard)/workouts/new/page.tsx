
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Dumbbell, Flag, Trophy } from "lucide-react";

import ExerciseCard, {
  WorkoutExercise,
} from "@/components/workouts/exercise-card";

import ExerciseSelector from "@/components/workouts/exercise-selector";

const initialExercises: WorkoutExercise[] = [
  {
    id: "chest-press",
    name: "Chest Press",
    muscleGroup: "Chest",
    machine: "Machine",
    previous: "40 kg × 12 reps",
    sets: [
      { id: "set-1", weight: 40, reps: 12, completed: false },
      { id: "set-2", weight: 45, reps: 10, completed: false },
    ],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    machine: "Cable Machine",
    previous: "50 kg × 12 reps",
    sets: [
      { id: "set-3", weight: 50, reps: 12, completed: false },
    ],
  },
];

export default function NewWorkoutPage() {
  const [exercises, setExercises] =
    useState<WorkoutExercise[]>(initialExercises);

  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;

    const interval = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [finished]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) => {
    setExercises((previous) =>
      previous.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, [field]: value }
                  : set
              ),
            }
          : exercise
      )
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises((previous) =>
      previous.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;

        const lastSet = exercise.sets[exercise.sets.length - 1];

        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: crypto.randomUUID(),
              weight: lastSet?.weight ?? 0,
              reps: lastSet?.reps ?? 0,
              completed: false,
            },
          ],
        };
      })
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises((previous) =>
      previous.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter(
                (set) => set.id !== setId
              ),
            }
          : exercise
      )
    );
  };

  const toggleSet = (exerciseId: string, setId: string) => {
    setExercises((previous) =>
      previous.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, completed: !set.completed }
                  : set
              ),
            }
          : exercise
      )
    );
  };

  const addExercise = (
    exercise: {
      id: string;
      name: string;
      muscleGroup: string;
      machine: string;
      previous: string;
    }
  ) => {
    setExercises((previous) => [
      ...previous,
      {
        ...exercise,
        sets: [
          {
            id: crypto.randomUUID(),
            weight: 0,
            reps: 0,
            completed: false,
          },
        ],
      },
    ]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((previous) =>
      previous.filter((exercise) => exercise.id !== exerciseId)
    );
  };

  const totalSets = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  const completedSets = exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.completed).length,
    0
  );

  const totalVolume = exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets
        .filter((set) => set.completed)
        .reduce((sum, set) => sum + set.weight * set.reps, 0),
    0
  );

  const finishWorkout = () => {
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10">
            <Trophy className="text-lime-400" size={32} />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Workout completed!
          </h1>

          <div className="my-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Exercises", value: exercises.length.toString() },
              { label: "Sets", value: completedSets.toString() },
              {
                label: "Volume",
                value: `${totalVolume.toLocaleString()} kg`,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-zinc-900 p-3">
                <p className="text-xs text-zinc-500">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mb-6 text-xs text-zinc-500">
            This is a local preview. Your workout has not been saved to a database.
          </p>

          <Link
            href="/workouts"
            className="inline-flex rounded-xl bg-lime-400 px-6 py-3 text-sm font-semibold text-black hover:bg-lime-300"
          >
            Back to workouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <Link
        href="/workouts"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to workouts
      </Link>

      {/* Workout heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-lime-400">
            <span className="h-2 w-2 rounded-full bg-lime-400" />
            Workout in progress
          </div>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Today's workout
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Record your sets and track your progress.
          </p>
        </div>
      </div>

      {/* Workout statistics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-[#111113] p-3 sm:p-4">
          <Dumbbell size={18} className="text-lime-400" />
          <p className="mt-3 text-xl font-bold text-white">
            {exercises.length}
          </p>
          <p className="text-xs text-zinc-500">Exercises</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#111113] p-3 sm:p-4">
          <Flag size={18} className="text-lime-400" />
          <p className="mt-3 text-xl font-bold text-white">
            {completedSets}/{totalSets}
          </p>
          <p className="text-xs text-zinc-500">Completed sets</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-zinc-800 bg-[#111113] p-4">
        <div className="mb-3 flex justify-between text-xs">
          <span className="text-zinc-400">Workout completion</span>
          <span className="text-lime-400">
            {totalSets === 0
              ? 0
              : Math.round((completedSets / totalSets) * 100)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-lime-400 transition-all"
            style={{
              width: `${
                totalSets === 0
                  ? 0
                  : (completedSets / totalSets) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Exercise cards */}
      <div className="space-y-5">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={updateSet}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onToggleSet={toggleSet}
            onRemoveExercise={removeExercise}
          />
        ))}
      </div>

      <ExerciseSelector
        onSelect={addExercise}
        existingIds={exercises.map((exercise) => exercise.id)}
      />

      {/* Finish workout */}
      <div className="sticky bottom-20 z-20 rounded-2xl border border-zinc-800 bg-[#111113]/95 p-4 backdrop-blur sm:bottom-4">
        <button
          onClick={finishWorkout}
          disabled={completedSets === 0}
          className="w-full rounded-xl bg-lime-400 py-4 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Finish workout
        </button>

        <p className="mt-2 text-center text-xs text-zinc-500">
          Complete at least one set to finish your workout.
        </p>
      </div>
    </div>
  );
}
