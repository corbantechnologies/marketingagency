"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BroadcastMessage,
  BroadcastMessageStats,
  BroadcastMessageFilterParams,
  getBroadcastMessages,
  getBroadcastMessageStats,
} from "@/services/broadcastmessages";

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
