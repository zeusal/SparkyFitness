"""Build the annotated parity page (sparkyfitness-feature-parity.html).

Usage, from anywhere: python3 -I parity-report/tools/update_parity_page.py

Starts from the untouched page in original/, adds each row's note (kind, PRs
and English text from notes/parity-notes.json) to the embedded data, an
Updates filter, the update box on the Executive summary tab (with the
features added since the audit, from notes/new-features.json) and the notes
on three summary lines (texts from notes/parity-summary.json), and writes the
page at the top of parity-report/. The page is self-contained.
"""
import csv
import html
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_parity_update import new_feature_lines  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
ORIG = ROOT / 'original'
h = open(ORIG / 'sparkyfitness-feature-parity.html', encoding='utf-8').read()
notes = {n['id']: n for n in json.load(open(ROOT / 'notes' / 'parity-notes.json', encoding='utf-8')) if n['kind'] != 'none'}
SUMMARY = json.load(open(ROOT / 'notes' / 'parity-summary.json', encoding='utf-8'))
PAGE = SUMMARY['page']
ids = [r['id'] for r in csv.DictReader(open(ORIG / 'sparkyfitness-feature-parity.csv', newline='', encoding='utf-8'))]


def rep(old, new):
    global h
    assert h.count(old) == 1, old[:80]
    h = h.replace(old, new)


def inline(md):
    """The small Markdown subset the summary texts use: links, bold, code."""
    t = html.escape(md, quote=False)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    return t


# Data: rows keep their order, which is the CSV's.
start = '<script id="data" type="application/json">'
a = h.index(start) + len(start)
b = h.index('</script>', a)
data = json.loads(h[a:b])
assert len(data['rows']) == len(ids)
for row, row_id in zip(data['rows'], ids):
    if row_id in notes:
        n = notes[row_id]
        row['u'] = '_'.join([n['kind']] + [str(p) for p in sorted(n['prs'])])
        row['un'] = n['note_en']
blob = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
h = h[:a] + blob + h[b:]

# Styles
rep('.badge { display: inline-block;', '''.badge.upd { border-color: var(--focus); color: var(--focus); }
.fname .ubadge { display: flex; }
.lede a, .updbox a { color: var(--focus); }
.updbox { border: 1px solid var(--line); border-left: 3px solid var(--focus); border-radius: 8px; padding: 4px 14px 12px; background: var(--surface); }
.summary .upd { display: block; margin-top: 3px; font-size: 13.5px; color: var(--ink-2); }
.badge { display: inline-block;''')

# Masthead
rep('<div class="eyebrow">Static code audit · main @ 5364674f</div>',
    f'<div class="eyebrow">Static code audit · main @ 5364674f · notes updated {PAGE["date_label"]}</div>')
rep('''every row cites the files it was found in.</p>''', f'''every row cites the files it was found in.</p>
    <p class="lede">{PAGE["lede_html"]}</p>''')

# Updates filter
options = ''.join(f'\n          <option value="{html.escape(o["value"])}">{html.escape(o["label"])}</option>' for o in PAGE['filters'])
rep('''          <option value="both">Same on iOS & Android</option>
        </select>''', f'''          <option value="both">Same on iOS & Android</option>
        </select>
        <select id="upd" aria-label="Updates">
          <option value="">Any update status</option>
          <option value="any">With an update note</option>{options}
        </select>''')

# Script: labels match tools/apply_parity_update.py label().
rep("  const PAGE = 120;", """  const updParts = u => { const [kind, ...prs] = u.split('_'); return { kind, prs: prs.map(p => '#' + p) }; };
  const prText = prs => prs.length < 2 ? prs[0] : prs.slice(0, -1).join(', ') + ' and ' + prs[prs.length - 1];
  const UPD = u => { const { kind, prs } = updParts(u); if (kind === 'open') return 'Still open'; return (kind === 'done' ? 'Updated in ' : 'Partly covered by ') + (prs.length > 1 ? 'PRs ' : 'PR ') + prText(prs) + ' (merged)'; };
  const UPD_SHORT = u => { const { kind, prs } = updParts(u); if (kind === 'open') return 'Still open'; return prs.join(' · ') + (kind === 'partial' ? ' · partial' : ''); };
  const PAGE = 120;""")
