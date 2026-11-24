# 第二部分：GREEN / 01 组件库 v0.3

新粗野主义 × 瑞士国际主义；36 个组件：原 14 个视觉目标保留，新增 22 个。统一规则见 [代码格式要求](format-rules.md)。原始文件逐字存档于 [v0.1 原稿](original-v0.1.md)。

**所有组件均未完成本仓的微信手机端验收。** I01/I02 保留原动画，I03/I04 为新增 SMIL 实验组件，不能当成兼容性已经修复。

每个代码块是独立组件片段，外层文章容器仅负责统一字体环境，不再重复加左右 padding；组件自身背景和安全边距齐全。模板中的大括号参数须绑定真实素材后才能发布。

| 编号 | 组件 | 类型 | 来源 |
|---|---|---|---|
| C01 | 刊号条 | static | 原版视觉延续，格式统一 |
| C02 | 主视觉封面 | static | 原版视觉延续，格式统一 |
| C03 | 正文章节 | static | 原版视觉延续，格式统一 |
| C04 | 编者按与引言海报 | static | 原版视觉延续，格式统一 |
| C05 | 双栏对比卡 | static | 原版视觉延续，格式统一 |
| C06 | 结构化对比矩阵 | static | 原版视觉延续，格式统一 |
| C07 | 编号要点列表 | static | 原版视觉延续，格式统一 |
| C08 | 图片画框与编号图注 | static | 原版视觉延续，格式统一 |
| C09 | 核心总结提示框 | static | 原版视觉延续，格式统一 |
| C10 | 暗色反转章节 | static | 原版视觉延续，格式统一 |
| C11 | 参考资料 | static | 原版视觉延续，格式统一 |
| C12 | 结尾与互动引导 | static | 原版视觉延续，格式统一 |
| C13 | 轻量正文 | static | 新增 |
| C14 | 二级小节标题 | static | 新增 |
| C15 | 三级短标题 | static | 新增 |
| C16 | 导读与看点 | static | 新增 |
| C17 | 行内标记组合 | static | 新增 |
| C18 | 普通引用与出处 | static | 新增 |
| C19 | 无序要点 | static | 新增 |
| C20 | 步骤时间线 | static | 新增 |
| C21 | 行动检查清单 | static | 新增 |
| C22 | 静态 FAQ | static | 新增 |
| C23 | 概念解释卡 | static | 新增 |
| C24 | 案例档案卡 | static | 新增 |
| C25 | 数字亮点 | static | 新增 |
| C26 | 上下前后对照 | static | 新增 |
| C27 | 自然尺寸图片与 GIF | static | 新增 |
| C28 | 左图右文 | static | 新增 |
| C29 | 双图与共享图注 | static | 新增 |
| C30 | 横向滑动图集 | scroll | 新增 |
| C31 | 代码、命令与 Prompt | static | 新增 |
| C32 | 信息条与行内代码 | static | 新增 |
| I01 | 点击展开抽屉 | svg-legacy | 原版动效与视觉保留，字体／色板统一 |
| I02 | 点击揭晓答案 | svg-legacy | 原版动效与视觉保留，字体／色板统一 |
| I03 | 固定画板点击揭晓 | svg | 新增属性级 SMIL |
| I04 | 点击描边生长 | svg | 新增属性级 SMIL |

## C01 / 刊号条

- 使用场景：文章开头、固定栏目。
- 表达目的：建立期刊身份和阅读起点。
- 不适合：普通段落重复出现。
- 内容与检查：栏目与期号各一项；窄屏可换行。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="background:#f7f7f0;border-bottom:3px solid #111111;box-sizing:border-box;">
  <section style="height:6px;background:#c6ff00;"></section>
  <section style="padding:10px 20px;box-sizing:border-box;">
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0;">
      <tr>
        <td style="width:60%;padding:0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#111111;text-align:left;vertical-align:middle;"><span leaf="">
          THE CREATIVE ISSUE.
        </span></td>
        <td style="width:40%;padding:0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#123a2c;text-align:right;vertical-align:middle;"><span leaf="">
          VOL. 001 / 2026
        </span></td>
      </tr>
    </table>
  </section>
</section>
```

## C02 / 主视觉封面

- 使用场景：需要强开场的观点或活动文章。
- 表达目的：用字号与反差表达主命题。
- 不适合：每个章节都用封面。
- 内容与检查：主标题建议两行；公众号标题栏另填。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="background:#123a2c;color:#f7f7f0;padding:20px 20px 18px;border-bottom:3px solid #111111;box-sizing:border-box;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-bottom:1px solid #487061;margin:0;">
    <tr>
      <td style="width:75%;padding:0 0 8px 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#d2d8d0;text-align:left;"><span leaf="">
        INDEPENDENT THINKING
      </span></td>
      <td style="width:25%;padding:0 0 8px 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#c6ff00;text-align:right;"><span leaf="">
        ● 01
      </span></td>
    </tr>
  </table>
  <p style="font-size:52px;line-height:1.06;letter-spacing:-2px;margin:14px 0 14px;font-weight:900;color:#f7f7f0;"><span leaf="">
    打破</span><br><span style="color:#c6ff00;"><span leaf="">常规.</span></span>
  </p>
  <section style="background:#f7f7f0;color:#111111;padding:11px 14px;border:2px solid #111111;margin-bottom:14px;box-sizing:border-box;">
    <p style="font-size:19px;line-height:1.4;letter-spacing:-0.5px;margin:0;font-weight:900;color:#111111;"><span leaf="">
      不是为了不同，而是为了</span><span style="background:#c6ff00;padding:0 4px;"><span leaf="">创造</span></span><span leaf="">。
    </span></p>
  </section>
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-top:2px solid #c6ff00;margin:0;">
    <tr>
      <td style="width:75%;padding:8px 0 0 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#f7f7f0;text-align:left;"><span leaf="">
        BREAK THE ORDINARY.
      </span></td>
      <td style="width:25%;padding:8px 0 0 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1px;color:#c6ff00;text-align:right;"><span leaf="">
        READ ↓
      </span></td>
    </tr>
  </table>
</section>
```

