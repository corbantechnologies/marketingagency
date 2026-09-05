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
  getAgencyBroadcastMetadata,
  createAgencyBroadcast,
  AgencyBroadcastPayload,
  AgencyBroadcastMetadata,
} from "@/services/campaigns";
import useAxiosAuth from "../authentication/useAxiosAuth";

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

export const useFetchAgencyBroadcastMetadata = () => {
  const authConfig = useAxiosAuth();
  return useQuery<AgencyBroadcastMetadata, Error>({
    queryKey: ["agency-broadcast", "metadata"],
    queryFn: () => getAgencyBroadcastMetadata(authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
    staleTime: 1000 * 30,
  });
};

export const useCreateAgencyBroadcast = () => {
  const queryClient = useQueryClient();
  const authConfig = useAxiosAuth();
  return useMutation<{ message: string; campaign: Campaign }, Error, AgencyBroadcastPayload>({
    mutationFn: (payload: AgencyBroadcastPayload) => createAgencyBroadcast(payload, authConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["broadcast-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "observability"] });
    },
  });
};

