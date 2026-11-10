import Link from "next/link";

import {
  Dumbbell,
  TrendingUp,
  Trophy,
  CalendarDays,
} from "lucide-react";

import StatCard from "@/components/dashboard/stat-card";
import ProgressChart from "@/components/dashboard/progress-chart";
import RecentWorkouts from "@/components/dashboard/recent-workouts";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-center justify-between">
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
            className="rounded-xl bg-lime-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            + Start workout
          </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="This week"
          value="4"
          description="Training sessions"
          icon={CalendarDays}
        />

        <StatCard
          title="Personal records"
          value="8"
          description="Records achieved"
          icon={Trophy}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProgressChart />
        </div>

        <RecentWorkouts />
      </div>
    </div>
  );
}
