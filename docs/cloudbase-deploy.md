# Writter v0.2 CloudBase 部署与验收

已固定环境：`writter-dev-d0g7h1prq4ce60665`，地域：上海 `ap-shanghai`。

## 当前线上状态（2026-10-06）

- 网站：<https://writter-dev-d0g7h1prq4ce60665-1428502724.tcloudbaseapp.com/>
- 云函数 `writter-api`：Event 型，Nodejs18.15，超时 30s，环境变量 `WRITTER_ALLOWED_UIDS=2107134978465726464`。
- 数据：本环境无文档数据库（flexdb），持久化落在 **PostgreSQL**（实例 `postgres-k8lowqlc`，schema `public`，表 `projects`），云函数经 `app.rdb()`（PostgREST）读写，采用 `id/owner_id/revision` 条件更新的乐观锁。
- 热点源：上海云函数可访问 `raw.githubusercontent.com`（生产路径 `feed('24h')` 实测返回 462 条真实数据，AIHOT 独立源如实标记 pending）。GitHub raw 偶有瞬时抖动，失败时页面保留手动入口，不视为该源永久可用。
- 账号：`administrator`（UID `2107134978465726464`，内置超级管理员）已存在。密码仅在控制台「身份认证 → 用户管理 → administrator → 设置/重置密码」由使用者本人设置，并在正式登录页输入，不进入聊天或仓库。

## 1. 数据库

本环境没有文档数据库，持久化使用 PostgreSQL。表 `projects` 由 `src/pg-repo.js` 使用，列为 `id`(主键)、`owner_id`、`revision`、`stage`、`title`、`updated_at`、`data`(jsonb)、`schema_version`。云函数凭 client_credentials 令牌经 `/v1/rdb/rest` 网关访问，映射到 PostgREST `anon` 角色，故需对 `public.projects` 授予 `anon` 的 SELECT/INSERT/UPDATE/DELETE；该角色只能由持有服务端令牌的云函数到达，未带令牌的网关请求返回 401。网页不直接访问数据库，全部经云函数并二次校验 ownerId。

数据库无需提前导入空项目。`settings` 尚未接入配置界面，暂不建表。

## 2. 身份认证

在身份认证 / 登录方式中启用用户名密码登录，在用户管理中创建自己的用户。记录用户名、密码和用户 UID。账号密码只在正式登录页输入，不发到聊天或提交仓库。

当前是个人工作台，云函数使用 `WRITTER_ALLOWED_UIDS` 限定能够使用的账号。先填写自己用户的 UID；后续邀请用户时可用逗号分隔多个 UID。匿名用户一律拒绝。

## 3. 云函数

创建名为 **writter-api** 的普通事件型 Node.js 云函数，代码包入口 **index.main**，Node.js 18 或更新运行时，超时 30 秒。不是 Web/HTTP 函数：当前入口依赖 SDK 调用注入的用户身份和环境服务权限，不需要自行上传管理密钥。

上传 `writter-api-function.zip`，其根目录含 `index.js`、`package.json`。使用「云端安装依赖」安装锁定的 `@cloudbase/node-sdk`。如果入口目录嵌套了一层文件夹，请调整为 ZIP 根目录文件。

环境变量：

| 名称 | 内容 |
| --- | --- |
| WRITTER_ALLOWED_UIDS | 身份认证用户管理里自己的 UID |

配置事件函数调用权限为允许已登录用户调用；若控制台没有该选项，保持 SDK 标准调用通道，应用代码仍拒绝无身份或不在名单的请求。不要为此函数开启额外的无鉴权 HTTP 入口。

控制台直接「测试」没有网页用户上下文，返回 `UNAUTHENTICATED` 是预期结果，不能据此判断部署失败。

## 4. 网站

开通该环境的静态网站托管。解压 `writter-hosting.zip`，将 **里面的文件和 vendor 文件夹** 上传到网站根目录，确保根目录是 `index.html`，不是 hosting/index.html。默认索引设置 `index.html`。

在环境安全配置 / Web 安全域名中加入实际网站域名（按控制台格式输入域名，不含路由）。默认测试域名只用于此轮开发验收。没有必要改代码或添加 HTTP Gateway：网页通过官方 SDK 调用 writter-api。

## 5. 正式验收

1. 打开网站，用刚创建的用户名密码登录。若出现 UID 未授权提示，检查函数变量和发布版本，重新连接。
2. 点击刷新热点。确认显示真实标题、来源与更新时间。国内云端访问 GitHub raw 是否成功仍需此步确认；失败时页面保留手动 URL 入口，不能视为该数据源已可用。
3. 新建一条手动选题；填写来源、核验摘录、角度与结构，确认进入 Studio。
4. 写测试正文，人工复查后生成预览，再打开纯复制页，确认没有工作台 UI。
5. 刷新网站或在另一浏览器登录同一账号，确认该选题仍在。
6. 同时打开两个页面，先在 A 保存，再在 B 保存旧版本，确认 B 显示版本冲突，未覆盖 A。B 的输入应保留，可复制后刷新重新读取。
7. 修改策划并保存，确认旧预览被标记过期、复制入口不可用。

这些完成以后才可宣称云端接入验收通过。当前自动测试覆盖权限 / 去重 / 状态 / 冲突，并不替代真实云端验证。

## 构建来源

仓库根目录运行 `npm ci`、`npm test`、`npm run build`。输出 `dist/hosting` 与 `dist/writter-api`。GitHub Actions 同样生成下载工件 `writter-cloudbase-package`，无需在本地安装运行环境也可获取。

当前本地开发 `npm start` 仍使用浏览器存储，部署文件中的 config.js 已自动设置为 cloud；两者显示清楚，不自动把本地数据上传给云端账号。

## 尚未完成

真实 AI 与检索、生图、V25 精确模板、异步任务执行仍未接入。这一批完成的是云端保存及热点函数代码。模型凭据后续只放云端环境变量，AI 任务将包含输入版本和操作标识，避免旧结果覆盖新内容。
