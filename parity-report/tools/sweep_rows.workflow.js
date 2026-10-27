export const meta = {
  name: 'parity-sweep-rows',
  description: 'Check parity report rows that no PR was linked to against the work merged since the notes were written; draft and adversarially verify notes for the ones that changed',
  whenToUse: 'After review_notes.workflow.js, on rows picked by topic words that the first pass did not cover; run on the output of tools/review_rows.py export',
  phases: [
    { title: 'Screen', detail: 'one agent per group: which of these rows did merged work change?' },
    { title: 'Verify', detail: 'one adversarial verifier per group: wrong notes, and changed rows marked unchanged' },
  ],
}

// Script for an agent workflow runner. Arguments (args):
//   input   absolute path of the JSON written by `tools/review_rows.py export`
//   code    absolute path of a read-only checkout of the code to check against
//   changes plain-text description of what was merged since the notes were
//           last written: the PRs, what they do, and where to read more
//   groups  the group names used in the export
// Most rows are expected to be unchanged (kind "none"). The result is a list
// of { group, rows }; save it as JSON and merge it with
// `tools/review_rows.py merge --skip-none`, which keeps only the rows that changed.

const CONTEXT = `
You are helping update a web-vs-mobile and iOS-vs-Android feature parity report for SparkyFitness (parity-report/ in the repository; read parity-report/AGENTS.md first). The report is a static code audit of main @ 5364674f. Its rows are NOT to be changed; a row that later work changed only gets an update note: a status (kind and prs) plus a short note in English and Spanish.

What was merged since the notes were last written:
${args.changes}

Code to check against: a read-only checkout at ${args.code}. Do not edit anything anywhere and do not run test suites.

The rows to check are in ${args.input}, keyed by group (fields: original_en with the audit's columns, original_es_feature, current_note). No merged PR was linked to these rows yet; they were picked by topic words, so most of them are probably unchanged. Rows that were linked to PRs are reviewed separately; ignore those.

When is a row changed? Only when merged work makes something the row states wrong or out of date in a way a reader comparing platforms would care about: a feature that was on one side only now exists (fully or partly) on the other, an iOS/Android difference closed or changed, a limitation the row describes is gone, or the row's description of how the feature works is now wrong (for example it says "one entry per day" and now there can be several). A change that keeps everything the row says true (internal refactor, server robustness, a bug fix, a wording tweak, a new option the row does not talk about) is not a change: kind "none".

Status model:
- kind "done": the gap the row describes is closed, or the row is updated by the merged work (minor remaining differences can be named in the note).
- kind "partial": part of the gap is closed and part remains; the note says what remains.
- kind "none": merged work does not change the row (note_en and note_es empty strings).
- prs: the merged PR numbers that changed the row; empty for none.

Writing rules for note_en and note_es:
- Describe the current state of the code, not the history. One to three short sentences in plain words. Say what is now the same and what still differs. Never claim something the code does not back.
- Check translation claims against the shipped locales (SparkyFitnessMobile/src/localization/localeRegistry.json), the mobile catalogs and native resource folders before writing "English only" or "translated".
- Spanish is natural Spain Spanish with the same content (Quick Settings = Ajustes rápidos, tile = baldosa); keep identifiers and product names as they are.
- Do not put the status label in the note, and do not mention reviews, tools or how the work was done.`

const ROW = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    kind: { type: 'string', enum: ['done', 'partial', 'none'] },
    prs: { type: 'array', items: { type: 'integer' } },
    note_en: { type: 'string' },
    note_es: { type: 'string' },
    evidence: { type: 'string', description: 'file:line references in the checkout backing the note (empty for none)' },
    why: { type: 'string', description: 'one line: why this kind (for none, which PRs were considered and why they do not change the row)' },
  },
  required: ['id', 'kind', 'prs', 'note_en', 'note_es', 'evidence', 'why'],
}
const SCREENED = { type: 'object', properties: { rows: { type: 'array', items: ROW } }, required: ['rows'] }
const VERIFIED = {
  type: 'object',
  properties: { rows: { type: 'array', items: { ...ROW, properties: { ...ROW.properties, changed: { type: 'boolean' } }, required: [...ROW.required, 'changed'] } } },
  required: ['rows'],
}

const results = await pipeline(
  args.groups,
  g => agent(`${CONTEXT}\n\nCheck every row of group "${g}" in the input file. For each, decide from what was merged and the current code whether merged work changed it; for changed rows read the code and write the note. Return every row of the group.`,
    { label: `screen:${g}`, phase: 'Screen', schema: SCREENED }),
  (screen, g) => agent(`${CONTEXT}\n\nAnother agent screened group "${g}" and returned:\n${JSON.stringify(screen?.rows ?? [], null, 1)}\n\nAdversarially verify it. For every row marked done or partial: is the change real in the code, are kind and prs right, is every claim backed (translations especially), does the Spanish say the same naturally? For every row marked none: try to find a merged PR that does change what the row says; if you find one, write the note. Return every row of the group (also rows the screen missed), corrected where needed, with changed=true and the reason in why when you changed something.`,
    { label: `verify:${g}`, phase: 'Verify', schema: VERIFIED }).then(v => ({ group: g, rows: v?.rows ?? [] })),
)
return results.filter(Boolean)
