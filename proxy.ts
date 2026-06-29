import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (path.startsWith('/employer') && role !== 'EMPLOYER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (path.startsWith('/dashboard') && role !== 'JOB_SEEKER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/admin') || path.startsWith('/employer') || path.startsWith('/dashboard')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/employer/:path*', '/dashboard/:path*'],
};
