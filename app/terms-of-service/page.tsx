import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | LJK Marketing Agency Kenya",
  description:
    "Terms of Service, acceptable use guidelines, and telecom compliance policies for LJK Marketing Agency (Nairobi, Kenya).",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "August 31, 2026";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-zinc-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
              Legal & Compliance Framework
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight mb-2">
              Terms of Service
            </h1>
            <p className="text-xs font-normal text-zinc-500">
              LJK Marketing Agency · Nairobi, Kenya · Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Legal Content */}
          <div className="space-y-8 text-xs sm:text-sm font-normal text-zinc-700 leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                1. Acceptance of Terms & Service Scope
              </h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
                (whether personally or on behalf of an enterprise, business, school, or organization, hereinafter
                referred to as &ldquo;Client&rdquo;, &ldquo;User&rdquo;, or &ldquo;You&rdquo;) and <strong>LJK Marketing
                Agency</strong> (&ldquo;LJK&rdquo;, &ldquo;Company&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo;, or
                &ldquo;Our&rdquo;), located in Nairobi, Kenya.
              </p>
              <p>
                By creating an account, accessing our dashboard, integrating via our APIs/SMPP protocols, or
                purchasing SMS/Email credit bundles on <Link href="/" className="text-[#581c87] font-semibold hover:underline">https://www.ljkmarketingagency.co.ke</Link>,
                you explicitly agree to comply with and be bound by these Terms and all applicable laws and regulations
                of the Republic of Kenya.
              </p>
            </section>

            {/* Section 2 - CRITICAL PROTECTION: Sender ID */}
            <section className="space-y-3 p-4 bg-purple-50/50 border border-purple-100 rounded">
              <h2 className="text-base font-semibold text-[#581c87]">
                2. Custom Alphanumeric Sender ID Registration & Total Disclaimer of Liability
              </h2>
              <p className="text-zinc-800 font-medium">
                Please read this section carefully before applying for or utilizing branded Alphanumeric Sender IDs:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-700 text-xs sm:text-sm">
                <li>
                  <strong>Regulatory & Carrier Authority:</strong> Custom Alphanumeric Sender IDs (e.g. brand names up
                  to 11 characters) are subject to mandatory regulatory oversight, vetting, and approval by the{" "}
                  <strong>Communications Authority of Kenya (CAK)</strong> and individual Mobile Network Operators
                  (including <strong>Safaricom PLC, Airtel Kenya, and Telkom Kenya</strong>).
                </li>
                <li>
                  <strong>Zero Liability for Delays, Rejections, or Revocations:</strong> LJK Marketing Agency acts
                  strictly as a technical intermediary and processing agent. <strong>LJK Marketing Agency shall bear NO
                  LIABILITY whatsoever</strong> for any delays, rejections, suspensions, blacklisting, or revocations
                  of a Sender ID by telecom regulators, mobile network operators, or government bodies for any reason.
                </li>
                <li>
                  <strong>Non-Refundable Vetting Fees:</strong> All administrative, verification, and vetting fees paid
                  toward Sender ID applications are strictly non-refundable regardless of the approval outcome.
                </li>
                <li>
                  <strong>Trademark & Brand Ownership:</strong> The Client warrants that they possess valid legal rights,
                  trademark authorization, or legitimate business registration documents for any requested Sender ID.
                  Impersonation, financial deception, and unauthorized use of protected brand names are strictly
                  prohibited and will result in immediate permanent account termination.
                </li>
              </ul>
            </section>

            {/* Section 3 - CRITICAL PROTECTION: Spam & Opt-In */}
            <section className="space-y-3 p-4 bg-zinc-50 border border-zinc-200 rounded">
              <h2 className="text-base font-semibold text-zinc-900">
                3. Anti-Spam Policy, Mandatory Opt-In Consent & Carrier Blocking
              </h2>
              <p>
                LJK Marketing Agency enforces a zero-tolerance policy against unsolicited commercial communications
                (&ldquo;Spam&rdquo;), fraudulent messaging, and unauthorized contact scraping:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-700 text-xs sm:text-sm">
                <li>
                  <strong>Client as Sole Data Controller:</strong> Under the <strong>Kenya Data Protection Act 2019</strong>{" "}
                  and CAK Consumer Protection Guidelines, the Client acts as the sole Data Controller and warrants that
                  every recipient on their contact list has provided verifiable, explicit opt-in consent to receive
                  messages.
                </li>
                <li>
                  <strong>Opt-Out Mechanism:</strong> All promotional broadcasts must contain a clear, functional opt-out
                  instruction (e.g. &ldquo;Stop*456*9*5#&rdquo; or a clear unsubscribe link).
                </li>
                <li>
                  <strong>Carrier Blacklisting & Blocking Disclaimer:</strong> If a Client dispatches spam, misleading
                  content, unlicensed betting/crypto promotions, or aggressive messaging that triggers carrier spam filters,
                  recipient handset reports, or operator network suspensions, <strong>LJK Marketing Agency holds ZERO
                  LIABILITY for blocked messages, undelivered queues, or suspended telecom routes</strong>.
                </li>
                <li>
                  <strong>Immediate Account Termination:</strong> LJK reserves the unconditional right to immediately
                  suspend or permanently terminate any client account found in violation of anti-spam rules without prior
                  notice or refund of remaining wallet balances.
                </li>
              </ul>
            </section>

            {/* Section 4 - CRITICAL PROTECTION: Full Indemnity */}
            <section className="space-y-3 p-4 bg-purple-50/50 border border-purple-200 rounded">
              <h2 className="text-base font-semibold text-[#581c87]">
                4. Client Indemnification of LJK Marketing Agency
              </h2>
              <p className="text-zinc-800">
                To the fullest extent permitted by Kenyan law, the Client agrees to <strong>defend, indemnify, and hold
                harmless LJK Marketing Agency</strong>, its directors, owners, engineers, employees, agents, and
                licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, regulatory
                fines, and legal fees arising out of or related to:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-zinc-700 text-xs sm:text-sm">
                <li>Any campaign content, text copy, attachments, or links transmitted by the Client;</li>
                <li>Violations of the Kenya Data Protection Act 2019 or lack of recipient opt-in consent;</li>
                <li>Fines or enforcement penalties imposed by the Office of the Data Protection Commissioner (ODPC) or the Communications Authority of Kenya (CAK);</li>
                <li>Infringement of third-party intellectual property, trademark, or privacy rights;</li>
                <li>Breach of any warranty or representation contained in these Terms.</li>
              </ol>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                5. Telecom Routes, Latency & Service Availability
              </h2>
              <p>
                LJK connects directly to Tier-1 telecom routes and reputable cloud messaging infrastructure. While we
                maintain high platform availability:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-700">
                <li>
                  Delivery speeds and handset receipt depend on mobile carrier availability, recipient roaming status,
                  device storage, and telecom maintenance windows.
                </li>
                <li>
                  LJK does not guarantee 100% receipt for handsets that are turned off, out of network coverage, or
                  flagged as invalid by carrier routing tables.
                </li>
                <li>
                  LJK reserves the right to perform scheduled system maintenance with reasonable advance notice.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                6. Commercial Terms, M-PESA Billing & Non-Refundability
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                <li>
                  <strong>Prepaid Credit Wallet:</strong> SMS and Email units purchased via M-PESA STK push, card, or
                  bank transfer are credited to your active wallet balance.
                </li>
                <li>
                  <strong>Non-Expiring Units:</strong> Purchased prepaid units do not expire as long as the account
                  remains active and in good standing.
                </li>
                <li>
                  <strong>Non-Refundable Purchases:</strong> All credit purchases, subscription bundles, and setup fees
                  are strictly non-refundable once provisioned to your account ledger.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-zinc-900">
                7. Governing Law & Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by, interpreted, and construed in accordance with the <strong>laws of the
                Republic of Kenya</strong>. Any legal action, suit, or proceeding arising out of or relating to these
                Terms shall be instituted exclusively in the competent courts located in <strong>Nairobi, Kenya</strong>.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3 pt-4 border-t border-zinc-200">
              <h2 className="text-base font-semibold text-zinc-900">
                8. Legal & Compliance Contact
              </h2>
              <p>
                For compliance inquiries, regulatory disclosures, or legal notices, please reach out directly:
              </p>
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-700 space-y-1">
                <div><strong>LJK Marketing Agency</strong></div>
                <div>Legal & Compliance Desk · Nairobi, Kenya</div>
                <div>Email: <a href="mailto:support@ljkmarketingagency.co.ke" className="text-[#581c87] hover:underline">support@ljkmarketingagency.co.ke</a></div>
                <div>Support Desk Form: <Link href="/contact" className="text-[#581c87] hover:underline">https://www.ljkmarketingagency.co.ke/contact</Link></div>
              </div>
            </section>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
