"use client";
import { useEffect, useMemo, useState } from "react";

type ServiceOption = {
  id: string;
  name: string;
  description: string;
  defaultLogin: string;
  defaultPassword: string;
};

const services: ServiceOption[] = [
  {
    id: "core",
    name: "Core Dashboard",
    description: "Manage users, roles, and service level settings across the platform.",
    defaultLogin: "admin@example.com",
    defaultPassword: "Admin@123",
  },
  {
    id: "analytics",
    name: "Analytics Suite",
    description: "Review cross-service metrics, health, and performance dashboards.",
    defaultLogin: "analytics@example.com",
    defaultPassword: "AnalytiC@123",
  },
  {
    id: "support",
    name: "Support Console",
    description: "Coordinate support tickets and customer success workflows.",
    defaultLogin: "support@example.com",
    defaultPassword: "Supp0rt!",
  },
];

export default function Login() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id ?? "core");
  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0],
    [selectedServiceId]
  );
  const [login, setLogin] = useState(selectedService.defaultLogin);
  const [password, setPassword] = useState(selectedService.defaultPassword);
  const [err, setErr] = useState<string | undefined>();

  useEffect(() => {
    setLogin(selectedService.defaultLogin);
    setPassword(selectedService.defaultPassword);
  }, [selectedService]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(undefined);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password, service: selectedService?.id }),
    });
    if (r.ok) {
      location.href = "/me";
    } else {
      const j = await r.json().catch(() => ({}));
      setErr(j?.error || "Login failed");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #f3f4f6, #ffffff)",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "32px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 520,
          background: "white",
          borderRadius: 16,
          boxShadow: "0 24px 40px -24px rgba(15, 23, 42, 0.35)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          padding: "40px 48px",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <p style={{ textTransform: "uppercase", letterSpacing: 1.8, fontSize: 12, color: "#475569", fontWeight: 600 }}>
            Multi-service Access
          </p>
          <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "12px 0", color: "#0f172a" }}>Sign in to your workspace</h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Choose the service you need and we&rsquo;ll pre-fill the recommended credentials. You can adjust them before signing in.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
          {services.map((service) => {
            const isActive = service.id === selectedService?.id;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedServiceId(service.id)}
                style={{
                  flexGrow: 1,
                  minWidth: 140,
                  borderRadius: 999,
                  padding: "10px 18px",
                  border: isActive ? "1px solid #1d4ed8" : "1px solid rgba(148, 163, 184, 0.4)",
                  background: isActive ? "rgba(37, 99, 235, 0.1)" : "#f8fafc",
                  color: isActive ? "#1d4ed8" : "#334155",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {service.name}
              </button>
            );
          })}
        </div>

        {selectedService && (
          <div style={{
            background: "#f8fafc",
            borderRadius: 12,
            padding: "16px 18px",
            marginBottom: 28,
            border: "1px solid rgba(148, 163, 184, 0.35)",
          }}>
            <h2 style={{ margin: 0, fontSize: 16, color: "#1e293b" }}>{selectedService.name}</h2>
            <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>{selectedService.description}</p>
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, color: "#1f2937", fontWeight: 600 }}>
            Email / Phone
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Enter your login identifier"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid rgba(148, 163, 184, 0.6)",
                fontSize: 15,
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, color: "#1f2937", fontWeight: 600 }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid rgba(148, 163, 184, 0.6)",
                fontSize: 15,
                letterSpacing: 0.4,
              }}
            />
          </label>

          {err && (
            <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }} role="alert">
              {err}
            </p>
          )}

          <button
            type="submit"
            style={{
              marginTop: 8,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "white",
              fontWeight: 600,
              padding: "12px 20px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              boxShadow: "0 12px 24px -12px rgba(37, 99, 235, 0.55)",
            }}
          >
            Continue to dashboard
          </button>
        </form>

        <p style={{ marginTop: 32, fontSize: 13, color: "#94a3b8", textAlign: "center" }}>
          Need access to another service? Contact the platform team to enable it on your account.
        </p>
      </section>
    </main>
  );
}
