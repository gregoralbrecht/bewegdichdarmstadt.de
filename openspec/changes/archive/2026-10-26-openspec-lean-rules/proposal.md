# Proposal

## Why

The first change (`pitch-site-v1`) ran to about 5,100 words plus 8 spec files. With a solo developer and no reviewer, artifacts that long go unread. Changes should be short enough to read, while the archive keeps working as the worklog.

## What Changes

- Add `rules:` to `openspec/config.yaml` so every artifact stays short:
  - **proposal:** one screen; why, in/out of scope, decisions as "X over Y, because Z".
  - **design:** only for real tradeoffs; otherwise decisions live in the proposal.
  - **specs:** only for user-visible behavior that must survive later changes; terse (one requirement, one scenario, no prose); tooling changes set `skip_specs: true`.
  - **tasks:** small and checkable; end with a `## Log` section filled during apply (deviations, gotchas, follow-ups).
- Mention the Log convention in CLAUDE.md working principle 1.

Out of scope: a custom schema (revisit if this proves too heavy after 3–4 changes); syncing `pitch-site-v1` specs (see Decisions).

Decisions:
- Rules on `spec-driven` over a custom lean schema, because it is reversible and keeps specs and archive sync.
- Leave the pitch specs unsynced, because the pitch is frozen and production specs start fresh. They never synced because the archive was a manual `git mv`, not `openspec archive`; future archives use the CLI.

## Capabilities

### New Capabilities

None. Tooling change, `skip_specs: true`.

### Modified Capabilities

None.

## Impact

`openspec/config.yaml`, `CLAUDE.md`. No code or runtime behavior.
