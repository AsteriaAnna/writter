#!/usr/bin/env python3
"""Meaningful negative fixtures plus code text integrity; no browser emulation."""
import copy
from html.parser import HTMLParser
import json
from pathlib import Path
import unittest
from check_library import validate

ROOT=Path(__file__).resolve().parents[1]
CAT={c['id']:c for c in json.loads((ROOT/'references/catalog.json').read_text(encoding='utf-8'))}


class LibraryTests(unittest.TestCase):
    def mutated(self,html):
        c=copy.deepcopy(CAT['C13']);c['html']=html
        return validate(c)

    def test_original_entries_and_two_original_animations_remain(self):
        self.assertEqual(sum(c['origin'].startswith('原版') for c in CAT.values()),14)
        for cid in ['I01','I02']:
            self.assertIn('attributeName="viewBox"',CAT[cid]['html'])
            self.assertEqual(CAT[cid]['profile'],'svg-legacy')

    def test_blocks_cannot_be_wrapped_in_leaf(self):
        self.assertTrue(self.mutated('<section><span leaf=""><p>正文</p></span></section>'))

    def test_fixed_height_text_rejected_but_decoration_allowed(self):
        self.assertTrue(self.mutated('<section style="height:6px;"><p><span leaf="">正文</span></p></section>'))
        self.assertFalse(self.mutated('<section><section style="height:6px;background:#c6ff00;"></section><p><span leaf="">正文</span></p></section>'))

    def test_event_code_and_external_style_dependency_rejected(self):
        self.assertTrue(self.mutated('<section onclick="alert(1)"><span leaf="">正文</span></section>'))
        self.assertTrue(self.mutated('<section style="color:var(--color)"><span leaf="">正文</span></section>'))

    def test_unified_palette_and_fonts_enforced(self):
        self.assertTrue(self.mutated('<section style="color:#ff0000"><span leaf="">正文</span></section>'))
        self.assertTrue(self.mutated('<section style="font-family:serif;"><span leaf="">正文</span></section>'))

    def test_image_bindings_checked(self):
        c=copy.deepcopy(CAT['C27']);c['slots']=[]
        self.assertIn('Binding mismatch',validate(c))

    def test_code_keeps_ascii_indent_and_symbols(self):
        class Text(HTMLParser):
            def __init__(self):super().__init__();self.data=[]
            def handle_data(self,data):self.data.append(data)
        t=Text();t.feed(CAT['C31']['html'])
        self.assertIn('if count < 3:',t.data)
        self.assertIn('    print("保留四个半角空格")',t.data)

    def test_new_svg_avoids_legacy_animation_and_has_no_html_leaf(self):
        for cid in ['I03','I04']:
            c=CAT[cid];self.assertFalse(validate(c));self.assertNotIn('attributeName="viewBox"',c['html'])
            svg=c['html'].split('<svg',1)[1].split('</svg>',1)[0]
            self.assertNotIn('<span',svg)


if __name__=='__main__':unittest.main()
