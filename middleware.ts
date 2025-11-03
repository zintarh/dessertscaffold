import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("🔐 Middleware: User authenticated, allowing access to:", req.nextUrl.pathname);
    return NextResponse.next();
  },

  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/communities/:path*",
    "/timelines/:path*",
    "/writing/:path*",
    "/settings/:path*",
    "/my-messages/:path*",
    "/mentor/:path*",
    "/mentor-invitations/:path*",
    "/new/:path*",
    "/evaluation/:path*",
    "/result/:path*",
    "/research-evaluation/:path*",
    "/writing-environment/:path*",

  ],
};
