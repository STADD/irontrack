import Link from "next/link";
import {
  Dumbbell,
  Clock,
  ChevronRight,
} from "lucide-react";

interface RecentWorkout {
  id: string;
  name: string;
  exercises: number;
  duration: string;
  date: string;
  inProgress: boolean;
}

export default function RecentWorkouts({
  workouts,
}: {
  workouts: RecentWorkout[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-white">
          Recent workouts
        </h3>

        <Link
          href="/workouts"
          className="text-xs text-lime-400 hover:text-lime-300"
        >
          View all
        </Link>
      </div>

      {workouts.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          Your workout history will appear here.
        </p>
      ) : (
        <div className="space-y-5">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href="/workouts"
              className="flex items-center gap-4"
            >
              <div className="rounded-xl bg-zinc-800 p-3">
                <Dumbbell
                  className="text-lime-400"
                  size={20}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {workout.name}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {workout.exercises} exercises ·{" "}
                  {workout.duration}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-zinc-400">
                  {workout.date}
                </p>

                <Clock
                  size={14}
                  className="ml-auto mt-2 text-zinc-600"
                />
              </div>

              <ChevronRight
                size={16}
                className="text-zinc-600"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}