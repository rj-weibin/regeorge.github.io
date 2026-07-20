# Personal AI OS

这是 reGeorge 的 Personal AI Operating System：知识库、Agent 上下文、GitHub Pages、MCP 数据源和自动化入口共用一份事实源。

## 核心边界

- `data/` 是唯一事实源。书籍、洞见、项目、工作流、技能和决策只在这里维护。
- `inbox/` 是外部资料的临时摄入区，不参与页面、MCP 或自动化读取。
- `pages/` 是构建产物，只能由脚本生成，不能手工维护知识内容。
- `assets/` 保存原始媒体资源，构建时复制到 `pages/assets/`。
- `agents/` 保存 Agent 的协作协议；根目录的 `AGENTS.md`、`CLAUDE.md`、`CODEBUDDY.md` 是同步入口。

## 数据流

```text
外部资料 → inbox → 碰撞检索与人工确认 → data → build → pages
```

页面、MCP 和 Automation 都只能读取 `data/` 或其构建产物，不能反向把页面当事实源。

## 常用命令

```powershell
node scripts/build-site.mjs
node scripts/validate-data.mjs
node scripts/sync-agent-guides.mjs
python -m http.server --directory pages
```

GitHub Actions 会在推送 `master` 后构建并将 `pages/` 部署到 `gh-pages`。当前迁移不保留旧 Hexo 路径。

## 新内容落地

外部笔记、书摘或对话先放入 `inbox/pending/`。Agent 先检索已有实体和碰撞，再以“洞见 + 原话”的最小形式提出草案；用户确认后才写入 `data/`。

完整规则见 [`agents/operating-rules.md`](agents/operating-rules.md)、[`agents/intake-protocol.md`](agents/intake-protocol.md) 和 [`agents/reading-collision-protocol.md`](agents/reading-collision-protocol.md)。
