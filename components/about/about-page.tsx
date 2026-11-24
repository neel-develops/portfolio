"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import QRCode from "qrcode";
import { portfolioData as d } from "@/data/portfolio";
import { projects } from "@/data/projects";
import { faqItems } from "@/lib/seo";

/* ---------- ID card: liquid-chrome Friday OS card, flips on tap ---------- */

function IdBadge() {
  const [qr, setQr] = useState("");
  const [flipped, setFlipped] = useState(false);
  const rx = useSpring(0, { stiffness: 120, damping: 16 });
  const ry = useSpring(0, { stiffness: 120, damping: 16 });
  const flip = useSpring(0, { stiffness: 90, damping: 15 });
  const rotY = useTransform(() => ry.get() + flip.get());
  useEffect(() => { flip.set(flipped ? 180 : 0); }, [flipped, flip]);

  useEffect(() => {
    QRCode.toString(d.contact.linkedin, { type: "svg", margin: 0, color: { dark: "#141a2b", light: "#00000000" } })
      .then(setQr)
      .catch(() => setQr(""));
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      ry.set((e.clientX / window.innerWidth - 0.5) * 28);
      rx.set(-(e.clientY / window.innerHeight - 0.5) * 14);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [rx, ry]);

  return (
    <div className="idc-wrap">
      <div className="idc-lanyard" aria-hidden="true"><i /><b /></div>
      <motion.button
        className="idc"
        style={{ rotateX: rx, rotateY: rotY }}
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "ID card back with a QR code to LinkedIn. Tap to flip." : "Neel Sonawane's ID card. Tap to flip."}
      >
        {/* front */}
        <span className="idc-face idc-front">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/idcard-front.webp" alt="Neel Sonawane, photo on the ID card" className="idc-art" draggable={false} />
          <span className="idc-text">
            <span className="idc-hello">hello my name is...</span>
            <span className="idc-name">Neel</span>
            <span className="idc-rule" />
            <span className="idc-field">&gt; based in: pune, india</span>
            <span className="idc-field">&gt; position:<br />ai developer,<br />full-stack builder</span>
            <span className="idc-field">&gt; valid thru: ∞</span>
          </span>
          <span className="idc-pill">FRONTAL VIEW<br />id number:0423</span>
        </span>

        {/* back */}
        <span className="idc-face idc-back">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/idcard-back.webp" alt="" className="idc-art" draggable={false} />
          <span className="idc-qr-box">
            <span className="idc-qr" dangerouslySetInnerHTML={{ __html: qr }} />
            <span className="idc-qr-cap">SCAN → LINKEDIN</span>
          </span>
        </span>
      </motion.button>
      <p className="ns-mono ab-hint"><span className="hint-fine">Move your pointer. </span>Tap the card to flip it.</p>
    </div>
  );
}

/* ---------- capabilities wheel ---------- */

const CAPS = [
  { t: "AI Engineering", d: "Models, prompts and evaluation: picking the right model and making it behave in a real product." },
  { t: "Agentic Systems", d: "Tool-using agents and automations, like LeadPilot calling merchant leads in Hindi or English." },
  { t: "Full-Stack Web", d: "Next.js, React, FastAPI and Postgres, shipped to Vercel and Render with real auth and data." },
  { t: "UI / UX", d: "Interfaces designed with care for motion and detail, from client shops to hackathon dashboards." },
  { t: "Automation", d: "Workflows that run without me: mail merges, scrapers, n8n flows and CI." }
];

