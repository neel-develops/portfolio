import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio-page";
import { JsonLd } from "@/components/json-ld";
import { SITE, graph } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph({
          "@type": "ProfilePage",
          "@id": SITE.url + "/#page",
          url: SITE.url,
          name: SITE.title,
          description: SITE.description,
          mainEntity: { "@id": SITE.url + "/#person" },
          isPartOf: { "@id": SITE.url + "/#website" }
        })}
      />
      <PortfolioPage />
    </>
  );
}
