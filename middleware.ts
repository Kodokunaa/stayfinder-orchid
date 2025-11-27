import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;
  
  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify session token
  try {
    const verifyResponse = await fetch(new URL('/api/auth/verify-session', request.url), {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
      },
    });

    if (!verifyResponse.ok) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session is valid, allow access
    return NextResponse.next();
  } catch (error) {
    // Error verifying session, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/my-bookings", "/admin", "/profile"],
};