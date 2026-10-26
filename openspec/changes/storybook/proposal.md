# Proposal

## Why

Real pages need reusable components, and those components need a place to be built, seen and tested in isolation. Storybook gives that place, and with its Vitest addon every story doubles as a browser test. Starting with only Button and Heading proves the whole pipeline before more components land on it.

## What Changes

- `@astrojs/react` in `web/`, so React components render to static HTML at build time. No `client:*` directive means no JavaScript is shipped.
- Storybook (`@storybook/react-vite`) in `web/`, with `tokens.css` and the two fonts loaded in its preview.
- `@storybook/addon-vitest` and `@storybook/addon-a11y`: stories run as browser tests in `pnpm test` and CI, and axe violations fail them.
- `Button`: renders `<a>` when given `href`, `<button>` otherwise; primary and pink variants plus a small size; the press interaction, focus ring and reduced-motion handling from the styleguide.
- `Heading`: `level` (1 to 6) separate from `size` (`--step-*`), with the size defaulting from the level.

Out of scope: other components, deploying Storybook, `.astro` stories, hydrated islands, replacing the token preview on `/`.

Decisions:

- React `.tsx` over `.astro` components, because Storybook supports React officially and Astro only through a community renderer, and React rendered without `client:*` ships no JavaScript.
- React over Preact, because the styleguide plans Motion for React for dialogs.
- Pages, layouts and the shell stay `.astro`; only reusable parts become `.tsx`.
- Plain CSS per component on the tokens over CSS-in-JS or Tailwind, because it matches the design-tokens decision.
- `data-variant` / `data-size` attributes over BEM modifier classes, because props map 1:1 to the selectors.
- `@font-face` in the Storybook preview over the Astro Fonts API, because the Fonts API doesn't run outside Astro.
- Setup plus two components over all of Tier 1, so tooling trouble stays apart from component work.

## Capabilities

### New Capabilities

None. Tooling and components with no page using them yet, `skip_specs: true`.

### Modified Capabilities

None.

## Impact

New dependencies (dev unless noted): `react`, `react-dom` and `@astrojs/react` (runtime, build-time rendering only), Storybook and its addons, Vitest browser mode with Playwright. New: `web/.storybook/`, `web/src/components/Button/`, `web/src/components/Heading/`. Changed: `web/astro.config.ts`, `web/package.json`, the Vitest config, `.github/workflows/ci.yml` (browser install), `docs/styleguide.md` (component conventions).
