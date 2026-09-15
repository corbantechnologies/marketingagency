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
  whatsapp_business_account_id?: string | null;
  whatsapp_phone_number_id?: string | null;
  whatsapp_display_phone_number?: string | null;
  whatsapp_verified_name?: string | null;
  whatsapp_onboarding_status?: "NOT_CONNECTED" | "CONNECTED" | "PENDING" | "RESTRICTED";
  whatsapp_quality_rating?: "GREEN" | "YELLOW" | "RED" | "UNKNOWN";
  whatsapp_onboarding_mode?: "SHARED" | "DEDICATED";
  whatsapp_connected_at?: string | null;
  has_dedicated_whatsapp?: boolean;
  active_whatsapp_phone_number_id?: string;
  wallet?: BusinessWallet | null;
  total_contacts?: number;
  total_contact_groups?: number;
  reference: string;
  code: string;
  is_active: boolean;
  is_lifetime_access?: boolean;
  feature_overrides?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConnectWhatsAppPayload {
  code?: string;
  waba_id?: string;
  phone_number_id?: string;
  display_phone_number?: string;
  verified_name?: string;
}

export interface WhatsAppConnectResponse {
  success: boolean;
  message: string;
  business: Business;
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

export interface CarrierBalanceItem {
  provider: string;
  environment?: string;
  account_username?: string;
  partner_id?: string;
  balance_kes: number;
  currency: string;
  estimated_credits: number;
  status: "HEALTHY" | "LOW" | "CRITICAL" | "UNCONFIGURED" | "ERROR";
  raw_string?: string;
  error?: string | null;
  last_checked: string;
}

export interface CarrierBalancesData {
  africastalking: CarrierBalanceItem;
  advanta: CarrierBalanceItem;
  total_liquidity_kes: number;
  total_estimated_credits: number;
  overall_status: "HEALTHY" | "LOW" | "CRITICAL";
  active_provider: string;
  threshold_kes: number;
  critical_threshold_kes: number;
  last_evaluated: string;
}

export interface AdminObservabilityData {
  vitals: AdminVitals;
  gateway_mode: string;
  carrier_balances?: CarrierBalancesData;
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

/**
 * Force refresh upstream carrier balances directly from Africa's Talking & Advanta APIs (Admin only)
 * Endpoint: POST /api/v1/businesses/admin-observability/refresh-carrier-balances/
 */
export const refreshCarrierBalances = async (
  config?: AxiosConfig
): Promise<{ success: boolean; carrier_balances: CarrierBalancesData; alert_sent: boolean }> => {
  const response = await apiActions.post(
    "/api/v1/businesses/admin-observability/refresh-carrier-balances/",
    {},
    config
  );
  return response.data;
};

export interface AlertRecipientItem {
  email: string;
  name?: string;
  source: string;
}

export interface AlertRecipientsBreakdown {
  all_recipients: string[];
  total_count: number;
  registered_admins: AlertRecipientItem[];
  env_emails: AlertRecipientItem[];
  custom_emails: AlertRecipientItem[];
  threshold_kes?: number;
  critical_threshold_kes?: number;
}

/**
 * Fetch all configured reminder and alert recipient emails (Admin only)
 * Endpoint: GET /api/v1/businesses/admin-observability/alert-recipients/
 */
export const getAlertRecipients = async (
  config?: AxiosConfig
): Promise<AlertRecipientsBreakdown> => {
  const response = await apiActions.get(
    "/api/v1/businesses/admin-observability/alert-recipients/",
    config
  );
  return response.data;
};

/**
 * Manage reminder recipient emails: add, remove, test, or update thresholds
 * Endpoint: POST /api/v1/businesses/admin-observability/alert-recipients/
 */
export const manageAlertRecipient = async (
  payload: {
    action: "add" | "remove" | "test" | "update_thresholds";
    email?: string;
    threshold_kes?: number;
    critical_threshold_kes?: number;
  },
  config?: AxiosConfig
): Promise<{
  success: boolean;
  detail: string;
  recipients?: AlertRecipientsBreakdown;
  threshold_kes?: number;
  critical_threshold_kes?: number;
}> => {
  const response = await apiActions.post(
    "/api/v1/businesses/admin-observability/alert-recipients/",
    payload,
    config
  );
  return response.data;
};

// ============================================================================
// Module 2: Admin Sender ID Approval & Telco Vetting Queue
// ============================================================================

export interface SenderIdQueueItem {
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  owner_name: string;
  owner_email: string;
  sender_id: string;
  sender_id_status: "PENDING" | "APPROVED" | "REJECTED";
  sender_id_rejection_reason: string;
  tax_pin: string;
  registration_number: string;
  registration_date: string | null;
  registration_document_url: string | null;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
}

export interface SenderIdQueueResponse {
  vitals: {
    total_pending: number;
    total_approved: number;
    total_rejected: number;
    total_count: number;
  };
  results: SenderIdQueueItem[];
}

export interface ReviewSenderIdPayload {
  business_reference: string;
  action: "APPROVE" | "REJECT";
  rejection_reason?: string;
}

/**
 * Fetch Sender ID review queue (Admin only)
 * Endpoint: GET /api/v1/businesses/admin-sender-ids/
 */
export const getAdminSenderIdQueue = async (
  statusFilter?: string,
  config?: AxiosConfig
): Promise<SenderIdQueueResponse> => {
  const params = statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {};
  const response: AxiosResponse<SenderIdQueueResponse> = await apiActions.get(
    "/api/v1/businesses/admin-sender-ids/",
    {
      ...config,
      params: { ...params, ...config?.params },
    }
  );
  return response.data;
};

/**
 * Approve or reject client business Sender ID (Admin only)
 * Endpoint: POST /api/v1/businesses/admin-sender-ids/review/
 */
export const reviewAdminSenderId = async (
  payload: ReviewSenderIdPayload,
  config?: AxiosConfig
): Promise<{ success: boolean; message: string; sender_id_status: string }> => {
  const response = await apiActions.post(
    "/api/v1/businesses/admin-sender-ids/review/",
    payload,
    config
  );
  return response.data;
};

export interface BusinessEntitlementsPayload {
  is_lifetime_access?: boolean;
  feature_overrides?: Record<string, any>;
  active_plan?: string | null;
}

export interface BusinessEntitlementsData {
  business_name: string;
  business_reference: string;
  is_lifetime_access: boolean;
  feature_overrides: Record<string, any>;
  active_plan: any;
  plan_renewal_date: string | null;
  available_plans: any[];
}

/**
 * Fetch business entitlement & lifetime status (Admin only)
 * Endpoint: GET /api/v1/businesses/{reference}/entitlements/
 */
export const getBusinessEntitlements = async (
  reference: string,
  config?: AxiosConfig
): Promise<BusinessEntitlementsData> => {
  const response: AxiosResponse<BusinessEntitlementsData> = await apiActions.get(
    `/api/v1/businesses/${reference}/entitlements/`,
    config
  );
  return response.data;
};

/**
 * Update business entitlement, lifetime bypass, and feature overrides (Admin only)
 * Endpoint: PATCH /api/v1/businesses/{reference}/entitlements/
 */
export const updateBusinessEntitlements = async (
  reference: string,
  payload: BusinessEntitlementsPayload,
  config?: AxiosConfig
): Promise<{ success: boolean; message: string; business: Business }> => {
  const response: AxiosResponse<{ success: boolean; message: string; business: Business }> = await apiActions.patch(
    `/api/v1/businesses/${reference}/entitlements/`,
    payload,
    config
  );
  return response.data;
};

/**
 * Connect business WABA / phone number via Meta Embedded Signup code or payload
 * Endpoint: POST /api/v1/businesses/{reference}/whatsapp-connect/
 */
export const connectBusinessWhatsApp = async (
  reference: string,
  payload: ConnectWhatsAppPayload,
  config?: AxiosConfig
): Promise<WhatsAppConnectResponse> => {
  const response: AxiosResponse<WhatsAppConnectResponse> = await apiActions.post(
    `/api/v1/businesses/${reference}/whatsapp-connect/`,
    payload,
    config
  );
  return response.data;
};

/**
 * Disconnect business WABA from LJK platform
 * Endpoint: DELETE /api/v1/businesses/{reference}/whatsapp-connect/
 */
export const disconnectBusinessWhatsApp = async (
  reference: string,
  config?: AxiosConfig
): Promise<WhatsAppConnectResponse> => {
  const response: AxiosResponse<WhatsAppConnectResponse> = await apiActions.delete(
    `/api/v1/businesses/${reference}/whatsapp-connect/`,
    config
  );
  return response.data;
};

/**
 * Toggle WhatsApp broadcast route mode between SHARED and DEDICATED
 * Endpoint: PATCH /api/v1/businesses/{reference}/whatsapp-connect/
 */
export const toggleBusinessWhatsAppMode = async (
  reference: string,
  mode: "SHARED" | "DEDICATED",
  config?: AxiosConfig
): Promise<WhatsAppConnectResponse> => {
  const response: AxiosResponse<WhatsAppConnectResponse> = await apiActions.patch(
    `/api/v1/businesses/${reference}/whatsapp-connect/`,
    { mode },
    config
  );
  return response.data;
};

/**
 * Live refresh WhatsApp business account and phone number status from Meta Cloud API
 * Endpoint: POST /api/v1/businesses/{reference}/whatsapp-refresh/
 */
export const refreshBusinessWhatsAppStatus = async (
  reference: string,
  config?: AxiosConfig
): Promise<WhatsAppConnectResponse> => {
  const response: AxiosResponse<WhatsAppConnectResponse> = await apiActions.post(
    `/api/v1/businesses/${reference}/whatsapp-refresh/`,
    {},
    config
  );
  return response.data;
};



