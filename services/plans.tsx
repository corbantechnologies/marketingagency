/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

// ============================================================================
// TypeScript Interfaces (Directly matching Django backend Plan model & serializer)
// ============================================================================

export type PlanCategory = "PAYG" | "SUBSCRIPTION" | "BUNDLE" | "ENTERPRISE" | string;
export type AudienceType = "SME" | "CORPORATE" | "ALL" | string;
export type BillingCycle = "ONCE" | "MONTHLY" | "ANNUAL" | string;
export type SupportTier = "COMMUNITY" | "EMAIL" | "PRIORITY_WHATSAPP" | "DEDICATED_MANAGER" | string;

export interface Plan {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: PlanCategory;
  target_audience: AudienceType;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  price_kes: string | number;
  price_usd: string | number | null;
  billing_cycle: BillingCycle;
  sms_rate_kes: string | number;
  email_rate_kes: string | number;
  included_sms_credits: number;
  included_email_credits: number;
  max_contacts: number;
  max_sender_ids: number;
  has_api_access: boolean;
  has_smpp_access: boolean;
  has_autoresponders: boolean;
  has_dedicated_ip: boolean;
  support_tier: SupportTier;
  features_list: string[];
  badge_text: string | null;
  reference: string;
  code: string;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanPayload {
  name: string;
  tagline: string;
  category?: PlanCategory;
  target_audience?: AudienceType;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
  price_kes: string | number;
  price_usd?: string | number | null;
  billing_cycle?: BillingCycle;
  sms_rate_kes: string | number;
  email_rate_kes: string | number;
  included_sms_credits?: number;
  included_email_credits?: number;
  max_contacts?: number;
  max_sender_ids?: number;
  has_api_access?: boolean;
  has_smpp_access?: boolean;
  has_autoresponders?: boolean;
  has_dedicated_ip?: boolean;
  support_tier?: SupportTier;
  features_list?: string[];
  badge_text?: string | null;
}

export interface UpdatePlanPayload {
  name?: string;
  tagline?: string;
  category?: PlanCategory;
  target_audience?: AudienceType;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
  price_kes?: string | number;
  price_usd?: string | number | null;
  billing_cycle?: BillingCycle;
  sms_rate_kes?: string | number;
  email_rate_kes?: string | number;
  included_sms_credits?: number;
  included_email_credits?: number;
  max_contacts?: number;
  max_sender_ids?: number;
  has_api_access?: boolean;
  has_smpp_access?: boolean;
  has_autoresponders?: boolean;
  has_dedicated_ip?: boolean;
  support_tier?: SupportTier;
  features_list?: string[];
  badge_text?: string | null;
}

export interface PlanFilterParams {
  category?: PlanCategory;
  target_audience?: AudienceType;
  billing_cycle?: BillingCycle;
  is_featured?: boolean;
  is_active?: boolean;
  support_tier?: SupportTier;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

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
// Plan API Services
// ============================================================================

/**
 * Fetch all plans (Public sees active plans; Admins see all)
 * Endpoint: GET /api/v1/plans/
 */
export const getPlans = async (
  params?: PlanFilterParams,
  config?: AxiosConfig
): Promise<Plan[] | { count: number; next: string | null; previous: string | null; results: Plan[] }> => {
  const response = await apiActions.get("/api/v1/plans/", {
    ...config,
    params,
  });
  return response.data;
};

/**
 * Fetch a single plan by reference code
 * Endpoint: GET /api/v1/plans/<reference>/
 */
export const getPlanByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiActions.get(
    `/api/v1/plans/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Create a new plan (Admin only)
 * Endpoint: POST /api/v1/plans/
 */
export const createPlan = async (
  data: CreatePlanPayload,
  config?: AxiosConfig
): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiActions.post(
    "/api/v1/plans/",
    data,
    config
  );
  return response.data;
};

/**
 * Update plan details (Admin only)
 * Endpoint: PATCH /api/v1/plans/<reference>/
 */
export const updatePlan = async (
  reference: string,
  data: UpdatePlanPayload,
  config?: AxiosConfig
): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiActions.patch(
    `/api/v1/plans/${reference}/`,
    data,
    config
  );
  return response.data;
};

/**
 * Deactivate / Soft-delete plan (sets is_active=false, Admin only)
 * Endpoint: PATCH /api/v1/plans/<reference>/
 */
export const deactivatePlan = async (
  reference: string,
  config?: AxiosConfig
): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiActions.patch(
    `/api/v1/plans/${reference}/`,
    { is_active: false },
    config
  );
  return response.data;
};

/**
 * Reactivate plan (sets is_active=true, Admin only)
 * Endpoint: PATCH /api/v1/plans/<reference>/
 */
export const reactivatePlan = async (
  reference: string,
  config?: AxiosConfig
): Promise<Plan> => {
  const response: AxiosResponse<Plan> = await apiActions.patch(
    `/api/v1/plans/${reference}/`,
    { is_active: true },
    config
  );
  return response.data;
};

/**
 * Permanently delete plan (Admin only)
 * Endpoint: DELETE /api/v1/plans/<reference>/
 */
export const deletePlan = async (
  reference: string,
  config?: AxiosConfig
): Promise<void> => {
  await apiActions.delete(`/api/v1/plans/${reference}/`, config);
};
