
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, Dumbbell, Plus } from "lucide-react";

const workouts = [
  {
    name: "Push Day",
    date: "Today",
    exercises: 5,
    duration: "55 min",
  },
  {
    name: "Pull Day",
    date: "Yesterday",
    exercises: 6,
    duration: "62 min",
  },
  {
    name: "Leg Day",
    date: "Monday",
    exercises: 5,
    duration: "48 min",
  },
];

export default function WorkoutsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Workouts
          </h1>
        </div>

        <Link
          href="/workouts/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
        >
          <Plus size={18} />
          Start workout
        </Link>
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-5">
          <Dumbbell className="text-lime-400" size={22} />
          <p className="mt-4 text-2xl font-bold text-white">24</p>
          <p className="mt-1 text-sm text-zinc-500">Total workouts</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-5">
          <CalendarDays className="text-lime-400" size={22} />
          <p className="mt-4 text-2xl font-bold text-white">4</p>
          <p className="mt-1 text-sm text-zinc-500">This week</p>
        </div>
      </div>

      {/* Workout history */}
      <section className="rounded-2xl border border-zinc-800 bg-[#111113] p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="font-semibold text-white">
            Recent sessions
          </h2>
        </div>

        <div className="space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout.name}
              className="flex items-center gap-3 rounded-xl bg-zinc-900 p-4 sm:gap-4"
            >
              <div className="rounded-xl bg-zinc-800 p-3">
                <Dumbbell size={20} className="text-lime-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {workout.name}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {workout.exercises} exercises · {workout.duration}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-zinc-500">
                  {workout.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
