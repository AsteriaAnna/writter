# GREEN / 01 — 公众号组件库 v0.2

更新：2026-11-21。风格：Neo-Brutalism × Swiss Editorial；墨绿、米白、荧光绿、直角。

**状态：兼容性修订版，微信手机端待验收。** 用户反馈 v0.1 全部排版在手机端无法显示；尚未取得保存后的 HTML 和截图，不能确定是粘贴方式、编辑器过滤还是阅读端渲染导致。此次按开源导出实践重写，不能把静态校验通过称作微信已验证。

## 一、使用与导出规则

1. 这些代码是模板，不是直接粘进公众号的文本。先生成 HTML，用浏览器打开 `examples/preview.html`，先点“复制纯文字基线”测试显示链路，再点“复制全部组件到公众号”，粘到公众号正文区域。基线无图片和装饰，便于隔离问题。
2. GitHub 文件页面和 Markdown 代码围栏只供阅读；不要复制其中的 HTML 源码到公众号。无自动复制权限时，只选中浏览器中渲染后的正文复制，不要全选带按钮的整个页面。此流程不需要 F12 修改后台 DOM。
3. 一个文章根容器只用一次；01—21 是根容器内部的组件。组件上下间距由自身 margin 控制，正文左右内边距统一由根容器控制，不逐层重复加 20px。
4. 默认使用 `section/p/span/strong/br/img`，样式全部内联；正文不依赖 class、id、CSS 变量、外部 CSS、脚本、定位、flex/grid、背景图或渐变。这个最小集合是本库保守策略，不是微信完整标签白名单。
5. HTML 文本统一放在 `<span leaf="">` 内；leaf 中只放文本和行内元素，不能放 p/section。采用 leaf 是参考 gzh-design 的兼容策略，不把“没有 leaf 一定无法显示”写成官方结论。
6. 正文、标题、标签不写 font-family，跟随微信字体；仅代码组件使用通用 monospace。字体族不一致可能影响两端字宽与断行。
7. 所有可变正文自然换行、不固定高度、不靠坐标摆字。长英文、URL、代码、标题分别检查。无需靠缩小文字塞进双栏。
8. 基础正文 16px / 1.85 行高；文章展示标题 30px；一级章节 23px；二级小节 19px；说明 13px。以上是主题选择，不是平台强制字号。标题用 p + leaf 实现，层级由文档语义决定，不依赖 h 标签默认样式。
9. 图片使用真实 HTTPS 地址；普通图片 `max-width:100%`，满宽海报才用 `width:100%`。`data-w` 必须随素材填真实原始宽度，不是显示宽度。示例图来自微信结构规范中的公开演示素材，原始宽度 1080；不要当成自己的正式配图。发布前推荐在公众号后台上传自己的素材、核对保存后的图片。浏览器能加载外部图片不代表已完成微信素材处理。
10. 不把公众号标题栏、封面和摘要当成正文组件。正文展示标题 02 按需使用，避免重复。导读目录只列看点，不承诺锚点跳转；CTA 只是文字，不冒充可点击关注按钮。
11. 发布前不允许遗留占位图、假链接、未填字段。正文字符串插入 HTML 前转义 `& < >`，属性值还需转义引号；代码只转义显示，不改写空格、换行、引号和半角标点。
12. v0.1 的表格拼版与两个 SVG 点击展开组件不再是默认导出方案。SVG 若重做，单独验证动画属性、保存后结构、内容展开和手机行为；不要通过给 SVG text 塞 HTML span 来迎合检查器。

## 二、来源与适用边界

