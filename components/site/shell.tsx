"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { SplitText } from "@/components/split-text";
import { lockScroll } from "@/components/lenis-provider";
import { portfolioData } from "@/data/portfolio";

const EMAILJS_PUBLIC_KEY = "0_skvr2XAjtCQ-v8X";
const EMAILJS_SERVICE_ID = "service_ag7cvgm";
const EMAILJS_TEMPLATE_ID = "template_4bsb9ct";

/* ------------------------------------------------------------------ */
/* shared helpers                                                       */
/* ------------------------------------------------------------------ */

export function useLocalTime(withSeconds = false) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          ...(withSeconds ? { second: "2-digit" } : {}),
          hour12: true,
          timeZone: "Asia/Kolkata"
        }).format(new Date())
      );
    update();
    const id = setInterval(update, withSeconds ? 1000 : 15000);
    return () => clearInterval(id);
  }, [withSeconds]);
  return time;
}


function LazyVideo({ className, src }: { className: string; src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={src} preload="none" loop muted playsInline />;
}

/* ------------------------------------------------------------------ */
/* contact modal context                                                */
/* ------------------------------------------------------------------ */

const ContactCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useContact = () => useContext(ContactCtx);

/* ------------------------------------------------------------------ */
/* loader: "I build ___" in dot-matrix, words scramble in → logo        */
/* ------------------------------------------------------------------ */

const LOADER_WORDS = [
  "AI AGENTS", "LLM APPS", "DASHBOARDS", "AUTOMATIONS", "VOICE BOTS",
  "COMPUTER VISION", "FULL-STACK APPS", "CLIENT SITES", "HACKATHON BUILDS", "YOUR NEXT IDEA"
];
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

/** Resolves random glyphs into the target word, left to right. */
function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    let frame = 0;
    const total = 7;
    const id = setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < settled ? ch : GLYPHS[(i * 7 + frame * 13) % GLYPHS.length]))
          .join("")
      );
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text]);
  return <>{out}</>;
}

