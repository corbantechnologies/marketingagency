/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export interface BusinessWallet {
  id: string;
  business: string; // business name / slug
  sms_credit_balance: number;
  email_credit_balance: number;
  reference: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface WalletFilterParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

export type AxiosConfig = {
  headers?: {
    Authorization?: string;
    [key: string]: any;
  };
  params?: any;
};

/**
 * Fetch all accessible business wallets
 * Endpoint: GET /api/v1/wallets/
 */
export const getBusinessWallets = async (
  params?: WalletFilterParams,
  config?: AxiosConfig
): Promise<BusinessWallet[]> => {
  const response: AxiosResponse<any> = await apiActions.get("/api/v1/wallets/", {
    ...config,
    params: { ...params, ...config?.params },
  });
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.results || [];
};

/**
 * Fetch a single business wallet by its reference code
 * Endpoint: GET /api/v1/wallets/<reference>/
 */
export const getBusinessWalletByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<BusinessWallet> => {
  const response: AxiosResponse<BusinessWallet> = await apiActions.get(
    `/api/v1/wallets/${reference}/`,
    config
  );
  return response.data;
};
