"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Dumbbell,
  Flag,
  Trophy,
} from "lucide-react";

import ExerciseCard, {
  WorkoutExercise,
} from "@/components/workouts/exercise-card";

import ExerciseSelector, {
  ExerciseOption,
} from "@/components/workouts/exercise-selector";

import {
  addExerciseToWorkout,
  addSetToExercise,
  finishWorkout,
  removeExerciseFromWorkout,
  removeWorkoutSet,
  toggleWorkoutSet,
  updateWorkoutName,
  updateWorkoutSet,
} from "@/components/workouts/actions";

interface WorkoutEditorProps {
  workout: {
    id: string;
    name: string;
    startedAt: string;
    exercises: WorkoutExercise[];
  };

  availableExercises: ExerciseOption[];
}

export default function WorkoutEditor({
  workout,
  availableExercises,
}: WorkoutEditorProps) {
  const router = useRouter();

  const [exercises, setExercises] = useState(
    workout.exercises
  );

  const [name, setName] = useState(workout.name);

  const [seconds, setSeconds] = useState(() =>
    Math.max(
      0,
      Math.floor(
        (Date.now() -
          new Date(workout.startedAt).getTime()) /
          1000
      )
    )
  );

  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (finished) return;

    const interval = window.setInterval(() => {
      setSeconds(
        Math.max(
          0,
          Math.floor(
            (Date.now() -
              new Date(workout.startedAt).getTime()) /
              1000
          )
        )
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finished, workout.startedAt]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const remainingSeconds = totalSeconds % 60;

    return [
      hours,
      minutes,
      remainingSeconds,
    ]
      .map((part) =>
        part.toString().padStart(2, "0")
      )
      .join(":");
  };

  const completedSets = exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.filter(
        (set) => set.completed
      ).length,
    0
  );

  const totalSets = exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.length,
    0
  );

  const totalVolume = exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets
        .filter((set) => set.completed)
        .reduce(
          (sum, set) =>
            sum + set.weight * set.reps,
          0
        ),
    0
  );

  const completion =
    totalSets === 0
      ? 0
      : Math.round(
          (completedSets / totalSets) * 100
        );

  const runAction = (
    action: () => Promise<unknown>
  ) => {
    setError("");

    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Something went wrong. Please try again."
        );
      }
    });
  };

  const updateSetLocally = (
    exerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? {
                      ...set,
                      [field]: Number.isFinite(value)
                        ? value
                        : 0,
                    }
                  : set
              ),
            }
          : exercise
      )
    );
  };

  const persistExerciseSets = async (
    exercise: WorkoutExercise
  ) => {
    await Promise.all(
      exercise.sets.map((set) =>
        updateWorkoutSet(
          workout.id,
          set.id,
          set.weight,
          set.reps
        )
      )
    );
  };

  const saveSet = (
    exerciseId: string,
    setId: string,
    weight: number,
    reps: number
  ) => {
    const exercise = exercises.find(
      (item) => item.id === exerciseId
    );

    const set = exercise?.sets.find(
      (item) => item.id === setId
    );

    if (!set) return;

    runAction(() =>
      updateWorkoutSet(
        workout.id,
        setId,
        weight,
        reps
      )
    );
  };

  const addExercise = (
    exercise: ExerciseOption
  ) => {
    runAction(async () => {
      const created = await addExerciseToWorkout(
        workout.id,
        exercise.id
      );

      setExercises((current) => [
        ...current,
        {
          id: created.id,
          name: created.exercise.name,
          muscleGroup:
            created.exercise.muscleGroup ?? "",
          machine: created.exercise.machine ?? "",
          previous: exercise.previous,
          sets: created.sets.map((set) => ({
            id: set.id,
            weight: Number(set.weightKg),
            reps: set.reps,
            completed: set.completed,
          })),
        },
      ]);
    });
  };

  const addSet = (exerciseId: string) => {
    runAction(async () => {
      const exercise = exercises.find(
        (item) => item.id === exerciseId
      );

      if (!exercise) return;

      await persistExerciseSets(exercise);

      const created = await addSetToExercise(
        workout.id,
        exerciseId
      );

      setExercises((current) =>
        current.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: [
                  ...exercise.sets,
                  {
                    id: created.id,
                    weight: Number(created.weightKg),
                    reps: created.reps,
                    completed: created.completed,
                  },
                ],
              }
            : exercise
        )
      );
    });
  };

  const removeSet = (
    exerciseId: string,
    setId: string
  ) => {
    runAction(async () => {
      const exercise = exercises.find(
        (item) => item.id === exerciseId
      );

      const set = exercise?.sets.find(
        (item) => item.id === setId
      );

      if (set) {
        await updateWorkoutSet(
          workout.id,
          setId,
          set.weight,
          set.reps
        );
      }

      await removeWorkoutSet(
        workout.id,
        setId
      );

      setExercises((current) =>
        current.map((exercise) =>
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
    });
  };

  const removeExercise = (
    exerciseId: string
  ) => {
    runAction(async () => {
      await removeExerciseFromWorkout(
        workout.id,
        exerciseId
      );

      setExercises((current) =>
        current.filter(
          (exercise) => exercise.id !== exerciseId
        )
      );
    });
  };

  const toggleSet = (
    exerciseId: string,
    setId: string
  ) => {
    const currentSet = exercises
      .find(
        (exercise) => exercise.id === exerciseId
      )
      ?.sets.find(
        (set) => set.id === setId
      );

    if (!currentSet) return;

    const completed = !currentSet.completed;

    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, completed }
                  : set
              ),
            }
          : exercise
      )
    );

    runAction(async () => {
      await updateWorkoutSet(
        workout.id,
        setId,
        currentSet.weight,
        currentSet.reps
      );

      await toggleWorkoutSet(
        workout.id,
        setId,
        completed
      );
    });
  };

  const saveName = () => {
    if (
      name.trim() &&
      name.trim() !== workout.name
    ) {
      runAction(() =>
        updateWorkoutName(workout.id, name)
      );
    }
  };

  const handleFinish = () => {
    runAction(async () => {
      await Promise.all(
        exercises.map((exercise) =>
          persistExerciseSets(exercise)
        )
      );

      if (name.trim()) {
        await updateWorkoutName(
          workout.id,
          name
        );
      }

      await finishWorkout(workout.id);

      setFinished(true);
    });
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10">
            <Trophy
              className="text-lime-400"
              size={32}
            />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Workout completed!
          </h1>

          <div className="my-8 grid grid-cols-3 gap-3">
            {[
              {
                label: "Exercises",
                value: exercises.length.toString(),
              },
              {
                label: "Sets",
                value: completedSets.toString(),
              },
              {
                label: "Volume",
                value: `${totalVolume.toLocaleString()} kg`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-zinc-900 p-3"
              >
                <p className="text-xs text-zinc-500">
                  {item.label}
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mb-6 text-xs text-zinc-500">
            Your workout has been saved to your account.
          </p>

          <Link
            href="/workouts"
            className="inline-flex rounded-xl bg-lime-400 px-6 py-3 text-sm font-semibold text-black hover:bg-lime-300"
          >
            View workout history
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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-lime-400">
            <span className="h-2 w-2 rounded-full bg-lime-400" />
            Workout in progress
          </div>

          <input
            aria-label="Workout name"
            value={name}
            maxLength={80}
            onChange={(event) =>
              setName(event.target.value)
            }
            onBlur={saveName}
            className="mt-2 w-full max-w-xl border-b border-transparent bg-transparent text-2xl font-bold text-white outline-none focus:border-lime-400 sm:text-3xl"
          />

          <p className="mt-1 text-sm text-zinc-500">
            Record your sets and track your progress.
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-[#111113] p-3 sm:p-4">
          <Dumbbell
            size={18}
            className="text-lime-400"
          />

          <p className="mt-3 text-xl font-bold text-white">
            {exercises.length}
          </p>

          <p className="text-xs text-zinc-500">
            Exercises
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#111113] p-3 sm:p-4">
          <Flag
            size={18}
            className="text-lime-400"
          />

          <p className="mt-3 text-xl font-bold text-white">
            {completedSets}/{totalSets}
          </p>

          <p className="text-xs text-zinc-500">
            Completed sets
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#111113] p-3 sm:p-4">
          <Trophy
            size={18}
            className="text-lime-400"
          />

          <p className="mt-3 text-xl font-bold text-white">
            {totalVolume.toLocaleString()}
          </p>

          <p className="text-xs text-zinc-500">
            Volume (kg)
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#111113] p-4">
        <div className="mb-3 flex justify-between text-xs">
          <span className="text-zinc-400">
            Workout completion
          </span>

          <span className="text-lime-400">
            {completion}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-lime-400 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={updateSetLocally}
            onSaveSet={saveSet}
            onAddSet={addSet}
            onRemoveSet={removeSet}
            onToggleSet={toggleSet}
            onRemoveExercise={removeExercise}
          />
        ))}
      </div>

      <ExerciseSelector
        exercises={availableExercises}
        existingIds={exercises.map(
          (exercise) => exercise.id
        )}
        onSelect={addExercise}
        disabled={isPending}
      />

      <div className="sticky bottom-20 z-20 rounded-2xl border border-zinc-800 bg-[#111113]/95 p-4 backdrop-blur sm:bottom-4">
        <button
          type="button"
          onClick={handleFinish}
          disabled={
            completedSets === 0 || isPending
          }
          className="w-full rounded-xl bg-lime-400 py-4 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending
            ? "Saving..."
            : "Finish workout"}
        </button>

        <p className="mt-2 text-center text-xs text-zinc-500">
          Complete at least one set to finish your workout.
        </p>
      </div>
    </div>
  );
}