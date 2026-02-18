"use client";

import { FormEvent, useState } from "react";

type ChatState = {
  question: string;
  answer: string;
};

const experience = [
  {
    role: "Analyst Developer",
    company: "FNZ",
    period: "Apr 2025 - Present",
    tech: "ASP.NET, C#, Java, Spring Boot, AWS, Microservices, SQL, PostgreSQL, React, jQuery, GitHub Copilot",
    bullets: [
      "Own delivery and production support for regulated wealth-management platforms used by Mercer, UBS, and AustralianSuper.",
      "Migrated billions in cash and instrument values from Mercer to UBS D2M using high-volume SQL transformation and reconciliation workflows.",
      "Redesigned advisor fee-calculation logic for AustralianSuper to ensure accurate day-level charging and stronger downstream reporting reliability.",
      "Optimized member annual and exit statement modules to improve compliance readiness for regulatory reporting.",
      "Maintained 100% uptime during support rotations and helped execute data-center migration with zero major incidents."
    ]
  },
  {
    role: "Full Stack Developer (Internship)",
    company: "KIY Meal Kit",
    period: "Sep 2024 - Jan 2025",
    bullets: [
      "Built AI-powered recipe conversion for the Favour app, transforming social recipes into personalized shopping lists for 50,000+ users.",
      "Fine-tuned LLM extraction workflows and built APIs that converted recipe content into structured meal-kit plans.",
      "Implemented monitoring for failed imports, improving reliability of daily ingestion from Instagram, TikTok, and blog sources."
    ]
  },
  {
    role: "Full Stack Developer",
    company: "DNV",
    period: "Dec 2022 - Jun 2023",
    bullets: [
      "Refactored the internal IORA financial system for budget submission and inter-unit settlements.",
      "Delivered front-end and API integration work in a distributed global team."
    ]
  },
  {
    role: "Full Stack Developer",
    company: "HSBC",
    period: "Jan 2021 - Dec 2022",
    bullets: [
      "Contributed to an international bond-trading platform focused on order-matching workflows supporting millions of daily transactions.",
      "Built web tools for bonds and structured products with Agile delivery and production support ownership."
    ]
  },
  {
    role: "Frontend Developer",
    company: "Ynet",
    period: "Apr 2020 - Dec 2020",
    bullets: [
      "Built banking mobile applications with Vue and hybrid stacks for enterprise clients.",
      "Led refactoring of legacy internal banking web systems to React-based architecture."
    ]
  }
];

const projects = [
  {
    name: "buffett-portfolio-tracker",
    liveUrl: "https://buffett-portfolio-tracker-app-ceaoti.streamlit.app/",
    repoUrl: "https://github.com/allenho333/buffett-portfolio-tracker/tree/main",
    repoLabel: "allenho333/buffett-portfolio-tracker",
    summary: "Track Berkshire Hathaway holdings with streamlined analytics and visualization.",
    date: "Featured",
    branch: "main"
  },
  {
    name: "valentine",
    liveUrl: "https://valentine-psi-gules.vercel.app",
    repoUrl: "https://github.com/allenho333/valentine",
    repoLabel: "allenho333/valentine",
    summary: "Initial commit of Valentine project",
    date: "Feb 8",
    branch: "main"
  },
  {
    name: "construct",
    liveUrl: "https://itp.constructoo.com.au",
    repoUrl: "https://github.com/allenho333/construct",
    repoLabel: "allenho333/construct",
    summary: "Merge pull request #6 from allenho333/new_ui",
    date: "Feb 4",
    branch: "main"
  },
  {
    name: "new-project",
    liveUrl: "https://new-project-five-olive.vercel.app",
    repoUrl: "https://github.com/allenho333/New-project",
    repoLabel: "allenho333/New-project",
    summary: "Handle postgres URLs without explicit port on Render",
    date: "Feb 11",
    branch: "main"
  }
];

const skillSets = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"]
  },
  {
    category: "Backend",
    items: ["Node.js", "REST APIs", "Serverless APIs", "SQL", "PostgreSQL"]
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS", "Vercel", "Cloudflare", "CI/CD", "GitHub Actions", "Docker"]
  },
  {
    category: "AI & Data",
    items: ["LLM Integration", "Prompt Engineering", "Python", "Streamlit", "RAG Basics"]
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Postman", "VS Code", "Copilot"]
  },
  {
    category: "Leadership & Soft Skills",
    items: ["Production Support", "Technical Leadership", "Communication", "Stakeholder Management", "Ownership"]
  }
];

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<ChatState | null>(null);

  async function onAskAI(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = (await res.json()) as { reply?: string; error?: string; detail?: string };

      setChat({
        question: message,
        answer:
          data.reply ||
          [data.error, data.detail].filter(Boolean).join(" | ") ||
          "No response generated."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <section className="hero card">
        <p className="eyebrow">Senior Portfolio</p>
        <h1>Full Stack Developer & AWS Solutions Architect.</h1>
        <p className="subtitle">
          5+ years experience building scalable applications with AI integration and fintech-focused product
          strategy.
        </p>
        <div className="heroLinks">
          <a href="https://github.com/allenhe" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/allen-ho-49284b7b/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a
            href="https://www.credly.com/badges/df4c92ad-eb4f-47ef-87b0-3ff5d56a9eb2/linked_in?t=scwr3j"
            target="_blank"
            rel="noreferrer"
          >
            AWS Certification Badge
          </a>
        </div>
      </section>

      <section className="card">
        <h2>Experience</h2>
        <div className="timeline">
          {experience.map((job) => (
            <article key={`${job.company}-${job.role}`} className="job">
              <h3>
                {job.role} | {job.company}
              </h3>
              <p className="period">{job.period}</p>
              {"tech" in job && <p className="helperText">Tech: {job.tech}</p>}
              <ul>
                {job.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Projects</h2>
        <div className="projectsGrid">
          {projects.map((project) => (
            <article key={project.name} className="projectItem">
              <h3>{project.name}</h3>
              <p>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  {project.liveUrl.replace(/^https?:\/\//, "")}
                </a>
              </p>
              <p className="projectRepo">
                <a href={project.repoUrl} target="_blank" rel="noreferrer">
                  {project.repoLabel}
                </a>
              </p>
              <p>{project.summary}</p>
              <p className="period">
                {project.date} on {project.branch}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Skill Set</h2>
        <div className="skillsGrid">
          {skillSets.map((group) => (
            <article key={group.category} className="skillGroup">
              <h3>{group.category}</h3>
              <div className="skillList">
                {group.items.map((item) => (
                  <span key={item} className="skillTag">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Chat with Allen&apos;s AI</h2>
        <p className="helperText">
          Ask about AWS architecture experience, AI projects, or fintech delivery examples.
        </p>
        <form onSubmit={onAskAI} className="chatForm">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask my AI assistant about AWS, AI, or my project work"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        {chat && (
          <div className="chatResult">
            <p>
              <strong>You:</strong> {chat.question}
            </p>
            <p>
              <strong>AI:</strong> {chat.answer}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
