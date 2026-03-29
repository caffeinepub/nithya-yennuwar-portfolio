import { useEffect, useRef, useState } from "react";

/* ── custom cursor ───────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const isHover = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        dot.style.opacity = "1";
        ringEl.style.opacity = "1";
        ring.current = { x: e.clientX, y: e.clientY };
      }
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const onLeave = () => {
      visible.current = false;
      dot.style.opacity = "0";
      ringEl.style.opacity = "0";
    };

    const onEnter = () => {
      visible.current = true;
      dot.style.opacity = "1";
      ringEl.style.opacity = "1";
    };

    const setHover = (v: boolean) => {
      isHover.current = v;
      if (v) {
        dot.classList.add("hover");
        ringEl.classList.add("hover");
      } else {
        dot.classList.remove("hover");
        ringEl.classList.remove("hover");
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("a, button, [data-cursor='hover'], .cursor-hover")) {
        setHover(true);
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("a, button, [data-cursor='hover'], .cursor-hover")) {
        setHover(false);
      }
    };

    const animate = () => {
      const speed = 0.1;
      ring.current.x += (mouse.current.x - ring.current.x) * speed;
      ring.current.y += (mouse.current.y - ring.current.y) * speed;
      ringEl.style.left = `${ring.current.x}px`;
      ringEl.style.top = `${ring.current.y}px`;
      raf.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 0, left: "-100px", top: "-100px" }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ opacity: 0, left: "-100px", top: "-100px" }}
      />
    </>
  );
}

/* ── hooks ──────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    for (const el of els) obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* ── types ──────────────────────────────────────────────────── */
type Metric = { value: string; label: string };
type CaseStudy = {
  tags: string[];
  title: string;
  meta: string;
  objective: string;
  strategy?: string;
  problem?: string;
  funnelDesign?: string;
  channelsUsed?: string[];
  creativeApproach?: string;
  audienceLogic?: string;
  executionPoints: string[];
  budgetAllocation?: string;
  toolsUsed: string[];
  metrics: Metric[];
  keyInsight?: string;
  scaleNext?: string;
  delay?: string;
  ocid: string;
};

type ProofMetric = {
  number: string;
  label: string;
  context?: string;
};

/* ── data ──────────────────────────────────────────────────── */
const GLANCE_CARDS = [
  { number: "₹2L+", label: "Monthly Ad Budget Managed" },
  { number: "6+", label: "Channels Owned End-to-End" },
  { number: "10+", label: "Brands Managed" },
  { number: "2.5+", label: "Years Experience" },
];

const SKILL_GROUPS = [
  {
    label: "Performance Marketing",
    skills: ["Meta Ads", "Google Ads", "Lead Generation", "Retargeting"],
  },
  {
    label: "Content & Social",
    skills: ["Instagram", "Reels", "Content Strategy", "Influencer Marketing"],
  },
  {
    label: "AI Marketing",
    skills: ["Prompting", "AI Content", "Automation", "Creative AI"],
  },
  {
    label: "Analytics & Optimization",
    skills: ["GA4", "A/B Testing", "Reporting", "Funnel Analysis"],
  },
];

const TOOL_CATEGORIES = [
  { label: "Advertising", tools: ["Meta Ads", "Google Ads"] },
  { label: "Analytics", tools: ["GA4", "Excel"] },
  { label: "Creative", tools: ["Canva", "Figma", "Adobe Suite"] },
  { label: "CRM / Email", tools: ["Mailchimp", "HubSpot"] },
  { label: "SEO", tools: ["Semrush", "Ahrefs", "Google Search Console"] },
];

const PROOF_METRICS: ProofMetric[] = [
  {
    number: "₹40L",
    label: "Revenue in 90 Days",
    context: "Full-funnel Meta campaigns · EdTech · Lead Gen funnel",
  },
  {
    number: "62%",
    label: "Reduction in CPL",
    context: "Creative testing + audience segmentation",
  },
  {
    number: "3.2×",
    label: "ROAS Achieved",
    context: "Performance campaigns across multiple brands",
  },
  {
    number: "0→50K",
    label: "Organic Impressions",
    context: "LinkedIn personal brand · Hook-first content · 90 days",
  },
  {
    number: "18 hrs/wk",
    label: "Saved via AI Automation",
    context: "Content production + reporting workflows",
  },
];

