import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/tasks", "/profile"];
const authRoutes = ["/login", "/signup"]; 

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/tasks", request.url));
    } catch (error) {
      console.error("Invalid token on auth route:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*", "/profile/:path*", "/login", "/signup"],
};
