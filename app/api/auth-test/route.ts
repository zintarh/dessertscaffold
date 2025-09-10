import NextAuth from "next-auth";

// Simple NextAuth configuration
const simpleAuthOptions = {
  providers: [],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(simpleAuthOptions);

export { handler as GET, handler as POST };
