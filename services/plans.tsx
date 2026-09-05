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
  annual_discount_percent?: number;
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
  annual_discount_percent?: number;
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
  annual_discount_percent?: number;
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
  const headers = { ...(config?.headers || {}) };
  if (!headers.Authorization || typeof headers.Authorization !== "string" || !headers.Authorization.trim()) {
    delete headers.Authorization;
  }

  const response = await apiActions.get("/api/v1/plans/", {
    ...config,
    headers,
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
  const headers = { ...(config?.headers || {}) };
  if (!headers.Authorization || typeof headers.Authorization !== "string" || !headers.Authorization.trim()) {
    delete headers.Authorization;
  }

  const response: AxiosResponse<Plan> = await apiActions.get(
    `/api/v1/plans/${reference}/`,
    {
      ...config,
      headers,
    }
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

/**
 * Seed/populate standard production plans (Admin only)
 * Endpoint: POST /api/v1/plans/seed/
 */
export const seedPlans = async (
  config?: AxiosConfig
): Promise<{ message: string; created_count: number; updated_count: number; plans: Plan[] }> => {
  const response = await apiActions.post("/api/v1/plans/seed/", {}, config);
  return response.data;
};

// ============================================================================
// Telecom Rate Card & Margin Simulation Services (Admin Only)
// ============================================================================

export interface WholesaleBenchmarks {
  safaricom_base_kes: number;
  airtel_base_kes: number;
  telkom_base_kes: number;
  blended_wholesale_cost_kes: number;
}

export interface MarkupTargets {
  standard_markup_pct: number;
  volume_markup_pct: number;
  enterprise_markup_pct: number;
}

export interface MarketShareWeights {
  safaricom: number;
  airtel: number;
  telkom: number;
}

export interface PlanMarginItem {
  reference: string;
  name: string;
  slug: string;
  category: string;
  price_kes: number;
  sms_rate_kes: number;
  included_sms_credits: number;
  safaricom_margin_pct: number;
  airtel_margin_pct: number;
  telkom_margin_pct: number;
  blended_margin_pct: number;
  profit_per_10k_kes: number;
}

export interface AdminRateCardResponse {
  wholesale_benchmarks: WholesaleBenchmarks;
  markup_targets: MarkupTargets;
  market_share_weights: MarketShareWeights;
  plans: PlanMarginItem[];
}

export interface SaveRateCardsPayload {
  wholesale?: {
    safaricom_base_kes?: number;
    airtel_base_kes?: number;
    telkom_base_kes?: number;
  };
  markup_targets?: {
    standard_markup_pct?: number;
    volume_markup_pct?: number;
    enterprise_markup_pct?: number;
  };
}

export interface RateSimulationPayload {
  volume: number;
  retail_rate_kes: number;
  safaricom_pct?: number;
  airtel_pct?: number;
  telkom_pct?: number;
}

export interface RateSimulationResult {
  simulation: {
    volume: number;
    retail_rate_kes: number;
    total_invoiced_kes: number;
    total_wholesale_cost_kes: number;
    gross_profit_kes: number;
    margin_pct: number;
    breakdown: {
      safaricom: { volume: number; cost_kes: number; base_rate: number };
      airtel: { volume: number; cost_kes: number; base_rate: number };
      telkom: { volume: number; cost_kes: number; base_rate: number };
    };
  };
}

/**
 * Fetch wholesale benchmarks, markup targets, and plan margins
 * Endpoint: GET /api/v1/plans/admin-rate-cards/
 */
export const getAdminRateCards = async (
  config?: AxiosConfig
): Promise<AdminRateCardResponse> => {
  const response: AxiosResponse<AdminRateCardResponse> = await apiActions.get(
    "/api/v1/plans/admin-rate-cards/",
    config
  );
  return response.data;
};

/**
 * Update wholesale benchmarks and markup targets
 * Endpoint: POST /api/v1/plans/admin-rate-cards/
 */
export const saveAdminRateCards = async (
  data: SaveRateCardsPayload,
  config?: AxiosConfig
): Promise<{ success: boolean; message: string; rate_cards: any }> => {
  const response = await apiActions.post(
    "/api/v1/plans/admin-rate-cards/",
    data,
    config
  );
  return response.data;
};

/**
 * Simulate campaign profitability across telco networks
 * Endpoint: POST /api/v1/plans/admin-rate-cards/simulate/
 */
export const simulateRateMargins = async (
  data: RateSimulationPayload,
  config?: AxiosConfig
): Promise<RateSimulationResult> => {
  const response: AxiosResponse<RateSimulationResult> = await apiActions.post(
    "/api/v1/plans/admin-rate-cards/simulate/",
    data,
    config
  );
  return response.data;
};

