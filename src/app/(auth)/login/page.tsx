
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid credentials");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-10">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black">
            <Dumbbell size={28} />
          </div>

          <h1 className="text-2xl font-bold text-white">
            IRONTRACK
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-2xl border border-zinc-800 bg-[#111113] p-6 sm:p-8"
        >

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email address
            </label>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-400"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 font-semibold text-black hover:bg-lime-300 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Sign in
          </button>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-lime-400 hover:text-lime-300"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
