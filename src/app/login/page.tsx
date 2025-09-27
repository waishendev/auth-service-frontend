"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type FormState = {
  login: string;
  password: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({ login: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
    } catch (err) {
      setError("Oops! Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="hero">
        <div className="brand">
          <div className="logo">MS</div>
          <div>
            <h1>Microservices Auth</h1>
            <p>Unified access for every project.</p>
          </div>
        </div>
        <p className="intro">
          Welcome back! Sign in once and explore all of your dashboards with a
          seamless, modern experience crafted for teams.
        </p>
        <ul className="benefits" aria-label="Highlights">
          <li>
            <span>⚡</span>
            <div>
              <strong>Single Sign-On</strong>
              <p>Jump into any project without juggling credentials.</p>
            </div>
          </li>
          <li>
            <span>🛡️</span>
            <div>
              <strong>Enterprise Security</strong>
              <p>Protected by multi-layered security and smart alerts.</p>
            </div>
          </li>
          <li>
            <span>🤝</span>
            <div>
              <strong>Team Ready</strong>
              <p>Inviting teammates is as easy as sharing a link.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Login form">
        <h2>Sign in to your dashboard</h2>
        <p className="subtitle">
          Use your email, phone number, or employee ID to continue.
        </p>
        <form onSubmit={onSubmit} className="form" autoComplete="on">
          <label className="field">
            <span>Login</span>
            <input
              name="login"
              placeholder="you@example.com"
              value={form.login}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, login: event.target.value }))
              }
              required
              autoComplete="username"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
              autoComplete="current-password"
            />
            <Link href="/forgot-password" className="link">
              Forgot password?
            </Link>
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing you in..." : "Continue"}
          </button>
        </form>
        <p className="footer">
          Need an account? <Link href="/register">Request access</Link>
        </p>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: grid;
          gap: 4rem;
          padding: 4vw 8vw;
          background: radial-gradient(circle at top left, #9f7aea 0%, #4c1d95 45%, #111827 100%);
          color: #f9fafb;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          align-items: center;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }

        .hero {
          max-width: 540px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .logo {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 1.2rem;
          display: grid;
          place-items: center;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(249, 250, 251, 0.08), rgba(249, 250, 251, 0.24));
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 40px rgba(17, 24, 39, 0.35);
        }

        .brand h1 {
          font-size: clamp(2rem, 2.6vw, 2.8rem);
          margin: 0;
        }

        .brand p {
          margin: 0;
          color: rgba(249, 250, 251, 0.75);
        }

        .intro {
          margin: 0 0 2rem;
          line-height: 1.6;
          color: rgba(249, 250, 251, 0.8);
        }

        .benefits {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1rem;
        }

        .benefits li {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 1.2rem;
          background: rgba(17, 24, 39, 0.55);
          border: 1px solid rgba(249, 250, 251, 0.12);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
        }

        .benefits li span {
          font-size: 1.8rem;
        }

        .benefits strong {
          display: block;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .benefits p {
          margin: 0;
          color: rgba(249, 250, 251, 0.7);
          line-height: 1.4;
        }

        .card {
          position: relative;
          background: rgba(17, 24, 39, 0.85);
          border-radius: 1.75rem;
          padding: clamp(2.5rem, 3vw, 3.5rem);
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(249, 250, 251, 0.14);
          backdrop-filter: blur(16px);
        }

        .card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(147, 197, 253, 0.4), rgba(196, 181, 253, 0.4));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .card h2 {
          margin: 0;
          font-size: clamp(1.8rem, 2vw, 2.2rem);
        }

        .subtitle {
          margin: 0.75rem 0 2.5rem;
          color: rgba(249, 250, 251, 0.75);
        }

        .form {
          display: grid;
          gap: 1.5rem;
        }

        .field {
          display: grid;
          gap: 0.6rem;
        }

        .field span {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .field input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(249, 250, 251, 0.22);
          background: rgba(17, 24, 39, 0.65);
          color: #f9fafb;
          padding: 0.9rem 1rem;
          font-size: 1rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .field input:focus {
          outline: none;
          border-color: rgba(147, 197, 253, 0.9);
          box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.25);
        }

        .link {
          justify-self: end;
          font-size: 0.9rem;
          color: rgba(196, 181, 253, 0.85);
          transition: color 0.2s ease;
        }

        .link:hover {
          color: #f9fafb;
        }

        .error {
          margin: 0;
          padding: 0.75rem 1rem;
          border-radius: 0.9rem;
          background: rgba(239, 68, 68, 0.12);
          color: #fecaca;
          border: 1px solid rgba(239, 68, 68, 0.4);
          font-size: 0.95rem;
        }

        button {
          padding: 0.95rem 1.2rem;
          border-radius: 0.9rem;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%);
          color: #f9fafb;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 40px rgba(99, 102, 241, 0.35);
        }

        button:disabled {
          filter: saturate(0.5);
          cursor: not-allowed;
          box-shadow: none;
        }

        .footer {
          margin-top: 2rem;
          color: rgba(249, 250, 251, 0.75);
          text-align: center;
        }

        .footer :global(a) {
          color: rgba(96, 165, 250, 0.9);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page {
            padding: 3rem 1.75rem 4rem;
          }

          .card {
            order: -1;
          }
        }
      `}</style>
    </main>
  );
}