# GREEN / 01

新粗野主义 × 瑞士国际主义（Swiss Style）的微信公众号组件库。

## 两部分入口

1. [代码格式、复制与微信交付规则](references/format-rules.md)：按内容输入、模板、预览、复制、图片、微信保存、手机阅读分环节记录要求与禁忌；区分平台资料、项目约定和实验项。
2. [组件库与使用场景](references/components.md)：36 个组件，32 个静态／横滑、4 个 SVG 实验项。每项包含使用场景、表达目的、不适合场景、内容限制和完整代码。

[原版逐字存档](references/original-v0.1.md)保留用户最初的全部代码。当前版本沿用原 14 个组件的视觉与表达目标，统一字体、色系、字级、普通文本 leaf，并新增 22 个；不再通过删掉双栏、图片或点击效果处理兼容问题。

## 查看效果

下载仓库并解压，用浏览器打开 [examples/gallery.html](examples/gallery.html)。可以按 320/375/430/677px 调整样本宽度，查看代码、点击 SVG、逐个复制组件。

图片使用自包含色块测试图，只供看布局；在该卡片的素材输入框逐张绑定自己上传的 HTTPS 图片，加载成功后再复制。不配置图片也能独立复制其它文字组件。

样本册工具栏使用网页 CSS/JS，复制时只输出组件片段。SVG 自己使用 SMIL，不依赖样本册 JS 播放。I01/I02 保留原 viewBox 动画，仍属需要单独验证的路径；I03/I04 使用固定画板的新动效。四项均未通过本仓的微信手机验收。

## 生成与检查

```bash
python scripts/build_library.py
python scripts/check_library.py
python scripts/test_library.py
node scripts/test_clipboard.mjs
```

生成与结构检查使用 Python 3 标准库即可；可选的复制逻辑模拟测试使用 Node 18+，也无第三方依赖。`build_library.py` 是组件实现与元数据来源，读取原版存档；生成 `references/catalog.json`、完整组件文档和样本册。修改实现或元数据后重新生成，不只手改生成物。

检查覆盖格式、配色、字体例外、使用场景完整性、HTML/SVG 分别解析和风险标记。它不是微信官方检测器，也不测量真实浏览器字体和剪贴板。

本库尚未连接公众号、上传素材、创建草稿或部署网站。验收记录见 [v0.3 检查记录](docs/validation-v0.3.md)。研究依据见 [工作台与 Skill 调研](docs/wechat-layout-research-2026-11-24.md)。
