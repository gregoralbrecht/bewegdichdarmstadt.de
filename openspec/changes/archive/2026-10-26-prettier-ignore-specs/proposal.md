# Proposal

## Why

`openspec archive` writes main specs that Prettier then reformats, so `pnpm format:check` fails after every archive that adds or changes a spec. Specs are generated and read by the OpenSpec CLI; their formatting is the CLI's business.

## What Changes

- Add `openspec/**/specs/` to `.prettierignore`, covering main specs and change delta specs.

Out of scope: other OpenSpec artifacts (proposal, tasks), which stay formatted.

Decisions:

- Ignore specs over running Prettier after each archive, because the extra step is easy to forget and the diff is noise.

## Capabilities

### New Capabilities

None. Tooling change, `skip_specs: true`.

### Modified Capabilities

None.

## Impact

`.prettierignore`. No code or runtime behavior.
