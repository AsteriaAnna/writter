# GREEN / 01 — 微信公众号标准化组件代码库 (`references/components.md`)

所有组件均采用 **100% 行内样式（Inline CSS）**、**百分比列宽表格**及 **`0px` 锐利直角**。

---

## 第一部分：12 个基础视觉组件

### 01 / 顶部刊号条 (`Issue Header`)
```html
<section style="background:#f7f7f0;border-bottom:3px solid #111111;box-sizing:border-box;">
  <section style="height:6px;background:#c6ff00;"></section>
  <section style="padding:10px 20px;box-sizing:border-box;">
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0;">
      <tr>
        <td style="width:60%;padding:0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#111111;text-align:left;vertical-align:middle;">
          THE CREATIVE ISSUE.
        </td>
        <td style="width:40%;padding:0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#123a2c;text-align:right;vertical-align:middle;">
          VOL. 001 / 2026
        </td>
      </tr>
    </table>
  </section>
</section>
```

### 02 / 紧凑主视觉封面 (`Hero Cover`)
```html
<section style="background:#123a2c;color:#f7f7f0;padding:20px 20px 18px;border-bottom:3px solid #111111;box-sizing:border-box;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-bottom:1px solid #487061;margin:0;">
    <tr>
      <td style="width:75%;padding:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#d2d8d0;text-align:left;">
        INDEPENDENT THINKING
      </td>
      <td style="width:25%;padding:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#c6ff00;text-align:right;">
        ● 01
      </td>
    </tr>
  </table>
  <p style="font-size:52px;line-height:1.06;letter-spacing:-2px;margin:14px 0 14px;font-weight:900;color:#f7f7f0;">
    打破<br><span style="color:#c6ff00;">常规.</span>
  </p>
  <section style="background:#f7f7f0;color:#111111;padding:11px 14px;border:2px solid #111111;margin-bottom:14px;box-sizing:border-box;">
    <p style="font-size:19px;line-height:1.4;letter-spacing:-0.5px;margin:0;font-weight:900;color:#111111;">
      不是为了不同，而是为了<span style="background:#c6ff00;padding:0 4px;">创造</span>。
    </p>
  </section>
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-top:2px solid #c6ff00;margin:0;">
    <tr>
      <td style="width:75%;padding:8px 0 0 0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#f7f7f0;text-align:left;">
        BREAK THE ORDINARY.
      </td>
      <td style="width:25%;padding:8px 0 0 0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1px;color:#c6ff00;text-align:right;">
        READ ↓
      </td>
    </tr>
  </table>
</section>
```

### 03 / 米白纸张正文章节 (`Editorial Section`)
```html
<section style="padding:26px 20px 24px;background:#f7f7f0;box-sizing:border-box;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-bottom:2px solid #111111;margin:0 0 18px;">
    <tr>
      <td style="width:72%;padding:0 0 10px 0;font-family:Arial,sans-serif;font-size:11px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#123a2c;text-align:left;">
        01 / INTRODUCTION
      </td>
      <td style="width:28%;padding:0 0 10px 0;font-family:Arial,sans-serif;font-size:10px;font-weight:800;line-height:1.3;letter-spacing:1px;color:#6c7369;text-align:right;">
        SECTION 01
      </td>
    </tr>
  </table>
  <p style="font-size:24px;line-height:1.4;letter-spacing:-0.8px;margin:0 0 18px;font-weight:900;color:#111111;">
    当所有人都在<br>寻找<span style="background:#c6ff00;padding:1px 5px;color:#111111;">标准答案</span>。
  </p>
  <p style="font-size:15px;line-height:2;color:#343832;text-align:justify;margin:0 0 14px;">
    正文段落内容，采用 15px 字号与 2.0 倍行高保障长文阅读舒适度。
  </p>
  <p style="font-size:15px;line-height:2;color:#343832;text-align:justify;margin:0;">
    重点强调短语使用 <span style="font-weight:900;color:#111111;border-bottom:2px solid #c6ff00;">2px 荧光底边框</span> 标记。
  </p>
</section>
```

