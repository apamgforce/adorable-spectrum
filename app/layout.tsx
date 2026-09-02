import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://greenforceafrica.com"),

  title: {
    default:
      "VTO Greenforce Foundation Africa | School Greenhouses, Education & Community Support",
    template: "%s | VTO Greenforce Foundation Africa",
  },

  description:
    "VTO Greenforce Foundation Africa is a West African NGO empowering communities in Ghana and The Gambia. We transform lives through school greenhouses, youth agricultural training, education sponsorships, healthcare outreach, widow support, and dedicated care for the aged and less privileged.",

  keywords: [
    // --- Agriculture & Greenhouses ---
    "VTO Greenforce Foundation Africa",
    "Greenforce Foundation Africa",
    "NGO in Ghana",
    "Gambia NGO agriculture",
    "school greenhouse Ghana",
    "youth agriculture training Apam",
    "Gomoa West development NGO",
    "community farming Ghana",
    "school farming program Ghana",
    "hostel farming Ghana",

    // --- Education & Sponsorships ---
    "education sponsorship Ghana NGO",
    "child education support West Africa",
    "school charity Ghana",
    "sponsor a student Ghana",

    // --- Social Welfare, Aged Care, Widows ---
    "support for widows Ghana",
    "aged care charity West Africa",
    "helping less privileged in Ghana",
    "healthcare outreach NGO Africa",
    "social welfare community support charity",
    "Christian NGO Ghana",
  ],

  authors: [{ name: "VTO Greenforce Foundation Africa" }],
  creator: "VTO Greenforce Foundation Africa",
  publisher: "VTO Greenforce Foundation Africa",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://greenforceafrica.com",
    siteName: "VTO Greenforce Foundation Africa",
    title:
      "VTO Greenforce Foundation Africa | Transforming Communities & Education in West Africa",
    description:
      "Empowering youth through school greenhouses, providing education sponsorships, and bringing critical healthcare, widow care, and aged support to the less privileged across Ghana and The Gambia.",
    images: [
      {
        url: "/logo.jfif",
        width: 1200,
        height: 630,
        alt: "VTO Greenforce Foundation Africa Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VTO Greenforce Foundation Africa",
    description:
      "School greenhouses, youth farming, education sponsorships, widow support, and aged care transforming lives in Ghana & The Gambia.",
    images: ["/logo.jfif"],
  },

  icons: {
    icon: "/logo.jfif",
    shortcut: "/logo.jfif",
    apple: "/logo.jfif",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,0..40,300&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "VTO Greenforce Foundation Africa",
              url: "https://greenforceafrica.com",
              logo: "https://greenforceafrica.com/logo.jfif",
              description:
                "West African NGO dedicated to school greenhouses, sustainable youth agriculture training, student education sponsorships, healthcare outreach, and vital welfare support for widows, the aged, and less privileged communities.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Apam",
                addressRegion: "Gomoa West",
                addressCountry: "Ghana",
              },
              areaServed: ["Ghana", "The Gambia", "West Africa"],
              knowsAbout: [
                "Sustainable Agriculture",
                "Youth Education Sponsorships",
                "Elderly and Aged Community Support",
                "Widow Welfare Programs",
                "Community Healthcare Outreach",
              ],
              foundingDate: "2010",
              sameAs: [],
            }),
          }}
        />

        {/* GTranslate Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.gtranslateSettings = {
                "default_language": "en",
                "languages": [
                  "en",
                  "fr",
                  "zh-CN",
                  "es",
                  "pt",
                  "ar",
                  "de",
                  "it",
                  "nl",
                  "ja",
                  "ko"
                ],
                "wrapper_selector": ".gtranslate_container",
                "select_language_style": "minimal",
                "flag_size": 20,
                "flag_style": "2d",
                "alt_flags": { "en": "usa" }
              }
            `,
          }}
        />
      </head>

      <body className="antialiased">
        {/* Floating Translation Picker */}
        <div
          className="gtranslate_container"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
          }}
        />

        <Navbar />
        {children}
        <Footer />

        {/* Core GTranslate Asset */}
        <Script
          src="https://cdn.gtranslate.net/widgets/latest/float.js"
          strategy="afterInteractive"
          defer
        />
      </body>
    </html>
  );
}
