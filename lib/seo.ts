import { portfolioData as d } from "@/data/portfolio";
import { projects, type Project } from "@/data/projects";

/* ------------------------------------------------------------------ */
/* Site facts: one source for metadata, JSON-LD, sitemap and llms.txt  */
/* ------------------------------------------------------------------ */

export const SITE = {
  url: "https://neel-develops.runs-on.dev",
  name: "Neel Sonawane",
  title: "Neel Sonawane | AI Developer & Full-Stack Builder in Pune",
  description:
    "Neel Sonawane is an AI developer and full-stack builder in Pune, India, working with the AI & Digital Transformation team at VSQC Pvt. Ltd. He builds AI agents, LLM apps, dashboards and automation, with 23 shipped projects and hackathon builds. Open to freelance projects.",
  metaDescription:
    "Neel Sonawane, AI developer and full-stack builder in Pune. AI agents, LLM apps, dashboards and automation: 23 projects, case studies and launch films.",
  shortDescription: "AI developer and full-stack builder in Pune, India. AI agents, LLM apps, dashboards and automation.",
  locale: "en_IN",
  email: d.contact.email,
  sameAs: [d.contact.github, d.contact.linkedin, "https://x.com/neel-develops"],
  ogImage: "/og-image.png"
} as const;

export const abs = (path: string) => new URL(path, SITE.url).toString();

export const KNOWS_ABOUT = [
  "Artificial Intelligence", "Agentic AI", "Large Language Models", "Machine Learning", "Computer Vision",
  "Full-stack web development", "Next.js", "React", "TypeScript", "Python", "FastAPI", "Node.js",
  "PostgreSQL", "Automation", "n8n", "UI/UX design"
];

/* ------------------------------------------------------------------ */
/* FAQ (shown on /about and marked up as FAQPage for answer engines)  */
/* ------------------------------------------------------------------ */

export const faqItems = () => [
  { q: "Who is Neel Sonawane?", a: d.about[0] },
  {
    q: "What does Neel Sonawane do?",
    a: "He is an AI developer and full-stack builder in Pune, India. He works with the AI & Digital Transformation team at VSQC Pvt. Ltd. and builds AI agents, LLM apps, dashboards, automation tools and client websites."
  },
  { q: "What kind of work do you take on?", a: "AI-powered web apps, automation tools, dashboards and client websites, from a first prototype to a deployed product." },
  {
    q: "Which technologies do you work with?",
    a: "Python, TypeScript, React and Next.js on the front, FastAPI and Node on the back, Postgres and Firebase for data, and Groq, Gemini and Claude for AI."
  },
  {
    q: "What have you built?",
    a: `${projects.length} projects so far, including MediTwin, LeadPilot, Ledger, RailSync, PRUDENCE AI and two freelance builds. Every one has its own page under Work.`
  },
  {
    q: "What experience do you have?",
    a: d.experience.slice(0, 3).map((e) => `${e.role} at ${e.company.split(" ·")[0]} (${e.period})`).join("; ") + "."
  },
  {
    q: "Are you available for freelance work?",
    a: `Yes. I work with the AI & Digital Transformation team at VSQC Pvt. Ltd., and take on freelance AI and full-stack projects alongside. The fastest way to reach me is ${d.contact.email}.`
  }
];

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                    */
/* ------------------------------------------------------------------ */

const PERSON_ID = `${SITE.url}/#person`;
const SITE_ID = `${SITE.url}/#website`;

export const personLd = () => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Neel Sonawane",
  url: SITE.url,
  image: abs("/brand/ns-logo.webp"),
  email: `mailto:${SITE.email}`,
  jobTitle: "AI Developer",
  description: SITE.shortDescription,
  worksFor: { "@type": "Organization", name: "VSQC Pvt. Ltd." },
  affiliation: { "@type": "CollegeOrUniversity", name: "Dr. Vishwanath Karad MIT World Peace University", address: "Pune, India" },
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
  knowsAbout: KNOWS_ABOUT,
  sameAs: SITE.sameAs
});

export const websiteLd = () => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: `${SITE.url}/`,
  name: "Neel Sonawane",
  alternateName: ["Neel Sonawane Portfolio", "neel-develops", "NS"],
  description: SITE.description,
  inLanguage: "en-IN",
  publisher: { "@id": PERSON_ID }
});

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) }))
});

export const faqLd = () => ({
  "@type": "FAQPage",
  mainEntity: faqItems().map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
});

export const projectLd = (p: Project) => {
  const url = abs(`/work/${p.slug}`);
  const live = p.href && !p.href.includes("github.com") ? p.href : undefined;
  const repo = p.repo ?? (p.href.includes("github.com") ? p.href : undefined);
  const node: Record<string, unknown> = {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: p.name,
    headline: p.title,
    description: p.description,
    url,
    image: [abs(p.visual ?? p.mock.tilt), abs(p.mock.tilt)],
    genre: p.category,
    keywords: p.tags.join(", "),
    inLanguage: "en",
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID }
  };
  if (live) node.sameAs = [live];
  if (repo) node.codeRepository = repo;
  if (p.team) {
    node.contributor = p.team.members.map((m) => ({ "@type": "Person", name: m.replace(/ \(.+\)$/, "") }));
    node.about = p.team.event;
  }
  if (p.film) {
    node.video = {
      "@type": "VideoObject",
      name: `${p.name} launch film`,
      description: p.description,
      thumbnailUrl: abs(p.film.poster),
      contentUrl: abs(p.film.src),
      uploadDate: "2026-11-24",
      embedUrl: url
    };
  }
  return node;
};

export const workListLd = () => ({
  "@type": "CollectionPage",
  "@id": `${SITE.url}/work#page`,
  url: abs("/work"),
  name: "Work — Neel Sonawane",
  isPartOf: { "@id": SITE_ID },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/work/${p.slug}`), name: p.name }))
  }
});

/** Renders JSON-LD safely inside a <script> tag. */
export const ldJson = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
