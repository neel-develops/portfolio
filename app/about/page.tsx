import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";
import { JsonLd } from "@/components/json-ld";
import { SITE, breadcrumbLd, faqLd, graph } from "@/lib/seo";

const description =
  "About Neel Sonawane: AI developer in Pune at VSQC Pvt. Ltd., B.Tech CSE (AI & Data Science) at MIT-WPU. Experience, hackathons, certifications and FAQ.";

export const metadata: Metadata = {
  title: "About — AI developer in Pune",
  description,
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about", title: "About Neel Sonawane", description, images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Neel Sonawane" }] },
  twitter: { card: "summary_large_image", title: "About Neel Sonawane", description, images: [SITE.ogImage] }
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          { "@type": "AboutPage", "@id": SITE.url + "/about#page", url: SITE.url + "/about", name: "About Neel Sonawane", mainEntity: { "@id": SITE.url + "/#person" } },
          faqLd(),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])
        )}
      />
      <AboutPage />
    </>
  );
}
