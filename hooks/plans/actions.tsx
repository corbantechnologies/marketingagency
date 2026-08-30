"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlan,
  CreatePlanPayload,
  deactivatePlan,
  deletePlan,
  getPlanByReference,
  getPlans,
  PlanFilterParams,
  reactivatePlan,
  updatePlan,
  UpdatePlanPayload,
} from "@/services/plans";
import useAxiosAuth, { getFreshAuthHeaders } from "../authentication/useAxiosAuth";

/**
 * Query hook to fetch all plans (Public sees active plans; Admins see all)
 */
export function useFetchPlans(params?: PlanFilterParams) {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["plans", params, Boolean(authConfig.headers.Authorization)],
    queryFn: async () => {
      const liveAuth = await getFreshAuthHeaders();
      return getPlans(params, liveAuth);
    },
  });
}

/**
 * Query hook to fetch a single plan by its reference code
 */
export function useFetchPlan(reference?: string | null) {
  const authConfig = useAxiosAuth();

  return useQuery({
    queryKey: ["plan", reference, Boolean(authConfig.headers.Authorization)],
    queryFn: async () => {
      const liveAuth = await getFreshAuthHeaders();
      return getPlanByReference(reference!, liveAuth);
    },
    enabled: Boolean(reference),
  });
}

/**
 * Mutation hook to create a new plan (Admin only)
 */
export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePlanPayload) => {
      const authConfig = await getFreshAuthHeaders();
      return createPlan(data, authConfig);
    },
    onSuccess: (newPlan) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      if (newPlan.reference) {
        queryClient.setQueryData(["plan", newPlan.reference], newPlan);
      }
    },
  });
}

/**
 * Mutation hook to update an existing plan (Admin only)
 */
export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reference,
      data,
    }: {
      reference: string;
      data: UpdatePlanPayload;
    }) => {
      const authConfig = await getFreshAuthHeaders();
      return updatePlan(reference, data, authConfig);
    },
    onSuccess: (updatedPlan, variables) => {
      queryClient.setQueryData(["plan", variables.reference], updatedPlan);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

/**
 * Mutation hook to deactivate (soft-delete) a plan (Admin only)
 */
export function useDeactivatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const authConfig = await getFreshAuthHeaders();
      return deactivatePlan(reference, authConfig);
    },
    onSuccess: (deactivatedPlan, reference) => {
      queryClient.setQueryData(["plan", reference], deactivatedPlan);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

/**
 * Mutation hook to reactivate a plan (Admin only)
 */
export function useReactivatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const authConfig = await getFreshAuthHeaders();
      return reactivatePlan(reference, authConfig);
    },
    onSuccess: (reactivatedPlan, reference) => {
      queryClient.setQueryData(["plan", reference], reactivatedPlan);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

/**
 * Mutation hook to permanently delete a plan (Admin only)
 */
export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const authConfig = await getFreshAuthHeaders();
      return deletePlan(reference, authConfig);
    },
    onSuccess: (_, reference) => {
      queryClient.removeQueries({ queryKey: ["plan", reference] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
