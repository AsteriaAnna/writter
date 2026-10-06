# 上游资讯接入与选题展示说明

研究日期：2026-10-06。接续入口：[development-guide.md](development-guide.md)。本轮完成公开文档、源码和真实响应核对，未改功能代码、合并 PR、部署或调用写作模型。以下页面与数据契约是实施建议，不是已有功能。

## 1. 结论与现状差距

AIHOT 的身份已确认：[网站](https://aihot.news)、[官方仓库 KKKKhazix/AIHOT](https://github.com/KKKKhazix/AIHOT)、[线上 OpenAPI](https://aihot.news/openapi-v1.json)。其公开 JSON 能提供资讯摘要、热点排行、多来源报道、原文跳转和事件脉络，适合作为主要选题入口。当前 Writter 尚未接入。

[AI News Aggregator](https://github.com/SuYxh/ai-news-aggregator) 已被 Writter 使用，适合作为更广泛的补充列表。实际导出的条目没有摘要、正文、热度、点赞或评论字段。现有界面缺少信息，一部分原因是数据入口本身没有这些字段，换页面布局不能补齐。

用户决定值得写什么。上游排行可以展示并注明来源，不新增 Writter 的“值得写”评分，不因 AI 判断隐藏资讯。上游摘要是阅读提示，不是已经核验的原文证据；选定后仍需读取原始资料。

## 2. 实测范围

| 请求 | 本轮观察 | 边界 |
| --- | --- | --- |
| `https://aihot.news/api/v1/items?limit=2&window=24h&mode=selected` | HTTP 200、JSON，含 items、query、page、schemaVersion | 只抽样 2 条，未穷举分页 |
| `https://aihot.news/api/v1/hot-topics` | HTTP 200、JSON，返回 10 个热点 | 是上游当前排名，不是阅读量 |
| `/api/v1/stories/553aab31-30b1-4787-bd62-3b006d83295e` | HTTP 200，含 digest、reports、storyline、related；13 篇报道、11 个来源 | 单个事件抽样；内容事实未独立核验 |
| `https://aihot.news/openapi-v1.json` | HTTP 200，文档版本 2.0.0 | 接口路径仍为 /api/v1，响应 schemaVersion 为 1，三者不要混淆 |
| Aggregator `data/latest-24h.json` 与 `data/source-status.json` | 已读取真实快照并统计 | 快照生成时间为 2026-10-06T10:53:12.102Z，不代表所有文章发布时间 |
| Aggregator `data/latest-7d.json` | 本轮下载超时，未验证完整响应 | 不能据此断言上游故障或数据为空 |

AIHOT 列表与热点响应观察到 CORS `*`、ETag、60 秒缓存指令。读取成功是本研究运行环境的结果，不代表上海云函数与浏览器链路已验收；此次未操作云端。先前网页读取工具拒绝访问，与随后实际 HTTP 200 并存，不应混写成站点不可达。

## 3. AIHOT 接口契约

使用稳定公开 `/api/v1`，不要调用内部 `/api/site/*` 或旧 `/api/public/*`。官方仓库是框架快照，不包含完整运营来源与生产数据；不需要先自行部署其全套系统。

| 接口 | 用途 | 首版处理 |
| --- | --- | --- |
| `GET /api/v1/hot-topics` | 当前 Top 10 事件 | 保留上游 rank 与统计口径，选题首页热点区 |
| `GET /api/v1/items` | 资讯列表 | window=24h/7d，mode=selected/all；上游精选与全部可以切换 |
| `GET /api/v1/stories/{publicId}` | 事件摘要、报道、时间线 | 打开详情后按需读取，不预取全部正文 |
| `/feed.xml`、`/feed/all.xml` | RSS 入口 | JSON 已足够，首版无需另建 RSS 采集 |

items 支持 limit 1–100（默认 50）、不透明 cursor、category、q（2–200 字符）、by=timeline/published。默认 mode=selected、window=7d、by=timeline；请求要显式指定，避免误以为默认就是全部或 24 小时。下一页使用服务端返回的游标，不能自行构造；空页和结束页正常处理。尊重 ETag/304、缓存 TTL 和 429/503 的 Retry-After，不高频轮询。首版不需要 snapshot/changes 全量镜像。

| 上游字段 | 语义与空值 | 页面映射 |
| --- | --- | --- |
| items.id | 资讯 ID，不等于事件 publicId | provider + externalId 作为身份 |
| title / originalTitle | 标题；原文标题可空 | 主标题，原文标题可展开 |
| summary | 可空的上游摘要 | 明确标注“上游摘要”；缺失不伪造 |
| source.name | 来源名称 | 卡片与报道旁保留 |
| links.aihot / links.original | 聚合详情 / 原始链接 | 分开显示“AIHOT 详情”“来源链接” |
| publishedAt / discoveredAt | 来源时间 / 收录时间；前者可空 | 时间分开存储、分开标注 |
| score / selected / reason | 上游编辑评分、精选状态与理由 | 不把 score 当热度、事实可信度或用户写作价值；主卡片无需展示评分 |
| attribution | 上游署名信息 | 保留名称及链接 |
| hot.rank | AIHOT 热点排名 | 标注“AIHOT 热榜第 N” |
| sourceCount / signalCount / participantCount | 不同上游统计；participantCount 可缺失 | 优先展示来源数，其他指标注明上游口径；不能改名为阅读/点赞数 |
| sourceNames | 展示用来源列表，可能截断 | 不用数组长度代替 sourceCount |
| links.story | 事件页面地址，可缺失 | 可提取有效 publicId 请求事件 API；无链接时退回单条资讯详情 |
| latestAt | 最近关联更新 | 展示“事件更新”，不是最初发布时间 |

真实热点响应中 links.story 仍出现旧域名 aihot.virxact.com。事件 API 使用 aihot.news；保留原返回链接与出处，不对所有来源 URL 盲目替换域名。事件报道的 links.original 可缺失，来源链接缺失时保留 AIHOT 页面。story 的 sourceCount/reportCount 与热点统计可能使用不同公开范围，不能直接要求相等；报道时间也可能是收录时间回退值，不能全部宣称原文发布时间。

## 4. Aggregator 的真实覆盖与限制

入口：[24h JSON](https://raw.githubusercontent.com/SuYxh/ai-news-aggregator/main/data/latest-24h.json)、[7d JSON](https://raw.githubusercontent.com/SuYxh/ai-news-aggregator/main/data/latest-7d.json)、[来源状态](https://raw.githubusercontent.com/SuYxh/ai-news-aggregator/main/data/source-status.json)。Writter 已有 raw GitHub 与 jsDelivr 备用入口。

本次 24h 快照 657 条；183 条 published_at 为空，208 条 title_zh 为空；顶层标注 14 个站点、123 个来源，但窗口内只有 10 个站点有条目。抓取状态报告 13 站成功、aihubtoday 失败，bestblogs 与 aihot 抓取为零；RSS 70 路、69 成功、1 失败。抓取成功、抓取原始数、AI 过滤后窗口条目数是不同指标。README 的覆盖声明不能当作当前每路均可用的证明。

特别注意：这个聚合器中的 aihot 当前为零，不能据此认定已经覆盖 AIHOT。本次未证明零条目的根因。

| 字段 | 建议保留与展示 |
| --- | --- |
| id / site_id / site_name / source | 区分聚合平台与发布来源，保留 provider 身份 |
| title / title_zh / title_original / title_en | 优先现有中文标题，缺失回退原文；不要给用户虚构译文 |
| url | 可能为文章、讨论、其他聚合跳转；先称“来源链接”，核实后才称“原文” |
| published_at | 可空；部分抓取器会以刷新时间回退，不是普遍可靠的原文发布时间 |
| first_seen_at / last_seen_at | 首次与最近收录；不等于发表时间 |
| generated_at | 整个快照生成时间，显示列表更新时间 |
| summary / 正文 / 热度 | 本次导出条目不存在；类型或别处有元数据，不代表当前 JSON 输出带了这些字段 |

观察到 url 包含原始新闻、微信公众号、Hacker News、X、Google News 等。保留链接角色 `article|discussion|aggregator|unknown`，未经核对保持 unknown；不要自动把讨论页当新闻原文。源码 `src/fetchers/newsnow.ts` 存在 publishedAt 回退 updated 的逻辑，因此非空也只宜称“来源标注时间”。

Writter 当前 `src/domain.js` 的 normalizeFeed 将 url 统一叫 originalUrl，并把 published_at 或 first_seen_at 填入同一个 publishedAt，丢失来源平台与时间含义；summary 在该上游实际缺失时为空。下一轮应改数据契约与标签，不能只补空摘要的 CSS。

## 5. 推荐页面与最小数据契约

“发现选题”内提供“当前热点”和“更多资讯”两个视图：前者使用 AIHOT 事件，后者使用 AIHOT 列表与 Aggregator 补充。显示来源与上游范围，支持时间范围、来源筛选、搜索；搜索只作用于实际可搜索的数据，不能伪装全网搜索。上游精选是一种可切换范围，不是 Writter 替用户判断。

卡片：标题、短摘要（有才显示）、来源、明确含义的时间、热点排名/来源数（有才显示）、来源跳转、选题动作。不要为补充资讯显示假的热度 0，不把缺失摘要写成空占位长卡，不要求每张卡先等模型分析。多选默认创建独立文章任务。

事件详情：事件摘要 → 原始/关联资料清单 → 事件脉络 → “以此选题进入写作”。清单区分上游摘要、报道与讨论，直接打开来源；完整正文只在用户选定后按需获取。打不开的来源可由用户粘贴资料，明确读取状态。不要把上游摘要直接扩写成“个人文章”。下一阶段另行决定文章类型、骨架及要点。

建议统一数据至少保留：provider、externalId、kind（item/topic）、topicId 可空、title、originalTitle 可空、summary 可空及其来源、sourceName、platformName、sourceUrl、sourceUrlRole、providerUrl、publishedAt 可空、discoveredAt 可空、updatedAt 可空、timeBasis、rank 可空、各计数可空、attribution、fetchedAt。事件报道按独立列表保存。

不同 provider 的 ID 不可直接合并；首版不做自建 AI 聚类。可后续用明确相同的来源 URL 去除重复展示，不能只凭标题相似吞并资料。原文与摘要的安全转义、URL 校验和来源读取网络约束沿用现有保护。

## 6. 服务使用范围与尚未验证项

[AIHOT 线上条款](https://aihot.news/terms)（本轮读取版本 1.1，2026-09-30 生效）区分个人非商业/内部使用与对外商业服务、第三方代理、公开镜像及批量再分发。匿名可读取、代码 MIT，不代表托管服务数据可任意公开再分发。当前可以继续个人工具研究；正式对外提供聚合数据前，需核对具体用途是否符合条款或取得所需授权。保留 attribution、更新与更正；不要默认把全量摘要打包向外部 AI 转发，先支持原文链接及用户自己的写作要求。

未验证：上海函数访问这些入口、真实浏览器的分页/加载/错误体验、全文可读率、7d 完整快照、长期服务稳定性、任何模型生成质量。成功解析 JSON 不等于这些通过。

## 7. 下一项具体工作

先讨论并制作“热点卡片 → 事件详情 → 选定”的小范围原型，使用已核对字段和缺失情况，重点判断是否足够帮助用户选题。随后落实 provider 适配、缓存与时间/链接契约，再验证真实浏览器和上海读取。无需用户现在提供密码、密钥或操作云控制台。

骨架样本研究随后独立进行。用户可选提供 2–3 篇自己满意或接近目标的公众号文章及一句喜欢的原因；这有助于区分结构与个人风格，但不是本轮上游研究的前置条件。

## 8. 核对来源

- AIHOT：上述线上 OpenAPI、公开响应与条款；源码 `apps/api/src/routes/v1.ts`、`routes/site.ts`、`packages/backend/src/publication/stories.ts`。
- Aggregator：上述真实 JSON 与状态；源码 `src/types.ts`、`src/index.ts`、`src/fetchers/newsnow.ts`，核对导出字段与时间回退。
- Writter：`src/feed.js`、`src/domain.js`。代码现状与本文件建议明确区分。
