"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BusinessFilterParams,
  createBusiness,
  CreateBusinessPayload,
  deactivateBusiness,
  getBusinessByReference,
  getBusinesses,
  reactivateBusiness,
  updateBusiness,
  UpdateBusinessPayload,
  getAdminObservability,
  refreshCarrierBalances,
  getAlertRecipients,
  manageAlertRecipient,
  getAdminSenderIdQueue,
  reviewAdminSenderId,
  ReviewSenderIdPayload,
} from "@/services/business";
import useAxiosAuth from "../authentication/useAxiosAuth";

/**
 * Query hook to list businesses (Admins view all; owners view only their own)
 */
export function useFetchBusinesses(params?: BusinessFilterParams) {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["businesses", params],
    queryFn: () => getBusinesses(params, authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
  });
}

/**
 * Query hook to fetch a single business by its reference code
 */
export function useFetchBusiness(reference?: string | null) {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["business", reference],
    queryFn: () => getBusinessByReference(reference!, authConfig),
    enabled: Boolean(reference && authConfig.headers.Authorization),
  });
}

/**
 * Mutation hook to create a new business
 */
export function useCreateBusiness() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (data: CreateBusinessPayload) => createBusiness(data, authConfig),
    onSuccess: (newBusiness) => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      if (newBusiness.reference) {
        queryClient.setQueryData(["business", newBusiness.reference], newBusiness);
      }
    },
  });
}

/**
 * Mutation hook to update an existing business
 */
export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: ({
      reference,
      data,
    }: {
      reference: string;
      data: UpdateBusinessPayload;
    }) => updateBusiness(reference, data, authConfig),
    onSuccess: (updatedBusiness, variables) => {
      queryClient.setQueryData(["business", variables.reference], updatedBusiness);
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

/**
 * Mutation hook to deactivate (soft-delete) a business
 */
export function useDeactivateBusiness() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (reference: string) => deactivateBusiness(reference, authConfig),
    onSuccess: (deactivatedBusiness, reference) => {
      queryClient.setQueryData(["business", reference], deactivatedBusiness);
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

/**
 * Mutation hook to reactivate a business
 */
export function useReactivateBusiness() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (reference: string) => reactivateBusiness(reference, authConfig),
    onSuccess: (reactivatedBusiness, reference) => {
      queryClient.setQueryData(["business", reference], reactivatedBusiness);
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

/**
 * Query hook to fetch real-time platform observability vitals (Admin only)
 * Configured with 30-second refetch interval for live monitoring.
 */
export function useFetchAdminObservability() {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["admin", "observability"],
    queryFn: () => getAdminObservability(authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

/**
 * Mutation hook to manually poll upstream carrier balances from Africa's Talking and Advanta
 */
export function useRefreshCarrierBalances() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: () => refreshCarrierBalances(authConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "observability"] });
    },
  });
}

/**
 * Query hook to fetch all alert & reminder recipient emails
 */
export function useFetchAlertRecipients() {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["admin", "alert-recipients"],
    queryFn: () => getAlertRecipients(authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
  });
}

/**
 * Mutation hook to add, remove, or test alert recipient emails
 */
export function useManageAlertRecipients() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (payload: { action: "add" | "remove" | "test"; email?: string }) =>
      manageAlertRecipient(payload, authConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "alert-recipients"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "observability"] });
    },
  });
}

/**
 * Query hook to fetch Sender ID verification queue (Admin only)
 */
export function useFetchAdminSenderIdQueue(statusFilter?: string) {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["admin", "sender-ids", statusFilter],
    queryFn: () => getAdminSenderIdQueue(statusFilter, authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
    staleTime: 15_000,
  });
}

/**
 * Mutation hook to approve or reject a Sender ID
 */
export function useReviewAdminSenderId() {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();

  return useMutation({
    mutationFn: (payload: ReviewSenderIdPayload) => reviewAdminSenderId(payload, authConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sender-ids"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

