
"use client";

import LogoutButton from "@/components/dashboard/logout-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Workouts",
    href: "/workouts",
    icon: Dumbbell,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: ChartNoAxesCombined,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-zinc-800 bg-[#09090b] px-5 py-6 md:flex">

      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
          <Dumbbell size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            IRONTRACK
          </h1>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                active
                  ? "bg-lime-400 text-black"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <Settings size={19} />
          Settings
        </Link>

        <div className="mt-5 border-t border-zinc-800 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
              JD
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                John Doe
              </p>
              <p className="text-xs text-zinc-500">
                Free account
              </p>
            </div>

            <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
