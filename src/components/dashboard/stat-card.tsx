
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">{title}</p>

        <div className="rounded-xl bg-zinc-800 p-2">
          <Icon size={19} className="text-lime-400" />
        </div>
      </div>

      <h3 className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </h3>

      <p className="mt-2 text-xs text-zinc-500">
        {description}
      </p>
    </div>
  );
}
