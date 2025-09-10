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
        // Return true if the user is authenticated
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
    // Only match protected routes
    "/user/:path*",
    "/evaluation/:path*",
    "/result/:path*",
    "/research-evaluation/:path*",
    "/writing/:path*",
    "/writing-environment/:path*",

  ],
};
