/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";

export interface MpesaStkPushPayload {
  phone_number: string;
  amount_kes: number;
  business_reference?: string;
  channel?: "SMS" | "EMAIL";
}

export interface MpesaStkPushResponse {
  success: boolean;
  checkout_request_id: string;
  merchant_request_id: string;
  customer_message: string;
  amount_kes: number;
  phone_number: string;
  business_name?: string;
}

export interface MpesaPollStatusResponse {
  status: "PENDING" | "SUCCESS" | "FAILED" | "UNKNOWN";
  message?: string;
  receipt?: string;
  amount_kes?: number;
  units_added?: number;
  new_balance?: number;
  result_code?: number;
}

/**
 * Trigger an automated Safaricom Daraja STK Push prompt to client mobile handset
 */
export const initiateMpesaStkPush = async (
  payload: MpesaStkPushPayload
): Promise<MpesaStkPushResponse> => {
  const res = await apiActions.post<MpesaStkPushResponse>(
    "/api/v1/transactions/mpesa/stk-push/",
    payload
  );
  return res.data;
};

/**
 * Poll transaction status from backend cache (every 2 seconds)
 */
export const pollMpesaTransactionStatus = async (
  checkoutRequestId: string
): Promise<MpesaPollStatusResponse> => {
  const res = await apiActions.get<MpesaPollStatusResponse>(
    `/api/v1/transactions/mpesa/status/${checkoutRequestId}/`
  );
  return res.data;
};

/**
 * Development / Test sandbox simulation helper
 */
export const simulateMpesaCallback = async (
  checkoutRequestId: string
): Promise<any> => {
  const res = await apiActions.post(
    "/api/v1/transactions/mpesa/simulate-callback/",
    { checkout_request_id: checkoutRequestId }
  );
  return res.data;
};
