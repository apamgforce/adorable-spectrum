import type { Metadata } from "next";
import Script from "next/script"; // <-- Imported for optimized script loading
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://greenforceafrica.com"),

  title: {
    default: "Greenforce Foundation Africa | School Greenhouses & Youth Agriculture in Ghana",
    template: "%s | Greenforce Foundation Africa",
  },

  description:
    "Greenforce Foundation Africa is a West Africa NGO based in Ghana and The Gambia. We build school greenhouses, train youth in agriculture, support education sponsorships, healthcare outreach, widow and aged care, sports discipline, and evangelism programs across Apam and Gomoa West.",

  keywords: [
    "Greenforce Foundation Africa",
    "NGO in Ghana",
    "school greenhouse Ghana",
    "youth agriculture training Apam",
    "Gomoa West development NGO",
    "hostel farming Ghana",
    "education sponsorship Ghana NGO",
    "West Africa agriculture NGO",
    "community farming Ghana",
    "Gambia NGO agriculture",
    "Christian NGO Ghana",
    "school farming program Ghana",
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
    title:
      "Greenforce Foundation Africa | Transforming Education Through Agriculture in Ghana",
    description:
      "We use school greenhouses, youth agricultural training, and community farming to build dignity, food security, and opportunity across West Africa.",
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
      "School greenhouses, youth farming, education sponsorship & community transformation in Ghana & The Gambia.",
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
        {/* Fonts (keep but optimize loading) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data (VERY IMPORTANT FOR NGO SEO) */}
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
                "West Africa NGO focused on school greenhouses, youth agriculture training, education sponsorships, healthcare outreach, and community development.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Apam",
                addressRegion: "Gomoa West",
                addressCountry: "Ghana",
              },
              areaServed: ["Ghana", "The Gambia", "West Africa"],
              foundingDate: "2010",
              sameAs: [],
            }),
          }}
        />

        {/* GTranslate Configuration Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.gtranslateSettings = {
                "default_language": "en",
                "languages": ["en", "fr"], // Add more codes here if needed (e.g., "de", "es")
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

        {/* Load GTranslate core assets after the page becomes interactive */}
        <Script 
          src="https://cdn.gtranslate.net/widgets/latest/float.js" 
          strategy="afterInteractive" 
          defer 
        />
      </body>
    </html>
  );
}
