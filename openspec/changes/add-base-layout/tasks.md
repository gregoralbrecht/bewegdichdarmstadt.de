# Tasks

## 1. Logo placeholder

- [x] 1.1 Add `web/src/components/Logo/` (`Logo.tsx`, `Logo.css`, `Logo.stories.tsx`): an `<a href="/">` with the text wordmark "Beweg dich, Darmstadt!" in the display font, built from tokens, with a comment that it stands in for the real logo; verify the story renders and `pnpm test` passes with no a11y violations and a play function that finds a link to `/` named "Beweg dich, Darmstadt!"

## 2. Layout

- [x] 2.1 Add `web/src/layouts/Base.astro` with a `title` prop: `<html lang="de">`, charset, viewport, `<title>` from `pageTitle()`, both `<Font>` preloads, `tokens.css`; body holds a skip link to `#main` (hidden until focused), `<header>` with `Logo`, `<main id="main"><slot /></main>`, `<footer>`; verify `pnpm check` passes and the first Tab on a page shows the skip link
- [x] 2.2 Fill the footer: indigo background with white text, a link "Instagram @bewegdichdarmstadt" to `https://www.instagram.com/bewegdichdarmstadt/`, and `<nav aria-label="Rechtliches">` with a list of "Impressum" (`/impressum`) and "Datenschutz" (`/datenschutz`); `--focus: var(--orange)` scoped to the footer; verify in the browser that every footer link is reachable by keyboard and shows the orange ring
- [x] 2.3 Add the pair orange on indigo to the indigo swatch in `palette.ts` (footer focus ring; white on indigo is already there) and to the Color table in `docs/styleguide.md`; verify `pnpm test` runs the contrast test for it green
- [x] 2.4 Keep the footer at the bottom: `html { height: 100% }`, `body { min-height: 100%; display: flex; flex-direction: column }`, `main { flex: 1 }`, no `vh`/`svh`/`dvh` units; verify in Chrome and Safari at desktop and phone size that on an empty page the footer touches the window's bottom edge and the page does not scroll

## 3. Legal pages

- [x] 3.1 Add `web/src/pages/impressum.astro` and `web/src/pages/datenschutz.astro` on `Base.astro`, each with only an `<h1>` ("Impressum", "Datenschutz") and the matching title; verify `pnpm build` passes and the built HTML of both pages contains the three footer links, one `<h1>`, and the titles "Impressum | Beweg dich, Darmstadt!" and "Datenschutz | Beweg dich, Darmstadt!"

## 4. Wrap-up

- [x] 4.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, axe in the browser reports no issues on `/impressum`, and the layout works at 320px width and 200% zoom without horizontal scrolling

## Log

- 2.3: `docs/styleguide.md` said to use cream for the focus ring inside indigo bands; changed it to `--orange` (4.7 on indigo) to match this change's decision. Orange on indigo passes 4.5, so it sits in the regular pairs list and the contrast test checks it at the text threshold.
- `Logo` reuses `SITE_NAME` from `page-title.ts` instead of repeating the string.
- Astro leaves `html` and `body` selectors in a component `<style>` unscoped, so the sticky-footer rules live in `Base.astro` without `is:global`.
- The legal pages' `<h1>` is plain and sits flush with the window edge: `<main>` has no content wrapper. Follow-up: give page content a width wrapper (and use `Heading`) with the first real page.
- WebKit skips links on plain Tab (Safari's default); keyboard checks there used Option+Tab.
- Verified with Playwright against `astro dev`: Chromium and WebKit at 1280×800 and 375×667, plus 320px width and 640px at 2× (200% zoom): footer bottom equals the window height, no vertical or horizontal scroll; Tab order skip link → logo → Instagram → Impressum → Datenschutz, orange (`#f8971c`) ring on the footer links; skip link moves focus into `<main>`; axe-core 4.14 reports no violations on `/impressum` in both engines. The Safari check ran in Playwright WebKit, not Safari itself.
- Prettier reformatted the change's `spec.md` (no content change).

## Workflow follow-up

- Archive with `openspec archive add-base-layout`.
