/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export type TemplateChannel = "SMS" | "EMAIL";

export type TemplateCategory =
  | "MARKETING"
  | "TRANSACTIONAL"
  | "REMINDER"
  | "NOTIFICATION"
  | "ALERT";

export interface MessageTemplate {
  id: string;
  name: string;
  channel: TemplateChannel;
  category: TemplateCategory;
  body: string;
  business: string;
  business_name?: string;
  business_reference?: string;
  created_by?: string;
  created_by_email?: string;
  character_count?: number;
  estimated_segments?: number;
  is_unicode?: boolean;
  is_active: boolean;
  reference: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageTemplatePayload {
  name: string;
  channel?: TemplateChannel;
  category?: TemplateCategory;
  body: string;
  business_reference?: string | null;
}

export interface UpdateMessageTemplatePayload {
  name?: string;
  channel?: TemplateChannel;
  category?: TemplateCategory;
  body?: string;
  is_active?: boolean;
}

export interface MessageTemplateFilterParams {
  channel?: TemplateChannel;
  category?: TemplateCategory;
  business__reference?: string;
  is_active?: boolean;
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
 * Fetch list of reusable message templates
 * Endpoint: GET /api/v1/message-templates/
 */
export const getMessageTemplates = async (
  params?: MessageTemplateFilterParams,
  config?: AxiosConfig
): Promise<MessageTemplate[]> => {
  const response: AxiosResponse<any> = await apiActions.get(
    "/api/v1/message-templates/",
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
 * Fetch a single message template by reference
 * Endpoint: GET /api/v1/message-templates/<reference>/
 */
export const getMessageTemplateByReference = async (
  reference: string,
  config?: AxiosConfig
): Promise<MessageTemplate> => {
  const response: AxiosResponse<MessageTemplate> = await apiActions.get(
    `/api/v1/message-templates/${reference}/`,
    config
  );
  return response.data;
};

/**
 * Create a new reusable message template
 * Endpoint: POST /api/v1/message-templates/
 */
export const createMessageTemplate = async (
  data: CreateMessageTemplatePayload,
  config?: AxiosConfig
): Promise<MessageTemplate> => {
  const response: AxiosResponse<MessageTemplate> = await apiActions.post(
    "/api/v1/message-templates/",
    data,
    config
  );
  return response.data;
};

/**
 * Update an existing message template
 * Endpoint: PATCH /api/v1/message-templates/<reference>/
 */
export const updateMessageTemplate = async (
  reference: string,
  data: UpdateMessageTemplatePayload,
  config?: AxiosConfig
): Promise<MessageTemplate> => {
  const response: AxiosResponse<MessageTemplate> = await apiActions.patch(
    `/api/v1/message-templates/${reference}/`,
    data,
    config
  );
  return response.data;
};

/**
 * Soft-delete a message template
 * Endpoint: DELETE /api/v1/message-templates/<reference>/
 */
export const deleteMessageTemplate = async (
  reference: string,
  config?: AxiosConfig
): Promise<void> => {
  await apiActions.delete(`/api/v1/message-templates/${reference}/`, config);
};
