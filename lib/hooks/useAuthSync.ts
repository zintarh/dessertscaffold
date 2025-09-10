import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSetAtom } from "jotai";
import {
  updateCurrentUserAtom,
  clearCurrentUserAtom,
} from "../stores/authStore";

/**
 * Hook to automatically sync NextAuth.js session with user atom
 * This ensures the user atom always has the latest authenticated user data
 */
export function useAuthSync() {
  const { data: session, status } = useSession();
  const updateCurrentUser = useSetAtom(updateCurrentUserAtom);
  const clearCurrentUser = useSetAtom(clearCurrentUserAtom);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      clearCurrentUser();
      return;
    }

    if (status === "authenticated" && session?.user) {
      // Use session data directly to avoid database dependency issues
      updateCurrentUser(session.user);
      
      // Optionally try to fetch additional profile data, but don't let it block authentication
      fetchUserProfile(session.user.id as string)
        .then((userData) => {
          if (userData) {
            updateCurrentUser(userData);
          }
        })
        .catch((error) => {
          console.warn("Could not fetch additional user profile data:", error);
          // Don't update user state on error - keep using session data
        });
    }
  }, [session, status, updateCurrentUser, clearCurrentUser]);

  return { session, status };
}

/**
 * Fetch additional user profile data from the API
 * This gives us more complete user information than what's in the session
 */
async function fetchUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/user/profile`);

    if (response.ok) {
      const userData = await response.json();
      return userData.user || null;
    }

    return null;
  } catch (error) {
    console.error("🔍 Fetch error:", error);
    return null;
  }
}
