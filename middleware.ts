import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedPaths = ["/me"];
  if (protectedPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    const token = req.cookies.get(process.env.JWT_COOKIE_NAME || "access_token");
    if (!token) {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
