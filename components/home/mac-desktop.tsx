"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { skillFolders, type Tool } from "@/data/skills";
import { portfolioData } from "@/data/portfolio";
import { useLocalTime } from "@/components/site/shell";

/* ---------- little icons ---------- */

function FolderIcon() {
  return (
    <svg viewBox="0 0 64 52" className="mac-folder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="fb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6cc4ff" />
          <stop offset="1" stopColor="#2f8cf0" />
        </linearGradient>
        <linearGradient id="ff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3ff" />
          <stop offset="1" stopColor="#4aa7f5" />
        </linearGradient>
      </defs>
      <path d="M4 6a4 4 0 0 1 4-4h14l5 5h29a4 4 0 0 1 4 4v33a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="url(#fb)" />
      <path d="M2 15a4 4 0 0 1 4-4h52a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="url(#ff)" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 48 60" className="mac-folder-svg" aria-hidden="true">
      <path d="M4 4a3 3 0 0 1 3-3h26l12 12v43a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#fff" />
      <path d="M33 1v9a3 3 0 0 0 3 3h9" fill="#e5e5e5" />
      <rect x="11" y="20" width="26" height="9" rx="2" fill="#f7c948" />
      {[34, 40, 46].map((y) => <rect key={y} x="11" y={y} width="26" height="2.4" rx="1.2" fill="#d4d4d4" />)}
    </svg>
  );
}

function ToolIcon({ tool }: { tool: Tool }) {
  const [broken, setBroken] = useState(false);
  if (!tool.icon || broken) {
    const initials = tool.name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").map((w) => w[0]).join("").slice(0, 2);
    return <span className="mac-tile">{initials}</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={tool.icon} alt="" className="mac-tool-img" loading="lazy" onError={() => setBroken(true)} />;
}

/* ---------- windows ---------- */

type WinSpec =
  | { kind: "finder"; folder: number }
  | { kind: "notes"; note: "experience" | "hackathons" }
  | { kind: "about" };
type Win = WinSpec & { id: string };

function useDrag(onMove: (dx: number, dy: number) => void) {
  return (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    let lx = e.clientX, ly = e.clientY;
    const move = (ev: PointerEvent) => {
      onMove(ev.clientX - lx, ev.clientY - ly);
      lx = ev.clientX; ly = ev.clientY;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
}

function Window({
  win, z, pos, onFocus, onClose, onMove, onFolder, scale
}: {
  win: Win; z: number; pos: { x: number; y: number }; scale: number;
  onFocus: () => void; onClose: () => void; onMove: (dx: number, dy: number) => void; onFolder: (i: number) => void;
}) {
  const drag = useDrag((dx, dy) => onMove(dx / scale, dy / scale));
  const title = win.kind === "finder" ? skillFolders[win.folder].name : win.kind === "notes" ? (win.note === "experience" ? "Experience" : "Hackathons") : "About Neel";

  return (
    <motion.div
      className={`mac-win mac-win-${win.kind}`}
      style={{ left: pos.x, top: pos.y, zIndex: z }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={onFocus}
    >
      <div className="mac-win-bar" onPointerDown={drag}>
        <div className="mac-lights">
          <button aria-label="Close window" onClick={onClose} className="l-red" />
          <span className="l-yellow" />
          <span className="l-green" />
        </div>
        <span className="mac-win-title">{title}</span>
      </div>

      {win.kind === "finder" && (
        <div className="mac-finder">
          <aside>
            <p>Skills</p>
            {skillFolders.map((f, i) => (
              <button key={f.name} className={i === win.folder ? "on" : ""} onClick={() => onFolder(i)}>
                <span className="mac-side-ico">▭</span>{f.name}
              </button>
            ))}
          </aside>
          <div className="mac-finder-main" data-lenis-prevent>
            <div className="mac-grid">
              {skillFolders[win.folder].tools.map((t) => (
                <div key={t.name} className="mac-app">
                  <span className="mac-app-ico"><ToolIcon tool={t} /></span>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
            <p className="mac-finder-foot">{skillFolders[win.folder].tools.length} items · {skillFolders[win.folder].note}</p>
          </div>
        </div>
      )}

      {win.kind === "notes" && (
        <div className="mac-notes" data-lenis-prevent>
          {win.note === "experience"
            ? portfolioData.experience.map((e) => (
                <div key={e.role + e.period} className="mac-note-row">
                  <b>{e.role}</b>
                  <span>{e.company} · {e.period}</span>
                </div>
              ))
            : portfolioData.achievements.map((a) => (
                <div key={a.title} className="mac-note-row">
                  <b>{a.title}</b>
                  <span>{a.organization} · {a.status}</span>
                </div>
              ))}
        </div>
      )}

      {win.kind === "about" && (
        <div className="mac-about">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portfolioData.hero.profileImage} alt="Neel Sonawane" />
          <h4>Neel Sonawane</h4>
          <p className="mac-about-sub">AI developer · Full-stack builder</p>
          <dl>
            <dt>Based in</dt><dd>Pune, India</dd>
            <dt>Now</dt><dd>{portfolioData.experience[0].role}, {portfolioData.experience[0].company.split(" ·")[0]}</dd>
            <dt>Status</dt><dd>{portfolioData.hero.badge}</dd>
          </dl>
          <Link href="/about" className="mac-about-btn">More about me</Link>
        </div>
      )}
    </motion.div>
  );
}

/* ---------- desktop ---------- */

const DESK_ITEMS: { label: string; x: number; y: number; open: () => WinSpec | "resume" }[] = [
  ...skillFolders.map((f, i) => ({
    label: f.name,
    x: [5, 20, 36, 7, 22, 6, 21][i],
    y: [10, 8, 13, 36, 40, 62, 66][i],
    open: () => ({ kind: "finder" as const, folder: i })
  })),
  { label: "Experience", x: 88, y: 9, open: () => ({ kind: "notes" as const, note: "experience" as const }) },
  { label: "Hackathons", x: 88, y: 31, open: () => ({ kind: "notes" as const, note: "hackathons" as const }) },
  { label: "Résumé.pdf", x: 88, y: 53, open: () => "resume" as const }
];

// design size of the Mac screen, scaled to fit; phones get a taller, narrower desktop
const WIDE = { w: 1180, h: 737.5 };
const COMPACT = { w: 620, h: 827 };

export function MacDesktop() {
  const section = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [compact, setCompact] = useState(false);
  const D = compact ? COMPACT : WIDE;
  const SCREEN_W = D.w;
  const [intro, setIntro] = useState(true);
  const [wins, setWins] = useState<Win[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const time = useLocalTime();
  const counter = useRef(0);
  const router = useRouter();

  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "start start"] });
  const macScale = useTransform(scrollYProgress, [0, 1], [0.84, 1]);
  const macRotate = useTransform(scrollYProgress, [0, 1], [14, 0]);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const small = el.clientWidth < 600;
      setCompact(small);
      setScale(el.clientWidth / (small ? COMPACT.w : WIDE.w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const focus = useCallback((id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]), []);

  const open = useCallback((w: WinSpec | "resume") => {
    setMenu(null);
    if (w === "resume") {
      window.open(portfolioData.contact.resume, "_blank", "noopener,noreferrer");
      return;
    }
    // re-use an existing window of the same kind
    const existing = wins.find((x) => x.kind === w.kind && (w.kind !== "notes" || (x.kind === "notes" && x.note === w.note)));
    if (existing) {
      if (w.kind === "finder") {
        const folder = w.folder;
        setWins((ws) => ws.map((x) => (x.id === existing.id && x.kind === "finder" ? { ...x, folder } : x)));
      }
      focus(existing.id);
      return;
    }
    const id = `w${counter.current++}`;
    const k = wins.length;
    setWins((ws) => [...ws, { ...w, id } as Win]);
    setPos((p) => ({ ...p, [id]: compact ? { x: 12 + k * 10, y: 60 + k * 26 } : { x: 220 + k * 34, y: 70 + k * 30 } }));
    focus(id);
  }, [wins, focus, compact]);

  const close = (id: string) => {
    setWins((ws) => ws.filter((w) => w.id !== id));
    setOrder((o) => o.filter((x) => x !== id));
  };

  const touch = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

  const MENUS: Record<string, { label: string; act: () => void }[]> = {
    apple: [
      { label: "About This Mac", act: () => open({ kind: "about" }) },
      { label: "Résumé…", act: () => open("resume") }
    ],
    Go: [
      { label: "Work", act: () => router.push("/work") },
      { label: "About", act: () => router.push("/about") },
      { label: "Contact", act: () => router.push("/contact") }
    ],
    Window: [
      { label: "Close All", act: () => { setWins([]); setOrder([]); setMenu(null); } },
      ...skillFolders.slice(0, 3).map((f, i) => ({ label: f.name, act: () => open({ kind: "finder", folder: i }) }))
    ],
    Help: [{ label: "Double-click a folder to open it", act: () => setMenu(null) }]
  };

  return (
    <section ref={section} className="ns-mac">
      <div className="ns-mac-head">
        <p className="script-heading on-dark">my setup</p>
        <h2 className="ns-mac-title">Everything I build with,<br />on one desktop.</h2>
        <p className="ns-mac-copy">
          Models, frameworks, databases and the automation glue, sorted into folders.
          Open one and poke around, it all works.
        </p>
      </div>

      <motion.div className="ns-macbook" style={{ scale: macScale, rotateX: macRotate }}>
        <div className="ns-mac-lid">
          <div className="ns-mac-camera" />
          <div className="ns-mac-screen" ref={screenRef} onClick={() => { setSelected(null); setMenu(null); }}>
            <div className={`ns-mac-canvas ${compact ? "compact" : ""}`} style={{ width: D.w, height: D.h, transform: `scale(${scale})` }}>
              <div className="mac-wall" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => <i key={i} />)}
              </div>

              {/* menu bar */}
              <div className="mac-menubar" onClick={(e) => e.stopPropagation()}>
                <button className="mac-mb-apple" onClick={() => setMenu(menu === "apple" ? null : "apple")} aria-label="Apple menu">
                  <svg viewBox="0 0 14 17" width="13" height="16" fill="currentColor"><path d="M11.6 9c0-2 1.7-3 1.8-3-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.6 0-1.6-.7-2.7-.7C3.1 4.5 1.8 5.3 1 6.6c-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4-.1-.1-2.6-1-2.6-3.8zM9.5 3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z"/></svg>
                </button>
                <b>Finder</b>
                {["File", "Edit", "View", "Go", "Window", "Help"].map((m) => (
                  <button key={m} className={menu === m ? "on" : ""} onClick={() => setMenu(menu === m ? null : m)}>{m}</button>
                ))}
                <span className="mac-mb-right">
                  <svg viewBox="0 0 20 14" width="17" height="12" fill="currentColor"><path d="M10 2.5c2.7 0 5.2 1 7 2.8l1.4-1.4C16.2 1.7 13.2.5 10 .5S3.8 1.7 1.6 3.9L3 5.3c1.8-1.8 4.3-2.8 7-2.8zm0 4c1.6 0 3.1.6 4.2 1.7l1.4-1.4A8 8 0 0 0 10 4.5a8 8 0 0 0-5.6 2.3l1.4 1.4A6 6 0 0 1 10 6.5zm0 4a2 2 0 0 0-1.4.6L10 12.5l1.4-1.4a2 2 0 0 0-1.4-.6z"/></svg>
                  <span className="mac-batt"><i /></span>
                  <span>{time}</span>
                </span>
                {menu && (MENUS[menu] ?? [{ label: "Nothing to see here", act: () => setMenu(null) }]) && (
                  <div className={`mac-dropdown mac-dd-${menu}`}>
                    {(MENUS[menu] ?? [{ label: "Nothing to see here", act: () => setMenu(null) }]).map((it) => (
                      <button key={it.label} onClick={it.act}>{it.label}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* desktop icons */}
              {DESK_ITEMS.map((it, idx) => {
                const isNote = !it.label.startsWith("Résumé") && (it.label === "Experience" || it.label === "Hackathons");
                return (
                  <button
                    key={it.label}
                    className={`mac-icon ${selected === it.label ? "sel" : ""}`}
                    style={compact ? { left: `${(idx % 4) * 24 + 2}%`, top: `${Math.floor(idx / 4) * 17 + 6}%` } : { left: `${it.x}%`, top: `${it.y}%` }}
                    onClick={(e) => { e.stopPropagation(); setSelected(it.label); if (touch || compact) open(it.open()); }}
                    onDoubleClick={(e) => { e.stopPropagation(); open(it.open()); }}
                  >
                    {isNote || it.label.startsWith("Résumé") ? <NoteIcon /> : <FolderIcon />}
                    <span>{it.label}</span>
                  </button>
                );
              })}

              {wins.map((w) => (
                <Window
                  key={w.id}
                  win={w}
                  z={10 + order.indexOf(w.id)}
                  pos={pos[w.id] ?? { x: 240, y: 80 }}
                  scale={scale}
                  onFocus={() => focus(w.id)}
                  onClose={() => close(w.id)}
                  onMove={(dx, dy) =>
                    setPos((p) => {
                      const c = p[w.id] ?? { x: 240, y: 80 };
                      return { ...p, [w.id]: { x: Math.min(SCREEN_W - 160, Math.max(-200, c.x + dx)), y: Math.min(D.h - 100, Math.max(26, c.y + dy)) } };
                    })
                  }
                  onFolder={(i) => setWins((ws) => ws.map((x) => (x.id === w.id && x.kind === "finder" ? { ...x, folder: i } : x)))}
                />
              ))}

              {/* dock */}
              <div className="mac-dock" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => open({ kind: "finder", folder: 0 })} title="Finder"><span className="dock-ico dock-finder">☺</span></button>
                <button onClick={() => open({ kind: "about" })} title="About Me">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="dock-ico" src={portfolioData.hero.profileImage} alt="" />
                </button>
                <button onClick={() => open({ kind: "notes", note: "experience" })} title="Notes"><span className="dock-ico dock-notes" /></button>
                <a href={`mailto:${portfolioData.contact.email}`} title="Mail"><span className="dock-ico dock-mail">✉</span></a>
                <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="dock-ico dock-white" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="" />
                </a>
                <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"><span className="dock-ico dock-in">in</span></a>
                <Link href="/work" title="Work"><span className="dock-ico dock-work">▦</span></Link>
              </div>

              {intro && (
                <div className="mac-intro" onClick={(e) => e.stopPropagation()}>
                  <svg viewBox="0 0 40 40" width="46" height="46" aria-hidden="true" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 14l12 7-5.5 1.5L28 29l-3 1.5-3.5-6.5L18 28z" fill="#fff" />
                    <path d="M10 6l2 4M4 13l4 1.5M16 3l-.5 4.5" />
                  </svg>
                  <h3>Go on, click around.</h3>
                  <p>Folders open, windows drag, menus drop down and the Dock is live.</p>
                  <button onClick={() => setIntro(false)}>Let me in</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ns-mac-base"><i /></div>
      </motion.div>
    </section>
  );
}
