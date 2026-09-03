"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MessageTemplate,
  CreateMessageTemplatePayload,
  UpdateMessageTemplatePayload,
  MessageTemplateFilterParams,
  getMessageTemplates,
  getMessageTemplateByReference,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
} from "@/services/messagetemplates";

export const MESSAGE_TEMPLATES_QUERY_KEY = ["message-templates"];

export const useFetchMessageTemplates = (params?: MessageTemplateFilterParams) => {
  return useQuery<MessageTemplate[], Error>({
    queryKey: [...MESSAGE_TEMPLATES_QUERY_KEY, params],
    queryFn: () => getMessageTemplates(params),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useFetchMessageTemplateByReference = (reference: string) => {
  return useQuery<MessageTemplate, Error>({
    queryKey: [...MESSAGE_TEMPLATES_QUERY_KEY, reference],
    queryFn: () => getMessageTemplateByReference(reference),
    enabled: !!reference,
  });
};

export const useCreateMessageTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<MessageTemplate, Error, CreateMessageTemplatePayload>({
    mutationFn: (payload: CreateMessageTemplatePayload) => createMessageTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_TEMPLATES_QUERY_KEY });
    },
  });
};

export const useUpdateMessageTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<MessageTemplate, Error, { reference: string; payload: UpdateMessageTemplatePayload }>({
    mutationFn: ({ reference, payload }) => updateMessageTemplate(reference, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_TEMPLATES_QUERY_KEY });
    },
  });
};

export const useDeleteMessageTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (reference: string) => deleteMessageTemplate(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_TEMPLATES_QUERY_KEY });
    },
  });
};
