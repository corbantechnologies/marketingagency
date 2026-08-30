import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BACKEND_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

/**
 * Helper to refresh expired JWT access token using the backend refresh endpoint.
 */
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      return token;
    }

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    return {
      ...token,
      accessToken: refreshedTokens.access || token.accessToken,
      refreshToken: refreshedTokens.refresh || token.refreshToken,
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Agency Credentials",
      credentials: {
        email: {
          label: "Email or Member Code",
          type: "text",
          placeholder: "client@example.com or MA26001",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email/member code and password.");
        }

        const identifier = credentials.email.trim();
        const password = credentials.password;

        try {
          // Primary endpoint: /api/v1/auth/login/
          let response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              member_no: identifier,
              email: identifier,
              password,
            }),
          });

          // Backwards compatibility fallback if /login/ is not found
          if (response.status === 404) {
            response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/token/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                member_no: identifier,
                email: identifier,
                password,
              }),
            });
          }

          const data = await response.json().catch(() => ({}));

          if (!response.ok) {
            const errorMessage =
              data?.detail ||
              (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) ||
              (Array.isArray(data?.member_no) && data.member_no[0]) ||
              (Array.isArray(data?.password) && data.password[0]) ||
              data?.message ||
              "Invalid login credentials. Please verify and try again.";
            throw new Error(errorMessage);
          }

          const userData = data.user || data;
          const userReference = userData.reference || userData.code || String(userData.id || "");
          const fullName =
            userData.full_name ||
            `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
            userData.email ||
            identifier;

          return {
            id: String(userData.id || userReference || identifier),
            name: fullName,
            email: userData.email || identifier,
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            full_name: fullName,
            initials: userData.initials || "MA",
            phone: userData.phone || "",
            country: userData.country || "Kenya",
            role: userData.role || "client",
            account_type: userData.account_type || "Client",
            is_admin: Boolean(userData.is_admin),
            is_business: Boolean(userData.is_business),
            is_staff: Boolean(userData.is_staff),
            is_active: userData.is_active !== undefined ? Boolean(userData.is_active) : true,
            is_approved: userData.is_approved !== undefined ? Boolean(userData.is_approved) : true,
            reference: userData.reference || userReference,
            code: userData.code || "",
            member_code: userData.member_code || userData.code || "",
            accessToken: data.access || data.accessToken || data.token,
            refreshToken: data.refresh || data.refreshToken,
            redirectUrl:
              (data.redirect_url === "/dashboard"
                ? "/business/dashboard"
                : data.redirect_url) ||
              (userData.is_admin ? "/admin/dashboard" : "/business/dashboard"),
            last_login: userData.last_login,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
          };
        } catch (err: unknown) {
          const message =
            err instanceof Error
              ? err.message
              : "Authentication failed. Please try again.";
          throw new Error(message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in: store user fields into JWT token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.full_name = user.full_name;
        token.initials = user.initials;
        token.phone = user.phone;
        token.country = user.country;
        token.role = user.role;
        token.account_type = user.account_type;
        token.is_admin = user.is_admin;
        token.is_business = user.is_business;
        token.is_staff = user.is_staff;
        token.is_active = user.is_active;
        token.is_approved = user.is_approved;
        token.reference = user.reference;
        token.code = user.code;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.redirectUrl = user.redirectUrl;
        token.accessTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        return token;
      }

      // Handle client-side session update triggers (e.g. useSession().update())
      if (trigger === "update" && session) {
        return {
          ...token,
          ...session.user,
          ...session,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, silently refresh it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.email = token.email || session.user.email;
        session.user.name = token.full_name || token.name || session.user.name;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.full_name = token.full_name;
        session.user.initials = token.initials;
        session.user.phone = token.phone;
        session.user.country = token.country;
        session.user.role = token.role;
        session.user.account_type = token.account_type;
        session.user.is_admin = token.is_admin;
        session.user.is_business = token.is_business;
        session.user.is_staff = token.is_staff;
        session.user.is_active = token.is_active;
        session.user.is_approved = token.is_approved;
        session.user.reference = token.reference;
        session.user.code = token.code;
        session.user.member_code = token.member_code;
        session.user.redirectUrl = token.redirectUrl;
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },

  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "ljk-marketing-agency-secret-key-production-2026",

  debug: process.env.NODE_ENV === "development",
};

/**
 * Server-side helper to fetch authenticated session in Next.js Server Components,
 * Route Handlers, and Server Actions.
 */
export const getAuthSession = () => getServerSession(authOptions);
