"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

const LINE =
  "I build intelligence across agents, automation and machine learning, and the *interfaces* around them, so ambitious ideas become products people actually use.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const accent = word.startsWith("*");
  const text = word.replace(/\*/g, "");
  return (
    <motion.span style={{ opacity }} className={accent ? "ns-reveal-accent" : undefined}>
      {text}{" "}
    </motion.span>
  );
}

/** Big statement whose words light up as you scroll (scroll-scrubbed). */
export function IntroReveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.65"] });
  const words = LINE.split(" ");

  return (
    <section ref={ref} className="ns-intro">
      <p className="script-heading">intro</p>
      <h2 className="ns-intro-line">
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </h2>
      <div className="ns-intro-row">
        <p className="ns-intro-about">
          <b>About me.</b> {portfolioData.about[0]}
        </p>
        <p className="ns-intro-side">Agents, automation, ML and the web apps around them, from first prototype to production.</p>
      </div>
      <Link href="/work" className="ns-pill-btn">↗ See selected work</Link>
    </section>
  );
}
