"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContactGroups,
  getContactGroupByReference,
  createContactGroup,
  updateContactGroup,
  deleteContactGroup,
  ContactGroupFilterParams,
  CreateContactGroupPayload,
  UpdateContactGroupPayload,
} from "@/services/contactgroups";
import { getFreshAuthHeaders } from "@/hooks/authentication/useAxiosAuth";

export const useFetchContactGroups = (params?: ContactGroupFilterParams) => {
  return useQuery({
    queryKey: ["contact-groups", params],
    queryFn: async () => {
      const config = await getFreshAuthHeaders();
      return getContactGroups(params, config);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useFetchContactGroupByReference = (reference: string) => {
  return useQuery({
    queryKey: ["contact-group", reference],
    queryFn: async () => {
      if (!reference) throw new Error("Contact group reference is required");
      const config = await getFreshAuthHeaders();
      return getContactGroupByReference(reference, config);
    },
    enabled: Boolean(reference),
  });
};

export const useCreateContactGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateContactGroupPayload) => {
      const config = await getFreshAuthHeaders();
      return createContactGroup(payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
    },
  });
};

export const useUpdateContactGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reference,
      payload,
    }: {
      reference: string;
      payload: UpdateContactGroupPayload;
    }) => {
      const config = await getFreshAuthHeaders();
      return updateContactGroup(reference, payload, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
      queryClient.invalidateQueries({ queryKey: ["contact-group"] });
    },
  });
};

export const useDeleteContactGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const config = await getFreshAuthHeaders();
      return deleteContactGroup(reference, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
    },
  });
};
