# Writter

面向公众号写作的三级编辑工作台：**热点池 → 编辑策划 → 写作与预览 → 纯复制页**。

当前 **v0.2：CloudBase 接入代码已准备，待控制台部署与真实环境验收**。AI 写作、联网核验、生图与精确 V25 排版尚未接入，不把人工流程包装成 AI 结果。

## 开发与构建

Node.js 22 或更新版本：

```sh
npm ci
npm start
```

打开 http://localhost:3000 。本地模式在当前浏览器保存。

```sh
npm run check
npm test
npm run build
```

构建输出：`dist/hosting`（网站，已设置 cloud 模式）与 `dist/writter-api`（事件云函数，入口 index.main）。[部署步骤](docs/cloudbase-deploy.md)。GitHub Actions 自动检查并提供部署工件。

## 已实现

- 热点代理读取 AI News Aggregator 实际 JSON，24h / 7d、搜索、勾选、拖入、手动 URL。独立 AIHOT API 尚待验证，不编造接口。
- 来源、事实摘录、角度、结构与正文人工编辑；人工审核明确标注。
- 最近三版策划 / 正文恢复；修改上游会使下游过期，旧预览不可复制。
- 确定性基础排版、纯复制页；HTML 与来源链接安全处理。
- 官方 SDK 用户名密码登录、退出与会话恢复，SDK 云函数调用。
- 云端项目按真实用户身份隔离，账号白名单；同一来源选题去重；分页加载，列表仅取摘要，打开选题才取完整正文与历史。
- 数据库事务和 revision 防止多页面或多设备旧版本覆盖新修改。保存失败保留当前表单输入，不宣称已保存。
- 客户端不提交整份数据库文档、状态或最终 HTML；由服务端验证动作、推进阶段并生成预览。

## 环境和权限

环境：`writter-dev-d0g7h1prq4ce60665`，上海 `ap-shanghai`。集合 `projects` / `settings`。业务权限在云函数内检查；数据库客户端读写关闭。网页不使用管理员密钥。个人账号 UID 放函数环境变量 `WRITTER_ALLOWED_UIDS`。

当前对话没有可操作该 CloudBase 环境的连接，**尚未部署**。不要把本地 Node 服务当作云函数入口上传。打包后的事件云函数利用环境默认服务端权限，不开额外 HTTP 入口。

## 代码组织

- `public/`：三级界面、登录、SDK 适配、配置。
- `src/domain.js`：阶段动作、历史、过期标志与排版。
- `src/cloud-api.js`：身份、输入校验、去重、事务与冲突控制。
- `src/feed.js`：固定上游代理和五分钟缓存。
- `cloudfunctions/writter-api/entry.js`：真实 CloudBase SDK 入口。
- `scripts/build.mjs`：打包前端 SDK 和云函数，固定依赖版本。

基础排版只支持空行分段与 `##` 二级标题，其余 Markdown 按文本显示。精确 V25 需真实参考 HTML；公众号最终复制兼容性仍待实测。

## 验证

19 项领域 / HTTP / 云端权限与事务 / DOM 操作模拟测试通过，语法检查与实际 SDK 构建通过。开发环境曾成功读取真实上游 462 条资讯。真实 CloudBase 登录、存储和国内上游访问待部署后验收。Chromium 下载受环境网络影响，未完成真实浏览器视觉验收。
