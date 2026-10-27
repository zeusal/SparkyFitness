"""Build the annotated parity report (Markdown and CSV, English and Spanish).

Usage, from anywhere: python3 -I parity-report/tools/apply_parity_update.py

Reads the untouched audit from original/, the row notes from
notes/parity-notes.json, the summary texts from notes/parity-summary.json and
the features added since the audit from notes/new-features.json, and writes
the four report files at the top of parity-report/. Nothing in the audit
changes: each CSV gains two trailing columns, and each Markdown file gains the
update section (with the list of new features) after the title block, plus
sub-bullets under the rows and summary lines the notes are about.
"""
import csv
import io
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIG = ROOT / 'original'
NOTES = {n['id']: n for n in json.load(open(ROOT / 'notes' / 'parity-notes.json', encoding='utf-8')) if n['kind'] != 'none'}
SUMMARY = json.load(open(ROOT / 'notes' / 'parity-summary.json', encoding='utf-8'))
NEW_FEATURES_PATH = ROOT / 'notes' / 'new-features.json'
NEW_FEATURES = json.load(open(NEW_FEATURES_PATH, encoding='utf-8')) if NEW_FEATURES_PATH.exists() else []

PLACES = {
    'en': {'web': 'web', 'ios': 'iOS', 'android': 'Android', 'Apple Watch': 'Apple Watch', 'Wear OS': 'Wear OS',
           'only': ' only', 'partial': ' (partly)'},
    'es': {'web': 'web', 'ios': 'iOS', 'android': 'Android', 'Apple Watch': 'Apple Watch', 'Wear OS': 'Wear OS',
           'only': ' (solo)', 'partial': ' (en parte)'},
}


def where(feature, lang):
    """Where a new feature is available, e.g. "web, iOS and Android"."""
    p = PLACES[lang]
    parts = []
    for key in ('web', 'ios', 'android'):
        value = feature[key]
        if value == 'Yes':
            parts.append(p[key])
        elif value == 'Partial':
            parts.append(p[key] + p['partial'])
    watch = feature.get('watch', 'none')
    for w in (['Apple Watch', 'Wear OS'] if watch == 'both' else [watch] if watch in ('Apple Watch', 'Wear OS') else []):
        parts.append(p[w])
    if len(parts) == 1:
        return parts[0] + p['only']
    joiner = ' and ' if lang == 'en' else ' y '
    return ', '.join(parts[:-1]) + joiner + parts[-1]


def new_feature_lines(lang):
    if not NEW_FEATURES:
        return []
    head = SUMMARY[lang]['new_features_heading']
    lines = [head, '']
    for f in NEW_FEATURES:
        prs = ', '.join(f'#{n}' for n in f['prs'])
        lines.append(f"- **{f[f'name_{lang}']}** ({where(f, lang)}; {prs}): {f[f'description_{lang}']}")
    lines.append('')
    return lines


def pr_list(prs, lang):
    refs = [f'#{p}' for p in prs]
    if len(refs) == 1:
        return refs[0]
    joiner = ' and ' if lang == 'en' else ' y '
    return ', '.join(refs[:-1]) + joiner + refs[-1]


def label(note, lang):
    """The status label, from the note's kind and PR numbers."""
    kind, prs = note['kind'], sorted(note['prs'])
    if kind == 'open':
        return 'Still open' if lang == 'en' else 'Sigue pendiente'
    many = len(prs) > 1
    if lang == 'en':
        verb = 'Updated in' if kind == 'done' else 'Partly covered by'
        return f"{verb} PR{'s' if many else ''} {pr_list(prs, 'en')} (merged)"
    verb = 'Actualizado en' if kind == 'done' else 'Cubierto en parte por'
    art = 'las PR' if many else 'la PR'
    return f"{verb} {art} {pr_list(prs, 'es')} ({'fusionadas' if many else 'fusionada'})"


FILES = {
    'en': ('sparkyfitness-feature-parity', ['update_status', 'update_notes'], 'feature', 'group', 'mobile_platform'),
    'es': ('paridad-web-movil', ['estado_actualizacion', 'notas_actualizacion'], 'funcionalidad', 'grupo', 'plataforma_movil'),
}
# Section 3 headings -> mobile_platform value of the rows listed there.
PLATFORM_BY_SECTION = {
    'en': {'3.1': 'iOS only', '3.2': 'Android only', '3.3': 'Differs iOS/Android'},
    'es': {'3.1': 'Solo iOS', '3.2': 'Solo Android', '3.3': 'Difiere iOS/Android'},
}


