import type { Metadata } from "next";
import { ContactBlock } from "@/components/home/contact-block";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with Neel Sonawane." };

export default function ContactPage() {
  return <ContactBlock standalone />;
}
