# Proposal

## Why

Every step from here on should land somewhere the client can see. A deploy on each green push to main turns the CI pipeline into a running site.

## What Changes

- `web/` gets the Cloudflare adapter (`@astrojs/cloudflare`) and a Wrangler config for a Worker named `bewegdichdarmstadt-lsy5`, served at `bewegdichdarmstadt-lsy5.round-breeze-7885.workers.dev`.
- The CI workflow gains a deploy job that runs only on pushes to main, only after all checks pass, and never cancels a deploy in progress.
- Deploy credentials live in GitHub secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`), with a token scoped to Workers on this account.

Out of scope: custom domain, PR preview deploys, `noindex` headers, on-demand (server-rendered) routes. The hello page stays static.

Decisions:

- Adapter now over plain static assets, because on-demand routes (Sanity preview, forms, donations) are likely, and adding the adapter later would change the build output and dev server under existing pages.
- Wrangler over the `cf` CLI the pitch uses, because the adapter generates Wrangler config and `cf` is still beta.
- Readable name with a random suffix over a fully random or plain name, because the client should recognise the URL without it being trivially guessable.
- Deploy job in `ci.yml` over a separate workflow, because `needs:` gates it on the checks without cross-workflow triggers.

## Capabilities

### New Capabilities

None. Tooling change, `skip_specs: true`.

### Modified Capabilities

None.

## Impact

New: `@astrojs/cloudflare` and `wrangler` in `web/`, `web/wrangler.jsonc`, two GitHub secrets, a Worker on the Cloudflare account. Changed: `web/astro.config.ts`, `.github/workflows/ci.yml`. The pitch Worker is untouched.