const CASE_STUDIES: CaseStudy[] = [
  {
    tags: ["Social Media Growth", "Content Strategy"],
    title: "From Zero to Niche — Growing a Lifestyle Brand on Instagram",
    meta: "D2C Lifestyle Brand · 60 Days · Organic Social",
    objective:
      "Grow an Instagram presence from scratch — zero follower base, no content library, no brand awareness.",
    problem:
      "The brand had no social presence, inconsistent visual identity, and no content pipeline. Engagement was non-existent and there was no strategy to build an audience organically.",
    funnelDesign:
      "TOF: Reels + hashtag discovery to attract cold audiences. MOF: Carousel posts + story interactions to build trust and nurture. BOF: Strong CTAs, DMs, and link-in-bio to convert.",
    channelsUsed: [
      "Instagram (Organic)",
      "Stories",
      "Reels",
      "Micro-Influencer Collabs",
    ],
    creativeApproach:
      "Built a 4-pillar content system: Education · Entertainment · Emotion · Engagement. Each pillar had dedicated formats (Reels, carousels, quotes, polls). Hooks written for first 1–2 seconds of every Reel.",
    audienceLogic:
      "Targeted urban women aged 22–34 interested in lifestyle, wellness, and aesthetic brands. Influencer tier: 10K–50K followers for credibility without high cost.",
    executionPoints: [
      "5 posts/week + 12 Reels/month on a fixed editorial calendar",
      "Weekly story polls, Q&As, and swipe-up CTAs",
      "3 micro-influencer collabs — briefed, managed, and tracked end-to-end",
      "Hashtag clusters refreshed bi-weekly based on reach data",
    ],
    budgetAllocation:
      "₹0 paid spend — 100% organic. Influencer cost: ₹8,000 total across 3 collabs.",
    toolsUsed: [
      "Canva",
      "Later",
      "Meta Insights",
      "Google Sheets",
      "ChatGPT (caption & hook writing)",
    ],
    metrics: [
      { value: "+62%", label: "Reach Growth in 60 Days" },
      { value: "1.2% → 4.8%", label: "Engagement Rate" },
      { value: "+3,200", label: "Organic Followers" },
      { value: "18K", label: "Avg. Reel Plays" },
      { value: "2.1L", label: "Influencer Impressions" },
    ],
    keyInsight:
      "Hooks drove everything. Reels with a clear tension or question in the first 2 seconds consistently outperformed polished content. Micro-influencers delivered 3× better engagement-to-cost ratio than macro options.",
    scaleNext:
      "Run paid amplification on top 3 organic Reels, launch a UGC seeding program, and build a WhatsApp broadcast list from DM traffic.",
    ocid: "case.item.1",
  },
  {
    tags: ["Performance Marketing", "Lead Generation"],
    title: "Performance Campaigns That Paid — Meta Ads for a Service Brand",
    meta: "EdTech / Coaching · 45 Days · Paid Media",
    objective:
      "Generate quality leads at a reduced CPL for an online coaching program targeting working professionals.",
    problem:
      "CPL was ₹210 — unsustainable for the unit economics. Creatives were generic, audience targeting was broad, and the landing page had a 72% bounce rate with no retargeting in place.",
    funnelDesign:
      "TOF: Broad interest + lookalike audiences with awareness creatives. MOF: Engaged video viewers and website visitors retargeted with social proof. BOF: Lead form ads and WhatsApp click-to-chat for warm audiences.",
    channelsUsed: [
      "Meta Ads (Facebook + Instagram)",
      "WhatsApp Click-to-Chat",
      "Landing Page Optimization",
    ],
    creativeApproach:
      "5 creative angles tested: pain-point hook, transformation story, tutor credibility, outcome-first, and objection-handling. Video + static split. Testimonial-led creatives used in retargeting phase.",
    audienceLogic:
      "Primary: Working professionals 25–40, interest in upskilling + career growth. Secondary: 1% lookalike from existing students. Retargeting: video viewers (50%+) and website visitors (last 30 days).",
    executionPoints: [
      "3 simultaneous ad sets per funnel phase — TOF, MOF, BOF",
      "Weekly CPL review with creative rotation based on live performance",
      "Retargeting with testimonial + outcome-led creatives",
      "Landing page headline and CTA updated based on GA4 heatmap feedback",
    ],
    budgetAllocation:
      "Total: ₹1.2L over 45 days. 50% TOF, 30% MOF retargeting, 20% BOF conversion.",
    toolsUsed: [
      "Meta Ads Manager",
      "GA4",
      "Canva",
      "Excel",
      "ChatGPT (ad copy)",
    ],
    metrics: [
      { value: "3.8%", label: "CTR (Industry avg: 1.5%)" },
      { value: "₹89", label: "Cost Per Lead (from ₹210)" },
      { value: "6.2%", label: "Conversion Rate" },
      { value: "847", label: "Leads in 45 Days" },
      { value: "−58%", label: "Reduction in CPL" },
    ],
    keyInsight:
      "The transformation-story creative outperformed all others by 2.4×. Audience specificity (working professionals, not just 'education interest') dropped CPL by 34% on its own. Retargeting with testimonials recovered 22% of drop-offs.",
    scaleNext:
      "Add Google Search ads to capture high-intent queries, build an email nurture sequence post-lead-capture, and test Reels as TOF creative format.",
    delay: "d1",
    ocid: "case.item.2",
  },
  {
    tags: ["LinkedIn Growth", "Personal Branding"],
    title: "Building Authority From Scratch — LinkedIn Personal Brand",
    meta: "Personal Brand · 90 Days · Organic LinkedIn",
    objective:
      "Build organic LinkedIn presence from 0 followers with consistent, hook-driven content that generates inbound interest.",
    problem:
      "Zero followers, no content cadence, no clear positioning. The profile was incomplete and not optimized for search or inbound discovery.",
    funnelDesign:
      "TOF: Hook-first posts for discovery and reach. MOF: Thought-leadership threads and commentary to build trust. BOF: DMs and profile visits converting to inbound inquiries.",
    channelsUsed: ["LinkedIn (Organic)", "LinkedIn Analytics", "DM Outreach"],
    creativeApproach:
      "Hook-first framework: every post opened with a contrarian statement, a number, or a clear tension. Post types: personal insight, case study snippets, industry commentary, mini-frameworks.",
    audienceLogic:
      "Target audience: founders, marketing managers, and startup hiring managers interested in growth and performance marketing. Niche down early to drive algorithmic distribution.",
    executionPoints: [
      "3 posts/week — fixed Tuesday, Thursday, Saturday cadence",
      "Hook tested across 3 formats: question, number-led, statement",
      "Active engagement in comments of 10 niche creators per week",
      "Full profile optimization: headline, banner, about section, featured",
    ],
    budgetAllocation:
      "₹0 paid. Time investment: ~4 hrs/week across writing, scheduling, and engagement.",
    toolsUsed: [
      "LinkedIn Analytics",
      "Canva",
      "Notion",
      "ChatGPT (drafting + hook generation)",
    ],
    metrics: [
      { value: "0 → 50K", label: "Organic Impressions" },
      { value: "4.2%", label: "Engagement Rate" },
      { value: "+1,800", label: "Followers Gained" },
      { value: "12", label: "Inbound Inquiries" },
    ],
    keyInsight:
      "Consistency beat virality. Posts published on a fixed cadence with strong hooks averaged 3× more impressions than sporadic 'viral attempt' posts. Commenting on niche creators drove 40% of new followers.",
    scaleNext:
      "Launch a LinkedIn newsletter for weekly distribution, add a lead magnet (free resource) linked from the profile, and repurpose top posts into short-form video.",
    delay: "d2",
    ocid: "case.item.3",
  },
];

