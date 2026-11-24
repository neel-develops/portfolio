import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE, abs } from "@/lib/seo";

const UPDATED = new Date("2026-11-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: UPDATED, changeFrequency: "weekly", priority: 1, images: [abs("/og-image.png")] },
    { url: abs("/work"), lastModified: UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/about"), lastModified: UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/contact"), lastModified: UPDATED, changeFrequency: "yearly", priority: 0.6 }
  ];
  const work: MetadataRoute.Sitemap = projects.map((p) => ({
    url: abs(`/work/${p.slug}`),
    lastModified: UPDATED,
    changeFrequency: "monthly",
    priority: p.featured ? 0.8 : 0.6,
    images: [abs(p.visual ?? p.mock.tilt), abs(p.mock.tilt)],
    ...(p.film ? { videos: [{ title: `${p.name} launch film`, thumbnail_loc: abs(p.film.poster), description: p.description, content_loc: abs(p.film.src) }] } : {})
  }));
  return [...pages, ...work];
}
