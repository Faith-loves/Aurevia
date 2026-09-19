import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env["AUTH_SECRET"] ?? process.env["NEXTAUTH_SECRET"] });
  const { pathname } = request.nextUrl;

  if (!token) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname.startsWith("/account") && token.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*", "/admin/:path*"] };
