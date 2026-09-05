"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BroadcastMessage,
  BroadcastMessageStats,
  BroadcastMessageFilterParams,
  getBroadcastMessages,
  getBroadcastMessageStats,
  getAdminMessageInspector,
  exportAdminMessageLogs,
  MessageInspectorFilterParams,
} from "@/services/broadcastmessages";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const BROADCAST_MESSAGES_QUERY_KEY = ["broadcast-messages"];

export const useFetchBroadcastMessages = (params?: BroadcastMessageFilterParams) => {
  return useQuery<BroadcastMessage[], Error>({
    queryKey: [...BROADCAST_MESSAGES_QUERY_KEY, params],
    queryFn: () => getBroadcastMessages(params),
    staleTime: 1000 * 15, // 15 seconds
  });
};

export const useFetchBroadcastMessageStats = () => {
  return useQuery<BroadcastMessageStats, Error>({
    queryKey: [...BROADCAST_MESSAGES_QUERY_KEY, "stats"],
    queryFn: () => getBroadcastMessageStats(),
    staleTime: 1000 * 15,
  });
};

/**
 * Hook to fetch deep message inspection and delivery trace (Admin only)
 */
export const useFetchAdminMessageInspector = (params?: MessageInspectorFilterParams) => {
  const authConfig = useAxiosAuth();
  return useQuery({
    queryKey: ["admin", "message-inspector", params],
    queryFn: () => getAdminMessageInspector(params, authConfig),
    enabled: Boolean(authConfig.headers.Authorization),
    staleTime: 15_000,
  });
};

/**
 * Hook to download CSV export of filtered message logs
 */
export const useExportAdminMessageLogs = () => {
  const authConfig = useAxiosAuth();
  return async (params?: MessageInspectorFilterParams) => {
    const blob = await exportAdminMessageLogs(params, authConfig);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ljk_carrier_dlr_inspection_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
};
