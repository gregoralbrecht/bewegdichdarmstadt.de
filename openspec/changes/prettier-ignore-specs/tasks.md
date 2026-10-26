# Tasks

## 1. Ignore

- [x] 1.1 Add `openspec/**/specs/` to `.prettierignore`; verify `pnpm format:check` passes and `pnpm prettier --check openspec/specs/site-layout/spec.md` reports the file as ignored

## Log

- Prettier prints no "ignored" notice for an ignored file passed by path; it just reports success. Verified instead by adding blank lines to `openspec/specs/site-layout/spec.md` and confirming `pnpm format:check` still passes.

## Workflow follow-up

- Archive with `openspec archive prettier-ignore-specs`.