## C03 / 正文章节

- 使用场景：进入新的一级议题。
- 表达目的：章节编号、问题与正文的递进。
- 不适合：每个短段都升级章节。
- 内容与检查：正文自然增高；章节编号按顺序更新。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="padding:26px 20px 24px;background:#f7f7f0;box-sizing:border-box;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-bottom:2px solid #111111;margin:0 0 18px;">
    <tr>
      <td style="width:72%;padding:0 0 10px 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#123a2c;text-align:left;"><span leaf="">
        01 / INTRODUCTION
      </span></td>
      <td style="width:28%;padding:0 0 10px 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1px;color:#555952;text-align:right;"><span leaf="">
        SECTION 01
      </span></td>
    </tr>
  </table>
  <p style="font-size:24px;line-height:1.4;letter-spacing:-0.8px;margin:0 0 18px;font-weight:900;color:#111111;"><span leaf="">
    当所有人都在</span><br><span leaf="">寻找</span><span style="background:#c6ff00;padding:1px 5px;color:#111111;"><span leaf="">标准答案</span></span><span leaf="">。
  </span></p>
  <p style="font-size:16px;line-height:2;color:#343832;text-align:justify;margin:0 0 14px;"><span leaf="">
    正文段落内容，采用 15px 字号与 2.0 倍行高保障长文阅读舒适度。
  </span></p>
  <p style="font-size:16px;line-height:2;color:#343832;text-align:justify;margin:0;"><span leaf="">
    重点强调短语使用 </span><span style="font-weight:900;color:#111111;border-bottom:2px solid #c6ff00;"><span leaf="">2px 荧光底边框</span></span><span leaf=""> 标记。
  </span></p>
</section>
```

## C04 / 编者按与引言海报

- 使用场景：有重要引语或编者判断。
- 表达目的：将主张与普通段落区分。
- 不适合：无来源冒充他人引语。
- 内容与检查：金句尽量两行；长引用用 C18。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="background:#f0f0e9;padding:24px 20px;border-top:3px solid #111111;border-bottom:3px solid #111111;box-sizing:border-box;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0 0 14px;">
    <tr>
      <td style="width:65%;padding:0;text-align:left;">
        <span style="display:inline-block;background:#111111;color:#c6ff00;font-size:12px;font-weight:900;line-height:1.2;letter-spacing:1.2px;padding:4px 8px;"><span leaf="">
          EDITOR'S NOTE
        </span></span>
      </td>
      <td style="width:35%;padding:0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#123a2c;text-align:right;"><span leaf="">
        QUOTE / 01
      </span></td>
    </tr>
  </table>
  <section style="border-left:6px solid #123a2c;padding-left:14px;box-sizing:border-box;">
    <p style="font-size:24px;font-weight:900;letter-spacing:-0.5px;line-height:1.45;margin:0;color:#111111;"><span leaf="">
      “好设计，不只是让人看见。</span><br>
      <span style="background:#111111;color:#c6ff00;padding:2px 6px;"><span leaf="">更要让人记住。</span></span><span leaf="">”
    </span></p>
  </section>
  <p style="font-size:12px;font-weight:900;line-height:1.4;margin:16px 0 0;letter-spacing:1.2px;color:#555952;"><span leaf="">
    ━━━ MAKE AN IMPACT
  </span></p>
</section>
```

## C05 / 双栏对比卡

- 使用场景：同维度两个对象的短比较。
- 表达目的：左右同级、差异可扫描。
- 不适合：大段叙事、多于两个对象。
- 内容与检查：每栏短标题＋短说明；长说明可选 C26。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;margin:0;">
  <tr>
    <td style="width:50%;background:#123a2c;color:#f7f7f0;padding:16px 12px;vertical-align:top;border-right:2px solid #111111;">
      <p style="font-size:32px;font-weight:900;line-height:1.1;color:#c6ff00;margin:0;"><span leaf="">01</span></p>
      <p style="font-size:16px;font-weight:900;line-height:1.35;margin:10px 0 6px;color:#f7f7f0;"><span leaf="">打破框架</span></p>
      <p style="font-size:14px;line-height:1.75;margin:0;color:#d2d8d0;"><span leaf="">从习惯的视觉秩序中寻找新的表达。</span></p>
    </td>
    <td style="width:50%;background:#f0f0e9;color:#111111;padding:16px 12px;vertical-align:top;">
      <p style="font-size:32px;font-weight:900;line-height:1.1;color:#111111;margin:0;"><span leaf="">02</span></p>
      <p style="font-size:16px;font-weight:900;line-height:1.35;margin:10px 0 6px;color:#111111;"><span leaf="">建立重点</span></p>
      <p style="font-size:14px;line-height:1.75;margin:0;color:#343832;"><span leaf="">让读者第一眼就抓住文章的核心。</span></p>
    </td>
  </tr>
