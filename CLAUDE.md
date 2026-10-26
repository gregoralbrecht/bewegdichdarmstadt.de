# bewegdichdarmstadt.de

## Working principles

1. **Every code change goes through OpenSpec.** Propose a change, implement its tasks, archive it. The OpenSpec archive (`openspec/changes/archive/`) is the worklog for all code changes. "Code" includes source, config, build and deploy scripts. Non-code changes (docs, notes, specs written by hand) don't need a change.
2. **Never write to the playbook (`~/Developer/playbook`) without explicit permission.** Suggest what to log there and wait for a yes.
3. **The repo is the single source of truth.** Every artifact, document and decision gets committed here in some form. Docs co-created with the client live outside the repo; their decisions get transferred into the repo (e.g. `docs/` or the relevant spec). When the two disagree, the repo wins.
