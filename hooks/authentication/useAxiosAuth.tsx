/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession, getSession } from "next-auth/react";

export interface AxiosAuthHeaders {
  headers: {
    Authorization?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Hook to provide Bearer Authorization headers for authenticated Axios requests.
 */
export function useAxiosAuth(customHeaders?: Record<string, string>): AxiosAuthHeaders {
  const { data: session } = useSession();

  const token =
    (session as any)?.accessToken ||
    (session?.user as any)?.accessToken ||
    "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token && typeof token === "string" && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return { headers };
}

/**
 * Async helper to retrieve the freshest session token dynamically at request execution time.
 */
export async function getFreshAuthHeaders(customHeaders?: Record<string, string>): Promise<AxiosAuthHeaders> {
  let token = "";
  try {
    const session = await getSession();
    token =
      (session as any)?.accessToken ||
      (session?.user as any)?.accessToken ||
      "";
  } catch {
    // If session fetch fails, proceed with default headers
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token && typeof token === "string" && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return { headers };
}

export default useAxiosAuth;
