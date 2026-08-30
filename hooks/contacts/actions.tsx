"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContacts,
  getContactByReference,
  createContact,
  updateContact,
  deleteContact,
  bulkImportContacts,
  toggleContactSubscription,
  ContactFilterParams,
  CreateContactPayload,
  UpdateContactPayload,
  BulkImportPayload,
} from "@/services/contacts";
import { getFreshAuthHeaders } from "@/hooks/authentication/useAxiosAuth";

export const useFetchContacts = (params?: ContactFilterParams) => {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: async () => {
      const config = await getFreshAuthHeaders();
      return getContacts(params, config);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useFetchContactByReference = (reference: string) => {
  return useQuery({
    queryKey: ["contact", reference],
    queryFn: async () => {
      if (!reference) throw new Error("Contact reference is required");
      const config = await getFreshAuthHeaders();
      return getContactByReference(reference, config);
    },
    enabled: Boolean(reference),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateContactPayload) => {
      const config = await getFreshAuthHeaders();
      return createContact(payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reference,
      payload,
    }: {
      reference: string;
      payload: UpdateContactPayload;
    }) => {
      const config = await getFreshAuthHeaders();
      return updateContact(reference, payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const config = await getFreshAuthHeaders();
      return deleteContact(reference, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
    },
  });
};

export const useBulkImportContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkImportPayload) => {
      const config = await getFreshAuthHeaders();
      return bulkImportContacts(payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
    },
  });
};

export const useToggleContactSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const config = await getFreshAuthHeaders();
      return toggleContactSubscription(reference, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });
};
