
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

const data = [
  { date: "Jan", weight: 35 },
  { date: "Feb", weight: 37.5 },
  { date: "Mar", weight: 40 },
  { date: "Apr", weight: 40 },
  { date: "May", weight: 45 },
  { date: "Jun", weight: 47.5 },
];

export default function ProgressChart() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">
            Strength progression
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Chest press · Working weight
          </p>
        </div>

        <span className="rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300">
          Last 6 months
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
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
              domain={["dataMin - 5", "dataMax + 5"]}
              tickFormatter={(value) => `${value} kg`}
            />

            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value) => [`${value} kg`, "Weight"]}
            />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#a3e635"
              strokeWidth={3}
              dot={{ fill: "#a3e635", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
