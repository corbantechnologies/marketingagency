/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export interface ContactGroupSimple {
  id: string;
  name: string;
  reference: string;
  code: string;
}

export interface Contact {
  id: string;
  business: string; // business name
  business_reference?: string;
  phone_number: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name: string;
  groups?: string[];
  groups_detail?: ContactGroupSimple[];
  custom_attributes?: Record<string, any>;
  is_subscribed: boolean;
  is_active: boolean;
  created_by?: string;
  reference: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactPayload {
  phone_number: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  groups?: string[];
  custom_attributes?: Record<string, any>;
  is_subscribed?: boolean;
  business?: string;
}

export interface UpdateContactPayload {
  phone_number?: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  groups?: string[];
  custom_attributes?: Record<string, any>;
  is_subscribed?: boolean;
  is_active?: boolean;
}

export interface BulkImportPayload {
  business_reference?: string;
  default_group_reference?: string;
  contacts: {
    phone_number: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    groups?: string[];
    custom_attributes?: Record<string, any>;
  }[];
}

export interface ContactFilterParams {
  is_active?: boolean;
  is_subscribed?: boolean;
  groups__reference?: string;
  groups__name?: string;
  business__reference?: string;
  business__code?: string;
  business__name?: string;
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
 * Fetch contacts list
 * Endpoint: GET /api/v1/contacts/
 */
export const getContacts = async (
  params?: ContactFilterParams,
  config?: AxiosConfig
): Promise<Contact[]> => {
  const response: AxiosResponse<any> = await apiActions.get("/api/v1/contacts/", {
    ...config,
    params: { ...params, ...config?.params },
  });
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data?.results || [];
};

/**
 * Fetch a single contact by reference code
 * Endpoint: GET /api/v1/contacts/<reference>/
 */
export const getContactByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<Contact> => {
  const response: AxiosResponse<Contact> = await apiActions.get(
    `/api/v1/contacts/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Create a new contact
 * Endpoint: POST /api/v1/contacts/
 */
export const createContact = async (
  data: CreateContactPayload,
  config?: AxiosConfig
): Promise<Contact> => {
  const response: AxiosResponse<Contact> = await apiActions.post(
    "/api/v1/contacts/",
    data,
    config
  );
  return response.data;
};

/**
 * Update an existing contact
 * Endpoint: PATCH /api/v1/contacts/<reference>/
 */
export const updateContact = async (
  reference: string,
  data: UpdateContactPayload,
  config?: AxiosConfig
): Promise<Contact> => {
  const response: AxiosResponse<Contact> = await apiActions.patch(
    `/api/v1/contacts/${reference}/`,
    data,
    config
  );
  return response.data;
};

/**
 * Soft-delete a contact
 * Endpoint: DELETE /api/v1/contacts/<reference>/
 */
export const deleteContact = async (
  reference: string,
  config?: AxiosConfig
): Promise<void> => {
  await apiActions.delete(`/api/v1/contacts/${reference}/`, config);
};

/**
 * Bulk import / upload contacts from CSV or form payloads
 * Endpoint: POST /api/v1/contacts/bulk-import/
 */
export const bulkImportContacts = async (
  data: BulkImportPayload,
  config?: AxiosConfig
): Promise<{ message: string; created_count: number; updated_count: number }> => {
  const response = await apiActions.post(
    "/api/v1/contacts/bulk-import/",
    data,
    config
  );
  return response.data;
};

/**
 * Toggle opt-in/opt-out subscription status
 * Endpoint: POST /api/v1/contacts/<reference>/toggle-subscription/
 */
export const toggleContactSubscription = async (
  reference: string,
  config?: AxiosConfig
): Promise<{ message: string; is_subscribed: boolean }> => {
  const response = await apiActions.post(
    `/api/v1/contacts/${reference}/toggle-subscription/`,
    {},
    config
  );
  return response.data;
};
