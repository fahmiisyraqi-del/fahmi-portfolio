import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDownRight, ArrowUpRight, ArrowRight, Bot, Menu, Pause, Play, X, Mail, Linkedin, Instagram, Github, Sparkles, MoveUpRight, SkipForward } from "lucide-react";
import "./style.css";
import "./agents.css";

const agentIds = Array.from({ length: 6 }, (_, index) => index + 1);
const sections = ["top", "about", "experience", "projects", "skills", "education", "contact"];
const tourDownDuration = 24000;
const tourUpDuration = 5000;

function createTimeline() {
  let tasks = [];
  let paused = false;

  const arm = task => {
    task.dueAt = Date.now() + task.remaining;
    task.timer = window.setTimeout(() => {
      tasks = tasks.filter(item => item !== task);
      task.callback();
    }, task.remaining);
  };

  return {
    schedule(entries) {
      this.clear();
      tasks = entries.map(({ delay, callback }) => ({ remaining: delay, callback, timer: null }));
      if (!paused) tasks.forEach(arm);
    },
    setPaused(nextPaused) {
      if (paused === nextPaused) return;
      paused = nextPaused;
      if (paused) {
        tasks.forEach(task => {
          window.clearTimeout(task.timer);
          task.remaining = Math.max(0, task.dueAt - Date.now());
        });
      } else {
        tasks.forEach(arm);
      }
    },
    clear() {
      tasks.forEach(task => window.clearTimeout(task.timer));
      tasks = [];
    }
  };
}

const projects = [
  {
    n: "01", type: "DIGITAL COMMERCE · INDEPENDENT PROJECT",
    title: "Digital Product Store", year: "2026",
    url: "https://lynk.id/fahmi_10",
    desc: "Set up a storefront on Lynk.id to explore how digital products are presented and organized for online audiences.",
    tags: ["Lynk.id", "Digital storefront", "AI-assisted workflow"],
    note: "Store setup and initial exploration; no sales or revenue claimed."
  },
  {
    n: "02", type: "BUSINESS CONCEPT · SKILLPASS DSC S17",
    title: "SkillPass", year: "2026",
    desc: "I built the SkillPass idea and its supporting data, then took part in Founders Arena. I did not advance to the next round; the concept and materials show the work I developed.",
    tags: ["Business concept", "Pitch deck", "Entrepreneurship"],
    note: "Concept-stage work; no prototype, clients, or traction claimed.",
    resources: [
      { label: "Pitch deck PDF", url: "/documents/skillpass-pitch-deck.pdf" },
      { label: "Plain-language guide PDF", url: "/documents/skillpass-guide.pdf" }
    ]
  },
  {
    n: "03", type: "MARKETING · PROPERTY",
    title: "Property Content Exploration", year: "2026",
    desc: "Developing practical ideas for property marketing, with an emphasis on short-form video, clear hooks, informative captions, and calls to action.",
    tags: ["Content ideas", "TikTok", "Instagram Reels"],
    note: "Portfolio exercise and marketing preparation."
  }
];

const skills = [
  ["Business & Management", "Business fundamentals", "Entrepreneurship", "Project coordination"],
  ["Communication", "Public speaking", "Team leadership", "Written communication"],
  ["Digital", "Digital content planning", "AI-assisted tools", "Online platforms"],
  ["Activities", "Paskibra", "Scouting", "Student organization"]
];

const languages = [
  { name: "Arabic", level: "Beginner", flag: "/flags/sa.svg", country: "Saudi Arabia" },
  { name: "English", level: "Advanced", flag: "/flags/gb.svg", country: "United Kingdom" },
  { name: "Indonesian", level: "Native", flag: "/flags/id.svg", country: "Indonesia" }
];

const certificates = [
  { title: "My Certificate", url: "/documents/my-certificate.pdf" },
  { title: "Japan Certificate", url: "/documents/japan-certificate.pdf" }
];

