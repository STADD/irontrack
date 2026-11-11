
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const instant = false;

async function requireUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage workouts.");
  }

  return session.user.id;
}

async function assertEditableWorkout(
  workoutId: string,
  userId: string
) {
  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId,
      finishedAt: null,
    },
    select: { id: true },
  });

  if (!workout) {
    throw new Error(
      "Workout not found or it has already been completed."
    );
  }
}

export async function updateWorkoutName(
  workoutId: string,
  name: string
) {
  const userId = await requireUserId();
  const cleanName = name.trim();

  if (!cleanName || cleanName.length > 80) {
    throw new Error(
      "Workout name must be between 1 and 80 characters."
    );
  }

  await assertEditableWorkout(workoutId, userId);

  await prisma.workout.update({
    where: { id: workoutId },
    data: { name: cleanName },
  });
}

export async function addExerciseToWorkout(
  workoutId: string,
  exerciseId: string
) {
  const userId = await requireUserId();

  await assertEditableWorkout(workoutId, userId);

  return prisma.$transaction(async (tx) => {
    const exercise = await tx.exercise.findUnique({
      where: { id: exerciseId },
      select: { id: true },
    });

    if (!exercise) {
      throw new Error("Exercise not found.");
    }

    const existing = await tx.workoutExercise.findFirst({
      where: {
        workoutId,
        exerciseId,
      },
      select: { id: true },
    });

    if (existing) {
      throw new Error(
        "This exercise is already in the workout."
      );
    }

    const last = await tx.workoutExercise.aggregate({
      where: { workoutId },
      _max: { order: true },
    });

    return tx.workoutExercise.create({
      data: {
        workoutId,
        exerciseId,
        order: (last._max.order ?? -1) + 1,
        sets: {
          create: {
            setNumber: 1,
            weightKg: 0,
            reps: 0,
          },
        },
      },
      include: {
        exercise: true,
        sets: {
          orderBy: { setNumber: "asc" },
        },
      },
    });
  });
}

export async function updateWorkoutSet(
  workoutId: string,
  setId: string,
  weightKg: number,
  reps: number
) {
  const userId = await requireUserId();

  if (
    !Number.isFinite(weightKg) ||
    weightKg < 0 ||
    weightKg > 10000
  ) {
    throw new Error("Enter a valid weight.");
  }

  if (
    !Number.isInteger(reps) ||
    reps < 0 ||
    reps > 10000
  ) {
    throw new Error("Enter a valid number of reps.");
  }

  await assertEditableWorkout(workoutId, userId);

  const result = await prisma.workoutSet.updateMany({
    where: {
      id: setId,
      workoutExercise: {
        workoutId,
        workout: { userId },
      },
    },
    data: {
      weightKg,
      reps,
    },
  });

  if (result.count !== 1) {
    throw new Error("Set not found.");
  }
}

export async function toggleWorkoutSet(
  workoutId: string,
  setId: string,
  completed: boolean
) {
  const userId = await requireUserId();

  await assertEditableWorkout(workoutId, userId);

  const result = await prisma.workoutSet.updateMany({
    where: {
      id: setId,
      workoutExercise: {
        workoutId,
        workout: { userId },
      },
    },
    data: { completed },
  });

  if (result.count !== 1) {
    throw new Error("Set not found.");
  }
}

export async function addSetToExercise(
  workoutId: string,
  workoutExerciseId: string
) {
  const userId = await requireUserId();

  await assertEditableWorkout(workoutId, userId);

  return prisma.$transaction(async (tx) => {
    const exercise = await tx.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workoutId,
        workout: { userId },
      },
      include: {
        sets: {
          orderBy: { setNumber: "desc" },
          take: 1,
        },
      },
    });

    if (!exercise) {
      throw new Error("Workout exercise not found.");
    }

    const lastSet = exercise.sets[0];

    return tx.workoutSet.create({
      data: {
        workoutExerciseId,
        setNumber: (lastSet?.setNumber ?? 0) + 1,
        weightKg: lastSet?.weightKg ?? 0,
        reps: lastSet?.reps ?? 0,
      },
    });
  });
}

export async function removeWorkoutSet(
  workoutId: string,
  setId: string
) {
  const userId = await requireUserId();

  await assertEditableWorkout(workoutId, userId);

  const result = await prisma.workoutSet.deleteMany({
    where: {
      id: setId,
      workoutExercise: {
        workoutId,
        workout: { userId },
      },
    },
  });

  if (result.count !== 1) {
    throw new Error("Set not found.");
  }
}

export async function removeExerciseFromWorkout(
  workoutId: string,
  workoutExerciseId: string
) {
  const userId = await requireUserId();

  await assertEditableWorkout(workoutId, userId);

  const result = await prisma.workoutExercise.deleteMany({
    where: {
      id: workoutExerciseId,
      workoutId,
      workout: { userId },
    },
  });

  if (result.count !== 1) {
    throw new Error(
      "Exercise not found in this workout."
    );
  }
}

export async function finishWorkout(
  workoutId: string
) {
  const userId = await requireUserId();

  await assertEditableWorkout(workoutId, userId);

  const completedSets = await prisma.workoutSet.count({
    where: {
      completed: true,
      workoutExercise: {
        workoutId,
        workout: { userId },
      },
    },
  });

  if (completedSets === 0) {
    throw new Error(
      "Complete at least one set before finishing your workout."
    );
  }

  await prisma.workout.update({
    where: { id: workoutId },
    data: {
      finishedAt: new Date(),
    },
  });
}
