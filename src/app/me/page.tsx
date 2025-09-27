import { cookies } from "next/headers";
import { fetchMe } from "@/lib/auth";

export default async function MePage() {
  const cookieStr = cookies().toString();
  let me: any = null, error: string|undefined;

  try {
    me = await fetchMe(cookieStr);
  } catch (e: any) {
    error = e?.message || "Unauthorized";
  }

  if (error) {
    return (<main style={{padding:32}}><h1>Unauthorized</h1><a href="/login">Go Login</a></main>);
  }

  return (
    <main style={{padding:32}}>
      <h1>Me</h1>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </main>
  );
}