| 来源 | 本库采用什么 | 不直接照搬什么 |
|---|---|---|
| [微信编辑器插件开发规范](https://developers.weixin.qq.com/doc/service/guide/product/plugin_spec.html)；[结构规范仓库](https://github.com/wechatjs/verify-article-structure-spec/blob/main/verify_article_structure.md) | 自适应宽度、避免内容裁剪、leaf 不包块级元素、继承默认字体、深色模式检查 | 官方站本次无法直接读取；详细规则通过结构规范仓库核对，不称本站全部例子已获官方认证 |
| [gzh-design SKILL](https://github.com/isjiamu/gzh-design-skill/blob/main/SKILL.md) | 正文片段与预览壳分离、内联样式、leaf、组件按内容映射 | “禁 div”“所有字必须 leaf”属于其实现约定；不把它的错误消息等同于微信实测 |
| [doocs/md 导出实现](https://github.com/doocs/md/blob/main/apps/web/src/services/export/clipboard.ts) | 明确输出富文本 HTML、纯文本兜底，预览工具与正文分开 | 不迁入整个编辑器，不套用其复杂 SVG 处理作为本库已具备的能力 |

下面是原创主题组件实现；参考上述机制与接口约定，不复制第三方主题代码。深色模式可能重映射 HTML 颜色，写死 color 并不保证保持原色。

## 三、文章根容器（只使用一次）

```html
<section style="margin:0;padding:20px 16px;background-color:#f7f7f0;color:#343832;font-size:16px;line-height:1.85;text-align:left;box-sizing:border-box;overflow-wrap:break-word;">
<!-- 正文组件放在这里 -->
</section>
```

## 四、21 个基础组件

### 01 / 刊号与栏目标签

只放短信息；无需左右两列表格。自然换行比压缩字号更重要。

```html
<p style="margin:0 0 18px;padding:8px 0;border-top:5px solid #c6ff00;border-bottom:2px solid #111111;font-size:13px;font-weight:700;line-height:1.6;color:#123a2c;"><span leaf="">GREEN / 01　创作与思考 · 2026</span></p>
```

### 02 / 正文展示标题（可选）

区别于公众号标题栏。允许任意自然换行，避免硬编码 br；建议不超过 32 字。

```html
<section style="margin:0 0 24px;padding:22px 16px;background-color:#123a2c;border-bottom:5px solid #c6ff00;box-sizing:border-box;">
  <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#c6ff00;font-weight:700;"><span leaf="">INDEPENDENT THINKING</span></p>
  <p style="margin:0;font-size:30px;line-height:1.4;color:#f7f7f0;font-weight:700;"><span leaf="">打破常规，让表达回到内容本身</span></p>
</section>
```

### 03 / 一级章节标题

映射 Markdown `##`。编号按文章章节顺序生成，不在组件中固定复用 01。

```html
<p style="margin:30px 0 16px;padding:0 0 10px;border-bottom:3px solid #111111;font-size:23px;font-weight:700;line-height:1.5;color:#123a2c;"><span leaf="">01 / 为什么要重新设计排版</span></p>
```

### 04 / 二级小节标题

映射 Markdown `###`，不再套一个重型卡片。

```html
<p style="margin:24px 0 12px;padding-left:10px;border-left:4px solid #123a2c;font-size:19px;font-weight:700;line-height:1.6;color:#111111;"><span leaf="">先保证文字可以清楚阅读</span></p>
```

### 05 / 普通正文

这是默认组件。每个自然段独立一个 p，保持原文顺序；不把整篇文章都装成卡片。

```html
<p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#343832;overflow-wrap:break-word;"><span leaf="">好的排版应当帮助读者识别层次。正文保持自然换行，长标题或多段说明出现时，容器也应随内容增高。</span></p>
```

### 06 / 行内强调三种

从中按语义选用；一段通常只强调一两个短语，不整段标记。这里合并展示三种效果。

```html
<p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">用<strong style="font-weight:700;color:#123a2c;">加粗表达重点</strong>，用<span style="background-color:#c6ff00;color:#111111;">纯色高亮突出短语</span>，用<span style="border-bottom:2px solid #123a2c;color:#111111;">底边框标记关键词</span>。</span></p>
```

### 07 / 开篇导读与看点

仅列真实内容，不自动编造导读；不是可点击目录。

```html
<section style="margin:0 0 22px;padding:16px 14px;border:2px solid #111111;background-color:#f0f0e9;box-sizing:border-box;">
  <p style="margin:0 0 8px;font-size:13px;font-weight:700;line-height:1.6;color:#123a2c;"><span leaf="">本篇看点 / IN THIS ISSUE</span></p>
  <p style="margin:0 0 6px;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">01　先看基础文字结构</span></p>
  <p style="margin:0;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">02　再看图片与复制方式</span></p>
</section>
```

### 08 / 轻量引用与署名

支持多段引文，末尾出处有依据才填写。引用原文，不将普通正文擅自变为他人引语。

```html
<section style="margin:0 0 20px;padding:14px;border-left:4px solid #123a2c;background-color:#f0f0e9;box-sizing:border-box;">
  <p style="margin:0 0 10px;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">“排版的第一项任务，是让内容能够被阅读。”</span></p>
  <p style="margin:0;font-size:13px;line-height:1.7;color:#555952;"><span leaf="">—— 本文示例句</span></p>
</section>
```

### 09 / 重点金句

强强调按需使用，不建议每章都出现。

```html
<section style="margin:0 0 22px;padding:18px 14px;background-color:#123a2c;border-bottom:4px solid #c6ff00;box-sizing:border-box;">
  <p style="margin:0;font-size:21px;font-weight:700;line-height:1.65;color:#f7f7f0;"><span leaf="">让读者先看懂，再让设计被记住。</span></p>
</section>
```

### 10 / 无序列表

一个列表项一个 p；首字符是可复制圆点。此为视觉列表，不声称具有原生 ul 的列表语义。不要用空格对齐多列。

```html
<section style="margin:0 0 18px;padding-left:8px;box-sizing:border-box;">
  <p style="margin:0 0 8px;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">• 保持清晰的标题层级。</span></p>
  <p style="margin:0;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">• 长列表项允许自然换行，不限制容器高度。</span></p>
</section>
```

### 11 / 步骤项

按需重复整个 section，更新编号。避免表格编号窄列，正文保留完整宽度。

```html
<section style="margin:0 0 18px;padding:14px;border:2px solid #111111;background-color:#f0f0e9;box-sizing:border-box;">
  <p style="margin:0 0 8px;font-size:17px;line-height:1.7;color:#123a2c;font-weight:700;"><span leaf="">01 / 先完成正文</span></p>
  <p style="margin:0;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">确认内容顺序与事实，再选择需要的视觉组件。步骤内容增加时卡片自动增高。</span></p>
</section>
```

### 12 / 提示、注意与补充说明

按原文含义替换标签；不要用颜色代替文字说明。

```html
<section style="margin:0 0 20px;padding:14px;border-left:4px solid #123a2c;background-color:#f0f0e9;box-sizing:border-box;">
  <p style="margin:0 0 6px;font-size:14px;font-weight:700;line-height:1.7;color:#123a2c;"><span leaf="">注意</span></p>
  <p style="margin:0;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">预览正常仍需检查保存后的公众号草稿，尤其是图片、长链接与深色背景。</span></p>
</section>
```

### 13 / 静态问答

替代未验证的点击揭晓。一个问答组一个 section；答案多段时复制答案 p。

```html
<section style="margin:0 0 20px;padding:14px;border:2px solid #111111;box-sizing:border-box;">
  <p style="margin:0 0 10px;font-size:17px;font-weight:700;line-height:1.7;color:#123a2c;"><span leaf="">Q / 应该复制什么？</span></p>
  <p style="margin:0;font-size:16px;line-height:1.85;color:#343832;"><span leaf=""><strong style="color:#123a2c;">A / </strong>复制浏览器渲染后的富文本，粘贴到公众号正文区域，而不是粘贴 HTML 源码。</span></p>
</section>
```

### 14 / 单栏对比

原双栏卡片改为上下排列，不通过缩小字号容纳长说明。真实多列数据表另行设计和测试，不把本组件当作完整数据表格。

```html
<section style="margin:0 0 20px;border:2px solid #111111;box-sizing:border-box;">
  <section style="padding:14px;background-color:#123a2c;box-sizing:border-box;">
    <p style="margin:0 0 6px;font-size:17px;font-weight:700;line-height:1.7;color:#c6ff00;"><span leaf="">A / 只看网页效果</span></p>
    <p style="margin:0;font-size:16px;line-height:1.85;color:#f7f7f0;"><span leaf="">可以观察视觉，但不能证明保存后的公众号文章保持一致。</span></p>
  </section>
  <section style="padding:14px;background-color:#f0f0e9;box-sizing:border-box;">
    <p style="margin:0 0 6px;font-size:17px;font-weight:700;line-height:1.7;color:#123a2c;"><span leaf="">B / 检查完整发布链路</span></p>
    <p style="margin:0;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">还要检查复制、粘贴、草稿保存、重新打开和手机预览。</span></p>
  </section>
</section>
```

### 15 / 普通图片与可选图注

换图时同步替换 src、alt 和 data-w；data-w 为原图像素宽度。空 alt 时不自动编造图注，可删除下方图注 p。小图保留自然尺寸，大图缩到可用宽度。本例为微信规范演示图，不是文章配图。

```html
<section style="margin:0 0 20px;">
  <p style="margin:0;line-height:1.5;"><span leaf=""><img src="https://mmbiz.qpic.cn/sz_mmbiz_png/WOsCxdtAXDtQWXtgKojxKdmZ4ic5UkzRMYqt9K5o6WmgwXQvAmkbnpfsicTglzzAhdjib7icSwVYS7WZiagJfUwDQVA/640?wx_fmt=png" alt="微信结构规范演示素材" data-w="1080" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p>
  <p style="margin:8px 0 0;font-size:13px;line-height:1.7;color:#555952;text-align:center;"><span leaf="">图 01 / 微信结构规范演示素材，正式发布前替换。</span></p>
</section>
```

### 16 / 满宽海报图片

只用于有足够分辨率且明确要求铺满的海报；不要给小图套用。真实 GIF 也使用 img，保持 GIF 素材地址，保存和手机端验证动画；不凭文件名推断动画必然保留。本例仍为静态规范演示图。

```html
<section style="margin:0 0 20px;border:2px solid #111111;box-sizing:border-box;">
  <p style="margin:0;line-height:1.5;"><span leaf=""><img src="https://mmbiz.qpic.cn/sz_mmbiz_png/WOsCxdtAXDtQWXtgKojxKdmZ4ic5UkzRMYqt9K5o6WmgwXQvAmkbnpfsicTglzzAhdjib7icSwVYS7WZiagJfUwDQVA/640?wx_fmt=png" alt="满宽图片示例，微信规范演示素材" data-w="1080" style="display:block;width:100%;max-width:100%;height:auto;margin:0;border:0;"></span></p>
</section>
```

### 17 / 行内代码

短标识符使用此组件；长命令放代码块。不要把代码半角标点替换成中文全角。

```html
<p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#343832;"><span leaf="">组件示例保存在 <span style="background-color:#e7e9e1;color:#123a2c;font-family:monospace;overflow-wrap:anywhere;">references/components.md</span>，正文与预览页分别导出。</span></p>
```

### 18 / 代码、命令与 Prompt 块

逐行 p，代码行用 pre-wrap 保留真实缩进并换行；不使用全角空格替代源代码缩进。先对原始字符串 HTML 转义，再把实际换行切成各个 p。空行使用一个 br。语言标签可换为 Prompt；本文示例不承担源代码下载，复制并执行前仍需核对原始文件。

```html
<section style="margin:0 0 20px;padding:14px;background-color:#111111;border-left:4px solid #c6ff00;box-sizing:border-box;">
  <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#c6ff00;"><span leaf="">PYTHON / 示例</span></p>
  <p style="margin:0;font-family:monospace;font-size:14px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;color:#f7f7f0;"><span leaf="">if count &lt; 3:</span></p>
  <p style="margin:0;font-family:monospace;font-size:14px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;color:#f7f7f0;"><span leaf="">    print(&quot;保持四个半角空格缩进&quot;)</span></p>
</section>
```

### 19 / 收束与核心结论

以真实结论替换，不自动补充没有出现在原文中的观点。

```html
<section style="margin:0 0 22px;padding:16px 14px;border:2px solid #111111;background-color:#f0f0e9;box-sizing:border-box;">
  <p style="margin:0 0 8px;font-size:13px;font-weight:700;line-height:1.7;color:#123a2c;"><span leaf="">KEY TAKEAWAY</span></p>
  <p style="margin:0;font-size:17px;font-weight:700;line-height:1.85;color:#111111;"><span leaf="">清楚的层级、可靠的图片和正确的复制方式，共同构成可检查的排版结果。</span></p>
</section>
```

### 20 / 参考资料与长链接

每条来源一个 p，正文编号与此处对应；URL 为可复制文本，不伪造跳转权限。只处理 URL 的断行，不对普通中文使用 break-all。

```html
<section style="margin:0 0 22px;padding-top:14px;border-top:2px solid #111111;">
  <p style="margin:0 0 8px;font-size:14px;font-weight:700;line-height:1.7;color:#123a2c;"><span leaf="">参考资料 / REFERENCES</span></p>
  <p style="margin:0;font-size:13px;line-height:1.8;color:#555952;"><span leaf="">[01] 微信文章结构规范：<span style="word-break:break-all;">https://github.com/wechatjs/verify-article-structure-spec</span></span></p>
</section>
```

### 21 / 作者与结尾（可选）

不擅自生成作者身份。互动引导只出现一次，仅为文字提示，不是按钮。

```html
<section style="margin:0;padding:18px 14px;border-top:3px solid #111111;border-bottom:5px solid #c6ff00;background-color:#123a2c;box-sizing:border-box;">
  <p style="margin:0 0 8px;font-size:18px;font-weight:700;line-height:1.7;color:#f7f7f0;"><span leaf="">GREEN / 01 · 下篇见</span></p>
  <p style="margin:0;font-size:14px;line-height:1.8;color:#f7f7f0;"><span leaf="">如果这篇内容对你有帮助，欢迎分享你的看法。</span></p>
</section>
```

## 五、内容映射与组合

| 输入内容 | 默认组件 |
|---|---|
| 文章标题、##、### | 02（可选）、03、04 |
| 普通段落、强调 | 05、06 |
| 导读、引用、重点金句 | 07、08、09 |
| 无序项、步骤、注意事项 | 10、11、12 |
| Q&A、对比 | 13、14 |
| 图片 / GIF、明确满宽海报 | 15、16 |
| 行内代码、代码 / 命令 / Prompt | 17、18 |
| 总结、参考来源、作者与结尾 | 19、20、21 |

教程：01 → 07 → 03/04/05 → 11/15/17/18 → 19 → 20。观点文：01 → 02（可选）→ 05 → 03/04/08/14 → 19 → 20/21。问答稿：01 → 05 → 03/13 → 20/21。按内容选组件，不要求每篇用齐 21 个。

## 六、验证与回报

本地：运行 `python scripts/build_preview.py`，再运行 `python scripts/check_html.py examples/article.html`。该检查器只验证本库保守子集，不是微信官方检测器。

浏览器：检查 320/375/430/677px 下长标题、长 URL、代码缩进、图片加载、小图不拉伸、没有横向溢出；检查复制内容为 text/html 且没有工具栏和脚本。模拟浏览器结果不等于微信验收。

微信：复制预览页正文 → 粘贴 → 保存草稿 → 重新打开 → 手机预览；检查文字、背景、图片、深色模式，记录客户端和系统版本。若失败，区分“正文消失”“只有样式消失”“只有图片消失”，附保存后的正文 HTML 与手机截图定位。不要在未查明前认定单一 CSS 属性导致全部失败。

待微信验收通过后再记录通过日期与客户端版本；当前不写“所有手机兼容”“官方认证”或“直接发布无风险”。
