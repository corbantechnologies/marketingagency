"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApiKeys,
  createApiKey,
  revokeApiKey,
  CreateApiKeyPayload,
  ApiKeyItem,
  CreateApiKeyResponse,
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
