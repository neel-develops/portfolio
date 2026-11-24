const dv = (name: string, file = `${name}-original`) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${file}.svg`;

export type Tool = { name: string; icon?: string };
export type SkillFolder = { name: string; note: string; tools: Tool[] };

/** Folders on the interactive Mac desktop. Tools without a devicon get a lettered tile. */
export const skillFolders: SkillFolder[] = [
  {
    name: "AI / ML",
    note: "Models, evaluation and the LLM stack I build with.",
    tools: [
      { name: "Python", icon: dv("python") },
      { name: "TensorFlow", icon: dv("tensorflow") },
      { name: "scikit-learn", icon: dv("scikitlearn") },
      { name: "OpenCV", icon: dv("opencv") },
      { name: "Pandas", icon: dv("pandas") },
      { name: "NumPy", icon: dv("numpy") },
      { name: "Groq" },
      { name: "Gemini" },
      { name: "Claude" },
      { name: "Sarvam AI" }
    ]
  },
  {
    name: "Programming",
    note: "Languages I write every week.",
    tools: [
      { name: "Python", icon: dv("python") },
      { name: "JavaScript", icon: dv("javascript") },
      { name: "TypeScript", icon: dv("typescript") },
      { name: "Java", icon: dv("java") },
      { name: "C", icon: dv("c") },
      { name: "C++", icon: dv("cplusplus") }
    ]
  },
  {
    name: "Frontend / UI",
    note: "Interfaces, motion and the details people notice.",
    tools: [
      { name: "React", icon: dv("react") },
      { name: "Next.js", icon: dv("nextjs") },
      { name: "Tailwind CSS", icon: dv("tailwindcss") },
      { name: "HTML5", icon: dv("html5") },
      { name: "CSS3", icon: dv("css3") },
      { name: "Three.js", icon: dv("threejs") },
      { name: "Vite", icon: dv("vitejs") },
      { name: "Figma", icon: dv("figma") }
    ]
  },
  {
    name: "Backend",
    note: "APIs, auth and the services behind the apps.",
    tools: [
      { name: "Node.js", icon: dv("nodejs") },
      { name: "Express", icon: dv("express") },
      { name: "FastAPI", icon: dv("fastapi") },
      { name: "Flask", icon: dv("flask") },
      { name: "Electron", icon: dv("electron") },
      { name: "Better Auth" }
    ]
  },
  {
    name: "Databases",
    note: "Where the data lives.",
    tools: [
      { name: "PostgreSQL", icon: dv("postgresql") },
      { name: "SQLite", icon: dv("sqlite") },
      { name: "Firebase", icon: dv("firebase", "firebase-plain") },
      { name: "Prisma", icon: dv("prisma") },
      { name: "Redis", icon: dv("redis") },
      { name: "Neon" }
    ]
  },
  {
    name: "Automation",
    note: "Workflows that run without me.",
    tools: [
      { name: "n8n" },
      { name: "GitHub Actions", icon: dv("githubactions") },
      { name: "Docker", icon: dv("docker") },
      { name: "Playwright" },
      { name: "EmailJS" }
    ]
  },
  {
    name: "Ship & Deploy",
    note: "From laptop to the internet.",
    tools: [
      { name: "Git", icon: dv("git") },
      { name: "GitHub", icon: dv("github") },
      { name: "Vercel", icon: dv("vercel") },
      { name: "Render" },
      { name: "Capacitor" }
    ]
  }
];

/** Icons that assemble in the "ready to build" section. */
export const keySkills: Tool[] = [
  { name: "Python", icon: dv("python") },
  { name: "TypeScript", icon: dv("typescript") },
  { name: "React", icon: dv("react") },
  { name: "Next.js", icon: dv("nextjs") },
  { name: "Node.js", icon: dv("nodejs") },
  { name: "FastAPI", icon: dv("fastapi") },
  { name: "TensorFlow", icon: dv("tensorflow") },
  { name: "OpenCV", icon: dv("opencv") },
  { name: "PostgreSQL", icon: dv("postgresql") },
  { name: "Docker", icon: dv("docker") },
  { name: "Tailwind CSS", icon: dv("tailwindcss") },
  { name: "Figma", icon: dv("figma") },
  { name: "Git", icon: dv("git") },
  { name: "C++", icon: dv("cplusplus") }
];
