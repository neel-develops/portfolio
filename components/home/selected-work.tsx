"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { featured, projects, type Project } from "@/data/projects";

function Slide({ p, i, pos }: { p: Project; i: number; pos: MotionValue<number> }) {
  // pos runs 0 → n-1. Slide i rises in during [i-1, i], then sinks back into the stack.
  const y = useTransform(pos, [i - 1, i, i + 1], i === 0 ? ["0%", "0%", "-6%"] : ["105%", "0%", "-6%"]);
  const scale = useTransform(pos, [i, i + 1], [1, 0.88]);
  const opacity = useTransform(pos, [i, i + 0.9, i + 1.6], [1, 0.45, 0]);
  return (
    <motion.div className="ns-sw-slide" style={{ y, scale, opacity, zIndex: i + 1 }}>
      <Link href={`/work/${p.slug}`} className="ns-sw-stage" style={{ ["--a" as string]: p.accent }} aria-label={`Open ${p.name}`}>
        <span className="ns-sw-glow" />
        <Image src={p.mock.tilt} alt={`${p.name} on iPhone`} width={720} height={1056} className="ns-sw-phone" sizes="(max-width: 900px) 70vw, 420px" loading="eager" />
      </Link>
    </motion.div>
  );
}

/** Pinned "Selected work": the phone mockups stack as you scroll. */
export function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  const n = featured.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const pos = useTransform(scrollYProgress, [0, 1], [0, n - 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, "change", (v) => setActive(Math.min(n - 1, Math.max(0, Math.round(v)))));

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((el.offsetHeight - window.innerHeight) * i) / (n - 1);
    if (window.__lenis) window.__lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const p = featured[active];
  return (
    <section ref={ref} className="ns-sw dark-surface" style={{ height: `${n * 85 + 15}vh` }}>
      <div className="ns-sw-sticky">
        <div className="ns-sw-left">
          <p className="script-heading on-dark">featured work</p>
          <h2 className="ns-sw-title">
            Projects<sup>({String(n).padStart(2, "0")})</sup>
          </h2>
          <ol className="ns-sw-list">
            {featured.map((f, i) => (
              <li key={f.slug} className={i === active ? "on" : ""}>
                <button onClick={() => go(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {f.name}
                </button>
              </li>
            ))}
          </ol>
          <Link href="/work" className="ns-sw-all">All work <span>↗</span></Link>
        </div>

        <div className="ns-sw-center">
          {featured.map((f, i) => (
            <Slide key={f.slug} p={f} i={i} pos={pos} />
          ))}
        </div>

        <div className="ns-sw-right">
          <Link href="/work" className="ns-seeall">
            <Image src={projects[active % projects.length].mock.frontSm} alt="" width={28} height={58} />
            See all ({projects.length})
          </Link>
          <div className="ns-sw-arrows">
            <button onClick={() => go(Math.max(0, active - 1))} aria-label="Previous project" disabled={active === 0}>←</button>
            <button onClick={() => go(Math.min(n - 1, active + 1))} aria-label="Next project" disabled={active === n - 1}>→</button>
          </div>
        </div>

        <div className="ns-sw-caption">
          <span className="ns-mono">({String(active + 1).padStart(2, "0")})</span>
          <Link href={`/work/${p.slug}`} className="ns-sw-cap-title">
            <b>{p.name}</b>
            <em>{p.tagline || p.type}</em>
          </Link>
          <span className="ns-mono">{p.category}</span>
        </div>
      </div>
    </section>
  );
}
