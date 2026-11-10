"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProgressPoint {
  date: string;
  weight: number;
}

export default function ProgressChart({
  data,
  exerciseName,
}: {
  data: ProgressPoint[];
  exerciseName: string | null;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">
            Strength progression
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            {exerciseName
              ? `${exerciseName} · Best completed set`
              : "Complete workouts to see your progress"}
          </p>
        </div>

        <span className="shrink-0 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
          Workout history
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl bg-zinc-900/50 px-6 text-center text-sm text-zinc-500">
          Your strength chart will appear after you complete and record some sets.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>
              <CartesianGrid
                stroke="#27272a"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
                domain={[
                  "dataMin - 5",
                  "dataMax + 5",
                ]}
                tickFormatter={(value) =>
                  `${value} kg`
                }
              />

              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  `${value} kg`,
                  "Best set",
                ]}
              />

              <Line
                type="monotone"
                dataKey="weight"
                stroke="#a3e635"
                strokeWidth={3}
                dot={{
                  fill: "#a3e635",
                  strokeWidth: 0,
                  r: 4,
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}