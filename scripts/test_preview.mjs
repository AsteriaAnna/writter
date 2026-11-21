// Node-only behavioral tests. This mocks DOM/clipboard APIs; it is not a browser
// rendering test, OS clipboard test, or WeChat editor/device acceptance test.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const preview = readFileSync(new URL('../examples/preview.html', import.meta.url), 'utf8');
const articleHTML = readFileSync(new URL('../examples/article.html', import.meta.url), 'utf8').trim();
const baselineHTML = readFileSync(new URL('../examples/baseline.html', import.meta.url), 'utf8').trim();
const script = preview.match(/<script>([\s\S]*?)<\/script>/)[1];

function environment({ api = true, reject = false, command = true, brokenImage = false } = {}) {
  const images = [{ complete: true, naturalWidth: brokenImage ? 0 : 1080, getAttribute: () => 'https://example.test/image.png' }];
  const events = new Map();
  const children = [];
  const listeners = new Map();
  const copied = [];
  const ranges = [];
  let manual = null;
  const element = html => ({
    innerHTML: html,
    get innerText() { return this.innerHTML.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<'); },
    querySelectorAll() { return this.innerHTML.includes('<img') ? images : []; },
    addEventListener(name, callback) { listeners.set(`${this.id}:${name}`, callback); },
    remove() { const i = children.indexOf(this); if (i >= 0) children.splice(i, 1); },
  });
  const article = element(articleHTML);
  const status = { textContent: '' };
  const copy = element(''); copy.id = 'copy';
  const baselineCopy = element(''); baselineCopy.id = 'baseline-copy';
  const selection = {
    get rangeCount() { return ranges.length; },
    getRangeAt(i) { return ranges[i]; },
    removeAllRanges() { ranges.length = 0; },
    addRange(range) { ranges.push(range); },
    containsNode(target) { return ranges.some(r => r.target === target); },
  };
  const document = {
    getElementById(id) { return { article, status, copy, 'baseline-copy': baselineCopy }[id]; },
    createElement() { return element(''); },
    body: { appendChild(target) { children.push(target); } },
    createRange() { return { target: null, selectNodeContents(target) { this.target = target; }, cloneRange() { return { ...this }; } }; },
    addEventListener(name, callback) { events.set(name, callback); },
    removeEventListener(name) { events.delete(name); },
    execCommand(name) {
      assert.equal(name, 'copy');
      if (command === 'throw') throw new Error('Copy blocked');
      if (!command) return false;
      manual = {};
      events.get('copy')({ clipboardData: { setData(type, data) { manual[type] = data; } }, preventDefault() {} });
      return true;
    },
  };
  class ClipboardItem { constructor(data) { this.data = data; } }
  const navigator = api ? { clipboard: { async write(items) { if (reject) throw new Error('Permission denied'); copied.push(items[0].data); } } } : {};
  const context = { document, navigator, Blob, ClipboardItem, window: { ClipboardItem, getSelection: () => selection } };
  vm.runInNewContext(script, context);
  return {
    async click(id) { await listeners.get(`${id}:click`)(); }, status, copied, children, events, ranges,
    get manual() { return manual; },
  };
}

let passed = 0;
async function test(name, run) { await run(); console.log(`PASS ${name}`); passed++; }
await test('full article writes HTML and plain text without preview controls', async () => {
  const e = environment(); await e.click('copy');
  assert.equal(await e.copied[0]['text/html'].text(), articleHTML);
  assert.ok((await e.copied[0]['text/plain'].text()).includes('打破常规'));
  assert.ok(!articleHTML.includes('<script') && !articleHTML.includes('<button'));
});
await test('baseline copies exact minimal HTML and removes temporary element', async () => {
  const e = environment(); await e.click('baseline-copy');
  assert.equal(await e.copied[0]['text/html'].text(), baselineHTML);
  assert.equal(e.children.length, 0);
});
await test('missing modern Clipboard API falls back to copy event', async () => {
  const e = environment({ api: false }); await e.click('copy');
  assert.equal(e.manual['text/html'], articleHTML);
  assert.equal(e.events.size, 0);
});
await test('permission rejection falls back with exact baseline HTML', async () => {
  const e = environment({ reject: true }); await e.click('baseline-copy');
  assert.equal(e.manual['text/html'], baselineHTML);
  assert.equal(e.children.length, 0);
});
await test('blocked fallback leaves visible baseline selected for manual copy', async () => {
  const e = environment({ api: false, command: false }); await e.click('baseline-copy');
  assert.equal(e.children.length, 1);
  assert.equal(e.ranges[0].target.innerHTML, baselineHTML);
  assert.match(e.status.textContent, /Ctrl\+C/);
});
await test('throwing legacy API does not leak copy event listener', async () => {
  const e = environment({ api: false, command: 'throw' }); await e.click('copy');
  assert.equal(e.events.size, 0);
  assert.match(e.status.textContent, /阻止/);
});
await test('unloaded image blocks full article and reports the reason', async () => {
  const e = environment({ brokenImage: true }); await e.click('copy');
  assert.equal(e.copied.length, 0);
  assert.match(e.status.textContent, /图片未成功加载/);
});
await test('baseline remains usable even if article images fail', async () => {
  const e = environment({ brokenImage: true }); await e.click('baseline-copy');
  assert.equal(e.copied.length, 1);
});
console.log(`${passed} behavioral tests passed; DOM and clipboard mocked, not device acceptance.`);
