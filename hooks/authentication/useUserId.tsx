"use client";

import { useSession } from "next-auth/react";

/**
 * Hook to retrieve the current authenticated user's ID
 */
export function useUserId(): string | null {
  const { data: session, status } = useSession();
  if (status !== "authenticated" || !session?.user?.id) {
    return null;
  }
  return String(session.user.id);
}

export default useUserId;
