import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

export interface UserRoleProfile {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  initials?: string;
  email?: string;
  phone?: string;
  country?: string;
  role?: "admin" | "business" | "staff" | "client" | string;
  account_type?: string;
  is_admin?: boolean;
  is_business?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  is_approved?: boolean;
  reference?: string;
  code?: string;
  member_code?: string;
  accessToken?: string;
  refreshToken?: string;
  redirectUrl?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      first_name?: string;
      last_name?: string;
      full_name?: string;
      initials?: string;
      phone?: string;
      country?: string;
      role?: string;
      account_type?: string;
      is_admin?: boolean;
      is_business?: boolean;
      is_staff?: boolean;
      is_active?: boolean;
      is_approved?: boolean;
      reference?: string;
      code?: string;
      member_code?: string;
      accessToken?: string;
      refreshToken?: string;
      redirectUrl?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }

  interface User extends DefaultUser, UserRoleProfile {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT, UserRoleProfile {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
