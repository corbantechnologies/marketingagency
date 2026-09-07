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
