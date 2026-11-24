import type { Metadata } from "next";
import { ContactBlock } from "@/components/home/contact-block";
import { JsonLd } from "@/components/json-ld";
import { SITE, breadcrumbLd, graph } from "@/lib/seo";

const description =
  "Contact Neel Sonawane for freelance AI and full-stack projects: email, LinkedIn, GitHub or a message form. Based in Pune, India.";

export const metadata: Metadata = {
  title: "Contact — freelance AI & full-stack work",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact Neel Sonawane", description, images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Neel Sonawane" }] },
  twitter: { card: "summary_large_image", title: "Contact Neel Sonawane", description, images: [SITE.ogImage] }
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph(
          { "@type": "ContactPage", "@id": SITE.url + "/contact#page", url: SITE.url + "/contact", name: "Contact Neel Sonawane", mainEntity: { "@id": SITE.url + "/#person" } },
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])
        )}
      />
      <ContactBlock standalone />
    </>
  );
}
