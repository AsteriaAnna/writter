# Writter 线上验收记录

- **日期**：2026-10-06
- **基线提交**：`4362bed` docs: record deployed AI connectivity and post-deploy secret configuration order
- **环境**：云开发 env `writter-dev-d0g7h1prq4ce60665`（ap-shanghai），云函数 `writter-api`（Nodejs18.15）
- **测试方式**：通过云函数鉴权接口（`/auth/v2/signin/username` + `/v1/functions/writter-api/invoke`）直接走真实主流程；测试项目标题均带「验收测试」前缀，未发布到公众号、未覆盖用户文章。

---

## 结论总览（四类结果分开，不合并）

| 维度 | 结论 | 依据 |
|---|---|---|
| **模型服务连通** | ✅ 通过 | DeepSeek API 从云函数内可连通，`deepseek-v4-pro` 4 次调用（analyze/adjust/draft/audit）全部返回合法结构化 JSON。 |
| **功能真实跑通** | ✅ 通过（附边界） | 9 步主流程端到端跑通；边界：登录依赖可达网关的网络、来源读取仅新华网成功。 |
| **内容质量通过** | ✅ 基本通过（1 处小瑕疵） | 证据/逐字引用/单一来源标注/无泄漏均达标；正文引用链接文本为「来源0」而非「新华网」，属可读性小瑕疵。 |
| **UI 体验通过** | ⚠️ 未测试 | 本次为接口级验收，未做浏览器内全量 UI 走查（前端逐阶段点击、渲染、预览展示）。 |

---

## 1. 登录结果与 Failed to fetch 原因

- **登录结果**：本地成功、远程失败。
- **Failed to fetch 原因**：**根因未完全确定**。现象为浏览器 `fetch` 未能完成请求（通用网络错误，无法区分 DNS / 连接重置 / 区域路由 / CORS 等具体环节）；本地浏览器同账号登录正常，可排除应用侧鉴权逻辑错误，但不进一步断言为「远程网络问题」。
- **处置**：按既定约束，**未**改动任何线上鉴权配置、未绕过鉴权/移除鉴权/公开数据库/把访客绑定管理员。登录鉴权与用户数据隔离原样保留。

---

## 2. 主流程各阶段结果（附依据）

| # | 阶段 | 结果 | 依据 |
|---|---|---|---|
| 1 | 选择热点 | ✅ 通过 | `projects.create` 返回新项目 + revision。 |
| 2 | 检测来源 | ✅ 通过（部分来源受限） | 新华网读取到正文 1574 字符（非仅标题）；feed(aiera.com.cn) 为 SPA 取不到正文；维基百科被 GFW 阻断。 |
| 3 | 策划 | ✅ 通过 | 6 条 claim 全部带 `sourceId` + 原文逐字 `quote`；`angle`/`outline` 完整；单来源已标注。 |
| 4 | 调整 | ✅ 通过 | 标题改为「科技自立自强…」主线，角度注明「基于单一来源的初步梳理」，事实未变、未新增无来源事实。 |
| 5 | 确认 | ✅ 通过 | `projects.mutate approve_plan` 生成 `workflow.approval` 快照（plan+claims+documents+confirmedAt），`evidence.confirmed=true`。 |
| 6 | 生成正文 | ✅ 通过 | 干净 Markdown（无围栏/问候/提示词泄漏），正文内链接 ⊆ 已确认来源。 |
| 7 | 正文复查 | ✅ 通过 | `workflow.audit.issues` 为空（0 blocking/0 warning）。 |
| 8 | 排版 | ✅ 通过 | `render` 输出 HTML 2464 字符，已转义，无原始注入。 |
| 9 | 预览 | ✅ 通过 | `projects.get` 返回 `stage=preview_ready`，`output.html` 就绪。 |

---

## 3. 实际发现的问题、修改位置与影响

**问题（根因）**：AI 策划连续失败（5/5），报「模型输出字段不完整，请重试」。经抓取模型原始输出定位：`deepseek-flash` 与 `deepseek-v4-pro` 都会把 `plan.outline` 输出成**数组**（字符串列表或 `{section,content}` 列表），而 `validatePlan` 只接受字符串，因此被拒。**这不是 DeepSeek 调用方式问题，也不是模型能力问题，而是输出结构校验的 schema 不匹配。**

**修改位置**（`src/ai.js`）：

