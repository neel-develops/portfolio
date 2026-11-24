import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/work-index";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, graph, workListLd } from "@/lib/seo";
import { projects } from "@/data/projects";

const description =
  projects.length +
  " projects by Neel Sonawane: AI agents, LLM apps, dashboards, hackathon builds and freelance client work, each with a case study, real screens and live GitHub data.";

export const metadata: Metadata = {
  title: "Work — AI, full-stack and hackathon projects",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    url: "/work",
    title: "Work — Neel Sonawane",
    description,
    images: [{ url: "/visuals/meditwin.webp", width: 2160, height: 1440, alt: "MediTwin on a desktop display" }]
  },
  twitter: { card: "summary_large_image", title: "Work — Neel Sonawane", description, images: ["/visuals/meditwin.webp"] }
};

export default function WorkPage() {
  return (
    <>
      <JsonLd data={graph(workListLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }]))} />
      <WorkIndex />
    </>
  );
}
