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

export type CampaignChannel = "SMS" | "EMAIL";

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

