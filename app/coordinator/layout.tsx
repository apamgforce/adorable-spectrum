import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer Coordinator",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
