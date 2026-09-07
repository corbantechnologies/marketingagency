"use client";

import React, { Suspense } from "react";
import BulkSMSBroadcastPage from "@/app/(private)/business/sms/broadcast/page";

export default function BusinessCampaignBroadcastPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Loading campaign composer...</div>}>
      <BulkSMSBroadcastPage />
    </Suspense>
  );
}
