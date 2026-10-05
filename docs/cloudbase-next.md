# CloudBase 接入进度

环境：`writter-dev-d0g7h1prq4ce60665`，上海。网站已上线、云函数已部署、PostgreSQL 持久化与热点源均已验证，见 [部署与验收](cloudbase-deploy.md)。

v0.2 已完成登录 / 项目保存 / 热点函数的代码、构建与云端部署。剩余仅需使用者在控制台为 `administrator` 设置密码后，按部署文档「正式验收」一节在正式网站上逐项验收（登录、刷新热点、手动选题、保存草稿/人工复查/预览、纯复制页、刷新持久化、跨会话读取、版本冲突、策划改动失效下游、未登录拒绝）。

下一批：真实 AI、检索、Evidence Pack、异步操作、图片存储及 V25 Renderer。异步操作须包含 id、inputRevision、status、startedAt、error，由真实后台触发继续执行；不得仅修改 stage 后声称任务已启动。