function AgentOverlay({ active, paused, section, overlayRef }) {
  if (!active) return null;

  return <div ref={overlayRef} className={`agent-layer is-active section-${section}${paused ? " is-paused" : ""}`} aria-hidden="true">
    <div className="build-frame" />
    {agentIds.map(id => <div className={`agent-cursor cursor-${id}`} key={`agent-${id}`}>
      <Bot size={17} strokeWidth={1.7} />
      <b>AGENT_0{id}</b>
    </div>)}
  </div>;
}

function App() {
  const [tour, setTour] = useState(false);
  const [menu, setMenu] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [agentsOn, setAgentsOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [introStage, setIntroStage] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const forceAgents = new URLSearchParams(window.location.search).get("agents") === "on";
  const [motionAllowed, setMotionAllowed] = useState(() => forceAgents || !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [intro, setIntro] = useState(motionAllowed);
  const timeline = useRef(null);
  const scrollTour = useRef(null);
  const initialTourStarted = useRef(false);
  const overlayRef = useRef(null);
  const activeSectionRef = useRef("top");
  const scrollFrame = useRef(0);
  if (!timeline.current) timeline.current = createTimeline();

  const finishIntro = () => {
    timeline.current.clear();
    setIntro(false);
    setPaused(false);
    timeline.current.setPaused(false);
  };

  const startTour = () => {
    initialTourStarted.current = true;
    timeline.current.clear();
    timeline.current.setPaused(false);
    setPaused(false);
    setIntro(false);
    setTour(true);
    setRevealed(false);
    setRevealed(true);
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!motionAllowed) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      window.scrollTo({ top: 0, behavior: "instant" });
      setTour(false);
      return;
    }

    const now = performance.now();
    const state = {
      frame: 0,
      phase: "down",
      startedAt: now,
      elapsed: 0,
      startY: 0,
      targetY: Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    };
    scrollTour.current = state;

    const step = timestamp => {
      if (scrollTour.current !== state) return;
      const duration = state.phase === "down" ? tourDownDuration : tourUpDuration;
      const progress = Math.min(1, (state.elapsed + timestamp - state.startedAt) / duration);
      const eased = .5 - Math.cos(Math.PI * progress) / 2;
      window.scrollTo({ top: state.startY + (state.targetY - state.startY) * eased, behavior: "instant" });

      if (progress === 1 && state.phase === "down") {
        state.phase = "up";
        state.startedAt = timestamp;
        state.elapsed = 0;
        state.startY = state.targetY;
        state.targetY = 0;
      } else if (progress === 1) {
        scrollTour.current = null;
        setTour(false);
        return;
      }

      state.frame = window.requestAnimationFrame(step);
    };

    state.frame = window.requestAnimationFrame(step);
  };

  const stopTour = () => {
    timeline.current.clear();
    if (scrollTour.current) window.cancelAnimationFrame(scrollTour.current.frame);
    scrollTour.current = null;
    setTour(false);
  };
  const toggleTour = () => tour ? stopTour() : startTour();
  const toggleAgents = () => setAgentsOn(enabled => !enabled);
  const togglePaused = () => {
    const nextPaused = !paused;
    timeline.current.setPaused(nextPaused);
    setPaused(nextPaused);
    const state = scrollTour.current;
    if (!state || !tour) return;

    if (nextPaused) {
      window.cancelAnimationFrame(state.frame);
      state.elapsed += performance.now() - state.startedAt;
      return;
    }

    state.startedAt = performance.now();
    const step = timestamp => {
      if (scrollTour.current !== state) return;
      const duration = state.phase === "down" ? tourDownDuration : tourUpDuration;
      const progress = Math.min(1, (state.elapsed + timestamp - state.startedAt) / duration);
      const eased = .5 - Math.cos(Math.PI * progress) / 2;
      window.scrollTo({ top: state.startY + (state.targetY - state.startY) * eased, behavior: "instant" });

      if (progress === 1 && state.phase === "down") {
        state.phase = "up";
        state.startedAt = timestamp;
        state.elapsed = 0;
        state.startY = state.targetY;
        state.targetY = 0;
      } else if (progress === 1) {
        scrollTour.current = null;
        setTour(false);
        return;
      }

      state.frame = window.requestAnimationFrame(step);
    };
    state.frame = window.requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!intro) return undefined;
    timeline.current.schedule([
      { delay: 550, callback: () => setIntroStage(1) },
      { delay: 1300, callback: () => setIntroStage(2) },
      { delay: 3500, callback: () => setIntroStage(3) },
      { delay: 4700, callback: () => setIntroStage(4) },
      { delay: 5900, callback: () => setIntroStage(5) },
      { delay: 7600, callback: finishIntro }
    ]);
    return undefined;
  }, [intro]);

  useEffect(() => {
    if (!intro && !initialTourStarted.current) startTour();
  }, [intro]);

  useEffect(() => {
    const onKey = event => {
      if (event.altKey || event.ctrlKey || event.metaKey || document.activeElement.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
      if (event.key.toLowerCase() === "t") toggleTour();
      if (event.key.toLowerCase() === "a") toggleAgents();
      if (event.key.toLowerCase() === "p") togglePaused();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tour, paused, intro, motionAllowed]);

  useEffect(() => () => {
    timeline.current.clear();
    if (scrollTour.current) window.cancelAnimationFrame(scrollTour.current.frame);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("agents-forced-motion", forceAgents);
    return () => document.documentElement.classList.remove("agents-forced-motion");
  }, [forceAgents]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setMotionAllowed(forceAgents || !preference.matches);
    preference.addEventListener("change", updateMotionPreference);
    return () => preference.removeEventListener("change", updateMotionPreference);
  }, [forceAgents]);

  useEffect(() => {
    if (!motionAllowed && intro) finishIntro();
  }, [motionAllowed, intro]);

  useEffect(() => {
    const buildTargets = document.querySelectorAll([
      "#top .hero-kicker", "#top .hero-word", "#top .hero-copy", "#top .hero-copy > p", "#top h1", "#top .portrait-wrap", "#top .hero-bottom",
      ".section-label", ".section-heading", ".section h2", ".section h3", ".section p",
      ".timeline-item", ".project-card", ".skill-card", ".education-card", ".facts > div",
      ".skill-card li", ".language-card", ".achievement-item", ".certificate-card", ".honors", ".contact-content > *", ".footer > *", ".tags > span", ".project-resources > a"
    ].join(","));
    buildTargets.forEach((element, index) => {
      element.classList.add("agent-build");
      element.style.setProperty("--build-delay", `${Math.min(index % 8, 6) * 70}ms`);
      if (/^(H1|H2|H3|P)$/.test(element.tagName)) {
        element.classList.add("agent-type");
        element.style.setProperty("--build-steps", String(Math.max(1, Math.min(element.textContent.trim().length, 80))));
      }
    });

    const sectionsOnPage = document.querySelectorAll("main > section");
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-built");
      if (entry.target.classList.contains("reveal")) entry.target.classList.add("visible");
      if (entry.target.matches("main > section")) entry.target.classList.add("agent-section-built");
      revealObserver.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
    buildTargets.forEach(element => revealObserver.observe(element));
    document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
    sectionsOnPage.forEach(section => revealObserver.observe(section));

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const selectors = {
      top: "#top .hero-copy",
      about: "#about .about-layout",
      experience: "#experience .section-heading",
      projects: "#projects .project-list",
      skills: "#skills .skill-grid",
      education: "#education .education-card",
      contact: "#contact .contact-content"
    };

    const updateAgents = () => {
      scrollFrame.current = 0;
      const midpoint = window.innerHeight * 0.42;
      const pageSections = sections.map(id => document.getElementById(id)).filter(Boolean);
      const current = pageSections.find(section => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= midpoint && bounds.bottom > midpoint;
      }) || pageSections.reduce((nearest, section) => {
        if (!nearest) return section;
        const distance = item => Math.min(Math.abs(item.getBoundingClientRect().top), Math.abs(item.getBoundingClientRect().bottom - midpoint));
        return distance(section) < distance(nearest) ? section : nearest;
      }, null);

      if (!current) return;
      const id = current.id || "top";
      if (activeSectionRef.current !== id) {
        activeSectionRef.current = id;
        setActiveSection(id);
        document.querySelectorAll("main > section").forEach(section => {
          section.classList.toggle("agent-section-active", section === current);
        });
      }

      const target = current.querySelector(selectors[id]) || current;
      const bounds = target.getBoundingClientRect();
      const left = Math.max(12, Math.min(bounds.left, window.innerWidth - 72));
      const top = Math.max(12, Math.min(bounds.top, window.innerHeight - 60));
      const width = Math.max(48, Math.min(bounds.width, window.innerWidth - left - 12));
      const height = Math.max(42, Math.min(bounds.height, window.innerHeight - top - 12));
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.style.setProperty("--frame-left", `${left}px`);
      overlay.style.setProperty("--frame-top", `${top}px`);
      overlay.style.setProperty("--frame-width", `${width}px`);
      overlay.style.setProperty("--frame-height", `${height}px`);
    };
    const requestAgentUpdate = () => {
      if (!scrollFrame.current) scrollFrame.current = window.requestAnimationFrame(updateAgents);
    };

    window.addEventListener("scroll", requestAgentUpdate, { passive: true });
    window.addEventListener("resize", requestAgentUpdate);
    requestAgentUpdate();
    return () => {
      window.removeEventListener("scroll", requestAgentUpdate);
      window.removeEventListener("resize", requestAgentUpdate);
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  useEffect(() => {
    if (!agentsOn) return;
    document.querySelectorAll("main > section").forEach(section => {
      section.classList.toggle("agent-section-active", section.id === activeSection);
    });
    window.dispatchEvent(new Event("resize"));
  }, [activeSection, agentsOn]);

  const cards = [
    { label: "ABOUT ME", text: "Curious by nature. Driven to build." },
    { label: "SELECTED WORK", text: projects[0].title },
    { label: "CAPABILITIES", text: skills[0][0] }
  ];

  return <div className={`site-shell${intro ? " is-building" : ""}${paused ? " animation-paused" : ""}${tour ? " tour-running" : ""}`}>
    <AgentOverlay active={agentsOn} paused={paused} section={activeSection} overlayRef={overlayRef} />
    {intro && <section className={`agent-intro stage-${introStage}${paused ? " is-paused" : ""}`} aria-label="Portfolio build animation">
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-status mono"><span className="live-dot" /> BUILD SEQUENCE <span>·</span> PORTFOLIO</div>
      <div className="intro-center">
        <p className="intro-command mono">{introStage >= 1 ? "INITIALIZING PORTFOLIO" : "\u00a0"}</p>
        <h1 className="intro-name">{introStage >= 2 && <span>Muhammad Fahmi<br />Isyraqi.</span>}</h1>
        <p className="intro-specialty mono">{introStage >= 2 && <span>BUSINESS · MANAGEMENT · ENTREPRENEURSHIP</span>}</p>
        <div className="intro-cards">
          {cards.map((card, index) => <article className={`intro-card${introStage >= index + 3 ? " is-visible" : ""}`} key={card.label}>
            <span className="mono">{`0${index + 1} / ${card.label}`}</span>
            <b>{card.text}</b>
          </article>)}
        </div>
      </div>
      <div className="intro-controls">
        <div className="intro-control-buttons">
          <button type="button" onClick={toggleAgents} aria-pressed={agentsOn}><Bot size={15} /> AGENTS {agentsOn ? "ON" : "OFF"} <kbd>A</kbd></button>
          <button type="button" onClick={togglePaused}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? "RESUME" : "PAUSE"} <kbd>P</kbd></button>
          <button type="button" onClick={finishIntro}><SkipForward size={14} /> SKIP</button>
        </div>
        <span className="mono intro-hint">T TOUR <span>·</span> A AGENTS <span>·</span> P PAUSE</span>
      </div>
    </section>}
    {!intro && <div className="agent-dock" aria-label="Animation controls">
      <button type="button" className={`agent-toggle${agentsOn ? " is-enabled" : ""}`} onClick={toggleAgents} aria-pressed={agentsOn} aria-label={`Agents ${agentsOn ? "on" : "off"} (A)`}><Bot size={15} /><span>{agentsOn ? "AGENTS ON" : "AGENTS OFF"}</span><kbd>A</kbd></button>
      <button type="button" className="tour-button" onClick={togglePaused} aria-pressed={paused} aria-label={paused ? "Resume animation (P)" : "Pause animation (P)"}>{paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? "RESUME" : "PAUSE"}</span><kbd>P</kbd></button>
      <button type="button" className="tour-button" onClick={toggleTour} aria-label={tour ? "Stop tour (T)" : "Start tour (T)"}>{tour ? <X size={14} /> : <Sparkles size={14} />}<span>{tour ? "STOP TOUR" : "TOUR"}</span><kbd>T</kbd></button>
    </div>}
    <header className="nav">
      <a className="brand" href="#top"><span className="brand-mark">F.</span><span>FAHMI ISYRAQI</span></a>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? <X/> : <Menu/>}</button>
      <nav className={menu ? "open" : ""}>
        {sections.slice(1,6).map(s => <a key={s} href={`#${s}`} onClick={() => setMenu(false)}>{s}</a>)}
        <div className="agent-actions">
          <button className={`agent-toggle${agentsOn ? " is-enabled" : ""}`} onClick={toggleAgents} aria-pressed={agentsOn}><Bot size={14} /> AGENTS {agentsOn ? "ON" : "OFF"} <kbd>A</kbd></button>
          <button className="tour-button" onClick={togglePaused} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? "RESUME" : "PAUSE"} <kbd>P</kbd></button>
          <button className="tour-button" onClick={toggleTour}>{tour ? <X size={14} /> : <Sparkles size={14} />}{tour ? "STOP TOUR" : "TOUR"} <kbd>T</kbd></button>
        </div>
      </nav>
    </header>

    <main className={intro ? "is-hidden-during-build" : ""}>
      <section id="top" className={`hero ${revealed ? "revealed" : ""}`}>
        <div className="hero-grid"></div>
        <div className="hero-kicker mono"><span className="live-dot"></span> PERSONAL PORTFOLIO <span>·</span> 2026</div>
        <div className="hero-word" aria-label="Portfolio">PORTFOLIO</div>
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow mono">BUSINESS · MANAGEMENT · ENTREPRENEURSHIP</p>
            <h1>Muhammad Fahmi<br/><em>Isyraqi.</em></h1>
            <p className="hero-intro">An aspiring business and management student interested in entrepreneurship, people, and the ideas that turn into meaningful projects.</p>
            <div className="hero-actions">
              <a className="primary-link" href="#projects">EXPLORE MY WORK <ArrowUpRight size={16}/></a>
              <a className="text-link" href="#about">MORE ABOUT ME <ArrowDownRight size={15}/></a>
            </div>
          </div>
          <div className="portrait-wrap">
            <div className="portrait-frame"><img src="/headshot.png" alt="Formal portrait of Muhammad Fahmi Isyraqi"/></div>
            <div className="portrait-index mono">FIG. 01 / PROFILE</div>
            <div className="portrait-cross">+</div>
          </div>
        </div>
        <div className="hero-bottom mono"><span>JAKARTA, INDONESIA</span><span>SCROLL TO DISCOVER ↓</span><span>01 — 06</span></div>
      </section>

      <section id="about" className="section about-section">
        <div className="section-label mono reveal"><span>01</span> / ABOUT</div>
        <div className="about-layout">
          <h2 className="reveal">Curious by nature.<br/><span>Driven to build.</span></h2>
          <div className="about-text reveal">
            <p className="large-copy">I’m a recent graduate of Daar El Qolam with a growing interest in business management, entrepreneurship, and digital projects.</p>
            <p>My experience in student leadership and school activities helped me develop a foundation in communication, responsibility, teamwork, and organizing people around a shared goal. I’m now preparing for the next academic chapter while exploring practical ways to learn through independent projects.</p>
            <div className="facts">
              <div><span className="mono">01 / BASE</span><b>Jakarta, Indonesia</b></div>
              <div><span className="mono">02 / FOCUS</span><b>Business Management</b></div>
              <div><span className="mono">03 / APPROACH</span><b>Learn · Build · Improve</b></div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <div className="section-label mono reveal"><span>02</span> / EXPERIENCE</div>
        <div className="section-heading reveal"><h2>Where I’ve<br/><span>learned to lead.</span></h2><p className="mono">LEADERSHIP & ACTIVITIES</p></div>
        <div className="timeline">
          <article className="timeline-item reveal">
            <div className="timeline-date mono">DEC 2025 — JAN 2026</div>
            <div><h3>Chairman · ISMI Student Organization</h3><p className="muted">Daar El Qolam Islamic Boarding School</p><p>Served as student organization chairman, taking responsibility for coordination, communication, and supporting student activities.</p></div>
            <span className="timeline-count mono">01</span>
          </article>
          <article className="timeline-item reveal">
            <div className="timeline-date mono">SCHOOL YEARS</div>
            <div><h3>Pramuka & Paskibra</h3><p className="muted">Student activities</p><p>Participated in scouting and flag-raising activities, building discipline, teamwork, and commitment.</p></div>
            <span className="timeline-count mono">02</span>
          </article>
          <article className="timeline-item reveal">
            <div className="timeline-date mono">2026 — PRESENT</div>
            <div><h3>Independent Learning & Projects</h3><p className="muted">College preparation</p><p>Exploring business, digital platforms, and content development while preparing for undergraduate study.</p></div>
            <span className="timeline-count mono">03</span>
          </article>
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="section-label mono reveal"><span>03</span> / SELECTED WORK</div>
        <div className="section-heading reveal"><h2>Ideas into<br/><span>experiments.</span></h2><p className="mono">A FEW THINGS I’VE WORKED ON</p></div>
        <div className="project-list">
          {projects.map(p => <article className="project-card reveal" key={p.n}>
            <div className="project-top mono"><span>{p.n} / {p.type}</span><span>{p.year}</span></div>
            <div className="project-main"><h3>{p.url ? <a className="project-title-link" href={p.url} target="_blank" rel="noreferrer">{p.title}</a> : p.title}</h3><p>{p.desc}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div><small>{p.note}</small>{p.resources && <div className="project-resources">{p.resources.map(resource => <a className="text-link" href={resource.url} key={resource.url} target="_blank" rel="noreferrer">{resource.label} <ArrowUpRight size={14}/></a>)}</div>}</div>
            {p.url ? <a className="project-arrow" href={p.url} target="_blank" rel="noreferrer" aria-label={`Visit ${p.title}`}><ArrowUpRight /></a> : <ArrowUpRight className="project-arrow"/>}
          </article>)}
        </div>
      </section>

      <section id="skills" className="section skills-section">
        <div className="section-label mono reveal"><span>04</span> / CAPABILITIES</div>
        <div className="section-heading reveal"><h2>What I bring<br/><span>to the table.</span></h2><p className="mono">SKILLS IN PROGRESS</p></div>
        <div className="skill-grid">
          {skills.map((group, i) => <div className="skill-card reveal" key={group[0]}><span className="mono">0{i+1}</span><h3>{group[0]}</h3><ul>{group.slice(1).map(s => <li key={s}>{s}</li>)}</ul></div>)}
        </div>
        <div className="language-heading">
          <div className="section-label mono reveal"><span>04</span> / LANGUAGES</div>
          <p className="mono">LANGUAGE PROFICIENCY</p>
        </div>
        <div className="language-grid">
          {languages.map((language, index) => <article className="language-card reveal" key={language.name}>
            <img className="language-flag" src={language.flag} alt={`${language.country} flag`} />
            <span className="mono">{`0${index + 1} / LANGUAGE`}</span>
            <h3>{language.name}</h3>
            <p>{language.level}</p>
          </article>)}
        </div>
      </section>

      <section id="education" className="section education-section">
        <div className="section-label mono reveal"><span>05</span> / EDUCATION</div>
        <div className="education-card reveal">
          <div className="mono education-date">JUNE 2020 — APRIL 2026</div>
          <div><h2><a className="school-link" href="https://daftar.daarelqolam.ac.id/" target="_blank" rel="noreferrer">Daar El Qolam<br/><span>Islamic Boarding School</span><ArrowUpRight size={18}/></a></h2><p>Senior secondary education · Tangerang, Indonesia</p><p className="education-note">Completed April 2026</p></div>
          <div className="education-stamp">DQ<br/><small>GRADUATE</small></div>
        </div>
        <div className="achievements-heading section-label mono reveal"><span>05</span> / ACHIEVEMENTS & CERTIFICATES</div>
        <div className="achievement-list">
          <article className="achievement-item reveal"><span className="mono">01</span><b>Santri Teladan</b></article>
          <article className="achievement-item reveal"><span className="mono">02</span><b>Paskibra Certificate</b></article>
          <article className="achievement-item reveal"><span className="mono">03</span><b>Student leadership & extracurricular activities</b></article>
        </div>
        <div className="certificate-grid">
          {certificates.map((certificate, index) => <a className="certificate-card reveal" href={certificate.url} key={certificate.url} target="_blank" rel="noreferrer">
            <span className="mono">{`0${index + 1} / CERTIFICATE`}</span>
            <b>{certificate.title}</b>
            <small>OPEN PDF <ArrowUpRight size={14}/></small>
          </a>)}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-label mono reveal"><span>06</span> / CONTACT</div>
        <div className="contact-content reveal">
          <p className="mono eyebrow">HAVE AN IDEA OR AN OPPORTUNITY?</p>
          <h2>Let’s make<br/><span>something matter.</span></h2>
          <p>I’m open to learning, collaboration, and opportunities that help me grow.</p>
          <div className="contact-actions">
            <a className="contact-link" href="mailto:fahmiisyraqi@gmail.com">EMAIL ME <ArrowUpRight size={18}/></a>
            <a className="text-link" href="https://wa.me/6282114073503" target="_blank" rel="noreferrer">WHATSAPP +6282114073503 <ArrowUpRight size={15}/></a>
          </div>
          <div className="social-links">
            <a className="text-link" href="https://www.instagram.com/amia.je/" target="_blank" rel="noreferrer"><Instagram size={16}/> @amia.je <ArrowUpRight size={14}/></a>
            <a className="text-link" href="https://www.instagram.com/_mufasy_/" target="_blank" rel="noreferrer"><Instagram size={16}/> @_mufasy_ <ArrowUpRight size={14}/></a>
          </div>
        </div>
        <footer className="footer mono"><span>© 2026 MUHAMMAD FAHMI ISYRAQI</span><a href="#top">BACK TO TOP ↑</a><span>DESIGNED TO KEEP MOVING.</span></footer>
      </section>
    </main>
  </div>;
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Missing React root element.");

const root = createRoot(rootElement);
root.render(<App/>);

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
