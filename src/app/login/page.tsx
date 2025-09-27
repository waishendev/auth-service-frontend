"use client";
import { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [err, setErr] = useState<string|undefined>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(undefined);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ login, password }),
    });
    if (r.ok) {
      location.href = "/me";
    } else {
      const j = await r.json().catch(()=>({}));
      setErr(j?.error || "Login failed");
    }
  };

  return (
    <main style={{maxWidth:420, margin:"64px auto", fontFamily:"sans-serif"}}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <label> Email / Phone
          <input value={login} onChange={e=>setLogin(e.target.value)} style={{width:"100%"}} />
        </label>
        <label> Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%"}} />
        </label>
        {err && <p style={{color:"red"}}>{err}</p>}
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
