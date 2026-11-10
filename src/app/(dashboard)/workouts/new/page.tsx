import { headers } from "next/headers";
import { redirect } from "next/navigation";

import WorkoutEditor from "@/components/workouts/workout-editor";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewWorkoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Reuse an unfinished workout so refreshing or returning
  // to this route does not create duplicate draft sessions.
  let workout = await prisma.workout.findFirst({
    where: {
      userId,
      finishedAt: null,
    },
    orderBy: {
      startedAt: "desc",
    },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: {
          exercise: true,
          sets: {
            orderBy: { setNumber: "asc" },
          },
        },
      },
    },
  });

  if (!workout) {
    workout = await prisma.workout.create({
      data: {
        userId,
        name: "Today's workout",
      },
      include: {
        exercises: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: "asc" },
            },
          },
        },
      },
    });
  }

  const exerciseLibrary = await prisma.exercise.findMany({
    orderBy: [
      { muscleGroup: "asc" },
      { name: "asc" },
    ],
  });

  const previousEntries = await prisma.workoutExercise.findMany({
    where: {
      workout: {
        userId,
        finishedAt: { not: null },
      },
      sets: {
        some: { completed: true },
      },
    },
    orderBy: {
      workout: { startedAt: "desc" },
    },
    include: {
      exercise: {
        select: { id: true },
      },
      sets: {
        where: { completed: true },
        orderBy: { weightKg: "desc" },
        take: 1,
      },
    },
  });

  const previousByExercise = new Map<string, string>();

  for (const entry of previousEntries) {
    if (previousByExercise.has(entry.exercise.id)) {
      continue;
    }

    const bestSet = entry.sets[0];

    if (bestSet) {
      previousByExercise.set(
        entry.exercise.id,
        `${Number(bestSet.weightKg)} kg × ${bestSet.reps} reps`
      );
    }
  }

  const exercises = exerciseLibrary.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup ?? "",
    machine: exercise.machine ?? "",
    previous:
      previousByExercise.get(exercise.id) ??
      "No previous performance",
  }));

  return (
    <WorkoutEditor
      workout={{
        id: workout.id,
        name: workout.name,
        startedAt: workout.startedAt.toISOString(),
        exercises: workout.exercises.map((item) => ({
          id: item.id,
          name: item.exercise.name,
          muscleGroup: item.exercise.muscleGroup ?? "",
          machine: item.exercise.machine ?? "",
          previous:
            previousByExercise.get(item.exerciseId) ??
            "No previous performance",
          sets: item.sets.map((set) => ({
            id: set.id,
            weight: Number(set.weightKg),
            reps: set.reps,
            completed: set.completed,
          })),
        })),
      }}
      availableExercises={exercises}
    />
  );
}