import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  Dumbbell,
  TrendingUp,
  Trophy,
  CalendarDays,
} from "lucide-react";

import StatCard from "@/components/dashboard/stat-card";
import ProgressChart from "@/components/dashboard/progress-chart";
import RecentWorkouts from "@/components/dashboard/recent-workouts";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const instant = false

function formatDuration(
  startedAt: Date,
  finishedAt: Date | null
) {
  if (!finishedAt) return "In progress";

  const minutes = Math.max(
    1,
    Math.round(
      (finishedAt.getTime() - startedAt.getTime()) / 60000
    )
  );

  return `${minutes} min`;
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);

  startOfWeek.setDate(
    startOfWeek.getDate() -
      ((startOfWeek.getDay() + 6) % 7)
  );

  const [
    totalWorkouts,
    thisWeek,
    completedSets,
    recent,
    history,
  ] = await Promise.all([
    prisma.workout.count({
      where: {
        userId,
        finishedAt: { not: null },
      },
    }),

    prisma.workout.count({
      where: {
        userId,
        finishedAt: { not: null },
        startedAt: { gte: startOfWeek },
      },
    }),

    prisma.workoutSet.findMany({
      where: {
        completed: true,
        workoutExercise: {
          workout: {
            userId,
            finishedAt: { not: null },
          },
        },
      },
      select: {
        weightKg: true,
        reps: true,
        workoutExercise: {
          select: {
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),

    prisma.workout.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { exercises: true },
        },
      },
    }),

    prisma.workoutSet.findMany({
      where: {
        completed: true,
        workoutExercise: {
          workout: {
            userId,
            finishedAt: { not: null },
          },
        },
      },
      orderBy: {
        workoutExercise: {
          workout: {
            startedAt: "asc",
          },
        },
      },
      select: {
        weightKg: true,
        workoutExercise: {
          select: {
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
            workout: {
              select: {
                startedAt: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const totalVolume = completedSets.reduce(
    (sum, set) =>
      sum + Number(set.weightKg) * set.reps,
    0
  );

  // Find the most frequently tracked exercise.
  const exerciseFrequency = new Map<
    string,
    { name: string; count: number }
  >();

  for (const set of history) {
    const exercise = set.workoutExercise.exercise;

    const current = exerciseFrequency.get(exercise.id);

    exerciseFrequency.set(exercise.id, {
      name: exercise.name,
      count: (current?.count ?? 0) + 1,
    });
  }

  const mostTrackedExercise = [
    ...exerciseFrequency.entries(),
  ].sort((a, b) => b[1].count - a[1].count)[0];

  // Calculate monthly best recorded weight for the most
  // frequently tracked exercise.
  const monthlyBest = new Map<string, number>();

  if (mostTrackedExercise) {
    for (const set of history) {
      if (
        set.workoutExercise.exercise.id !==
        mostTrackedExercise[0]
      ) {
        continue;
      }

      const date = set.workoutExercise.workout.startedAt;

      const key = new Intl.DateTimeFormat("en", {
        month: "short",
        year: "2-digit",
      }).format(date);

      monthlyBest.set(
        key,
        Math.max(
          monthlyBest.get(key) ?? 0,
          Number(set.weightKg)
        )
      );
    }
  }

  const progressData = [
    ...monthlyBest.entries(),
  ].map(([date, weight]) => ({
    date,
    weight,
  }));

  const recentWorkouts = recent.map((workout) => ({
    id: workout.id,
    name: workout.name,
    exercises: workout._count.exercises,
    duration: formatDuration(
      workout.startedAt,
      workout.finishedAt
    ),
    date: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(workout.startedAt),
    inProgress: !workout.finishedAt,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Track your progress and keep getting stronger.
          </p>
        </div>

        <Link
          href="/workouts/new"
          className="shrink-0 rounded-xl bg-lime-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
        >
          + Start workout
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total workouts"
          value={totalWorkouts.toString()}
          description="Completed sessions"
          icon={Dumbbell}
        />

        <StatCard
          title="This week"
          value={thisWeek.toString()}
          description="Training sessions"
          icon={CalendarDays}
        />

        <StatCard
          title="Training volume"
          value={`${Math.round(totalVolume).toLocaleString()} kg`}
          description="Completed weight × reps"
          icon={TrendingUp}
        />

        <StatCard
          title="Completed sets"
          value={completedSets.length.toString()}
          description="Across completed workouts"
          icon={Trophy}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProgressChart
            data={progressData}
            exerciseName={
              mostTrackedExercise?.[1].name ?? null
            }
          />
        </div>

        <RecentWorkouts workouts={recentWorkouts} />
      </div>
    </div>
  );
}