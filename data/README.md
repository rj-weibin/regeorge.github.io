# data：唯一事实源

这里保存经过确认、可被 Agent 和自动化读取的实体数据。原始记录也可以保留在 `data/memory/`，但原始记录不等于已经确认的结构化实体。

每个结构化实体必须有稳定 `id`、`type`、`status`、`updatedAt` 和 `source`。跨实体关系写在 `links` 或 `relations` 中，并通过 `targetType` 区分 `node`、`topic` 和 `category`；目标不使用易变的页面路径。

碰撞卡统一使用：

```json
{
  "id": "collision-stable-id",
  "type": "collision",
  "status": "proposed",
  "updatedAt": "YYYY-MM-DD",
  "source": null,
  "tag": "标题",
  "summary": "洞见",
  "dialogue": "原始对话或依据"
}
```

`source: null` 或 `status: proposed` 表示来源尚未完成确认，Agent 不得把它当作已确认事实。

乒乓卡是乒乓训练的个人原话卡片，独立存放于 `data/memory/sports/pingpong-cards.json`，结构与 `data/concepts/mobile-cards.json` 相同，但 `type` 为 `pingpong-card`、`category` 为 `乒乓`。它不与认知图谱混编，只被乒乓主页读取。页面需要的数据由 `scripts/build-site.mjs` 从这里生成。不要直接编辑 `pages/` 下的 JSON、JS 或 HTML。

## 从 memory 到图谱的准入标准

`data/memory/` 保存原始记录，`data/knowledge-graph.json` 只保存已结构化的节点。不是每篇 memory 都要进图谱——图谱筛选、去重、跨域联结，而不是全量搬运。一篇 memory 进入图谱，至少满足其一：

- 提出一个可复用的判断框架（如「先完整理解，再做出判断」）；
- 与已有 2 个以上节点形成关系（`enables` / `part_of` / `related`），而不是孤立的一句话；
- 是某本书、某次碰撞、某个项目的关键锚点（有 `bookBadge` 或强 `source`）。

不进入图谱的典型：纯情绪记录、单日流水、方法论重复。这类内容保留在 `data/memory/` 即可，不因“写过”就必须升格为节点。

## 状态

- `draft`：已经记录，但还没有经过人工确认。
- `proposed`：Agent 根据碰撞提出，等待人工裁决。
- `reviewed`：用户确认，可以被页面和自动化使用。
- `archived`：保留历史，不作为默认展示内容。
