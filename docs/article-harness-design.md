# Article Harness 设计文档

## 1. 背景

`beautiful-article` 证明了一件事：文章生成如果被当成一个“受控流程”来做，而不是一次性 prompt，稳定性会高很多。它最有价值的几个设计点是：

- 先把素材统一整理，再开始写
- 关键状态写进文件，而不是依赖聊天上下文记忆
- 先规划，再生成
- 把 review 和 repair 设计成正式阶段

新的 skill 应该继承这些优点，但把重心从“HTML 优先的网页文章生产”转向“Markdown 优先的文章生产，HTML 作为展示产物”。

这份文档定义一个新的独立 skill：`article-harness`。

## 2. 目标

- 做一个可复用的通用文章生成 harness
- 支持从 `Markdown`、`TXT`、`URL` 这三类输入稳定产出文章
- 同时交付 `article.md` 和 `article.html`
- 用同一条主流程支持多种文章类型
- 比 `beautiful-article` 更轻，但保留规划和 review 的稳定性

## 3. 范围与非目标

### 本期范围

- 一个独立 skill，有自己的流程和参考文档
- 支持 `Markdown`、`TXT`、`URL` 输入归一化
- 固定主流程：`source -> plan -> draft -> render -> review -> repair -> delivery`
- `Markdown` 作为文章内容真身
- `HTML` 作为轻量展示增强层
- 支持以下文章类型路由：
  - `explainer`
  - `tutorial`
  - `review`
  - `briefing`
  - `longform`
- 一个小型主题 profile 系统
- 两层 review：内容 review 和展示 review

### v1 非目标

- `PDF`、`DOCX`、截图或混合媒体输入
- 像杂志封面那样的重定制页面编排
- 深度交互控件、图表或应用式 HTML
- 完整插件化的渲染体系
- 取代 `beautiful-article`

## 4. 方案对比

### 方案 A：直接在 `beautiful-article` 上继续改

- 保留现有 skill，再把它往 Markdown-first 方向掰过去
- 优点：
  - 能复用不少现有思路和资产
  - 初始搭建成本低
- 缺点：
  - 会和原 skill 的 HTML-first 定位冲突
  - 两个不同产品边界会变模糊
  - 长期维护上容易混乱

### 方案 B：新建一个很轻的 prompt-only skill

- 新 skill 只提供流程提示，不提供稳定结构和渲染能力
- 优点：
  - 起步快
  - 很灵活
- 缺点：
  - 结构太弱，难以稳定复用
  - 对输出形态、review 和成品质量的约束不足

### 方案 C：新建一个独立的中型 harness

- 新建一个 skill，带固定流程、稳定工作区结构、文章类型路由、Markdown-first 主稿和最小 HTML 渲染层
- 优点：
  - 继承了 harness 最有价值的设计思想
  - 和 `beautiful-article` 的边界清楚
  - 足够稳定，适合反复复用
  - 比完整前端文章系统更轻
- 缺点：
  - 前期设计工作量更大
  - 仍然需要认真定义渲染策略和主题模型

## 5. 推荐方案

推荐采用 **方案 C：新建一个独立的中型 harness**。

原因：

- 新 skill 和 `beautiful-article` 的核心哲学已经不同
- Markdown 应该成为文章内容的唯一真身
- HTML 仍然重要，但它应该是渲染目标，而不是内容中心
- 中型 harness 在“稳定性”和“效率”之间最平衡

## 6. 详细设计

### 6.1 产品定位

`article-harness` 是一个通用文章生成 skill。它不是网站搭建器，也不是一次性写作 prompt，而是一套结构化生产流程，用来把整理好的素材稳定地转成：

- 一个可继续编辑的主稿：`article.md`
- 一个可分享的展示产物：`article.html`

### 6.2 工作流

v1 采用中型流程：

1. `Intake`
2. `Source Normalize`
3. `Planning`
4. `Plan Checkpoint`
5. `Draft Build`
6. `Render Build`
7. `Draft Review`
8. `Final Review`
9. `Repair`
10. `Delivery`

这个流程保留一个明确的 checkpoint，但不采用 `beautiful-article` 那种更重的“先做首屏样张再确认”的模式。

### 6.3 工作区结构

```text
workspace/
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
    final-review.md
```

设计原则：

- `source/` 保存归一化后的事实底稿
- `plan/` 保存编辑决策
- `draft/` 保存正文真身
- `render/` 保存展示产物
- `review/` 保存质量检查结论

### 6.4 主稿模型

`draft/article.md` 是全流程的内容真身。

文章格式采用：

- 兼容 GFM 的标准 Markdown
- 顶部带少量 frontmatter
- v1 不引入重型自定义语法

建议 frontmatter 字段如下：

```yaml
---
title: ""
subtitle: ""
article_type: ""
audience: ""
language: ""
retention: ""
toc: true
summary: ""
theme: ""
---
```

规则：

- frontmatter 只放“文章级元信息”
- 正文部分尽量保持标准 Markdown
- 布局指令不写进正文

### 6.5 规划模型

`plan/plan.md` 是整个 harness 的控制文档。

必须包含以下部分：

