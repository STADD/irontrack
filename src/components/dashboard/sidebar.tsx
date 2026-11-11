
"use client";

import { useEffect, useState } from "react";
import LogoutButton from "@/components/dashboard/logout-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightFromLine,
  Dumbbell,
  ChartNoAxesCombined,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Progress", href: "/progress", icon: ChartNoAxesCombined },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [username, setUsername] = useState("User");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");

    async function getUser() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUsername(data.name || "User");
      } catch {
        setUsername("User");
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleSidebar() {
    setCollapsed((previous) => {
      const next = !previous;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-20 z-50 rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-white md:hidden"
        aria-label="Open navigation"
      >
        <ArrowRightFromLine size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-[60] flex h-screen flex-col
          border-r border-zinc-800 bg-[#09090b]
          px-4 py-6 transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                <Dumbbell size={22} />
              </div>
              <h1 className="font-bold text-white">IRONTRACK</h1>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
              <Dumbbell size={22} />
            </div>
          )}

          <button
            onClick={() => setMobileOpen(false)}
            className="text-zinc-400 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-lime-400 text-black"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto">
          <div className="mb-5 flex items-center gap-3">
            {!collapsed && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white">
                  {username[0]?.toUpperCase()}
                </div>
                <span className="flex-1 text-sm text-white">
                  {username}
                </span>
              </>
            )}
            <LogoutButton />
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={toggleSidebar}
            className="hidden w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 py-3 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white md:flex"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
