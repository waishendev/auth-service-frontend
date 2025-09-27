import Link from "next/link";
import { cookies } from "next/headers";
import { fetchMe } from "@/lib/auth";

type Profile = Record<string, unknown>;

export default async function MePage() {
  const cookieStr = cookies().toString();
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
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Unauthorized</h1>
          <p className="text-slate-200/70">
            {error}. Please sign in again to continue exploring your dashboards.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition hover:shadow-[0_16px_40px_rgba(56,189,248,0.45)]"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Account</p>
          <h1 className="text-3xl font-semibold tracking-tight">Profile overview</h1>
        </div>
        <pre className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm leading-6 text-sky-100/90 shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
          {JSON.stringify(profile ?? {}, null, 2)}
        </pre>
      </div>
    </main>
  );
}
