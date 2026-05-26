import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://greenforceafrica.com"),

  title: {
    default: "Greenforce Foundation Africa | School Greenhouses, Education & Community Support",
    template: "%s | Greenforce Foundation Africa",
  },

  description:
    "Greenforce Foundation Africa is a West African NGO empowering communities in Ghana and The Gambia. We transform lives through school greenhouses, youth agricultural training, education sponsorships, healthcare outreach, widow support, and dedicated care for the aged and less privileged.",

  keywords: [
    // --- Agriculture & Greenhouses ---
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

  authors: [{ name: "Greenforce Foundation Africa" }],
  creator: "Greenforce Foundation Africa",
  publisher: "Greenforce Foundation Africa",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://greenforceafrica.com",
    siteName: "Greenforce Foundation Africa",
    title: "Greenforce Foundation Africa | Transforming Communities & Education in West Africa",
    description:
      "Empowering youth through school greenhouses, providing education sponsorships, and bringing critical healthcare, widow care, and aged support to the less privileged across Ghana and The Gambia.",
    images: [
      {
        url: "/logo.jfif",
        width: 1200,
        height: 630,
        alt: "Greenforce Foundation Africa Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Greenforce Foundation Africa",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />

        {/* Enhanced Structured Data for Google NGO Analytics */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "Greenforce Foundation Africa",
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

        {/* GTranslate Configuration Setup (14 Strategic Global & Regional Languages) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.gtranslateSettings = {
                "default_language": "en",
                "languages": [
                  "en",     // English (Default)
                  "fr",     // French (Crucial for West African neighbors: Senegal, Togo, Ivory Coast)
                  "zh-CN",  // Chinese Simplified (Major international development partner)
                  "es",     // Spanish (Global reach)
                  "pt",     // Portuguese (Strategic for regional links to Guinea-Bissau & Cape Verde)
                  "ha",     // Hausa (Major West African / Ghanaian trade & community language)
                  "yo",     // Yoruba (Crucial regional West African language)
                  "ig",     // Igbo (Crucial regional West African language)
                  "ar",     // Arabic (Highly relevant for regional ties & North/West African charities)
                  "de",     // German (Strong European donor landscape)
                  "it",     // Italian (Key European humanitarian base)
                  "nl",     // Dutch (High per-capita NGO donations)
                  "ja",     // Japanese (Major international aid partnerships)
                  "ko"      // Korean (Rapidly growing global development stakeholder)
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
        {/* Floating Beautiful Translation Picker Container */}
        <div 
          className="gtranslate_container" 
          style={{ 
            position: 'fixed', 
            bottom: '24px', 
            right: '24px', 
            zIndex: 9999,
          }} 
        />

        <Navbar />
        {children}
        <Footer />

        {/* Core dynamic auto-translating asset layer */}
        <Script 
          src="https://cdn.gtranslate.net/widgets/latest/float.js" 
          strategy="afterInteractive" 
          defer 
        />
      </body>
    </html>
  );
}
