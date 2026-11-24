# 公众号排版工作台与 Skill 调研汇报

调研日期：2026-11-24。对象：GREEN / 01 组件库。范围：公开产品文档、README、Skill 规则、组件目录与相关导出协议；没有安装或实测这些产品，没有进行微信客户端验收。以下“支持某效果”表示该项目文档提供了对应入口或实现，不等于我已验证它在你的账号和手机上可用。

## 1. 已执行的恢复

已将 `AsteriaAnna/writter` 恢复到最初上传的版本，恢复提交为 `0bf63f5228529cd1e5d10ce8b5c6b9ec119ead72`。

- `references/components.md` 与原始提交 `e1e1a85c1594218a9fc17aaf23ade035f956667e` 中的文件逐字一致。
- 原来的 12 个静态组件、图片画框与图注、双栏对比、矩阵，以及 2 个 SVG 点击动效全部恢复。
- 撤回后续简化版预览、生成器、检查器和模拟测试文件；这些仍保留在 Git 历史中。
- 本轮只追加这份研究汇报，不修改原组件实现。恢复原版不代表兼容问题已经解决。

## 2. 结论

成熟方案通常同时具备：基础文字组件、承载信息关系的复合组件、图片处理、交互特效，以及独立的微信导出处理。某些产品专注其中几层，并非每家都有全部能力。

不能从“公众号环境有限制”直接推出“必须单栏、不能有图片画框、不能做动效”。常见做法是保留视觉目标，为每类组件选择可保存的实现，并分别验收。工作台中的网页效果、剪贴板输出、微信保存结果和手机显示，是不同阶段。

开源 Skill 之间也存在规则冲突。其 README 中的“禁止”“必须”可能是该工具为了稳定交付而设的约定，不一定是微信平台的完整白名单。

## 3. 工作台与 Skill 对比