rep("[r.n, r.d, r.we, r.me, r.pn, r.no, GT[r.g].t]", "[r.n, r.d, r.we, r.me, r.pn, r.no, r.un, GT[r.g].t]")
rep("const DEFAULT = { q: '', domain: '__functional', platform: '', cats: [] };",
    "const DEFAULT = { q: '', domain: '__functional', platform: '', cats: [], upd: '' };")
rep("  const inCats = r => !state.cats.length || state.cats.includes(r.c);",
    "  const inCats = r => !state.cats.length || state.cats.includes(r.c);\n  const inUpd = r => !state.upd || (!!r.u && (state.upd === 'any' || r.u.split('_').includes(state.upd)));")
rep('<span class="fname"><b>${esc(r.n)}</b><span class="desc">',
    '<span class="fname"><b>${esc(r.n)}</b>${r.u ? `<span class="ubadge"><span class="badge upd">${UPD_SHORT(r.u)}</span></span>` : \'\'}<span class="desc">')
rep("    return f('Description', r.d, false, true) +",
    f"    return f('Description', r.d, false, true) +\n      f('Update · {PAGE['date_label']}', r.u ? `${{UPD(r.u)}}: ${{r.un}}` : '', false, true) +")
rep("    document.getElementById('platform').value = state.platform;",
    "    document.getElementById('platform').value = state.platform;\n    document.getElementById('upd').value = state.upd;")
rep("    renderCats(base.filter(inPlatform));", "    renderCats(base.filter(r => inPlatform(r) && inUpd(r)));")
rep("    const list = base.filter(r => inPlatform(r) && inCats(r));", "    const list = base.filter(r => inPlatform(r) && inCats(r) && inUpd(r));")
rep("  document.getElementById('platform').addEventListener('change', e => { state.platform = e.target.value; apply(true); });",
    "  document.getElementById('platform').addEventListener('change', e => { state.platform = e.target.value; apply(true); });\n  document.getElementById('upd').addEventListener('change', e => { state.upd = e.target.value; apply(true); });")

# Executive summary tab: the English update section of the Markdown, as HTML.
EN = SUMMARY['en']
sec = [l for l in EN['section'] if l.strip()]
title = re.sub(r'\(\d{4}-\d{2}-\d{2}\)', f'({PAGE["date_label"]})', sec[0].lstrip('# '))
paras = [l for l in sec[1:] if not l.lstrip().startswith('- ')]
items = [l for l in sec[1:] if l.lstrip().startswith('- ')]
new_lines = [l for l in new_feature_lines('en') if l.strip()]
new_html = ''
if new_lines:
    new_title = new_lines[0].lstrip('# ')
    new_html = f'<h3>{html.escape(new_title)}</h3>\n<ul>' + ''.join(f'<li>{inline(l[2:])}</li>' for l in new_lines[1:]) + '</ul>'

body = ''.join(f'<p>{inline(p)}</p>\n' for p in paras).replace('note under them', 'note in the Explorer').replace(
    'In the CSV the same notes are in two extra columns, <code>update_status</code> and <code>update_notes</code>. ', '')
lis, open_sub = '', False
for l in items:
    sub = l.startswith('  - ')
    text = inline(l.lstrip()[2:])
    if sub and not open_sub:
        lis += '<ul>'
        open_sub = True
    if not sub and open_sub:
        lis += '</ul></li>'
        open_sub = False
    if sub:
        lis += f'<li>{text}</li>'
    else:
        if lis and not lis.endswith('</li>'):
            lis += '</li>'
        lis += f'\n<li>{text}'
lis += '</ul></li>' if open_sub else '</li>'
rep('<div class="summary"><p><strong>Numbers:</strong>',
    f'<div class="summary"><div class="updbox"><h3>{html.escape(title)}</h3>\n{body}<ul>{lis}</ul>{new_html}</div>\n<p><strong>Numbers:</strong>')

# Notes on summary lines: each anchor names the text its line ends with on the page.
for anchor in EN['anchors']:
    span = f'<span class="upd"><strong>{html.escape(anchor["label"])}:</strong> {inline(anchor["text"])}</span>'
    rep(anchor['html_anchor'] + '\n</li>', anchor['html_anchor'] + span + '\n</li>')

open(ROOT / 'sparkyfitness-feature-parity.html', 'w', encoding='utf-8').write(h)
sweep = {g['k'] for g in data['groups'] if g['sweep']}
rows = [r for r in data['rows'] if 'u' in r]
print('annotated rows:', len(rows), '| in functional domains:', sum(r['g'] not in sweep for r in rows), '| size:', len(h.encode()))
