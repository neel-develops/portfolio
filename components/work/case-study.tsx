"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GitHubPull } from "@/components/github-pull";
import type { Project } from "@/data/projects";

function FilmPlayer({ src, poster, name }: { src: string; poster: string; name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const play = () => {
    setStarted(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };
  return (
    <div className={`cs-film ${started ? "on" : ""}`}>
      <video ref={ref} src={src} poster={poster} controls={started} preload="none" playsInline aria-label={`${name} launch film`} />
      {!started && (
        <button className="cs-film-play" onClick={play} aria-label={`Play the ${name} launch film`}>
          <span className="cs-film-btn"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg></span>
          <span className="cs-film-label">Play the launch film</span>
        </button>
      )}
    </div>
  );
}

function TiltPhone({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <div ref={ref} className="cs-tilt" onPointerMove={move} onPointerLeave={leave}>
      <Image src={src} alt={alt} width={900} height={1320} priority sizes="(max-width: 900px) 80vw, 460px" />
    </div>
  );
}

export function CaseStudy({ project: p, next }: { project: Project; next: Project }) {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const repo = p.repo ?? (p.href.includes("github.com") ? p.href : undefined);
  const live = p.href && !p.href.includes("github.com") ? p.href : undefined;
  let n = 0;
  const num = () => `(${String(++n).padStart(2, "0")})`;

  return (
    <article className="cs" style={{ ["--a" as string]: p.accent }}>
      <section ref={hero} className="cs-hero dark-surface">
        <span className="cs-hero-glow" />
        <Link href="/work" className="cs-back">← All work</Link>
        <div className="cs-hero-grid">
          <div className="cs-hero-copy">
            <span className="ns-mono">{p.category} · {p.type}</span>
            <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              {p.name}
            </motion.h1>
            {p.tagline && <p className="cs-tagline">{p.tagline}</p>}
          </div>
          <motion.div className="cs-hero-phone" style={{ y: phoneY }}>
            <TiltPhone src={p.mock.tilt} alt={`${p.name} running on iPhone`} />
          </motion.div>
        </div>
        <dl className="cs-meta">
          <div><dt>Role</dt><dd>{p.role}</dd></div>
          <div><dt>Type</dt><dd>{p.type}</dd></div>
          {p.scale && <div><dt>Context</dt><dd>{p.scale}</dd></div>}
          <div className="cs-meta-stack"><dt>Stack</dt><dd>{p.tags.map((t) => <span key={t}>{t}</span>)}</dd></div>
        </dl>
      </section>

      <section className="cs-section">
        <div className="cs-label"><span className="ns-mono">{num()}</span><h2>Overview</h2></div>
        <p className="cs-lead">{p.description}</p>
      </section>

      {p.visual && (
        <section className="cs-visual-wrap">
          <motion.div
            className="cs-visual"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={p.visual} alt={`${p.name} on a desktop display`} width={2160} height={1440} sizes="(max-width: 1200px) 100vw, 1120px" />
          </motion.div>
        </section>
      )}

      {p.film && (
        <section className="cs-section">
          <div className="cs-label"><span className="ns-mono">{num()}</span><h2>Launch film</h2></div>
          <FilmPlayer src={p.film.src} poster={p.film.poster} name={p.name} />
        </section>
      )}

      {p.mock.real && (
        <section className="cs-section">
          <div className="cs-label"><span className="ns-mono">{num()}</span><h2>Screens</h2></div>
          <div className="cs-screens">
            {p.mock.front.map((src, i) => (
              <motion.div
                key={src}
                className="cs-screen"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                <Image src={src} alt={`${p.name} screen ${i + 1}`} width={514} height={1053} sizes="(max-width: 760px) 70vw, 260px" />
              </motion.div>
            ))}
          </div>
          <p className="cs-note ns-mono">Real screens captured from the {live ? "live deployment" : "running app"}.</p>
        </section>
      )}

      {p.team && (
        <section className="cs-section">
          <div className="cs-label"><span className="ns-mono">{num()}</span><h2>Built with</h2></div>
          <div className="cs-team">
            <p className="cs-team-head">
              {p.team.team && <b>{p.team.team}</b>}
              <span>{p.team.event}</span>
            </p>
            <ul>
              {p.team.members.map((m) => {
                const me = m.startsWith("Neel");
                const [name, role] = m.replace(")", "").split(" (");
                return (
                  <li key={m} className={me ? "me" : ""}>
                    <i aria-hidden="true">{name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</i>
                    <span>{name}{me && <em>{role ? role : "Me"}</em>}{!me && role && <em>{role}</em>}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="cs-section">
        <div className="cs-label"><span className="ns-mono">{num()}</span><h2>Stack</h2></div>
        <div className="cs-chips">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
      </section>

      <section className="cs-section">
        <div className="cs-label"><span className="ns-mono">{num()}</span><h2>Links</h2></div>
        <div className="cs-links">
          {live && <a href={live} target="_blank" rel="noopener noreferrer" className="ns-pill-btn dark">Open live project ↗</a>}
          {repo && <a href={repo} target="_blank" rel="noopener noreferrer" className="ns-pill-btn">View code ↗</a>}
          {!live && !repo && <p className="cs-private">Private client work — no public link.</p>}
        </div>
      </section>

      {repo && (
        <section className="cs-section">
          <div className="cs-label"><span className="ns-mono">{num()}</span><h2>Straight from GitHub</h2></div>
          <div className="cs-pull"><GitHubPull repoUrl={repo} /></div>
        </section>
      )}

      <Link href={`/work/${next.slug}`} className="cs-next dark-surface" style={{ ["--a" as string]: next.accent }}>
        <div>
          <span className="ns-mono">Next project</span>
          <b>{next.name}</b>
          <em>{next.tagline || next.type}</em>
        </div>
        <Image src={next.mock.tilt} alt="" width={360} height={528} sizes="220px" className="cs-next-phone" />
      </Link>
    </article>
  );
}
