"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getBusinessWallets,
  getBusinessWalletByReference,
  WalletFilterParams,
} from "@/services/businesswallets";
import { getFreshAuthHeaders } from "@/hooks/authentication/useAxiosAuth";

export const useFetchBusinessWallets = (params?: WalletFilterParams) => {
  return useQuery({
    queryKey: ["business-wallets", params],
    queryFn: async () => {
      const config = await getFreshAuthHeaders();
      return getBusinessWallets(params, config);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useFetchBusinessWalletByReference = (reference: string) => {
  return useQuery({
    queryKey: ["business-wallet", reference],
    queryFn: async () => {
      if (!reference) throw new Error("Wallet reference is required");
      const config = await getFreshAuthHeaders();
      return getBusinessWalletByReference(reference, config);
    },
    enabled: Boolean(reference),
  });
};
