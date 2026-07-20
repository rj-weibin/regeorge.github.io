/**
 * AutoTest Station Architecture Graph
 * Data structure follows the Knowledge Atlas pattern:
 *   categories → topics → nodes
 */
const ARCH_GRAPH = {
  meta: {
    title: "需求自动化工作站",
    subtitle: "从脚本仓库到服务编排 + 交互工作站的演进全景",
    lastUpdated: "2026-05-09"
  },

  categories: [
    { id: "layers",    title: "三层架构",     icon: "🏗️", color: "#0f766e", description: "skills → services → scripts 的分层职责边界" },
    { id: "truth",     title: "数据真相",     icon: "💎", color: "#b45309", description: "meta.json 唯一真相源与派生产物体系" },
    { id: "workspace", title: "资产治理",     icon: "📁", color: "#7c3aed", description: "版本化目录、sandbox 隔离、archive 归档" },
    { id: "station",   title: "工作站门户",   icon: "🖥️", color: "#0284c7", description: "三栏交互面板，需求全生命周期可视化" },
    { id: "lifecycle", title: "流程生命周期", icon: "🔄", color: "#059669", description: "创建 → 沉淀 → 快照 → 评审 → 报告" },
    { id: "roadmap",   title: "治理路线",     icon: "🗺️", color: "#dc2626", description: "P0 收口 → P1 入口 → P2 迁移" },
    { id: "insights",  title: "演进洞见",     icon: "💡", color: "#d97706", description: "架构复盘中提取的可复用工程认知" },
  ],

  topics: [
    // ── layers ──
    { id: "skills-layer",   categoryId: "layers", title: "Skills 单能力封装",  oneLiner: "可复用的原子 API 包装", status: "stable", updatedAt: "2026-05-09" },
    { id: "services-layer", categoryId: "layers", title: "Services 编排层",    oneLiner: "跨 skill 业务流编排，返回 ServiceResult", status: "stable", updatedAt: "2026-05-09" },
    { id: "scripts-layer",  categoryId: "layers", title: "Scripts 薄入口",     oneLiner: "CLI 参数解析 + 服务调用 + 输出摘要", status: "stable", updatedAt: "2026-05-09" },

    // ── truth ──
    { id: "meta-json",      categoryId: "truth", title: "meta.json 唯一真相",     oneLiner: "每个 workstream 的核心状态合同", status: "stable", updatedAt: "2026-05-09" },
    { id: "derived-chain",  categoryId: "truth", title: "派生产物链",              oneLiner: "CSV → board_state → 报告 → 飞书", status: "stable", updatedAt: "2026-05-09" },

    // ── workspace ──
    { id: "version-dirs",   categoryId: "workspace", title: "版本化目录",     oneLiner: "workspace/<version>/analysis/<workstream>", status: "stable", updatedAt: "2026-05-09" },
    { id: "sandbox-rules",  categoryId: "workspace", title: "sandbox 边界",   oneLiner: "探针用完即弃，结论上浮", status: "stable", updatedAt: "2026-05-09" },
    { id: "archive-rules",  categoryId: "workspace", title: "archive 归档",   oneLiner: "只读历史，不进入活跃上下文", status: "stable", updatedAt: "2026-05-09" },

    // ── station ──
    { id: "station-layout", categoryId: "station", title: "三栏布局",             oneLiner: "导航 + 详情 + 报告面板", status: "stable", updatedAt: "2026-05-09" },
    { id: "station-tabs",   categoryId: "station", title: "五维视图",             oneLiner: "大盘 / 卡点 / ATP / 用例 / 说明", status: "stable", updatedAt: "2026-05-09" },
    { id: "station-atp",    categoryId: "station", title: "ATP 快照与级联",       oneLiner: "一键刷新所有 task 执行数据", status: "stable", updatedAt: "2026-05-09" },

    // ── lifecycle ──
    { id: "phase-create",   categoryId: "lifecycle", title: "📥 创建收编",   oneLiner: "从飞书表格导入需求条目", status: "stable", updatedAt: "2026-05-09" },
    { id: "phase-settle",   categoryId: "lifecycle", title: "🧱 结构化沉淀", oneLiner: "填充 meta.json 字段、导入 CSV", status: "stable", updatedAt: "2026-05-09" },
    { id: "phase-snapshot",  categoryId: "lifecycle", title: "🔁 ATP 快照",  oneLiner: "绑定 task → 拉取执行数据", status: "stable", updatedAt: "2026-05-09" },
    { id: "phase-review",   categoryId: "lifecycle", title: "🔍 评审分析",   oneLiner: "卡点定位、scope 通过率分析", status: "stable", updatedAt: "2026-05-09" },
    { id: "phase-report",   categoryId: "lifecycle", title: "📊 报告导出",   oneLiner: "生成结构化日报/周报", status: "stable", updatedAt: "2026-05-09" },

    // ── roadmap ──
    { id: "p0-rules",       categoryId: "roadmap", title: "P0 · 先收口规则",   oneLiner: "meta.json 最小合同 + 5 份文档上限", status: "in-progress", updatedAt: "2026-05-09" },
    { id: "p1-entry",       categoryId: "roadmap", title: "P1 · 流程入口统一", oneLiner: "所有操作通过工作站入口", status: "planned", updatedAt: "2026-05-09" },
    { id: "p2-migration",   categoryId: "roadmap", title: "P2 · 历史迁移",     oneLiner: "存量 workstream 逐步规范化", status: "planned", updatedAt: "2026-05-09" },

    // ── insights ──
    { id: "insight-topic",  categoryId: "insights", title: "架构演进复盘",   oneLiner: "从脚本仓库到 AI Native 编排的认知跃迁", status: "stable", updatedAt: "2026-05-27" },
  ],

  nodes: [
    // ── Skills 详情 ──
    { id: "platform-client", topicId: "skills-layer", title: "PlatformClient", oneLiner: "SDET ATP 平台核心 API 封装",
      detail: "封装 case/step/variable/debug 全套 CRUD，处理 method 整数映射、body 序列化、分页遍历。所有 HTTP 交互收敛到此处。",
      tags: ["SDET", "HTTP", "CRUD"], status: "stable", updatedAt: "2026-05-09" },
    { id: "lark-reader", topicId: "skills-layer", title: "LarkSheetReader", oneLiner: "飞书电子表格 → JSON 读取",
      detail: "OAuth2 认证 + 表格/Sheet/Range 三层寻址，支持批量读取和格式清洗。",
      tags: ["飞书", "OAuth2", "Sheet"], status: "stable", updatedAt: "2026-05-09" },
    { id: "lark-writer", topicId: "skills-layer", title: "LarkSheetWriter", oneLiner: "JSON → 飞书电子表格回写",
      detail: "支持单元格级写入和批量范围覆盖，处理富文本格式保留。",
      tags: ["飞书", "Write", "Sheet"], status: "stable", updatedAt: "2026-05-09" },
    { id: "case-analyzer", topicId: "skills-layer", title: "CaseAnalyzer", oneLiner: "用例状态维度分解与可覆盖性判定",
      detail: "解析手工用例文本，提取状态组合维度，输出笛卡尔积覆盖矩阵。Phase 0 门禁依赖此能力。",
      tags: ["分析", "覆盖", "Phase0"], status: "stable", updatedAt: "2026-05-09" },
    { id: "sdet-login", topicId: "skills-layer", title: "SDETLogin", oneLiner: "SDET 平台认证与 token 管理",
      detail: "登录 → 获取 token → 缓存刷新。被 PlatformClient 依赖。",
      tags: ["Auth", "Token"], status: "stable", updatedAt: "2026-05-09" },
    { id: "case-debugger", topicId: "skills-layer", title: "CaseDebugger", oneLiner: "远程调试用例并采集步骤级日志",
      detail: "触发 debug_case → 轮询执行日志 → 解析步骤级 PASS/FAIL → 输出结构化报告。",
      tags: ["Debug", "日志", "验证"], status: "stable", updatedAt: "2026-05-09" },

    // ── Services 详情 ──
    { id: "service-result", topicId: "services-layer", title: "ServiceResult 契约", oneLiner: "所有 service 统一返回格式",
      detail: "ServiceResult.ok() / .fail()，fail 必须携带 error_code + root_cause + action_hint。ErrorCode 枚举驱动修复路径：CONFIG_MISSING 修环境，API_CONTRACT_MISMATCH 修适配层。",
      tags: ["契约", "ErrorCode", "核心"], status: "stable", updatedAt: "2026-05-09" },
    { id: "batch-create", topicId: "services-layer", title: "批量建用例编排", oneLiner: "Phase 0-3 四阶段门禁制",
      detail: "Phase 0: 状态维度分解 → 笛卡尔积 → 人工确认\nPhase 1: 单条合约验证\nPhase 2: 每组合一条样本 + debugger 审计\nPhase 3: 批量创建 + ID 回填",
      tags: ["Phase0", "批量", "门禁"], status: "stable", updatedAt: "2026-05-09" },
    { id: "config-service", topicId: "services-layer", title: "ServiceConfig", oneLiner: "环境变量 + .env 单一配置源",
      detail: "get_config() 单例返回 ServiceConfig dataclass。禁止在 service/script 中直接调用 os.getenv()。",
      tags: ["Config", "单例", ".env"], status: "stable", updatedAt: "2026-05-09" },

    // ── Scripts 详情 ──
    { id: "script-rules", topicId: "scripts-layer", title: "脚本规范", oneLiner: "参数解析 + service 调用 + 输出摘要",
      detail: "scripts/ 禁止直接调用 PlatformClient 或 LarkSheetReader。只做三件事：CLI 参数 → service.method() → print summary。",
      tags: ["CLI", "规范", "薄入口"], status: "stable", updatedAt: "2026-05-09" },
    { id: "station-scripts", topicId: "scripts-layer", title: "工作站启动", oneLiner: "run_interactive_station.py",
      detail: "启动本地 HTTP 服务 (默认 127.0.0.1:8765)，提供 dashboard API + 静态文件服务。station/ 目录下的 HTML 文件均可直接访问。",
      tags: ["HTTP", "本地", "8765"], status: "stable", updatedAt: "2026-05-09" },

    // ── meta.json 详情 ──
    { id: "meta-contract", topicId: "meta-json", title: "最小合同字段", oneLiner: "8 个必填字段构成需求基础状态",
      detail: "workstream_id, name, status, updated_at, managed_by_station, workspace_version, scope.csv_file, station.case_import",
      tags: ["必填", "合同", "schema"], status: "stable", updatedAt: "2026-05-09" },
    { id: "meta-station", topicId: "meta-json", title: "station 扩展字段", oneLiner: "case_panel, lifecycle_inputs, highlights, navigation",
      detail: "工作站通过读写 meta.json 的 station 节点实现状态持久化。所有交互操作（pin、notes、ATP binding）最终都写入此处。",
      tags: ["扩展", "持久化", "交互"], status: "stable", updatedAt: "2026-05-09" },

    // ── 派生链 ──
    { id: "csv-import", topicId: "derived-chain", title: "CSV 导入", oneLiner: "飞书表格 → 本地 CSV → meta.json",
      detail: "导入时自动检测列名映射，支持增量刷新。CSV 文件是用例数据的本地快照，不可手动修改。",
      tags: ["导入", "快照", "飞书"], status: "stable", updatedAt: "2026-05-09" },
    { id: "board-state", topicId: "derived-chain", title: "board_state.json", oneLiner: "所有 workstream 的 ATP 快照聚合",
      detail: "由 /api/atp/snapshot/refresh 写入。包含 task 执行摘要、scope 通过率、用例级详情。是报告生成和大盘展示的数据源。",
      tags: ["聚合", "ATP", "快照"], status: "stable", updatedAt: "2026-05-09" },

    // ── 版本化目录 ──
    { id: "dir-structure", topicId: "version-dirs", title: "目录结构", oneLiner: "workspace/<version>/analysis/<workstream>/",
      detail: "每个版本独立目录，每个需求独立子目录。目录下必须包含 meta.json，可选 CSV、review.html 等分析产物。工作目录最多保留 5 份人读文档。",
      tags: ["版本", "目录", "隔离"], status: "stable", updatedAt: "2026-05-09" },

    // ── sandbox ──
    { id: "sandbox-policy", topicId: "sandbox-rules", title: "探针策略", oneLiner: "用完提取结论 → 删除或移入 sandbox/{id}/",
      detail: "sandbox/ 在 .gitignore 中。探针脚本只用于快速验证假设，结论必须上浮到 workspace 或 knowledge 文档。",
      tags: ["临时", ".gitignore", "结论上浮"], status: "stable", updatedAt: "2026-05-09" },

    // ── archive ──
    { id: "archive-policy", topicId: "archive-rules", title: "归档策略", oneLiner: "archive/INDEX.md 索引 + 只读",
      detail: "完结的 workstream 移入 archive/，通过 INDEX.md 检索。归档材料不进入活跃上下文，需要时按需加载。",
      tags: ["只读", "INDEX", "历史"], status: "stable", updatedAt: "2026-05-09" },

    // ── Station 三栏 ──
    { id: "sidebar-nav", topicId: "station-layout", title: "左栏 · 需求导航", oneLiner: "搜索 + 版本筛选 + 卡片列表",
      detail: "支持按版本过滤、关键词搜索。workstream 卡片显示名称、版本、scope 通过率。可 pin 常用需求。",
      tags: ["导航", "搜索", "Pin"], status: "stable", updatedAt: "2026-05-09" },
    { id: "detail-panel", topicId: "station-layout", title: "中栏 · 详情面板", oneLiner: "五维 Tab 视图切换",
      detail: "大盘视图（指标卡片）、自动化卡点（lifecycle Mermaid）、ATP 任务（绑定/快照）、用例盘点（CSV 表格）、阶段说明（Markdown 笔记）。",
      tags: ["Tab", "视图", "详情"], status: "stable", updatedAt: "2026-05-09" },
    { id: "report-panel", topicId: "station-layout", title: "右栏 · 报告面板", oneLiner: "需求总结 / 通过率报告 / 工具汇总",
      detail: "三种 collection 模式切换。通过率报告支持一键生成、历史归档、复制到飞书。",
      tags: ["报告", "Collection", "导出"], status: "stable", updatedAt: "2026-05-09" },

    // ── Station 五维 ──
    { id: "tab-overview", topicId: "station-tabs", title: "大盘视图", oneLiner: "scope 通过率 + 指标卡片",
      detail: "显示 scope 用例数、通过率趋势、失败用例列表。是快速判断需求健康度的入口。",
      tags: ["指标", "通过率", "健康度"], status: "stable", updatedAt: "2026-05-09" },
    { id: "tab-lifecycle", topicId: "station-tabs", title: "自动化卡点", oneLiner: "Mermaid 时序图 + 卡点编辑器",
      detail: "可视化展示需求的主线流程。支持内嵌 Mermaid 编辑器，修改后写入 meta.json。",
      tags: ["Mermaid", "卡点", "编辑"], status: "stable", updatedAt: "2026-05-09" },
    { id: "tab-atp", topicId: "station-tabs", title: "ATP 任务", oneLiner: "Task 绑定 + 执行快照",
      detail: "绑定 product_id + task_ids + root_case_id → 一键拉取最新执行数据。支持 scope case 过滤。",
      tags: ["ATP", "绑定", "Task"], status: "stable", updatedAt: "2026-05-09" },

    // ── ATP 快照 ──
    { id: "atp-snapshot", topicId: "station-atp", title: "快照级联", oneLiner: "单需求刷新 / 全量刷新",
      detail: "刷新流程：调用 ATP API → 拉取 task exec → 计算 scope 通过率 → 写入 board_state.json → 触发前端 re-render。",
      tags: ["刷新", "级联", "实时"], status: "stable", updatedAt: "2026-05-09" },

    // ── Lifecycle phases ──
    { id: "create-flow", topicId: "phase-create", title: "需求收编", oneLiner: "从飞书表格或手动创建 workstream",
      detail: "工作站提供「新增需求」入口。创建时指定版本 → 自动生成目录 + meta.json 骨架。也支持从飞书链接直接导入 CSV。",
      tags: ["创建", "导入", "骨架"], status: "stable", updatedAt: "2026-05-09" },
    { id: "settle-flow", topicId: "phase-settle", title: "结构化沉淀", oneLiner: "填充用例数据 + 卡点分析",
      detail: "导入 CSV 后通过「用例盘点」Tab 查看/编辑。自动化卡点 Tab 支持粘贴 Mermaid 时序图。阶段说明 Tab 记录人工笔记。",
      tags: ["CSV", "Mermaid", "笔记"], status: "stable", updatedAt: "2026-05-09" },
    { id: "snapshot-flow", topicId: "phase-snapshot", title: "ATP 快照拉取", oneLiner: "绑定 Task → 拉取执行数据",
      detail: "在 ATP Tab 配置 product_id + task_ids → 点击刷新 → 自动拉取执行摘要。scope case 标记为关注用例。",
      tags: ["绑定", "拉取", "scope"], status: "stable", updatedAt: "2026-05-09" },
    { id: "review-flow", topicId: "phase-review", title: "评审分析", oneLiner: "scope 通过率 + 失败定位",
      detail: "大盘视图汇总通过率。失败用例可展开查看详情。支持从报告面板一键生成评审报告。",
      tags: ["通过率", "失败", "报告"], status: "stable", updatedAt: "2026-05-09" },
    { id: "report-flow", topicId: "phase-report", title: "报告生成", oneLiner: "结构化日报/周报 → 飞书通知",
      detail: "报告包含：需求概览、scope 通过率、失败用例 Top N、与上次对比 diff。支持复制到剪贴板发飞书。",
      tags: ["日报", "飞书", "Diff"], status: "stable", updatedAt: "2026-05-09" },

    // ── Roadmap items ──
    { id: "p0-meta", topicId: "p0-rules", title: "meta.json 强制合同", oneLiner: "无 meta.json 的 workstream 不进入工作站",
      detail: "8 个必填字段缺一不可。工作站启动时校验，缺失字段给出明确修复提示。",
      tags: ["强制", "校验", "P0"], status: "done", updatedAt: "2026-05-09" },
    { id: "p0-doc-limit", topicId: "p0-rules", title: "文档上限 5 份", oneLiner: "工作目录最多 5 份人读文档",
      detail: "过期文档移入「过程材料/」子目录。保持工作目录清爽，降低上下文噪声。",
      tags: ["清爽", "5份", "P0"], status: "done", updatedAt: "2026-05-09" },
    { id: "p0-sandbox", topicId: "p0-rules", title: "sandbox 隔离", oneLiner: "探针脚本不进入 git",
      detail: ".gitignore 包含 sandbox/。结论提取到正式文档后删除探针。",
      tags: ["隔离", ".gitignore", "P0"], status: "done", updatedAt: "2026-05-09" },
    { id: "p1-station-only", topicId: "p1-entry", title: "工作站统一入口", oneLiner: "所有需求操作通过工作站完成",
      detail: "创建、编辑、ATP 绑定、报告生成 — 全部通过工作站 UI 或 API 完成，减少直接操作文件系统。",
      tags: ["统一", "UI", "P1"], status: "in-progress", updatedAt: "2026-05-09" },
    { id: "p1-auto-import", topicId: "p1-entry", title: "自动导入飞书", oneLiner: "飞书表格变更自动同步到 CSV",
      detail: "监听飞书 webhook → 触发 CSV 刷新 → 更新 meta.json → 通知工作站。目标是去掉手动导入步骤。",
      tags: ["自动", "Webhook", "P1"], status: "planned", updatedAt: "2026-05-09" },
    { id: "p2-history", topicId: "p2-migration", title: "存量规范化", oneLiner: "旧 workstream 逐步补齐 meta.json",
      detail: "archive/ 中的历史 workstream 按需迁移。优先迁移仍有参考价值的项目。",
      tags: ["迁移", "历史", "P2"], status: "planned", updatedAt: "2026-05-09" },

    // ── 运营商通用 实战案例 ──
    { id: "case-operator", topicId: "phase-review", title: "运营商通用功能 · 实战", oneLiner: "66 条用例 → 46 条自动化 → 审核交互页",
      detail: "完整走通了 Phase 0-3 流程：分析 66 条手工用例 → 梳理 8 个类别 → 对齐 14 条待确认问题 → 批量创建 46 条平台用例 → ID 回填飞书 → 生成交互审核页。\n\n最终产物：review.html 全量分析交互文档，已集成到工作站。",
      tags: ["实战", "46条", "review.html"], status: "stable", updatedAt: "2026-05-09" },

    // ── 演进洞见 ──
    { id: "insight-phase0", topicId: "p0-rules", title: "门禁制投入产出比最高", oneLiner: "Phase 0 阻断是整个项目最有价值的设计",
      detail: "直接来源于 dot1x 项目 66 条用例返工的教训：不做状态矩阵分析就批量创建，错误会被 N 倍放大。此后所有项目都执行 Phase 0，再未出现批量返工。",
      tags: ["门禁", "ROI", "复盘"], status: "stable", updatedAt: "2026-05-27" },
    { id: "insight-skill-evolution", topicId: "skills-layer", title: "Skill 演化论", oneLiner: "从功能模块到工程规范层的认知跃迁",
      detail: "Skill 不再承载原子能力、workflow、API SDK。核心职责变为：定义 Agent 如何思考、任务如何推进、何时阻断、结果如何沉淀。早期塞一起短期能跑，但规模一大就 Skill 变胖、能力无法复用、流程能力耦合。",
      tags: ["演化", "Agent", "规范"], status: "stable", updatedAt: "2026-05-27" },
    { id: "insight-subtraction", topicId: "p0-rules", title: "做减法阶段", oneLiner: "项目过了加法期，进入加固收口期",
      detail: "不再做的事：自动化 Phase 0 分析、扩展 agent_service、skills 发现推荐系统、知识库双向同步、单元测试框架、拆 platform_client。\n\n继续打磨：debugger bug 修复、审计规则自动生成、配置源收敛、sys.path 治理。",
      tags: ["减法", "加固", "边界"], status: "stable", updatedAt: "2026-05-27" },
    { id: "insight-god-class", topicId: "skills-layer", title: "上帝类不拆论", oneLiner: "工具项目中内聚的大类优于过度抽象",
      detail: "platform_client 500 行，所有调用者只需 from platform_client import PlatformClient。拆分带来的 import 复杂度和维护成本远大于收益。对于工具性项目，内部方法职责清晰即可。",
      tags: ["内聚", "务实", "反模式"], status: "stable", updatedAt: "2026-05-27" },
    { id: "insight-patterns", topicId: "services-layer", title: "可复用模式清单", oneLiner: "门禁制 / 统一契约 / 知识版本化 / 错误码驱动 / 探针即弃",
      detail: "1. 门禁制：批量前人工阻断，审计当 CI lint\n2. 统一契约：ServiceResult ok/fail，不 throw\n3. 知识版本化：平台数据→本地 JSON→git diff\n4. 错误码驱动修复路径\n5. 探针即弃：结论上浮后删除实验",
      tags: ["模式", "复用", "飞轮"], status: "stable", updatedAt: "2026-05-27" },
  ]
};
