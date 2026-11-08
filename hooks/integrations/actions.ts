"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApiKeys,
  createApiKey,
  revokeApiKey,
  CreateApiKeyPayload,
  ApiKeyItem,
  CreateApiKeyResponse,
  updateApiKeyWebhook,
  testApiKeyWebhook,
  getApiKeyWebhookDeliveries,
  WebhookSettingsResponse,
  WebhookDeliveryItem,
} from "@/services/integrations";
import { getFreshAuthHeaders } from "@/hooks/authentication/useAxiosAuth";

export const API_KEYS_QUERY_KEY = ["api-keys"];

/**
 * Hook to fetch all API keys for the current business
 */
export const useFetchApiKeys = () => {
  return useQuery<ApiKeyItem[], Error>({
    queryKey: API_KEYS_QUERY_KEY,
    queryFn: async () => {
      const config = await getFreshAuthHeaders();
      return getApiKeys(config);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Hook to create a new API key
 */
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateApiKeyResponse, Error, CreateApiKeyPayload>({
    mutationFn: async (payload: CreateApiKeyPayload) => {
      const config = await getFreshAuthHeaders();
      return createApiKey(payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
    },
  });
};

/**
 * Hook to revoke an API key
 */
export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (reference: string) => {
      const config = await getFreshAuthHeaders();
      return revokeApiKey(reference, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
    },
  });
};

/**
 * Recent webhook deliveries for one API key
 */
export const useFetchWebhookDeliveries = (reference?: string) => {
  return useQuery<{ webhook_url: string | null; deliveries: WebhookDeliveryItem[] }, Error>({
    queryKey: [...API_KEYS_QUERY_KEY, "webhook", reference],
    queryFn: async () => {
      const config = await getFreshAuthHeaders();
      return getApiKeyWebhookDeliveries(reference as string, config);
    },
    enabled: Boolean(reference),
    staleTime: 1000 * 10,
  });
};

/**
 * Set or rotate an API key's delivery webhook
 */
export const useUpdateApiKeyWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    WebhookSettingsResponse,
    Error,
    { reference: string; webhook_url: string; rotate_secret?: boolean }
  >({
    mutationFn: async ({ reference, ...payload }) => {
      const config = await getFreshAuthHeaders();
      return updateApiKeyWebhook(reference, payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
    },
  });
};

/**
 * Send a signed test event to the webhook
 */
export const useTestApiKeyWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; status_code: number | null; error: string | null },
    Error,
    string
  >({
    mutationFn: async (reference: string) => {
      const config = await getFreshAuthHeaders();
      return testApiKeyWebhook(reference, config);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_QUERY_KEY });
    },
  });
};
