"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWalletTransactions,
  getWalletTransactionByReference,
  adjustWalletCredits,
  TransactionFilterParams,
  AdminCreditAdjustmentPayload,
} from "@/services/transactions";
import { getFreshAuthHeaders } from "@/hooks/authentication/useAxiosAuth";

export const useFetchWalletTransactions = (params?: TransactionFilterParams) => {
  return useQuery({
    queryKey: ["wallet-transactions", params],
    queryFn: async () => {
      const config = await getFreshAuthHeaders();
      return getWalletTransactions(params, config);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useFetchWalletTransactionByReference = (reference: string) => {
  return useQuery({
    queryKey: ["wallet-transaction", reference],
    queryFn: async () => {
      if (!reference) throw new Error("Transaction reference is required");
      const config = await getFreshAuthHeaders();
      return getWalletTransactionByReference(reference, config);
    },
    enabled: Boolean(reference),
  });
};

export const useAdjustWalletCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AdminCreditAdjustmentPayload) => {
      const config = await getFreshAuthHeaders();
      return adjustWalletCredits(payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["business-wallets"] });
    },
  });
};