</table></section>
```

## C06 / 结构化对比矩阵

- 使用场景：同一组对象多个对应维度。
- 表达目的：逐行横向核对信息。
- 不适合：把无关系段落强凑表格。
- 内容与检查：重复数据行时维护每列意义；超宽用专门横滚。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;margin:0 0 20px;">
  <tr>
    <td style="width:50%;background:#111111;color:#f7f7f0;padding:11px 10px;vertical-align:middle;border-right:2px solid #111111;border-bottom:2px solid #111111;">
      <p style="font-size:12px;font-weight:900;line-height:1.3;color:#d2d8d0;letter-spacing:1px;margin:0 0 3px;"><span leaf="">01 / DIMENSION A</span></p>
      <p style="font-size:14px;font-weight:900;line-height:1.35;color:#f7f7f0;margin:0;"><span leaf="">对比维度 A</span></p>
    </td>
    <td style="width:50%;background:#123a2c;color:#f7f7f0;padding:11px 10px;vertical-align:middle;border-bottom:2px solid #111111;">
      <p style="font-size:12px;font-weight:900;line-height:1.3;color:#c6ff00;letter-spacing:1px;margin:0 0 3px;"><span leaf="">02 / DIMENSION B</span></p>
      <p style="font-size:14px;font-weight:900;line-height:1.35;color:#f7f7f0;margin:0;"><span leaf="">对比维度 B</span></p>
    </td>
  </tr>
  <tr>
    <td style="width:50%;background:#f0f0e9;padding:10px 10px;vertical-align:top;border-right:2px solid #111111;">
      <p style="font-size:14px;font-weight:900;line-height:1.4;color:#111111;margin:0 0 2px;"><span leaf="">要点标题 A</span></p>
      <p style="font-size:14px;line-height:1.6;color:#343832;margin:0;"><span leaf="">对应说明文字</span></p>
    </td>
    <td style="width:50%;background:#f7f7f0;padding:10px 10px;vertical-align:top;">
      <p style="font-size:14px;font-weight:900;line-height:1.4;color:#123a2c;margin:0 0 2px;"><span leaf="">要点标题 B</span></p>
      <p style="font-size:14px;line-height:1.6;color:#343832;margin:0;"><span leaf="">对应说明文字</span></p>
    </td>
  </tr>
</table></section>
```

## C07 / 编号要点列表

- 使用场景：有明确并列顺序的要点。
- 表达目的：编号与描述形成稳定对齐。
- 不适合：没有顺序含义时机械编号。
- 内容与检查：按需复制整行并更新编号；行高随内容变化。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;margin:0;">
  <tr>
    <td style="width:14%;background:#111111;color:#c6ff00;text-align:center;vertical-align:middle;font-size:16px;font-weight:900;border-bottom:2px solid #111111;border-right:2px solid #111111;padding:12px 0;"><span leaf="">01</span></td>
    <td style="width:86%;background:#f7f7f0;padding:12px 12px;border-bottom:2px solid #111111;vertical-align:top;">
      <p style="margin:0 0 3px 0;font-size:14px;font-weight:900;line-height:1.35;color:#111111;"><span leaf="">要点标题一</span></p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#343832;"><span leaf="">使用百分比宽度锁死左侧编号列，以独立编号列控制列表对齐。</span></p>
    </td>
  </tr>
  <tr>
    <td style="width:14%;background:#123a2c;color:#c6ff00;text-align:center;vertical-align:middle;font-size:16px;font-weight:900;border-right:2px solid #111111;padding:12px 0;"><span leaf="">02</span></td>
    <td style="width:86%;background:#f0f0e9;padding:12px 12px;vertical-align:top;">
      <p style="margin:0 0 3px 0;font-size:14px;font-weight:900;line-height:1.35;color:#111111;"><span leaf="">要点标题二</span></p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#343832;"><span leaf="">双色交替行提升长列表视觉扫描效率。</span></p>
    </td>
  </tr>
</table></section>
```

## C08 / 图片画框与编号图注

- 使用场景：正文插图、截图、作品。
- 表达目的：图像、序号、图注构成可引用整体。
- 不适合：删掉真实说明或用假图当完成。
- 内容与检查：绑定 URL、原始宽度和 alt；图注按实际素材改。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：IMAGE_ALT, IMAGE_URL, IMAGE_WIDTH。

```html
<section style="padding:6px 20px 24px;background:#f7f7f0;box-sizing:border-box;">
  <section style="border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;">
    <img data-w="{{IMAGE_WIDTH}}" src="{{IMAGE_URL}}" alt="{{IMAGE_ALT}}" style="display:block;width:100%;max-width:100%;height:auto;margin:0;border:none;">
    <section style="border-top:2px solid #111111;padding:10px 12px;background:#f0f0e9;box-sizing:border-box;">
      <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0;">
        <tr>
          <td style="width:22%;padding:0;vertical-align:middle;">
            <span style="display:inline-block;background:#111111;color:#c6ff00;font-size:12px;font-weight:900;line-height:1.2;letter-spacing:1px;padding:3px 6px;"><span leaf="">FIG. 01</span></span>
          </td>
          <td style="width:78%;padding:0;font-size:14px;line-height:1.5;color:#343832;font-weight:700;vertical-align:middle;"><span leaf="">
            图片索引说明文字（换图时同步更新原始宽度 data-w）。
          </span></td>
        </tr>
      </table>
    </section>
  </section>
</section>
```

## C09 / 核心总结提示框

- 使用场景：一小节结论或关键隐喻。
- 表达目的：将结论与论证分层。
- 不适合：整篇每段都放总结框。
- 内容与检查：结论不增加原文没有的事实。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="background:#f0f0e9;border:2px solid #111111;border-left:6px solid #123a2c;padding:15px 14px;box-sizing:border-box;">
  <p style="margin:0 0 8px;line-height:1.2;">
    <span style="display:inline-block;background:#111111;color:#c6ff00;font-size:12px;font-weight:900;line-height:1.2;letter-spacing:1.2px;padding:3px 7px;"><span leaf="">KEY TAKEAWAY</span></span>
  </p>
  <p style="font-size:16px;font-weight:900;line-height:1.65;color:#111111;margin:0;"><span leaf="">
    核心总结结论句，关键短语采用 </span><span style="background:#c6ff00;padding:1px 4px;"><span leaf="">局部荧光高光</span></span><span leaf=""> 聚焦。
  </span></p>
</section></section>
```

