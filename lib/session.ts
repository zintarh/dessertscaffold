import { getServerSession, type Session } from "next-auth";
import { authOptions } from "./auth";
import { cookies, headers } from "next/headers";

export async function getServerAuthSession(): Promise<Session | null> {
  // getServerSession automatically uses the request context (cookies/headers)
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerAuthSession();
  if (!session) return null;
  return session;
}
