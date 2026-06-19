export const project = {
  title: "Article Harness",
  githubUrl: "https://github.com/part33/-skills",
  githubLabel: "GitHub：part33/-skills",
  summary:
    "一个 Markdown-first 的通用文章生成工作流，把零散素材稳定转成结构化主稿和可分享网页文章。",
  stack: ["React", "TypeScript", "Vite", "Markdown", "HTML"],
  description:
    "我把文章生成从一次性 prompt，改造成了一套可控、可追踪、可修复的内容生产系统。当前版本采用单 agent 主流程，以保证文章结构、语气和信息保留的一致性；同时预留了多 agent review 的扩展空间，用于后续拆分内容审查和展示审查。",
  highlights: [
    "把 URL、TXT、Markdown 输入统一整理为 source.md，先建立稳定事实底稿，再进入生成流程。",
    "用 plan.md 显式定义文章类型、目标读者、信息保留策略和结构，避免正文边想边写导致的内容漂移。",
    "采用 article.md + article.html 双产物设计，让 Markdown 成为内容真身，HTML 只承担展示增强职责。",
    "把 review 拆成 draft-review 和 final-review，分别处理内容问题与展示问题，减少无意义返工。",
    "在同一条主流程里支持 explainer、tutorial、review、briefing、longform 五种文章类型路由。",
  ],
  workflow: [
    {
      title: "Source Normalize",
      description: "把 Markdown / TXT / URL 整理为 source.md。",
    },
    {
      title: "Planning",
      description: "生成 plan.md，确认类型、读者和保留策略。",
    },
    {
      title: "Draft Build",
      description: "输出 article.md，作为正文真身。",
    },
    {
      title: "Render Build",
      description: "把主稿渲染成可分享的 article.html。",
    },
    {
      title: "Review + Repair",
      description: "分开检查内容和展示，并做最小修复。",
    },
  ],
  structure: `workspace/
  source/
    source.md
    extraction-notes.md
  plan/
    plan.md
  draft/
    article.md
  render/
    article.html
  review/
    draft-review.md
    final-review.md`,
  whyHarness:
    "Article Harness 之所以叫 harness，不是因为它会生成文章，而是因为它管理了文章生成过程。它通过中间状态文件、规划阶段、类型路由、双层 review 和最小修复策略，把一次性 prompt 变成了一条可控的内容生产线。",
  decisions: [
    {
      title: "Markdown 是内容真身",
      description: "先产出 article.md，保证文章可编辑、可迁移，也便于后续接入不同站点或渲染器。",
    },
    {
      title: "HTML 只做轻渲染增强",
      description: "HTML 层负责目录、摘要区、代码高亮和引用块样式，但不大幅改写正文结构。",
    },
    {
      title: "统一流程 + 类型路由",
      description: "同一条主流程支持 explainer、tutorial、review、briefing、longform 五种文章类型。",
    },
    {
      title: "双层 Review",
      description: "把 draft-review 和 final-review 分开，让内容问题和展示问题各自回到正确层处理。",
    },
  ],
};