### 04 / 克制型引言海报模块 (`Restrained Editor's Note`)
```html
<section style="background:#f0f0e9;padding:24px 20px;border-top:3px solid #111111;border-bottom:3px solid #111111;box-sizing:border-box;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0 0 14px;">
    <tr>
      <td style="width:65%;padding:0;text-align:left;">
        <span style="display:inline-block;background:#111111;color:#c6ff00;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.2;letter-spacing:1.2px;padding:4px 8px;">
          EDITOR'S NOTE
        </span>
      </td>
      <td style="width:35%;padding:0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#123a2c;text-align:right;">
        QUOTE / 01
      </td>
    </tr>
  </table>
  <section style="border-left:6px solid #123a2c;padding-left:14px;box-sizing:border-box;">
    <p style="font-size:22px;font-weight:900;letter-spacing:-0.5px;line-height:1.45;margin:0;color:#111111;">
      “好设计，不只是让人看见。<br>
      <span style="background:#111111;color:#c6ff00;padding:2px 6px;">更要让人记住。</span>”
    </p>
  </section>
  <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.4;margin:16px 0 0;letter-spacing:1.2px;color:#555952;">
    ━━━ MAKE AN IMPACT
  </p>
</section>
```

### 05 / 双栏对比卡片 (`2-Column Table Grid`)
```html
<table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;margin:0;">
  <tr>
    <td style="width:50%;background:#123a2c;color:#f7f7f0;padding:16px 12px;vertical-align:top;border-right:2px solid #111111;">
      <p style="font-family:Arial,sans-serif;font-size:32px;font-weight:900;line-height:1.1;color:#c6ff00;margin:0;">01</p>
      <p style="font-size:16px;font-weight:900;line-height:1.35;margin:10px 0 6px;color:#ffffff;">打破框架</p>
      <p style="font-size:12px;line-height:1.75;margin:0;color:#e2e8e4;">从习惯的视觉秩序中寻找新的表达。</p>
    </td>
    <td style="width:50%;background:#f0f0e9;color:#111111;padding:16px 12px;vertical-align:top;">
      <p style="font-family:Arial,sans-serif;font-size:32px;font-weight:900;line-height:1.1;color:#111111;margin:0;">02</p>
      <p style="font-size:16px;font-weight:900;line-height:1.35;margin:10px 0 6px;color:#111111;">建立重点</p>
      <p style="font-size:12px;line-height:1.75;margin:0;color:#343832;">让读者第一眼就抓住文章的核心。</p>
    </td>
  </tr>
</table>
```

### 06 / 多行结构化对比矩阵 (`Comparison Matrix Table`)
```html
<table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;margin:0 0 20px;">
  <tr>
    <td style="width:50%;background:#111111;color:#f7f7f0;padding:11px 10px;vertical-align:middle;border-right:2px solid #111111;border-bottom:2px solid #111111;">
      <p style="font-family:Arial,sans-serif;font-size:9px;font-weight:900;line-height:1.3;color:#8da99a;letter-spacing:1px;margin:0 0 3px;">01 / DIMENSION A</p>
      <p style="font-size:13px;font-weight:900;line-height:1.35;color:#f7f7f0;margin:0;">对比维度 A</p>
    </td>
    <td style="width:50%;background:#123a2c;color:#f7f7f0;padding:11px 10px;vertical-align:middle;border-bottom:2px solid #111111;">
      <p style="font-family:Arial,sans-serif;font-size:9px;font-weight:900;line-height:1.3;color:#c6ff00;letter-spacing:1px;margin:0 0 3px;">02 / DIMENSION B</p>
      <p style="font-size:13px;font-weight:900;line-height:1.35;color:#f7f7f0;margin:0;">对比维度 B</p>
    </td>
  </tr>
  <tr>
    <td style="width:50%;background:#f0f0e9;padding:10px 10px;vertical-align:top;border-right:2px solid #111111;">
      <p style="font-size:12px;font-weight:900;line-height:1.4;color:#111111;margin:0 0 2px;">要点标题 A</p>
      <p style="font-size:12px;line-height:1.6;color:#343832;margin:0;">对应说明文字</p>
    </td>
    <td style="width:50%;background:#f7f7f0;padding:10px 10px;vertical-align:top;">
      <p style="font-size:12px;font-weight:900;line-height:1.4;color:#123a2c;margin:0 0 2px;">要点标题 B</p>
      <p style="font-size:12px;line-height:1.6;color:#343832;margin:0;">对应说明文字</p>
    </td>
  </tr>
</table>
```

