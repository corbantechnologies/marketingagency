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

// ============================================================================
// Module 1: Admin Financial Intelligence & M-Pesa Ledger
// ============================================================================

export interface FinancialVitals {
  total_revenue_kes: number;
  revenue_24h_kes: number;
  revenue_7d_kes: number;
  revenue_30d_kes: number;
  total_carrier_cost_kes: number;
  carrier_cost_24h_kes: number;
  gross_profit_kes: number;
  profit_margin_pct: number;
  total_dispatched_sms: number;
  total_tx_count: number;
}

export interface VipClientEntry {
  business_name: string;
  business_reference: string;
  owner_name: string;
  owner_email: string;
  total_spent_kes: number;
  topup_count: number;
  current_wallet_balance: number;
}

export interface LedgerTransactionEntry {
  reference: string;
  code: string;
  business_name: string;
  business_reference: string;
  mpesa_receipt_number: string;
  amount_units: number;
  amount_kes: number;
  running_balance: number;
  channel: string;
  description: string;
  created_at: string;
}

export interface AdminFinancialAnalyticsData {
  vitals: FinancialVitals;
  vip_leaderboard: VipClientEntry[];
  recent_transactions: LedgerTransactionEntry[];
}

export interface ManualMpesaRecreditPayload {
  business_reference: string;
  mpesa_receipt_number: string;
  amount_kes: number;
  notes?: string;
}

/**
 * Fetch platform financial intelligence, revenue vitals, VIP leaderboard, and ledger (Admin only)
 * Endpoint: GET /api/v1/transactions/admin-financial-analytics/
 */
export const getAdminFinancialAnalytics = async (
  config?: AxiosConfig
): Promise<AdminFinancialAnalyticsData> => {
  const response: AxiosResponse<AdminFinancialAnalyticsData> = await apiActions.get(
    "/api/v1/transactions/admin-financial-analytics/",
    config
  );
  return response.data;
};

/**
 * Manually apply an M-Pesa transaction to a business wallet (Admin only)
 * Endpoint: POST /api/v1/transactions/manual-recredit/
 */
export const manualMpesaRecredit = async (
  payload: ManualMpesaRecreditPayload,
  config?: AxiosConfig
): Promise<{ success: boolean; message: string; transaction: WalletTransaction }> => {
  const response = await apiActions.post(
    "/api/v1/transactions/manual-recredit/",
    payload,
    config
  );
  return response.data;
};