const AI_CARDS = [
  {
    title: "AI Content Generation",
    text: "Used ChatGPT + AI tools to generate scripts, hooks, and captions at scale while maintaining brand voice. 10× content output without compromising quality.",
  },
  {
    title: "AI Creative Production",
    text: "Batch-produced ad creatives using AI tools to increase testing velocity — more angles, faster iterations, lower production cost.",
  },
  {
    title: "Automation Workflows",
    text: "Built automation workflows reducing content & reporting time by 18+ hrs/week — connecting tools into seamless pipelines that eliminate repetitive tasks.",
  },
  {
    title: "Campaign Analysis Using AI",
    text: "Used AI-assisted analysis to identify winning creatives and optimize campaigns faster — surfacing patterns in data that manual review would miss.",
  },
];

const INDUSTRY_TILES = [
  {
    icon: "🎬",
    title: "Film & Web Series Promotion",
    text: "End-to-end campaigns for theatrical and OTT releases — from teaser drops to opening week pushes.",
  },
  {
    icon: "▶️",
    title: "YouTube Growth Strategy",
    text: "Channel optimization, content cadence planning, and thumbnail strategy to build sustainable viewership.",
  },
  {
    icon: "🤝",
    title: "Influencer Collaborations",
    text: "Identifying, outreaching, and managing creator partnerships across niches and follower tiers.",
  },
  {
    icon: "📰",
    title: "PR & Media Campaigns",
    text: "Coordinating press coverage, media placements, and owned-earned-paid strategies for launch moments.",
  },
];

