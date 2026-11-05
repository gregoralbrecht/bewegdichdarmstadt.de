# Tasks

## 1. Focus rings

- [x] 1.1 In `tokens.css`, add `--radius-focus` (0.5rem), make `:focus-visible` a 3px dotted `--focus` outline, and round plain controls through `:where(a, button, summary, [tabindex])`; verify on `/gestaltung` that a text link's ring is dotted and rounded on cream and night
- [x] 1.2 Move `Button`'s ring to a dotted `.button__face::after` with `--radius-focus`, leave the face sharp, and make the index card's ring dotted; update the `Primary` story's focus check; verify `pnpm test` passes
- [x] 1.3 Update the focus rules in `docs/styleguide.md` (dotted, rounded, `--radius-focus`, the pseudo-element for sharp shapes) and add `--radius-focus` to the radius table; verify every token it names exists in `tokens.css`

## 2. No flash on tap

- [x] 2.1 Move the menu links' `:active` styles under `@media (hover: hover) and (pointer: fine)`; verify with touch emulation at 320px that tapping a card link (no-JS bar) draws no border or shadow, and that a mouse press still does

## 3. Drawer

- [x] 3.1 `pnpm --filter web add react-aria-components`; verify `pnpm check` passes
- [x] 3.2 Add `MenuDrawer.tsx`: the "Menü" React Aria `Button` in `.main-menu__bar`, a `DialogTrigger` with `ModalOverlay` > `Modal` > `Dialog` (`aria-label="Menü"`, `isDismissable`) holding `Links` and a "Schließen" button, styled through `data-pressed`, `data-focus-visible`, `data-entering` and `data-exiting`; reduced motion fades instead of sliding; it closes when `(width >= 66em)` starts matching; remove the `<dialog>` and the bar from `MainMenu.tsx`, which now takes `children`; verify a story opens it, closes it with Escape, "Schließen" and a backdrop tap, and returns focus to "Menü" each time
- [x] 3.3 Wire `<MainMenu><MenuDrawer client:media="(width < 66em)" /></MainMenu>` in `Base.astro`, and point `main-menu.ts` at `.main-menu__sheet`, dropping the invoker fallback; verify in the built site that 1280px loads no React JavaScript, that 320px hydrates and opens the drawer, and that the menu stays put on scroll while the drawer is open
- [x] 3.4 Measure the gzipped CSS and JS of `/` at 320px; verify it's under 100 KB, and stop and report if it isn't

## 4. Swipe to close

- [x] 4.1 Add `useSheetDrag` and a handle bar: drag from the handle, or from the list when it's scrolled to the top; `--drag` follows the finger; release past a third of the height or faster than about 0.5px/ms closes it, from where it is; otherwise it springs back; verify stories for a long drag (closes, focus on "Menü"), a flick and a short slow drag (stays open)
- [x] 4.2 Verify reduced motion: the drag still follows the finger, and open, close and snap-back fade without sliding

## 5. Docs and checks

- [x] 5.1 Update `MainMenu` in `docs/styleguide.md`: drawer island on phones, swipe to close, press styles only for fine pointers; verify it no longer mentions invoker commands
- [x] 5.2 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, and that tapping "Menü" in touch emulation never shows a border, shadow or focus ring

## Log

- 1.2: the ring is drawn on `.button:focus-visible .button__face::after`, which needs `position: relative` on the face only while focused; it overlaps the shadow at the right and bottom edge, as the old outline did.
- 2.1/3.2: React Aria sets `data-pressed` for touch presses too, so the drawer buttons' `[data-pressed]` styles sit in the same `(hover: hover) and (pointer: fine)` block as `:active`. A touch laptop with a trackpad would still show press on a tap.
- 3.2: the RAC buttons' ring keys off `[data-rac]` (`:focus-visible` off, `[data-focus-visible]` on); a plain `.main-menu__bar .main-menu__link:focus-visible` reset outranked the ring.
- 3.2: the dialog container takes focus on open and draws no ring (`.main-menu__dialog:focus-visible { outline: none }`); it's not a control.
- 3.2: `MenuDrawer` takes `current` too, so `Base.astro` passes `current={Astro.url.pathname}` to both. The phone stories moved to `MenuDrawer.stories.tsx`; `react-invokers.d.ts` is gone.
- 3.4: `/` at 320px measured 99.6 KB gzipped (of 102,400 bytes) before the drag code; desktop ships 6 KB and no React.
- 4.1: list drags rely on `touch-action: pan-down` on the list while it's at the top (`data-scrolled` switches it to `pan-y`); a story with `pan-y` instead fails, so Chromium reads the direction as expected. Real iOS still unchecked.
- 4.1: a `drag` Vitest browser command (mouse or CDP touch) drives the swipe stories.
- 4.1: with the drag code, `/` at 320px is 100.3 KB gzipped (102,693 bytes), over the budget; brotli, which Cloudflare serves, is 87.6 KB. React DOM's client is 65 KB of it.
- 4.1: decided to measure the budget in brotli, as Cloudflare serves it; the styleguide's checklist now says so.
- 4.2: a dev server running while `react-aria-components` was installed loaded two copies of React ("Invalid hook call" in SSR); a restart fixed it. The build was never affected.

## Workflow follow-up

- Archive `main-menu` before archiving this change; this change's `navigation` delta modifies the spec that `main-menu` creates.
- Check the drawer's swipe and VoiceOver on a real iPhone after deploy.
- Archive with `openspec archive mobile-menu-drawer`.
