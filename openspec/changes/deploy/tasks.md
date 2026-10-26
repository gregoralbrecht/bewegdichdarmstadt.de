# Tasks

## 1. Adapter

- [x] 1.1 Add `@astrojs/cloudflare` and `wrangler` to `web/`, register the adapter in `web/astro.config.ts`, and add `web/wrangler.jsonc` (name `bewegdichdarmstadt-lsy5`, current compatibility date); verify `pnpm build` passes and `/` is still prerendered to static HTML
- [x] 1.2 Add a `preview` path that serves the built Worker locally (e.g. `wrangler dev` or `astro preview`); verify `/` returns the hello page with `lang="de"`
- [x] 1.3 Verify `pnpm format:check`, `pnpm lint`, `pnpm check` and `pnpm test` still pass, and `git status` shows no new build or Wrangler output (extend `.gitignore` with `.wrangler/` if needed)

## 2. First deploy

- [x] 2.1 User creates a Cloudflare API token scoped to Workers Scripts edit on this account and adds `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub repo secrets; verify with `gh secret list`
- [x] 2.2 Add a `deploy` script in `web/` running `wrangler deploy`; after the user confirms, deploy once from the local machine and verify `https://bewegdichdarmstadt-lsy5.round-breeze-7885.workers.dev/` serves the hello page

## 3. CI

- [x] 3.1 Add a `deploy` job to `.github/workflows/ci.yml` (`needs` the checks job, runs only on push to main, own concurrency group without cancel-in-progress, secrets passed as env); verify the workflow file passes `actionlint` or a dry read of `gh workflow view`
- [ ] 3.2 After the user confirms the push, push to main and verify the run is green, the deploy job ran after the checks, and the workers.dev URL serves the new build

## Log

- pnpm blocked the build scripts of `esbuild` and `workerd` (Wrangler's runtime); allowed exactly those two via `allowBuilds` in `pnpm-workspace.yaml`.
- The adapter adds a `SESSION` KV binding and an `IMAGES` binding by default, so the first deploy would provision a KV namespace beyond the Workers-only token scope. Turned both off: `session: false` and `imageService: "compile"` (build-time optimization, needs `sharp` once real images arrive).
- Static build output lands in `dist/client/` (no `dist/server/`); Wrangler deploys through the redirected config `.wrangler/deploy/config.json` -> `dist/client/wrangler.json`. `.wrangler/` added to `.gitignore`.
- 1.2 needed no new script: the existing `astro preview` already serves the build through workerd. It now runs detached, so stop it with `astro preview stop`.
- `pnpm deploy` is a built-in pnpm command; CI calls `pnpm --filter web run deploy`.
- Workflow-level `cancel-in-progress: true` would cancel a main run mid-deploy regardless of job concurrency; it is now `github.ref != 'refs/heads/main'`. Main runs queue instead.
- Compatibility date `2026-10-19` matches the installed workerd build rather than today, so local preview and production agree.
- `wrangler deploy --dry-run` still requires a token, so the config was checked through the build output only until 2.2.
- GitHub Actions are pinned to commit SHAs with the version as a comment (user decision: always pin third-party actions).
- Follow-up: once the Worker exists, narrow the Cloudflare API token to this Worker; it starts account-wide for Workers Scripts.

## Workflow follow-up

- Archive with `openspec archive deploy`.
