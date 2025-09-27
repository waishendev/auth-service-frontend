export async function fetchMe(cookie?: string) {
  const token = cookie?.split(`${process.env.JWT_COOKIE_NAME}=`)[1]?.split(";")[0];
  if (!token) throw new Error("no token");
  const r = await fetch(`${process.env.AUTH_SERVICE_URL}/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!r.ok) throw new Error("unauthorized");
  return r.json();
}
