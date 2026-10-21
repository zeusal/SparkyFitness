"""Find the audit rows a change may affect, with their current update note.

Usage, from anywhere:
  python3 -I parity-report/tools/find_rows.py TERM [TERM ...]
      Rows whose text or evidence contains every TERM (case-insensitive).
  python3 -I parity-report/tools/find_rows.py --git REV_RANGE [--repo PATH]
      Rows whose evidence cites a file changed in REV_RANGE, for example
      "5364674f..upstream/main" or "abc123^1..abc123" for one merge commit.
  python3 -I parity-report/tools/find_rows.py --noted
      Every row that has an update note.

Add --ids to print only the ids, one per line.
"""
import argparse
import csv
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIELDS = ('feature', 'description', 'web', 'mobile', 'platform_notes', 'notes', 'corrections', 'web_evidence', 'mobile_evidence')

rows = list(csv.DictReader(open(ROOT / 'original' / 'sparkyfitness-feature-parity.csv', newline='', encoding='utf-8')))
notes = {n['id']: n for n in json.load(open(ROOT / 'notes' / 'parity-notes.json', encoding='utf-8'))}

p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
p.add_argument('terms', nargs='*')
p.add_argument('--git', metavar='REV_RANGE')
p.add_argument('--repo', default=str(ROOT.parent), help='git checkout to diff (default: the one holding parity-report)')
p.add_argument('--noted', action='store_true')
p.add_argument('--ids', action='store_true')
args = p.parse_args()


def note_of(row_id):
    n = notes.get(row_id)
    if not n:
        return '-'
    return n['kind'] + (' ' + '+'.join(f'#{x}' for x in n['prs']) if n['prs'] else '')


hits = []
if args.git:
    changed = subprocess.run(['git', '-C', args.repo, 'diff', '--name-only', args.git],
                             check=True, capture_output=True, text=True).stdout.split()
    names = {Path(f).name for f in changed}
    # Evidence cites paths relative to a package or bare file names, so match on the file name.
    cited = re.compile(r'([A-Za-z0-9_.\-]+\.(?:tsx?|jsx?|kt|swift|tmpl|xml|json|java|py|sql|md))')
    for r in rows:
        files = set(cited.findall(r['web_evidence'] + ' ' + r['mobile_evidence']))
        overlap = sorted(files & names)
        if overlap:
            hits.append((r, ', '.join(overlap)))
elif args.noted:
    hits = [(r, '') for r in rows if r['id'] in notes and notes[r['id']]['kind'] != 'none']
else:
    if not args.terms:
        p.error('give search terms, --git or --noted')
    terms = [t.lower() for t in args.terms]
    for r in rows:
        text = ' '.join(r[f] for f in FIELDS).lower()
        if all(t in text for t in terms):
            hits.append((r, ''))

for r, why in hits:
    if args.ids:
        print(r['id'])
    else:
        extra = f'  [cites {why}]' if why else ''
        print(f"{r['id']} | {r['group']} | {r['feature']} | {r['mobile_platform']} | note: {note_of(r['id'])}{extra}")
if not args.ids:
    print(f'{len(hits)} row(s)')