### 07 / 序号要点列表卡片 (`Numbered List Grid`)
```html
<table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid #111111;margin:0;">
  <tr>
    <td style="width:14%;background:#111111;color:#c6ff00;text-align:center;vertical-align:middle;font-family:Arial,sans-serif;font-size:15px;font-weight:900;border-bottom:2px solid #111111;border-right:2px solid #111111;padding:12px 0;">01</td>
    <td style="width:86%;background:#f7f7f0;padding:12px 12px;border-bottom:2px solid #111111;vertical-align:top;">
      <p style="margin:0 0 3px 0;font-size:14px;font-weight:900;line-height:1.35;color:#111111;">要点标题一</p>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#343832;">使用百分比宽度锁死左侧编号列，杜绝微信 ul/ol 缩进错位。</p>
    </td>
  </tr>
  <tr>
    <td style="width:14%;background:#123a2c;color:#c6ff00;text-align:center;vertical-align:middle;font-family:Arial,sans-serif;font-size:15px;font-weight:900;border-right:2px solid #111111;padding:12px 0;">02</td>
    <td style="width:86%;background:#f0f0e9;padding:12px 12px;vertical-align:top;">
      <p style="margin:0 0 3px 0;font-size:14px;font-weight:900;line-height:1.35;color:#111111;">要点标题二</p>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#343832;">双色交替行提升长列表视觉扫描效率。</p>
    </td>
  </tr>
</table>
```

### 08 / 图片海报画框与图注 (`Framed Visual & Caption`)
```html
<section style="padding:6px 20px 24px;background:#f7f7f0;box-sizing:border-box;">
  <section style="border:2px solid #111111;background:#f0f0e9;box-sizing:border-box;">
    <img data-w="800" src="https://placehold.co/800x440/123a2c/c6ff00?text=FIG.01" alt="图注说明" style="display:block;width:100% !important;height:auto !important;margin:0;border:none;">
    <section style="border-top:2px solid #111111;padding:10px 12px;background:#f0f0e9;box-sizing:border-box;">
      <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0;">
        <tr>
          <td style="width:22%;padding:0;vertical-align:middle;">
            <span style="display:inline-block;background:#111111;color:#c6ff00;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.2;letter-spacing:1px;padding:3px 6px;">FIG. 01</span>
          </td>
          <td style="width:78%;padding:0;font-size:12px;line-height:1.5;color:#343832;font-weight:700;vertical-align:middle;">
            图片索引说明文字（必须保留 data-w 属性）。
          </td>
        </tr>
      </table>
    </section>
  </section>
</section>
```

### 09 / 核心隐喻与总结提示框 (`Editorial Callout`)
```html
<section style="background:#f0f0e9;border:2px solid #111111;border-left:6px solid #123a2c;padding:15px 14px;box-sizing:border-box;">
  <p style="margin:0 0 8px;line-height:1.2;">
    <span style="display:inline-block;background:#111111;color:#c6ff00;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.2;letter-spacing:1.2px;padding:3px 7px;">KEY TAKEAWAY</span>
  </p>
  <p style="font-size:15px;font-weight:900;line-height:1.65;color:#111111;margin:0;">
    核心总结结论句，关键短语采用 <span style="background:#c6ff00;padding:1px 4px;">局部荧光高光</span> 聚焦。
  </p>
</section>
```

### 10 / 暗黑重磅反转章节 (`Dark Inverted Chapter`)
```html
<section style="background:#111111;color:#f7f7f0;padding:28px 20px;border-bottom:8px solid #c6ff00;box-sizing:border-box;">
  <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:900;line-height:1.3;color:#c6ff00;letter-spacing:1.2px;margin:0 0 14px;">
    02 / DARK CHAPTER
  </p>
  <p style="font-size:26px;font-weight:900;line-height:1.35;letter-spacing:-0.8px;margin:0 0 18px;color:#f7f7f0;">
    重磅转折章节标题<br><span style="color:#c6ff00;">核心破题点.</span>
  </p>
  <p style="font-size:15px;line-height:2;color:#d2d8d0;text-align:justify;margin:0;">
    暗色背景下的提亮正文字色（#d2d8d0），保障移动端阅读对比度。
  </p>
</section>
```

