# caseHelper 阶段思考

> 审查日期：2026-04-01
> 审查范围：全仓库（skills / services / scripts / knowledge / archive / agent_service / workspace）

---

## 一、你做了哪些设计和考虑

### 1. 四层架构分离

从一开始的散落脚本，逐步演化出清晰的四层边界：

| 层级 | 目录 | 职责 |
|------|------|------|
| 能力层 | `skills/` | 原子化 API 封装（飞书、SDET平台、用例分析），只做一件事 |
| 编排层 | `services/` | 统一 `ServiceResult` / `ErrorCode` / `logging_config`，组合能力完成业务流程 |
| 入口层 | `scripts/` | 薄入口，只解析参数 + 调 service + 打印摘要 |
| 资产层 | `knowledge/` | 145 条公共用例 JSON + manifest 映射 + 审计规则，版本化进 git |

这个分层的核心价值是让"新需求"不再需要从零写脚本——能力已有，只需编排。

### 2. Phase 0 人工审批门禁机制

最重要的流程设计。在 `copilot-instructions.md` 和 `SYSTEM_PROMPT.md` 中硬编码了"批量创建前必须停下来等人确认"的阻断规则。

这不是过度设计——它直接来源于 dot1x 项目 66 条用例返工的血泪教训：不做状态矩阵分析就批量创建，错误会被 N 倍放大。

Phase 0 的五步标准动作：
1. 状态维度拆解与穷举
2. 公共模版与动态变量映射
3. 多层业务目录结构设计
4. 输出结构化分析报告
5. 阻断等待审批

### 3. 知识库沉淀与同步体系

把平台上的公共用例拉到本地 JSON，维护 `common_cases_manifest.json` 做别名→ID 映射。这让"知道平台上有什么公共步骤"变成了可离线查询、可 diff、可审计的能力。

同步链路：平台 → `sync_knowledge_from_platform.py` → `knowledge/common_cases/*.json` → git commit

### 4. 审计前置思维

`case-debugger` 的定位不是"出了问题再查"，而是"创建样本后立即跑审计，0 偏差才放行批量"。把审计当 CI lint 而不是事后 hotfix。

### 5. 统一错误与结果契约

`services/errors.py` 定义了 11 种 `ErrorCode` + `ErrorCategory` 分类，`services/result.py` 统一了 `ServiceResult` 对象。所有 service 方法返回 `ServiceResult`，调用方不需要 try-catch 就能判断成功失败。

### 6. 项目交付物标准化

从 `archive/` 的散落归档进化到 `workspace/analysis/{YYYYMMDD}_{项目名}/` 的标准结构：
```
01_分析报告.md    ← Phase 0 产物
02_接口契约.md    ← 公共步骤设计
03_总结概览.html  ← 可视化报告
04_reference/     ← 原始数据
```

让每个需求都有完整审计轨迹。

### 7. Agent 执行沙箱

`agent_service/` 用 FastAPI 搭了一个轻量代码执行沙箱，支持 Tool-calling Agent 在隔离环境中运行 Python。安全策略基于模块白名单 + 路径约束，适合内部可信环境。

---

## 二、做了哪些有效的事情

### ✅ 1. Phase 0 门禁彻底消灭了"批量返工"

dot1x 之后的所有项目（多业务服务、Zentyal、寒暑假计费、MAC无感等）都执行了 Phase 0 分析。没有再出现过"批量创建后大规模审计不通过"的情况。**这是整个项目投入产出比最高的设计。**

### ✅ 2. platform-client 统一了平台 API 交互

把平台的所有怪癖（`method` 是整数、不支持 PUT、body 单层序列化）封装在一处。后续所有脚本都不需要再踩这些坑。

### ✅ 3. 知识库 + manifest 让公共步骤可查可追

145 条公共用例 JSON 已经形成可版本化的资产。做新需求时可以先查 manifest，避免重复创建已有的公共步骤。

### ✅ 4. insight.md 的复盘文化

