
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Track your workouts and fitness progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