## C10 / 暗色反转章节

- 使用场景：论证出现重要转折。
- 表达目的：通过深底和亮色标记转折。
- 不适合：每章反复切换暗色。
- 内容与检查：不固定正文高度；检查深色模式。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="background:#111111;color:#f7f7f0;padding:28px 20px;border-bottom:8px solid #c6ff00;box-sizing:border-box;">
  <p style="font-size:12px;font-weight:900;line-height:1.3;color:#c6ff00;letter-spacing:1.2px;margin:0 0 14px;"><span leaf="">
    02 / DARK CHAPTER
  </span></p>
  <p style="font-size:24px;font-weight:900;line-height:1.35;letter-spacing:-0.8px;margin:0 0 18px;color:#f7f7f0;"><span leaf="">
    重磅转折章节标题</span><br><span style="color:#c6ff00;"><span leaf="">核心破题点.</span></span>
  </p>
  <p style="font-size:16px;line-height:2;color:#d2d8d0;text-align:justify;margin:0;"><span leaf="">
    暗色背景下的提亮正文字色（#d2d8d0），保障移动端阅读对比度。
  </span></p>
</section>
```

## C11 / 参考资料

- 使用场景：文章末尾或段落出处。
- 表达目的：提供可追溯资料。
- 不适合：伪造来源或跳转权限。
- 内容与检查：每条来源独立；URL 与中文分别处理换行。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="margin:0;padding:14px 15px;background:#f0f0e9;border:2px solid #111111;box-sizing:border-box;">
  <p style="margin:0 0 8px 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1px;color:#123a2c;"><span leaf="">REFERENCES &amp; NOTES</span></p>
  <p style="margin:0 0 6px 0;font-size:14px;line-height:1.65;color:#343832;word-break:break-all;"><span leaf="">[01] 纯文本参考来源标题 — example.com/article（默认列出可复制来源，跳转能力按账号与链接类型核对）</span></p>
</section></section>
```

## C12 / 结尾与互动引导

- 使用场景：文章结束。
- 表达目的：收束栏目与读者互动。
- 不适合：中间重复出现关注卡。
- 内容与检查：文字引导不是可点击的微信功能按钮。
- 来源／状态：原版视觉延续，格式统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="background:#123a2c;color:#f7f7f0;border-top:3px solid #111111;border-bottom:8px solid #c6ff00;padding:24px 20px 18px;box-sizing:border-box;">
  <p style="font-size:32px;font-weight:900;line-height:1.08;letter-spacing:-1.5px;margin:0 0 18px;color:#f7f7f0;"><span leaf="">
    LIVE IN</span><br><span leaf="">THE NOW</span><span style="color:#c6ff00;"><span leaf="">.</span></span>
  </p>
  <section style="background:#f7f7f0;color:#111111;padding:12px 14px;border:2px solid #111111;margin-bottom:18px;box-sizing:border-box;">
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0;">
      <tr>
        <td style="width:58%;padding:0;font-size:14px;font-weight:900;line-height:1.4;color:#111111;text-align:left;vertical-align:middle;"><span leaf="">
          如果你有所感悟，希望你能
        </span></td>
        <td style="width:42%;padding:0;text-align:right;vertical-align:middle;">
          <span style="display:inline-block;background:#c6ff00;color:#111111;font-size:12px;font-weight:900;line-height:1.2;padding:4px 7px;border:1px solid #111111;"><span leaf="">
            点赞 · 关注 · 收藏
          </span></span>
        </td>
      </tr>
    </table>
  </section>
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-top:1px solid #487061;margin:0;">
    <tr>
      <td style="width:45%;padding:12px 0 0 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#d2d8d0;text-align:left;"><span leaf="">
        END OF ISSUE / 001
      </span></td>
      <td style="width:55%;padding:12px 0 0 0;font-size:12px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#c6ff00;text-align:right;"><span leaf="">
        ● FOLLOW FOR MORE
      </span></td>
    </tr>
  </table>
</section>
```

## C13 / 轻量正文

- 使用场景：连续叙述、解释与补充。
- 表达目的：承载主信息，给重组件留出呼吸。
- 不适合：为凑视觉而把每段卡片化。
- 内容与检查：一个自然段一项，不截断原文。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">先把事情讲清楚，再让排版帮助读者识别重点。普通段落保持自然换行，和双栏、图片、引用共同组成文章的阅读节奏。</span></p></section>
```

## C14 / 二级小节标题

- 使用场景：一级章节内的子问题。
- 表达目的：在同一议题内建立次级层次。
- 不适合：把普通强调句升级为标题。
- 内容与检查：建议两行以内，长标题自然换行。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><p style="margin:0;font-size:19px;line-height:1.85;color:#123a2c;font-weight:900;border-left:6px solid #123a2c;padding-left:12px;"><span leaf="">02.1 / 如何判断问题发生在哪一步</span></p></section>
```

## C15 / 三级短标题

- 使用场景：小节内的短步骤或术语分组。
- 表达目的：以轻量标识表达更低层级。
- 不适合：与一级章节使用同样粗重卡片。
- 内容与检查：短标题为宜，不强加英文副标题。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><p style="margin:0;font-size:16px;line-height:1.85;color:#111111;font-weight:900;"><span leaf="">▍ 保存后的结果</span></p></section>
```

