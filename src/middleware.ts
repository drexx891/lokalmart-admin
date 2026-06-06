import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import type { AdminSessionData } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<AdminSessionData>(request, response, {
    password: process.env.SECRET_COOKIE_PASSWORD || "complex_password_at_least_32_characters_long_for_iron_session",
    cookieName: "belio_admin_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    },
  });

  const path = request.nextUrl.pathname;

  // Static files or api routes should not be protected by this UI middleware
  if (
    path.startsWith('/_next') || 
    path.startsWith('/api') || 
    path.includes('.')
  ) {
    return response;
  }

  // Protect Admin Routes
  if (path === '/login') {
    if (session.isLoggedIn && session.adminId) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // Require admin login for all other routes
  if (!session.isLoggedIn || !session.adminId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

