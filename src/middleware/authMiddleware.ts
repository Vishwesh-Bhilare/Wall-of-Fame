import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Supabase auth in this app is managed client-side (localStorage).
  // Edge middleware cannot read that state, so route gating here causes
  // authenticated users to be redirected back to login in production.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*", "/achievements/:path*"],
};
