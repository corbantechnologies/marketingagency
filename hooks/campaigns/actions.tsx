"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Campaign,
  CreateCampaignPayload,
  CampaignFilterParams,
  getCampaigns,
  getCampaignByReference,
  createCampaign,
  deleteCampaign,
} from "@/services/campaigns";

export const CAMPAIGNS_QUERY_KEY = ["campaigns"];

export const useFetchCampaigns = (params?: CampaignFilterParams) => {
  return useQuery<Campaign[], Error>({
    queryKey: [...CAMPAIGNS_QUERY_KEY, params],
    queryFn: () => getCampaigns(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useFetchCampaignByReference = (reference: string) => {
  return useQuery<Campaign, Error>({
    queryKey: [...CAMPAIGNS_QUERY_KEY, reference],
    queryFn: () => getCampaignByReference(reference),
    enabled: !!reference,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation<Campaign, Error, CreateCampaignPayload>({
    mutationFn: (payload: CreateCampaignPayload) => createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["business-wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["broadcast-messages"] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (reference: string) => deleteCampaign(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
  });
};
