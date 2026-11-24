"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { useContact, useEmailForm, useLocalTime } from "@/components/site/shell";

type Key = { k: string; label: string; act: () => void };


/** Friday OS pod: chrome Y2K keypad. Each key (or its letter on the keyboard) opens a link. */
function Keypad() {
  const router = useRouter();
  const contact = useContact();
  const c = portfolioData.contact;
  const [pressed, setPressed] = useState<string | null>(null);
  const [screen, setScreen] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  const ext = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");
  const KEYS: Key[] = [
    { k: "L", label: "LinkedIn", act: ext(c.linkedin) },
    { k: "G", label: "GitHub", act: ext(c.github) },
    { k: "X", label: "X", act: ext("https://x.com/neel-develops") },
    { k: "E", label: "Email", act: () => { window.location.href = `mailto:${c.email}`; } },
    { k: "W", label: "Work", act: () => router.push("/work") },
    { k: "R", label: "Résumé", act: ext(c.resume) },
    { k: "A", label: "About", act: () => router.push("/about") },
    { k: "H", label: "Home", act: () => router.push("/") },
    { k: "M", label: "Message", act: () => contact.open() }
  ];

  const press = (key: Key) => {
    setPressed(key.k);
    setScreen(`OPENING ${key.label.toUpperCase()}`);
    setTimeout(() => setPressed(null), 180);
    setTimeout(() => { key.act(); setScreen(""); }, 420);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const onKey = (e: KeyboardEvent) => {
      if (!visible.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const key = KEYS.find((k) => k.k === e.key.toUpperCase());
      if (key) press(key);
    };
    window.addEventListener("keydown", onKey);
    return () => { io.disconnect(); window.removeEventListener("keydown", onKey); };
  });

  // key centres measured on /friday-pod.webp (percent of the image), row by row in KEYS order
  const COLS = [26, 50.5, 76];
  const ROWS = [42.5, 57.2, 72.8];

  return (
    <div className="pod" ref={ref}>
      <Image src="/friday-pod.webp" alt="Friday OS, a chrome Y2K pod with nine keys" width={986} height={1569} className="pod-img" sizes="(max-width: 1000px) 80vw, 300px" />
      {screen && (
        <div className="pod-screen" aria-live="polite">
          <p className="dim">FRIDAY OS 2.6 - NEEL</p>
          <p>&gt; {screen}</p>
          <p>&gt; HOLD ON<i className="kp-caret">_</i></p>
        </div>
      )}
      {KEYS.map((key, i) => (
        <button
          key={key.k}
          className={`pod-key ${pressed === key.k ? "down" : ""}`}
          style={{ left: `${COLS[i % 3]}%`, top: `${ROWS[Math.floor(i / 3)]}%` }}
          onClick={() => press(key)}
          aria-label={`${key.label} (press ${key.k})`}
          title={`${key.label} · ${key.k}`}
        />
      ))}
    </div>
  );
}

export function ContactBlock({ standalone = false }: { standalone?: boolean }) {
  const c = portfolioData.contact;
  const time = useLocalTime();
  const [copied, setCopied] = useState(false);
  const { state, submit } = useEmailForm();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${c.email}`;
    }
  };

  return (
    <section className={`ns-contact ${standalone ? "standalone" : ""}`} id="contact">
      <div className="ns-contact-marquee" aria-hidden={!standalone}>
        <div className="ns-contact-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>Say hi<i>✱</i></span>
          ))}
        </div>
      </div>
      {standalone && <h1 className="sr-only">Contact</h1>}
      <p className="ns-contact-lead">
        Have a freelance project in mind, or just want to talk AI? Drop a note, press a key on Friday OS, or copy my email.
      </p>

      <div className="ns-bento">
        <div className="ns-bento-col">
          <div className="ns-card ns-card-dark ns-card-tall">
            <span className="ns-mono"><i className="ns-dot" /> Open to freelance projects</span>
            <p className="ns-card-big">Got an idea?<br />Let&apos;s make it real.</p>
          </div>
          <button className="ns-card ns-card-email" onClick={copy}>
            <span className="ns-mono">Email</span>
            <b>{c.email}</b>
            <span className="ns-card-hint">{copied ? "Copied ✓" : "Tap to copy. Replies usually land within a day."}</span>
          </button>
        </div>

        <div className="ns-card ns-card-keys">
          <span className="ns-mono">Elsewhere</span>
          <Keypad />
        </div>

        <div className="ns-bento-col">
          <form className="ns-card ns-card-form" onSubmit={submit}>
            <span className="ns-mono">Message</span>
            <p className="ns-form-title">Drop a message</p>
            <label><span className="ns-mono">Name</span><input name="name" required autoComplete="name" /></label>
            <label><span className="ns-mono">Email</span><input name="email" type="email" required autoComplete="email" /></label>
            <input type="hidden" name="subject" value="Portfolio contact" />
            <label><span className="ns-mono">What&apos;s on your mind?</span><textarea name="message" rows={3} required /></label>
            <button className="ns-send" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send message"} <i>→</i>
            </button>
            {state === "success" && <p className="ns-form-ok">Sent. I&apos;ll get back to you soon.</p>}
            {state === "error" && <p className="ns-form-err">Couldn&apos;t send. Please email me directly.</p>}
          </form>
          <div className="ns-card ns-card-dark">
            <span className="ns-mono">Based in</span>
            <p className="ns-card-big">Pune, India</p>
            <span className="ns-card-time">{time}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