def update_csv(lang):
    base, new_cols, *_ = FILES[lang]
    rows = list(csv.reader(open(ORIG / f'{base}.csv', newline='', encoding='utf-8')))
    header = rows[0]
    id_col = header.index('id')
    unknown = set(NOTES) - {r[id_col] for r in rows[1:]}
    assert not unknown, f'notes for ids not in the audit: {sorted(unknown)}'
    rows[0] = header + new_cols
    for row in rows[1:]:
        note = NOTES.get(row[id_col])
        row += [label(note, lang), note[f'note_{lang}']] if note else ['', '']
    out = io.StringIO()
    csv.writer(out, lineterminator='\r\n').writerows(rows)
    open(ROOT / f'{base}.csv', 'w', encoding='utf-8', newline='').write(out.getvalue())
    return {r[id_col]: dict(zip(header, r)) for r in rows[1:]}


def update_md(lang, by_id):
    base, _, name_col, group_col, plat_col = FILES[lang]
    lines = open(ORIG / f'{base}.md', encoding='utf-8').read().split('\n')
    summary = SUMMARY[lang]
    by_name = {}
    for row_id in NOTES:
        by_name.setdefault(by_id[row_id][name_col], []).append(row_id)
    anchors = {a['line']: a for a in summary['anchors']}
    used_anchors = set()
    out, section, applied = [], ('', ''), []
    for i, line in enumerate(lines):
        out.append(line)
        if i == summary['insert_after_line'] - 1:
            out.extend(summary['section'])
            out.extend(new_feature_lines(lang))
        if line in anchors:
            a = anchors[line]
            indent = len(line) - len(line.lstrip(' ')) + 2
            out.append(' ' * indent + f"- **{a['label']}:** {a['text']}")
            used_anchors.add(line)
            continue
        m = re.match(r'^###\s+(\d+\.\d+)\s+(.*)$', line)
        if m:
            section = m.group(1), m.group(2)
            continue
        m = re.match(r'^- \*\*(.+?)\*\*', line)
        if not m or m.group(1) not in by_name:
            continue
        ids = by_name[m.group(1)]
        num, title = section
        if num.startswith('2.'):
            ids = [i for i in ids if by_id[i][group_col] == title] or ids
        elif num in PLATFORM_BY_SECTION[lang]:
            plat = PLATFORM_BY_SECTION[lang][num]
            ids = [i for i in ids if by_id[i][plat_col] == plat] or ids
        seen = set()
        for row_id in ids:
            note = NOTES[row_id]
            key = (label(note, lang), note[f'note_{lang}'])
            if key in seen:
                continue
            seen.add(key)
            out.append(f"  - **{key[0]}:** {key[1]}")
            applied.append((num, m.group(1), row_id))
    missing_anchors = set(anchors) - used_anchors
    assert not missing_anchors, f'summary anchors not found in the original: {missing_anchors}'
    # A row with no bold entry can still be listed by name alone ("- Name"),
    # or by name and a short remark ("- Name — No web equivalent.").
    for row_id in sorted(set(NOTES) - {a[2] for a in applied}):
        plain = f"- {by_id[row_id][name_col]}"
        hits = [i for i, l in enumerate(out) if l == plain or l.startswith(plain + ' — ')]
        if len(hits) != 1:
            continue
        note = NOTES[row_id]
        out.insert(hits[0] + 1, f"  - **{label(note, lang)}:** {note[f'note_{lang}']}")
        applied.append(('list', by_id[row_id][name_col], row_id))
    open(ROOT / f'{base}.md', 'w', encoding='utf-8').write('\n'.join(out))
    return applied


if __name__ == '__main__':
    for lang in ('en', 'es'):
        by_id = update_csv(lang)
        applied = update_md(lang, by_id)
        missing = sorted(set(NOTES) - {a[2] for a in applied})
        print(lang, '| row notes placed in the Markdown:', len(applied), '| rows without a Markdown entry:', missing)
