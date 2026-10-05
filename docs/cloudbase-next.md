# 第二批接入边界与操作清单

## 用户当前可以完成的操作

1. 为本项目建立独立 CloudBase 环境，例如 `writter-dev`，不要复用星账环境。
2. 记录环境 ID 与地域，提供给开发者。环境 ID 不是密钥；不要在聊天或仓库提交 API Key、SecretId 或 SecretKey。
3. 等云端代码和权限规则就绪后，再配置登录、数据库、存储和部署。当前本地 Node 服务不能直接当作 CloudBase 云函数入口上传。

## 云端数据契约

业务集合保留 `projects` 和 `settings`，图片使用存储。项目新增 `_id`、`ownerId`、`schemaVersion: 1`、`revision`；浏览器对象的 `id` 经 Repository Adapter 映射 `_id`。文档规则必须限定当前已登录所有者，所有云函数同样验证身份。模型密钥使用云端环境变量，不能放客户端 settings。

热点池不入库，仅保存已选候选的快照。供应商 + externalId 用于同一用户选题去重，云端用确定性文档 ID 或事务防止并发重复。本地 v0.1 数据不是已经同步的云数据库。

## 下一批必须实现的基础设施

- ProjectRepository：load/list/save，服务端校验请求与 revision，写入冲突明确提示。
- CloudBase HTTP 入口：把热点代理拆成云端处理函数，限制固定上游地址，超时、缓存、错误提示。
- 异步 AI 操作可以先嵌入单个项目：operation 包含 id、type、status、inputRevision、startedAt、heartbeatAt、error。不是只修改 stage 就算后台已执行。
- 工作器由已验证的云端异步触发能力启动；页面离开不取消任务。仅当当前 operation.id 与输入 revision 仍匹配，才允许写回结果；超时可重试。重复点击和旧请求不得覆盖新内容。
- 阶段转换由服务端校验先决条件。多供应商核验和写作不能仅靠客户端按钮修改状态。
- Plan / Draft / Evidence 变动分别递增版本；产物保存输入版本，版本不同显示过期。已过期预览不提供复制。
- Evidence Pack 保存每项事实、对应 URL、摘录、抓取时间；观点与事实分开。修改角度不重新搜索，需补事实时显式更新证据。
- 正文只使用证据包和已确认计划。自动事实审计结果必须区分支持、冲突、无证据、分析判断，不能生成虚假可信度。
- 图片与 HTML Visual 使用有类型结构；AI 不生成可执行最终 HTML。V25 Renderer 控制模板并转义输入。

## 需要后续提供的内容

环境 ID / 地域；真实 V25 参考 HTML；模型服务选型（密钥仅在 CloudBase 环境变量配置）；联网检索服务选型。以上未定不影响当前骨架代码。
