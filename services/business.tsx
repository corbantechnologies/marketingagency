/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

// ============================================================================
// TypeScript Interfaces (Directly matching Django backend serializers & models)
// ============================================================================

export interface Business {
  id: string;
  owner: string; // owner email
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  reference: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessPayload {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

export interface UpdateBusinessPayload {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  is_active?: boolean;
}

export interface BusinessFilterParams {
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

export interface MessageResponse {
  message?: string;
  detail?: string;
  [key: string]: any;
}

export type AxiosConfig = {
  headers?: {
    Authorization?: string;
    [key: string]: any;
  };
  params?: any;
  [key: string]: any;
};

// ============================================================================
// Business API Services
// ============================================================================

/**
 * Fetch all businesses (Admins see all; owners see only their own)
 * Endpoint: GET /api/v1/businesses/
 */
export const getBusinesses = async (
  params?: BusinessFilterParams,
  config?: AxiosConfig
): Promise<Business[] | { count: number; next: string | null; previous: string | null; results: Business[] }> => {
  const response = await apiActions.get("/api/v1/businesses/", {
    ...config,
    params,
  });
  return response.data;
};

/**
 * Fetch a single business by reference
 * Endpoint: GET /api/v1/businesses/<reference>/
 */
export const getBusinessByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.get(
    `/api/v1/businesses/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Create a new business for the authenticated user
 * Endpoint: POST /api/v1/businesses/
 */
export const createBusiness = async (
  data: CreateBusinessPayload,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.post(
    "/api/v1/businesses/",
    data,
    config
  );
  return response.data;
};

/**
 * Update business details
 * Endpoint: PATCH /api/v1/businesses/<reference>/
 */
export const updateBusiness = async (
  reference: string,
  data: UpdateBusinessPayload,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.patch(
    `/api/v1/businesses/${reference}/`,
    data,
    config
  );
  return response.data;
};

/**
 * Deactivate / Soft-delete business (sets is_active=false)
 * Endpoint: PATCH /api/v1/businesses/<reference>/
 */
export const deactivateBusiness = async (
  reference: string,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.patch(
    `/api/v1/businesses/${reference}/`,
    { is_active: false },
    config
  );
  return response.data;
};

/**
 * Reactivate business (sets is_active=true)
 * Endpoint: PATCH /api/v1/businesses/<reference>/
 */
export const reactivateBusiness = async (
  reference: string,
  config?: AxiosConfig
): Promise<Business> => {
  const response: AxiosResponse<Business> = await apiActions.patch(
    `/api/v1/businesses/${reference}/`,
    { is_active: true },
    config
  );
  return response.data;
};
