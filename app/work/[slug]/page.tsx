import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/work/case-study";
import { bySlug, neighbours, projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.description, openGraph: { images: [p.mock.tilt] } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) notFound();
  return <CaseStudy project={project} next={neighbours(slug).next} />;
}
