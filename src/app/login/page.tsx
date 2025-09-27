"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ErrorResponse = {
  error?: string;
};

export default function LoginPage() {
  const [login, setLogin] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const benefits = [
    {
      icon: "⚡",
      title: "Single Sign-On",
      body: "Jump into any project without juggling credentials.",
    },
    {
      icon: "🛡️",
      title: "Enterprise Security",
      body: "Protected by multi-layered security and smart alerts.",
    },
    {
      icon: "🤝",
      title: "Team Ready",
      body: "Inviting teammates is as easy as sharing a link.",
    },
  ] as const;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErr(undefined);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        window.location.href = "/me";
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as ErrorResponse;
      setErr(payload.error || "Login failed");
    } catch {
      setErr("Unable to reach the authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-600 via-indigo-900 to-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl font-semibold text-white shadow-[0_10px_35px_rgba(16,24,40,0.35)] backdrop-blur">
              MS
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Microservices Auth
              </h1>
              <p className="text-base text-slate-200/80">
                Unified access for every project.
              </p>
            </div>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-slate-100/80">
            Welcome back! Sign in once and explore all of your dashboards with a
            seamless, modern experience crafted for teams.
          </p>

          <ul className="grid gap-4 sm:grid-cols-2" aria-label="Highlights">
            {benefits.map((benefit) => (
              <li
                key={benefit.title}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.35)] backdrop-blur"
              >
                <span className="text-2xl" aria-hidden="true">
                  {benefit.icon}
                </span>
                <div className="space-y-1">
                  <strong className="block text-base font-semibold">
                    {benefit.title}
                  </strong>
                  <p className="text-sm text-slate-100/70">{benefit.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 px-8 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          <div className="relative space-y-8">
            <header className="space-y-2 text-center lg:text-left">
              <h2 className="text-2xl font-semibold tracking-tight">Sign in to your dashboard</h2>
              <p className="text-sm text-slate-200/70">
                Use your email, phone number, or employee ID to continue.
              </p>
            </header>

            <form onSubmit={onSubmit} className="space-y-6" autoComplete="on">
              <div className="space-y-2">
                <label htmlFor="login" className="text-sm font-medium text-slate-100/90">
                  Login
                </label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="you@example.com"
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  required
                  autoComplete="username"
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-base text-slate-50 shadow-inner transition focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-400/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="password" className="font-medium text-slate-100/90">
                    Password
                  </label>
                  <Link href="/forgot-password" className="font-medium text-indigo-300 transition hover:text-indigo-100">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-base text-slate-50 shadow-inner transition focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-400/30"
                />
              </div>

              {err ? (
                <p className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-200">
                  {err}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 px-4 py-3 text-base font-semibold text-white shadow-[0_15px_40px_rgba(56,189,248,0.35)] transition hover:shadow-[0_20px_50px_rgba(56,189,248,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing you in..." : "Continue"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-200/70 lg:text-left">
              Need an account? <Link href="/register" className="font-semibold text-sky-300 hover:text-sky-100">Request access</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
