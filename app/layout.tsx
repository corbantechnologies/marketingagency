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
    default: "LJK Marketing Agency | Strategic Growth & Performance Marketing",
    template: "%s | LJK Marketing Agency",
  },
  description:
    "LJK Marketing Agency delivers high-impact growth engineering, performance paid media, precision SEO, conversion rate optimization, and lifecycle automation to scale ambitious brands.",
  keywords: [
    "LJK Marketing Agency",
    "growth marketing agency",
    "performance marketing",
    "digital marketing agency",
    "paid advertising management",
    "technical SEO services",
    "conversion rate optimization",
    "omnichannel marketing",
    "e-commerce growth agency",
    "B2B SaaS marketing",
    "marketing automation",
    "funnel optimization",
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
    title: "LJK Marketing Agency | Strategic Growth & Performance Marketing",
    description:
      "Scale your revenue with battle-tested performance media, technical SEO, and conversion optimization built for high-growth brands.",
    images: [
      {
        url: "/ljk-logo.svg",
        width: 1200,
        height: 630,
        alt: "LJK Marketing Agency - Growth Engineering & Performance Marketing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LJK Marketing Agency | Strategic Growth & Performance Marketing",
    description:
      "Data-driven marketing systems that turn ad spend into predictable, high-margin revenue.",
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
    "LJK Marketing Agency is a premier performance marketing and growth engineering firm specializing in paid media, SEO, CRO, and revenue systems.",
  priceRange: "$$$$",
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
    "https://instagram.com/ljkmarketing",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Marketing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Paid Media & Performance Advertising",
          description: "High-ROAS campaign management on Meta, Google, TikTok, and LinkedIn.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Search Engine Optimization (SEO)",
          description: "Technical SEO, high-intent content strategy, and authority link acquisition.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Conversion Rate Optimization (CRO)",
          description: "Data-driven A/B testing, funnel optimization, and user journey optimization.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lifecycle & Retention Automation",
          description: "Omni-channel email, SMS, and CRM workflows for compounding customer LTV.",
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
