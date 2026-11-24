import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/work/case-study";
import { bySlug, neighbours, projects } from "@/data/projects";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, graph, projectLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  const img = p.visual ?? p.mock.tilt;
  const size = p.visual ? { width: 2160, height: 1440 } : { width: 720, height: 1056 };
  const title = p.tagline ? p.name + " — " + p.tagline : p.name;
  return {
    title,
    description: p.description,
    alternates: { canonical: "/work/" + p.slug },
    keywords: [p.name, ...p.tags, p.category, "Neel Sonawane"],
    openGraph: {
      type: "article",
      url: "/work/" + p.slug,
      title: title + " | Neel Sonawane",
      description: p.description,
      images: [{ url: img, ...size, alt: p.name + " by Neel Sonawane" }],
      ...(p.film ? { videos: [{ url: p.film.src, type: "video/mp4", width: 1920, height: 1080 }] } : {})
    },
    twitter: { card: "summary_large_image", title: title + " | Neel Sonawane", description: p.description, images: [img] }
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) notFound();
  return (
    <>
      <JsonLd
        data={graph(
          projectLd(project),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }, { name: project.name, path: "/work/" + project.slug }])
        )}
      />
      <CaseStudy project={project} next={neighbours(slug).next} />
    </>
  );
}
