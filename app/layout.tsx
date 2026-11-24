import type { Metadata, Viewport } from "next";

import "@/app/globals.css";
import "@/app/site.css";
import { LenisProvider } from "@/components/lenis-provider";
import { SiteShell } from "@/components/site/shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://neel-develops.vercel.app"),
  title: { default: "Neel Sonawane | AI Developer & Portfolio", template: "%s | Neel Sonawane" },
  description:
    "Neel Sonawane — AI Developer, Agentic AI Explorer, and Vibe Coder based in Pune. Building elegant AI systems, full-stack products, and generative workflows.",
  authors: [{ name: "Neel Sonawane" }],
  keywords: ["AI Developer", "Agentic AI", "Portfolio", "Neel Sonawane", "Pune"]
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <LenisProvider>
          <SiteShell>{children}</SiteShell>
        </LenisProvider>
      </body>
    </html>
  );
}
