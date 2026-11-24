#!/usr/bin/env python3
"""Original theme + additive components; emits catalog, documentation and gallery."""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
import base64
import json
import re
import struct
import zlib

ROOT = Path(__file__).resolve().parents[1]
PAPER, SOFT, GREEN, LIME, INK, TEXT, MUTED = '#f7f7f0', '#f0f0e9', '#123a2c', '#c6ff00', '#111111', '#343832', '#555952'


def p(text, size=16, color=TEXT, weight=400, margin='0 0 12px', extra=''):
    return f'<p style="margin:{margin};font-size:{size}px;line-height:1.85;color:{color};font-weight:{weight};{extra}"><span leaf="">{text}</span></p>'


def label(text):
    return p(text, 12, GREEN, 900, '0 0 8px')


def section(content, bg=PAPER, extra='', padding='20px'):
    return f'<section style="margin:0;padding:{padding};background:{bg};box-sizing:border-box;{extra}">{content}</section>'


def box(content, bg=SOFT):
    return f'<section style="padding:16px;border:2px solid {INK};background:{bg};box-sizing:border-box;">{content}</section>'


def image(slot=1, full=False):
    prefix = 'IMAGE' if slot == 1 else f'IMAGE_{slot}'
    width = 'width:100%;' if full else ''
    return f'<p style="margin:0;line-height:1.5;"><span leaf=""><img src="{{{{{prefix}_URL}}}}" data-w="{{{{{prefix}_WIDTH}}}}" alt="{{{{{prefix}_ALT}}}}" style="display:block;{width}max-width:100%;height:auto;margin:0 auto;border:0;"></span></p>'


