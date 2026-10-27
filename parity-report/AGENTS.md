# Feature parity report: guide

_Last updated: 2026-10-26_

This folder holds the SparkyFitness feature parity report: every user-reachable feature of the web app (`SparkyFitnessFrontend/`) and the mobile app (`SparkyFitnessMobile/`) compared side by side, plus the differences between iOS and Android inside the mobile app. It is a working document kept on a branch, not part of any package: it is outside the pnpm workspace, and lint-staged and Prettier never touch it (do not run Prettier on it).

## What the report is

- A static code audit of `main` @ `5364674f`, in English and Spanish. It has 1,373 rows: 1,204 from the functional domains (sections 2.1 to 2.14) and 169 from the iOS/Android sweeps (section 3). Every difference was checked by two independent verifiers, and every row cites the files it was found in.
- The audit itself is frozen. Work done after it is recorded only as **update notes**: a status and a short note in each language on the rows it changes. The counts in the audit are not recalculated.

## Files

| Path | What it is |
|---|---|
| `sparkyfitness-feature-parity.md`, `.csv` | The report in English, with the update notes. Built, do not edit by hand. |
| `paridad-web-movil.md`, `.csv` | The same in Spanish. Built, do not edit by hand. |
| `sparkyfitness-feature-parity.html` | A self-contained page (Explorer with filters, and an Executive summary tab), in English. Built, do not edit by hand. |
| `original/` | The audit as delivered, without update notes: the four report files and the page. Never edit these. |
| `notes/parity-notes.json` | The current update notes, one entry per reviewed row. This is what you edit. |
| `notes/parity-summary.json` | The update section at the top of the Markdown, the notes on summary lines, and the page texts. Edit this too. |
| `notes/new-features.json` | Features added since the audit that no row covers, listed after the update section in the Markdown and on the page's Executive summary tab. Edit this too. |
| `notes/history/` | Earlier note sets, kept for reference. |
| `tools/` | Scripts to find rows, review notes, build the files and check them (see below). |

### Report layout

- Markdown sections: 0 Executive summary (0.1 web only, 0.2 mobile only, 0.3 iOS vs Android, 0.4 possible issues), 1 Summary by domain, 2 Detail by domain (2.1 to 2.14, one bold bullet per row), 3 iOS ↔ Android (3.1 iOS only, 3.2 Android only, 3.3 on both but different), 4 Methodology.
- CSV columns (English): `group, id, feature, description, web, mobile, mobile_platform, category, verification, web_evidence, mobile_evidence, platform_notes, notes, corrections`, then the two update columns `update_status, update_notes`. Spanish: `grupo, id, funcionalidad, descripcion, web, movil, plataforma_movil, categoria, verificacion, evidencia_web, evidencia_movil, notas_plataforma, notas, correcciones`, then `estado_actualizacion, notas_actualizacion`. The `id` is the same in both languages and in the page.
- Values: `web` and `mobile` are Yes, No or Partial; `mobile_platform` is `iOS & Android`, `iOS only`, `Android only`, `Differs iOS/Android` or `—`; `category` is `parity`, `partial`, `web_only`, `mobile_only` or `none`.
- The CSVs are UTF-8 without a BOM, with CRLF line endings (kept by `.gitattributes`).

## Update notes

Each entry in `notes/parity-notes.json` is:

```json
{ "id": "native-widget-water", "kind": "done", "prs": [3020], "note_en": "…", "note_es": "…", "evidence": "file:line references" }
```

- `kind`:
  - `done`: the merged work closes the gap the row describes, or updates the row (remaining differences go in the note).
  - `partial`: part of the gap is closed; the note says what remains.
  - `open`: nothing merged changed the row, and something planned for it has not been done.
  - `none`: the merged work does not change the row. The entry is kept as a record that it was looked at; it adds nothing to the report.
