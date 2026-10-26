# Tasks

## 1. Workspace

- [x] 1.1 Add root `package.json` (private, `type: module`, `packageManager` pnpm 12, `engines.node >=24`), `pnpm-workspace.yaml` listing `web`, and `.nvmrc` (24); verify `pnpm install` succeeds and `pitch/` is not a workspace package
- [x] 1.2 Extend `.gitignore` with `dist/`, `.astro/` and `node_modules/` at any depth; verify `git status` shows no build output after a build

## 2. Astro app

- [x] 2.1 Create `web/` with Astro 7, `astro/tsconfigs/strict`, and one static `index.astro` hello page (`lang="de"`, title, single `<h1>`); verify `pnpm --filter web build` writes `web/dist/index.html`
- [x] 2.2 Add TypeScript `^7` and confirm Astro's strict tsconfig preset has no options TS 7 rejects (override any in `web/tsconfig.json`); verify `tsc --noEmit` reports 0 errors
- [x] 2.3 Add a `check` script running `tsc --noEmit` in `web/`; verify `pnpm --filter web check` reports 0 errors

## 3. Format and lint

- [x] 3.1 Add Prettier + `prettier-plugin-astro` at the root with a `.prettierignore` covering `pitch/`, `openspec/changes/archive/`, build output and the lockfile; verify `pnpm format:check` passes after `pnpm format`
- [x] 3.2 Add oxlint at the root with a config ignoring `pitch/` and build output; verify `pnpm lint` passes and fails on a deliberately unused variable

## 4. Tests

- [x] 4.1 Add Vitest in `web/` and one unit test for a small real helper (e.g. the page-title formatter used by the hello page); verify `pnpm test` passes and fails when the assertion is broken

## 5. CI

- [x] 5.1 Add root scripts `format:check`, `lint`, `check`, `test`, `build` that run across the workspace; verify each runs from the repo root
- [x] 5.2 Add `.github/workflows/ci.yml` (push and PR; pnpm, Node from `.nvmrc`, cache; frozen install, then format check, lint, check, test, build; cancel superseded runs); verify the whole sequence passes locally from a clean `pnpm install --frozen-lockfile`
- [x] 5.3 After the user confirms the push, push to main and verify the CI run is green on GitHub

## Log

- 1.2: dropped the redundant `pitch/deploy/node_modules/` line; unanchored `node_modules/` already matches at any depth.
- 2.1: `web/tsconfig.json` only extends the strict preset; the preset already sets `include`/`exclude` via `${configDir}`.
- 2.3 replanned: `typescript` is a _peer_ of `@astrojs/check` and `@volar/*`, so the `@astrojs/check>typescript` override (and a `packageExtensions` dependency) never applies; peers resolve to `web`'s TS 7 and `astro check` exits with "does not currently support TypeScript 7.0". Astro now points to `@astrojs/ts-content-mapper` for TS 7.1+ (not released; latest is 7.0.2). Dropped `astro check` and the override; proposal and task updated.
- 3.1: `.prettierignore` also covers `.claude/` (OpenSpec-generated, would churn on regen) and `.cloudflare/` (CLI cache). The first format pass only touched `docs/styleguide.md` (table alignment) and `source/content.md` (`*em*` → `_em_`), no wording.
- 3.2: `lint` runs `oxlint --deny-warnings`, since oxlint's defaults (e.g. `no-unused-vars`) are warnings and would not fail CI otherwise.
- Follow-up: once TS 7.1 ships, add `@astrojs/ts-content-mapper` so `tsc` type-checks `.astro` files.

## Workflow follow-up

- Archive with `openspec archive foundation`.
