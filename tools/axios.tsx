/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default axios?.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const apiActions = axios?.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const apiMultipartActions = axios?.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Automatic token attachment interceptor for client-side API requests
if (typeof window !== "undefined") {
  apiActions.interceptors.request.use(async (config) => {
    if (!config.headers.Authorization || config.headers.Authorization === "") {
      try {
        const session = await getSession();
        const token =
          (session as any)?.accessToken ||
          (session?.user as any)?.accessToken ||
          "";
        if (token && typeof token === "string" && token.trim().length > 0) {
          config.headers.Authorization = `Bearer ${token.trim()}`;
        } else {
          delete config.headers.Authorization;
        }
      } catch {
        // Continue without header
      }
    }
    return config;
  });

  apiMultipartActions.interceptors.request.use(async (config) => {
    if (!config.headers.Authorization || config.headers.Authorization === "") {
      try {
        const session = await getSession();
        const token =
          (session as any)?.accessToken ||
          (session?.user as any)?.accessToken ||
          "";
        if (token && typeof token === "string" && token.trim().length > 0) {
          config.headers.Authorization = `Bearer ${token.trim()}`;
        } else {
          delete config.headers.Authorization;
        }
      } catch {
        // Continue without header
      }
    }
    return config;
  });
}
