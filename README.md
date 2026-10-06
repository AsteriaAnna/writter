# Writter · AI 编辑工作台

v0.3 主流程改造：选择热点 → 来源检测与策划 → 调整 → 确认 → 正文生成 → 来源一致性复查 → 排版 → 预览。

**跨软件或跨对话接续，先读 [开发与接续指南](docs/development-guide.md)。** 其中区分用户已确认方向、代码现状、待合并 PR 与下一项工作。

v0.3 实现说明见 [docs/workflow-v0.3.md](docs/workflow-v0.3.md)，历史验收见 [docs/live-validation.md](docs/live-validation.md)，部署说明见 [docs/cloudbase-deploy.md](docs/cloudbase-deploy.md)。

## 开发

```sh
npm ci
npm test
npm run check
npm run build
```

`npm run dev` 提供本地静态工作台（浏览器存储），不调用真实 AI。云端模式由构建生成，保留现有 CloudBase 登录和 PostgreSQL 数据保存。配置 `WRITTER_AI_KEY` 后接入 DeepSeek；实际模型以云端 `WRITTER_AI_MODEL` 为准；代码默认值不等于线上配置。

## v0.3 初始交付记录（历史）

以下为最初交付时的状态；后续已经部署并有真实接口验收，当前进度以接续指南和验收记录为准。最初代码和自动检查完成时，尚未在 CloudBase 部署、配置实际模型密钥或验收真实 AI 输出。来源检测限原链接及补充链接，尚无全网检索。当前排版为基础编辑模板，精确 V25 和实际生图尚未完成。

不将模型生成的说明等同于事实核验，不将配图建议等同于图片生成，不将模拟测试等同于线上验收。

