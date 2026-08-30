/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export interface ContactGroup {
  id: string;
  name: string;
  description?: string | null;
  business: string; // Business name
  business_reference?: string;
  created_by?: string; // User email
  total_contacts?: number;
  is_active: boolean;
  reference: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactGroupPayload {
  name: string;
  description?: string | null;
  business?: string;
}

export interface UpdateContactGroupPayload {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface ContactGroupFilterParams {
  is_active?: boolean;
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
 * Fetch list of contact groups
 * Endpoint: GET /api/v1/contact-groups/
 */
export const getContactGroups = async (
  params?: ContactGroupFilterParams,
  config?: AxiosConfig
): Promise<ContactGroup[]> => {
  const response: AxiosResponse<any> = await apiActions.get(
    "/api/v1/contact-groups/",
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
 * Fetch a single contact group by its reference code
 * Endpoint: GET /api/v1/contact-groups/<reference>/
 */
export const getContactGroupByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<ContactGroup> => {
  const response: AxiosResponse<ContactGroup> = await apiActions.get(
    `/api/v1/contact-groups/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Create a new contact group
 * Endpoint: POST /api/v1/contact-groups/
 */
export const createContactGroup = async (
  data: CreateContactGroupPayload,
  config?: AxiosConfig
): Promise<ContactGroup> => {
  const response: AxiosResponse<ContactGroup> = await apiActions.post(
    "/api/v1/contact-groups/",
    data,
    config
  );
  return response.data;
};

/**
 * Update an existing contact group
 * Endpoint: PATCH /api/v1/contact-groups/<reference>/
 */
export const updateContactGroup = async (
  reference: string,
  data: UpdateContactGroupPayload,
  config?: AxiosConfig
): Promise<ContactGroup> => {
  const response: AxiosResponse<ContactGroup> = await apiActions.patch(
    `/api/v1/contact-groups/${reference}/`,
    data,
    config
  );
  return response.data;
};

/**
 * Delete a contact group
 * Endpoint: DELETE /api/v1/contact-groups/<reference>/
 */
export const deleteContactGroup = async (
  reference: string,
  config?: AxiosConfig
): Promise<void> => {
  await apiActions.delete(`/api/v1/contact-groups/${reference}/`, config);
};