function Loader() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const time = useLocalTime();

  useEffect(() => {
    if (document.documentElement.dataset.seen === "1" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    lockScroll(true);
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      if (i < LOADER_WORDS.length) {
        setStep(i);
        t = setTimeout(tick, i < 2 || i > LOADER_WORDS.length - 3 ? 190 : 120);
      } else {
        setDone(true);
        t = setTimeout(() => {
          setGone(true);
          lockScroll(false);
          sessionStorage.setItem("ns-seen", "1");
        }, 850);
      }
    };
    t = setTimeout(tick, 260);
    return () => {
      clearTimeout(t);
      lockScroll(false);
    };
  }, []);

  const pct = done ? 100 : Math.round(((step + 1) / LOADER_WORDS.length) * 96);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="ns-loader"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <span className="ns-ld-corner tl">NEEL SONAWANE</span>
          <span className="ns-ld-corner tr">AI DEVELOPER · PUNE</span>
          <span className="ns-ld-corner bl">{time || "—"} IST</span>

          {done ? (
            <div className="ns-loader-end">
              <motion.img
                src="/brand/ns-logo.webp"
                alt=""
                className="ns-loader-logo"
                initial={{ opacity: 0, scale: 0.86, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.p className="ns-loader-line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                Hi, I&apos;m <em>Neel.</em>
              </motion.p>
            </div>
          ) : (
            <div className="ns-ld-build">
              <span className="ns-ld-label">I BUILD</span>
              <b className="ns-ld-word"><Scramble text={LOADER_WORDS[step]} /></b>
            </div>
          )}

          <div className="ns-ld-bar"><i style={{ width: `${pct}%` }} /></div>
          <span className="ns-loader-count">{String(pct).padStart(3, "0")}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* custom dot cursor (fine pointers only)                               */
/* ------------------------------------------------------------------ */

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = dot.current;
    if (!el) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0, running = false;
    const loop = () => {
      cx += (x - cx) * 0.28;
      cy += (y - cy) * 0.28;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.3) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      el.style.opacity = "1";
      const t = e.target as HTMLElement | null;
      el.classList.toggle("is-link", !!t?.closest("a, button, [role=button], input, textarea, .cursor-pointer"));
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
    };
    const leave = () => { el.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={dot} className="ns-cursor" aria-hidden="true"><span /></div>;
}

/* ------------------------------------------------------------------ */
/* nav + full-screen menu                                               */
/* ------------------------------------------------------------------ */

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const time = useLocalTime();
  const c = portfolioData.contact;

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ns-menu"
          initial={{ clipPath: "inset(0 0 100% 0 round 24px)" }}
          animate={{ clipPath: "inset(0 0 0% 0 round 24px)" }}
          exit={{ clipPath: "inset(0 0 100% 0 round 24px)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="ns-menu-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/ns-logo-sm.webp" alt="NS" className="ns-menu-logo" width={74} height={48} />
            <button className="ns-menu-close" onClick={onClose}>Close ✕</button>
          </div>
          <nav className="ns-menu-links">
            {LINKS.map((l, i) => {
              const on = l.href === "/" ? path === "/" : path.startsWith(l.href);
              return (
                <motion.div
                  key={l.href}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.18 + i * 0.06 }}
                  className="ns-menu-row"
                >
                  <span className="ns-mono ns-menu-no">0{i + 1}</span>
                  <Link href={l.href} onClick={onClose} className={on ? "on" : ""}>
                    {l.label}
                    {on && <i className="ns-menu-dot" />}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
          <div className="ns-menu-foot">
            <div>
              <span className="ns-mono">Say hello</span>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </div>
            <div className="ns-menu-socials">
              <a href={c.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={c.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={c.resume} target="_blank" rel="noopener noreferrer">Résumé</a>
            </div>
            <span className="ns-mono">{time} · Pune, India</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SiteNav({ onConnect, onMenu }: { onConnect: () => void; onMenu: () => void }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="top-nav">
      <Link href="/" className="brand-lockup ns-brand" aria-label="Neel Sonawane, home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ns-logo-sm.webp" alt="NS" width={58} height={38} />
      </Link>

      <button className="nav-connect-btn" onClick={onConnect} style={{ border: "none", background: "none", cursor: "pointer" }}>
        <span className="connect-pulse" />
        <span>Lets Connect</span>
      </button>

      <div className="nav-actions">
        <button className="ns-menu-pill" onClick={onMenu} aria-label="Open menu">
          <span className="ns-menu-grid" aria-hidden="true"><i /><i /><i /><i /></span>
          Menu
        </button>
        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* footer (original design + giant name row)                            */
/* ------------------------------------------------------------------ */

const FOOTER_SHAPE =
  "M283.878 149.808V0H567V149.808C567 232.56 503.606 299.616 425.439 299.616C347.272 299.616 283.878 232.56 283.878 149.808ZM283.122 149.808V299.616H0V0H141.561C219.728 0 283.122 67.0565 283.122 149.808ZM425.439 300.384H567V600H425.439C347.272 600 283.878 532.943 283.878 450.192V300.384H425.439ZM283.122 450.192V600H0V450.192C0 367.44 63.3936 300.384 141.561 300.384C219.728 300.384 283.122 367.44 283.122 450.192Z";

function SiteFooter({ onConnect }: { onConnect: () => void }) {
  const c = portfolioData.contact;
  const time = useLocalTime();
  return (
    <footer className="footer-section dark-footer">
      <div className="footer-visual">
        <div className="footer-video-wrap">
          <LazyVideo className="footer-video" src="/footer-gradient.mp4" />
          <div className="footer-video-overlay" />
        </div>
        <div className="footer-border-line" />
        {["center", "left", "right"].map((p) => (
          <svg key={p} className={`footer-shape footer-shape-${p}`} viewBox="-1 -1 569 602" aria-hidden="true">
            <path d={FOOTER_SHAPE} fill="rgba(255,255,255,0.01)" stroke="#262626" strokeWidth="1.00751" />
          </svg>
        ))}
        <div className="footer-glow" />

        <div className="footer-content">
          <SplitText as="p" text="lets build something" className="script-heading on-dark footer-script" />
          <SplitText as="p" text="Always curious about how things work" className="footer-heading" />
          <div className="footer-actions">
            <a className="footer-email" href={`mailto:${c.email}`}>{c.email}</a>
            <button className="footer-button" onClick={onConnect} style={{ border: "none", cursor: "pointer" }}>
              Lets Connect
            </button>
          </div>
          <div className="footer-embed">
            <iframe
              data-testid="embed-iframe"
              title="Now playing on Spotify"
              style={{ borderRadius: "12px", border: 0 }}
              src="https://open.spotify.com/embed/track/4jkYkvbjEuckbJs6Ts60Hk?utm_source=generator"
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="ns-footer-nav">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ns-logo.webp" alt="NS logo" className="ns-footer-logo" width={150} height={98} loading="lazy" />
        <nav>
          {LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>
        <div>
          <span className="ns-mono">Local time</span>
          <p>{time} · Pune, India</p>
        </div>
        <button className="ns-backtop" onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}>
          Back to top ↑
        </button>
      </div>
      <p className="ns-footer-giant" aria-hidden="true">Neel<sup>©</sup></p>

      <div className="footer-meta">
        <div className="footer-socials">
          <a href={c.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
          <a href={c.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">gh</a>
          <a href="https://x.com/neel-develops" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter" className="x-link">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
        <div className="footer-typewriter-wrap">
          <div className="typewriter-badge">
            <span>&lt; Code By Neel /&gt;</span>
            <span className="typewriter-cursor">|</span>
          </div>
        </div>
        <SplitText as="p" text="© 2026 Portfolio - Neel Sonawane" className="footer-copyright" />
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* contact modal (original design)                                      */
/* ------------------------------------------------------------------ */

export function useEmailForm(onSuccess?: () => void) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name: data.get("name"), email: data.get("email"), title: data.get("subject"), message: data.get("message") },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setState("success");
      form.reset();
      onSuccess?.();
    } catch {
      setState("error");
    }
  };
  return { state, setState, submit };
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, setState, submit } = useEmailForm(() => setTimeout(onClose, 2200));
  useEffect(() => {
    if (open) setState("idle");
  }, [open, setState]);
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        data-lenis-prevent
      >
        <div className="modal-video-wrap">
          <video className="modal-video" src="/footer-gradient.mp4" autoPlay loop muted playsInline />
          <div className="modal-video-overlay" />
        </div>
        <div className="modal-header">
          <h3 className="modal-title">Send me a message</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form className="modal-form" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="modal-name">Your Name</label>
            <input type="text" id="modal-name" name="name" placeholder="e.g., John Doe" required />
          </div>
          <div className="form-group">
            <label htmlFor="modal-email">Your Email</label>
            <input type="email" id="modal-email" name="email" placeholder="e.g., you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="modal-subject">Subject</label>
            <input type="text" id="modal-subject" name="subject" placeholder="What's this about?" required />
          </div>
          <div className="form-group">
            <label htmlFor="modal-message">Message</label>
            <textarea id="modal-message" name="message" rows={4} placeholder="Your message here..." required />
          </div>
          <button type="submit" className="form-submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending..." : "Send Message"}
          </button>
          <div className={`form-status${state === "success" ? " success" : state === "error" ? " error" : ""}`} role="alert">
            {state === "success"
              ? "✓ Message sent! I'll get back to you soon."
              : state === "error"
              ? `✗ Couldn't send right now. Email me directly at ${portfolioData.contact.email}`
              : ""}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* the shell                                                            */
/* ------------------------------------------------------------------ */

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const path = usePathname();

  // new route → start at the top
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [path]);

  return (
    <ContactCtx.Provider value={{ open: openContact }}>
      <Loader />
      <Cursor />
      <main className="portfolio-shell">
        <div className="reference-root">
          <SiteNav onConnect={openContact} onMenu={() => setMenuOpen(true)} />
          {children}
          <SiteFooter onConnect={openContact} />
        </div>
      </main>
      <MenuOverlay open={menuOpen} onClose={closeMenu} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </ContactCtx.Provider>
  );
}
