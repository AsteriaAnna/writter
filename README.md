# Writter

面向公众号写作的三级编辑工作台。当前为 **v0.1 第一批：可运行骨架**，不是已完成的 AI 写作产品。

## 启动

Node.js 22 或更新版本，无需安装依赖。

```sh
npm start
```

打开 http://localhost:3000 。验证：`npm test` 与 `npm run check`。

## 当前可用

- 热点池：通过 `/api/feed` 读取 AI News Aggregator 的真实 JSON，24h / 7d 切换、搜索、勾选、拖入待处理；来源出错明确展示。
- 手动 URL / 选题输入；同一供应商同一外部 ID 不重复建项目。
- 编辑策划：填写来源、事实摘录、角度和结构，人工确认后进入写作。
- Studio：手动正文编辑、人工事实复查、基础确定性 HTML 排版和纯复制页。
- 项目保存在当前浏览器，刷新后恢复；计划和正文最近三版历史；上游修改标记下游过期，过期输出不可复制。
- 响应式页面、文本与链接安全处理。

## 尚未接入

AIHOT 独立 API（上一轮引用的 API 文档地址当前 404）、CloudBase 登录与持久化、TEXT_MODEL、WEB_SEARCH、IMAGE_MODEL、图片存储、自动事实检查、精确 V25 Renderer。当前无虚构热点、模拟核验结果或假 AI 按钮。页面里的人工确认不代表机器已核验。

当前基础排版只支持空行段落和 `##` 二级标题，其他 Markdown 按文本显示。V25 样式需以用户确认的真实参考 HTML 为准。复制公众号的最终兼容性须在接入该样式后实测。

## 工程边界

`public/` 是静态界面，`src/domain.js` 是可独立测试的状态与排版逻辑，`server.mjs` 是开发服务与热点代理，`docs/` 保存数据契约与后续接入说明。当前本地服务无认证，仅适合开发使用，不应直接作为公开生产 API 部署。云端阶段须启用登录和文档所有者权限。

核验过的上游格式：`SuYxh/ai-news-aggregator/data/latest-24h.json` 中的 `items[].id/title/title_zh/url/source/site_name/published_at`。聚合结果仅作为发现线索。

## 验证记录

六项领域 / HTTP 测试与 JavaScript 语法检查通过，真实上游已成功读取 462 条资讯。当前环境未安装 Chromium，浏览器端到端测试尚未完成；不能把语法检查视为 UI 验收。生产环境仍需验证上游网络访问与部署权限。

下一步见 [CloudBase 接入清单](docs/cloudbase-next.md)。
