import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | LJK Marketing Agency Kenya",
  description:
    "Privacy policy and data protection framework for LJK Marketing Agency (Nairobi, Kenya) under the Kenya Data Protection Act 2019.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 31, 2026";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-zinc-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
              Data Privacy & Security Framework
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs font-normal text-zinc-500">
              LJK Marketing Agency · Nairobi, Kenya · Compliant with the Kenya Data Protection Act 2019 · Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Legal Content */}
          <div className="space-y-8 text-xs sm:text-sm font-normal text-zinc-700 leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                1. Introduction & Overview
              </h2>
              <p>
                <strong>LJK Marketing Agency</strong> (&ldquo;LJK&rdquo;, &ldquo;Company&rdquo;, &ldquo;We&rdquo;,
                &ldquo;Us&rdquo;, or &ldquo;Our&rdquo;), located in Nairobi, Kenya, operates an enterprise
                telecommunications and marketing automation platform accessible via{" "}
                <Link href="/" className="text-[#581c87] font-semibold hover:underline">
                  https://www.ljkmarketingagency.co.ke
                </Link>.
              </p>
              <p>
                We are committed to protecting the privacy, confidentiality, and security of personal data entrusted to
                us in strict accordance with the <strong>Kenya Data Protection Act 2019</strong>, the regulations
                promulgated by the Office of the Data Protection Commissioner (ODPC), and international best practices.
              </p>
            </section>

            {/* Section 2 - Roles */}
            <section className="space-y-3 p-4 bg-purple-50/50 border border-purple-100 rounded">
              <h2 className="text-base font-semibold text-[#581c87]">
                2. Roles: Data Controller vs. Data Processor
              </h2>
              <p>
                To ensure full legal clarity under the Kenya Data Protection Act 2019:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-700 text-xs sm:text-sm">
                <li>
                  <strong>LJK as a Data Controller:</strong> LJK acts as a Data Controller with respect to the personal
                  data of our registered business users (e.g. your account name, business email, phone number, M-PESA
                  transaction codes, and login credentials).
                </li>
                <li>
                  <strong>LJK as a Data Processor:</strong> When you upload customer databases, phone numbers, or
                  recipient contact lists via CSV/Excel to send SMS or Email campaigns, <strong>You (the Client) remain
                  the sole Data Controller</strong>, and <strong>LJK acts strictly as a Data Processor</strong> executing
                  dispatches upon your instructions.
                </li>
              </ul>
            </section>

            {/* Section 3 - CRITICAL CONFIDENTIALITY GUARANTEE */}
            <section className="space-y-3 p-4 bg-zinc-50 border border-zinc-200 rounded">
              <h2 className="text-base font-semibold text-zinc-900">
                3. Absolute Confidentiality of Client Contact Databases (Zero Data Selling)
              </h2>
              <p className="font-semibold text-zinc-900">
                We maintain an absolute, ironclad commitment regarding your uploaded contact databases:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
                <li>
                  <strong>Zero Commercial Monetization:</strong> We <strong>NEVER sell, rent, lease, share, trade, or
                  monetize</strong> your contact lists, recipient phone numbers, or subscriber databases to any third
                  party or advertiser under any circumstance.
                </li>
                <li>
                  <strong>No Cross-Account Aggregation:</strong> Your contacts remain strictly isolated within your
                  private workspace and are never merged or matched with other clients&apos; databases.
                </li>
                <li>
                  <strong>Purpose-Bound Processing:</strong> Contact lists are processed exclusively for the mechanical
                  transmission of your authorized SMS and Email campaigns, delivery receipt (DLR) tracking, and
                  opt-out suppression.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                4. Categories of Data Collected
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                <li>
                  <strong>Account Registration Data:</strong> Full Name, business name, work email address, telephone
                  number, password hash, and optional tax PIN / business registration documents.
                </li>
                <li>
                  <strong>Financial & Transaction Telemetry:</strong> M-PESA transaction references, billing history,
                  and credit allocation ledger records (we do not store raw banking passwords or PINs).
                </li>
                <li>
                  <strong>Campaign & Transmission Data:</strong> SMS message body, recipient telephone numbers, email
                  headers, delivery timestamps, carrier delivery receipts (DLR), bounce codes, and link click statistics.
                </li>
                <li>
                  <strong>Technical & Device Data:</strong> IP address, browser type, operating system, and access
                  timestamps for system security, fraud prevention, and session management.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                5. Third-Party Telecom Sub-Processors
              </h2>
              <p>
                To deliver SMS and Email messages across Kenyan and global networks, we route payloads through licensed
                infrastructure partners and mobile network operators:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
                <li>
                  <strong>Licensed Mobile Network Operators:</strong> Safaricom PLC, Airtel Kenya, and Telkom Kenya
                  for direct SMS termination and handset delivery.
                </li>
                <li>
                  <strong>Email Delivery Sub-Processors:</strong> AWS Simple Email Service (SES) and Resend for
                  authenticated SMTP transmission.
                </li>
                <li>
                  <strong>Payment Gateways:</strong> Safaricom Daraja M-PESA API for real-time mobile wallet top-ups.
                </li>
              </ul>
              <p className="text-xs text-zinc-500">
                All sub-processors are bound by strict data protection agreements and telecom secrecy laws.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                6. Data Security & Storage Safeguards
              </h2>
              <p>
                We implement robust technical and organizational security measures:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
                <li>TLS 1.3 encryption in transit for all web dashboard, API, and webhook traffic.</li>
                <li>AES-256 encryption at rest for database records and contact tables.</li>
                <li>Strict role-based access control (RBAC) ensuring only authorized administrators can access system infrastructure.</li>
                <li>Automated threat monitoring and vulnerability scrubbing.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                7. Your Rights Under the Kenya Data Protection Act 2019
              </h2>
              <p>
                Data subjects hold the following rights under Kenyan law:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
                <li><strong>Right to be Informed:</strong> To know how your personal data is collected and processed.</li>
                <li><strong>Right of Access:</strong> To request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> To update or correct inaccurate or incomplete data.</li>
                <li><strong>Right to Erasure:</strong> To request the permanent deletion of your account and uploaded contact lists.</li>
                <li><strong>Right to Object & Opt-Out:</strong> To opt out of commercial communications at any time.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-3 pt-4 border-t border-zinc-200">
              <h2 className="text-base font-semibold text-zinc-900">
                8. Contact the Data Protection Officer (DPO)
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, wish to exercise your data subject rights, or
                require a data processing addendum (DPA), please contact our Data Protection Officer:
              </p>
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 space-y-1">
                <div><strong>LJK Marketing Agency</strong></div>
                <div>Attn: Data Protection Officer (DPO) · Nairobi, Kenya</div>
                <div>Email: <a href="mailto:privacy@ljkmarketingagency.co.ke" className="text-[#581c87] hover:underline">privacy@ljkmarketingagency.co.ke</a> / <a href="mailto:support@ljkmarketingagency.co.ke" className="text-[#581c87] hover:underline">support@ljkmarketingagency.co.ke</a></div>
                <div>Physical Office: Nairobi, Kenya</div>
              </div>
            </section>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
