# Personal AI OS 协作规则

本文件是 `AGENTS.md`、`CLAUDE.md` 和 `CODEBUDDY.md` 的唯一正文。三份根目录文件只作为 Agent 启动入口，由 `node scripts/sync-agent-guides.mjs` 同步生成。

## 项目定位

这是 Personal AI Operating System，不是博客，也不是把页面当笔记的展示仓库。一个仓库同时提供：个人知识库、GitHub Pages、Agent 上下文、MCP 数据源、Automation 数据源和 Workflow 管理。

## 目录边界

```text
data/                 唯一事实源
  identity/           身份与偏好
  memory/             原始记录与已迁移笔记
  concepts/           洞见、碰撞和概念关系
  books/              书籍实体与阅读快照索引
  people/             人物
  projects/           项目事实
  workflows/          工作流事实
  skills/             Skill 事实
  decisions/          决策记录
  resources/          外部资源与迁移报告
inbox/                外部资料临时摄入区，不是事实源
pages/                构建后的展示目录，不手工维护知识内容
templates/site/       页面模板
agents/               Agent 协作协议
automation/           自动化配置
scripts/              构建、迁移、校验、同步脚本
templates/            模板
assets/               原始图片和媒体
```

事实只写 `data/`。页面只由 `node scripts/build-site.mjs` 生成。MCP、Automation 和页面只能读取 `data/` 或 `pages/data/`，不能把页面 HTML、生成 JSON 或旧目录当事实源。

## 写入门禁

任何“写笔记、发卡片、落数据”指令都必须按顺序执行：

1. 在对应 `data/` 文件中查重：ID、标题、关键词和相似原话；
2. quote 原话：用 `> ` 引用用户原文；
3. 找到明确来源；找不到来源时停下询问，不自行补全；
4. 指出准备写入的实体、关系和状态；
5. 等用户确认后再写入。

批量改动 3 个以上文件时，先列出 diff 计划并等待确认。诊断可以读，不能顺手改。

## 实体格式

新实体必须具备稳定 ID、类型、状态、更新时间、来源和关系。推荐 Frontmatter：

```yaml
---
id: stable-kebab-case-id
type: concept
status: draft
updatedAt: 2026-07-20
source: data/memory/life/2026-07-20-title.md
links: []
tags: []
---
```

状态只有 `draft`、`proposed`、`reviewed`、`archived`。关系指向稳定 ID，并使用 `targetType: node | topic | category` 标明目标类型，不指向页面 URL。用户原话和 Agent 结构化建议必须明确分区。

碰撞卡必须有稳定 `id`、`type: collision`、`status`、`updatedAt` 和 `source`。来源为空时只能保持 `proposed`，不得自动升级为 `reviewed`。

## 原话优先

- 用户说“焦急”就保留“焦急”，不要自行改成“焦虑”“焦灼”或“急躁”。
- “碰撞”不自动扩写为“思想碰撞”或“碰撞融合”。
- 短句不合并，口语不整理，除非用户要求塑形。
- 禁止虚构案例、数据、对话和用户没有提供的“例如”“比如”。
- 禁止使用“在这个瞬息万变的世界里”“让我们一起”“值得我们深思”“不仅……而且……”等 AI 腔。

## 外部资料摄入

其他仓库、聊天记录、书摘和导出文件先进入 `inbox/pending/`，不得直接散落到 `data/`。摄入流程是：

```text
外部资料 → inbox → 实体识别 → 查重与碰撞 → 用户裁决 → data → build → pages
```

`inbox/` 不参与页面、MCP 或自动化读取。确认后只保留必要的“洞见 + 原话”，不把整本书、整段聊天或无关导出长期复制进仓库。

公开页面安全边界：不得写入真实内部 IP、账号、密码、Authorization、Token、Webhook 或公司内部地址。页面只能使用占位符；敏感配置放在本地环境或受控系统中。

## 生活感悟识别入口

“生活感悟”是生活观察、个人原话和结构化洞见的统一入口，不等于阅读笔记，也不等于所有随手记录。与龙虾、Claude Code、Codex 或其他 Agent 对话时，先按来源和意图路由，再决定是否写入：

