import type { ReactNode } from "react";
import { project } from "./data";

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}

export function App() {
  return (
    <main className="page-shell">
      <article className="project-card">
        <header className="hero">
          <div className="hero-head">
            <div>
              <p className="eyebrow">AI Content Workflow</p>
              <h1>{project.title}</h1>
            </div>
            <a
              className="github-link is-disabled"
              aria-disabled="true"
              href={project.githubUrl ?? "#"}
              onClick={(event) => {
                if (!project.githubUrl) {
                  event.preventDefault();
                }
              }}
            >
              {project.githubLabel}
            </a>
          </div>

          <p className="summary">{project.summary}</p>

          <div className="stack-row">
            <span className="stack-label">技术栈</span>
            <div className="stack-tags">
              {project.stack.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="overview">
          <p className="description">
            <strong>项目简介：</strong>
            {project.description}
          </p>

          <ul className="highlights">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="details-grid">
          <div className="panel">
            <SectionTitle>核心流程</SectionTitle>
            <ol className="step-list">
              {project.workflow.map((step) => (
                <li key={step.title}>
                  <span className="step-name">{step.title}</span>
                  <span className="step-desc">{step.description}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="panel">
            <SectionTitle>框架目录</SectionTitle>
            <pre className="code-block">
              <code>{project.structure}</code>
            </pre>
          </div>
        </section>

        <section className="panel">
          <SectionTitle>为什么它是 Harness</SectionTitle>
          <p className="body-copy">{project.whyHarness}</p>
        </section>

        <section className="decision-grid">
          {project.decisions.map((item) => (
            <article key={item.title} className="decision-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
      </article>
    </main>
  );
}
