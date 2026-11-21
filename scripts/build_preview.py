#!/usr/bin/env python3
"""Build a clean article and a rich-text copy preview from the component document."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def build():
    doc = (ROOT / 'references/components.md').read_text()
    blocks = re.findall(r'```html\n(.*?)\n```', doc, re.S)
    # Block 0 is the one article root. All remaining blocks are inner components.
    assert len(blocks) == 22, f'Expected root + 21 components, got {len(blocks)}'
    article = blocks[0].replace('<!-- 正文组件放在这里 -->', '\n'.join(blocks[1:]))
    out = ROOT / 'examples'
    out.mkdir(exist_ok=True)
    (out / 'article.html').write_text(article + '\n')
    baseline = '<section style="margin:0;padding:0;color:#333333;font-size:16px;line-height:1.8;"><p style="margin:0 0 12px;"><span leaf="">公众号文字显示测试</span></p><p style="margin:0 0 12px;"><span leaf="">如果能看到这段文字，基础富文本复制与手机预览链路可以工作。</span></p><p style="margin:0;"><span leaf="">接下来再测试全部组件，区分文字、图片和样式问题。</span></p></section>'
    (out / 'baseline.html').write_text(baseline + '\n')
    preview = r'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GREEN / 01 组件预览</title>
<style>body{margin:0;background:#e9e9e4;color:#111;font-family:system-ui,sans-serif}header{max-width:640px;margin:20px auto;padding:16px;box-sizing:border-box}button{padding:12px 16px;background:#123a2c;color:white;border:0;font-size:16px;cursor:pointer}main{max-width:640px;margin:0 auto 40px}#status{line-height:1.7}code{overflow-wrap:anywhere}</style></head><body>
<header><h1>组件复制测试页</h1><p>此页连续展示全部组件，不是推荐的文章组合。先复制纯文字基线测试，再复制全部组件。不要复制 Markdown 围栏或 HTML 源码。图片是微信规范中的演示素材，发布自己的文章前请换成自己上传的图片。</p><button id="baseline-copy" type="button">复制纯文字基线</button> <button id="copy" type="button">复制全部组件到公众号</button><p id="status" role="status">粘贴后保存草稿，再发送手机预览检查。尚未完成微信真机验收。</p></header>
<main id="article">__ARTICLE__</main>
<script>
const article = document.getElementById('article');
const status = document.getElementById('status');
const baselineHTML = __BASELINE_JSON__;
async function copyContent(isBaseline) {
  const target = isBaseline ? document.createElement('section') : article;
  if (isBaseline) { target.innerHTML = baselineHTML; document.body.appendChild(target); }
  try {
  const html = target.innerHTML;
  const text = target.innerText;
  const badImages = [...target.querySelectorAll('img')].filter(img => !/^https:\/\//.test(img.getAttribute('src') || '') || !img.complete || img.naturalWidth === 0);
  if (badImages.length) {
    status.textContent = '图片未成功加载或地址不是 HTTPS。请检查网络和图片地址，换成自己上传的素材后再复制。';
    return;
  }
  try {
    if (!navigator.clipboard?.write || !window.ClipboardItem) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html], {type:'text/html'}),'text/plain':new Blob([text], {type:'text/plain'})})]);
    status.textContent = '已复制富文本。请到公众号正文区域粘贴，保存后用手机预览。';
    return;
  } catch (error) {
    // Local file pages or browsers without ClipboardItem can use the selection path.
    const selection = window.getSelection();
    const previous = [];
    for (let i = 0; i < selection.rangeCount; i++) previous.push(selection.getRangeAt(i).cloneRange());
    const range = document.createRange(); range.selectNodeContents(target);
    selection.removeAllRanges(); selection.addRange(range);
    let copied = false;
    const onCopy = event => {
      if (!event.clipboardData) return;
      event.clipboardData.setData('text/html', html);
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
    };
    document.addEventListener('copy', onCopy);
    try { copied = document.execCommand('copy'); }
    catch (error) { copied = false; }
    finally { document.removeEventListener('copy', onCopy); }
    if (copied) {
      selection.removeAllRanges(); previous.forEach(r => selection.addRange(r));
      status.textContent = '已复制富文本。请到公众号正文区域粘贴，保存后用手机预览。';
    } else {
      status.textContent = '浏览器阻止了自动复制。正文已选中，请按 Ctrl+C（Mac：⌘C），然后到公众号正文粘贴。';
    }
  }
  } finally {
    if (isBaseline) {
      // Retain a visible selection if manual copying is required.
      if (!window.getSelection()?.containsNode(target, true)) target.remove();
    }
  }
}
document.getElementById('copy').addEventListener('click', () => copyContent(false));
document.getElementById('baseline-copy').addEventListener('click', () => copyContent(true));
</script></body></html>'''
    import json
    (out / 'preview.html').write_text(preview.replace('__ARTICLE__', article).replace('__BASELINE_JSON__', json.dumps(baseline, ensure_ascii=False)))
    print(f'Built {out / "article.html"} and {out / "preview.html"}')


if __name__ == '__main__':
    build()
