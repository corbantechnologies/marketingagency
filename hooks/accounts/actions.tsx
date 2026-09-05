"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  changeUserPassword,
  confirmResetPassword,
  createAdmin,
  createAdminUser,
  createBusiness,
  createBusinessUser,
  deactivateAccount,
  forgotPassword,
  getAccount,
  getCurrentUser,
  getUsers,
  reactivateAccount,
  requestForgotPassword,
  resetPassword,
  updateCurrentUser,
  updateProfile,
  updateUser,
  UserFilterParams,
  getAdminAnnouncement,
  saveAdminAnnouncement,
  clearAdminAnnouncement,
  getActivePublicAnnouncement,
  SaveAnnouncementPayload,
} from "@/services/accounts";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserMemberCode from "../authentication/useUserMemberCode";

/**
 * Query hook to fetch account details by member_code / reference
 */
export function useFetchAccount(referenceCode?: string | null) {
  const defaultMemberCode = useUserMemberCode();
  const targetCode = referenceCode !== undefined ? referenceCode : defaultMemberCode;
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["account", targetCode],
    queryFn: () => getAccount(targetCode!, authConfig),
    enabled: Boolean(targetCode),
  });
}

/**
 * Query hook to fetch the currently authenticated user's profile (/me/)
 */
export function useFetchCurrentUser() {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
  });
}

/**
 * Query hook to list agency users with filtering
 */
export function useFetchUsersList(params?: UserFilterParams) {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["usersList", params],
    queryFn: () => getUsers(params, authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
  });
}

/**
 * Mutation hook for business account registration
 */
export function useCreateBusinessUser() {
  return useMutation({
    mutationFn: (data: createBusinessUser) => createBusiness(data),
  });
}

/**
 * Mutation hook for admin / staff account registration
 */
export function useCreateAdminUser() {
  const authConfig = useAxiosAuth();
  return useMutation({
    mutationFn: (data: createAdminUser) => createAdmin(data, authConfig),
  });
}

/**
 * Mutation hook for updating currently logged-in user profile
 */
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (data: updateProfile) => updateCurrentUser(data, authConfig),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      if (updatedUser.reference || updatedUser.code || updatedUser.member_code) {
        queryClient.invalidateQueries({
          queryKey: ["account", updatedUser.reference || updatedUser.code],
        });
      }
    },
  });
}

/**
 * Mutation hook for updating a specific user by reference
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: ({ reference, data }: { reference: string; data: updateProfile }) =>
      updateUser(reference, data, authConfig),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["account", variables.reference] });
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
  });
}

/**
 * Mutation hook for requesting password reset OTP
 */
export function useRequestForgotPassword() {
  return useMutation({
    mutationFn: (data: forgotPassword) => requestForgotPassword(data),
  });
}

/**
 * Mutation hook for confirming password reset
 */
export function useConfirmResetPassword() {
  return useMutation({
    mutationFn: (data: resetPassword) => confirmResetPassword(data),
  });
}

/**
 * Mutation hook for changing password of authenticated user
 */
export function useChangePassword() {
  const authConfig = useAxiosAuth();
  return useMutation({
    mutationFn: (data: changePassword) => changeUserPassword(data, authConfig),
  });
}

/**
 * Mutation hook for deactivating / soft-deleting an account
 */
export function useDeactivateAccount() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (reference: string) => deactivateAccount(reference, authConfig),
    onSuccess: (_, reference) => {
      queryClient.invalidateQueries({ queryKey: ["account", reference] });
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
  });
}

/**
 * Mutation hook for reactivating an account
 */
export function useReactivateAccount() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (reference: string) => reactivateAccount(reference, authConfig),
    onSuccess: (_, reference) => {
      queryClient.invalidateQueries({ queryKey: ["account", reference] });
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
  });
}

/**
 * Hook to fetch current system announcement config and presets (Admin only)
 */
export function useFetchAdminAnnouncement() {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["admin", "announcement"],
    queryFn: () => getAdminAnnouncement(authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
    staleTime: 15_000,
  });
}

/**
 * Mutation hook to publish or update an announcement
 */
export function useSaveAdminAnnouncement() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (payload: SaveAnnouncementPayload) => saveAdminAnnouncement(payload, authConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcement"] });
      queryClient.invalidateQueries({ queryKey: ["public", "announcement"] });
    },
  });
}

/**
 * Mutation hook to deactivate / clear active announcement
 */
export function useClearAdminAnnouncement() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: () => clearAdminAnnouncement(authConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "announcement"] });
      queryClient.invalidateQueries({ queryKey: ["public", "announcement"] });
    },
  });
}

/**
 * Hook to fetch active public announcement for client banner display
 */
export function useFetchActivePublicAnnouncement() {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["public", "announcement"],
    queryFn: () => getActivePublicAnnouncement(authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
