import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Korumalı yollar
  const protectedPaths = [
    "/dashboard",
    "/candidates",
    "/applications",
    "/interviews",
    "/reports",
    "/settings",
  ];

  const { pathname } = req.nextUrl;

  // Eğer korumalı bir sayfa isteniyorsa ve token yoksa giriş sayfasına yönlendir
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Middleware sadece belirli rotalarda çalışsın
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/candidates/:path*",
    "/applications/:path*",
    "/interviews/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