1. `Article Type`
2. `Audience`
3. `Language`
4. `Retention`
5. `Core Thesis`
6. `Outline`
7. `Tone`
8. `Markdown Contract`
9. `HTML Strategy`
10. `Review Focus`

要求：

- 必须先写 `plan.md`，再进入 draft
- 用户在 planning 结束后做一次方向确认

### 6.6 文章类型路由

harness 支持五种文章类型：

- `explainer`
- `tutorial`
- `review`
- `briefing`
- `longform`

共享规则：

- 所有类型都走同一条主流程
- 不同类型通过规划规则、结构规则、语气规则和 review 规则体现差异

在 `plan.md` 中必须明确写出：

- 选中的类型是什么
- 为什么它适合这份素材
- 为什么没有选另外 1 到 2 个相近类型

### 6.7 信息保留策略

默认信息保留不是统一值，而是按文章类型自适应：

- `briefing`：低到中保留，默认约 `30% - 50%`
- `explainer`：中到高保留，默认约 `60% - 80%`
- `tutorial`：中到高保留，默认约 `70% - 90%`
- `review`：中到高保留，默认约 `60% - 80%`
- `longform`：高保留，默认约 `85% - 100%`

用户可以在 planning 阶段覆盖默认值，但系统默认应来自文章类型。

### 6.8 渲染策略

渲染层必须保持轻：

- Markdown 决定内容结构和顺序
- HTML 负责提升阅读体验和分享效果
- HTML 不允许大幅改写或重排正文

渲染模型：

- Markdown -> HTML 模板
- 固定增强插槽
- 类型感知和主题感知的样式层

必须支持的增强插槽：

1. `Hero`
2. `Summary`
3. `TOC`
4. `Callouts`
5. `Code Extras`

标准 HTML 增强包括：

- 清晰的排版层级
- 代码高亮
- 复制代码按钮
- 表格样式
- 引用块样式
- 脚注样式

### 6.9 主题系统

v1 的主题系统采用小型 profile 模式。

初始主题建议：

- `editorial`
- `technical`
- `briefing`
- `minimal`

规则：

- 文章类型和主题有推荐关系，但不强绑定
- 每种文章类型有一个建议默认主题
- 用户可以覆盖默认推荐

示例默认关系：

- `tutorial` -> `technical`
- `briefing` -> `briefing`
- `review` -> `editorial`
- `longform` -> `editorial`
- 兜底 -> `minimal`

### 6.10 Review 模型

review 分成两层。

#### Draft Review

输入：

- `source/source.md`
- `plan/plan.md`
- `draft/article.md`

关注点：

- 文章类型有没有选对
- 结构是否清楚
- 信息保留是否符合预期
- 核心论点是否清晰
- 语气是否符合 `plan.md`
- 文章是否真的讲明白了它宣称要讲明白的内容

输出：

- `review/draft-review.md`

#### Final Review

输入：

- `draft/article.md`
- `render/article.html`
- `plan/plan.md`

关注点：

- 阅读性
- 展示是否清楚
- 标题层级和 TOC 是否好用
- 代码、引用、表格、提示块渲染是否正确
- HTML 是否帮助阅读，而不是扭曲内容

输出：

- `review/final-review.md`

### 6.11 Repair 策略

repair 要遵守“最小修复”原则：

- 只修能解决问题的最小单位
- 内容问题修在 `draft/article.md`
- 展示问题修在 `render/article.html`
- 除非 `plan` 本身错了，否则不要轻易整篇重写

## 7. 风险与回退

### 风险

- 如果渲染层做得过强，skill 可能重新滑回 HTML-first
- 如果类型规则太弱，不同文章类型会写得很像
- URL 归一化质量可能不稳定
- 主题系统太小的话，成品可能会有重复感

### 缓解方式

- 始终坚持 Markdown 是唯一内容真身
- 在 `plan.md` 中强制显式写出类型选择
- 把渲染增强限制在固定范围
- 把 draft review 和 final review 分开
- 把 theme 仅当作 profile 层，不当作内容结构层

### 回退策略

如果渲染层变得太复杂，就把 v1 回退为：

- Markdown-first 主稿
- 简单 HTML 模板输出
- 更少的增强插槽

如果文章类型路由显得不够稳，可以暂时缩减类型支持为：

- `explainer`
- `tutorial`
- `review`

## 8. 验证与验收

### 验证方式

- 每种文章类型至少跑一个样例
- 对照 `source.md`、`plan.md`、`article.md`、`article.html` 检查一致性
- 验证 HTML 是否引入事实漂移或结构漂移

### 验收标准

- 三类输入都能稳定产出 `article.md` 和 `article.html`
- `plan.md` 足以指导 draft，不依赖聊天里隐藏决策
- `article.md` 作为纯 Markdown 仍然可读、可迁移
- `article.html` 明显提升阅读体验，但不会变成一个定制化一次性页面
- review 文档能明确区分“内容问题”和“展示问题”

## 9. 未决问题

- v1 的 URL 抽取是先依赖单一路径，还是保留多个 extraction backend？
- `summary` 应该强制要求写进 frontmatter，还是允许从导语自动推断？
- `callouts` 在 v1 要不要定义严格的 Markdown 约定，还是延后到 v2？
- 主题推荐是否只由文章类型决定，还是还要考虑 source 的信息密度？