## C16 / 导读与看点

- 使用场景：长文开头、读者需要路线图。
- 表达目的：先告诉读者会解决哪些问题。
- 不适合：假装可点击锚点目录。
- 内容与检查：2—4 项，来自真实内容，不强制一篇只三章。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 8px;font-size:12px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">READING MAP / 本篇看点</span></p><p style="margin:0 0 6px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">01　内容结构与表达</span></p><p style="margin:0 0 6px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">02　图片与交互</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">03　保存后的阅读效果</span></p></section></section>
```

## C17 / 行内标记组合

- 使用场景：正文确有重点短语、术语或结论。
- 表达目的：加粗、色底与底边框表达不同强度。
- 不适合：整段高亮或按固定频率胡乱标记。
- 内容与检查：每段通常 1—2 个短语，按语义选择。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">用<strong style="color:#123a2c;font-weight:900;">加粗表达重点</strong>，用<span style="background:#c6ff00;color:#111111;">荧光底色突出短语</span>，用<span style="border-bottom:2px solid #123a2c;">细线标记关键词</span>。</span></p></section>
```

## C18 / 普通引用与出处

- 使用场景：他人原话、文献摘录、多段引用。
- 表达目的：区分作者叙述和被引用内容。
- 不适合：把个人感想伪装为文献证据。
- 内容与检查：出处有依据才填；长引用可增段。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">“这是一段用于展示引用布局的示例文字。”</span></p><p style="margin:0;font-size:14px;line-height:1.85;color:#555952;font-weight:400;"><span leaf="">—— 排版示例，非他人真实引语</span></p></section></section>
```

## C19 / 无序要点

- 使用场景：真实并列、无先后关系的信息。
- 表达目的：平行列出要点。
- 不适合：顺序流程却不编号。
- 内容与检查：2—6 项；每项自然增高。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">• 内容先有明确结构。</span></p><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">• 组件对应真实表达目的。</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">• 视觉服务于阅读。</span></p></section>
```

## C20 / 步骤时间线

- 使用场景：有先后顺序的操作、流程。
- 表达目的：让步骤、动作和说明连续可跟随。
- 不适合：仅有日期没有流程却编造因果。
- 内容与检查：复制完整步骤，编号由顺序生成。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="border-left:3px solid #123a2c;padding:0 0 16px 16px;"><p style="margin:0 0 6px;font-size:19px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">01 / 确认内容</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">先确认标题、事实与来源。</span></p></section><section style="border-left:3px solid #123a2c;padding:0 0 16px 16px;"><p style="margin:0 0 6px;font-size:19px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">02 / 安排版式</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">为并列、步骤和引语选择组件。</span></p></section><section style="border-left:3px solid #123a2c;padding:0 0 16px 16px;"><p style="margin:0 0 6px;font-size:19px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">03 / 检查保存</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">保存后重新打开并核对。</span></p></section></section>
```

## C21 / 行动检查清单

- 使用场景：发布前核对、读者执行动作。
- 表达目的：把待核对事项明确列出。
- 不适合：假装勾选状态会保存。
- 内容与检查：方框为静态符号，不记录用户操作。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 8px;font-size:12px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">CHECKLIST / 逐项核对</span></p><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">□ 标题与段落完整</span></p><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">□ 图片和图注对应</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">□ 保存后重新打开检查</span></p></section></section>
```

## C22 / 静态 FAQ

- 使用场景：答疑、访谈、常见问题。
- 表达目的：问题与回答成组表达。
- 不适合：无提问语义的章节标题。
- 内容与检查：一个问答一组，回答可多段。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 12px;font-size:19px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">Q / 为什么要看保存后的结果？</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">A / 因为复制、编辑器保存和手机阅读属于不同阶段，需要分别检查。</span></p></section></section>
```

## C23 / 概念解释卡

- 使用场景：首次出现、需要定义的术语。
- 表达目的：名词、定义、边界清晰分层。
- 不适合：普通段落硬套概念标签。
- 内容与检查：一个概念一张卡；不能删掉必要限定。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 8px;font-size:12px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">DEFINITION / 概念</span></p><p style="margin:0 0 12px;font-size:24px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">富文本复制</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">传递文字及其 HTML 格式的复制方式。复制源码字符串与复制渲染内容不是同一件事。</span></p></section></section>
```

## C24 / 案例档案卡

- 使用场景：有情境、动作和结果的真实案例。
- 表达目的：让事实结构可扫描。
- 不适合：补造结果或把目标写成成果。
- 内容与检查：至少有真实情境；缺结果时写待验证。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 8px;font-size:12px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">CASE FILE / 案例结构</span></p><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">情境：一篇教程需要展示操作截图。</span></p><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">动作：使用编号图注与横向图集。</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">结果：待实际发布与读者反馈验证。</span></p></section></section>
```

## C25 / 数字亮点

- 使用场景：需要读者记住且有依据的数据。
- 表达目的：数字、含义、单位与来源一起出现。
- 不适合：无来源的大数字宣传。
- 内容与检查：必须有口径；不能自动凑百分比。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0;font-size:32px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">03</span></p><p style="margin:0 0 12px;font-size:19px;line-height:1.85;color:#111111;font-weight:900;"><span leaf="">三个需要分别检查的阶段</span></p><p style="margin:0;font-size:14px;line-height:1.85;color:#555952;font-weight:400;"><span leaf="">本页示例计数：复制、保存、阅读，不是业务统计。</span></p></section></section>
```

## C26 / 上下前后对照

