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

/**
 * Hook to fetch Admin Financial Analytics vitals, VIP leaderboard, and ledger
 */
export const useFetchAdminFinancialAnalytics = () => {
  return useQuery({
    queryKey: ["admin", "financial-analytics"],
    queryFn: async () => {
      const config = await getFreshAuthHeaders();
      const { getAdminFinancialAnalytics } = await import("@/services/transactions");
      return getAdminFinancialAnalytics(config);
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
};

/**
 * Hook for manual M-Pesa re-credit by admin customer support
 */
export const useManualMpesaRecredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: import("@/services/transactions").ManualMpesaRecreditPayload) => {
      const config = await getFreshAuthHeaders();
      const { manualMpesaRecredit } = await import("@/services/transactions");
      return manualMpesaRecredit(payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "financial-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["business-wallets"] });
    },
  });
};
