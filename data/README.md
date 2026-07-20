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

页面需要的数据由 `scripts/build-site.mjs` 从这里生成。不要直接编辑 `pages/` 下的 JSON、JS 或 HTML。

## 状态

- `draft`：已经记录，但还没有经过人工确认。
- `proposed`：Agent 根据碰撞提出，等待人工裁决。
- `reviewed`：用户确认，可以被页面和自动化使用。
- `archived`：保留历史，不作为默认展示内容。