| 对象与入口 | 文档中能确认的能力 | 对本项目最有用的部分 | 证据边界 |
|---|---|---|---|
| [135 编辑器](https://www.135editor.com/)；[样式分类](https://www.135editor.com/yangshi/dianji.html) | 标题、正文、分栏、表格、轴线、图文、GIF、多图轮播、引导与 SVG 素材；保存同步与微信预览 | 寻找基础组件类别和交互视觉参考 | 商业素材不代表可直接复制源码；部分特效标注仅移动端触发 |
| [秀米](https://xiumi.us/) | 官网区分图文排版、H5、图片设计；其官方账号教程介绍 SVG 图集与滚动效果 | 图文编排与图片叙事参考 | 官网动态页面未能完整读取；图文能力不能与其 H5 能力混用推断。图集依据其[官方账号教程](https://www.weibo.com/ttarticle/p/show?id=2309405014785950613963) |
| [96 编辑器帮助](https://bj.96weixin.com/help/100193.html) | 帮助目录覆盖表格、图片、预览、复制、同步、SVG；本文明确介绍点击展开＋回缩及自定义触发区 | 学习交互组件的参数和可编辑边界 | 教程给出的制作／导出流程不是对所有微信版本的兼容保证 |
| [WeChat Visual Director](https://github.com/zhouke0929/wechat-visual-director)；[在线样本册](https://zhouke0929.github.io/wechat-visual-director/#themes) | Skill＋本地工作台；正文编辑、主题切换、图片与封面审核、双端预览、复制、交付包与草稿接口 | 最接近你之前参考的工作台；将基础样式、语义组件、主题变体和验收状态分开管理 | 以本次读取的 README 和源码为准，在线样本册本次未直接打开；仓库的“已验证”是作者记录，不能移植为我们的验证结论 |
| [doocs/md](https://github.com/doocs/md)；[在线编辑器](https://md.doocs.org/) | Markdown、主题与自定义样式、代码高亮、图片上传、公式和图表、导出 | 看微信复制之前如何处理 CSS、图片、SVG 与结构 | 其 SVG Skill 包含项目经验，不等于微信官方完整规范 |
| [Markdown Nice](https://github.com/mdnice/markdown-nice)；[语法样稿](https://github.com/mdnice/markdown-nice/blob/master/src/template/content.md) | 标题、列表、引用、表格、图片、脚注、代码、公式、目录、注音与横向图集 | 一篇样稿覆盖常见输入元素，方便设计完整组件库 | 文档含历史平台经验，不能把其中的账号链接权限、图片上传和列表层数表述当作当前通用事实 |
| [gzh-design-skill](https://github.com/isjiamu/gzh-design-skill)；[通用组件](https://github.com/isjiamu/gzh-design-skill/blob/main/references/common-components.md) | 主题组件＋通用增量库；代码、图片/GIF、小标题和提示；校验与富文本复制预览 | 模板、内容映射、组合配方、正文与预览外壳分离 | 全量 leaf、禁 div 等是它的保守策略；正文强调频次属于审美规则 |
| [wp-x/wechat-layout](https://github.com/wp-x/wechat-layout)；[规则文件](https://github.com/wp-x/wechat-layout/blob/master/SKILL.md) | 配色、设计风格、文章预设分开组合；对比双栏、时间线、FAQ、数字亮点等组件 | 直接提供新粗野主义、瑞士国际主义与杂志风参考，说明双栏并非必须放弃 | 对字体、图片 class、float 的要求与其它项目存在差异，需要逐项判断 |
| [wechat-animating](https://github.com/JamieJustTang/wechat-animating) | 面向 AI 的 SVG 长卷工具；SMIL、分镜时序、点击交互和本地检查 | 为动效寻找专门实现，避免用普通网页 JS 做公众号交互 | 作者宣称白名单兼容，本轮未执行它的样例或发布到微信 |

gzh-design 的多个 fork 不作为多个独立兼容性证据；项目数量不能代替实际验收。

## 4. 组件通常包括什么

以下是对上述资料的综合归类，不是微信要求的强制清单；“常见”也不表示每个项目都有。

| 组件族 | 常见组件与变体 | GREEN / 01 原版情况 | 可补方向，暂不实施 |
|---|---|---|---|
| 文章与栏目开场 | 栏目标、刊号、导读、摘要、看点目录、正文大标题 | 刊号、主视觉封面齐全 | 导读、看点目录 |
| 标题层级 | 一级章节、二级小节、三级短标题、编号标题、主副标题 | 正文章节标题较完整 | 独立小节与短标题，避免每段都重卡片 |
| 正文与行内 | 普通段落、加粗、高亮、下划线、删除线、行内代码 | 正文与高亮在章节中 | 独立正文、规范化行内标记 |
| 引用与提示 | 原话＋署名、证据引用、编者按、注意、旁注、金句、总结 | 编者按、总结、暗色章节 | 普通引用与证据出处，不将感受句伪装成证据 |
| 列表与流程 | 有序／无序项、步骤、检查清单、时间线、逻辑路径 | 编号列表 | 轻量列表、步骤、时间线、行动清单 |
| 比较与数字 | 双栏对比、前后变化、真实数据表、多行矩阵、数据亮点 | 双栏和矩阵已具备 | 前后变化、数字亮点；保留原双栏外观 |
| 图片与图文 | 普通图、满宽图、框图＋编号＋图注、上下图文、左右图文、双／多图、GIF、横向图集 | 画框＋编号＋图注已具备 | 普通图与满宽图区分、左右图文、多图／GIF，不删除画框 |
| 教程与技术 | 行内代码、代码块、命令、Prompt、公式、流程图 | 暂缺 | 优先代码／Prompt；公式、图表按实际写作需求添加 |
| 问答与互动 | 静态 FAQ、点击揭晓、展开／回缩、点击换图、滑动展示 | 两个点击组件已具备 | 为原效果找可用实现，再补静态 FAQ 与滑动图集 |
| 文末与元信息 | 参考资料、脚注、作者介绍、二维码、相关文章、结束标识 | 参考资料与结束页 | 多条来源、相关文章、可选作者／二维码 |

另有微信原生媒体或业务组件，例如音频、视频、投票、小程序、名片。它们应通过后台或获支持的组件接入，不是假画一个 HTML 按钮就等价具备能力。

Visual Director 的组件目录给出 12 类语义：问题钩子、编号观点、证据强调、前后时间线、逻辑路径、概念解释、案例卡、警示、行动清单、FAQ、比较、章节总结。它们可与标题、正文、图文等基础样式共存；这比“全部内容都变成装饰卡”更值得参考。[组件目录](https://github.com/zhouke0929/wechat-visual-director/blob/main/apps/api/src/visual_director/component_catalog.py)

## 5. 代码要求与禁忌：分清来源层级

### 5.1 直接按公众号交付环境处理

| 项目 | 推荐处理 | 不应作出的推断 |
|---|---|---|
| 正文脚本 | 不依赖 script、onclick、网页应用逻辑实现发布后功能；本地复制工具放在正文外 | 本地预览页有 JS 就一定不合格；应看复制出的正文 |
| CSS | 最终 HTML 将必要样式写到节点内；不依赖外部样式、class 选择器或 CSS 变量保持外观 | 开发阶段不能用主题令牌或样式表；可在导出时展开 |
| 复制与 API | 富文本剪贴板、源码导入插件、草稿 API 是不同通道，分别处理 HTML 和图片 | 某一种通道通过就代表其它通道通过 |
| 图片 | 保证实际素材、传输方式与保存结果；图注与图像分开，保留文字可编辑性 | src 写上 HTTPS 就代表已完成微信图片转存；浏览器能加载不代表发布可用 |
| 真实交互 | 按公众号 SVG 约束实现，并经保存、重开与手机预览验证 | 普通网页点击能动就能直接发布 |

参考：[doocs/md](https://github.com/doocs/md)、[gzh-design 工作流](https://github.com/isjiamu/gzh-design-skill/blob/main/SKILL.md)、[Visual Director 交付规则](https://github.com/zhouke0929/wechat-visual-director/blob/main/skills/wechat-visual-director/references/delivery.md)。这些是实际导出方案的工程共性，不是我已经在本仓实现的能力。

### 5.2 结构规范资料明确关注的风险

本次官方[插件开发规范页面](https://developers.weixin.qq.com/doc/service/guide/product/plugin_spec.html)仍无法直接读取；以下根据 [wechatjs 结构规范文件](https://github.com/wechatjs/verify-article-structure-spec/blob/main/verify_article_structure.md)核对，保留来源边界：

- 多行文字行高过小、固定尺寸导致裁剪或横向溢出；代码长行需能换行或滚动查看。
- span[leaf] 不可包块级结构；深层重复嵌套需检查，不能机械理解为达到某层就全被删。
- 建议跟随默认字体，正确组织文字和背景；深色模式需要单独检查。
- data-w 建议填写图片原始宽度，供加载失败时的宽度检测兜底，并非强制所有图显示同一宽度。
- SVG 动画仅配置 touchstart 而没有 click 会有 PC 触发风险。
- 用透明真实 img 配合 SVG 背景覆盖，会影响后台图片编辑；这不等于禁止所有透明触发区。

这些风险需要针对组件检查，不能解释成“表格、SVG、图片画框全部禁用”。

### 5.3 不同 Skill 的矛盾必须保留

| 议题 | 资料差异 | 对我们应怎样理解 |
|---|---|---|
| div 与 section | gzh-design 禁 div；结构规范资料有 div 示例 | section 可作为项目统一约定，不宣称 div 一律导致手机空白 |
| leaf | gzh-design 要所有文字包 leaf；结构规范重点限定 leaf 内部结构 | 可采用保守包裹，但不说缺 leaf 已被证明是全部失败根因 |
| 表格布局 | Visual Director 输入协议不允许拿表格模拟布局；wp-x 的双栏规则明确允许 table 或 inline-block | 这是不同系统选型，不是唯一正确答案；原双栏逐项验证，不直接删除 |
| font-family | 结构规范不建议自定义；一些主题 Skill 明确写字体栈 | 默认继承更稳妥；特殊字体需验证，不拿主题模板冒充官方规范 |
| class | 有 Skill 禁所有 class，另一份要求图片带 rich_pages/wxw-img | 微信保留 class、用户自定义 class、依赖 class 的 CSS 是不同问题；手填保留 class 不等于获得官方组件能力 |
| pre 与代码 | 有 Skill 避开 pre；规范允许正确处理超长代码的 pre | 选择换行或横滚，保留真实缩进与可复制代码，不为视觉改成全角空格 |
| transform | 普通 HTML 排版中多个 Skill 避用；SVG Skill 使用 animateTransform | HTML 定位布局与 SVG 属性动画不是同一机制 |
| 标题、强调与字号 | 各项目规定不同的字号、标记频次、作者卡与结尾 | 都属于主题／编辑偏好，不是微信必须如此 |

依据：[gzh-design](https://github.com/isjiamu/gzh-design-skill/blob/main/SKILL.md)、[wp-x Skill](https://github.com/wp-x/wechat-layout/blob/master/SKILL.md)、[Visual Director 输入协议](https://github.com/zhouke0929/wechat-visual-director/blob/main/skills/wechat-visual-director/references/article-protocol.md)、[doocs SVG Skill](https://github.com/doocs/md/blob/main/.agents/skills/wechat-svg/SKILL.md)。

### 5.4 SVG 的特别检查

doocs 的 SVG Skill 列出 height、width、opacity、fill、路径描边及位移／缩放／旋转等动画属性，并提醒避免依赖 id、defs、marker 引用和 foreignObject。其已验证模式包含 begin="click"、fill="freeze"、restart="never"；这些固定参数服务该项目的一次性点击场景，不是所有交互必须永不重启。

本库两个动效使用 animate attributeName="viewBox"。该属性未出现在这份项目白名单中，因此是需要优先验证的风险，而不是已经证明微信永久禁止 viewBox。初始 viewBox 与“动画改变 viewBox”也不能混为一谈。可以研究改用高度／位移／可见性等方案保持外观，但本轮不修改。

SVG 的透明点击区域、动画父子层级、文本换行、视口占位和末尾内容位置，都要用实际保存后的代码检查。纯 SVG 内不要硬塞 HTML leaf 通过一个只理解普通 HTML 的检查器。

## 6. 值得参考的有趣效果

| 效果 | 适用内容 | 可以查看的原始链接 | 边界与制作要求 |
|---|---|---|---|
| 点击揭晓答案／局部内容 | 自测、观点转折、悬念 | [135 SVG 布局教程](https://www.135editor.com/essences/9387.html) | 文案多行需要对应布局；不等于记录用户答案 |
| 展开并回缩 | 术语解释、补充材料、长问答 | [96 自定义触发区](https://bj.96weixin.com/help/100193.html) | 触发区域、展开与回缩状态均需验收；原组件目前只做一次展开 |
| 点击换图／切换画面 | 前后对比、两种观点、步骤切换 | [135 点击素材](https://www.135editor.com/yangshi/dianji.html) | 有的模板仅手机触发；换图后要重新检查尺寸与热区 |
| 左右滑动图集 | 截图教程、作品集、多图叙事 | [Markdown Nice 图集语法](https://github.com/mdnice/markdown-nice/blob/master/src/template/content.md)；[135 多图滑动](https://static.135editor.com/yangshi/duotuhuadong.html) | 横向滚动、自动轮播、点击切图不是同一能力，不能共用一句“支持轮播” |
| 滑动后侧向展开 | 长图故事、分段解密、活动介绍 | [96 上下滑动＋侧滑全文展开](https://bj.96weixin.com/help/100143.html) | 滑动容器与整篇文章滚动要区分，不要破坏后续正文位置 |
| 多方向擦除／封面抽签式揭晓 | 轻互动、主题开场 | [135 点击效果库](https://www.135editor.com/yangshi/dianji.html) | 教程示例是视觉效果；不能未经验证宣称真实随机或保存结果 |
| 描边生长、打字、图形呼吸与内容滑入 | 概念讲解、线路关系、编辑开场 | [wechat-animating](https://github.com/JamieJustTang/wechat-animating) | 用 SMIL 与时序组织；需检查字体、文本可读性、动画时长和触发方式 |
| 图片滚动叙事 | 作品展示、产品细节 | [秀米官方账号图集教程](https://www.weibo.com/ttarticle/p/show?id=2309405014785950613963) | 依其图文 SVG 图集流程理解，不能套用 H5 的任意网页交互 |

其中对你的文章更值得先研究的是：保留现有“展开＋揭晓”，再看“可回缩解释”和“横向截图图集”。大型长卷属于可选创意，不应成为每篇长文的前提。这是我的取舍建议，尚未实施。

## 7. 对现有组件的具体判断

| 原组件 | 调研后的处理建议 |
|---|---|
| 顶部刊号、主视觉、暗色章节、结束页 | 保留视觉；之后检查字体、窄屏断行、深色模式与组件间距 |
| 双栏与对比矩阵 | 保留双栏目标；按长短内容检查列宽、字号和换行，必要时提供可选单栏变体，不替换掉原件 |
| 编号列表 | 保留；可另补普通列表与步骤组件 |
| 图片画框、编号和图注 | 保留组合；补真实图片处理、自然尺寸／满宽两种规则、图注可选和正确 data-w |
| 总结、引用、参考资料 | 保留；补来源与多段内容规则，撤回没有依据的外链权限断言 |
| 展开抽屉与答案揭晓 | 保留目标和原稿；优先检查 viewBox 动画路径与保存结果，不靠删除动效宣称兼容修复 |

如果之后继续工作，应先保留参考外观截图和组件编号，再对每个组件记录“网页可见／复制输出／微信保存／手机端／深色模式”的独立结果。某一主题、某一组件通过，不能扩展成全部通过。Visual Director 的[兼容性验收矩阵](https://github.com/zhouke0929/wechat-visual-director/blob/main/samples/wechat-component-compatibility-acceptance-matrix-20260831.md)值得借鉴的是这种状态记录方式；其中作者的通过记录不是我们的测试。

## 8. 优先阅读链接

1. 想看接近你目标的成品与工作台：[Visual Director README](https://github.com/zhouke0929/wechat-visual-director) → [成稿与主题样本](https://zhouke0929.github.io/wechat-visual-director/#cases)。
2. 想看基础组件怎么补：[gzh-design 通用组件](https://github.com/isjiamu/gzh-design-skill/blob/main/references/common-components.md) → [wp-x 组件模板](https://github.com/wp-x/wechat-layout/blob/master/references/components.md)。
3. 想看有趣效果：[135 SVG 教程](https://www.135editor.com/essences/9387.html) → [96 展开回缩](https://bj.96weixin.com/help/100193.html) → [SVG 长卷套件](https://github.com/JamieJustTang/wechat-animating)。
4. 想看代码边界：[结构规范文件](https://github.com/wechatjs/verify-article-structure-spec/blob/main/verify_article_structure.md) → [doocs SVG 规则](https://github.com/doocs/md/blob/main/.agents/skills/wechat-svg/SKILL.md)。

样式可借鉴，不代表商业模板可直接复用；真正复制代码或引入库前再核对对应许可证。当前没有安装产品、导入商业素材、开通付费功能或改动微信账号。