`knowledge/case_design/insight.md` 详细记录了 dot1x 失败的每一个细节（method 类型错误、body 双重序列化、审计 int/str 不匹配）。这份文档本身就是防止重犯的最有效手段。

### ✅ 5. 从专用脚本到通用入口的收敛

早期每个项目一个脚本（`create_w9qybu_cases.py`、`analyze_dot1x_passwd_cases.py`），后期收敛到通用的 `create_directories_and_cases.py` 和 `sync_knowledge_from_platform.py`。脚本增长趋势被控制住了。

### ✅ 6. ServiceResult 统一了输出格式

不再需要在每个脚本里自定义错误处理和输出格式。service 层返回统一的 ok/fail 对象，调用方只需要判断 `.success`。

---

## 三、做了哪些无用功

### ❌ 1. Lark 能力过度拆分

把飞书对接拆成了 5 个独立模块（`lark-access-token`、`lark-sheets`、`lark-sheet-reader`、`lark-sheet-writer`、`lark-api-helper`），实际使用中 reader 和 writer 覆盖了 90% 的场景。`lark-api-helper` 作为聚合器几乎没被使用。1-2 个模块就够了。

### ❌ 2. agent_service 投入产出不匹配

搭了 FastAPI 沙箱执行服务（main.py + executor.py + security.py + config.yaml），但实际工作流中从未通过它执行过批量任务——所有操作都是直接跑脚本或在 Copilot Chat 中完成。这个服务目前处于"能跑但没人用"的状态。

### ❌ 3. case-scenario-splitter 和 test-case-analyzer 停留在 POC

`case-skills/` 下的场景拆分器和用例分析器做了原型但从未集成到正式工作流。Phase 0 的分析一直是人工 + Copilot 对话完成的，不需要独立的分析模块。

### ❌ 4. skills 自动发现与推荐系统

`skills-discovery.py` 和 `skills-assistant.py` 做了关键词搜索和意图匹配推荐，但实际场景中使用者已经知道要调哪个 skill——这套发现系统解决的是一个不存在的问题。

### ❌ 5. 早期专题脚本的重复投入

`archive/` 中的 `analyze_peap_cases.py`、`create_w9qybu_cases.py` 等专题脚本，每个项目都重写了一遍相似的流程。直到后来收敛到通用脚本后这些投入才停止。前期约 4-5 个专题脚本属于可避免的重复劳动。

### ❌ 6. 架构优化建议中的"拆分 platform_client"

架构审阅报告建议把 platform_client 拆成 `directory_client` / `case_client` / `flow_client` / `variable_client`。但实际上这个文件 500 行，所有调用者都只 `from platform_client import PlatformClient`。拆分带来的 import 复杂度和维护成本远大于收益。对于一个工具性项目，"上帝类"只要内部方法职责清晰，不拆也没问题。

---

## 四、需要知道边界、不做无用探索的方向

### 🚫 1. 不要再做"自动化 Phase 0 分析"

Phase 0 的核心价值是**人的判断**——哪些维度正交、哪些组合有业务意义、哪些参数需要抓包确认。试图用代码自动完成这一步只会产出"看似完整但未经验证"的分析表，反而增加审核负担。保持"AI 辅助生成 + 人工审批"的模式就够了。

### 🚫 2. 不要再扩展 agent_service

除非有明确的多人协作或 CI/CD 集成需求，否则不要再投入沙箱执行服务。当前 Copilot Chat + 本地脚本的工作模式已经足够。如果未来需要远程执行，应该直接上 CI pipeline 而不是维护自建沙箱。

### 🚫 3. 不要给 skills 做更多的发现/推荐/元数据系统

`skills-registry.json`、`skills-discovery.py`、`skills-assistant.py` 已经证明：使用者不需要"搜索 skill"。Copilot instructions 里已经写清了何时用什么能力，不需要运行时发现。

### 🚫 4. 不要追求知识库双向同步

