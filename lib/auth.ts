import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: "/signin",
    error: "/signin", 
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        try {
          const parsed = credentialsSchema.safeParse(rawCredentials);
          if (!parsed.success) return null;
          const { email, password } = parsed.data;

          const user = await prisma.user.findUnique({ 
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              firstName: true,
              lastName: true,
              image: true,
              isActive: true,
              userType: true,
              institutionName: true,
              researchArea: true,
              academicLevel: true
            }
          });
          if (!user || !user.password) return null;

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;

         

          const fallbackName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
          const computedName = user.name ?? (fallbackName || user.email);
          const resultUser: NextAuthUser = {
            id: user.id,
            name: computedName,
            email: user.email,
            userType: (user as any).userType as string,
          };
          return resultUser;
        } catch (err) {
          console.error("Authentication error:", err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          const errorName = err instanceof Error ? err.name : 'Unknown';
          const errorStack = err instanceof Error ? err.stack : 'No stack trace';
          
          console.error("Error details:", {
            message: errorMessage,
            stack: errorStack,
            name: errorName
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store only the absolute minimum required data
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.userType = (user as any).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Store only essential data - fetch other data from database when needed
        (session.user as any).id = token.id as string;
        (session.user as any).userType = token.userType as string;
        (session.user as any).email = token.email as string;
      }
      return session;
    },
  },
  // Use default NextAuth cookie configuration to avoid header size issues
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
