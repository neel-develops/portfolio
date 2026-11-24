"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { keySkills, type Tool } from "@/data/skills";

// deterministic scatter so server and client render the same thing
const SCATTER = keySkills.map((_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const r = a - Math.floor(a);
  const b = Math.sin(i * 78.233) * 12345.678;
  const s = b - Math.floor(b);
  return { x: Math.round((r - 0.5) * 900), y: Math.round((s - 0.5) * 520 - 120), rot: Math.round((r - 0.5) * 140) };
});

function Icon({ tool, i, progress }: { tool: Tool; i: number; progress: MotionValue<number> }) {
  const s = SCATTER[i];
  const start = 0.05 + (i % 5) * 0.03;
  const x = useTransform(progress, [start, 0.62], [s.x, 0]);
  const y = useTransform(progress, [start, 0.62], [s.y, 0]);
  const rotate = useTransform(progress, [start, 0.62], [s.rot, 0]);
  const opacity = useTransform(progress, [0, start + 0.08], [0, 1]);
  const [broken, setBroken] = useState(false);
  return (
    <motion.li className="ns-skill" style={{ x, y, rotate, opacity }} title={tool.name}>
      {tool.icon && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tool.icon} alt={tool.name} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <span>{tool.name.slice(0, 2)}</span>
      )}
    </motion.li>
  );
}

/** "My key skills": icons fly in from a scatter and lock into a row as you scroll. */
export function SkillsAssemble() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });
  const blur = useTransform(scrollYProgress, [0.55, 0.85], [14, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0.15, 1]);

  return (
    <section ref={ref} className="ns-skills">
      <h2 className="ns-skills-title">Tools of the trade</h2>
      <ul className="ns-skills-row">
        {keySkills.map((t, i) => <Icon key={t.name} tool={t} i={i} progress={scrollYProgress} />)}
      </ul>
      <motion.p className="ns-skills-big" style={{ filter, opacity: textOpacity }}>ship mode: on.</motion.p>
      <div className="ns-skills-foot">
        <p>Python for the brains, TypeScript for the face, and whatever else the problem needs. Picked for the job, not the hype.</p>
        <Link href="/work" className="ns-pill-btn">↗ See what I&apos;ve built</Link>
      </div>
    </section>
  );
}
