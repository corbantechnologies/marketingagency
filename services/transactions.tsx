/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export type TransactionType =
  | "MPESA_TOPUP"
  | "PLAN_INCLUDED"
  | "CAMPAIGN_DISPATCH"
  | "REFUND"
  | "ADMIN_ADJUSTMENT";

export type ChannelType = "SMS" | "EMAIL";

export interface WalletTransaction {
  id: string;
  wallet: string; // wallet code
  business_name?: string;
  business_reference?: string;
  transaction_type: TransactionType;
  channel: ChannelType;
  amount_units: number;
  running_balance: number;
  description: string;
  mpesa_receipt_number?: string | null;
  reference: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionFilterParams {
  transaction_type?: TransactionType;
  channel?: ChannelType;
  wallet__code?: string;
  wallet__reference?: string;
  wallet__business__reference?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

export interface AdminCreditAdjustmentPayload {
  wallet_reference?: string;
  business_reference?: string;
  channel: ChannelType;
  amount_units: number;
  description: string;
}

export type AxiosConfig = {
  headers?: {
    Authorization?: string;
    [key: string]: any;
  };
  params?: any;
};

/**
 * Fetch list of wallet transactions
 * Endpoint: GET /api/v1/transactions/
 */
export const getWalletTransactions = async (
  params?: TransactionFilterParams,
  config?: AxiosConfig
): Promise<WalletTransaction[]> => {
  const response: AxiosResponse<any> = await apiActions.get(
    "/api/v1/transactions/",
    {
      ...config,
      params: { ...params, ...config?.params },
    }
  );
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.results || [];
};

/**
 * Fetch a single wallet transaction by its reference code
 * Endpoint: GET /api/v1/transactions/<reference>/
 */
export const getWalletTransactionByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<WalletTransaction> => {
  const response: AxiosResponse<WalletTransaction> = await apiActions.get(
    `/api/v1/transactions/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Admin manual credit/debit adjustment
 * Endpoint: POST /api/v1/transactions/adjustment/
 */
export const adjustWalletCredits = async (
  data: AdminCreditAdjustmentPayload,
  config?: AxiosConfig
): Promise<{ message: string; transaction: WalletTransaction }> => {
  const response = await apiActions.post(
    "/api/v1/transactions/adjustment/",
    data,
    config
  );
  return response.data;
};
