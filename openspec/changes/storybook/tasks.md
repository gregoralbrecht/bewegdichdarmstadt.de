# Tasks

## 1. React and Storybook setup

- [x] 1.1 Add `@astrojs/react`, `react` and `react-dom` to `web/` and register the integration in `web/astro.config.ts`; verify `pnpm build` passes and a throwaway `.tsx` rendered on `/` without `client:*` adds no JS file to `dist/` (remove it afterwards)
- [x] 1.2 Add Storybook with `@storybook/react-vite` in `web/` (`storybook` and `build-storybook` scripts, `storybook-static/` ignored by git, Prettier and oxlint); verify `pnpm --filter web storybook` starts and `build-storybook` succeeds
- [x] 1.3 Load `tokens.css` and the two fonts (`@font-face` for the WOFF2 files in `web/src/assets/fonts/`, exposed as `--font-display` / `--font-text`) in `.storybook/preview`; set `lang="de"` and the cream background; verify in the browser that a story renders in Bricolage and Figtree, not the fallbacks

## 2. Stories as tests

- [x] 2.1 Add `@storybook/addon-vitest` (Vitest browser mode, Playwright Chromium) and `@storybook/addon-a11y` with violations set to fail; keep the existing node tests (contrast, page title) in their own Vitest project; verify `pnpm test` runs both projects and a story with a deliberate contrast error fails
- [ ] 2.2 Install the Playwright browser in `.github/workflows/ci.yml` before `pnpm test` (any new action pinned to a commit SHA with a version comment); verify CI is green on the pushed branch

## 3. Button

- [x] 3.1 Add `web/src/components/Button/` (`Button.tsx`, `Button.css`): `<a>` when `href` is set, `<button type="button">` otherwise; `variant` primary or pink and `size` small as `data-*` attributes; `--border`, `--shadow-sm`, the styleguide's press states, `:focus-visible` ring and reduced-motion version; verify the stories render every variant and size as both link and button
- [x] 3.2 Add play functions in `Button.stories.tsx`: Tab reaches the button and the focus ring shows, Enter and Space activate the `<button>`, Enter follows the link, and the link variant renders an `<a href>` with no `role`; verify `pnpm test` runs them green with no a11y violations

## 4. Heading

- [x] 4.1 Add `web/src/components/Heading/` (`Heading.tsx`, `Heading.css`): `level` 1–6 renders `h1`–`h6`, `size` picks a `--step-*` and defaults from the level, display font; verify with stories and a play test that `level={2} size="4"` renders an `h2` at `--step-4`

## 5. Wrap-up

- [x] 5.1 Add a "Components" section to `docs/styleguide.md`: React `.tsx` for reusable parts, no `client:*` by default, plain CSS per component, `data-*` variants, every component with stories; verify each convention matches the Button and Heading code
- [ ] 5.2 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then after the user confirms the push, verify CI and the deploy are green

## Log

- 1.1: Astro bundles every renderer's client entrypoint unconditionally (`getClientInput` in `astro/dist/core/build/static-build.js`), so `dist/client/_astro/client.*.js` (~220 KB, React) is emitted even with no `.tsx` on any page. No page references it: the built HTML has no `<script>`, so nothing ships to visitors, but the file is uploaded as a static asset. Accepted with the user: the goal (no JavaScript shipped to visitors) holds.
- Storybook 10.6.4 was published today and fails pnpm's default `minimumReleaseAge`; `pnpm add` silently wrote `minimumReleaseAgeExclude` entries into `pnpm-workspace.yaml`. Reverted that and pinned `^10.6.3` instead. Watch for those entries after any `pnpm add`.
- `vite` is a direct dev dependency (same 8.3.5 Astro uses) to satisfy `@storybook/react-vite`'s peer.
- No Vitest setup file: `@storybook/addon-vitest` 10 applies the preview annotations itself.
- Storybook telemetry off (`core.disableTelemetry`).
- Pressing Enter on a link in a story navigates the Vitest tester page and kills the browser connection ("Browser connection was closed"). The link play function catches the `click`, prevents the navigation and checks the `href` instead.
- Button press states scaled to `--shadow-sm`: hover lifts 2px with a 6px shadow, active sinks 4px to no shadow. Pill radius and 48px / 40px min heights as in the pitch.
- Heading `size` is `"0"`–`"4"`; `--step--1` is left out because the styleguide reserves it for short labels. Default sizes: h1→4, h2→3, h3→2, h4→1, h5/h6→0. Margin is 0; spacing belongs to the layout.
- `tsconfig.json` now includes `.storybook/` (Astro's `**/*` skips dot folders) and excludes `storybook-static/`, which `tsc` was picking up.
- CI installs only the Chromium headless shell (`--only-shell`), which is what headless Vitest launches.
- Verified: contrast violation story fails with `color-contrast`; Heading size mutation fails the play test; `document.fonts` shows Bricolage loaded on the Heading story, Figtree on the Button story, `lang="de"`, cream body background.

## Workflow follow-up

- Archive with `openspec archive storybook`.