const PHILOSOPHY_CARDS = [
  {
    num: "01",
    title: "Data-first decisions",
    text: "Every move is backed by numbers — from content timing to ad spend reallocation. Instinct informs, data confirms.",
  },
  {
    num: "02",
    title: "Audience over algorithm",
    text: "Algorithms change every quarter. Real audience connection doesn't. I build for people first.",
  },
  {
    num: "03",
    title: "Test → Learn → Scale",
    text: "A/B testing isn't optional — it's how I find what actually works before doubling down.",
  },
  {
    num: "04",
    title: "Simplicity in strategy",
    text: "If the strategy can't be explained in one sentence, it isn't ready. Clarity before complexity.",
  },
];

const EXPERIENCE_CARDS = [
  {
    icon: "🏢",
    role: "Performance Marketing Executive",
    company: "Digital Marketing Agency",
    period: "Foundation Years",
    desc: "Built foundational skills in paid media, SEO, content strategy, and multi-client execution across diverse industries.",
    bullets: [
      "Managed SEO, paid media, and analytics for multiple client accounts",
      "Developed reporting systems and cross-channel campaign coordination",
    ],
    impact:
      "Built foundational skills across SEO, paid media, and multi-client execution",
  },
  {
    icon: "🎬",
    role: "Digital Marketing Specialist",
    company: "Media Production House",
    period: "Entertainment Marketing",
    desc: "Led digital campaigns for film, OTT, and music releases — from teaser drops to opening week pushes.",
    bullets: [
      "Ran YouTube growth, influencer campaigns, and PR coordination",
      "Executed full-funnel campaigns for theatrical and OTT releases",
    ],
    impact: "Led digital campaigns for film, OTT, and music releases",
  },
  {
    icon: "🚀",
    role: "Sole Marketing Owner",
    company: "Wuri · YC-Backed Startup",
    period: "Full Ownership · End-to-End",
    desc: "Owned the entire marketing function from day one — strategy, execution, and optimization across 6+ channels.",
    bullets: [
      "Built Meta + Google ad funnels, SEO from scratch, Email + WhatsApp retention",
      "Owned influencer pipelines, organic social, and all performance reporting",
    ],
    impact: "Sole marketing owner · Built and scaled 6+ channels end-to-end",
  },
  {
    icon: "🌐",
    role: "Growth Marketing Consultant",
    company: "Freelance · Multi-Brand",
    period: "10+ Brands · Ongoing",
    desc: "Managing performance, content, and growth systems across 10+ brands simultaneously.",
    bullets: [
      "Delivered full-stack marketing across performance, social, and SEO",
      "Built scalable content and ad systems tailored per brand",
    ],
    impact:
      "Managed 10+ brands across performance, content, and growth systems",
  },
];

