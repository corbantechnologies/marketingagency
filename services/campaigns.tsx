/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export type CampaignStatus =
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type CampaignChannel = "SMS" | "EMAIL" | "WHATSAPP";

export interface Campaign {
  id: string;
  name: string;
  sender_id: string;
  message_template: string;
  channel: CampaignChannel;
  target_group?: string | null;
  target_group_name?: string | null;
  target_group_reference?: string | null;
  recipient_count: number;
  segment_count: number;
  total_cost_credits: number;
  status: CampaignStatus;
  scheduled_at?: string | null;
  business: string;
  business_name?: string;
  business_reference?: string;
  created_by?: string;
  created_by_email?: string;
  is_active: boolean;
  reference: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignPayload {
  name: string;
  sender_id: string;
  message_template: string;
  channel?: CampaignChannel;
  target_group_reference?: string | null;
  send_to_all_contacts?: boolean;
  manual_numbers?: string | null;
  business_reference?: string | null;
}

export interface CampaignFilterParams {
  status?: CampaignStatus;
  channel?: CampaignChannel;
  sender_id?: string;
  target_group__reference?: string;
  business__reference?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

export type AxiosConfig = {
  headers?: {
    Authorization?: string;
    [key: string]: any;
  };
  params?: any;
};

/**
 * Fetch list of campaigns for active workspace
 * Endpoint: GET /api/v1/campaigns/
 */
export const getCampaigns = async (
  params?: CampaignFilterParams,
  config?: AxiosConfig
): Promise<Campaign[]> => {
  const response: AxiosResponse<any> = await apiActions.get(
    "/api/v1/campaigns/",
    {
      ...config,
      params: { ...params, ...config?.params },
    }
  );
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.results || [];
};

/**
 * Fetch a single campaign by reference
 * Endpoint: GET /api/v1/campaigns/<reference>/
 */
export const getCampaignByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<Campaign> => {
  const response: AxiosResponse<Campaign> = await apiActions.get(
    `/api/v1/campaigns/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Create and queue a new broadcast campaign
 * Endpoint: POST /api/v1/campaigns/
 */
export const createCampaign = async (
  data: CreateCampaignPayload,
  config?: AxiosConfig
): Promise<Campaign> => {
  const response: AxiosResponse<Campaign> = await apiActions.post(
    "/api/v1/campaigns/",
    data,
    config
  );
  return response.data;
};

/**
 * Soft-delete a campaign
 * Endpoint: DELETE /api/v1/campaigns/<reference>/
 */
export const deleteCampaign = async (
  reference: string,
  config?: AxiosConfig
): Promise<void> => {
  await apiActions.delete(`/api/v1/campaigns/${reference}/`, config);
};

// ============================================================================
// Agency Admin Broadcast API
// ============================================================================

export interface AgencyBroadcastMetadata {
  default_sender_id: string;
  all_businesses_count: number;
  all_users_count: number;
  gateway_provider: string;
}

export interface AgencyBroadcastPayload {
  name: string;
  sender_id?: string;
  message_template: string;
  target_audience: "ALL_BUSINESSES" | "ALL_USERS" | "MANUAL";
  manual_numbers?: string;
}

/**
 * Fetch agency broadcast audience metrics (Admins only)
 * Endpoint: GET /api/v1/campaigns/agency-broadcast/
 */
export const getAgencyBroadcastMetadata = async (
  config?: AxiosConfig
): Promise<AgencyBroadcastMetadata> => {
  const response: AxiosResponse<AgencyBroadcastMetadata> = await apiActions.get(
    "/api/v1/campaigns/agency-broadcast/",
    config
  );
  return response.data;
};

/**
 * Dispatch real outbound SMS blast as LJK Marketing Agency (Admins only)
 * Endpoint: POST /api/v1/campaigns/agency-broadcast/
 */
export const createAgencyBroadcast = async (
  data: AgencyBroadcastPayload,
  config?: AxiosConfig
): Promise<{ message: string; campaign: Campaign }> => {
  const response: AxiosResponse<{ message: string; campaign: Campaign }> = await apiActions.post(
    "/api/v1/campaigns/agency-broadcast/",
    data,
    config
  );
  return response.data;
};

// ============================================================================
// Module 3: Spam, Phishing & Anti-Fraud Compliance Shield
// ============================================================================

export interface CakHoursStatus {
  status: "OPEN" | "RESTRICTED";
  is_open: boolean;
  current_eat_time: string;
  current_eat_date: string;
  window_start: string;
  window_end: string;
  notice: string;
}

export interface FlaggedCampaignItem {
  reference: string;
  name: string;
  sender_id: string;
  business_name: string;
  business_reference: string;
  message_snippet: string;
  status: string;
  is_quarantined: boolean;
  risk_level: "CLEAN" | "MEDIUM" | "HIGH";
  risk_score: number;
  flagged_terms: string[];
  has_suspicious_url: boolean;
  summary: string;
  recipient_count: number;
  created_at: string;
}

export interface ComplianceOverviewData {
  cak_status: CakHoursStatus;
  vitals: {
    high_risk_count: number;
    quarantined_count: number;
    clean_count: number;
    scanned_count: number;
    active_terms_count: number;
  };
  flagged_campaigns: FlaggedCampaignItem[];
  banned_terms: string[];
}

export interface ComplianceActionPayload {
  campaign_reference: string;
  action: "QUARANTINE" | "ALLOW_OVERRIDE";
}

export interface ManageComplianceKeywordsPayload {
  action: "add" | "remove" | "reset";
  term?: string;
}

/**
 * Fetch platform compliance telemetry, CAK window status, and flagged campaigns (Admin only)
 * Endpoint: GET /api/v1/campaigns/admin-compliance/overview/
 */
export const getAdminComplianceOverview = async (
  config?: AxiosConfig
): Promise<ComplianceOverviewData> => {
  const response: AxiosResponse<ComplianceOverviewData> = await apiActions.get(
    "/api/v1/campaigns/admin-compliance/overview/",
    config
  );
  return response.data;
};

/**
 * Enforce compliance action on campaign (Quarantine or Override)
 * Endpoint: POST /api/v1/campaigns/admin-compliance/action/
 */
export const adminComplianceAction = async (
  payload: ComplianceActionPayload,
  config?: AxiosConfig
): Promise<{ success: boolean; message: string; campaign_status: string }> => {
  const response = await apiActions.post(
    "/api/v1/campaigns/admin-compliance/action/",
    payload,
    config
  );
  return response.data;
};

/**
 * Add, remove or reset anti-phishing/spam keywords
 * Endpoint: POST /api/v1/campaigns/admin-compliance/keywords/
 */
export const adminManageComplianceKeywords = async (
  payload: ManageComplianceKeywordsPayload,
  config?: AxiosConfig
): Promise<{ success: boolean; detail: string; banned_terms: string[] }> => {
  const response = await apiActions.post(
    "/api/v1/campaigns/admin-compliance/keywords/",
    payload,
    config
  );
  return response.data;
};

