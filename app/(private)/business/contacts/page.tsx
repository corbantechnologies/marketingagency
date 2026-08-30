/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useFetchContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useBulkImportContacts,
  useToggleContactSubscription,
} from "@/hooks/contacts/actions";
import {
  useFetchContactGroups,
  useCreateContactGroup,
  useUpdateContactGroup,
  useDeleteContactGroup,
} from "@/hooks/contactgroups/actions";
import { Contact, CreateContactPayload } from "@/services/contacts";
import { ContactGroup } from "@/services/contactgroups";

export default function BusinessContactsPage() {
  const [activeTab, setActiveTab] = useState<"contacts" | "groups">("contacts");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("ALL");
  const [subscriptionFilter, setSubscriptionFilter] = useState<"ALL" | "SUBSCRIBED" | "UNSUBSCRIBED">("ALL");

  // Modals state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<ContactGroup | null>(null);

  // Queries
  const { data: contactsData, isLoading: isLoadingContacts } = useFetchContacts();
  const { data: groupsData, isLoading: isLoadingGroups } = useFetchContactGroups();

  // Mutations
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();
  const toggleSubscriptionMutation = useToggleContactSubscription();
  const bulkImportMutation = useBulkImportContacts();

  const createGroupMutation = useCreateContactGroup();
  const updateGroupMutation = useUpdateContactGroup();
  const deleteGroupMutation = useDeleteContactGroup();

  const contacts: Contact[] = useMemo(() => {
    if (!contactsData) return [];
    const list = Array.isArray(contactsData) ? contactsData : (contactsData as any).results || [];
    return list.filter((c: Contact) => c.is_active !== false);
  }, [contactsData]);

  const groups: ContactGroup[] = useMemo(() => {
    if (!groupsData) return [];
    const list = Array.isArray(groupsData) ? groupsData : (groupsData as any).results || [];
    return list.filter((g: ContactGroup) => g.is_active !== false);
  }, [groupsData]);

  // Filtering
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchSearch =
        contact.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.email || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchGroup =
        selectedGroupFilter === "ALL" ||
        (contact.groups_detail && contact.groups_detail.some((g) => g.reference === selectedGroupFilter || g.name === selectedGroupFilter));

      const matchSub =
        subscriptionFilter === "ALL" ||
        (subscriptionFilter === "SUBSCRIBED" && contact.is_subscribed) ||
        (subscriptionFilter === "UNSUBSCRIBED" && !contact.is_subscribed);

      return matchSearch && matchGroup && matchSub;
    });
  }, [contacts, searchTerm, selectedGroupFilter, subscriptionFilter]);

  // Stats
  const totalContacts = contacts.length;
  const subscribedContacts = contacts.filter((c) => c.is_subscribed).length;
  const unsubscribedContacts = totalContacts - subscribedContacts;
  const totalGroups = groups.length;

  // Single Contact Form State
  const [contactForm, setContactForm] = useState<{
    phone_number: string;
    first_name: string;
    last_name: string;
    email: string;
    groups: string[];
    is_subscribed: boolean;
    attributes: { key: string; value: string }[];
  }>({
    phone_number: "",
    first_name: "",
    last_name: "",
    email: "",
    groups: [],
    is_subscribed: true,
    attributes: [],
  });

  // Group Form State
  const [groupForm, setGroupForm] = useState({
    name: "",
    description: "",
  });

  // CSV Upload Wizard State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [phoneColumnIdx, setPhoneColumnIdx] = useState<number>(0);
  const [firstNameColumnIdx, setFirstNameColumnIdx] = useState<number>(-1);
  const [lastNameColumnIdx, setLastNameColumnIdx] = useState<number>(-1);
  const [emailColumnIdx, setEmailColumnIdx] = useState<number>(-1);
  const [uploadTargetGroup, setUploadTargetGroup] = useState<string>("");
  const [newGroupNameOnUpload, setNewGroupNameOnUpload] = useState<string>("");

  const handleOpenCreateContact = () => {
    setEditingContact(null);
    setContactForm({
      phone_number: "",
      first_name: "",
      last_name: "",
      email: "",
      groups: [],
      is_subscribed: true,
      attributes: [],
    });
    setIsContactModalOpen(true);
  };

  const handleOpenEditContact = (c: Contact) => {
    setEditingContact(c);
    const attrs = c.custom_attributes
      ? Object.entries(c.custom_attributes).map(([k, v]) => ({ key: k, value: String(v) }))
      : [];
    setContactForm({
      phone_number: c.phone_number,
      first_name: c.first_name || "",
      last_name: c.last_name || "",
      email: c.email || "",
      groups: (c.groups_detail || []).map((g) => g.name),
      is_subscribed: c.is_subscribed,
      attributes: attrs,
    });
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.phone_number.trim()) {
      toast.error("Phone number is required");
      return;
    }

    const customAttrObj: Record<string, string> = {};
    contactForm.attributes.forEach((attr) => {
      if (attr.key.trim()) {
        customAttrObj[attr.key.trim()] = attr.value.trim();
      }
    });

    const payload: CreateContactPayload = {
      phone_number: contactForm.phone_number.trim(),
      first_name: contactForm.first_name.trim() || undefined,
      last_name: contactForm.last_name.trim() || undefined,
      email: contactForm.email.trim() || undefined,
      groups: contactForm.groups,
      custom_attributes: customAttrObj,
      is_subscribed: contactForm.is_subscribed,
    };

    if (editingContact) {
      updateContactMutation.mutate(
        { reference: editingContact.reference, payload },
        {
          onSuccess: () => {
            toast.success("Contact updated successfully");
            setIsContactModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.phone_number?.[0] || err?.response?.data?.detail || "Failed to update contact");
          },
        }
      );
    } else {
      createContactMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Contact added successfully");
          setIsContactModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.phone_number?.[0] || err?.response?.data?.detail || "Failed to create contact");
        },
      });
    }
  };

  const handleConfirmDeleteContact = () => {
    if (!deletingContact) return;
    deleteContactMutation.mutate(deletingContact.reference, {
      onSuccess: () => {
        toast.success("Contact removed");
        setDeletingContact(null);
      },
      onError: () => toast.error("Failed to delete contact"),
    });
  };

  const handleToggleSubscription = (c: Contact) => {
    toggleSubscriptionMutation.mutate(c.reference, {
      onSuccess: (data) => {
        toast.success(data.message || (data.is_subscribed ? "Contact subscribed" : "Contact unsubscribed"));
      },
      onError: () => toast.error("Failed to toggle subscription"),
    });
  };

  // Group Handlers
  const handleOpenCreateGroup = () => {
    setEditingGroup(null);
    setGroupForm({ name: "", description: "" });
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroup = (g: ContactGroup) => {
    setEditingGroup(g);
    setGroupForm({ name: g.name, description: g.description || "" });
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (editingGroup) {
      updateGroupMutation.mutate(
        { reference: editingGroup.reference, payload: groupForm },
        {
          onSuccess: () => {
            toast.success("Group updated");
            setIsGroupModalOpen(false);
          },
          onError: () => toast.error("Failed to update group"),
        }
      );
    } else {
      createGroupMutation.mutate(groupForm, {
        onSuccess: () => {
          toast.success(`Group "${groupForm.name}" created`);
          setIsGroupModalOpen(false);
        },
        onError: (err: any) => toast.error(err?.response?.data?.name?.[0] || "Failed to create group"),
      });
    }
  };

  const handleConfirmDeleteGroup = () => {
    if (!deletingGroup) return;
    deleteGroupMutation.mutate(deletingGroup.reference, {
      onSuccess: () => {
        toast.success(`Group "${deletingGroup.name}" deleted`);
        setDeletingGroup(null);
      },
      onError: () => toast.error("Failed to delete group"),
    });
  };

  // CSV Parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text
        .split(/\r\n|\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      if (lines.length === 0) {
        toast.error("File appears to be empty");
        return;
      }

      const parsedRows = lines.slice(0, 6).map((line) => {
        // Simple CSV splitter handling quotes
        const result: string[] = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') inQuotes = !inQuotes;
          else if (char === "," && !inQuotes) {
            result.push(cur.trim());
            cur = "";
          } else cur += char;
        }
        result.push(cur.trim());
        return result;
      });

      const headers = parsedRows[0];
      setCsvHeaders(headers);
      setCsvPreview(parsedRows.slice(1));

      // Auto-detect columns
      headers.forEach((h, idx) => {
        const lower = h.toLowerCase();
        if (lower.includes("phone") || lower.includes("mobile") || lower.includes("number") || lower.includes("msisdn")) {
          setPhoneColumnIdx(idx);
        } else if (lower.includes("first") || lower.includes("fname")) {
          setFirstNameColumnIdx(idx);
        } else if (lower.includes("last") || lower.includes("lname") || lower.includes("surname")) {
          setLastNameColumnIdx(idx);
        } else if (lower.includes("email") || lower.includes("mail")) {
          setEmailColumnIdx(idx);
        }
      });
    };
    reader.readAsText(file);
  };

  const handleExecuteBulkUpload = () => {
    if (!csvFile) {
      toast.error("Please select a CSV file first");
      return;
    }
    if (phoneColumnIdx < 0) {
      toast.error("Please select which column contains Phone Numbers");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text
        .split(/\r\n|\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // Skip header row
      const dataLines = lines.slice(1);
      const parsedContacts: {
        phone_number: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        groups?: string[];
      }[] = [];

      dataLines.forEach((line) => {
        const cells = line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
        const phone = cells[phoneColumnIdx];
        if (!phone) return;

        parsedContacts.push({
          phone_number: phone,
          first_name: firstNameColumnIdx >= 0 ? cells[firstNameColumnIdx] : undefined,
          last_name: lastNameColumnIdx >= 0 ? cells[lastNameColumnIdx] : undefined,
          email: emailColumnIdx >= 0 ? cells[emailColumnIdx] : undefined,
          groups: newGroupNameOnUpload ? [newGroupNameOnUpload] : undefined,
        });
      });

      if (parsedContacts.length === 0) {
        toast.error("No valid contacts found in the file");
        return;
      }

      bulkImportMutation.mutate(
        {
          default_group_reference: uploadTargetGroup || undefined,
          contacts: parsedContacts,
        },
        {
          onSuccess: (res) => {
            toast.success(res.message || `Imported ${res.created_count} new contacts (${res.updated_count} updated)`);
            setIsUploadModalOpen(false);
            setCsvFile(null);
            setCsvPreview([]);
          },
          onError: () => toast.error("Failed to process bulk upload"),
        }
      );
    };
    reader.readAsText(csvFile);
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Contacts &amp; Segmentation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Audience &amp; Contact Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Organize customer phone numbers, group segments for campaigns, and upload batch spreadsheets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="py-2 px-3.5 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-lg border border-zinc-300 transition-colors inline-flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>1-Click CSV Upload</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateGroup}
            className="py-2 px-3.5 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-lg border border-zinc-300 transition-colors inline-flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>New Group</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateContact}
            className="py-2 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Directory</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{totalContacts.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Saved contacts</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Subscribed</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{subscribedContacts.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Eligible for SMS</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Opted Out</div>
          <div className="text-2xl font-bold text-zinc-500 mt-1">{unsubscribedContacts.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Suppressed numbers</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Segments</div>
          <div className="text-2xl font-bold text-[#581c87] mt-1">{totalGroups}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Targeted buckets</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("contacts")}
          className={`pb-2 text-xs font-bold transition-colors cursor-pointer relative ${
            activeTab === "contacts"
              ? "text-[#581c87] border-b-2 border-[#581c87]"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          All Contacts ({contacts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("groups")}
          className={`pb-2 text-xs font-bold transition-colors cursor-pointer relative ${
            activeTab === "groups"
              ? "text-[#581c87] border-b-2 border-[#581c87]"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Audience Groups &amp; Segments ({groups.length})
        </button>
      </div>

      {/* TAB 1: ALL CONTACTS */}
      {activeTab === "contacts" && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search phone number, name, or email..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Group Filter */}
              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-lg border border-zinc-300 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
              >
                <option value="ALL">All Groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.reference}>
                    {g.name}
                  </option>
                ))}
              </select>

              {/* Subscription Filter */}
              <select
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value as any)}
                className="py-2 px-3 text-xs rounded-lg border border-zinc-300 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
              >
                <option value="ALL">All Opt-in Status</option>
                <option value="SUBSCRIBED">Subscribed (Active)</option>
                <option value="UNSUBSCRIBED">Opted Out</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {isLoadingContacts ? (
            <div className="py-16 text-center text-xs text-zinc-500">Loading contacts directory...</div>
          ) : filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-2 font-semibold">Phone Number</th>
                    <th className="pb-3 px-2 font-semibold">Full Name</th>
                    <th className="pb-3 px-2 font-semibold">Email</th>
                    <th className="pb-3 px-2 font-semibold">Groups</th>
                    <th className="pb-3 px-2 font-semibold">Dynamic Attributes</th>
                    <th className="pb-3 px-2 font-semibold">Opt-in</th>
                    <th className="pb-3 px-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Phone */}
                      <td className="py-3 px-2 font-mono font-bold text-zinc-900">
                        {contact.phone_number}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-2 font-medium text-zinc-800">
                        {contact.full_name}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-2 text-zinc-500">
                        {contact.email || "—"}
                      </td>

                      {/* Groups */}
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {contact.groups_detail && contact.groups_detail.length > 0 ? (
                            contact.groups_detail.map((g) => (
                              <span
                                key={g.id}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-[#581c87] border border-purple-200"
                              >
                                {g.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-zinc-400">Unassigned</span>
                          )}
                        </div>
                      </td>

                      {/* Custom Attributes */}
                      <td className="py-3 px-2">
                        {contact.custom_attributes && Object.keys(contact.custom_attributes).length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {Object.entries(contact.custom_attributes).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-100 text-zinc-600 border border-zinc-200"
                              >
                                {k}: {String(v)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-400">—</span>
                        )}
                      </td>

                      {/* Opt-in Toggle */}
                      <td className="py-3 px-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSubscription(contact)}
                          disabled={toggleSubscriptionMutation.isPending}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            contact.is_subscribed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                          }`}
                          title="Click to toggle subscription status"
                        >
                          {contact.is_subscribed ? "Subscribed" : "Opted Out"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditContact(contact)}
                            className="py-1 px-2.5 rounded text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingContact(contact)}
                            className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Contact"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-zinc-500">
              {contacts.length === 0
                ? "Your contacts directory is empty. Click 'Add Contact' or '1-Click CSV Upload' to get started."
                : `No contacts found matching "${searchTerm}".`}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIENCE GROUPS & SEGMENTS */}
      {activeTab === "groups" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900">Custom Segmentation Groups</h2>
            <button
              type="button"
              onClick={handleOpenCreateGroup}
              className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Segment</span>
            </button>
          </div>

          {isLoadingGroups ? (
            <div className="py-16 text-center text-xs text-zinc-500">Loading segmentation groups...</div>
          ) : groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-zinc-900">{group.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#581c87] border border-purple-200">
                        {group.total_contacts ?? 0} Contacts
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 min-h-[32px]">
                      {group.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
                    <Link
                      href={`/business/sms/broadcast?group=${group.reference}`}
                      className="text-xs font-semibold text-[#581c87] hover:underline"
                    >
                      Send SMS to Group &rarr;
                    </Link>

                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditGroup(group)}
                        className="py-1 px-2.5 rounded text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingGroup(group)}
                        className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Group"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center text-xs text-zinc-500">
              No segmentation groups found. Create groups like &ldquo;VIP Customers&rdquo; or &ldquo;Nairobi Branch&rdquo; to send targeted campaigns.
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT CONTACT */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">
                {editingContact ? "Edit Contact" : "Add New Contact"}
              </h3>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Phone Number (E.164) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+254712345678 or 0712345678"
                  value={contactForm.phone_number}
                  onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
                <p className="text-[10px] text-zinc-400 mt-0.5">Kenyan numbers will automatically normalize to +254</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mary"
                    value={contactForm.first_name}
                    onChange={(e) => setContactForm({ ...contactForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wanjiku"
                    value={contactForm.last_name}
                    onChange={(e) => setContactForm({ ...contactForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="mary@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>

              {/* Group Multi-select */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Assign to Segmentation Groups
                </label>
                {groups.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-zinc-200 rounded-lg bg-zinc-50/60">
                    {groups.map((g) => {
                      const isSelected = contactForm.groups.includes(g.name);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            const newGroups = isSelected
                              ? contactForm.groups.filter((name) => name !== g.name)
                              : [...contactForm.groups, g.name];
                            setContactForm({ ...contactForm, groups: newGroups });
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#581c87] text-white"
                              : "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100"
                          }`}
                        >
                          {g.name}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400">No groups created yet. You can create groups anytime.</div>
                )}
              </div>

              {/* Dynamic Attributes Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Dynamic SMS Tags / Attributes
                  </label>
                  <button
                    type="button"
                    onClick={() => setContactForm({
                      ...contactForm,
                      attributes: [...contactForm.attributes, { key: "", value: "" }],
                    })}
                    className="text-[11px] font-semibold text-[#581c87] hover:underline"
                  >
                    + Add Attribute Tag
                  </button>
                </div>

                {contactForm.attributes.map((attr, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tag (e.g. balance)"
                      value={attr.key}
                      onChange={(e) => {
                        const next = [...contactForm.attributes];
                        next[idx].key = e.target.value;
                        setContactForm({ ...contactForm, attributes: next });
                      }}
                      className="w-1/2 px-2.5 py-1.5 text-xs rounded border border-zinc-300 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 500)"
                      value={attr.value}
                      onChange={(e) => {
                        const next = [...contactForm.attributes];
                        next[idx].value = e.target.value;
                        setContactForm({ ...contactForm, attributes: next });
                      }}
                      className="w-1/2 px-2.5 py-1.5 text-xs rounded border border-zinc-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = contactForm.attributes.filter((_, i) => i !== idx);
                        setContactForm({ ...contactForm, attributes: next });
                      }}
                      className="text-zinc-400 hover:text-red-600 px-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              {/* Opt-in Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_subscribed"
                  checked={contactForm.is_subscribed}
                  onChange={(e) => setContactForm({ ...contactForm, is_subscribed: e.target.checked })}
                  className="rounded text-[#581c87] focus:ring-[#581c87]"
                />
                <label htmlFor="is_subscribed" className="text-xs text-zinc-700">
                  Recipient has consented to receive broadcast SMS messages (Opted-in)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="py-2 px-4 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 border border-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createContactMutation.isPending || updateContactMutation.isPending}
                  className="py-2 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {editingContact ? "Save Changes" : "Create Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT GROUP */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">
                {editingGroup ? "Edit Audience Group" : "Create Audience Group"}
              </h3>
              <button
                type="button"
                onClick={() => setIsGroupModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Clients, Kasarani Branch"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief note on who belongs to this segment..."
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="py-2 px-4 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 border border-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
                  className="py-2 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {editingGroup ? "Save Group" : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 1-CLICK CSV UPLOAD WIZARD */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  1-Click Spreadsheet / CSV Upload Wizard
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Upload contacts from Excel or CSV with automated E.164 phone sanitization.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Step 1: File Picker */}
            <div className="p-4 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50/60 text-center space-y-2">
              <svg className="w-8 h-8 text-zinc-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-xs text-zinc-600">
                <label htmlFor="csv_file_input" className="font-bold text-[#581c87] hover:underline cursor-pointer">
                  Click to select CSV spreadsheet
                </label>
                <input
                  id="csv_file_input"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {csvFile && (
                <div className="text-xs font-semibold text-emerald-700">
                  Loaded: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {/* Step 2: Column Mapping */}
            {csvHeaders.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                  Map Spreadsheet Columns
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Phone Number *
                    </label>
                    <select
                      value={phoneColumnIdx}
                      onChange={(e) => setPhoneColumnIdx(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white"
                    >
                      {csvHeaders.map((h, i) => (
                        <option key={i} value={i}>
                          Col {i + 1}: {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      First Name
                    </label>
                    <select
                      value={firstNameColumnIdx}
                      onChange={(e) => setFirstNameColumnIdx(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white"
                    >
                      <option value={-1}>-- Ignore --</option>
                      {csvHeaders.map((h, i) => (
                        <option key={i} value={i}>
                          Col {i + 1}: {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Last Name
                    </label>
                    <select
                      value={lastNameColumnIdx}
                      onChange={(e) => setLastNameColumnIdx(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white"
                    >
                      <option value={-1}>-- Ignore --</option>
                      {csvHeaders.map((h, i) => (
                        <option key={i} value={i}>
                          Col {i + 1}: {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Email
                    </label>
                    <select
                      value={emailColumnIdx}
                      onChange={(e) => setEmailColumnIdx(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white"
                    >
                      <option value={-1}>-- Ignore --</option>
                      {csvHeaders.map((h, i) => (
                        <option key={i} value={i}>
                          Col {i + 1}: {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 3: Target Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Assign to Existing Group
                    </label>
                    <select
                      value={uploadTargetGroup}
                      onChange={(e) => setUploadTargetGroup(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white"
                    >
                      <option value="">-- Do not assign --</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.reference}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Or Create New Group for this Batch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. August Campaign 2026"
                      value={newGroupNameOnUpload}
                      onChange={(e) => setNewGroupNameOnUpload(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300"
                    />
                  </div>
                </div>

                {/* Preview Table */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    First 5 Rows Sample Preview
                  </div>
                  <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-zinc-100 text-zinc-600 font-semibold">
                        <tr>
                          {csvHeaders.map((h, i) => (
                            <th key={i} className="p-2 border-b border-zinc-200">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-mono text-zinc-700">
                        {csvPreview.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 truncate max-w-[150px]">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="py-2 px-4 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 border border-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkUpload}
                disabled={bulkImportMutation.isPending || !csvFile}
                className="py-2 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {bulkImportMutation.isPending ? "Processing Contacts..." : "Start Batch Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION: DELETE CONTACT */}
      {deletingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900">
              Remove Contact {deletingContact.phone_number}?
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to remove <strong>{deletingContact.full_name}</strong> ({deletingContact.phone_number}) from your directory? Historical messaging records will remain preserved in audit logs.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingContact(null)}
                className="py-2 px-3.5 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 border border-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteContact}
                className="py-2 px-4 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION: DELETE GROUP */}
      {deletingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900">
              Delete Group &ldquo;{deletingGroup.name}&rdquo;?
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Deleting this group will remove the segmentation tag from contacts. The individual contacts themselves will <strong>not</strong> be deleted from your directory.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingGroup(null)}
                className="py-2 px-3.5 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 border border-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGroup}
                className="py-2 px-4 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Confirm Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
