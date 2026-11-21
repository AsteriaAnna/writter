#!/usr/bin/env python3
"""Check the library's conservative HTML profile, not official WeChat compliance."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys


class Checker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.roots = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if not self.stack:
            self.roots += 1
            if tag != 'section':
                self.errors.append('Root must be section')
        if tag not in {'section', 'p', 'span', 'strong', 'br', 'img'}:
            self.errors.append(f'Outside conservative tag profile: {tag}')
        if any(t == 'span' and leaf for t, leaf in self.stack) and tag in {'p', 'section'}:
            self.errors.append('Block element inside span[leaf]')
        if any(k in attrs for k in ('class', 'id')) or any(k.startswith('on') for k in attrs):
            self.errors.append(f'Unsupported attribute on {tag}')
        style = attrs.get('style', '')
        if re.search(r'(?:^|;)\s*(?:position\s*:|display\s*:\s*(flex|grid)|height\s*:\s*\d)|var\(|gradient\(', style, re.I):
            self.errors.append(f'Unsupported layout declaration on {tag}')
        if tag == 'img':
            if not re.match(r'^https://', attrs.get('src', '')):
                self.errors.append('Image requires real HTTPS src')
            if not attrs.get('data-w', '').isdigit() or int(attrs.get('data-w', '0')) <= 0:
                self.errors.append('Image requires positive original width data-w')
            if not re.search(r'max-width\s*:\s*100%', style):
                self.errors.append('Image requires max-width:100%')
        if tag not in {'br', 'img'}:
            self.stack.append((tag, tag == 'span' and 'leaf' in attrs))

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1][0] != tag:
            self.errors.append(f'Unbalanced closing tag: {tag}')
        else:
            self.stack.pop()

    def handle_data(self, data):
        if data.strip() and not any(leaf for _, leaf in self.stack):
            self.errors.append('Nonempty text outside span[leaf]')


def check(html):
    checker = Checker()
    checker.feed(html)
    checker.close()
    if checker.stack:
        checker.errors.append('Unclosed elements')
    if checker.roots != 1:
        checker.errors.append('Expected exactly one article root')
    if '{{' in html or 'placehold.co' in html:
        checker.errors.append('Unresolved placeholder')
    return checker.errors


if __name__ == '__main__':
    path = Path(sys.argv[1])
    errors = check(path.read_text())
    for error in errors:
        print('ERROR:', error)
    print(f'{path}: {len(errors)} errors in local conservative profile; WeChat device acceptance pending.')
    sys.exit(bool(errors))
