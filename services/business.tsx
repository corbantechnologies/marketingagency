/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

// ============================================================================
// TypeScript Interfaces (Directly matching Django backend serializers & models)
// ============================================================================

export type SenderIdStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface BusinessWallet {
  id?: string;
  business?: string;
  sms_credit_balance: number;
  email_credit_balance: number;
  reference: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

export interface Business {
  id: string;
  owner: string; // owner email
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  active_plan?: string | null;
  plan_detail?: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price_kes: string | number;
    sms_rate_kes: string | number;
    included_sms_credits: number;
    support_tier: string;
    reference: string;
    code: string;
  } | null;
  sender_id?: string | null;
  sender_id_status?: SenderIdStatus;
  sender_id_rejection_reason?: string | null;
  tax_pin?: string | null;
  registration_number?: string | null;
  registration_date?: string | null;
  registration_document?: string | null;
  wallet?: BusinessWallet | null;
  total_contacts?: number;
  total_contact_groups?: number;
  reference: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessPayload {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  active_plan?: string | null;
  sender_id?: string | null;
  tax_pin?: string | null;
  registration_number?: string | null;
  registration_date?: string | null;
}

export interface UpdateBusinessPayload {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  active_plan?: string | null;
  sender_id?: string | null;
  sender_id_status?: SenderIdStatus;
  sender_id_rejection_reason?: string | null;
  tax_pin?: string | null;
  registration_number?: string | null;
  registration_date?: string | null;
  is_active?: boolean;
}

export interface BusinessFilterParams {
  is_active?: boolean;
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
// Business API Services
// ============================================================================

/**
 * Fetch all businesses (Admins see all; owners see only their own)
 * Endpoint: GET /api/v1/businesses/
 */
export const getBusinesses = async (
  params?: BusinessFilterParams,
  config?: AxiosConfig
): Promise<Business[] | { count: number; next: string | null; previous: string | null; results: Business[] }> => {
  const response = await apiActions.get("/api/v1/businesses/", {
    ...config,
    params,
  });
  return response.data;
};

/**
 * Fetch a single business by reference
 * Endpoint: GET /api/v1/businesses/<reference>/
 */
export const getBusinessByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.get(
    `/api/v1/businesses/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Create a new business for the authenticated user
 * Endpoint: POST /api/v1/businesses/
 */
export const createBusiness = async (
  data: CreateBusinessPayload,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.post(
    "/api/v1/businesses/",
    data,
    config
  );
  return response.data;
};

/**
 * Update business details
 * Endpoint: PATCH /api/v1/businesses/<reference>/
 */
export const updateBusiness = async (
  reference: string,
  data: UpdateBusinessPayload,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.patch(
    `/api/v1/businesses/${reference}/`,
    data,
    config
  );
  return response.data;
};

/**
 * Deactivate / Soft-delete business (sets is_active=false)
 * Endpoint: PATCH /api/v1/businesses/<reference>/
 */
export const deactivateBusiness = async (
  reference: string,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.patch(
    `/api/v1/businesses/${reference}/`,
    { is_active: false },
    config
  );
  return response.data;
};

/**
 * Reactivate business (sets is_active=true)
 * Endpoint: PATCH /api/v1/businesses/<reference>/
 */
export const reactivateBusiness = async (
  reference: string,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.patch(
    `/api/v1/businesses/${reference}/`,
    { is_active: true },
    config
  );
  return response.data;
};

// ============================================================================
// Admin Observability Interfaces & API
// ============================================================================

export interface AdminVitals {
  active_businesses: number;
  total_businesses: number;
  total_users: number;
  active_users: number;
  floating_sms_credits: number;
  floating_email_credits: number;
  total_messages_dispatched: number;
  messages_last_24h: number;
  global_delivery_rate: number;
}

export interface AdminCarrierMetric {
  id: string;
  name: string;
  protocol: string;
  status: string;
  latency: string;
  throughput: string;
  total: number;
  delivery_rate: number;
  share_percentage: number;
}

export interface AdminRecentCampaign {
  reference: string;
  name: string;
  business_name: string;
  sender_id: string;
  recipient_count: number;
  cost_credits: number;
  status: string;
  created_at: string;
}

export interface AdminPipelineSummary {
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  total: number;
  recent_campaigns: AdminRecentCampaign[];
}

export interface AdminRecentActivityItem {
  id: string;
  type: string;
  channel: string;
  business_name: string;
  amount_units: number;
  running_balance: number;
  description: string;
  created_at: string;
}

export interface AdminObservabilityData {
  vitals: AdminVitals;
  gateway_mode: string;
  carriers: AdminCarrierMetric[];
  pipeline: AdminPipelineSummary;
  recent_activity: AdminRecentActivityItem[];
}

/**
 * Fetch platform-wide observability vitals and carrier telemetry (Admin only)
 * Endpoint: GET /api/v1/businesses/admin-observability/
 */
export const getAdminObservability = async (
  config?: AxiosConfig
): Promise<AdminObservabilityData> => {
  const response: AxiosResponse<AdminObservabilityData> = await apiActions.get(
    "/api/v1/businesses/admin-observability/",
    config
  );
  return response.data;
};

