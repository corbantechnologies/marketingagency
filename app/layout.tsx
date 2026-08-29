import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";

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
    default: "LJK Marketing Agency | Bulk SMS Provider, Email Marketing & Growth Systems",
    template: "%s | LJK Marketing Agency",
  },
  description:
    "LJK Marketing Agency is Kenya's leading high-deliverability Bulk SMS gateway, enterprise Email Marketing, and revenue automation agency. We provide direct Tier-1 telecom routes, custom Sender IDs, high-inbox email campaigns, and developer APIs.",
  keywords: [
    "Bulk SMS Kenya",
    "Bulk SMS provider Kenya",
    "Bulk SMS marketing",
    "SMS gateway API Kenya",
    "Email marketing agency Kenya",
    "Transactional SMS gateway",
    "Promotional bulk SMS",
    "Custom Sender ID registration",
    "Safaricom SMS integration",
    "Airtel SMS API",
    "Email deliverability services",
    "Klaviyo marketing automation",
    "LJK Marketing Agency",
    "High volume messaging Africa",
    "Direct carrier SMS routes",
  ],
  authors: [
    {
      name: "LJK Marketing Agency",
      url: "https://www.ljkmarketingagency.co.ke",
    },
  ],
  creator: "LJK Marketing Agency",
  publisher: "LJK Marketing Agency",
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
    title: "LJK Marketing Agency | Bulk SMS Provider, Email Marketing & Growth Systems",
    description:
      "Enterprise Bulk SMS gateway with 99.4% delivery, custom branded Sender ID, high-inbox email infrastructure, and automated revenue campaigns across Kenya and globally.",
    images: [
      {
        url: "/ljk-logo.svg",
        width: 1200,
        height: 630,
        alt: "LJK Marketing Agency - Bulk SMS & Email Marketing Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LJK Marketing Agency | Bulk SMS & Email Marketing Infrastructure",
    description:
      "High-throughput Tier-1 SMS routes, inbox-guaranteed email marketing, and automated customer communication systems.",
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
  url: "https://www.ljkmarketingagency.co.ke",
  logo: "https://www.ljkmarketingagency.co.ke/ljk-logo.svg",
  image: "https://www.ljkmarketingagency.co.ke/ljk-logo.svg",
  description:
    "LJK Marketing Agency is a premier Bulk SMS provider, email marketing powerhouse, and growth marketing agency delivering direct carrier telecom routes, developer APIs, and lifecycle automation.",
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
    name: "Bulk SMS & Digital Marketing Services",
    itemListElement: [
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
          name: "Transactional OTP & Alert SMS API",
          description: "Low-latency (<2.4s) OTP verification and transactional messaging gateway with REST API and SMPP 3.4 connectivity.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "High-Inbox Email Marketing & IP Warming",
          description: "Dedicated IP warmup, automated email workflows, SPF/DKIM/DMARC optimization, and subscriber lifecycle management.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lifecycle & Retention Automation",
          description: "Behavior-triggered multi-channel SMS and Email sequences for cart recovery and customer repeat retention.",
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