| 对话信号 | 事实归属 | 处理方式 |
|---|---|---|
| 用户描述自己的生活经历、身体感受、情绪变化、关系观察或人生判断 | `data/memory/life/`，必要时关联 `data/knowledge-graph.json` | 保留用户原话；识别已有生活感悟；确认后再补充或新建 |
| 用户明确说“记录生活感悟”“记下这句原话”“这改变了我” | 生活感悟入口 | 先查重原话、标题和节点；输出准备写入的实体与关系；等待确认 |
| 只有书名、作者、阅读进度或“我读过这本书” | `data/books/` | 只更新阅读记录，不主动生成生活感悟 |
| 书名 + 读后感、摘录或明确的阅读触发 | `data/books/` + 阅读碰撞候选 | 先按阅读碰撞协议处理；用户确认后，才可把跨域洞见关联到生活感悟 |
| 工作流程、测试成果、Agent 工程经验或职业判断 | `data/memory/work/`、`data/projects/`、`data/workflows/` | 不因出现“感悟”“洞见”就写入生活感悟；按工作事实建模 |
| 乒乓动作、技术、训练和身体运动方法 | `data/memory/sports/` | 不混入认知图谱；需要时只建立跨域链接 |

生活感悟页面的事实分层如下：

```text
data/books/books.json#SELF_BIN       个人生活操作系统与归档流程
data/concepts/mobile-cards.json      个人原话卡
data/knowledge-graph.json             已结构化的知识节点与关系
             ↓
projects/life-insights/index.html     统一展示，不作为写入目标
```

Agent 不得直接把新内容写入 `pages/`、`mobile-cards.json` 或旧的 `reading-study.html?bookId=SELF_BIN` 页面。新内容必须先经过查重、来源确认、原话保留、实体定位和用户裁决；“生活感悟”只是识别与展示入口，不能绕过写入门禁。

## 阅读碰撞

用户只说书名，或明确说“只是记录读过”时，不主动碰撞。用户提供书名和读后感、摘录或明确感受时：

1. 在 `data/books/` 查找已有书籍实体；
2. 检索已有关联概念、原话和碰撞；
3. 输出强共鸣、互补或张力，但不得凭空捏造；
4. 只保留用户原话和必要洞见；
5. 让用户选择补充已有、新建洞见、仅保留阅读记录或跳过；
6. 确认前保持 `proposed`，确认后才写入 `reviewed`。

不写书评，不把书的观点冒充用户观点，不用书的语言覆盖用户原话。

## 分类与关系

- `ai-workflow`：人机协作、工具流、自动化、认知升级；
- `thinking`：清晰思考、决策框架、快思考觉察；
- `mental-models`：书籍提炼的跨域认知模型；
- `growth`：方向、状态、执行；
- `life-philosophy`：焦急、平静、当下和生活哲学；
- `sports`：乒乓技术，写入 `data/memory/sports/`，不把乒乓节点混入认知图谱；
- `output`：页面实验、工具构建和项目产出。

不能确定分类时先保留 `draft`，不要为了整齐强行归类。跨域内容用 links 建立关系，不复制到多个目录。

## 页面与部署

- 页面模板在 `templates/site/`；构建结果在 `pages/`。
- 运行 `node scripts/validate-data.mjs` 检查 ID、JSON、断链和生成结果。
- 运行 `node scripts/build-site.mjs` 生成页面。
- 本地预览：`python -m http.server --directory pages`。
- GitHub Actions 推送 `master` 后部署 `pages/` 到 `gh-pages`。
- 不保留 `.deploy_git`、旧 Hexo 页面、旧博客路径或旧页面数据副本。历史文章统一归档到 `data/memory/archive/legacy-articles/`，不再使用 `hexo_posts` 命名。

## Agent 指引同步

只编辑 `agents/operating-rules.md`。完成后运行：

```powershell
node scripts/sync-agent-guides.mjs
```

阅读摄入规则见 `agents/intake-protocol.md`，书籍碰撞规则见 `agents/reading-collision-protocol.md`，写入门禁见 `agents/write-gate.md`。
