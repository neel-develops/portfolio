import { portfolioData as d } from "@/data/portfolio";
import { projects } from "@/data/projects";
import { SITE, abs, faqItems } from "@/lib/seo";

export const dynamic = "force-static";

/** llms.txt: a plain-markdown map of the site for AI answer engines (generative engine optimisation). */
export function GET() {
  const lines: string[] = [];
  lines.push("# Neel Sonawane");
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push("");
  lines.push("## Key facts");
  lines.push("- Role: AI developer and full-stack builder");
  lines.push("- Current position: AI & Digital Transformation team, VSQC Pvt. Ltd. (Aug 2026 – present)");
  lines.push("- Education: B.Tech CSE (AI & Data Science), Dr. Vishwanath Karad MIT World Peace University, Pune");
  lines.push("- Location: Pune, Maharashtra, India");
  lines.push("- Availability: open to freelance AI and full-stack projects");
  lines.push(`- Contact: ${d.contact.email}`);
  lines.push(`- GitHub: ${d.contact.github}`);
  lines.push(`- LinkedIn: ${d.contact.linkedin}`);
  lines.push("");
  lines.push("## Pages");
  lines.push(`- [Home](${SITE.url}): overview, featured projects, experience and hackathons`);
  lines.push(`- [Work](${abs("/work")}): all ${projects.length} projects with case studies`);
  lines.push(`- [About](${abs("/about")}): background, experience, certifications and FAQ`);
  lines.push(`- [Contact](${abs("/contact")}): email, socials and message form`);
  lines.push("");
  lines.push("## Projects");
  for (const p of projects) {
    const extras = [p.category, p.team ? `team: ${p.team.team || p.team.event}` : "", p.film ? "launch film" : ""].filter(Boolean).join(" · ");
    lines.push(`- [${p.name}](${abs(`/work/${p.slug}`)}): ${p.description} (${extras}; stack: ${p.tags.join(", ")})`);
  }
  lines.push("");
  lines.push("## Experience");
  for (const e of d.experience) lines.push(`- ${e.role}, ${e.company} (${e.period}): ${e.description}`);
  lines.push("");
  lines.push("## Hackathons and open source");
  for (const a of d.achievements) lines.push(`- ${a.title} (${a.organization}): ${a.status}`);
  lines.push("");
  lines.push("## FAQ");
  for (const f of faqItems()) {
    lines.push(`### ${f.q}`);
    lines.push(f.a);
    lines.push("");
  }
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
