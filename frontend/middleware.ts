import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/chat', '/settings', '/admin'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('mahin_token')?.value;
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/settings/:path*', '/admin/:path*'],
};