/* ── components ─────────────────────────────────────────────── */
function CaseCard({
  tags,
  title,
  meta,
  objective,
  strategy,
  problem,
  funnelDesign,
  channelsUsed,
  creativeApproach,
  audienceLogic,
  executionPoints,
  budgetAllocation,
  toolsUsed,
  metrics,
  keyInsight,
  scaleNext,
  delay,
  ocid,
}: CaseStudy) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`case-card cursor-hover rv${delay ? ` ${delay}` : ""}`}
      data-ocid={ocid}
    >
      <button
        type="button"
        className="case-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <div className="case-tags">
            {tags.map((t) => (
              <span key={t} className="case-tag-pill">
                {t}
              </span>
            ))}
          </div>
          <h3 className="case-title">{title}</h3>
          <p className="case-meta">{meta}</p>
        </div>
        <span
          className={`case-toggle${open ? " open" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <div className="case-body">
          <div className="case-sep" />
          <div className="case-grid">
            <div>
              <p className="case-section-label">Objective</p>
              <p className="case-text">{objective}</p>
            </div>
            {strategy && (
              <div>
                <p className="case-section-label">Strategy</p>
                <p className="case-text">{strategy}</p>
              </div>
            )}
            {problem && (
              <div>
                <p className="case-section-label">Problem</p>
                <p className="case-text">{problem}</p>
              </div>
            )}
            {funnelDesign && (
              <div>
                <p className="case-section-label">Funnel Design</p>
                <p className="case-text">{funnelDesign}</p>
              </div>
            )}
            {channelsUsed && channelsUsed.length > 0 && (
              <div>
                <p className="case-section-label">Channels Used</p>
                <div className="case-tools">
                  {channelsUsed.map((c) => (
                    <span key={c} className="case-tool-tag">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {creativeApproach && (
              <div>
                <p className="case-section-label">Creative Approach</p>
                <p className="case-text">{creativeApproach}</p>
              </div>
            )}
            {audienceLogic && (
              <div>
                <p className="case-section-label">Audience Logic</p>
                <p className="case-text">{audienceLogic}</p>
              </div>
            )}
            <div>
              <p className="case-section-label">Execution</p>
              <div className="case-text">
                <ul>
                  {executionPoints.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
            {budgetAllocation && (
              <div>
                <p className="case-section-label">Budget Allocation</p>
                <p className="case-text">{budgetAllocation}</p>
              </div>
            )}
            <div>
              <p className="case-section-label">Tools Used</p>
              <div className="case-tools">
                {toolsUsed.map((t) => (
                  <span key={t} className="case-tool-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="case-section-label" style={{ marginBottom: 14 }}>
            Results
          </p>
          <div className="case-metrics-grid">
            {metrics.map((m) => (
              <div key={m.label} className="metric-chip">
                <div className="metric-value">{m.value}</div>
                <div className="metric-label">{m.label}</div>
              </div>
            ))}
          </div>
          {keyInsight && (
            <div
              style={{
                background: "rgba(184,80,58,0.06)",
                padding: "12px 16px",
                borderRadius: 8,
                borderLeft: "3px solid #B8503A",
                marginTop: 20,
              }}
            >
              <p className="case-section-label" style={{ marginBottom: 6 }}>
                Key Insight
              </p>
              <p className="case-text">{keyInsight}</p>
            </div>
          )}
          {scaleNext && (
            <div style={{ marginTop: 16 }}>
              <p className="case-section-label">What I&rsquo;d Scale Next</p>
              <p className="case-text">{scaleNext}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ProofCard({
  number,
  label,
  context,
  index,
}: ProofMetric & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const delays = ["d1", "d2", "d3", "d4", "d5"];
  const delayClass = delays[index % delays.length];
  return (
    <div ref={ref} className={`proof-card cursor-hover rv ${delayClass}`}>
      <span
        className="proof-number"
        style={{ opacity: inView ? 1 : 0, transition: "opacity 0.4s" }}
      >
        {number}
      </span>
      <p className="proof-label">{label}</p>
      {context && (
        <p
          style={{
            fontSize: "0.7rem",
            opacity: 0.65,
            marginTop: 4,
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
        >
          {context}
        </p>
      )}
    </div>
  );
}

/* ── ExperienceCard component ───────────────────────────────── */
function ExperienceCard({
  card,
  index,
}: { card: (typeof EXPERIENCE_CARDS)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateY(-8px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform =
      "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      className={`exp-card rv d${(index % 3) + 1}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-ocid={`experience.item.${index + 1}`}
    >
      <span className="exp-card-icon">{card.icon}</span>
      <p className="exp-card-period">{card.period}</p>
      <h3 className="exp-card-role">{card.role}</h3>
      <p className="exp-card-company">{card.company}</p>
      <p className="exp-card-desc">{card.desc}</p>
      <ul className="exp-card-bullets">
        {card.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="exp-card-impact">{card.impact}</div>
    </div>
  );
}

