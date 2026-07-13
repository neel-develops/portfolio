import type { Metadata, Viewport } from "next";

import "@/app/globals.css";
import { LenisProvider } from "@/components/lenis-provider";

export const metadata: Metadata = {
  title: "Neel Sonawane | AI Developer & Portfolio",
  description:
    "Neel Sonawane — AI Developer, Agentic AI Explorer, and Vibe Coder based in Pune. Building elegant AI systems, full-stack products, and generative workflows.",
  authors: [{ name: "Neel Sonawane" }],
  keywords: ["AI Developer", "Agentic AI", "Portfolio", "Neel Sonawane", "Pune"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