1. 新增 `outlineText()`（[src/ai.js:4-15](src/ai.js#L4-L15)）：把 `outline` 的字符串 / 数组（字符串列表或对象列表）统一归一化为字符串，再进入长度校验。
2. 模型**默认**为 `deepseek-v4-pro`，保留环境变量 `WRITTER_AI_MODEL` 覆盖。**结构兼容与模型质量分开判断**：`outline` 归一化是与模型无关的结构修复；`deepseek-v4-pro` 作为默认仅是稳定性偏好，**不据此认定 `deepseek-flash` 必须淘汰**——flash 在结构修复后的可靠性尚未单独复验，保留为可切换项。
3. **证据约束过窄（本轮新增修复）**：策划的事实引用（`validatePlan` 的 `doc.text.includes(quote)`）与复查的正文定位（audit 的 `markdown.includes(quote)`）都用精确子串匹配，但抽取后的原文仍含 `&emsp;` 等 HTML 实体、模型又会改写全/半角引号与空白，合法引文会被误判为「无法定位」。新增 `normalizeEvidence()`（解码实体、统一引号、压缩空白）用于这两处匹配；并在 `source-reader.js` 的 `extractText` 补全实体解码。

**关联影响**：仅影响 AI 输出校验、模型选择与证据逐字匹配；未触碰鉴权、数据库 schema、乐观锁、来源读取 SSRF 防护、渲染转义等其它逻辑。32 项单元测试全部通过；用实际文章复验 6/6 条 claim 通过、跨 `&emsp;` 引文可定位。

---

## 4. 修复后的测试与部署

- **单元测试**：`npm test` 32/32 通过（含 outline 归一化、证据逐字匹配容错、审批快照、渲染转义等用例）。
- **语法检查**：`npm run check` 通过。
- **端到端**：以新华网真实来源走完 9 步主流程（见第 2 节）；证据匹配容错另以实际文章复验 6/6 条 claim 通过。
- **部署**：`npm run build` → `tcb fn code update writter-api --dir dist/writter-api`（仅更新代码，未改动环境变量，`WRITTER_AI_KEY` 原样保留）。
- **Git 提交**：`a3ab1df`（outline 归一化 + 默认模型 v4-pro）、`f0ef24a`（证据逐字匹配容错）；均已推送 origin/main。

---

## 5. 测试文章记录（供质量评审）

生成内容已存至 `docs/artifacts/`，均不含敏感信息（来源为公开新闻，生成内容为编辑产物）：

| 文件 | 内容 |
|---|---|
| `docs/artifacts/plan-and-evidence.md` | 策划（标题/角度/大纲）+ 6 条事实清单（含逐字引用）+ 核验警告 + 证据范围 |
| `docs/artifacts/draft.md` | 生成正文（Markdown） |
| `docs/artifacts/audit.md` | 正文复查结果（0 问题） |
| `docs/artifacts/render.html` | 排版后 HTML |

测试项目 ID：`b3243770379d054cb8dba49d8d722da81cd551b782658159f097bb5981c922c8`（标题「验收测试丨新华网流程走查」）。

---

## 6. 内容质量观察项（非功能缺陷）

1. 正文内引用链接文本为「来源0」而非「新华网」，可读性欠佳，建议后续在 prompt 中要求模型用来源名称作为链接文本。
2. 单一来源（新华网）是模型自身已标注的核验警告；正式发布前建议补充第二独立信源。

---

## 7. 剩余项与用户可操作项

**剩余项（本次未解决，非本次修复回归）**：
- feed（aiera.com.cn）为 SPA，正文依赖 JS 渲染，当前 reader 取不到正文。
- 维基百科被 GFW 阻断，属环境污染。
- 远程浏览器登录需在可访问云开发网关的网络下进行（环境问题，非代码）。

**用户需要做的操作（仅列必要项）**：
- 控制台 `WRITTER_AI_MODEL` 现为 `deepseek-flash`。要让代码默认的 `deepseek-v4-pro` 在**下次部署后**真正生效，需在控制台将其改为 `deepseek-v4-pro` 或删除该变量。CLI 无法安全代改：`tcb config update fn` 会按 `cloudbaserc.json` 整体覆盖环境变量，从而清掉 `WRITTER_AI_KEY`。当前已部署函数仍为 v4-pro 硬编码版本、功能正常，本次未重新部署以免回落到 flash。
- 其余无必须操作：测试项目与 `%TEMP%\waccept` 临时文件按你的要求保留作复验样例，未清理。
