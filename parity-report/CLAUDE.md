See @AGENTS.md

- The page is also published at https://claude.ai/artifact/JXQNSqiFmzaHTd8vXNrjmN. After rebuilding `sparkyfitness-feature-parity.html`, republish it there with the Artifact tool, passing that URL.
- `tools/review_notes.workflow.js` is a script for the Workflow tool: run it with `scriptPath` and `args` `{ input, code, changes, groups }`, save the returned list as JSON and merge it with `python3 -I parity-report/tools/review_rows.py merge <file>`.
