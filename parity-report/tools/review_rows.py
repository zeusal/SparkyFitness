"""Prepare rows for a note review, and merge reviewed notes back.

Export the rows to review, grouped, with the audit fields and the current note:
  python3 -I parity-report/tools/review_rows.py export OUT.json GROUP=ID,ID,... [GROUP=ID,...]

Merge reviewed rows into notes/parity-notes.json (each row needs id, kind,
prs, note_en and note_es; evidence is kept when present). The input is either
a list of rows or a list of {group, rows} objects:
  python3 -I parity-report/tools/review_rows.py merge REVIEWED.json

A row with kind "none" is kept in the notes file (so the next review knows it
was looked at) but gets no note in the report.
"""
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NOTES_PATH = ROOT / 'notes' / 'parity-notes.json'
AUDIT_FIELDS = ('group', 'feature', 'description', 'web', 'mobile', 'mobile_platform',
                'platform_notes', 'notes', 'corrections', 'mobile_evidence', 'web_evidence')
KINDS = {'done', 'partial', 'open', 'none'}


def load_notes():
    return json.load(open(NOTES_PATH, encoding='utf-8'))


def export(out_path, specs):
    en = {r['id']: r for r in csv.DictReader(open(ROOT / 'original' / 'sparkyfitness-feature-parity.csv', newline='', encoding='utf-8'))}
    es = {r['id']: r for r in csv.DictReader(open(ROOT / 'original' / 'paridad-web-movil.csv', newline='', encoding='utf-8'))}
    notes = {n['id']: n for n in load_notes()}
    out = {}
    for spec in specs:
        group, _, ids = spec.partition('=')
        out[group] = []
        for row_id in filter(None, ids.split(',')):
            if row_id not in en:
                sys.exit(f'unknown id: {row_id}')
            out[group].append({
                'id': row_id,
                'original_en': {k: en[row_id][k] for k in AUDIT_FIELDS},
                'original_es_feature': es[row_id]['funcionalidad'],
                'current_note': notes.get(row_id),
            })
    json.dump(out, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(out_path, {g: len(v) for g, v in out.items()})


def merge(in_path):
    data = json.load(open(in_path, encoding='utf-8'))
    if isinstance(data, dict) and 'result' in data:
        data = data['result']
    rows = [r for item in data for r in item['rows']] if data and 'rows' in data[0] else data
    notes = load_notes()
    index = {n['id']: i for i, n in enumerate(notes)}
    changed = added = 0
    for r in rows:
        assert r['kind'] in KINDS, f"{r['id']}: kind {r['kind']}"
        assert all(isinstance(p, int) for p in r['prs']), f"{r['id']}: prs must be PR numbers"
        if r['kind'] in ('done', 'partial'):
            assert r['prs'], f"{r['id']}: {r['kind']} needs the PR numbers"
        entry = {k: r[k] for k in ('id', 'kind', 'prs', 'note_en', 'note_es')}
        if r.get('evidence'):
            entry['evidence'] = r['evidence']
        if r['id'] in index:
            notes[index[r['id']]] = entry
            changed += 1
        else:
            index[r['id']] = len(notes)
            notes.append(entry)
            added += 1
    json.dump(notes, open(NOTES_PATH, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'merged into {NOTES_PATH.name}: {changed} replaced, {added} added, {len(notes)} in total')


if __name__ == '__main__':
    if len(sys.argv) >= 4 and sys.argv[1] == 'export':
        export(sys.argv[2], sys.argv[3:])
    elif len(sys.argv) == 3 and sys.argv[1] == 'merge':
        merge(sys.argv[2])
    else:
        sys.exit(__doc__)
