import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  metadataBase: new URL("https://ljkmarketingagency.com"),
  title: {
    default: "LJK Marketing Agency | Bulk SMS, Email Marketing & Growth Engineering",
    template: "%s | LJK Marketing Agency",
  },
  description:
    "LJK Marketing Agency provides high-deliverability Bulk SMS gateways, enterprise Email Marketing, lifecycle automation, and performance marketing systems to scale customer acquisition and retention.",
  keywords: [
    "Bulk SMS marketing",
    "Email marketing agency",
    "SMS gateway API",
    "transactional SMS",
    "promotional bulk SMS",
    "email deliverability services",
    "marketing automation",
    "LJK Marketing Agency",
    "lifecycle email campaigns",
    "custom sender ID SMS",
    "omnichannel marketing",
    "high volume messaging",
  ],
  authors: [{ name: "LJK Marketing Agency", url: "https://ljkmarketingagency.com" }],
  creator: "LJK Marketing Agency",
  publisher: "LJK Marketing Agency",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
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
    locale: "en_US",
    url: "https://ljkmarketingagency.com",
    siteName: "LJK Marketing Agency",
    title: "LJK Marketing Agency | Bulk SMS, Email Marketing & Growth Engineering",
    description:
      "Enterprise Bulk SMS gateway, high-inbox email marketing, and automated customer communication engineered for maximum ROI.",
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
      "High-throughput Tier-1 SMS routes, inbox-guaranteed email marketing, and automated customer retention workflows.",
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
  url: "https://ljkmarketingagency.com",
  logo: "https://ljkmarketingagency.com/ljk-logo.svg",
  image: "https://ljkmarketingagency.com/ljk-logo.svg",
  description:
    "LJK Marketing Agency is an enterprise Bulk SMS gateway provider, email marketing powerhouse, and growth agency offering high-deliverability messaging and automated marketing systems.",
  priceRange: "$$$",
  telephone: "+1-800-555-0199",
  email: "growth@ljkmarketingagency.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
    addressRegion: "NY",
    addressCountry: "US",
  },
  sameAs: [
    "https://linkedin.com/company/ljk-marketing-agency",
    "https://twitter.com/ljkmarketing",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Messaging & Marketing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Enterprise Bulk SMS Gateway",
          description: "High-throughput Tier-1 SMS routing with custom sender ID, 2-way messaging, and real-time DLR analytics.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "High-Inbox Email Marketing",
          description: "Dedicated IP warmup, automated email workflows, spam shield optimization, and subscriber lifecycle management.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lifecycle & Retention Automation",
          description: "Behavior-triggered multi-channel SMS/Email flows for high-converting customer retention.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Subscriber Acquisition & Paid Ads",
          description: "Full-funnel traffic generation to rapidly scale your SMS and email customer databases.",
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
        {children}
      </body>
    </html>
  );
}
