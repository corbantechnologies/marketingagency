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

// ============================================================================
// Module 4: Global Message Inspector & Carrier DLR Search
// ============================================================================

export interface MessageInspectorTimelineItem {
  step: string;
  timestamp: string | null;
  detail: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "IN_FLIGHT";
}

export interface MessageInspectorItem {
  reference: string;
  code: string;
  phone_number: string;
  network_operator: string;
  message_id: string;
  sender_id: string;
  campaign_name: string;
  campaign_reference: string;
  business_name: string;
  business_reference: string;
  rendered_message: string;
  segments: number;
  cost_credits: number;
  status: MessageDeliveryStatus;
  delivery_timestamp: string | null;
  failure_reason: string;
  created_at: string;
  timeline: MessageInspectorTimelineItem[];
}

export interface MessageInspectorVitals {
  total_messages: number;
  delivered_count: number;
  failed_count: number;
  pending_count: number;
  delivery_rate_pct: number;
  safaricom_count: number;
  airtel_count: number;
  telkom_count: number;
}

export interface MessageInspectorResponse {
  vitals: MessageInspectorVitals;
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
  };
  results: MessageInspectorItem[];
}

export interface MessageInspectorFilterParams {
  search?: string;
  operator?: string;
  status?: string;
  business_reference?: string;
  campaign_reference?: string;
  page?: number;
  page_size?: number;
}

/**
 * Global message inspection across recipient phone, carrier ID, and business (Admin only)
 * Endpoint: GET /api/v1/broadcast-messages/admin-inspector/
 */
export const getAdminMessageInspector = async (
  params?: MessageInspectorFilterParams,
  config?: AxiosConfig
): Promise<MessageInspectorResponse> => {
  const response: AxiosResponse<MessageInspectorResponse> = await apiActions.get(
    "/api/v1/broadcast-messages/admin-inspector/",
    {
      ...config,
      params: { ...params, ...config?.params },
    }
  );
  return response.data;
};

/**
 * Export filtered message delivery logs to CSV (Admin only)
 * Endpoint: GET /api/v1/broadcast-messages/admin-inspector/export/
 */
export const exportAdminMessageLogs = async (
  params?: MessageInspectorFilterParams,
  config?: AxiosConfig
): Promise<Blob> => {
  const response = await apiActions.get(
    "/api/v1/broadcast-messages/admin-inspector/export/",
    {
      ...config,
      params: { ...params, ...config?.params },
      responseType: "blob",
    }
  );
  return response.data;
};
