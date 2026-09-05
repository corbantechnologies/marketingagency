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

/**
 * Mutation hook to initiate instant Safaricom Daraja STK Push to client handset
 */
export const useInitiateMpesaStkPush = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: import("@/services/mpesa").MpesaStkPushPayload) => {
      const { initiateMpesaStkPush } = await import("@/services/mpesa");
      return initiateMpesaStkPush(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};

/**
 * Query hook to poll status of an active M-Pesa STK Push session
 */
export const usePollMpesaStatus = (
  checkoutRequestId: string | null,
  enabled: boolean = false
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["mpesa-poll", checkoutRequestId],
    queryFn: async () => {
      if (!checkoutRequestId) throw new Error("Checkout Request ID is required");
      const { pollMpesaTransactionStatus } = await import("@/services/mpesa");
      return pollMpesaTransactionStatus(checkoutRequestId);
    },
    enabled: Boolean(checkoutRequestId) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling once terminal status reached
      if (status === "SUCCESS" || status === "FAILED") {
        if (status === "SUCCESS") {
          queryClient.invalidateQueries({ queryKey: ["business-wallets"] });
          queryClient.invalidateQueries({ queryKey: ["businesses"] });
          queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
        }
        return false;
      }
      return 2000; // Poll every 2 seconds while PENDING
    },
    refetchIntervalInBackground: true,
  });
};

/**
 * Helper hook for developer sandbox callback simulation
 */
export const useSimulateMpesaCallback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkoutRequestId: string) => {
      const { simulateMpesaCallback } = await import("@/services/mpesa");
      return simulateMpesaCallback(checkoutRequestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-wallets"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};

