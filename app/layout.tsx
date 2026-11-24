import type { Metadata, Viewport } from "next";

import "@/app/globals.css";
import "@/app/site.css";
import { LenisProvider } from "@/components/lenis-provider";
import { SiteShell } from "@/components/site/shell";
import { JsonLd } from "@/components/json-ld";
import { SITE, graph, personLd, websiteLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | Neel Sonawane" },
  description: SITE.metaDescription,
  applicationName: "Neel Sonawane",
  authors: [{ name: "Neel Sonawane", url: SITE.url }],
  creator: "Neel Sonawane",
  publisher: "Neel Sonawane",
  keywords: [
    "Neel Sonawane", "AI developer Pune", "AI developer India", "full-stack developer Pune", "agentic AI",
    "LLM apps", "AI agents", "Next.js developer", "freelance AI developer", "MIT-WPU", "VSQC", "portfolio"
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: SITE.url,
    siteName: "Neel Sonawane",
    title: SITE.title,
    description: SITE.metaDescription,
    locale: SITE.locale,
    firstName: "Neel",
    lastName: "Sonawane",
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Neel Sonawane — AI developer and full-stack builder" }]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.shortDescription,
    images: [SITE.ogImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  formatDetection: { email: false, telephone: false, address: false },
  verification: { google: "2PKsMfiZL9WyEkN6uoLbtn0KhxoRm5lrTA48dh49KcY" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff"
};

// Runs before paint: skip the intro loader after the first visit in a tab, and
// apply the saved theme without a flash.
const boot = `try{if(sessionStorage.getItem("ns-seen"))document.documentElement.dataset.seen="1";if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark-theme")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <JsonLd data={graph(personLd(), websiteLd())} />
        <LenisProvider>
          <SiteShell>{children}</SiteShell>
        </LenisProvider>
      </body>
    </html>
  );
}
