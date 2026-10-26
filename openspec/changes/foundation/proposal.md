# Proposal

## Why

Production work needs a base where every push is checked automatically, so later steps (deploy, Storybook, e2e, Sanity, design tokens) can move fast without breaking things.

## What Changes

- Root pnpm workspace with one package, `web/`, an Astro app with a single static hello page. `pitch/` stays outside the workspace.
- TypeScript 7 strict, checked with `tsc --noEmit`. Logic lives in `.ts` files; `.astro` files stay thin.
- Prettier with `prettier-plugin-astro` for formatting, oxlint for linting.
- Vitest with one real unit test, so the test step proves itself.
- GitHub Actions CI on every push and PR: install, format check, lint, typecheck, test, build.
- Node 24 via `.nvmrc` and `engines`; pnpm pinned via `packageManager`.

Out of scope: Cloudflare adapter and deploy, Storybook, Playwright/axe/size budget, Sanity, React, tokens and fonts, type checking `.astro` files. Each gets its own change.

Decisions:

- Prettier over oxfmt, because oxfmt is beta and has no Prettier plugins, so no proven `.astro` support.
- oxlint over ESLint, because it's fast and stable; revisit if `.astro` template linting turns out to matter.
- TS 7 with `tsc` only over TS 6 with `astro check`, because one page has nearly no `.astro` logic and `astro check` can't run on TS 7 (a pnpm override can't swap a peer dependency). Add `@astrojs/ts-content-mapper` once TS 7.1 ships.
- Astro 7 (current) over the Astro 6 discussed earlier, because 7 has shipped since.
- `web/` package over an app at the repo root, because `studio/` joins the workspace in the Sanity step.
- Tooling (Prettier, oxlint) at the root, because it should cover every package.
- Fresh setup over restoring the 2026-10-21 stash, which is reference only.

## Capabilities

### New Capabilities

None. Tooling change, `skip_specs: true`.

### Modified Capabilities

None.

## Impact

New: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.nvmrc`, Prettier and oxlint config, `web/`, `.github/workflows/ci.yml`. `.gitignore` gains build outputs. No deploy, no runtime change.
