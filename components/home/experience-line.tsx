"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

/* Months are counted from Jan 2026 (0). "Present" runs to NOW. */
const NOW = 10.8; // late Nov 2026
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Role = { id: string; title: string; start: number; end: number | "now"; meta: string; body: string };
type Org = { id: string; name: string; mono: string; tag: string; hue: string; roles: Role[]; links?: { label: string; href: string }[] };

const ORGS: Org[] = [
  {
    id: "vsqc",
    name: "VSQC Pvt. Ltd.",
    mono: "VS",
    tag: "AI · Remote & Pune",
    hue: "#dc3545",
    roles: [
      { id: "vsqc-dt", title: "AI & Digital Transformation", start: 7, end: "now", meta: "Part-time · Remote", body: "Working on AI-driven digital transformation initiatives to improve business processes and operational efficiency." },
      { id: "vsqc-in", title: "Artificial Intelligence Intern", start: 5, end: 7.9, meta: "Internship · Pune", body: "Created AI solutions, automation tasks and data-driven applications with Generative AI, Machine Learning and Python." }
    ]
  },
  {
    id: "ignisia",
    name: "Ignisia Club",
    mono: "IG",
    tag: "MIT-WPU · On-site",
    hue: "#f29a2e",
    roles: [
      { id: "ig-ts", title: "Technical Secretary", start: 10, end: "now", meta: "Leadership", body: "Leading the technical side of the club: websites, tools and event technology." },
      { id: "ig-head", title: "Head of Event Management & Operations", start: 9, end: 10.9, meta: "Leadership", body: "Ran event management and operations, coordinating teams, schedules and on-ground execution." },
      { id: "ig-dep", title: "Deputy Head of Event Management & Operations", start: 6, end: 9.9, meta: "Operations", body: "Supported the head of event management and operations in planning and running club events." },
      { id: "ig-tech", title: "Tech Team", start: 2, end: 10.9, meta: "Full-time · On-site", body: "Built and maintained technology for club events as part of the tech team." }
    ]
  },
  {
    id: "freelance",
    name: "Freelance",
    mono: "FL",
    tag: "Self-employed · Clients",
    hue: "#6d7cff",
    roles: [
      { id: "fl", title: "Freelance SaaS Developer", start: 0, end: "now", meta: "Client work", body: "Designing and building SaaS platforms, AI-powered web apps and automation tools, from first call to deployment." }
    ],
    links: [
      { label: "Natural Remedies", href: "/work/natural-remedies" },
      { label: "MR BOOT CRM", href: "/work/mr-boot-crm" }
    ]
  }
];

const endOf = (r: Role) => (r.end === "now" ? NOW : Math.min(r.end, NOW));
const span = (r: Role) => {
  const s = MONTHS[Math.floor(r.start)];
  const e = r.end === "now" ? "Present" : MONTHS[Math.min(11, Math.floor(r.end))];
  return `${s} 2026 – ${e}${r.end === "now" ? "" : " 2026"}`;
};
const months = (a: number, b: number) => Math.max(1, Math.round(b - a));

/** Experience as a 2026 timeline + organisations with their role ladders. */
export function ExperienceLine() {
  const [hover, setHover] = useState<string | null>(null);
  const all = ORGS.flatMap((o) => o.roles.map((r) => ({ ...r, org: o })));

  return (
    <div className="xp">
      {/* timeline */}
      <div className="xp-chart" aria-hidden="true">
        <div className="xp-axis">
          {MONTHS.map((m) => <span key={m}>{m}</span>)}
        </div>
        <div className="xp-rows">
          {all.map((r, i) => (
            <div key={r.id} className={`xp-row ${hover && hover !== r.id ? "dim" : ""}`}>
              <motion.i
                className={`xp-bar ${r.end === "now" ? "live" : ""} ${(endOf(r) - r.start) / 12 < 0.28 ? "out" : ""}`}
                style={{ left: `${(r.start / 12) * 100}%`, ["--h" as string]: r.org.hue }}
                initial={{ width: 0 }}
                whileInView={{ width: `${((endOf(r) - r.start) / 12) * 100}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                onMouseEnter={() => setHover(r.id)}
                onMouseLeave={() => setHover(null)}
              >
                <b>{r.title}</b>
              </motion.i>
            </div>
          ))}
          <span className="xp-now" style={{ left: `${(NOW / 12) * 100}%` }}><em>now</em></span>
        </div>
      </div>

      {/* organisations */}
      <div className="xp-orgs">
        {ORGS.map((o, oi) => {
          const first = Math.min(...o.roles.map((r) => r.start));
          const last = Math.max(...o.roles.map(endOf));
          const live = o.roles.some((r) => r.end === "now");
          return (
            <motion.section
              key={o.id}
              className="xp-org"
              style={{ ["--h" as string]: o.hue }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: oi * 0.05 }}
            >
              <header className="xp-org-head">
                <span className="xp-mono">{o.mono}</span>
                <div>
                  <h3>{o.name}</h3>
                  <p>{o.tag}</p>
                </div>
                <span className="xp-dur">
                  {months(first, last)} mo{months(first, last) > 1 ? "s" : ""}
                  {live && <i className="xp-live">live</i>}
                </span>
              </header>
              <ol className="xp-ladder">
                {o.roles.map((r) => (
                  <li
                    key={r.id}
                    className={`${r.end === "now" ? "now" : ""} ${hover === r.id ? "hot" : ""}`}
                    onMouseEnter={() => setHover(r.id)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <span className="xp-dot" />
                    <div className="xp-role">
                      <div className="xp-role-top">
                        <b>{r.title}</b>
                        <span className="xp-when">{span(r)}</span>
                      </div>
                      <span className="xp-meta">{r.meta}</span>
                      <p>{r.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {o.links && (
                <div className="xp-links">
                  <span>Client builds</span>
                  {o.links.map((l) => <Link key={l.href} href={l.href}>{l.label} ↗</Link>)}
                </div>
              )}
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
