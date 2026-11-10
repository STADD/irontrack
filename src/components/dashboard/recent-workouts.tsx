
import { Dumbbell, Clock, ChevronRight } from "lucide-react";

const workouts = [
  {
    name: "Push Day",
    exercises: 5,
    duration: "55 min",
    date: "Today",
  },
  {
    name: "Pull Day",
    exercises: 6,
    duration: "62 min",
    date: "Yesterday",
  },
  {
    name: "Leg Day",
    exercises: 5,
    duration: "48 min",
    date: "Monday",
  },
];

export default function RecentWorkouts() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-white">
          Recent workouts
        </h3>

        <button className="text-xs text-lime-400 hover:text-lime-300">
          View all
        </button>
      </div>

      <div className="space-y-5">
        {workouts.map((workout) => (
          <div
            key={workout.name}
            className="flex items-center gap-4"
          >
            <div className="rounded-xl bg-zinc-800 p-3">
              <Dumbbell className="text-lime-400" size={20} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {workout.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {workout.exercises} exercises · {workout.duration}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-zinc-400">
                {workout.date}
              </p>
              <Clock size={14} className="ml-auto mt-2 text-zinc-600" />
            </div>

            <ChevronRight size={16} className="text-zinc-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