class LeafWriter(HTMLParser):
    """Preserve SVG tag/attribute case; add leaf only to ordinary HTML text."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.svg = [], 0

    def handle_starttag(self, tag, attrs):
        self.out.append(self.get_starttag_text())
        if tag == 'svg': self.svg += 1

    def handle_startendtag(self, tag, attrs):
        self.out.append(self.get_starttag_text())

    def handle_endtag(self, tag):
        self.out.append(f'</{tag}>')
        if tag == 'svg': self.svg -= 1

    def handle_data(self, data):
        text = escape(data, quote=False)
        self.out.append(text if self.svg or not data.strip() else f'<span leaf="">{text}</span>')


def normalize_original(source, svg=False):
    source = re.sub(r'font-family:[^;\"]*;?', '', source)
    source = re.sub(r'\sfont-family="[^"]*"', '', source)
    source = source.replace('font-weight:800', 'font-weight:900').replace('font-weight="800"', 'font-weight="900"')
    sizes = {9:12, 10:12, 11:12, 12:14, 13:14, 15:16, 17:19, 22:24, 26:24, 34:32}
    source = re.sub(r'font-size:(\d+)px', lambda m: f'font-size:{sizes.get(int(m[1]), int(m[1]))}px', source)
    source = re.sub(r'font-size="(\d+)"', lambda m: f'font-size="{sizes.get(int(m[1]), int(m[1]))}"', source)
    colors = {'#ffffff':PAPER, '#6c7369':MUTED, '#e2e8e4':'#d2d8d0', '#b8ccc1':'#d2d8d0', '#8da99a':'#d2d8d0', '#c9ccc3':'#487061'}
    for old, new in colors.items(): source = source.replace(old, new)
    source = source.replace('杜绝微信 ul/ol 缩进错位', '以独立编号列控制列表对齐')
    source = source.replace('非认证号禁止普通外链跳转，统一排为可复制纯文本', '默认列出可复制来源，跳转能力按账号与链接类型核对')
    source = source.replace('必须保留 data-w 属性', '换图时同步更新原始宽度 data-w')
    source = re.sub(r'https://placehold.co/[^"\s]+', '{{IMAGE_URL}}', source)
    source = source.replace('data-w="800"', 'data-w="{{IMAGE_WIDTH}}"').replace('alt="图注说明"', 'alt="{{IMAGE_ALT}}"')
    source = source.replace('width:100% !important;', 'width:100%;max-width:100%;').replace('height:auto !important;', 'height:auto;')
    parser = LeafWriter(); parser.feed(source); parser.close()
    return ''.join(parser.out)


def catalog():
    original = (ROOT/'references/original-v0.1.md').read_text(encoding='utf-8')
    blocks = re.findall(r'```html\n(.*?)\n```', original, re.S)
    assert len(blocks) == 14
    entries = []

    def add(cid, name, scenario, expression, avoid, limits, html, profile='static', origin='新增'):
        slots = sorted(set(re.findall(r'\{\{([A-Z_0-9]+)\}\}', html)))
        entries.append(dict(id=cid, name=name, scenario=scenario, expression=expression, avoid=avoid,
                            limits=limits, html=html, profile=profile, origin=origin, slots=slots,
                            status='微信待验收'))

    meta = [
      ('刊号条','文章开头、固定栏目','建立期刊身份和阅读起点','普通段落重复出现','栏目与期号各一项；窄屏可换行'),
      ('主视觉封面','需要强开场的观点或活动文章','用字号与反差表达主命题','每个章节都用封面','主标题建议两行；公众号标题栏另填'),
      ('正文章节','进入新的一级议题','章节编号、问题与正文的递进','每个短段都升级章节','正文自然增高；章节编号按顺序更新'),
      ('编者按与引言海报','有重要引语或编者判断','将主张与普通段落区分','无来源冒充他人引语','金句尽量两行；长引用用 C18'),
      ('双栏对比卡','同维度两个对象的短比较','左右同级、差异可扫描','大段叙事、多于两个对象','每栏短标题＋短说明；长说明可选 C26'),
      ('结构化对比矩阵','同一组对象多个对应维度','逐行横向核对信息','把无关系段落强凑表格','重复数据行时维护每列意义；超宽用专门横滚'),
      ('编号要点列表','有明确并列顺序的要点','编号与描述形成稳定对齐','没有顺序含义时机械编号','按需复制整行并更新编号；行高随内容变化'),
      ('图片画框与编号图注','正文插图、截图、作品','图像、序号、图注构成可引用整体','删掉真实说明或用假图当完成','绑定 URL、原始宽度和 alt；图注按实际素材改'),
      ('核心总结提示框','一小节结论或关键隐喻','将结论与论证分层','整篇每段都放总结框','结论不增加原文没有的事实'),
      ('暗色反转章节','论证出现重要转折','通过深底和亮色标记转折','每章反复切换暗色','不固定正文高度；检查深色模式'),
      ('参考资料','文章末尾或段落出处','提供可追溯资料','伪造来源或跳转权限','每条来源独立；URL 与中文分别处理换行'),
      ('结尾与互动引导','文章结束','收束栏目与读者互动','中间重复出现关注卡','文字引导不是可点击的微信功能按钮'),
    ]
    for i, (name, scenario, expression, avoid, limits) in enumerate(meta):
        html = normalize_original(blocks[i])
        if i in (4,5,6,8,10): html = section(html)
        add(f'C{i+1:02}',name,scenario,expression,avoid,limits,html,origin='原版视觉延续，格式统一')

    add('C13','轻量正文','连续叙述、解释与补充','承载主信息，给重组件留出呼吸','为凑视觉而把每段卡片化','一个自然段一项，不截断原文',section(p('先把事情讲清楚，再让排版帮助读者识别重点。普通段落保持自然换行，和双栏、图片、引用共同组成文章的阅读节奏。',margin='0')))
    add('C14','二级小节标题','一级章节内的子问题','在同一议题内建立次级层次','把普通强调句升级为标题','建议两行以内，长标题自然换行',section(p('02.1 / 如何判断问题发生在哪一步',19,GREEN,900,'0',f'border-left:6px solid {GREEN};padding-left:12px;')))
    add('C15','三级短标题','小节内的短步骤或术语分组','以轻量标识表达更低层级','与一级章节使用同样粗重卡片','短标题为宜，不强加英文副标题',section(p('▍ 保存后的结果',16,INK,900,'0')))
    add('C16','导读与看点','长文开头、读者需要路线图','先告诉读者会解决哪些问题','假装可点击锚点目录','2—4 项，来自真实内容，不强制一篇只三章',section(box(label('READING MAP / 本篇看点')+p('01　内容结构与表达',margin='0 0 6px')+p('02　图片与交互',margin='0 0 6px')+p('03　保存后的阅读效果',margin='0'))))
    add('C17','行内标记组合','正文确有重点短语、术语或结论','加粗、色底与底边框表达不同强度','整段高亮或按固定频率胡乱标记','每段通常 1—2 个短语，按语义选择',section(p(f'用<strong style="color:{GREEN};font-weight:900;">加粗表达重点</strong>，用<span style="background:{LIME};color:{INK};">荧光底色突出短语</span>，用<span style="border-bottom:2px solid {GREEN};">细线标记关键词</span>。',margin='0')))
    add('C18','普通引用与出处','他人原话、文献摘录、多段引用','区分作者叙述和被引用内容','把个人感想伪装为文献证据','出处有依据才填；长引用可增段',section(box(p('“这是一段用于展示引用布局的示例文字。”')+p('—— 排版示例，非他人真实引语',14,MUTED,400,'0'))))
    add('C19','无序要点','真实并列、无先后关系的信息','平行列出要点','顺序流程却不编号','2—6 项；每项自然增高',section(p('• 内容先有明确结构。')+p('• 组件对应真实表达目的。')+p('• 视觉服务于阅读。',margin='0')))
    add('C20','步骤时间线','有先后顺序的操作、流程','让步骤、动作和说明连续可跟随','仅有日期没有流程却编造因果','复制完整步骤，编号由顺序生成',section(''.join(f'<section style="border-left:3px solid {GREEN};padding:0 0 16px 16px;">'+p(f'{i:02} / {title}',19,GREEN,900,'0 0 6px')+p(body,margin='0')+'</section>' for i,title,body in [(1,'确认内容','先确认标题、事实与来源。'),(2,'安排版式','为并列、步骤和引语选择组件。'),(3,'检查保存','保存后重新打开并核对。')])))
    add('C21','行动检查清单','发布前核对、读者执行动作','把待核对事项明确列出','假装勾选状态会保存','方框为静态符号，不记录用户操作',section(box(label('CHECKLIST / 逐项核对')+p('□ 标题与段落完整')+p('□ 图片和图注对应')+p('□ 保存后重新打开检查',margin='0'))))
    add('C22','静态 FAQ','答疑、访谈、常见问题','问题与回答成组表达','无提问语义的章节标题','一个问答一组，回答可多段',section(box(p('Q / 为什么要看保存后的结果？',19,GREEN,900)+p('A / 因为复制、编辑器保存和手机阅读属于不同阶段，需要分别检查。',margin='0'))))
    add('C23','概念解释卡','首次出现、需要定义的术语','名词、定义、边界清晰分层','普通段落硬套概念标签','一个概念一张卡；不能删掉必要限定',section(box(label('DEFINITION / 概念')+p('富文本复制',24,GREEN,900)+p('传递文字及其 HTML 格式的复制方式。复制源码字符串与复制渲染内容不是同一件事。',margin='0'))))
    add('C24','案例档案卡','有情境、动作和结果的真实案例','让事实结构可扫描','补造结果或把目标写成成果','至少有真实情境；缺结果时写待验证',section(box(label('CASE FILE / 案例结构')+p('情境：一篇教程需要展示操作截图。')+p('动作：使用编号图注与横向图集。')+p('结果：待实际发布与读者反馈验证。',margin='0'))))
    add('C25','数字亮点','需要读者记住且有依据的数据','数字、含义、单位与来源一起出现','无来源的大数字宣传','必须有口径；不能自动凑百分比',section(box(p('03',32,GREEN,900,'0')+p('三个需要分别检查的阶段',19,INK,900)+p('本页示例计数：复制、保存、阅读，不是业务统计。',14,MUTED,400,'0'))))
    add('C26','上下前后对照','说明较长的前后变化或双对象比较','保持比较关系，给长文案完整宽度','静默替换作者选定的双栏','与 C05 并存，按长度选择',section(box(label('BEFORE / 调整前')+p('较长的说明放进窄列后，读者需要反复换行。')+label('AFTER / 调整后')+p('内容较长时可以选择上下对照，同时保留双栏作为短比较的表达。',margin='0'))))
    add('C27','自然尺寸图片与 GIF','普通截图、小图、GIF','小图不强制拉伸，图注保持可编辑','默认所有图都铺满','GIF 用真实素材并单测；无图注时删除说明',section(image()+p('FIG. 02 / 图片说明按真实素材填写',14,MUTED,400,'8px 0 0')))
    add('C28','左图右文','产品、人物或作品的简短介绍','图片与解释相邻，形成同一阅读单元','长履历和多段故事强塞半栏','图片 42%、文字 58%；说明短、窄屏复核',section(f'<table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid {INK};"><tr><td style="width:42%;padding:12px;vertical-align:top;background:{SOFT};">'+image()+'</td><td style="width:58%;padding:12px;vertical-align:top;">'+p('图文并置',19,GREEN,900)+p('图片提供对象，文字说明它与本节内容的关系。',14,TEXT,400,'0')+'</td></tr></table>'))
    add('C29','双图与共享图注','两个界面、前后状态或同组作品','两张图在同一尺度下比较','不相关图片硬凑比较','独立绑定两张素材，不自动裁切证据截图',section(f'<table style="width:100%;border-collapse:collapse;table-layout:fixed;border:2px solid {INK};"><tr><td style="width:50%;padding:8px;vertical-align:top;border-right:2px solid {INK};">'+image()+'</td><td style="width:50%;padding:8px;vertical-align:top;">'+image(2)+'</td></tr></table>'+p('FIG. 03–04 / 左右图片的共同说明',14,MUTED,400,'8px 0 0')))
    add('C30','横向滑动图集','多张截图、作品或分镜','用手动滑动保持单张图可读宽度','称作自动轮播、隐藏必须阅读的结论','2—6 张；明确滑动提示；非 SVG',section(label('GALLERY / 左右滑动查看')+f'<section style="overflow-x:auto;overflow-y:hidden;white-space:nowrap;border:2px solid {INK};">'+''.join(f'<section style="display:inline-block;vertical-align:top;white-space:normal;width:82%;padding:12px;box-sizing:border-box;">'+image(i)+p(f'{i:02} / 图集说明',14,MUTED,400,'8px 0 0')+'</section>' for i in [1,2,3])+'</section>'),profile='scroll')
    add('C31','代码、命令与 Prompt','技术教程与可复制提示词','等宽展示，保留缩进和符号','把代码半角字符全角化','内容先转义，每行独立；长行允许换行',section(box(p('PYTHON / 代码示例',12,LIME,900)+p('if count &lt; 3:',14,PAPER,400,'0','font-family:monospace;white-space:pre-wrap;overflow-wrap:anywhere;')+p('    print(&quot;保留四个半角空格&quot;)',14,PAPER,400,'0','font-family:monospace;white-space:pre-wrap;overflow-wrap:anywhere;'),bg=INK)))
    add('C32','信息条与行内代码','时间地点、版本、短标识符','紧凑标出辅助信息，保持正文层级','大段代码放在信息条','短值可换行；代码是字体功能例外',section(box(p('版本 / GREEN · 01',14,GREEN,900)+p('入口：<span style="font-family:monospace;overflow-wrap:anywhere;">references/components.md</span>',14,TEXT,400,'0'))))

    for i, name, scene, expr in [(12,'点击展开抽屉','正文补充解释','由紧凑提示展开详情'),(13,'点击揭晓答案','自测或悬念','读者点击后看到答案')]:
        add(f'I{i-11:02}',name,scene,expr,'替代必须直接可见的结论','一次展开，无法回缩；viewBox 动画待微信保存与手机验证；文案逐行核对',normalize_original(blocks[i],svg=True),'svg-legacy','原版动效与视觉保留，字体／色板统一')

    reveal = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" style="display:block;width:100%;height:auto;overflow:hidden;">
<rect x="1" y="1" width="378" height="218" fill="{SOFT}" stroke="{INK}" stroke-width="2"/>
<text x="20" y="42" font-size="14" font-weight="900" fill="{GREEN}">ANSWER / 核心答案</text>
<text x="20" y="92" font-size="19" font-weight="900" fill="{INK}">设计不应吞掉内容。</text>
<text x="20" y="130" font-size="16" fill="{TEXT}">揭晓后仍保持同一画板高度。</text>
<g><rect x="2" y="2" width="376" height="216" fill="{GREEN}"/>
<text x="20" y="55" font-size="14" fill="{LIME}" font-weight="900">TAP TO REVEAL</text>
<text x="20" y="104" font-size="24" fill="{PAPER}" font-weight="900">点击揭开答案</text>
<text x="20" y="156" font-size="16" fill="{PAPER}">固定画板 · 一次揭晓</text>
<rect x="0" y="0" width="380" height="220" fill="{PAPER}" fill-opacity="0"/>
<animate attributeName="opacity" values="1;0" begin="click" dur="0.3s" fill="freeze" restart="never"/>
</g></svg>'''
    add('I03','固定画板点击揭晓','短问答、谜底、转折','覆盖层淡出后露出答案','必须推进后续正文的展开抽屉','固定高宽比，一次揭晓，非持久答题；手机待验收',section(reveal),'svg','新增属性级 SMIL')
    draw = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" style="display:block;width:100%;height:auto;overflow:hidden;">
<rect x="1" y="1" width="378" height="198" fill="{GREEN}" stroke="{INK}" stroke-width="2"/>
<text x="20" y="38" font-size="14" font-weight="900" fill="{LIME}">LOGIC / 点击生长路线</text>
<g stroke="{LIME}" stroke-width="4" stroke-dasharray="500" stroke-dashoffset="500">
<path d="M30 105 L130 105 L130 75 L250 75 L250 120 L350 120" fill="none"/>
<rect x="0" y="0" width="380" height="200" fill="{PAPER}" fill-opacity="0" stroke="none"/>
<animate attributeName="stroke-dashoffset" values="500;0" begin="click" dur="1s" fill="freeze" restart="never"/>
</g>
<text x="20" y="172" font-size="14" fill="{PAPER}">点击画板空白处，查看关系路径。</text>
</svg>'''
    add('I04','点击描边生长','已有明确路径的关系说明','以线条生长建立阅读方向','从并列信息编造因果','固定画板，不是可计算流程图；路径要匹配真实关系',section(draw),'svg','新增属性级 SMIL')
    assert len(entries) == 36
    return entries


def demo_png():
    # Deterministic raster color fixture, not a production illustration.
    width,height=800,440
    rgb=[bytes.fromhex(x.lstrip('#')) for x in (GREEN,LIME,PAPER,INK)]
    raw=b''.join(b'\0'+b''.join(rgb[((x//200)+(y//110))%4] for x in range(width)) for y in range(height))
    def chunk(t,d): return struct.pack('!I',len(d))+t+d+struct.pack('!I',zlib.crc32(t+d)&0xffffffff)
    data=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',width,height,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw))+chunk(b'IEND',b'')
    return 'data:image/png;base64,'+base64.b64encode(data).decode()


def build():
    entries=catalog()
    (ROOT/'references/catalog.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    doc=['# 第二部分：GREEN / 01 组件库 v0.3\n',
         '新粗野主义 × 瑞士国际主义；36 个组件：原 14 个视觉目标保留，新增 22 个。统一规则见 [代码格式要求](format-rules.md)。原始文件逐字存档于 [v0.1 原稿](original-v0.1.md)。\n',
         '**所有组件均未完成本仓的微信手机端验收。** I01/I02 保留原动画，I03/I04 为新增 SMIL 实验组件，不能当成兼容性已经修复。\n',
         '每个代码块是独立组件片段，外层文章容器仅负责统一字体环境，不再重复加左右 padding；组件自身背景和安全边距齐全。模板中的大括号参数须绑定真实素材后才能发布。\n',
         '| 编号 | 组件 | 类型 | 来源 |\n|---|---|---|---|']
    for c in entries: doc.append(f'| {c["id"]} | {c["name"]} | {c["profile"]} | {c["origin"]} |')
    for c in entries:
        doc.extend([f'\n## {c["id"]} / {c["name"]}\n',f'- 使用场景：{c["scenario"]}。',f'- 表达目的：{c["expression"]}。',f'- 不适合：{c["avoid"]}。',f'- 内容与检查：{c["limits"]}。',f'- 来源／状态：{c["origin"]}；{c["status"]}。',f'- 待绑定字段：{", ".join(c["slots"]) or "无；示例文案直接替换并先转义"}。\n',f'```html\n{c["html"]}\n```'])
    doc.append('\n## 按文章选择\n\n教程：C01/C16 → C03/C14/C13 → C20/C08/C30/C31 → C09/C11/C12。观点文：C01/C02 → C03/C13/C18 → C05/C06/C26 → C09/C11。问答稿：C01/C13 → C22 → C11/C12，可选 I02/I03。组件按真实语义选择，不要求全部使用；互动不承载唯一可见的重要结论。\n')
    (ROOT/'references/components.md').write_text('\n'.join(doc)+'\n',encoding='utf-8')
    fixture=demo_png()
    cards=[]
    for c in entries:
        example=re.sub(r'\{\{([A-Z_0-9]+)\}\}',lambda m: fixture if m[1].endswith('_URL') else '800' if m[1].endswith('_WIDTH') else '仅作排版预览的色块测试图',c['html'])
        images = '<p>这是布局测试图。逐张填写已上传素材的 HTTPS 地址，加载成功后才允许复制图片组件。</p><section class="image-fields"></section>' if c['slots'] else ''
        badge='SVG 实验项 · 手机待验收' if c['profile'].startswith('svg') else '代码可检查 · 手机待验收'
        cards.append(f'<article class="card" data-id="{c["id"]}"><header><h2>{c["id"]} / {c["name"]}</h2><p>{c["scenario"]} → {c["expression"]}</p><p>{c["limits"]}</p><small>{badge}</small>{images}<button class="copy" type="button">复制此组件</button><p class="status" role="status"></p></header><section class="sample">{example}</section><details><summary>查看模板代码与绑定参数</summary><pre>{escape(c["html"])}</pre></details></article>')
    shell=(ROOT/'scripts/gallery-shell.html').read_text(encoding='utf-8')
    out=ROOT/'examples';out.mkdir(exist_ok=True)
    (out/'gallery.html').write_text(shell.replace('<!--COMPONENTS-->','\n'.join(cards)),encoding='utf-8')
    print(f'Built {len(entries)} components; 32 static/scroll, 4 SVG candidates.')


if __name__=='__main__': build()
