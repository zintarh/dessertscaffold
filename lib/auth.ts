import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: "/signin",
    error: "/signin", // redirect errors to sign-in page with ?error=
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
              isActive: true
            }
          });
          if (!user || !user.password) return null;

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;

          // Check if user account is active (email verified)
          if (!user.isActive) {
            throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
          }

          const fallbackName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
          const computedName = user.name ?? (fallbackName || user.email);
          const resultUser: NextAuthUser = {
            id: user.id,
            name: computedName,
            email: user.email,
            image: user.image ?? undefined,
          };
          return resultUser;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
      }
      // minimize session exposure
      if (session.user) {
        session.user = {
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
        } as any;
      }
      return session;
    },
  },
  cookies: {
    // Use secure cookies in production
  },
  debug: process.env.NODE_ENV === "development",
};
