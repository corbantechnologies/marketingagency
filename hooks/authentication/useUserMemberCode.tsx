"use client";

import { useSession } from "next-auth/react";

/**
 * Hook to retrieve the current authenticated user's agency member code or reference
 */
export function useUserMemberCode(): string | null {
  const { data: session, status } = useSession();
  if (status !== "authenticated" || !session?.user) {
    return null;
  }
  return session.user.member_code || session.user.code || session.user.reference || null;
}

export default useUserMemberCode;
