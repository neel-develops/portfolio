"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

const REAL = projects.filter((p) => p.mock.real);
const ROW_A = REAL.slice(0, 9);
const ROW_B = REAL.slice(9).concat(REAL.slice(0, 3));

function Row({ items, reverse }: { items: typeof REAL; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className={`cr-row ${reverse ? "rev" : ""}`}>
      <div className="cr-track">
        {loop.map((p, i) => (
          <Link
            key={`${p.slug}-${i}`}
            href={`/work/${p.slug}`}
            className="cr-card"
            style={{ ["--a" as string]: p.accent }}
            tabIndex={i >= items.length ? -1 : undefined}
            aria-hidden={i >= items.length}
          >
            <Image src={p.mock.tilt} alt={i < items.length ? `${p.name} on iPhone` : ""} width={360} height={528} sizes="200px" loading="eager" />
            <span className="cr-name">{p.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** "I build intelligence through code." with two drifting rows of real project phones. */
export function CraftRail() {
  return (
    <section className="cr">
      <motion.div
        className="cr-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="ns-mono">(Craft)</span>
        <h2>I build intelligence<br />through <em>code.</em></h2>
        <p>Every project here started as a real problem and ended as something people can open and use. Hover a phone to pause, tap one to open it.</p>
      </motion.div>
      <div className="cr-rails">
        <Row items={ROW_A} />
        <Row items={ROW_B} reverse />
      </div>
    </section>
  );
}
