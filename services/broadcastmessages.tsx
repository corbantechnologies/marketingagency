/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export type MessageDeliveryStatus =
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "FAILED"
  | "UNDELIVERABLE";

export interface BroadcastMessage {
  id: string;
  campaign: string;
  campaign_name?: string;
  campaign_reference?: string;
  sender_id?: string;
  contact?: string | null;
  contact_name?: string | null;
  phone_number: string;
  rendered_message: string;
  segments: number;
  cost_credits: number;
  status: MessageDeliveryStatus;
  network_operator?: string | null;
  message_id?: string | null;
  delivery_timestamp?: string | null;
  failure_reason?: string | null;
  reference: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BroadcastMessageStats {
  total_messages: number;
  delivered: number;
  sent: number;
  failed: number;
  queued: number;
  delivery_rate_percent: number;
}

export interface BroadcastMessageFilterParams {
  status?: MessageDeliveryStatus;
  network_operator?: string;
  campaign__reference?: string;
  campaign__code?: string;
  business__reference?: string;
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
 * Fetch broadcast messages delivery logs
 * Endpoint: GET /api/v1/broadcast-messages/
 */
export const getBroadcastMessages = async (
  params?: BroadcastMessageFilterParams,
  config?: AxiosConfig
): Promise<BroadcastMessage[]> => {
  const response: AxiosResponse<any> = await apiActions.get(
    "/api/v1/broadcast-messages/",
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
 * Fetch delivery telemetry stats
 * Endpoint: GET /api/v1/broadcast-messages/stats/
 */
export const getBroadcastMessageStats = async (
  config?: AxiosConfig
): Promise<BroadcastMessageStats> => {
  const response: AxiosResponse<BroadcastMessageStats> = await apiActions.get(
    "/api/v1/broadcast-messages/stats/",
    config
  );
  return response.data;
};
