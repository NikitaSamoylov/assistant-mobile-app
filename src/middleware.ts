import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/about')) {
    return NextResponse.next();
  };
  if (pathname.startsWith('/install')) {
    return NextResponse.next();
  };
  if (pathname.startsWith('/promo')) {
    return NextResponse.next();
  };
  if (pathname.startsWith('/promo-fear')) {
    return NextResponse.next();
  };

  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ['/']
  matcher: ['/', '/about/:path*', '/promo/:path*', '/install/:path*']
};
