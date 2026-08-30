"use client";

import { useSession } from "next-auth/react";

export interface AxiosAuthHeaders {
  headers: {
    Authorization: string;
    [key: string]: string;
  };
}

/**
 * Hook to provide Bearer Authorization headers for authenticated Axios requests.
 */
export function useAxiosAuth(customHeaders?: Record<string, string>): AxiosAuthHeaders {
  const { data: session } = useSession();

  const token = session?.accessToken || session?.user?.accessToken || "";

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      ...customHeaders,
    },
  };
}

export default useAxiosAuth;