### 11 / 参考资料卡片 (`References Block`)
```html
<section style="margin:0;padding:14px 15px;background:#f0f0e9;border:2px solid #111111;box-sizing:border-box;">
  <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1px;color:#123a2c;">REFERENCES &amp; NOTES</p>
  <p style="margin:0 0 6px 0;font-size:12px;line-height:1.65;color:#343832;word-break:break-all;">[01] 纯文本参考来源标题 — example.com/article（非认证号禁止普通外链跳转，统一排为可复制纯文本）</p>
</section>
```

### 12 / 深墨绿首尾闭环结束页与互动引导 (`Colophon & CTA`)
```html
<section style="background:#123a2c;color:#f7f7f0;border-top:3px solid #111111;border-bottom:8px solid #c6ff00;padding:24px 20px 18px;box-sizing:border-box;">
  <p style="font-family:Arial,sans-serif;font-size:34px;font-weight:900;line-height:1.08;letter-spacing:-1.5px;margin:0 0 18px;color:#f7f7f0;">
    LIVE IN<br>THE NOW<span style="color:#c6ff00;">.</span>
  </p>
  <section style="background:#f7f7f0;color:#111111;padding:12px 14px;border:2px solid #111111;margin-bottom:18px;box-sizing:border-box;">
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin:0;">
      <tr>
        <td style="width:58%;padding:0;font-size:12px;font-weight:900;line-height:1.4;color:#111111;text-align:left;vertical-align:middle;">
          如果你有所感悟，希望你能
        </td>
        <td style="width:42%;padding:0;text-align:right;vertical-align:middle;">
          <span style="display:inline-block;background:#c6ff00;color:#111111;font-size:11px;font-weight:900;line-height:1.2;padding:4px 7px;border:1px solid #111111;">
            点赞 · 关注 · 收藏
          </span>
        </td>
      </tr>
    </table>
  </section>
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;border-top:1px solid #487061;margin:0;">
    <tr>
      <td style="width:45%;padding:12px 0 0 0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#b8ccc1;text-align:left;">
        END OF ISSUE / 001
      </td>
      <td style="width:55%;padding:12px 0 0 0;font-family:Arial,sans-serif;font-size:10px;font-weight:900;line-height:1.3;letter-spacing:1.2px;color:#c6ff00;text-align:right;">
        ● FOLLOW FOR MORE
      </td>
    </tr>
  </table>
</section>
```

---

## 第二部分：2 个零 JS 原生 SVG 点击展开交互组件

> **微信注入指引**：在微信公众号后台编辑器任意段落右键 → **检查 (F12)** → 定位到 `<p>` 节点右键 **Edit as HTML** → 粘贴下方代码即可在微信 iOS/Android 客户端实现点击平滑展开。

### 交互组件 A / 深度解析点击展开抽屉 (`SVG SMIL Accordion`)
```html
<section style="background:#f7f7f0;padding:18px 20px;box-sizing:border-box;">
  <svg viewBox="0 0 380 148" style="display:block;width:100%;height:auto;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;" xmlns="http://www.w3.org/2000/svg">
    <animate attributeName="viewBox" from="0 0 380 148" to="0 0 380 410" begin="click" dur="0.4s" fill="freeze" restart="never" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
    <rect x="1" y="1" width="378" height="408" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <rect x="18" y="16" width="96" height="20" fill="#111111" />
    <text x="66" y="30" fill="#c6ff00" font-family="Arial, sans-serif" font-size="10" font-weight="900" letter-spacing="1" text-anchor="middle">DEEP DIVE / 01</text>
    <text x="362" y="30" fill="#123a2c" font-family="Arial, sans-serif" font-size="10" font-weight="900" letter-spacing="1" text-anchor="end">TAP TO EXPAND</text>
    <text x="18" y="68" fill="#111111" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="19" font-weight="900">折叠态主标题第一行</text>
    <text x="18" y="94" fill="#111111" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="19" font-weight="900">折叠态主标题第二行</text>
    <text x="18" y="122" fill="#6c7369" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="12" font-weight="700">点击卡片任意位置，展开深度拆解 ↘</text>
    <rect x="326" y="64" width="36" height="36" fill="#c6ff00" stroke="#111111" stroke-width="2" />
    <text x="344" y="89" fill="#111111" font-family="Arial, sans-serif" font-size="22" font-weight="900" text-anchor="middle">+</text>
    <rect x="2" y="148" width="376" height="260" fill="#f0f0e9" />
    <line x1="0" y1="148" x2="380" y2="148" stroke="#111111" stroke-width="2" />
    <rect x="18" y="166" width="344" height="94" fill="#123a2c" stroke="#111111" stroke-width="2" />
    <text x="32" y="188" fill="#c6ff00" font-family="Arial, sans-serif" font-size="10" font-weight="900" letter-spacing="1.2">CORE INSIGHT</text>
    <text x="32" y="214" fill="#f7f7f0" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="13" font-weight="800">展开后的核心结论第一行文字</text>
    <text x="32" y="236" fill="#f7f7f0" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="13" font-weight="800">展开后的核心结论第二行文字。</text>
    <rect x="18" y="274" width="166" height="114" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <text x="30" y="298" fill="#123a2c" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="14" font-weight="900">01 / 左栏标题</text>
    <text x="30" y="324" fill="#343832" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="12">左栏说明文字内容</text>
    <rect x="196" y="274" width="166" height="114" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <text x="208" y="298" fill="#111111" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="14" font-weight="900">02 / 右栏标题</text>
    <text x="208" y="324" fill="#343832" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="12">右栏说明文字内容</text>
    <rect x="0" y="0" width="380" height="410" fill="#ffffff" fill-opacity="0" />
  </svg>
</section>
```