- `prs`: the merged PR numbers that changed the row; empty for `open` and `none`.
- The label is generated from `kind` and `prs` (`label()` in `tools/apply_parity_update.py`, and the same rule in the page's script):

| kind | English | Spanish |
|---|---|---|
| done | Updated in PR #2989 (merged) / Updated in PRs #2989 and #3020 (merged) | Actualizado en la PR #2989 (fusionada) / Actualizado en las PR #2989 y #3020 (fusionadas) |
| partial | Partly covered by PR … (merged) | Cubierto en parte por la PR … (fusionada) |
| open | Still open | Sigue pendiente |

- In the Markdown a note goes as a sub-bullet under the row's bold entry (in section 2 matched by group, in section 3 by platform), or under a plain `- Name` list line when the row has no bold entry. In the CSV it fills the two update columns. In the page it is the row's badge and its "Update" field.

`notes/parity-summary.json` has, per language (`en`, `es`): `insert_after_line` (the update section goes after line 4, the title block), `section` (its Markdown lines), and `anchors` (summary lines in section 0 that get a note: `line` is the exact original line, plus `label` and `text`; English anchors also carry `html_anchor`, the text that line ends with on the page) and `new_features_heading` (the heading of the new features list). The `page` object holds the page's `date_label`, `lede_html` and the extra `filters` of the Updates select (a `value` is a kind, such as `done`, `partial` or `open`, or a PR number).

Each entry in `notes/new-features.json` has `name_en`, `name_es`, `description_en`, `description_es`, `web`, `ios` and `android` (Yes, No or Partial), `watch` (`Apple Watch`, `Wear OS`, `both` or `none`), `prs` and `evidence`. The Markdown and the page show where it is available from those values.

## Current state (2026-10-26)

- The notes cover everything merged into `main` up to `e5547e39f` (26 Oct 2026): 179 PRs. The 53 merged up to 20 Oct (#3025 and earlier, including #2989, #3020 and #3021) are in v1.9.0; the other 126 were not in a release yet. The next update starts from `git log --first-parent e5547e39f..upstream/main`.
- 173 rows have a note (`done`, `partial` or `open`) and 7 more are recorded as `none`; `notes/new-features.json` lists 27 features no row covers. The biggest change is #3052, the Wear OS companion app (about 70 rows). Others: Android quick access and widgets (#2989, #3020), Compare, mood check-ins, heart rate zones and reports, routes, running and training programs on the web (#2948), medications adherence on mobile (#3103), progress photos on the web (#2965) and custom measurements on mobile (#3194).
- How the notes were written: a triage of every merged PR from its diff, a drafted and adversarially verified note for each row it linked (156 rows), a sweep of 436 more rows picked by topic words (17 had changed), and a final cross-check of the notes by topic, of the summary and of the new features.
- Possible issues recorded in the summary: the Android release workflow does not build or bundle the Wear OS app (`SPARKY_EMBED_WEAROS_RELEASE` is not set); starting a fast from Wear OS fails (preset `16:8` sent, `16-8` expected); on Android with a Wear OS watch, "Start on watch" and "Send to watch" on a saved route do not work as on iOS; on iOS an account change does not clear the widgets.
- Still open: consumed and burned on the Android calories widget, and more sizes or resizing for the calories and macros widgets ([#2050](https://github.com/CodeWithCJ/SparkyFitness/issues/2050)). Lock-screen widgets, Siri/Shortcuts and the Remove water, Start fast and End fast controls are iOS-only.
- Translations at this point: the `quickActions.*` strings are translated in 10 of the 15 shipped non-English locales; the Android tile names, the water widget texts and the Log water shortcut's long label in 6 (es, pl, pt-BR, yue-Hant, zh-Hans, zh-Hant), while the Log water result messages and the "Quick logging" channel are English only; the Wear OS and Apple Watch apps' own texts and the mobile Custom Measurements screens are English only.
- `notes/history/2026-10-19-parity-notes.json` is the first note set, written while #2989 was open and an Android widgets PR was planned, with an older status model (`done_pr1`, `partial_pr1`, `planned_pr2`, `partial_pr1_planned_pr2`, `none`). `notes/history/2026-10-21-parity-notes.json` is the set for #2989, #3020 and #3021 alone.

## Updating after new work is merged

1. Get a read-only checkout of current `main` to check against, for example `git fetch upstream main && git worktree add --detach ../sf-main upstream/main`.
2. Find the rows the work may change:
   - `python3 -I parity-report/tools/find_rows.py --git <sha>^1..<sha>` lists rows whose evidence cites a file changed by a merge commit (it matches file names, so expect some noise).
   - `python3 -I parity-report/tools/find_rows.py <term> [<term> …]` searches the rows' text and evidence.
   - `python3 -I parity-report/tools/find_rows.py --noted` lists rows that already have a note; an `open` row may now be `done`, and a note's wording may now be wrong.
3. Export them, grouped by topic: `python3 -I parity-report/tools/review_rows.py export /tmp/review.json widgets=id1,id2 tiles=id3,id4`.
4. Write and verify the notes against the checkout. `tools/review_notes.workflow.js` does this with one drafting and one adversarial verifying agent per group (arguments: `input`, `code`, `changes`, `groups`); its result, or a hand-written list of rows, goes back in with `python3 -I parity-report/tools/review_rows.py merge result.json`.
5. Sweep the rows no PR was linked to. When much was merged, the search in step 2 misses rows whose text a PR made wrong without touching the files they cite. Pick rows by topic words with `python3 -I parity-report/tools/find_rows.py --any --unnoted --ids <word> …` (rows that mention any of the words and have no notes entry yet), export them by topic and run `tools/sweep_rows.workflow.js` on them (same arguments). Most come back unchanged; merge the result with `python3 -I parity-report/tools/review_rows.py merge result.json --skip-none`, which keeps only the rows that changed.
6. Update `notes/parity-summary.json`: the update section in both languages (date, what was merged, what is still open), the summary-line notes, and the page's `date_label`, `lede_html` and `filters`.
7. Build: `python3 -I parity-report/tools/apply_parity_update.py` and `python3 -I parity-report/tools/update_parity_page.py`.
8. Check: `python3 -I parity-report/tools/check_additive.py` must end with `OK: only notes were added`. `node parity-report/tools/check_page.cjs [out_dir]` (needs the `playwright` package; set `CHROMIUM_PATH` to use a given browser) loads the page, tries every Updates filter and checks the phone width, and saves screenshots.
9. Read the result (`git diff --stat`, and the new notes in the Markdown) and update the "Current state" section of this guide.

## Rules for notes

- Never edit `original/` or the text of the audit, and do not recalculate its counts.
- Describe the current state of `main`, not the history of commits: one to three short sentences in plain words, saying what is now the same and what still differs.
- Back every claim with the code (keep `file:line` references in `evidence`). Check translation claims against the shipped locales (`SparkyFitnessMobile/src/localization/localeRegistry.json`), the mobile catalogs, the Android resource folders (`targets/android-widget/res/values-*`) and hard-coded native strings before writing "translated" or "English only".
- English and Spanish say the same thing. The Spanish is natural Spain Spanish (Quick Settings = Ajustes rápidos, tile = baldosa); identifiers and product names stay as they are.
- Do not put the status label inside the note, and do not mention reviews, tools or how the work was done.
- Labels only name merged PRs. Planned work that has not been merged is `open`, not a status of its own.
- Commits that change this folder follow the repository's commit conventions (root `AGENTS.md`).
