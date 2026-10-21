"""Check that the built report only adds notes to the original audit.

Usage, from anywhere: python3 -I parity-report/tools/check_additive.py

Fails if a CSV row or column of the audit changed, if the Markdown lost or
changed a line of the audit, or if the page's embedded rows differ other than
by the added update fields (u, un).
"""
import csv
import difflib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIG = ROOT / 'original'

for base in ('sparkyfitness-feature-parity', 'paridad-web-movil'):
    old = list(csv.reader(open(ORIG / f'{base}.csv', newline='', encoding='utf-8')))
    new = list(csv.reader(open(ROOT / f'{base}.csv', newline='', encoding='utf-8')))
    assert len(old) == len(new), f'{base}.csv: row count changed'
    for o, n in zip(old, new):
        assert n[:len(o)] == o and len(n) == len(o) + 2, f'{base}.csv: row {o[1] if len(o) > 1 else o} changed'
    noted = sum(1 for r in new[1:] if r[-1])

    old_md = open(ORIG / f'{base}.md', encoding='utf-8').read().split('\n')
    new_md = open(ROOT / f'{base}.md', encoding='utf-8').read().split('\n')
    ops = [op for op in difflib.SequenceMatcher(None, old_md, new_md, autojunk=False).get_opcodes() if op[0] != 'equal']
    bad = [op for op in ops if op[0] != 'insert']
    assert not bad, f'{base}.md: audit lines changed or removed near line {bad[0][1] + 1}'
    print(f'{base}: csv rows with a note {noted}, md lines added {sum(op[4] - op[3] for op in ops)}')


def page_data(path):
    text = open(path, encoding='utf-8').read()
    start = '<script id="data" type="application/json">'
    a = text.index(start) + len(start)
    return json.loads(text[a:text.index('</script>', a)])


old_rows = page_data(ORIG / 'sparkyfitness-feature-parity.html')['rows']
new_rows = page_data(ROOT / 'sparkyfitness-feature-parity.html')['rows']
assert len(old_rows) == len(new_rows), 'page: row count changed'
for o, n in zip(old_rows, new_rows):
    assert {k: v for k, v in n.items() if k not in ('u', 'un')} == o, f'page: row {o.get("n")} changed'
print('page: rows with a note', sum('u' in r for r in new_rows))
print('OK: only notes were added')
