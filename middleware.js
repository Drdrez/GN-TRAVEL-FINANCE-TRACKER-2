// middleware.js

import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Login API)
     * - _next/static (Next.js internals)
     * - _next/image (Next.js internals)
     * - favicon.ico (browser icon)
     * - GN ICON.png (your logo)
     * - login.html (the login page itself)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|GN%20ICON.png|login.html).*)',
  ],
};

export default function middleware(request) {
  // 1. Check if the user has the 'auth_token' cookie
  const authCookie = request.cookies.get('auth_token');

  // 2. If cookie exists and is valid, let them pass
  if (authCookie && authCookie.value === 'valid-session') {
    return NextResponse.next();
  }

  // 3. If no cookie, redirect them to the login page
  const loginUrl = new URL('/login.html', request.url);
  return NextResponse.redirect(loginUrl);
}
