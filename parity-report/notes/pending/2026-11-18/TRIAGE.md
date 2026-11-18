# Triage of PRs merged between 26 Oct and 18 Nov 2026 for the parity report

Work in progress for the next update of the report (see `../../../AGENTS.md`). The notes in `parity-report/notes/` cover everything merged up to `e5547e39f` (26 Oct 2026); `notes/pending/pr-3228.json` holds notes written for #3228 (Android widgets resizable, merged 28 Oct) against its branch. This folder holds the work for the 269 PRs merged up to upstream main `a7c6257bf` (18 Nov 2026): `batches.json` (PRs by theme, `_chores` are releases, translation syncs, Helm, CI and docs, not triaged), `triage/<batch>.json` (one file per batch), then the drafted and verified notes.

## Instructions for a triage agent

Read `/home/user/SparkyFitness/parity-report/AGENTS.md` first: it explains the report, its CSV columns, the update-note model and the tools.

- The audit rows: `/home/user/SparkyFitness/parity-report/original/sparkyfitness-feature-parity.csv` (1,373 rows; look rows up, do not read it whole). Current notes: `parity-report/notes/parity-notes.json`, `notes/new-features.json` (features no row covers) and the update section with its "possible issues" in `notes/parity-summary.json`.
- Current code: a read-only checkout of upstream main (a7c6257bf) at `/home/user/sf-main`. Git history: `/home/user/SparkyFitness` (remote `upstream`). Each PR's commit is `sha` in the batch: for `kind: merge`, `git -C /home/user/SparkyFitness diff <sha>^1 <sha>`; for `kind: squash`, `git -C /home/user/SparkyFitness show <sha>` (use `--stat` first).
- Tools: `python3 -I /home/user/SparkyFitness/parity-report/tools/find_rows.py <terms>` (`--any` for any term, `--git <sha>^1..<sha>` for rows citing changed files, noisy).
- Do not edit, stage, commit, checkout or stash anything in either directory, and do not run test suites. Write only your output file.

For each PR in your batch (`batches.json`, key given in your prompt):
1. Work out what changed for a user and where: web (`SparkyFitnessFrontend`), mobile on iOS, on Android, a watch (Apple Watch `targets/watch*`, Wear OS `targets/wearos`), or only the server. Read the diff and the current code; a later PR may extend or undo an earlier one, so check `/home/user/sf-main`.
2. Find every audit row whose facts the PR changes (a one-sided feature now on the other side, an iOS/Android difference closed or changed, a limitation gone, the row's description now wrong). Ignore rows not changed in substance.
3. Also list existing notes, new-features entries and summary "possible issues" the PR makes wrong or fixes.
4. A user-facing feature nothing covers is a new feature, with where it is available.

Write `/home/user/SparkyFitness/parity-report/notes/pending/2026-11-18/triage/<batch key>.json`, a JSON list, one object per PR:
`{ "pr", "user_visible", "surfaces": {"web","ios","android","watch","server_only"}, "summary", "affected_rows": [{"id","change"}], "new_features_entries": [{"name_en","change"}], "possible_issues": [{"issue","change"}], "new_feature": null | {"name","description","web","ios","android","watch","evidence"} }`, with file:line evidence on `/home/user/sf-main` in every `change`. Be exact; prefer fewer correct links over guesses. Reply with only the path and a one-line count.
