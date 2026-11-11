
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { auth } from "@/lib/auth";

export const instant = false;

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

      <div className="min-h-screen transition-all duration-300 md:pl-64">
        <Header />

        <main className="p-4 pt-20 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