- 使用场景：说明较长的前后变化或双对象比较。
- 表达目的：保持比较关系，给长文案完整宽度。
- 不适合：静默替换作者选定的双栏。
- 内容与检查：与 C05 并存，按长度选择。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 8px;font-size:12px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">BEFORE / 调整前</span></p><p style="margin:0 0 12px;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">较长的说明放进窄列后，读者需要反复换行。</span></p><p style="margin:0 0 8px;font-size:12px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">AFTER / 调整后</span></p><p style="margin:0;font-size:16px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">内容较长时可以选择上下对照，同时保留双栏作为短比较的表达。</span></p></section></section>
```

## C27 / 自然尺寸图片与 GIF

- 使用场景：普通截图、小图、GIF。
- 表达目的：小图不强制拉伸，图注保持可编辑。
- 不适合：默认所有图都铺满。
- 内容与检查：GIF 用真实素材并单测；无图注时删除说明。
- 来源／状态：新增；微信待验收。
- 待绑定字段：IMAGE_ALT, IMAGE_URL, IMAGE_WIDTH。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{IMAGE_URL}}" data-w="{{IMAGE_WIDTH}}" alt="{{IMAGE_ALT}}" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p><p style="margin:8px 0 0;font-size:14px;line-height:1.85;color:#555952;font-weight:400;"><span leaf="">FIG. 02 / 图片说明按真实素材填写</span></p></section>
```

## C28 / 左图右文

- 使用场景：产品、人物或作品的简短介绍。
- 表达目的：图片与解释相邻，形成同一阅读单元。
- 不适合：长履历和多段故事强塞半栏。
- 内容与检查：图片 42%、文字 58%；说明短、窄屏复核。
- 来源／状态：新增；微信待验收。
- 待绑定字段：IMAGE_ALT, IMAGE_URL, IMAGE_WIDTH。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;"><tr><td style="width:42%;padding:12px;vertical-align:top;background:#f0f0e9;"><p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{IMAGE_URL}}" data-w="{{IMAGE_WIDTH}}" alt="{{IMAGE_ALT}}" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p></td><td style="width:58%;padding:12px;vertical-align:top;"><p style="margin:0 0 12px;font-size:19px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">图文并置</span></p><p style="margin:0;font-size:14px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">图片提供对象，文字说明它与本节内容的关系。</span></p></td></tr></table></section>
```

## C29 / 双图与共享图注

- 使用场景：两个界面、前后状态或同组作品。
- 表达目的：两张图在同一尺度下比较。
- 不适合：不相关图片硬凑比较。
- 内容与检查：独立绑定两张素材，不自动裁切证据截图。
- 来源／状态：新增；微信待验收。
- 待绑定字段：IMAGE_2_ALT, IMAGE_2_URL, IMAGE_2_WIDTH, IMAGE_ALT, IMAGE_URL, IMAGE_WIDTH。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;"><tr><td style="width:50%;padding:8px;vertical-align:top;border-right:2px solid #111111;"><p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{IMAGE_URL}}" data-w="{{IMAGE_WIDTH}}" alt="{{IMAGE_ALT}}" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p></td><td style="width:50%;padding:8px;vertical-align:top;"><p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{IMAGE_2_URL}}" data-w="{{IMAGE_2_WIDTH}}" alt="{{IMAGE_2_ALT}}" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p></td></tr></table><p style="margin:8px 0 0;font-size:14px;line-height:1.85;color:#555952;font-weight:400;"><span leaf="">FIG. 03–04 / 左右图片的共同说明</span></p></section>
```

## C30 / 横向滑动图集

- 使用场景：多张截图、作品或分镜。
- 表达目的：用手动滑动保持单张图可读宽度。
- 不适合：称作自动轮播、隐藏必须阅读的结论。
- 内容与检查：2—6 张；明确滑动提示；非 SVG。
- 来源／状态：新增；微信待验收。
- 待绑定字段：IMAGE_2_ALT, IMAGE_2_URL, IMAGE_2_WIDTH, IMAGE_3_ALT, IMAGE_3_URL, IMAGE_3_WIDTH, IMAGE_ALT, IMAGE_URL, IMAGE_WIDTH。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><p style="margin:0 0 8px;font-size:12px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">GALLERY / 左右滑动查看</span></p><section style="overflow-x:auto;overflow-y:hidden;white-space:nowrap;border:2px solid #111111;"><section style="display:inline-block;vertical-align:top;white-space:normal;width:82%;padding:12px;box-sizing:border-box;"><p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{IMAGE_URL}}" data-w="{{IMAGE_WIDTH}}" alt="{{IMAGE_ALT}}" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p><p style="margin:8px 0 0;font-size:14px;line-height:1.85;color:#555952;font-weight:400;"><span leaf="">01 / 图集说明</span></p></section><section style="display:inline-block;vertical-align:top;white-space:normal;width:82%;padding:12px;box-sizing:border-box;"><p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{IMAGE_2_URL}}" data-w="{{IMAGE_2_WIDTH}}" alt="{{IMAGE_2_ALT}}" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p><p style="margin:8px 0 0;font-size:14px;line-height:1.85;color:#555952;font-weight:400;"><span leaf="">02 / 图集说明</span></p></section><section style="display:inline-block;vertical-align:top;white-space:normal;width:82%;padding:12px;box-sizing:border-box;"><p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{IMAGE_3_URL}}" data-w="{{IMAGE_3_WIDTH}}" alt="{{IMAGE_3_ALT}}" style="display:block;max-width:100%;height:auto;margin:0 auto;border:0;"></span></p><p style="margin:8px 0 0;font-size:14px;line-height:1.85;color:#555952;font-weight:400;"><span leaf="">03 / 图集说明</span></p></section></section></section>
```

## C31 / 代码、命令与 Prompt

- 使用场景：技术教程与可复制提示词。
- 表达目的：等宽展示，保留缩进和符号。
- 不适合：把代码半角字符全角化。
- 内容与检查：内容先转义，每行独立；长行允许换行。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#111111;box-sizing:border-box;"><p style="margin:0 0 12px;font-size:12px;line-height:1.85;color:#c6ff00;font-weight:900;"><span leaf="">PYTHON / 代码示例</span></p><p style="margin:0;font-size:14px;line-height:1.85;color:#f7f7f0;font-weight:400;font-family:monospace;white-space:pre-wrap;overflow-wrap:anywhere;"><span leaf="">if count &lt; 3:</span></p><p style="margin:0;font-size:14px;line-height:1.85;color:#f7f7f0;font-weight:400;font-family:monospace;white-space:pre-wrap;overflow-wrap:anywhere;"><span leaf="">    print(&quot;保留四个半角空格&quot;)</span></p></section></section>
```

