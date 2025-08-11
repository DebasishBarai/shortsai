import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { addDays, isAfter } from 'date-fns';
import { NextRequest } from 'next/server';

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      createdAt: string | Date;
    }
  }
}

// middleware is applied to all routes, use conditionals to select

const publicRoutes = [
  "/",
  "/pricing",
  "/login",
  "/privacy",
  "/terms",
  "/contact",
];

export default withAuth(function middleware(req, token) { }, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (!publicRoutes.includes(req.nextUrl.pathname) && token === null) {
        return false;
      }
      return true;
    },
  },
});

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * 1. /api routes
     * 2. /_next routes
     * 3. /_static routes
     * 4. /_vercel routes
     * 5. All static files (files with an extension)
     * 6. Public routes
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ]
};
