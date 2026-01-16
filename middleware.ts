// middleware.ts - Next.js App Router Middleware
// Bu dosya proje ROOT'unda olmalı (app/ klasörü dışında)

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const { pathname } = req.nextUrl;

  // Public paths - auth gerektirmeyen
  const publicPaths = [
    "/",
    "/verify-email",
    "/reset-password",
    "/application",
  ];

  // Public path kontrolü
  const isPublicPath = publicPaths.some((p) => 
    pathname === p || pathname.startsWith(`${p}/`)
  );

  // API ve static dosyalar için middleware'i atla
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files (.svg, .png, etc.)
  ) {
    return NextResponse.next();
  }

  // Public path ise token kontrolü yapma
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Korumalı path'ler için token kontrolü
  if (!accessToken && !refreshToken) {
    // Token yoksa login sayfasına yönlendir
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Middleware sadece belirli rotalarda çalışsın
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
