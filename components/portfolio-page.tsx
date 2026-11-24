"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { SplitText } from "@/components/split-text";
import { KineticNeel } from "@/components/kinetic-neel";
import { useContact } from "@/components/site/shell";
import { IntroReveal } from "@/components/home/intro-reveal";
import { SelectedWork } from "@/components/home/selected-work";
import { MacDesktop } from "@/components/home/mac-desktop";
import { SkillsAssemble } from "@/components/home/skills-assemble";
import { CraftRail } from "@/components/home/craft-rail";
import { ExperienceLine } from "@/components/home/experience-line";
import { ContactBlock } from "@/components/home/contact-block";
import { projects } from "@/data/projects";
import { portfolioData } from "@/data/portfolio";

function CrossIcon() {
  return (
    <svg className="cross-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10.7144 0H9.28563V8.27563L3.43375 2.42375L2.42375 3.43375L8.27563 9.28563H0V10.7144H8.27563L2.42375 16.5663L3.43375 17.5762L9.28563 11.7244V20H10.7144V11.7244L16.5663 17.5762L17.5762 16.5663L11.7244 10.7144H20V9.28563H11.7244L17.5762 3.43375L16.5663 2.42375L10.7144 8.27563V0Z"
        fill="#DC3545"
      />
    </svg>
  );
}

function ArrowLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H7M17 7v10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export function PortfolioPage() {
  const { open: openContactModal } = useContact();
  const [activeCertificate, setActiveCertificate] = useState<any | null>(null);

  const featuredStrip = useMemo(
    () => [...projects, ...projects],
    []
  );
  return (
    <>

        <section className="hero-section">
          {/* Background Liquid Blobs */}
          <div className="liquid-blob-1" />
          <div className="liquid-blob-2" />

          <div className="hero-header">
            <div className="hero-content">
              <motion.div
                className="profile-card"
                initial={{ opacity: 0.001 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.8, delay: 0.15 }}
              >
                <motion.div
                  className="profile-stack"
                  initial={{ opacity: 0.001, x: 150 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 1 }}
                >
                  <div className="avatar-shell">
                    <div className="avatar-cut avatar-cut-1">
                      <div className="avatar-circle avatar-circle-1" />
                    </div>
                    <div className="avatar-cut avatar-cut-2">
                      <div className="avatar-circle avatar-circle-2" />
                    </div>
                    <div className="avatar-cut avatar-cut-3">
                      <div className="avatar-circle avatar-circle-3" />
                    </div>
                    <div className="avatar-main">
                      <img
                        src={portfolioData.hero.profileImage}
                        alt={portfolioData.hero.name}
                      />
                    </div>
                  </div>

                  <div className="profile-info">
                    <div>
                      <h3 className="profile-name">{portfolioData.hero.name}.</h3>
                      <p className="profile-role">{portfolioData.hero.role}</p>
                      <div className="profile-intelligence">
                        i Build Intelligence<br />through Code.
                      </div>
                    </div>
                    <div className="profile-action-row">
                      <div className="availability-pill">
                        <span className="availability-dot" />
                        <span>{portfolioData.hero.badge}</span>
                      </div>
                      <a
                        className="resume-pill-btn"
                        href={portfolioData.contact.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resume ↓
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <div className="hero-copy">
                <div className="hero-heading-block">
                  <SplitText
                    as="p"
                    text={portfolioData.hero.headlineScript}
                    className="script-heading"
                  />
                  <KineticNeel />
                </div>

                <div className="hero-meta-row">
                  <SplitText
                    as="p"
                    text={portfolioData.hero.intro}
                    className="hero-intro"
                  />
                  <motion.div
                    className="hero-side-meta"
                    initial={{ opacity: 0.001 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  >
                    <p>{portfolioData.hero.experienceStat}</p>
                    <p className="local-stat-red"><em><strong>{portfolioData.hero.localStat}</strong></em></p>
                  </motion.div>
                </div>

                <p className="hero-summary">{portfolioData.hero.summary}</p>
              </div>
            </div>
          </div>
        </section>

        <IntroReveal />

        <SelectedWork />

        <section className="design-strip-section">
          <div className="mini-header">
            <span>// Featured Builds</span>
            <a
              href="/work"
            >
              View all
            </a>
          </div>

          <div className="showcase-strip">
            <div
              className="showcase-track"
              style={{ ["--n" as string]: portfolioData.projects.length }}
            >
              {featuredStrip.map((project, index) => (
                <Link
                  key={`${project.slug}-${index}`}
                  href={`/work/${project.slug}`}
                  className="showcase-item cursor-pointer"
                  aria-hidden={index >= projects.length}
                  tabIndex={index >= projects.length ? -1 : undefined}
                >
                  <div className="showcase-frame">
                    <div className="showcase-thumbnail">
                      <div className="showcase-thumbnail-inner">
                        <Image
                          src={project.mock.frontSm}
                          alt={`${project.name} app on iPhone`}
                          width={170}
                          height={350}
                          className="showcase-phone"
                          sizes="170px"
                        />
                      </div>
                    </div>
                    <div className="showcase-meta">
                      <span>{project.name}</span>
                      <span>{project.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <MacDesktop />

        <SkillsAssemble />

        <section className="experience-section dark-surface">
          <div className="section-title-center">
            <SplitText as="p" text="professional timeline" className="script-heading on-dark" />
            <SplitText as="h2" text="Work Experience" className="section-mega on-dark" style={{ fontSize: "80px", lineHeight: "80px" }} />
          </div>

          <ExperienceLine />

          <div className="achievements-section">
            <div className="section-title-center">
              <SplitText as="p" text="achievements" className="script-heading on-dark" />
              <SplitText as="h3" text="Hackathons & Participation" className="section-mega on-dark" style={{ fontSize: "80px", lineHeight: "80px" }} />
            </div>
            <div className="achievements-grid">
              {portfolioData.achievements.map((achievement, index) => (
                <motion.div
                  key={`${achievement.title}-${index}`}
                  className="achievement-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                >
                  <div className="achievement-badge">{achievement.category}</div>
                  <h4 className="achievement-title">{achievement.title}</h4>
                  <p className="achievement-org">{achievement.organization}</p>
                  <p className="achievement-status">{achievement.status}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="certifications-section">
            <div className="section-title-center">
              <SplitText as="p" text="credentials" className="script-heading on-dark" />
              <SplitText as="h3" text="Certifications" className="section-mega on-dark" style={{ fontSize: "80px", lineHeight: "80px" }} />
            </div>
            <div className="certifications-grid">
              {portfolioData.certifications.map((cert, index) => (
                <motion.div
                  key={`${cert.title}-${index}`}
                  className="certification-card"
                  onClick={() => setActiveCertificate(cert)}
                  style={{ cursor: "pointer" }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="certification-card-content">
                    <p className="certification-title">{cert.title}</p>
                    <p className="certification-issuer">{cert.issuer}</p>
                  </div>
                  <div className="certification-card-action">
                    <span>View Certificate</span>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <section className="terminal-section dark-surface">
            <div className="section-title-center">
              <SplitText as="p" text="interactive sandbox" className="script-heading on-dark" />
              <SplitText as="h3" text="Agent Console" className="section-mega on-dark" style={{ fontSize: "80px", lineHeight: "80px" }} />
            </div>
            <div className="terminal-container">
              <TerminalSandbox />
            </div>
          </section>

          <div className="marquee-row">
            <div className="marquee-track">
              {[
                "Agentic AI",
                "Generative Systems",
                "Machine Learning",
                "Full-stack Development",
                "Creative Automation",
                "Human-centered Interfaces",
                "AI Engineering"
              ]
                .concat([
                  "Agentic AI",
                  "Generative Systems",
                  "Machine Learning",
                  "Full-stack Development",
                  "Creative Automation",
                  "Human-centered Interfaces",
                  "AI Engineering"
                ])
                .map((item, index) => (
                  <div key={`${item}-${index}`} className="marquee-item">
                    <span>{item}</span>
                    <CrossIcon />
                  </div>
                ))}
            </div>
          </div>

        </section>

        <CraftRail />

        <section className="about-section">
          <div className="about-header">
            <div className="about-copy-wrap">
              <div className="section-title-left">
                <SplitText as="p" text="here's a little bit" className="script-heading" />
                <SplitText as="h2" text="About Me" className="section-mega about-mega" />
              </div>

              <div className="about-paragraphs">
                {portfolioData.about.map((paragraph) => (
                  <SplitText
                    key={paragraph}
                    as="p"
                    text={paragraph}
                    className="about-paragraph"
                  />
                ))}
              </div>
            </div>

            <motion.div
              className="about-portrait"
              initial={{ opacity: 0.001 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            >
              <img src="/travel-license.jpg" alt="Neel Sonawane - Permanent License of Travel" />
            </motion.div>
          </div>

          <div className="developer-os-section">
            <div className="section-title-center" style={{ marginTop: "60px", marginBottom: "40px" }}>
              <SplitText as="p" text="operational metrics" className="script-heading" />
              <SplitText as="h2" text="Developer OS" className="section-mega" style={{ fontSize: "80px", lineHeight: "80px" }} />
              <p className="developer-os-subtitle">
                Building AI products, shipping code, and turning ideas into reality.
              </p>
            </div>
            <DeveloperOS />
          </div>
        </section>

        <ContactBlock />


        {/* Certificate Preview Modal */}        {/* Certificate Preview Modal */}
        {activeCertificate && (
          <div className="modal-overlay" onClick={() => setActiveCertificate(null)}>
            <motion.div
              className="certificate-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="modal-header">
                <div>
                  <span className="achievement-badge" style={{ marginBottom: "6px", display: "inline-block" }}>Credential Verification</span>
                  <h3 className="modal-title" style={{ fontSize: "24px", lineHeight: "1.2" }}>{activeCertificate.title}</h3>
                  <p className="modal-subtitle" style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.6)", margin: "4px 0 0 0" }}>Issuer: {activeCertificate.issuer}</p>
                </div>
                <button className="modal-close" onClick={() => setActiveCertificate(null)} aria-label="Close modal">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="certificate-preview-body">
                {activeCertificate.file.endsWith('.pdf') ? (
                  <iframe
                    src={`${activeCertificate.file}#toolbar=0`}
                    title={activeCertificate.title}
                    className="certificate-iframe"
                  />
                ) : (
                  <img
                    src={activeCertificate.file}
                    alt={activeCertificate.title}
                    className="certificate-img"
                  />
                )}
              </div>
              
              <div className="certificate-modal-actions">
                <a
                  href={activeCertificate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link-btn"
                  style={{ width: "auto", display: "inline-flex", padding: "10px 20px" }}
                >
                  <span>Open Full Credential</span>
                  <ArrowLinkIcon />
                </a>
              </div>
            </motion.div>
          </div>
        )}
    </>
  );
}

function TerminalSandbox() {
  const [history, setHistory] = useState<string[]>([
    "Welcome to Neel's Agentic AI Terminal [Version 2.0.1]",
    "Type 'help' to view available commands, or click the buttons below.",
    ""
  ]);
  const [input, setInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const commands = {
    help: [
      "Available commands:",
      "  about        - Learn more about Neel Sonawane",
      "  skills       - Print core technical skill graph",
      "  agent        - Trigger a live autonomous AI Agent simulation",
      "  contact      - Get contact coordinates",
      "  clear        - Clear the terminal console"
    ],
    about: [
      "Name: Neel Sonawane",
      "Now: AI & Digital Transformation team @ VSQC Pvt. Ltd.",
      "Role: AI Developer & Agentic Systems Explorer",
      "Mission: Building intelligence across agents, automation, and full-stack software.",
      "Base: Pune, India"
    ],
    skills: [
      "Technical Skill Index:",
      "  Python         [██████████████████] 95%",
      "  AI Agents      [████████████████] 88%",
      "  Generative AI  [█████████████████] 92%",
      "  TypeScript/JS  [███████████████] 85%",
      "  React/Next.js  [███████████████] 85%",
      "  PostgreSQL     [██████████████] 80%",
      "  n8n Automation [██████████████████] 95%"
    ],
    contact: [
      "Coordinates:",
      "  Email:    neel.ai.dev@gmail.com",
      "  GitHub:   github.com/neel-develops",
      "  LinkedIn: linkedin.com/in/neel-dev"
    ],
    agent: [
      "🤖 Launching autonomous subagent conversation...",
      "⚙️ Task: 'Analyze portfolio performance and optimize loading time'",
      "🔍 [Agent] Executing tool: list_dir(DirectoryPath: './public')...",
      "📊 [System] Found assets: 'travel-license.jpg', 'india-intern-ai.jpg'",
      "🧠 [Agent] Thought: Image assets are high-resolution. Proposing WebP transition plan.",
      "✏️ [Agent] Executing tool: write_file(TargetFile: './implementation_plan.md')...",
      "✅ [System] File updated successfully.",
      "🎉 [Agent] Status: Task accomplished! Optimized images loaded in under 400ms."
    ]
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    let response: string[] = [];

    if (trimmed === "") {
      setHistory(prev => [...prev, "neel@agent-sandbox:~$"]);
      return;
    }

    if (trimmed === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (trimmed in commands) {
      response = commands[trimmed as keyof typeof commands];
    } else {
      response = [
        `Command not found: '${trimmed}'.`,
        "Type 'help' to see list of valid commands."
      ];
    }

    setHistory(prev => [
      ...prev,
      `neel@agent-sandbox:~$ ${cmdStr}`,
      ...response,
      ""
    ]);
    setInput("");
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    // Skip the initial mount so the page doesn't auto-scroll to the terminal on load
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    // Scroll only inside the terminal body, never the whole page
    const body = terminalEndRef.current?.parentElement;
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }, [history]);

  return (
    <div className="terminal-box">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
        </div>
        <div className="terminal-title">neel@agent-sandbox:~</div>
      </div>
      <div className="terminal-body">
        {history.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.startsWith("neel@agent-sandbox:~$") ? (
              <span>
                <span className="terminal-prompt-prefix">neel@agent-sandbox:~$</span>
                {line.substring(21)}
              </span>
            ) : line.includes("[Agent]") ? (
              <span className="terminal-line-agent">{line}</span>
            ) : line.includes("[System]") ? (
              <span className="terminal-line-system">{line}</span>
            ) : (
              line
            )}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt-prefix">neel@agent-sandbox:~$</span>
          <input
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommand(input);
              }
            }}
            aria-label="Terminal Input"
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
      <div className="terminal-quick-btns">
        <span className="quick-btn-label">Quick Run:</span>
        {Object.keys(commands).map((cmd) => (
          <button
            key={cmd}
            className="quick-btn"
            onClick={() => handleCommand(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, started]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

function GithubContributionGraph() {
  const cells = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7 * 16; i++) {
      // Deterministic calculation representing typical GitHub contribution patterns
      const seed = (i * 13 + i * i * 3) % 100;
      let level = 0;
      if (seed < 45) level = 0;      // 45% level 0
      else if (seed < 75) level = 1; // 30% level 1
      else if (seed < 90) level = 2; // 15% level 2
      else if (seed < 97) level = 3; // 7% level 3
      else level = 4;                // 3% level 4
      list.push(level);
    }
    return list;
  }, []);

  return (
    <div className="github-graph">
      {cells.map((level, i) => (
        <div key={i} className={`github-cell github-level-${level}`} />
      ))}
    </div>
  );
}

function NeuralNetwork() {
  return (
    <svg className="neural-network" viewBox="0 0 200 120">
      <line x1="20" y1="30" x2="70" y2="20" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
      <line x1="70" y1="20" x2="130" y2="80" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
      <line x1="20" y1="90" x2="70" y2="80" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
      <line x1="70" y1="80" x2="130" y2="20" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
      <line x1="130" y1="20" x2="180" y2="60" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
      <line x1="130" y1="80" x2="180" y2="60" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />

      <circle cx="20" cy="30" r="3" fill="#ff334b" />
      <circle cx="20" cy="90" r="3" fill="#ff334b" />
      <circle cx="70" cy="20" r="4" fill="#ff334b" />
      <circle cx="70" cy="80" r="4" fill="#ff334b" />
      <circle cx="130" cy="20" r="4" fill="#ff334b" />
      <circle cx="130" cy="80" r="4" fill="#ff334b" />
      <circle cx="180" cy="60" r="3.5" fill="#ff334b" />
    </svg>
  );
}

function DeveloperOS() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.2,
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      className="developer-os-grid"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Card 01 - GitHub */}
      <motion.div className="dev-os-card github-card" variants={cardVariants}>
        <div className="dev-os-card-inner">
          <div className="dev-os-card-header">
            <span className="dev-os-card-num">01</span>
            <span className="dev-os-card-title">GitHub</span>
          </div>
          <div className="dev-os-card-body">
            <div className="dev-os-large-value">
              <CountUp end={500} suffix="+" />
            </div>
            <p className="dev-os-large-label">Commits</p>
            <GithubContributionGraph />
          </div>
          <div className="dev-os-card-footer">
            Consistently building and shipping projects
          </div>
        </div>
        <div className="dev-os-card-hover-insight">
          <div className="insight-badge">Insight</div>
          <p className="insight-text">Top 5% contributor in June 2026 • 120-day streak</p>
        </div>
      </motion.div>

      {/* Card 02 - Projects */}
      <motion.div className="dev-os-card projects-card" variants={cardVariants}>
        <div className="dev-os-card-inner">
          <div className="dev-os-card-header">
            <span className="dev-os-card-num">02</span>
            <span className="dev-os-card-title">Projects</span>
          </div>
          <div className="dev-os-card-body">
            <div className="dev-os-large-value">
              <CountUp end={20} suffix="+" />
            </div>
            <p className="dev-os-large-label">Shipped</p>
            <div className="dev-os-project-bars">
              <div className="dev-os-bar-item"><span className="bar-label">AI Agents</span><div className="bar-bg"><div style={{ width: "80%" }} /></div></div>
              <div className="dev-os-bar-item"><span className="bar-label">SaaS & Full-Stack</span><div className="bar-bg"><div style={{ width: "70%" }} /></div></div>
              <div className="dev-os-bar-item"><span className="bar-label">Automations</span><div className="bar-bg"><div style={{ width: "90%" }} /></div></div>
            </div>
          </div>
          <div className="dev-os-card-footer">
            AI, SaaS, Automation & Full Stack
          </div>
        </div>
        <div className="dev-os-card-hover-insight">
          <div className="insight-badge">Insight</div>
          <p className="insight-text">85% active in production • average load &lt; 300ms</p>
        </div>
      </motion.div>

      {/* Card 03 - Experience */}
      <motion.div className="dev-os-card experience-card-os" variants={cardVariants}>
        <div className="dev-os-card-inner">
          <div className="dev-os-card-header">
            <span className="dev-os-card-num">03</span>
            <span className="dev-os-card-title">Experience</span>
          </div>
          <div className="dev-os-card-body">
            <div className="dev-os-experience-role">AI &amp; Digital Transformation</div>
            <div className="dev-os-experience-company">@ VSQC Pvt. Ltd.</div>
            <div className="dev-os-experience-duration">Aug 2026 - Present · Team member</div>
          </div>
          <div className="dev-os-card-footer">
            Building intelligent solutions and automated workflows
          </div>
        </div>
        <div className="dev-os-card-hover-insight">
          <div className="insight-badge">Insight</div>
          <p className="insight-text">Scaled API response times by 40% using FastAPI</p>
        </div>
      </motion.div>

      {/* Card 04 - Current Focus */}
      <motion.div className="dev-os-card focus-card" variants={cardVariants}>
        <div className="dev-os-card-inner">
          <div className="dev-os-card-header">
            <span className="dev-os-card-num">04</span>
            <span className="dev-os-card-title">Current Focus</span>
          </div>
          <div className="dev-os-card-body">
            <div className="dev-os-large-value glow-text">Vision QC</div>
            <p className="dev-os-focus-desc">Explainable AI quality inspection</p>
            <div className="dev-os-pulse-badge">
              <span className="pulse-dot" />
              <span>Capstone · Active Sprint</span>
            </div>
          </div>
          <div className="dev-os-card-footer">
            Real-time defect detection for smart manufacturing
          </div>
        </div>
        <div className="dev-os-card-hover-insight">
          <div className="insight-badge">Insight</div>
          <p className="insight-text">Friday OS is shipped. Now training and explaining defect-detection models for Vision QC.</p>
        </div>
      </motion.div>

      {/* Card 05 - Tech Arsenal */}
      <motion.div className="dev-os-card stack-card" variants={cardVariants}>
        <div className="dev-os-card-inner">
          <div className="dev-os-card-header">
            <span className="dev-os-card-num">05</span>
            <span className="dev-os-card-title">Stack</span>
          </div>
          <div className="dev-os-card-body">
            <div className="dev-os-stack-tags">
              {["Python", "React", "Next.js", "FastAPI", "PostgreSQL", "Docker", "AI Agents"].map((tag) => (
                <motion.span
                  key={tag}
                  className="stack-tag"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="dev-os-card-footer">
            Fully equipped tech arsenal
          </div>
        </div>
        <div className="dev-os-card-hover-insight">
          <div className="insight-badge">Insight</div>
          <p className="insight-text">Specialized in agentic pipelines &amp; serverless backends</p>
        </div>
      </motion.div>

      {/* Card 06 - Builder Mode */}
      <motion.div className="dev-os-card builder-card" variants={cardVariants}>
        <div className="dev-os-card-inner">
          <div className="dev-os-card-header">
            <span className="dev-os-card-num">06</span>
            <span className="dev-os-card-title">Builder Mode</span>
          </div>
          <div className="dev-os-card-body">
            <div className="builder-stats-list">
              <div className="stat-row">
                <span className="stat-key">Level</span>
                <span className="stat-val">19</span>
              </div>
              <div className="stat-row">
                <span className="stat-key">Status</span>
                <span className="stat-val status-shipping">Shipping</span>
              </div>
              <div className="stat-row">
                <span className="stat-key">Location</span>
                <span className="stat-val">Pune, India</span>
              </div>
              <div className="stat-row no-border">
                <span className="stat-key">Role</span>
                <span className="stat-val">AI Engineer</span>
              </div>
            </div>
            <NeuralNetwork />
          </div>
          <div className="dev-os-card-footer">
            Founder &amp; AI developer mindset
          </div>
        </div>
        <div className="dev-os-card-hover-insight">
          <div className="insight-badge">Insight</div>
          <p className="insight-text">Active on GitHub and Discord builder communities</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
