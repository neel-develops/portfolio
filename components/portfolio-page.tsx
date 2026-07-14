"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { SplitText } from "@/components/split-text";
import { KineticNeel } from "@/components/kinetic-neel";
import { portfolioData } from "@/data/portfolio";

const EMAILJS_PUBLIC_KEY = "0_skvr2XAjtCQ-v8X";
const EMAILJS_SERVICE_ID = "service_ag7cvgm";
const EMAILJS_TEMPLATE_ID = "template_4bsb9ct";

function useLocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(new Date())
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function SparkIcon() {
  return (
    <svg className="spark-icon" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M1.5 6C4.634 6 6 4.6815 6 1.5C6 4.6815 7.3565 6 10.5 6C7.3565 6 6 7.3565 6 10.5C6 7.3565 4.634 6 1.5 6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function PortfolioPage() {
  const time = useLocalTime();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<any | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const openContactModal = () => {
    setFormState('idle');
    setIsContactOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setFormState('sending');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: data.get('name'),
          email: data.get('email'),
          title: data.get('subject'),
          message: data.get('message')
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setFormState('success');
      form.reset();
      setTimeout(() => {
        setIsContactOpen(false);
        setFormState('idle');
      }, 2200);
    } catch (err) {
      console.error('EmailJS error:', err);
      setFormState('error');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem("theme", theme);
  }, [theme]);
  const marqueeSkills = useMemo(
    () => [...portfolioData.skills, ...portfolioData.skills],
    []
  );
  const featuredStrip = useMemo(
    () => [...portfolioData.projects, ...portfolioData.projects],
    []
  );
  const statementColumns = useMemo(
    () => [
      portfolioData.statements.slice(0, 2),
      portfolioData.statements.slice(2, 4),
      portfolioData.statements.slice(4, 6)
    ],
    []
  );
  const learningColumns = useMemo(
    () => [
      portfolioData.learnings.slice(0, 2),
      portfolioData.learnings.slice(2, 4),
      portfolioData.learnings.slice(4, 6)
    ],
    []
  );
  const certificationPairs = useMemo(
    () => [
      portfolioData.certifications.slice(0, 2),
      portfolioData.certifications.slice(2, 4)
    ],
    []
  );


  return (
    <main className="portfolio-shell">
      <div className="reference-root">
        <header className="top-nav">
          <div className="brand-lockup">
            <span className="brand-mark">NS</span>
            <SparkIcon />
            <span className="brand-tag">AI</span>
          </div>

          <button
            className="nav-connect-btn"
            onClick={openContactModal}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <span className="connect-pulse" />
            <span>Lets Connect</span>
          </button>

          <div className="nav-actions">
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>
        </header>

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
                transition={{ type: "spring", bounce: 0.5, duration: 2, delay: 1.5 }}
              >
                <motion.div
                  className="profile-stack"
                  initial={{ opacity: 0.001, x: 150 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 3 }}
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
                    transition={{ type: "spring", bounce: 0.2, duration: 2 }}
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

        <section className="projects-section dark-surface">
          <div className="section-title-lockup">
            <SplitText as="p" text="featured work" className="script-heading on-dark" />
            <SplitText as="h2" text="projects" className="section-mega on-dark" />
          </div>

          <div className="featured-projects-grid">
            {portfolioData.projects.slice(0, 3).map((project, index) => (
              <motion.a
                key={`${project.title}-${index}`}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`featured-project-card ${
                  index === 1 ? "featured-project-card-tall" : ""
                }`}
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  type: "spring",
                  bounce: 0.22,
                  duration: 1.1,
                  delay: index * 0.08
                }}
              >
                <div className={`project-cover project-cover-${index + 1}`}>
                  <div className="project-cover-overlay" />
                  <div className="project-cover-mark">
                    <CrossIcon />
                    <span>{project.tags[0]}</span>
                  </div>
                </div>
                <div className="project-copy">
                  <p className="project-title">{project.title}</p>
                  <p className="project-description">{project.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="design-strip-section">
          <div className="mini-header">
            <span>// Featured Builds</span>
            <a
              href={portfolioData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              View all
            </a>
          </div>

          <div className="showcase-strip">
            <div className="showcase-track">
              {featuredStrip.map((project, index) => (
                <div
                  key={`${project.title}-${index}`}
                  className="showcase-item cursor-pointer"
                  onClick={() => setActiveProject(project)}
                >
                  <div className="showcase-frame">
                    <div className="showcase-thumbnail">
                      <div className="showcase-thumbnail-inner">
                        <span className="showcase-thumbnail-title">{project.title}</span>
                        <span className="showcase-thumbnail-subtitle">
                          {project.tags.slice(0, 2).join(" · ")}
                        </span>
                      </div>
                    </div>
                    <div className="showcase-meta">
                      <span>{project.title}</span>
                      <span>AI</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="experience-section dark-surface">
          <div className="section-title-center">
            <SplitText as="p" text="professional timeline" className="script-heading on-dark" />
            <SplitText as="h2" text="Work Experience" className="section-mega on-dark" style={{ fontSize: "80px", lineHeight: "80px" }} />
          </div>

          <div className="experience-list">
            {portfolioData.experience.map((exp, index) => (
              <motion.div
                key={`${exp.role}-${index}`}
                className="experience-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
              >
                <div className="experience-main">
                  <div className="experience-icon">
                    <BriefcaseIcon />
                  </div>
                  <div className="experience-copy">
                    <p className="experience-title">{exp.role}</p>
                    <p className="experience-company">{exp.company}</p>
                    <p className="experience-description">{exp.description}</p>
                  </div>
                </div>
                <span className="experience-date">{exp.period}</span>
              </motion.div>
            ))}
          </div>

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

          <div className="section-title-center second-block">
            <SplitText as="p" text="learning journey" className="script-heading on-dark" />
            <SplitText as="h2" text="recent learnings" className="section-mega on-dark" />
          </div>

          <div className="statement-columns">
            {learningColumns.map((column, columnIndex) => (
              <div key={`learning-column-${columnIndex}`} className="statement-column">
                {column.map((learning, learningIndex) => (
                  <motion.div
                    key={`${learning.title}-${learningIndex}`}
                    className="statement-card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                      delay: (columnIndex + learningIndex) * 0.06
                    }}
                  >
                    <div className="statement-head">
                      <div className="statement-avatar">
                        <img src={portfolioData.hero.profileImage} alt="" />
                      </div>
                      <div>
                        <p className="statement-title">{learning.title}</p>
                        <p className="statement-meta">Currently Exploring</p>
                      </div>
                    </div>
                    <p className="statement-body">
                      {learning.body.split(learning.accent).map((part, index, parts) => (
                        <span key={`${learning.title}-${index}`}>
                          {part}
                          {index < parts.length - 1 ? (
                            <strong>{learning.accent}</strong>
                          ) : null}
                        </span>
                      ))}
                    </p>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </section>

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

        <footer className="footer-section dark-footer">
          <div className="footer-visual">
            <div className="footer-video-wrap">
              <video
                className="footer-video"
                src="/footer-gradient.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="footer-video-overlay" />
            </div>

            <div className="footer-border-line" />
            <svg className="footer-shape footer-shape-center" viewBox="-1 -1 569 602" aria-hidden="true">
              <path
                d="M283.878 149.808V0H567V149.808C567 232.56 503.606 299.616 425.439 299.616C347.272 299.616 283.878 232.56 283.878 149.808ZM283.122 149.808V299.616H0V0H141.561C219.728 0 283.122 67.0565 283.122 149.808ZM425.439 300.384H567V600H425.439C347.272 600 283.878 532.943 283.878 450.192V300.384H425.439ZM283.122 450.192V600H0V450.192C0 367.44 63.3936 300.384 141.561 300.384C219.728 300.384 283.122 367.44 283.122 450.192Z"
                fill="rgba(255,255,255,0.01)"
                stroke="#262626"
                strokeWidth="1.00751"
              />
            </svg>
            <svg className="footer-shape footer-shape-left" viewBox="-1 -1 569 602" aria-hidden="true">
              <path
                d="M283.878 149.808V0H567V149.808C567 232.56 503.606 299.616 425.439 299.616C347.272 299.616 283.878 232.56 283.878 149.808ZM283.122 149.808V299.616H0V0H141.561C219.728 0 283.122 67.0565 283.122 149.808ZM425.439 300.384H567V600H425.439C347.272 600 283.878 532.943 283.878 450.192V300.384H425.439ZM283.122 450.192V600H0V450.192C0 367.44 63.3936 300.384 141.561 300.384C219.728 300.384 283.122 367.44 283.122 450.192Z"
                fill="rgba(255,255,255,0.01)"
                stroke="#262626"
                strokeWidth="1.00751"
              />
            </svg>
            <svg className="footer-shape footer-shape-right" viewBox="-1 -1 569 602" aria-hidden="true">
              <path
                d="M283.878 149.808V0H567V149.808C567 232.56 503.606 299.616 425.439 299.616C347.272 299.616 283.878 232.56 283.878 149.808ZM283.122 149.808V299.616H0V0H141.561C219.728 0 283.122 67.0565 283.122 149.808ZM425.439 300.384H567V600H425.439C347.272 600 283.878 532.943 283.878 450.192V300.384H425.439ZM283.122 450.192V600H0V450.192C0 367.44 63.3936 300.384 141.561 300.384C219.728 300.384 283.122 367.44 283.122 450.192Z"
                fill="rgba(255,255,255,0.01)"
                stroke="#262626"
                strokeWidth="1.00751"
              />
            </svg>
            <div className="footer-glow" />

            <div className="footer-content">
              <SplitText as="p" text="lets build something" className="script-heading on-dark footer-script" />
              <SplitText
                as="p"
                text="Always curious about how things work"
                className="footer-heading"
              />

              <div className="footer-actions">
                <a
                  className="footer-email"
                  href={`mailto:${portfolioData.contact.email}`}
                >
                  {portfolioData.contact.email}
                </a>
                <button
                  className="footer-button"
                  onClick={openContactModal}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  Lets Connect
                </button>
              </div>

              <div className="footer-embed">
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/track/4jkYkvbjEuckbJs6Ts60Hk?utm_source=generator"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
 
          <div className="footer-meta">
            <div className="footer-socials">
              <a
                href={portfolioData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href={portfolioData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                gh
              </a>
              <a
                href="https://x.com/neel-develops"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X/Twitter"
                className="x-link"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <div className="footer-typewriter-wrap">
              <div className="typewriter-badge">
                <span>&lt; Code By Neel /&gt;</span>
                <span className="typewriter-cursor">|</span>
              </div>
            </div>
 
            <SplitText
              as="p"
              text="© 2026 Portfolio - Neel Sonawane"
              className="footer-copyright"
            />
          </div>
        </footer>

        {/* Contact Form Modal */}
        {isContactOpen && (
          <div className="modal-overlay" onClick={() => setIsContactOpen(false)}>
            <motion.div
              className="modal-box"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Background Gradient Video */}
              <div className="modal-video-wrap">
                <video
                  className="modal-video"
                  src="/footer-gradient.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="modal-video-overlay" />
              </div>

              <div className="modal-header">
                <h3 className="modal-title">Send me a message</h3>
                <button className="modal-close" onClick={() => setIsContactOpen(false)} aria-label="Close modal">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <form className="modal-form" onSubmit={handleContactSubmit}>
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
                  <textarea id="modal-message" name="message" rows={4} placeholder="Your message here..." required></textarea>
                </div>

                <button type="submit" className="form-submit" disabled={formState === 'sending'}>
                  {formState === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                <div
                  className={`form-status${formState === 'success' ? ' success' : formState === 'error' ? ' error' : ''}`}
                  role="alert"
                >
                  {formState === 'success'
                    ? "✓ Message sent! I'll get back to you soon."
                    : formState === 'error'
                    ? "✗ Couldn't send right now. Email me directly at neel.ai.dev@gmail.com"
                    : ''}
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Project Details Modal */}
        {activeProject && (
          <div className="modal-overlay" onClick={() => setActiveProject(null)}>
            <motion.div
              className="project-details-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="modal-header">
                <div>
                  <span className="achievement-badge" style={{ marginBottom: "6px", display: "inline-block" }}>Featured Work</span>
                  <h3 className="modal-title" style={{ fontSize: "28px" }}>{activeProject.title}</h3>
                </div>
                <button className="modal-close" onClick={() => setActiveProject(null)} aria-label="Close modal">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="modal-grid">
                <div className="modal-meta-info">
                  <div className="modal-project-desc">
                    {activeProject.description}
                  </div>
                  
                  <div className="modal-divider" />
                  
                  <div className="modal-input-group">
                    <span className="modal-details-label" style={{ marginBottom: "8px", display: "block" }}>Technologies Used</span>
                    <div className="modal-tags-flex">
                      {activeProject.tags.map((tag: string) => (
                        <span key={tag} className="modal-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="modal-divider" />
                  
                  <div className="modal-details-grid">
                    <span className="modal-details-label">Role</span>
                    <span className="modal-details-val">Lead AI Engineer</span>
                    
                    <span className="modal-details-label">Type</span>
                    <span className="modal-details-val">Open Source Systems</span>
                    
                    <span className="modal-details-label">Scale</span>
                    <span className="modal-details-val">High-Performance Core</span>
                  </div>
                  
                  <div className="modal-divider" style={{ marginTop: "auto" }} />
                  
                  <a
                    href={activeProject.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link-btn"
                  >
                    <span>Inspect Codebase</span>
                    <ArrowLinkIcon />
                  </a>
                </div>

                <div className="project-screens-container">
                  <span className="modal-details-label">App Screens & Interaction</span>
                  <ProjectScreens project={activeProject} />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Certificate Preview Modal */}
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
      </div>
    </main>
  );
}

function ProjectScreens({ project }: { project: any }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "ui" | "logs">("dashboard");
  const [logs, setLogs] = useState<string[]>([]);
  const [activeMetric, setActiveMetric] = useState(42);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Check if we can embed the project URL in an iframe
  const isFrameable = project.href && (
    project.href.includes("github.io") || 
    project.href.includes("vercel.app") || 
    project.href.includes("netlify.app") ||
    project.href.includes("herokuapp.com") ||
    project.href.includes("localhost")
  );

  // Re-initialize state when project changes
  useEffect(() => {
    setIframeLoading(true);
    setLogs([
      "System initialized successfully.",
      "Connection established with secure endpoint.",
      `Model loaded: ${project.tags[0] || "GPT-4"}`,
      "Ready to accept live streaming queries."
    ]);
  }, [project]);

  // Handle typing interval for dashboard load metric and log streaming
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [
        ...prev.slice(-3),
        `Event logged at ${new Date().toLocaleTimeString()} - Status OK`
      ]);
      setActiveMetric(Math.floor(Math.random() * 30) + 70);
    }, 3000);
    return () => clearInterval(interval);
  }, [project]);

  return (
    <div className="project-screens-container">
      <div className="screen-tabs">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button className={activeTab === "ui" ? "active" : ""} onClick={() => setActiveTab("ui")}>Live Preview</button>
        <button className={activeTab === "logs" ? "active" : ""} onClick={() => setActiveTab("logs")}>Console Logs</button>
      </div>
      <div className="mockup-frame">
        <div className="mockup-header">
          <div className="mockup-dots"><span/><span/><span/></div>
          <div className="mockup-address">{project.href || `localhost:3000/${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}</div>
        </div>
        <div 
          className={`mockup-viewport ${activeTab === "ui" && isFrameable ? "viewport-full" : ""}`}
          style={{ position: "relative" }}
        >
          {activeTab === "dashboard" && (
            <div className="mock-dash">
              <div className="mock-widgets">
                <div className="mock-widget">
                  <span className="widget-label">System Load</span>
                  <span className="widget-value">{activeMetric}%</span>
                  <div className="widget-bar"><div style={{ width: `${activeMetric}%` }}/></div>
                </div>
                <div className="mock-widget">
                  <span className="widget-label">Response Time</span>
                  <span className="widget-value">124ms</span>
                  <div className="widget-bar"><div style={{ width: "24%", backgroundColor: "#ff334b" }}/></div>
                </div>
              </div>
              <div className="mock-chart-box">
                <span className="widget-label">Realtime Traffic Stream</span>
                <div className="mock-chart-bars">
                  {[45, 60, 55, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                    <div key={i} className="chart-bar-col" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "ui" && (
            <div className="mock-ui" style={{ height: "100%", width: "100%" }}>
              {isFrameable ? (
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                  {iframeLoading && (
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "#080808",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      zIndex: 5
                    }}>
                      <span className="spinner" style={{ 
                        width: "24px", 
                        height: "24px", 
                        border: "3px solid rgba(255,255,255,0.1)", 
                        borderTop: "3px solid var(--accent)", 
                        borderRadius: "50%", 
                        display: "inline-block", 
                        animation: "spin 0.8s linear infinite" 
                      }}/>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Connecting to live deployment...
                      </span>
                    </div>
                  )}
                  <iframe 
                    src={project.href} 
                    title={project.title}
                    onLoad={() => setIframeLoading(false)}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      border: "none", 
                      background: "white"
                    }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
              ) : (
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  height: "100%", 
                  padding: "20px", 
                  textAlign: "center",
                  gap: "16px"
                }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    background: "rgba(255, 255, 255, 0.03)", 
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)"
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", color: "white", marginBottom: "4px", fontWeight: "600" }}>Codebase & Backend Integration</h4>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", maxWidth: "260px", margin: "0 auto", lineHeight: "1.4" }}>
                      This project operates as a command-line script, AI API backend, or serverless service. 
                    </p>
                  </div>
                  <a 
                    href={project.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mock-action-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "white",
                      color: "black",
                      textDecoration: "none",
                      fontSize: "12px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      padding: "8px 16px"
                    }}
                  >
                    Inspect GitHub Repository ↗
                  </a>
                </div>
              )}
            </div>
          )}
          {activeTab === "logs" && (
            <div className="mock-logs">
              {logs.map((log, i) => (
                <div key={i} className="log-line">
                  <span className="log-time">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
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
      "Candidate Name: Neel Sonawane",
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

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
              <CountUp end={1500} suffix="+" />
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
            <div className="dev-os-experience-role">AI Intern</div>
            <div className="dev-os-experience-company">@ VSQC Pvt. Ltd.</div>
            <div className="dev-os-experience-duration">June 2026 - Present</div>
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
            <div className="dev-os-large-value glow-text">Friday OS</div>
            <p className="dev-os-focus-desc">Agentic AI</p>
            <div className="dev-os-pulse-badge">
              <span className="pulse-dot" />
              <span>Active Sprint</span>
            </div>
          </div>
          <div className="dev-os-card-footer">
            AI-powered agentic platform
          </div>
        </div>
        <div className="dev-os-card-hover-insight">
          <div className="insight-badge">Insight</div>
          <p className="insight-text">Next-gen desktop automation &amp; agentic workflows active</p>
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
