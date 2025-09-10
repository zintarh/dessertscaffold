import NextAuth from "next-auth";

// Minimal NextAuth configuration to test deployment
const minimalAuthOptions = {
  providers: [],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(minimalAuthOptions);

export { handler as GET, handler as POST };
