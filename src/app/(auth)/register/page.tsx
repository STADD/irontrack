
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Registration failed");
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
            Create your account
          </h1>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5 rounded-2xl border border-zinc-800 bg-[#111113] p-6 sm:p-8"
        >

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Full name
            </label>

            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-400"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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
            Create account
          </button>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-lime-400 hover:text-lime-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
