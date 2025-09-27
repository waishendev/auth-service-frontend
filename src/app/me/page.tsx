import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { fetchMe } from "@/lib/auth";

type Profile = Record<string, unknown>;

type ProfileEntryProps = {
  entries: Array<[string, unknown]>;
};

type SessionCardProps = {
  hasProfile: boolean;
};

const GRADIENT_BORDER =
  "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-gradient-to-br before:from-sky-500/40 before:via-indigo-500/30 before:to-fuchsia-500/20 before:opacity-90 before:blur before:content-['']";

function formatKey(key: string) {
  return key
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function renderValue(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-slate-400">—</span>;
  }
  if (typeof value === "object") {
    return (
      <pre className="whitespace-pre-wrap break-words text-left text-sky-100/90">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}

function ProfileEntries({ entries }: ProfileEntryProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-slate-900/40 px-6 py-10 text-center text-sm text-slate-300">
        <p className="text-base font-medium text-white">No profile data yet</p>
        <p className="text-slate-400">
          When your account receives attributes from the auth service, they will appear here instantly.
        </p>
      </div>
    );
  }

  return (
    <dl className="divide-y divide-white/5">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid gap-3 py-5 sm:grid-cols-[minmax(8rem,16rem)_1fr] sm:items-start"
        >
          <dt className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{formatKey(key)}</dt>
          <dd className="text-base text-slate-100/90">{renderValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function SessionCard({ hasProfile }: SessionCardProps) {
  return (
    <aside
      className={`relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60 p-8 text-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.45)] ${GRADIENT_BORDER}`}
    >
      <div className="relative space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
          Session
        </span>
        <h2 className="text-2xl font-semibold text-white">Secure &amp; synced</h2>
        <p className="text-sm leading-6 text-slate-300">
          You are currently viewing live data fetched from the authentication service. {hasProfile ? "Your profile is synced and ready for use across the dashboard." : "Once authenticated details are available, this panel will highlight key metadata about your session."}
        </p>
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Status</p>
            <p className="text-lg font-semibold text-sky-300">{hasProfile ? "Active" : "Awaiting data"}</p>
          </div>
          <div className="grid gap-1 text-sm text-slate-300">
            <p>JWT secured session</p>
            <p className="text-slate-400">Tokens are verified server-side before rendering this page.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default async function MePage() {
  const cookieStore = await cookies();
  const cookieStr = cookieStore.toString();
  let profile: Profile | null = null;
  let error: string | undefined;

  try {
    const result: unknown = await fetchMe(cookieStr);
    if (result && typeof result === "object") {
      profile = result as Profile;
    } else {
      profile = { value: result } as Profile;
    }
  } catch (cause) {
    error = cause instanceof Error && cause.message ? cause.message : "Unauthorized";
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
        <div className="relative max-w-md space-y-6 text-center">
          <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-fuchsia-600/30 via-sky-500/20 to-indigo-500/30 blur-3xl`} />
          <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-950/80 px-10 py-12 shadow-[0_25px_70px_rgba(15,23,42,0.6)]">
            <h1 className="text-3xl font-semibold tracking-tight">Unauthorized</h1>
            <p className="text-slate-200/80">
              {error}. Please sign in again to continue exploring your dashboards.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition hover:shadow-[0_16px_40px_rgba(56,189,248,0.45)]"
            >
              Go to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const profileEntries = profile ? Object.entries(profile) : [];
  const hasProfile = profileEntries.length > 0;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Account</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-4xl font-semibold tracking-tight text-white">Profile overview</h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              Live fetch
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-400 sm:max-w-xl">
            Review the information returned from the authentication service. These values refresh every visit, ensuring that what you
            see mirrors what the backend trusts.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div
            className={`relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.55)] ${GRADIENT_BORDER}`}
          >
            <div className="relative space-y-6">
              <div className="flex flex-col gap-3 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Profile data</h2>
                  <p className="text-sm text-slate-300">Key attributes returned by the auth service.</p>
                </div>
              </div>
              <ProfileEntries entries={profileEntries} />
            </div>
          </div>

          <SessionCard hasProfile={hasProfile} />
        </section>
      </div>
    </main>
  );
}
