export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // "/writing/:path*",
    // "/writing-environment/:path*",
    // Add more protected areas here in the future, e.g. "/dashboard/:path*"
    // You can also protect APIs like: "/api/protected/:path*"
  ],
};
