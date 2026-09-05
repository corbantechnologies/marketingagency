/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

// ============================================================================
// TypeScript Interfaces (Directly matching Django backend serializers & models)
// ============================================================================

/**
 * User profile object matching backend UserProfileSerializer
 */
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  initials: string;
  email: string;
  phone: string;
  country: string | null;
  role: "admin" | "business" | "staff" | "client" | string;
  account_type: string;
  is_admin: boolean;
  is_business: boolean;
  is_staff: boolean;
  is_active: boolean;
  is_approved: boolean;
  reference: string;
  code: string;
  member_code: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Successful authentication response returned by TokenView & Register Views
 */
export interface AuthResponse {
  message: string;
  access: string;
  refresh: string;
  token_type: string;
  redirect_url: string;
  user: User;
}

/**
 * Payload for registering a business user (BusinessUserSerializer)
 * Backend fields: first_name, last_name, email, password, phone, country (optional)
 */
export interface createBusinessUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  country?: string;
  password_confirmation?: string; // Optional client-side verification
}

/**
 * Payload for registering an admin user (AdminUserSerializer)
 * Backend fields: first_name, last_name, email, password, phone, country (optional)
 */
export interface createAdminUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  country?: string;
  password_confirmation?: string; // Optional client-side verification
}

/**
 * Payload for user login (UserLoginSerializer)
 * Accepts registered email or agency member code (e.g. MA26...) in member_no
 */
export interface userLogin {
  member_no: string;
  password: string;
}

/**
 * Payload to request password reset OTP (ForgotPasswordSerializer)
 * Backend field: email
 */
export interface forgotPassword {
  email: string;
}

/**
 * Payload to confirm password reset (ResetPasswordConfirmSerializer)
 * Backend fields: email, code, new_password, confirm_password
 */
export interface resetPassword {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Payload to change password for authenticated user (ChangePasswordSerializer)
 * Backend fields: old_password, new_password, confirm_password
 */
export interface changePassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Payload for updating user profile (UserProfileSerializer writable fields)
 */
export interface updateProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string | null;
  is_active?: boolean;
  is_approved?: boolean;
}

/**
 * Query parameters for listing users (UserListView filter & search fields)
 */
