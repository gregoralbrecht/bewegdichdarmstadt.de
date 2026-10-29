# Tasks

## 1. Tokens and lines

- [x] 1.1 In `tokens.css`, make `--border: 3px` and `--border-thin: 2px` widths and rewrite every use (`Card.css`, `Tag.css`, `Base.astro` skip link, `index.astro`) as `var(--border) solid <color>`: `var(--line)` for cards, buttons and the skip link, `var(--ink)` for `Tag` (out of scope, unchanged look); verify `grep -rn "border: var(--border" web/src` finds nothing and `pnpm build` passes
- [x] 1.2 Set `--accent: var(--cream)` on night and ink, add the `--hero-ink` role (`var(--line)` on light surfaces, `transparent` on night and ink); verify `pnpm test` passes
- [x] 1.3 Extend `contrast.test.ts`: `--hero-ink` is the only role allowed to be `transparent`, and `--accent` differs from `--line` on every surface; verify setting `--accent: var(--orange)` on night makes it fail
- [x] 1.4 Give `.card` `background: var(--line)`; verify in Storybook at 400% zoom that no hairline shows at a night card's bottom-right corner

## 2. Button

- [x] 2.1 Render `<span class="button__face">` inside both the `<a>` and `<button>` branches of `Button.tsx`; verify the `Link` and `Primary` play functions still pass
- [x] 2.2 Rewrite `Button.css` per design.md (static link with shadow `::before` and touch-target `::after`, transform-only face, em depth with `round()`, sizes, `max-width`, wrapping with `hyphens: auto`, secondary filled with `--bg`, focus outline on the face, reduced motion); verify in Storybook on cream, night and orange
- [x] 2.3 Rebuild the hero with `::before`/`::after` layers, edges in `--hero-ink`, always `--step-3`; verify on cream the layers are inked and on night they're flat
- [x] 2.4 Update stories: a 320px long-label story asserting `scrollWidth <= clientWidth` on its container; a small story asserting the hit area is at least 44px tall; a hover story asserting the link's bounding box doesn't change on hover; the reduced-motion play function asserting the face's `transform` stays `none` for primary and hero; drop "Hero With Text Link" and the `HeroOn*` box-shadow assertion; verify `pnpm test` passes and removing the reduced-motion rule fails it
- [x] 2.5 At normal speed and 100%, 200% and 400% zoom in Chrome and Safari, hover the primary on cream; if a hairline shows, apply `background-clip: padding-box` to the face, give the hero explicit edge colors, and log it

## 3. Docs and pages

- [x] 3.1 Update `docs/styleguide.md`: surface table (`--accent` cream on dark, `--hero-ink`), borders follow `--line`, the border tokens as widths, the press table in em, buttons in Bricolage, sizes, the hero rules (no text-link pairing story); verify every token named in the doc exists in `tokens.css`
- [x] 3.2 Update `/gestaltung`: hero with a long label, small buttons on the festival cards; verify at 320px nothing scrolls sideways and axe reports no issues
- [x] 3.3 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass

## Log

- 1.1: the planned grep `border: var(--border` also matches the new `var(--border) solid …` form; verified with `var\(--border(-thin)?\);` (no bare composite left) instead.

- 1.4, 2.2, 2.3, 2.5: checked with Playwright screenshots in Chromium and WebKit at device scale 1, 2 and 4 instead of real Chrome and Safari at browser zoom; no hairline at the card corner or the hovered face, so no `background-clip` fallback. A manual pass in real Safari is still worth doing.
- 2.4: the hover story rests the pointer 2px inside the bottom-right edge and also asserts `:hover` stays on, which covers the spec's flicker scenario. The Primary play function now checks the focus outline on the face, not the link.
- Follow-up: with reduced motion, buttons give no hover feedback at all now that hover is movement only; consider a non-moving cue (e.g. a color change).

## Workflow follow-up

- Archive with `openspec archive big-buttons-and-line-borders`.
