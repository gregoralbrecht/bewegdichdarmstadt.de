# Tasks

## 1. Rules

- [x] 1.1 Add `rules:` for proposal, design, specs and tasks to `openspec/config.yaml` as listed in the proposal; verify `openspec instructions proposal --change openspec-lean-rules --json` returns the new proposal rules
- [x] 1.2 Add the `## Log` convention to working principle 1 in `CLAUDE.md`; verify by reading the diff
- [x] 1.3 Run `openspec validate openspec-lean-rules` and verify it passes

## Log

- Gotcha: a rule containing `: ` (e.g. `skip_specs: true`) parses as a YAML mapping and OpenSpec silently drops that artifact's whole rule list. Quote such rules; check with `openspec instructions <artifact> --json`.
- Deviation: CLAUDE.md also says to archive with `openspec archive`, not by moving folders (the reason the pitch specs never synced).

## Workflow follow-up

- Archive with `openspec archive` (not a manual move).
