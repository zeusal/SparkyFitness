export const meta = {
  name: 'parity-review-notes',
  description: 'Draft and adversarially verify update notes for parity report rows against the current code',
  whenToUse: 'After merged PRs change rows of parity-report; run on the output of tools/review_rows.py export',
  phases: [
    { title: 'Draft', detail: 'one drafter per row group, reading the current code' },
    { title: 'Verify', detail: 'one adversarial verifier per group, correcting the drafts' },
  ],
}

// Script for an agent workflow runner. Arguments (args):
//   input   absolute path of the JSON written by `tools/review_rows.py export`
//   code    absolute path of a read-only checkout of the code to check against
//           (for example a worktree of upstream main)
//   changes plain-text description of what changed since the notes were last
//           written: merged PRs, what they do, what was planned and not done
//   groups  the group names used in the export
// The result is a list of { group, rows }; save it as JSON and merge it with
// `tools/review_rows.py merge`.

const CONTEXT = `
You are updating notes in a web-vs-mobile and iOS-vs-Android feature parity report for SparkyFitness (parity-report/ in the repository; read parity-report/AGENTS.md first). The report is a static code audit of main @ 5364674f. Its rows are NOT to be changed; each affected row only gets an update note: a status (kind and prs) plus a short note in English and Spanish.

What changed since the notes were last written:
${args.changes}

Code to check against: a read-only checkout at ${args.code}. Do not edit anything anywhere and do not run the test suite.

The rows to review are in ${args.input}, keyed by group. Each row has the original audit fields (original_en), the Spanish feature name and its current note, if any.

Status model:
- kind "done": the gap the row describes is closed, or the row is updated by the merged work (minor remaining differences can be named in the note).
- kind "partial": part of the gap is closed and part remains; the note says what remains.
- kind "open": nothing merged changed the row, and something planned for it has not been done.
- kind "none": the merged work does not change the row; no note.
- prs: the merged PR numbers that changed the row; empty for open and none.

Writing rules for note_en and note_es:
- Describe the current state of the code, not the history. One to three short sentences in plain words. Say what is now the same and what still differs. Never claim something the code does not back.
- Check translation claims against the shipped locales (SparkyFitnessMobile/src/localization/localeRegistry.json), the mobile catalogs and the native resource folders before writing "English only" or "translated".
- Spanish is natural Spain Spanish with the same content (Quick Settings = Ajustes rápidos, tile = baldosa); keep identifiers and product names as they are.
- Do not put the status label in the note, and do not mention reviews, tools or how the work was done.`

const ROW = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    kind: { type: 'string', enum: ['done', 'partial', 'open', 'none'] },
    prs: { type: 'array', items: { type: 'integer' } },
    note_en: { type: 'string' },
    note_es: { type: 'string' },
    evidence: { type: 'string', description: 'file:line references in the checkout backing the note' },
  },
  required: ['id', 'kind', 'prs', 'note_en', 'note_es', 'evidence'],
}
const DRAFT = { type: 'object', properties: { rows: { type: 'array', items: ROW } }, required: ['rows'] }
const VERIFIED = {
  type: 'object',
  properties: {
    rows: { type: 'array', items: { ...ROW, properties: { ...ROW.properties, changed: { type: 'boolean' }, why: { type: 'string' } }, required: [...ROW.required, 'changed', 'why'] } },
  },
  required: ['rows'],
}

const results = await pipeline(
  args.groups,
  g => agent(`${CONTEXT}\n\nDraft the notes for every row of group "${g}" in the input file. Read the code each row is about before writing.`,
    { label: `draft:${g}`, phase: 'Draft', schema: DRAFT }),
  (draft, g) => agent(`${CONTEXT}\n\nAnother agent drafted these notes for group "${g}":\n${JSON.stringify(draft?.rows ?? [], null, 1)}\n\nAdversarially verify every one against the code and the original row: wrong kind or prs, claims the code does not back (translations especially), anything important left out, Spanish that does not say the same as the English or reads unnaturally. Return every row of the group (also rows the draft missed), corrected where needed, with changed=true and the reason when you changed something.`,
    { label: `verify:${g}`, phase: 'Verify', schema: VERIFIED }).then(v => ({ group: g, rows: v?.rows ?? [] })),
)
return results.filter(Boolean)
