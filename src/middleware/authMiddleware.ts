import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasAuthCookie(request: NextRequest) {
  const allCookies = request.cookies.getAll();

  return allCookies.some((cookie) => {
    if (cookie.name === "sb-access-token") return true;
    if (cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")) {
      return true;
    }

    return false;
  });
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthenticated = hasAuthCookie(request);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminAuthPage = pathname.startsWith("/admin/login");
  const isStudentAuthPage = pathname.startsWith("/student/login") || pathname.startsWith("/student/signup");

  const isStudentRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/achievements");

  if (isAdminRoute && !isAdminAuthPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isStudentRoute && !isStudentAuthPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/student/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*", "/achievements/:path*"],
};
