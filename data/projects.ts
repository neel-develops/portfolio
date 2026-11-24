import { portfolioData } from "@/data/portfolio";
import shots from "@/data/shots.json";
import mockups from "@/data/mockups.json";
import teamCredits from "@/data/team-credits.json";

export type Project = {
  slug: string;
  title: string;
  name: string; // short name before the em dash
  tagline: string; // text after the em dash
  description: string;
  tags: string[];
  href: string;
  repo?: string;
  role: string;
  type: string;
  scale: string;
  shots: string[];
  mock: Mockup;
  visual?: string; // desktop-monitor scene
  film?: { src: string; poster: string };
  team?: Team;
  accent: string;
  category: "Freelance" | "Hackathon" | "AI" | "Web" | "Tools";
  featured: boolean;
  index: number;
};

export type Team = { team: string; event: string; members: string[] };

export type Mockup = { front: string[]; frontSm: string; tilt: string; real: boolean };

type Meta = { prefix: string; slug: string; accent: string; category: Project["category"]; shots?: string; featured?: boolean };

const META: Meta[] = [
  { prefix: "MediTwin", slug: "meditwin", accent: "#0ea5a4", category: "Hackathon", featured: true },
  { prefix: "LeadPilot", slug: "leadpilot", accent: "#0b6bd3", category: "Hackathon", featured: true },
  { prefix: "Ledger", slug: "ledger", accent: "#6d4aff", category: "Web", featured: true },
  { prefix: "Natural Remedies", slug: "natural-remedies", accent: "#3f6f2a", category: "Freelance", featured: true },
  { prefix: "MR BOOT", slug: "mr-boot-crm", accent: "#7a4b3a", category: "Freelance", featured: true },
  { prefix: "PRUDENCE", slug: "prudence", accent: "#6d4aff", category: "Hackathon", featured: true },
  { prefix: "ORIS", slug: "oris", accent: "#2b3a8f", category: "Hackathon" },
  { prefix: "Nostalux", slug: "nostalux", accent: "#d9572b", category: "Web" },
  { prefix: "NitroAI", slug: "nitroai", accent: "#7c5cff", category: "Tools" },
  { prefix: "Open Cluely", slug: "open-cluely", accent: "#222222", category: "Tools" },
  { prefix: "RailSync", slug: "railsync", accent: "#c0392b", category: "Hackathon" },
  { prefix: "Kin", slug: "kin", accent: "#e0567a", category: "Hackathon" },
  { prefix: "RepoMind", slug: "repomind", accent: "#238636", category: "AI" },
  { prefix: "India Intern", slug: "india-intern", accent: "#f08a24", category: "Hackathon" },
  { prefix: "SupportBot", slug: "supportbot", accent: "#25a05a", category: "AI" },
  { prefix: "AI Document", slug: "doc-intel", accent: "#3b6fd4", category: "AI" },
  { prefix: "Anomaly", slug: "anomaly", accent: "#d6336c", category: "AI" },
  { prefix: "Leo", slug: "leo", accent: "#6d4aff", category: "AI" },
  { prefix: "FreelanceFlow", slug: "freelanceflow", accent: "#0e9f8f", category: "AI" },
  { prefix: "House Price", slug: "house", accent: "#b5651d", category: "AI" },
  { prefix: "Document Authenticity", slug: "authenticity", accent: "#4263eb", category: "AI" },
  { prefix: "CodeReview", slug: "codereview", accent: "#8a2be2", category: "AI" },
  { prefix: "RAG", slug: "rag", accent: "#0b7285", category: "AI" }
];

const shotMap = shots as Record<string, string[]>;
const mockMap = mockups as Record<string, Mockup>;
const teamMap = teamCredits as Record<string, Team>;
const VISUALS = new Set(["meditwin", "leadpilot", "ledger", "natural-remedies", "prudence", "railsync", "kin", "oris", "nostalux", "nitroai", "repomind", "india-intern", "doc-intel", "house", "leo", "anomaly", "authenticity"]);
const FILMS = new Set(["meditwin", "leadpilot", "ledger", "railsync", "prudence", "kin", "oris"]);

export const projects: Project[] = portfolioData.projects.map((p, index) => {
  const m = META.find((x) => p.title.startsWith(x.prefix));
  if (!m) throw new Error(`No project meta for "${p.title}"`);
  const [name, ...rest] = p.title.split(" — ");
  const raw = p as unknown as Record<string, string | undefined>;
  return {
    slug: m.slug,
    title: p.title,
    name,
    tagline: rest.join(" — "),
    description: p.description,
    tags: [...p.tags],
    href: p.href,
    repo: raw.repo,
    role: raw.role ?? "Developer",
    type: raw.type ?? "Project",
    scale: raw.scale ?? "",
    shots: shotMap[m.slug] ?? [],
    mock: mockMap[m.slug],
    visual: VISUALS.has(m.slug) ? `/visuals/${m.slug}.webp` : undefined,
    film: FILMS.has(m.slug) ? { src: `/videos/${m.slug}.mp4`, poster: `/videos/${m.slug}-poster.jpg` } : undefined,
    team: teamMap[m.slug],
    accent: m.accent,
    category: m.category,
    featured: !!m.featured,
    index
  };
});

export const featured = projects.filter((p) => p.featured);
export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const neighbours = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return { prev: projects[(i - 1 + projects.length) % projects.length], next: projects[(i + 1) % projects.length] };
};
