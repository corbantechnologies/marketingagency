import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Route protection for the private portals.
 * - /admin/*    requires an agency administrator / staff session
 * - /business/* requires any signed-in session
 * The API enforces the same rules; this keeps private pages from rendering at all
 * for visitors without the right session.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  if (!token || token.error === "RefreshAccessTokenError") {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const isAdmin = Boolean(token.is_admin || token.is_staff || token.role === "admin");
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/business/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/business/:path*"],
};