### 交互组件 B / 问答盲盒点击揭晓卡片 (`SVG Tap-to-Reveal`)
```html
<section style="background:#f7f7f0;padding:18px 20px;box-sizing:border-box;">
  <svg viewBox="0 0 380 138" style="display:block;width:100%;height:auto;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;" xmlns="http://www.w3.org/2000/svg">
    <animate attributeName="viewBox" from="0 0 380 138" to="0 0 380 326" begin="click" dur="0.4s" fill="freeze" restart="never" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
    <rect x="1" y="1" width="378" height="324" fill="#f7f7f0" stroke="#111111" stroke-width="2" />
    <rect x="2" y="2" width="376" height="136" fill="#123a2c" />
    <text x="18" y="27" fill="#c6ff00" font-family="Arial, sans-serif" font-size="10" font-weight="900" letter-spacing="1.2">SELF-CHECK QUIZ</text>
    <text x="362" y="27" fill="#b8ccc1" font-family="Arial, sans-serif" font-size="10" font-weight="800" letter-spacing="1" text-anchor="end">TAP TO UNLOCK</text>
    <line x1="18" y1="36" x2="362" y2="36" stroke="#487061" stroke-width="1" />
    <text x="18" y="66" fill="#f7f7f0" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="17" font-weight="900">互动提问第一行文字</text>
    <text x="18" y="90" fill="#c6ff00" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="17" font-weight="900">互动提问第二行高光文字？</text>
    <rect x="18" y="103" width="144" height="24" fill="#c6ff00" stroke="#111111" stroke-width="1.5" />
    <text x="90" y="119" fill="#111111" font-family="Arial, 'PingFang SC', sans-serif" font-size="11" font-weight="900" text-anchor="middle">REVEAL ↘ 点击揭晓</text>
    <rect x="2" y="138" width="376" height="186" fill="#f0f0e9" />
    <line x1="0" y1="138" x2="380" y2="138" stroke="#111111" stroke-width="2" />
    <rect x="18" y="154" width="68" height="20" fill="#111111" />
    <text x="52" y="168" fill="#c6ff00" font-family="Arial, sans-serif" font-size="10" font-weight="900" letter-spacing="1" text-anchor="middle">ANSWER</text>
    <text x="362" y="168" fill="#123a2c" font-family="Arial, sans-serif" font-size="10" font-weight="900" text-anchor="end">✓ UNLOCKED</text>
    <text x="18" y="198" fill="#111111" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="14" font-weight="900">揭晓后的核心答案第一行</text>
    <text x="18" y="220" fill="#111111" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif" font-size="14" font-weight="900">揭晓后的核心答案第二行。</text>
    <line x1="18" y1="292" x2="362" y2="292" stroke="#c9ccc3" stroke-width="1" />
    <text x="18" y="310" fill="#123a2c" font-family="Arial, sans-serif" font-size="10" font-weight="900" letter-spacing="1">GREEN / 01 · SIMPLICITY &amp; PRESENCE</text>
    <rect x="0" y="0" width="380" height="326" fill="#ffffff" fill-opacity="0" />
  </svg>
</section>
```