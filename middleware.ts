import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedPaths = ["/me"];
  if (protectedPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    const cookieName =
      process.env.JWT_COOKIE_NAME ||
      process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ||
      "access_token";
    const token = req.cookies.get(cookieName)?.value;
    if (!token) {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