当前"平台→本地"单向同步已经够用。"本地→平台"的反向推送意味着要处理冲突合并、版本覆盖、并发写入等复杂问题，收益极低。本地知识库的定位是"只读参考"，不是"权威数据源"。

### 🚫 5. 不要为这个项目建单元测试框架

这是一个工具/脚本性质的项目，不是业务应用。核心质量保障靠的是 Phase 0 门禁 + contract_smoke + case-debugger 审计，不是 pytest。把精力花在业务审计规则的完善上比写 mock 测试有效得多。

### 🚫 6. 不要做脚本层面的"标准化改造"

架构报告建议区分 `scripts/official/` 和 `scripts/legacy/`、用前缀区分正式/迁移/一次性脚本。实际上 `archive/` 已经承担了历史归档职责，`scripts/` 下留下的就是当前在用的。不需要再做入口规范化。

---

## 五、需要继续打磨的方向

### 🔧 1. case-debugger 的全局公共用例识别

**已知 bug**：审计器只扫描指定目录下的公共用例，识别不了 51401/51403 等全局公共用例，会误报为 COMMON_MISSING。修复方案已明确（对未识别的 quoteId 调平台 API 反查），但一直没有落地。这是当前审计准确率最大的阻碍。

### 🔧 2. 审计规则配置的自动生成

当前 `knowledge/audit/config_rules.json` 是手工编写的。Phase 0 分析已经产出了维度拆解和状态组合表，应该能自动生成对应的审计规则配置，而不是每次都手写 JSON。这是 Phase 0 产物到 Phase 2 审计之间缺失的自动化桥梁。

### 🔧 3. 配置源收敛

当前存在 4 个配置来源：根 `config.py`、`services/config.py`（从 .env 加载）、`agent_service/config.yaml`、各模块散落的硬编码。应该收敛到一个来源（`services/config.py` + `.env`），根 `config.py` 只保留常量定义。这不需要大改，只需要逐步统一引用路径。

### 🔧 4. sys.path 注入的治理

全仓库有 15+ 处 `sys.path.insert()`，导致从不同目录运行同一脚本可能失败。短期可以在根目录加一个 `setup.py` 或 `pyproject.toml` 做 editable install（`pip install -e .`），让所有模块可以用正常 import 路径引用。这是改善日常开发体验最直接的一步。

### 🔧 5. 公共步骤知识库的结构校验

145 条 JSON 没有 schema 校验。如果同步脚本出 bug 写出了缺字段的 JSON，下游（审计器、批量创建器）会在运行时报错。加一个简单的 JSON Schema 或 Pydantic model 做入库校验，成本很低但能防止隐性损坏。

### 🔧 6. 飞书回写链路的幂等性

当前 `write_case_ids_to_lark.py` 没有幂等保护——重复执行会覆盖已有数据或产生重复行。应该在写入前检查目标单元格是否已有值，有值则跳过或比对后更新。

---

## 六、总体评价

这个项目最有价值的产出不是代码，而是**流程认知的固化**。

从 dot1x 的 66 条返工，到 Phase 0 门禁的确立，到知识库的版本化沉淀，再到项目交付物的标准化——每一步迭代都源于真实的痛点，解决了真实的问题。

当前架构的核心定位已经稳定：

```
飞书手工用例 → Phase 0 状态分析(人工审批) → 公共步骤创建 → 样本验证 → 批量创建 → 审计 → 回写飞书 → 知识库同步
```

这条链路中，**Phase 0 门禁 + platform-client 封装 + 知识库 manifest** 是三个真正的支柱。其余的能力（services 统一契约、case-debugger 审计、飞书读写）是有用的配套，但不是不可替代的。

下一阶段的重心应该放在"打磨已有支柱的可靠性"上（修 debugger bug、自动生成审计规则、收敛配置），而不是继续扩展新能力。项目已经过了"做加法"的阶段，进入了"做减法和加固"的阶段。

---

> *先穷举状态组合，再创建公共步骤，最后批量生成业务用例——顺序反了，成本翻倍。*
> —— insight.md