function App() {
  const activeSection = useActiveSection([
    "about",
    "skills",
    "work",
    "journey",
    "ai",
    "contact",
  ]);
  const expTrackRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  const scrollToCard = (i: number) => {
    const track = expTrackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll(".exp-card");
    const card = cards[i] as HTMLElement;
    if (card) {
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  useReveal();
  const scrolled = useNavScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      <CustomCursor />

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="#hero" className="nav-logo" data-ocid="nav.link">
          <span>N</span>Y
        </a>
        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          <li>
            {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
            <a
              href="#about"
              className={activeSection === "about" ? "active" : ""}
              data-ocid="nav.link"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
          </li>
          <li>
            {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
            <a
              href="#skills"
              className={activeSection === "skills" ? "active" : ""}
              data-ocid="nav.link"
              onClick={() => setMenuOpen(false)}
            >
              Skills
            </a>
          </li>
          <li>
            {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
            <a
              href="#work"
              className={activeSection === "work" ? "active" : ""}
              data-ocid="nav.link"
              onClick={() => setMenuOpen(false)}
            >
              Work
            </a>
          </li>
          <li>
            {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
            <a
              href="#journey"
              className={activeSection === "journey" ? "active" : ""}
              data-ocid="nav.link"
              onClick={() => setMenuOpen(false)}
            >
              Experience
            </a>
          </li>
          <li>
            {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
            <a
              href="#ai"
              className={activeSection === "ai" ? "active" : ""}
              data-ocid="nav.link"
              onClick={() => setMenuOpen(false)}
            >
              AI
            </a>
          </li>
          <li>
            {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
            <a
              href="#contact"
              className={activeSection === "contact" ? "active" : ""}
              data-ocid="nav.link"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
          </li>
        </ul>
        {/* biome-ignore lint/a11y/useValidAnchor: hash anchor navigates to section */}
        <a
          href="#contact"
          className="nav-cta"
          data-ocid="nav.primary_button"
          onClick={() => setMenuOpen(false)}
        >
          Hire Me
        </a>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(184,80,58,0.10)",
            filter: "blur(80px)",
            top: "10%",
            left: "-8%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(74,120,48,0.08)",
            filter: "blur(70px)",
            bottom: "12%",
            right: "-5%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(184,80,58,0.07)",
            filter: "blur(50px)",
            top: "55%",
            left: "60%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <p className="hero-eyebrow rv">Portfolio · {year}</p>
        <h1 className="hero-name rv d1">Nithya Yennuwar</h1>
        <p className="hero-role rv d2" data-ocid="hero.section">
          Full-Stack Growth Marketer | Performance, Content &amp; AI Systems
        </p>
        <div className="hero-sep rv d2" />
        <p className="hero-tagline rv d3" data-ocid="hero.panel">
          I build scalable growth systems that turn content into revenue —
          combining paid media, organic strategy, and AI-driven execution.
        </p>
        <p className="hero-credibility rv d4" data-ocid="hero.card">
          2.5+ years · YC-backed startup experience · 10+ brands · ₹40L+ revenue
          generated
        </p>
        <div className="hero-ctas rv d4">
          <a href="#about" className="btn-rust" data-ocid="hero.primary_button">
            Explore ↓
          </a>
          <a
            href="#contact"
            className="btn-outline-rust"
            data-ocid="hero.secondary_button"
          >
            Hire Me
          </a>
        </div>
        <div className="hero-scroll">
          <span className="hero-scroll-label">Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* AT A GLANCE */}
      <section className="section glance" id="glance">
        <p className="section-eyebrow rv">At a Glance</p>
        <div className="glance-grid">
          {GLANCE_CARDS.map((c, i) => (
            <div
              key={c.label}
              className={`glance-card cursor-hover rv d${i + 1}`}
            >
              <span className="glance-number">{c.number}</span>
              <p className="glance-label">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about" id="about">
        <div className="about-grid">
          <div className="about-left">
            <p className="about-section-label rv">About Me</p>
            <span className="about-quote-mark rv d1">&ldquo;</span>
          </div>
          <div className="about-right">
            <p className="about-para rv">
              I&rsquo;m a <strong>full-stack growth marketer</strong> with 2.5+
              years of experience operating across performance, content, and AI
              systems. As the sole marketing owner at Wuri — a YC-backed startup
              — I built and scaled 6+ channels end-to-end, from strategy through
              execution to optimization.
            </p>
            <p className="about-para rv d1">
              Across a digital marketing agency, a media production house, and
              10+ freelance brands, I&rsquo;ve owned the full stack:{" "}
              <strong>
                Meta + Google ad funnels, SEO from scratch, retention flows via
                Email + WhatsApp, influencer pipelines, and organic content
                systems.
              </strong>{" "}
              No hand-holding. No siloed roles.
            </p>
            <p className="about-para rv d2">
              Currently open to{" "}
              <strong>
                full-time roles, freelance projects, and consulting
              </strong>{" "}
              engagements where ownership and outcomes are what matter.
            </p>
            <blockquote className="about-quote rv d3">
              &ldquo;I don&rsquo;t just execute campaigns — I design systems,
              optimize funnels, and own outcomes end-to-end.&rdquo;
            </blockquote>
            <div className="about-badges rv d4">
              <span className="about-badge">YC-Backed Startup (Wuri)</span>
              <span className="about-badge">Film &amp; Entertainment</span>
              <span className="about-badge">Multi-Brand Freelance</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SKILLS */}
      <section className="section skills" id="skills">
        <p className="section-eyebrow rv">Core Expertise</p>
        <h2 className="section-title rv d1">Core Skills</h2>
        <div className="skills-grid">
          {SKILL_GROUPS.map((group, gi) => (
            <div key={group.label} className={`rv d${gi + 1}`}>
              <p className="skill-group-label">{group.label}</p>
              <div className="skill-group-items">
                {group.skills.map((s, si) => (
                  <span key={s}>
                    {s}
                    {si < group.skills.length - 1 && (
                      <span className="skill-dot">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="section tools" id="tools">
        <p className="section-eyebrow rv">My Stack</p>
        <h2 className="section-title rv d1">Tools &amp; Platforms</h2>
        <div className="tools-grid">
          {TOOL_CATEGORIES.map((cat, i) => (
            <div key={cat.label} className={`tool-category rv d${(i % 3) + 1}`}>
              <p className="tool-cat-label">{cat.label}</p>
              <div className="tool-pills">
                {cat.tools.map((t) => (
                  <span key={t} className="tool-pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF OF WORK */}
      <section className="section proof" id="proof">
        <p className="section-eyebrow rv">Proof of Work</p>
        <h2 className="section-title rv d1">Results That Speak</h2>
        <div className="proof-grid">
          {PROOF_METRICS.map((m, i) => (
            <ProofCard
              key={m.label}
              number={m.number}
              label={m.label}
              context={m.context}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="section cases" id="work">
        <p className="section-eyebrow rv">Deep Dives</p>
        <h2 className="section-title rv d1">Campaign Case Studies</h2>
        {CASE_STUDIES.map((cs) => (
          <CaseCard key={cs.ocid} {...cs} />
        ))}
      </section>

      {/* AI × MARKETING SYSTEMS */}
      <section className="section ai-section" id="ai">
        <p className="section-eyebrow rv">Key Differentiator</p>
        <h2 className="section-title rv d1">AI × Marketing Systems</h2>
        <p className="ai-intro rv d2">
          I don&rsquo;t just use AI tools — I build systems that scale
          marketing.
        </p>
        <div className="ai-grid">
          {AI_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={`ai-card cursor-hover rv d${i + 1}`}
            >
              <h3 className="ai-card-title">{card.title}</h3>
              <p className="ai-card-text">{card.text}</p>
            </div>
          ))}
        </div>
        <div className="ai-callout rv d3">
          <span className="ai-callout-number">18 hrs/wk</span>
          <span className="ai-callout-label">saved using AI automation</span>
        </div>
      </section>

      {/* INDUSTRY EXPERIENCE */}
      <section className="section industry" id="industry">
        <p className="section-eyebrow rv">Verticals</p>
        <h2 className="section-title rv d1">Industry Experience</h2>
        <div className="industry-grid">
          {INDUSTRY_TILES.map((tile, i) => (
            <div
              key={tile.title}
              className={`industry-tile cursor-hover rv d${(i % 3) + 1}`}
            >
              <span className="industry-icon">{tile.icon}</span>
              <h3 className="industry-title">{tile.title}</h3>
              <p className="industry-text">{tile.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK PHILOSOPHY */}
      <section className="section philosophy" id="philosophy">
        <p className="section-eyebrow rv">How I Think</p>
        <h2 className="section-title rv d1">Work Philosophy</h2>
        <div className="philosophy-grid">
          {PHILOSOPHY_CARDS.map((card, i) => (
            <div
              key={card.num}
              className={`philosophy-card cursor-hover rv d${(i % 2) + 1}`}
            >
              <span className="philosophy-num">{card.num}</span>
              <h3 className="philosophy-title">{card.title}</h3>
              <p className="philosophy-text">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE & JOURNEY */}
      <section className="section journey" id="journey">
        <p className="section-eyebrow rv">Career Timeline</p>
        <h2 className="section-title rv d1">Experience &amp; Journey</h2>
        <p className="exp-subtitle rv d2">
          A timeline of how I built my growth marketing expertise across
          startups, media, and multi-brand environments.
        </p>
        <div className="exp-scroll-wrapper">
          <div
            className="exp-track"
            ref={expTrackRef}
            onScroll={() => {
              const track = expTrackRef.current;
              if (!track) return;
              const cards = Array.from(
                track.querySelectorAll(".exp-card"),
              ) as HTMLElement[];
              let closest = 0;
              let minDist = Number.POSITIVE_INFINITY;
              cards.forEach((card, idx) => {
                const dist = Math.abs(
                  card.getBoundingClientRect().left -
                    track.getBoundingClientRect().left,
                );
                if (dist < minDist) {
                  minDist = dist;
                  closest = idx;
                }
              });
              setActiveCard(closest);
            }}
            onMouseDown={(e) => {
              const track = expTrackRef.current;
              if (!track) return;
              const startX = e.pageX - track.offsetLeft;
              const startScroll = track.scrollLeft;
              track.dataset.dragging = "1";
              const onMove = (ev: MouseEvent) => {
                if (track.dataset.dragging !== "1") return;
                const x = ev.pageX - track.offsetLeft;
                track.scrollLeft = startScroll - (x - startX);
              };
              const onUp = () => {
                track.dataset.dragging = "0";
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
              };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
          >
            {EXPERIENCE_CARDS.map((card, i) => (
              <ExperienceCard key={card.company} card={card} index={i} />
            ))}
          </div>
          <div className="exp-dots">
            {EXPERIENCE_CARDS.map((card, i) => (
              <button
                key={`dot-${card.company}`}
                type="button"
                className={`exp-dot${activeCard === i ? " active" : ""}`}
                onClick={() => scrollToCard(i)}
                aria-label={`Go to card ${i + 1}`}
                data-ocid={"experience.tab"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HIRE ME / CONTACT */}
      <section className="section contact" id="contact">
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(184,80,58,0.09)",
            filter: "blur(80px)",
            top: "-5%",
            right: "5%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(74,120,48,0.07)",
            filter: "blur(70px)",
            bottom: "10%",
            left: "-3%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <h2 className="contact-headline rv">
          Let&rsquo;s Build Something That Grows
        </h2>
        <p className="contact-sub rv d1">
          Open to full-time roles, freelance projects, and consulting. Hyderabad
          · Immediate availability.
        </p>
        <div className="contact-cards">
          <div
            className="contact-card cursor-hover rv"
            data-ocid="contact.card"
          >
            <span className="contact-card-icon">✉️</span>
            <p className="contact-card-label">Email</p>
            <p className="contact-card-value">
              <a
                href="mailto:nithayennuwar3112@gmail.com"
                data-ocid="contact.link"
              >
                nithayennuwar3112@gmail.com
              </a>
            </p>
          </div>
          <div
            className="contact-card cursor-hover rv d1"
            data-ocid="contact.card"
          >
            <span className="contact-card-icon">📞</span>
            <p className="contact-card-label">Phone</p>
            <p className="contact-card-value">
              <a href="tel:+917396584172" data-ocid="contact.link">
                +91 73965 84172
              </a>
            </p>
          </div>
          <div
            className="contact-card cursor-hover rv d2"
            data-ocid="contact.card"
          >
            <span className="contact-card-icon">💼</span>
            <p className="contact-card-label">LinkedIn</p>
            <p className="contact-card-value">
              <a
                href="https://www.linkedin.com/in/nithya-yennuwar3112/"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="contact.link"
              >
                linkedin.com/in/nithya-yennuwar3112
              </a>
            </p>
          </div>
        </div>
        <div className="contact-ctas rv d3">
          <a
            href="mailto:nithayennuwar3112@gmail.com"
            className="btn-rust"
            data-ocid="contact.primary_button"
          >
            Get In Touch
          </a>
          <a
            href="https://drive.google.com/uc?export=download&id=1hV7G5ukJn5mYLSEmwUvQkbezq2tA59Un"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-rust"
            data-ocid="contact.secondary_button"
          >
            Download Resume
          </a>
        </div>
        <p className="contact-location rv d4">
          📍 Hyderabad · Immediately Available
        </p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-copy">
          &copy; {year} Nithya Yennuwar. All rights reserved.
        </p>
        <p className="footer-caffeine">
          Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
