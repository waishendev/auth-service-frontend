import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const r = await fetch(`${process.env.AUTH_SERVICE_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) {
    return NextResponse.json(data, { status: r.status });
  }
  const res = NextResponse.json({ ok: true });
  // httpOnly cookie 存 access token（MVP；生产建议用 Session or split cookies）
  res.cookies.set(process.env.JWT_COOKIE_NAME!, data.access_token, {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
    maxAge: data.expires_in ?? 3600
  });
  return res;
}
