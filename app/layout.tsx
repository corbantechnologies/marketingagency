import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";

const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/GoogleSans-VariableFont.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../public/fonts/GoogleSans-Italic.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#581c87",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ljkmarketingagency.co.ke"),
  title: {
    default: "LJK Marketing Agency | Official Meta WhatsApp Business API & Bulk SMS Gateway Kenya",
    template: "%s | LJK Marketing Agency",
  },
  description:
    "Kenya's premier WhatsApp-First marketing platform and Tier-1 Bulk SMS gateway. Launch interactive WhatsApp flyer broadcasts, one-tap CTA campaigns, and high-deliverability SMS with real-time Blue Ticks and unified wallet billing.",
  keywords: [
    "WhatsApp Business API Kenya",
    "Meta WhatsApp Marketing Kenya",
    "Bulk WhatsApp Sender Nairobi",
    "WhatsApp Marketing Agency Kenya",
    "WhatsApp Business Cloud API",
    "Interactive WhatsApp templates",
    "WhatsApp Blue Ticks tracking",
    "Bulk SMS Kenya",
    "Bulk SMS provider Kenya",
    "SMS gateway API Kenya",
    "Custom Sender ID registration",
    "Safaricom SMS integration",
    "Airtel SMS API",
    "M-Pesa SMS and WhatsApp notifications",
    "Email marketing agency Kenya",
    "Ecommerce marketing automation",
    "LJK Marketing Agency",
    "Corban Technologies LTD",
    "Direct carrier SMS routes",
  ],
  authors: [
    {
      name: "LJK Marketing Agency",
      url: "https://www.ljkmarketingagency.co.ke",
    },
  ],
  creator: "LJK Marketing Agency",
  publisher: "Corban Technologies LTD",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://www.ljkmarketingagency.co.ke",
    siteName: "LJK Marketing Agency",
    title: "LJK Marketing Agency | Meta WhatsApp Business Marketing & Bulk SMS Kenya",
    description:
      "Supercharge customer reach in Kenya with interactive WhatsApp flyer campaigns, 98% open rates, real-time Blue Ticks tracking, and Tier-1 Bulk SMS fallback.",
    images: [
      {
        url: "/ljk-logo.svg",
        width: 1200,
        height: 630,
        alt: "LJK Marketing Agency - Meta WhatsApp Business & Bulk SMS Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LJK Marketing Agency | Meta WhatsApp Business & Bulk SMS Infrastructure",
    description:
      "Direct Meta WhatsApp Cloud API broadcasts with rich flyers & CTA buttons, plus high-throughput Tier-1 SMS routes across Kenya and globally.",
    images: ["/ljk-logo.svg"],
    creator: "@ljkmarketing",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/ljk-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MarketingAgency",
  name: "LJK Marketing Agency",
  alternateName: "Corban Technologies LTD",
  url: "https://www.ljkmarketingagency.co.ke",
  logo: "https://www.ljkmarketingagency.co.ke/ljk-logo.svg",
  image: "https://www.ljkmarketingagency.co.ke/ljk-logo.svg",
  description:
    "LJK Marketing Agency is Kenya's premier WhatsApp-First marketing platform and Tier-1 Bulk SMS gateway, delivering direct Meta Cloud API messaging, custom alphanumeric SMS sender IDs, and lifecycle revenue automation.",
  priceRange: "KSh / $$$",
  telephone: "+254-700-000000",
  email: "growth@ljkmarketingagency.co.ke",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-1.2921",
    longitude: "36.8219",
  },
  sameAs: [
    "https://linkedin.com/company/ljk-marketing-agency",
    "https://twitter.com/ljkmarketing",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "WhatsApp Business & Bulk SMS Marketing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Official Meta WhatsApp Business Cloud API & Interactive Marketing",
          description: "Direct Meta Cloud API messaging with rich image/PDF flyers, interactive CTA buttons, 98% open rates, and real-time Blue Ticks delivery tracking in Kenya.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Enterprise Bulk SMS Gateway & Custom Sender ID",
          description: "High-throughput Tier-1 direct carrier SMS routing, custom alphanumeric Sender IDs, 2-way messaging, and real-time DLR analytics in Kenya and worldwide.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Transactional OTP & Omnichannel Verification API",
          description: "Low-latency (<2.4s) OTP verification over WhatsApp and SMS with REST API and webhook callback support.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Unified Credit Wallet & Multi-Channel Campaigns",
          description: "Unified pay-as-you-go credit wallet supporting 1 Credit = 1 SMS and 2 Credits = 1 WhatsApp marketing message.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSans.variable} scroll-smooth antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col selection:bg-[#581c87] selection:text-white">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#18181b",
              color: "#ffffff",
              border: "1px solid #27272a",
              fontSize: "13px",
              borderRadius: "8px",
              padding: "10px 16px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            },
            success: {
              iconTheme: {
                primary: "#a855f7",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
        <NextAuthProvider>
          <TanstackQueryProvider>
            {children}
          </TanstackQueryProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