function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const pos = useTransform(scrollYProgress, [0, 1], [0, CAPS.length - 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, "change", (v) => setActive(Math.round(v)));

  return (
    <section ref={ref} className="ab-caps" style={{ height: `${CAPS.length * 60 + 40}vh` }}>
      <div className="ab-caps-sticky">
        <div className="ab-caps-head"><span className="ns-mono">Capabilities</span><span className="ns-mono">({String(active + 1).padStart(2, "0")}/{String(CAPS.length).padStart(2, "0")})</span></div>
        <div className="ab-wheel">
          {CAPS.map((c, i) => {
            const off = i - active;
            return (
              <motion.p
                key={c.t}
                className="ab-wheel-item"
                animate={{ y: `${off * 105}%`, opacity: Math.abs(off) > 2 ? 0 : 1 - Math.abs(off) * 0.38, filter: `blur(${Math.abs(off) * 3}px)`, scale: 1 - Math.abs(off) * 0.08 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: off === 0 ? "var(--ink)" : "var(--accent)" }}
              >
                <span className="ab-cap-ico">{String(i + 1).padStart(2, "0")}</span>{c.t}
              </motion.p>
            );
          })}
        </div>
        <p className="ab-cap-desc"><b>{CAPS[active].t}.</b> {CAPS[active].d}</p>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

function Faq() {
  const items = faqItems();
  const [open, setOpen] = useState(0);
  return (
    <div className="ab-faq">
      {items.map((it, i) => (
        <div key={it.q} className={`ab-faq-item ${open === i ? "open" : ""}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {it.q}<i>{open === i ? "×" : "+"}</i>
          </button>
          <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
            <p>{it.a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ---------- page ---------- */

export function AboutPage() {
  const now = d.experience[0];
  const before = d.experience[1];
  return (
    <div className="ab">
      <section className="ab-hero dark-surface">
        <div className="ab-hero-copy">
          <span className="ns-mono">(About)</span>
          <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.9 }}>
            A developer who ships the AI and the product around it.
          </motion.h1>
          <div className="ab-hero-btns">
            <Link href="/work" className="ns-pill-btn light">See my work ↗</Link>
            <a href={d.contact.resume} target="_blank" rel="noopener noreferrer" className="ns-pill-btn ghost">Résumé</a>
          </div>
        </div>
        <IdBadge />
        <dl className="ab-facts">
          <div><dt>Based in</dt><dd>Pune, India</dd></div>
          <div><dt>Studying</dt><dd>B.Tech CSE (AI &amp; Data Science)<small>MIT World Peace University, Pune</small></dd></div>
          <div><dt>Now</dt><dd>{now.role}<small>{now.company} · {now.period}</small></dd></div>
          <div><dt>Before</dt><dd>{before.role}<small>{before.company} · {before.period}</small></dd></div>
        </dl>
      </section>

      <Capabilities />

      <section className="ab-bg">
        <div className="ab-bg-head"><span><i className="ns-dot" /> Background</span><span className="ns-mono">(NS — 04)</span><span className="ns-mono">©2026</span></div>
        <div className="ab-bento">
          <div className="ab-tile">
            <span className="ns-mono">Shipped</span>
            <p className="ab-num">{projects.length}<small>projects</small></p>
            <p>Hackathon builds, freelance work and AI tools, each with a case study.</p>
          </div>
          <div className="ab-tile ab-tile-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/travel-license.jpg" alt="Neel's travel licence card" />
            <p className="ab-photo-cap"><span className="ns-mono">Off the screen</span>Not just code.</p>
          </div>
          <div className="ab-tile dark">
            <span className="ns-mono">Experience</span>
            <p className="ab-num">{String(d.experience.length).padStart(2, "0")}<small>roles so far</small></p>
            <ul className="ab-timeline">
              {d.experience.slice(0, 4).map((e) => (
                <li key={e.role + e.period}><span className="ns-mono">{e.period}</span><b>{e.role}</b><em>{e.company}</em></li>
              ))}
            </ul>
          </div>
          <div className="ab-tile">
            <span className="ns-mono">Hackathons</span>
            <p className="ab-num">{String(d.achievements.filter((a) => a.category !== "Open Source").length).padStart(2, "0")}<small>events</small></p>
            <ul className="ab-mini">
              {d.achievements.slice(0, 4).map((a) => <li key={a.title}>{a.title}<em>{a.status}</em></li>)}
            </ul>
          </div>
          <div className="ab-tile">
            <span className="ns-mono">Credentials</span>
            <p className="ab-num">{String(d.certifications.length).padStart(2, "0")}<small>certificates</small></p>
            <ul className="ab-mini">
              {d.certifications.slice(0, 4).map((c) => (
                <li key={c.title}><a href={encodeURI(c.file)} target="_blank" rel="noopener noreferrer">{c.title} ↗</a></li>
              ))}
            </ul>
          </div>
          <div className="ab-tile dark">
            <span className="ns-mono">Résumé</span>
            <p className="ab-tile-big">Everything on one page.</p>
            <a href={d.contact.resume} target="_blank" rel="noopener noreferrer" className="ns-pill-btn light">Download résumé ↗</a>
          </div>
        </div>
      </section>

      <section className="ab-split">
        <div className="cs-label"><span className="ns-mono">(01)</span><h2>TL;DR</h2></div>
        <div className="ab-short">
          {d.about.map((p, i) => <p key={p} className={i === 0 ? "lead" : ""}>{p}</p>)}
        </div>
      </section>

      <section className="ab-split">
        <div className="cs-label"><span className="ns-mono">(02)</span><h2>FAQ</h2></div>
        <Faq />
      </section>
    </div>
  );
}
