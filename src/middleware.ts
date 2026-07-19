import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('loop_session');
  const { pathname } = request.nextUrl;

  // 1. Protect dashboard, settings, and analytical API routes
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isSettingsPath = pathname.startsWith('/settings');
  const isApiPath = pathname.startsWith('/api') && !pathname.startsWith('/api/auth');

  if ((isDashboardPath || isSettingsPath || isApiPath) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Redirect logged-in users away from login/register/root page
  const isAuthPath = pathname === '/login' || pathname === '/register' || pathname === '/';
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*', '/settings/:path*', '/api/((?!auth).*)'],
};
