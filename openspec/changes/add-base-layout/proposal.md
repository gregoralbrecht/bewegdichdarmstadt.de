# Proposal

## Why

Every page so far brings its own `<html>` shell. Real pages need a shared one, and the legal links (Impressum, Datenschutz) must be reachable from every page before launch.

## What Changes

- `web/src/layouts/Base.astro`: `<html lang="de">`, head (title via `pageTitle()`, fonts, `tokens.css`), skip link to `#main`, header, `<main id="main">`, footer.
- Header holds only a `Logo` placeholder: the wordmark "Beweg dich, Darmstadt!" as text, linking home. No main menu.
- Indigo footer with a link to Instagram @bewegdichdarmstadt and a "Rechtliches" nav with Impressum and Datenschutz.
- The footer sits at the bottom of the window even when `<main>` is empty.
- `/impressum` and `/datenschutz` pages on the layout, each with only an `<h1>`.

Out of scope: main menu, the real logo, legal text, Cookie-Einstellungen and Vertrag widerrufen (Jimdo leftovers; the new site sets no cookies and sells nothing), moving the token preview on `/` onto the layout.

Decisions:

- Flex column with `main { flex: 1 }` over grid, because only `<main>` grows and everything else keeps its natural height.
- `html { height: 100% }` plus `body { min-height: 100% }` over `vh`/`svh`, because viewport units behave inconsistently across mobile browsers.
- Text wordmark over the pitch's smiley SVG, because it is clearly a placeholder and the `Logo` component is the single place to swap in the real file.
- `--orange` focus ring inside the footer over the global `orange-deep`, because `orange-deep` on indigo is about 2:1, under the 3:1 a focus indicator needs.

## Capabilities

### New Capabilities

- `site-layout`: the shared page shell: footer links on every page and the footer staying at the bottom.

### Modified Capabilities

None.

## Impact

New: `web/src/layouts/Base.astro`, `web/src/components/Logo/`, `web/src/pages/impressum.astro`, `web/src/pages/datenschutz.astro`. Changed: `web/src/lib/palette.ts` (orange on indigo pair). No new dependencies.
