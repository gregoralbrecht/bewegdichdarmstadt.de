# Tasks

## 1. Press in tests

- [x] 1.1 Add `mouseDown` and `mouseUp` browser commands (Playwright `page.mouse.down()` / `up()`) to the storybook project in `web/vitest.config.ts`, with a `BrowserCommands` type declaration under `web/src`; verify `pnpm check` passes and a throwaway call in a story runs without error

## 2. Button feedback

- [x] 2.1 In the reduced-motion block of `Button.css`, under a nested `@media (hover: hover)`, give the face's label a dotted underline on hover: `currentColor`, thickness and offset in em rounded with `round(…, 1px)`, `text-decoration-skip-ink: none`, offset inside the face's bottom padding; verify in Storybook with reduced motion emulated on cream, night and orange that the line sits clear of descenders ("Zum Programm")
- [x] 2.2 In the same block, hide `.button::before` on `:active` with `opacity: 0`, and for the hero also `::after`, with no transition; verify in Storybook that the primary, secondary and hero go flat while held and nothing moves
- [x] 2.3 Extend `staysPutWithReducedMotion` in `Button.stories.tsx`: on hover, the face's `textDecorationLine` is `underline`, its `textDecorationStyle` is `dotted`, and its `transform` stays `none`; on `mouseDown`, `::before` opacity is `0` (hero: `::after` too) and the transform stays `none`; release in `finally`. Verify `pnpm test` passes, and that it fails with the underline rule removed and again with the press rule removed
- [x] 2.4 Add one line to the reduced-motion section of `docs/styleguide.md`: hover puts a dotted underline under the label, press hides the shadow (both hero layers); verify it matches the CSS

## 3. Integration

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass

## Log

- Releasing the mouse over a link is a click, which navigates the test iframe and kills the browser connection; the press check blocks that click with `preventDefault`, like the `Link` story does.
- An underline offset of 0.18em cleared the "g" in "Zum Programm" by about 2px, which looked accidental; 0.24em gives a clear gap and still sits well inside the bottom padding, small size included.
- Changed to a dotted underline after review of the screenshots. At 0.08em Chrome drew tiny square dots that read as texture on the small size; at 0.12em it draws round dots, and the gap to the descenders stays the same because thickness grows downward.

## Workflow follow-up

- Archive with `openspec archive reduced-motion-button-feedback`.
