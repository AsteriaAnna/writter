#!/usr/bin/env python3
"""Checks this project's stated profile. It does not certify WeChat rendering."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PALETTE = {'#123a2c','#c6ff00','#111111','#343832','#f7f7f0','#f0f0e9','#555952','#d2d8d0','#487061'}
SIZES = {10,11,12,14,15,16,19,24,32,52}
ALLOWED = {'section','p','span','strong','br','img','table','tr','td','th','thead','tbody','svg','rect','line','text','g','path','animate'}
VOID = {'br','img'}


class ProfileParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[];self.heights=[];self.errors=[];self.max_depth=0;self.roots=0

    def handle_starttag(self,tag,attrs):
        ad=dict(attrs)
        if not self.stack: self.roots+=1
        if tag not in ALLOWED: self.errors.append(f'Unsupported tag {tag}')
        if any(leaf for _,leaf in self.stack) and tag in {'section','p','table','tr','td'}:
            self.errors.append('Block inside leaf')
        if any(k in ad for k in ('id','class')) or any(k.startswith('on') for k in ad):
            self.errors.append('Body depends on class/id/event attribute')
        style=ad.get('style','')
        if re.search(r'var\(|gradient\(|(?:^|;)\s*(?:position|float)\s*:|display\s*:\s*(?:grid|flex)',style):
            self.errors.append('Disallowed ordinary CSS dependency')
        if tag not in VOID:
            self.stack.append((tag, tag=='span' and 'leaf' in ad))
            self.heights.append(bool(re.search(r'(?:^|;)\s*height\s*:\s*\d',style)))
            self.max_depth=max(self.max_depth,len(self.stack))

    def handle_startendtag(self,tag,attrs):
        self.handle_starttag(tag,attrs)
        if tag not in VOID:self.handle_endtag(tag)

    def handle_endtag(self,tag):
        if tag in VOID:return
        if not self.stack or self.stack[-1][0]!=tag:self.errors.append(f'Broken closing {tag}')
        else:self.stack.pop();self.heights.pop()

    def handle_data(self,data):
        if data.strip() and not any(t=='svg' for t,_ in self.stack) and any(self.heights):
            self.errors.append('Ordinary text in fixed-height container')
        if data.strip() and not any(leaf for _,leaf in self.stack) and not any(t=='svg' for t,_ in self.stack):
            self.errors.append('Ordinary text without leaf')


def validate(c):
    errors=[];html=c['html'];parser=ProfileParser();parser.feed(html);parser.close()
    errors+=parser.errors
    if parser.stack:errors.append('Unclosed elements')
    if parser.roots!=1:errors.append('Expected one component root')
    colors=set(x.lower() for x in re.findall(r'#[0-9a-fA-F]{6}\b',html))
    if colors-PALETTE:errors.append('Off-palette '+str(colors-PALETTE))
    sizes={int(x) for x in re.findall(r'font-size[:=]["\s]*(\d+)',html)}
    if sizes-SIZES:errors.append('Off-scale font size '+str(sizes-SIZES))
    for family in re.findall(r'font-family:([^;"]+)',html):
        if family != 'Arial,sans-serif' and not (family == 'monospace' and c['id'] in {'C31','C32'}):
            errors.append('Unexpected font family')
    if re.search(r'border-radius\s*:\s*[1-9]',html):errors.append('Rounded geometry')
    for key in ['scenario','expression','avoid','limits','origin','status']:
        if not c.get(key):errors.append('Missing definition '+key)
    for svg in re.findall(r'<svg\b.*?</svg>',html,re.S):
        try:ET.fromstring(svg)
        except ET.ParseError as e:errors.append('Invalid SVG XML: '+str(e))
        animated=re.findall(r'<animate\b[^>]*attributeName="([^"]+)"',svg)
        if 'viewBox' in animated and c['profile']!='svg-legacy':errors.append('Unexpected viewBox animation')
        if not c['profile'].startswith('svg'):errors.append('Unclassified SVG')
    for img in re.findall(r'<img\b[^>]*>',html):
        if 'data-w=' not in img or 'max-width:100%' not in img:errors.append('Missing image sizing metadata')
    if set(re.findall(r'\{\{([A-Z_0-9]+)\}\}',html))!=set(c['slots']):errors.append('Binding mismatch')
    return errors


def main():
    entries=json.loads((ROOT/'references/catalog.json').read_text(encoding='utf-8'))
    assert len(entries)==36 and len({c['id'] for c in entries})==36
    errors=[]
    original = (ROOT/'references/original-v0.1.md').read_text(encoding='utf-8')
    blocks = re.findall(r'```html\n(.*?)\n```',original,re.S)
    ids = [f'C{i:02}' for i in range(1,13)] + ['I01','I02']
    assert len(blocks) == len(ids)
    masters = dict(zip(ids,blocks))
    for c in entries:
        if c['id'] in masters:
            if c['html'] != masters[c['id']]:
                errors.append(f'{c["id"]}: differs from original')
            continue
        if not re.search(r'(?:color:|background:|solid |fill="|stroke=")#c6ff00',c['html']):
            errors.append(f'{c["id"]}: missing fluorescent accent')
        errors.extend(f'{c["id"]}: {e}' for e in validate(c))
    doc=(ROOT/'references/components.md').read_text(encoding='utf-8')
    gallery=(ROOT/'examples/gallery.html').read_text(encoding='utf-8')
    assert len(re.findall(r'```html\n',doc))==36
    assert len(re.findall(r'<article class="card" data-id=',gallery))==36
    assert '<!--COMPONENTS-->' not in gallery
    assert len([c for c in entries if c['origin'].startswith('原版')])==14
    assert {c['id'] for c in entries if c['profile']=='svg-legacy'}=={'I01','I02'}
    for c in entries:
        assert '<script' not in c['html'] and '<button' not in c['html']
    for e in errors:print('ERROR',e)
    print(f'{len(entries)} components checked; {len(errors)} errors; 4 SVG candidates require WeChat acceptance.')
    if errors:raise SystemExit(1)


if __name__=='__main__':main()
