"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/data/projects";

const CATS = ["All", "Freelance", "Hackathon", "AI", "Web", "Tools"] as const;

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.06 }}
    >
      <Link href={`/work/${p.slug}`} className="wk-card" style={{ ["--a" as string]: p.accent }}>
        <div className="wk-stage">
          <span className="wk-glow" />
          <Image src={p.mock.tilt} alt={`${p.name} on iPhone`} width={540} height={792} className="wk-phone" sizes="(max-width: 760px) 70vw, 300px" />
          {p.film && <span className="wk-film">▶ Film</span>}
          {p.team && <span className="wk-team">Team · {p.team.members.length}</span>}
        </div>
        <div className="wk-body">
          <span className="ns-mono">{p.category} · {p.tags.slice(0, 2).join(" · ")}</span>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <span className="wk-arrow" aria-hidden="true">↗</span>
        </div>
      </Link>
    </motion.div>
  );
}

export function WorkIndex() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const list = projects.filter((p) => cat === "All" || p.category === cat);

  return (
    <section className="wk">
      <div className="wk-head">
        <h1 className="wk-title">Work<sup>({projects.length})</sup></h1>
        <p className="wk-lead">Hackathon builds, client work and AI tools. Tap any phone for the full story.</p>
      </div>

      <div className="wk-bar">
        <div className="wk-filters" role="tablist" aria-label="Filter projects">
          {CATS.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>
              {c} <i>{c === "All" ? projects.length : projects.filter((p) => p.category === c).length}</i>
            </button>
          ))}
        </div>
        <div className="wk-toggle">
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>Grid</button>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>List</button>
        </div>
      </div>

      {view === "grid" ? (
        <motion.div layout className="wk-grid">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <Card key={p.slug} p={p} i={i} />)}
          </AnimatePresence>
        </motion.div>
      ) : (
        <ul className="wk-list">
          {list.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`}>
                <span className="ns-mono">{String(i + 1).padStart(2, "0")}</span>
                <b>{p.name}</b>
                <em>{p.tagline || p.type}</em>
                <span className="ns-mono">{p.category}</span>
                <Image src={p.mock.frontSm} alt="" width={40} height={84} className="wk-list-thumb" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
