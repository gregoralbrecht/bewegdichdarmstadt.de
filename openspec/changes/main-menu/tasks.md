# Tasks

## 1. Pages and menu data

- [x] 1.1 Add `web/src/lib/menu.ts` with the items `{ label, href }` (Start `/`, Run & Rave `/run-and-rave`, Festival `/festival`, Über uns `/ueber-uns`) and an `isCurrent(href, pathname)` helper (trailing slash ignored, `/` matches only exactly), with a unit test next to it; verify `pnpm test` passes
- [x] 1.2 Add `pages/run-and-rave.astro`, `pages/festival.astro` and `pages/ueber-uns.astro` on `Base` with `robots="noindex"`, an `<h1>` and a "Kommt bald" line; verify `pnpm build` emits all three routes

## 2. Desktop menu

- [x] 2.1 Add `web/src/components/MainMenu/` (`MainMenu.tsx`, `MainMenu.css`): `<nav aria-label="Hauptmenü">` with a list of links from `menu.ts`, `current` prop → `aria-current="page"`; the card is `data-surface="white"` with an ink border, `--shadow` and a cream die-cut ring, the current link drawn pressed in (filled, no shadow) plus an outline cue; nothing tilts; verify a story on cream, night and pink shows the edge clearly on each
- [x] 2.2 Wire it into `Base.astro`: logo in normal flow at top left, card fixed and centered at the top, header reserving its height, `Astro.url.pathname` passed as `current`, `scroll-padding-top` on `html`; verify at 1280px that the logo and the card share the top row, and that `/festival` marks only Festival

## 3. Mobile menu

- [x] 3.1 Below the side-by-side breakpoint (about 900px; tune so the logo and the card never overlap), hide the card list and show a fixed bottom "Menü" button (`commandfor` + `command="show-modal"`) with the safe-area inset, and a `<dialog>` bottom sheet with the same links, a close button (`command="close"`) and `aria-current`; give `body` a matching `padding-bottom` and `html` a `scroll-padding-bottom`; verify at 320px that the sheet opens, Escape closes it and focus returns to "Menü", and the footer links stay tappable at the end of `/impressum`
- [x] 3.2 Stories for the sheet: open, Escape, focus return, and both lists rendering the same hrefs; verify `pnpm test` passes with no axe violations

## 4. Hide on scroll

- [x] 4.1 Add the scroll `<script>` from design.md (passive listener plus rAF, ~8px threshold, clamped overscroll, always shown near the top, frozen while the dialog is open, `data-menu="hidden"`), plus the invoker-command fallback; CSS slides the card up and the bar down only under that attribute, with `:focus-within` overriding it, and uses opacity only under reduced motion; verify by scrolling down and up at 1280px and 320px, and by tabbing into the hidden menu
- [x] 4.2 Verify the no-JS case: with JavaScript disabled, the menu never hides, and on mobile the `<noscript>` fallback shows the links inline in the bottom bar and every link can be followed

## 5. Docs and checks

- [x] 5.1 Add `MainMenu` to the Components section of `docs/styleguide.md` (fixed sticker card with a die-cut edge, bottom sheet on mobile, hide-on-scroll, adding an item in `menu.ts`); verify every token it names exists in `tokens.css`
- [x] 5.2 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check every `navigation` scenario by hand in Chrome and Safari (including iOS Safari for the bottom bar), with VoiceOver on the sheet

## Log

- Breakpoint is `66em` (1056px), not about 900px: the logo (~260px) and the centered card (~445px) overlap below ~1035px. At 1056px they're 31px apart.
- Phones reserve room for the bottom bar in the footer's `padding-bottom`, not in `body`'s, so the ink footer runs on under the bar instead of ending in a cream strip.
- The noscript fallback moves the card list to the bottom edge (two rows at 320px) instead of showing the sheet's list. Showing a closed `<dialog>`'s content would fight the browser's own rendering.
- Added `closedby="any"`, so a tap on the backdrop closes the sheet too. Not in the spec.
- React 19.3 doesn't know `commandFor`, so the component writes lowercase `commandfor`/`command`, typed in `web/src/react-invokers.d.ts`.
- `MainMenu.css` publishes its geometry as `--menu-*` properties on `:root`, and `Base.astro` reserves them. The breakpoint lives in `MainMenu.css` and in the noscript string in `MainMenu.tsx`.
- Gotcha: Storybook's `userEvent.keyboard("{Escape}")` is untrusted and doesn't close a dialog. The Sheet story uses `vitest/browser`'s `userEvent`.
- Verified in headless Chromium with Playwright against `astro preview`: 1280/1056/1055/320px layout, hide and show on scroll with and without reduced motion, `:focus-within` via Tab, Shift+Tab never landing under the card, sheet open/Escape/backdrop with focus return, footer links at the end of `/impressum`, and no-JS at 320, 375 and 1280px.
- 5.2's manual pass (Chrome, Safari, iOS Safari, VoiceOver) is deferred until after deploy; only the automated checks ran before the commit.
- Follow-up: the placeholder pages' `<h1>` is unstyled and outside `.wrap`, like `/impressum`.
- Follow-up: a sheet left open while the window widens past `66em` stays open.

## Workflow follow-up

- Archive with `openspec archive main-menu`.