## C32 / 信息条与行内代码

- 使用场景：时间地点、版本、短标识符。
- 表达目的：紧凑标出辅助信息，保持正文层级。
- 不适合：大段代码放在信息条。
- 内容与检查：短值可换行；代码是字体功能例外。
- 来源／状态：新增；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><section style="padding:16px;border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;"><p style="margin:0 0 12px;font-size:14px;line-height:1.85;color:#123a2c;font-weight:900;"><span leaf="">版本 / GREEN · 01</span></p><p style="margin:0;font-size:14px;line-height:1.85;color:#343832;font-weight:400;"><span leaf="">入口：<span style="font-family:monospace;overflow-wrap:anywhere;">references/components.md</span></span></p></section></section>
```

## I01 / 点击展开抽屉

- 使用场景：正文补充解释。
- 表达目的：由紧凑提示展开详情。
- 不适合：替代必须直接可见的结论。
- 内容与检查：一次展开，无法回缩；viewBox 动画待微信保存与手机验证；文案逐行核对。
- 来源／状态：原版动效与视觉保留，字体／色板统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="background:#f7f7f0;padding:18px 20px;box-sizing:border-box;">
  <svg viewBox="0 0 380 148" style="display:block;width:100%;height:auto;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;" xmlns="http://www.w3.org/2000/svg">
    <animate attributeName="viewBox" from="0 0 380 148" to="0 0 380 410" begin="click" dur="0.4s" fill="freeze" restart="never" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
    <rect x="1" y="1" width="378" height="408" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <rect x="18" y="16" width="96" height="20" fill="#111111" />
    <text x="66" y="30" fill="#c6ff00" font-size="12" font-weight="900" letter-spacing="1" text-anchor="middle">DEEP DIVE / 01</text>
    <text x="362" y="30" fill="#123a2c" font-size="12" font-weight="900" letter-spacing="1" text-anchor="end">TAP TO EXPAND</text>
    <text x="18" y="68" fill="#111111" font-size="19" font-weight="900">折叠态主标题第一行</text>
    <text x="18" y="94" fill="#111111" font-size="19" font-weight="900">折叠态主标题第二行</text>
    <text x="18" y="122" fill="#555952" font-size="14" font-weight="700">点击卡片任意位置，展开深度拆解 ↘</text>
    <rect x="326" y="64" width="36" height="36" fill="#c6ff00" stroke="#111111" stroke-width="2" />
    <text x="344" y="89" fill="#111111" font-size="24" font-weight="900" text-anchor="middle">+</text>
    <rect x="2" y="148" width="376" height="260" fill="#f0f0e9" />
    <line x1="0" y1="148" x2="380" y2="148" stroke="#111111" stroke-width="2" />
    <rect x="18" y="166" width="344" height="94" fill="#123a2c" stroke="#111111" stroke-width="2" />
    <text x="32" y="188" fill="#c6ff00" font-size="12" font-weight="900" letter-spacing="1.2">CORE INSIGHT</text>
    <text x="32" y="214" fill="#f7f7f0" font-size="14" font-weight="900">展开后的核心结论第一行文字</text>
    <text x="32" y="236" fill="#f7f7f0" font-size="14" font-weight="900">展开后的核心结论第二行文字。</text>
    <rect x="18" y="274" width="166" height="114" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <text x="30" y="298" fill="#123a2c" font-size="14" font-weight="900">01 / 左栏标题</text>
    <text x="30" y="324" fill="#343832" font-size="14">左栏说明文字内容</text>
    <rect x="196" y="274" width="166" height="114" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <text x="208" y="298" fill="#111111" font-size="14" font-weight="900">02 / 右栏标题</text>
    <text x="208" y="324" fill="#343832" font-size="14">右栏说明文字内容</text>
    <rect x="0" y="0" width="380" height="410" fill="#f7f7f0" fill-opacity="0" />
  </svg>
</section>
```

## I02 / 点击揭晓答案