export interface UserFilterParams {
  is_admin?: boolean;
  is_business?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  is_approved?: boolean;
  country?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

/**
 * Generic message response from backend views
 */
export interface MessageResponse {
  message?: string;
  detail?: string;
  [key: string]: any;
}

export type AxiosConfig = {
  headers?: {
    Authorization?: string;
    [key: string]: any;
  };
  params?: any;
  [key: string]: any;
};

// ============================================================================
// Profile & Account Management Services
// ============================================================================

/**
 * Fetch a specific account by user reference code (UserDetailView)
 * Endpoint: GET /api/v1/auth/users/<reference>/
 */
export const getAccount = async (
  reference: string,
  config?: AxiosConfig
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.get(
    `/api/v1/auth/users/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Fetch the currently authenticated user's profile (CurrentUserProfileView)
 * Endpoint: GET /api/v1/auth/me/
 */
export const getCurrentUser = async (config?: AxiosConfig): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.get(
    "/api/v1/auth/me/",
    config
  );
  return response.data;
};

/**
 * Update the currently authenticated user's profile (CurrentUserProfileView)
 * Endpoint: PATCH /api/v1/auth/me/
 */
export const updateCurrentUser = async (
  data: updateProfile,
  config?: AxiosConfig
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.patch(
    "/api/v1/auth/me/",
    data,
    config
  );
  return response.data;
};

// ============================================================================
// Authentication & Registration Services
// ============================================================================

/**
 * Register a new business user account (BusinessUserCreateView)
 * Endpoint: POST /api/v1/auth/register/business/
 */
export const createBusiness = async (
  data: createBusinessUser
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await apiActions.post(
    "/api/v1/auth/register/business/",
    {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      ...(data.country ? { country: data.country } : {}),
    }
  );
  return response.data;
};

/**
 * Register a new agency admin / staff user (AdminUserCreateView)
 * Endpoint: POST /api/v1/auth/register/admin/
 */
export const createAdmin = async (
  data: createAdminUser,
  config?: AxiosConfig
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await apiActions.post(
    "/api/v1/auth/register/admin/",
    {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      ...(data.country ? { country: data.country } : {}),
    },
    config
  );
  return response.data;
};

/**
 * Authenticate user with member_no (email or agency code) and password (TokenView)
 * Endpoint: POST /api/v1/auth/login/
 */
export const login = async (data: userLogin): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await apiActions.post(
    "/api/v1/auth/login/",
    data
  );
  return response.data;
};

/**
 * Log out user by blacklisting the JWT refresh token (LogoutView)
 * Endpoint: POST /api/v1/auth/logout/
 */
export const logout = async (
  refresh: string,
  config?: AxiosConfig
): Promise<MessageResponse> => {
  const response: AxiosResponse<MessageResponse> = await apiActions.post(
    "/api/v1/auth/logout/",
    { refresh },
    config
  );
  return response.data;
};

/**
 * Refresh JWT access token (TokenRefreshView)
 * Endpoint: POST /api/v1/auth/token/refresh/
 */
export const refreshToken = async (
  refresh: string
): Promise<{ access: string; refresh?: string }> => {
  const response = await apiActions.post("/api/v1/auth/token/refresh/", {
    refresh,
  });
  return response.data;
};

// ============================================================================
// Password Management Services
// ============================================================================

/**
 * Request a 6-digit password reset OTP email (ForgotPasswordView)
 * Endpoint: POST /api/v1/auth/password/forgot/
 */
export const requestForgotPassword = async (
  data: forgotPassword
): Promise<MessageResponse> => {
  const response: AxiosResponse<MessageResponse> = await apiActions.post(
    "/api/v1/auth/password/forgot/",
    data
  );
  return response.data;
};

/**
 * Verify OTP code and set new password (ResetPasswordConfirmView)
 * Endpoint: POST /api/v1/auth/password/reset/confirm/
 */
export const confirmResetPassword = async (
  data: resetPassword
): Promise<MessageResponse> => {
  const response: AxiosResponse<MessageResponse> = await apiActions.post(
    "/api/v1/auth/password/reset/confirm/",
    data
  );
  return response.data;
};

/**
 * Change password for authenticated user (ChangePasswordView)
 * Endpoint: POST /api/v1/auth/password/change/
 */
export const changeUserPassword = async (
  data: changePassword,
  config?: AxiosConfig
): Promise<MessageResponse> => {
  const response: AxiosResponse<MessageResponse> = await apiActions.post(
    "/api/v1/auth/password/change/",
    data,
    config
  );
  return response.data;
};

// ============================================================================
// Directory & Administration Services
// ============================================================================

/**
 * List agency users with optional filtering & search (UserListView)
 * Endpoint: GET /api/v1/auth/users/
 */
export const getUsers = async (
  params?: UserFilterParams,
  config?: AxiosConfig
): Promise<User[] | { count: number; next: string | null; previous: string | null; results: User[] }> => {
  const response = await apiActions.get("/api/v1/auth/users/", {
    ...config,
    params,
  });
  return response.data;
};

/**
 * Update user details by reference (UserDetailView)
 * Endpoint: PATCH /api/v1/auth/users/<reference>/
 */
export const updateUser = async (
  reference: string,
  data: updateProfile,
  config?: AxiosConfig
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.patch(
    `/api/v1/auth/users/${reference}/`,
    data,
    config
  );
  return response.data;
};

/**
 * Deactivate / Soft-delete user account (sets is_active=false)
 * Preserves historical records, billing history, and prevents portal access.
 * Endpoint: PATCH /api/v1/auth/users/<reference>/
 */
export const deactivateAccount = async (
  reference: string,
  config?: AxiosConfig
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.patch(
    `/api/v1/auth/users/${reference}/`,
    { is_active: false },
    config
  );
  return response.data;
};

/**
 * Soft-deletes user account by deactivating it (alias for deactivateAccount)
 * Endpoint: PATCH /api/v1/auth/users/<reference>/
 */
export const deleteAccount = deactivateAccount;

/**
 * Reactivate a previously deactivated user account (sets is_active=true)
 * Endpoint: PATCH /api/v1/auth/users/<reference>/
 */
export const reactivateAccount = async (
  reference: string,
  config?: AxiosConfig
): Promise<User> => {
  const response: AxiosResponse<User> = await apiActions.patch(
    `/api/v1/auth/users/${reference}/`,
    { is_active: true },
    config
  );
  return response.data;
};

// ============================================================================
// Module 4: Global Client Announcement & System Banner Engine
// ============================================================================

export type AnnouncementType = "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";

export interface AnnouncementPreset {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  link_url?: string;
  link_label?: string;
}

export interface SystemAnnouncementData {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  is_active: boolean;
  link_url?: string;
  link_label?: string;
  created_at: string | null;
  created_by?: string;
  presets?: AnnouncementPreset[];
}

export interface SaveAnnouncementPayload {
  title: string;
  message: string;
  type?: AnnouncementType;
  is_active?: boolean;
  link_url?: string;
  link_label?: string;
}

/**
 * Fetch announcement configuration and presets (Admin only)
 * Endpoint: GET /api/v1/auth/admin-announcement/
 */
export const getAdminAnnouncement = async (
  config?: AxiosConfig
): Promise<SystemAnnouncementData> => {
  const response: AxiosResponse<SystemAnnouncementData> = await apiActions.get(
    "/api/v1/auth/admin-announcement/",
    config
  );
  return response.data;
};

/**
 * Publish or update system announcement banner (Admin only)
 * Endpoint: POST /api/v1/auth/admin-announcement/
 */
export const saveAdminAnnouncement = async (
  payload: SaveAnnouncementPayload,
  config?: AxiosConfig
): Promise<{ success: boolean; message: string; announcement: SystemAnnouncementData }> => {
  const response = await apiActions.post(
    "/api/v1/auth/admin-announcement/",
    payload,
    config
  );
  return response.data;
};

/**
 * Deactivate / Clear active announcement banner (Admin only)
 * Endpoint: DELETE /api/v1/auth/admin-announcement/
 */
export const clearAdminAnnouncement = async (
  config?: AxiosConfig
): Promise<{ success: boolean; message: string }> => {
  const response = await apiActions.delete(
    "/api/v1/auth/admin-announcement/",
    config
  );
  return response.data;
};

/**
 * Fetch active public announcement for client dashboard display
 * Endpoint: GET /api/v1/auth/announcement/active/
 */
export const getActivePublicAnnouncement = async (
  config?: AxiosConfig
): Promise<{ announcement: SystemAnnouncementData | null }> => {
  const response = await apiActions.get(
    "/api/v1/auth/announcement/active/",
    config
  );
  return response.data;
};
