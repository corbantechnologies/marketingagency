/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export interface ApiKeyItem {
  id: string;
  reference: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  allowed_channels: string[];
  rate_limit_per_minute: number;
  last_used_at: string | null;
  webhook_url: string | null;
  created_at: string;
}

export interface CreateApiKeyPayload {
  name: string;
  allowed_channels?: string[];
  rate_limit_per_minute?: number;
  webhook_url?: string;
  is_test?: boolean;
}

export interface CreateApiKeyResponse extends ApiKeyItem {
  raw_secret_key: string;
  warning: string;
}

export type AxiosConfig = {
  headers?: {
    Authorization?: string;
    [key: string]: any;
  };
  params?: any;
};

/**
 * Fetch all API keys for the current business
 * Endpoint: GET /api/v1/integrations/keys/
 */
export const getApiKeys = async (config?: AxiosConfig): Promise<ApiKeyItem[]> => {
  const response: AxiosResponse<any> = await apiActions.get(
    "/api/v1/integrations/keys/",
    config
  );
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.results || [];
};

/**
 * Generate a new API key
 * Endpoint: POST /api/v1/integrations/keys/
 */
export const createApiKey = async (
  payload: CreateApiKeyPayload,
  config?: AxiosConfig
): Promise<CreateApiKeyResponse> => {
  const response: AxiosResponse<CreateApiKeyResponse> = await apiActions.post(
    "/api/v1/integrations/keys/",
    payload,
    config
  );
  return response.data;
};

/**
 * Revoke an API key
 * Endpoint: POST /api/v1/integrations/keys/<reference>/revoke/
 */
export const revokeApiKey = async (
  reference: string,
  config?: AxiosConfig
): Promise<{ success: boolean; message: string }> => {
  const response: AxiosResponse<{ success: boolean; message: string }> =
    await apiActions.post(
      `/api/v1/integrations/keys/${reference}/revoke/`,
      {},
      config
    );
  return response.data;
};

export interface WebhookDeliveryItem {
  id: string;
  event: string;
  message_id: string | null;
  attempts: number;
  status: "delivered" | "failed" | "pending";
  last_status_code: number | null;
  last_error: string | null;
  created_at: string;
  next_attempt_at: string | null;
}

export interface WebhookSettingsResponse extends ApiKeyItem {
  webhook_signing_secret?: string;
  warning?: string;
}

/**
 * Set, change or remove an API key's delivery webhook URL
 * Endpoint: PATCH /api/v1/integrations/keys/<reference>/webhook/
 */
export const updateApiKeyWebhook = async (
  reference: string,
  payload: { webhook_url: string; rotate_secret?: boolean },
  config?: AxiosConfig
): Promise<WebhookSettingsResponse> => {
  const response = await apiActions.patch(
    `/api/v1/integrations/keys/${reference}/webhook/`,
    payload,
    config
  );
  return response.data;
};

/**
 * Send a signed test event to the key's webhook URL
 * Endpoint: POST /api/v1/integrations/keys/<reference>/webhook/
 */
export const testApiKeyWebhook = async (
  reference: string,
  config?: AxiosConfig
): Promise<{ success: boolean; status_code: number | null; error: string | null }> => {
  const response = await apiActions.post(
    `/api/v1/integrations/keys/${reference}/webhook/`,
    {},
    config
  );
  return response.data;
};

/**
 * Latest webhook delivery attempts for a key
 * Endpoint: GET /api/v1/integrations/keys/<reference>/webhook/
 */
export const getApiKeyWebhookDeliveries = async (
  reference: string,
  config?: AxiosConfig
): Promise<{ webhook_url: string | null; deliveries: WebhookDeliveryItem[] }> => {
  const response = await apiActions.get(
    `/api/v1/integrations/keys/${reference}/webhook/`,
    config
  );
  return response.data;
};