- 使用场景：自测或悬念。
- 表达目的：读者点击后看到答案。
- 不适合：替代必须直接可见的结论。
- 内容与检查：一次展开，无法回缩；viewBox 动画待微信保存与手机验证；文案逐行核对。
- 来源／状态：原版动效与视觉保留，字体／色板统一；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="background:#f7f7f0;padding:18px 20px;box-sizing:border-box;">
  <svg viewBox="0 0 380 138" style="display:block;width:100%;height:auto;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;" xmlns="http://www.w3.org/2000/svg">
    <animate attributeName="viewBox" from="0 0 380 138" to="0 0 380 326" begin="click" dur="0.4s" fill="freeze" restart="never" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
    <rect x="1" y="1" width="378" height="324" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <rect x="2" y="2" width="376" height="136" fill="#123a2c" />
    <text x="18" y="27" fill="#c6ff00" font-size="12" font-weight="900" letter-spacing="1.2">SELF-CHECK QUIZ</text>
    <text x="362" y="27" fill="#d2d8d0" font-size="12" font-weight="900" letter-spacing="1" text-anchor="end">TAP TO UNLOCK</text>
    <line x1="18" y1="36" x2="362" y2="36" stroke="#487061" stroke-width="1" />
    <text x="18" y="66" fill="#f7f7f0" font-size="19" font-weight="900">互动提问第一行文字</text>
    <text x="18" y="90" fill="#c6ff00" font-size="19" font-weight="900">互动提问第二行高光文字？</text>
    <rect x="18" y="103" width="144" height="24" fill="#c6ff00" stroke="#111111" stroke-width="1.5" />
    <text x="90" y="119" fill="#111111" font-size="12" font-weight="900" text-anchor="middle">REVEAL ↘ 点击揭晓</text>
    <rect x="2" y="138" width="376" height="186" fill="#f0f0e9" />
    <line x1="0" y1="138" x2="380" y2="138" stroke="#111111" stroke-width="2" />
    <rect x="18" y="154" width="68" height="20" fill="#111111" />
    <text x="52" y="168" fill="#c6ff00" font-size="12" font-weight="900" letter-spacing="1" text-anchor="middle">ANSWER</text>
    <text x="362" y="168" fill="#123a2c" font-size="12" font-weight="900" text-anchor="end">✓ UNLOCKED</text>
    <text x="18" y="198" fill="#111111" font-size="14" font-weight="900">揭晓后的核心答案第一行</text>
    <text x="18" y="220" fill="#111111" font-size="14" font-weight="900">揭晓后的核心答案第二行。</text>
    <line x1="18" y1="292" x2="362" y2="292" stroke="#487061" stroke-width="1" />
    <text x="18" y="310" fill="#123a2c" font-size="12" font-weight="900" letter-spacing="1">GREEN / 01 · SIMPLICITY &amp; PRESENCE</text>
    <rect x="0" y="0" width="380" height="326" fill="#f7f7f0" fill-opacity="0" />
  </svg>
</section>
```

## I03 / 固定画板点击揭晓

- 使用场景：短问答、谜底、转折。
- 表达目的：覆盖层淡出后露出答案。
- 不适合：必须推进后续正文的展开抽屉。
- 内容与检查：固定高宽比，一次揭晓，非持久答题；手机待验收。
- 来源／状态：新增属性级 SMIL；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" style="display:block;width:100%;height:auto;overflow:hidden;">
<rect x="1" y="1" width="378" height="218" fill="#f0f0e9" stroke="#111111" stroke-width="2"/>
<text x="20" y="42" font-size="14" font-weight="900" fill="#123a2c">ANSWER / 核心答案</text>
<text x="20" y="92" font-size="19" font-weight="900" fill="#111111">设计不应吞掉内容。</text>
<text x="20" y="130" font-size="16" fill="#343832">揭晓后仍保持同一画板高度。</text>
<g><rect x="2" y="2" width="376" height="216" fill="#123a2c"/>
<text x="20" y="55" font-size="14" fill="#c6ff00" font-weight="900">TAP TO REVEAL</text>
<text x="20" y="104" font-size="24" fill="#f7f7f0" font-weight="900">点击揭开答案</text>
<text x="20" y="156" font-size="16" fill="#f7f7f0">固定画板 · 一次揭晓</text>
<rect x="0" y="0" width="380" height="220" fill="#f7f7f0" fill-opacity="0"/>
<animate attributeName="opacity" values="1;0" begin="click" dur="0.3s" fill="freeze" restart="never"/>
</g></svg></section>
```

## I04 / 点击描边生长

- 使用场景：已有明确路径的关系说明。
- 表达目的：以线条生长建立阅读方向。
- 不适合：从并列信息编造因果。
- 内容与检查：固定画板，不是可计算流程图；路径要匹配真实关系。
- 来源／状态：新增属性级 SMIL；微信待验收。
- 待绑定字段：无；示例文案直接替换并先转义。

```html
<section style="margin:0;padding:20px;background:#f7f7f0;box-sizing:border-box;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" style="display:block;width:100%;height:auto;overflow:hidden;">
<rect x="1" y="1" width="378" height="198" fill="#123a2c" stroke="#111111" stroke-width="2"/>
<text x="20" y="38" font-size="14" font-weight="900" fill="#c6ff00">LOGIC / 点击生长路线</text>
<g stroke="#c6ff00" stroke-width="4" stroke-dasharray="500" stroke-dashoffset="500">
<path d="M30 105 L130 105 L130 75 L250 75 L250 120 L350 120" fill="none"/>
<rect x="0" y="0" width="380" height="200" fill="#f7f7f0" fill-opacity="0" stroke="none"/>
<animate attributeName="stroke-dashoffset" values="500;0" begin="click" dur="1s" fill="freeze" restart="never"/>
</g>
<text x="20" y="172" font-size="14" fill="#f7f7f0">点击画板空白处，查看关系路径。</text>
</svg></section>
```

## 按文章选择

教程：C01/C16 → C03/C14/C13 → C20/C08/C30/C31 → C09/C11/C12。观点文：C01/C02 → C03/C13/C18 → C05/C06/C26 → C09/C11。问答稿：C01/C13 → C22 → C11/C12，可选 I02/I03。组件按真实语义选择，不要求全部使用；互动不承载唯一可见的重要结论。

