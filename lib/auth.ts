import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as bcrypt from "bcryptjs";
import { prisma } from "./prisma";
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

          // Email verification check removed for now - will be added later
          // if (!user.isActive) {
          //   throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
          // }

          const fallbackName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
          const computedName = user.name ?? (fallbackName || user.email);
          const resultUser: NextAuthUser = {
            id: user.id,
            name: computedName,
            email: user.email,
            image: user.image ?? undefined,
            userType: (user as any).userType as string,
            institutionName: (user as any).institutionName as string,
            researchArea: (user as any).researchArea as string,
            academicLevel: (user as any).academicLevel as string,
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
        token.email = (user as any).email;
        token.userType = (user as any).userType;
        token.institutionName = (user as any).institutionName;
        token.researchArea = (user as any).researchArea;
        token.academicLevel = (user as any).academicLevel;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).userType = token.userType as string;
        (session.user as any).institutionName = token.institutionName as string;
        (session.user as any).researchArea = token.researchArea as string;
        (session.user as any).academicLevel = token.academicLevel as string;
        (session.user as any).email = token.email as string;
      }
      return session;
    },
  },
  cookies: {
    // Use secure cookies in production
  },
  debug: process.env.NODE_ENV === "development",
};
