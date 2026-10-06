# Writter · AI 编辑工作台

v0.3 主流程改造：选择热点 → 来源检测与策划 → 调整 → 确认 → 正文生成 → 来源一致性复查 → 排版 → 预览。

开发与验收说明以 [docs/workflow-v0.3.md](docs/workflow-v0.3.md) 为准；部署基线记录见 [docs/cloudbase-deploy.md](docs/cloudbase-deploy.md)。

## 开发

```sh
npm ci
npm test
npm run check
npm run build
```

`npm run dev` 提供本地静态工作台（浏览器存储），不调用真实 AI。云端模式由构建生成，保留现有 CloudBase 登录和 PostgreSQL 数据保存。配置 `WRITTER_AI_KEY` 后接入 DeepSeek；默认 `deepseek-flash`。

## 本轮状态

代码和自动检查已完成；尚未在 CloudBase 部署，未配置实际模型密钥，未验收真实 AI 输出。来源检测限原链接及补充链接，尚无全网检索。当前排版为基础编辑模板，精确 V25 和实际生图尚未完成。

不将模型生成的说明等同于事实核验，不将配图建议等同于图片生成，不将模拟测试等同于线上验收。
