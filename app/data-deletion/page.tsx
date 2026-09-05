import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "User Data Deletion Instructions | LJK Marketing Agency Kenya",
  description:
    "Official user data deletion instructions and privacy rights under the Kenya Data Protection Act 2019 and Meta Platforms Developer Policy.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/data-deletion",
  },
};

export default function DataDeletionPage() {
  const lastUpdated = "September 5, 2026";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-zinc-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
              Data Privacy &amp; Statutory Rights
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
              User Data Deletion Instructions
            </h1>
            <p className="text-xs font-normal text-zinc-500">
              LJK Marketing Agency &bull; Corban Technologies LTD &bull; Compliant with Kenya Data Protection Act 2019 &amp; Meta Developer Policies &bull; Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Core Body */}
          <div className="space-y-8 text-xs sm:text-sm font-normal text-zinc-700 leading-relaxed">
            {/* 1. Overview */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                1. Overview of Data Subject Rights
              </h2>
              <p>
                In compliance with the <strong>Kenya Data Protection Act 2019 (Section 40: Right to Erasure)</strong>, GDPR regulations, and the <strong>Meta Platforms Platform Terms</strong>, LJK Marketing Agency (operated by Corban Technologies LTD) provides clear, accessible, and automated mechanisms for users, business clients, and message recipients to request the complete deletion of their personal data.
              </p>
              <p>
                When a valid data deletion request is submitted, we permanently purge all associated personal identifiers (name, telephone number, email, message body history, and contact list entries) from our active database systems and scheduled backup archives within statutory timelines.
              </p>
            </section>

            {/* 2. Three Easy Pathways to Delete Your Data */}
            <section className="space-y-4 p-5 bg-zinc-50 border border-zinc-200 rounded-xl">
              <h2 className="text-base font-semibold text-zinc-900">
                2. How to Request Data Deletion
              </h2>
              <p className="text-zinc-800">
                Choose the method that corresponds to your interaction with our platform:
              </p>

              <div className="space-y-4 pt-2">
                {/* Method A */}
                <div className="p-4 bg-white border border-zinc-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#581c87] uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-[#581c87] flex items-center justify-center font-bold text-[10px]">
                      A
                    </span>
                    <span>For End-Consumers &amp; Message Recipients (Opt-Out / Erasure)</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    If you received an SMS or WhatsApp broadcast sent through our infrastructure and wish to permanently remove your number from future broadcasts:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-700">
                    <li>
                      <strong>WhatsApp Messages:</strong> Simply reply <strong>&ldquo;STOP&rdquo;</strong> or <strong>&ldquo;UNSUBSCRIBE&rdquo;</strong> to the incoming WhatsApp chat. Our automated Meta Cloud API webhook will immediately flag your phone number as unsubscribed, suppress future dispatches, and delete active queue records.
                    </li>
                    <li>
                      <strong>SMS Messages:</strong> Dial the national opt-out code <strong>*456*9*5#</strong> (Safaricom) or reply <strong>&ldquo;STOP&rdquo;</strong> to promotional alerts.
                    </li>
                  </ul>
                </div>

                {/* Method B */}
                <div className="p-4 bg-white border border-zinc-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#581c87] uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-[#581c87] flex items-center justify-center font-bold text-[10px]">
                      B
                    </span>
                    <span>For Business Clients &amp; Workspace Account Owners (Self-Service)</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    If you are a registered business user and wish to delete contacts, uploaded CSV spreadsheets, or your entire tenant account:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-xs text-zinc-700">
                    <li>Log into your workspace at <Link href="/auth/login" className="text-[#581c87] font-semibold hover:underline">https://www.ljkmarketingagency.co.ke/auth/login</Link>.</li>
                    <li>Navigate to <strong>Contacts</strong> &rarr; select the group or individual contact &rarr; click <strong>Delete</strong>. This permanently removes the record from your workspace.</li>
                    <li>To delete your entire account and business profile, go to <strong>Settings</strong> &rarr; <strong>Security &amp; Privacy</strong> &rarr; click <strong>Delete Business Account</strong>.</li>
                  </ol>
                </div>

                {/* Method C */}
                <div className="p-4 bg-white border border-zinc-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#581c87] uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-[#581c87] flex items-center justify-center font-bold text-[10px]">
                      C
                    </span>
                    <span>Official Written Request to the Data Protection Officer (DPO)</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    You can submit a formal data erasure request directly to our Data Protection &amp; Compliance Office.
                  </p>
                  <div className="p-3 bg-purple-50/60 border border-purple-200 rounded text-xs text-purple-950 space-y-1">
                    <div><strong>Data Protection Officer (DPO)</strong> &bull; Corban Technologies LTD / LJK Marketing Agency</div>
                    <div>Email: <a href="mailto:privacy@ljkmarketingagency.co.ke" className="text-[#581c87] font-semibold hover:underline">privacy@ljkmarketingagency.co.ke</a> or <a href="mailto:support@ljkmarketingagency.co.ke" className="text-[#581c87] font-semibold hover:underline">support@ljkmarketingagency.co.ke</a></div>
                    <div>Subject Line: <code>[Data Deletion Request] - Phone / Account Reference</code></div>
                    <div>Physical Address: Nairobi, Kenya</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Information Required in a Written Request */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                3. Information Required for Verification
              </h2>
              <p>
                To prevent fraudulent deletion requests and safeguard consumer records, written deletion requests must include:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-700">
                <li>Your full legal name or registered business name.</li>
                <li>The specific telephone number (in Kenyan format: <code>+254 7XX XXX XXX</code>) or email address to be purged.</li>
                <li>The nature of the interaction (e.g. &ldquo;Recipient of promotional campaign&rdquo; or &ldquo;Former business workspace owner&rdquo;).</li>
              </ul>
            </section>

            {/* 4. Deletion Timelines & SLA */}
            <section className="space-y-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
              <h2 className="text-base font-semibold text-emerald-950">
                4. Statutory Timelines &amp; Confirmation SLA
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-zinc-800 text-xs sm:text-sm">
                <li>
                  <strong>Immediate Production Purge:</strong> Unsubscribe actions taken via WhatsApp (&ldquo;STOP&rdquo;) or in-app dashboard deletion execute in real-time within <strong>0 to 60 seconds</strong>.
                </li>
                <li>
                  <strong>Statutory Erasure Timeline:</strong> Formal written requests are acknowledged within <strong>48 business hours</strong> and fully finalized within <strong>30 calendar days</strong> pursuant to the Kenya Data Protection Act 2019.
                </li>
                <li>
                  <strong>Confirmation Reference:</strong> Upon completion, a unique Confirmation Clearance Code is provided for your audit records.
                </li>
              </ul>
            </section>

            {/* 5. Statutory Retention Exceptions */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                5. Statutory Financial Retention Exceptions
              </h2>
              <p>
                Pursuant to Kenyan tax law (Kenya Revenue Authority Tax Procedures Act) and telecom financial regulations, anonymized M-PESA billing transaction codes and tax receipts must be retained for statutory audit periods. These records contain zero marketing contact data and cannot be utilized for message dispatches.
              </p>
            </section>

            {/* 6. Quick Contact Card */}
            <section className="pt-6 border-t border-zinc-200">
              <div className="p-4 bg-zinc-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Need help with your data privacy?</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Our compliance and legal desk is available to assist you.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/contact"
                    className="py-2 px-4 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-lg transition-colors"
                  >
                    Open Support Desk &rarr;
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
