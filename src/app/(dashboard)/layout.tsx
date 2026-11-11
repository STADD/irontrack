
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

import { auth } from "@/lib/auth";

import Link from "next/link";
import {
  LayoutDashboard,
  Dumbbell,
  ChartNoAxesCombined,
} from "lucide-react";

export const instant = false

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Sidebar />

      <div className="pb-20 md:pb-0 md:pl-64">
        <Header />

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t border-zinc-800 bg-[#09090b] px-2 py-3 md:hidden">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-zinc-400">
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link href="/workouts" className="flex flex-col items-center gap-1 text-zinc-400">
          <Dumbbell size={20} />
          <span className="text-[10px]">Workouts</span>
        </Link>

        <Link href="/progress" className="flex flex-col items-center gap-1 text-zinc-400">
          <ChartNoAxesCombined size={20} />
          <span className="text-[10px]">Progress</span>
        </Link>
      </nav>
    </div>
  );
}
