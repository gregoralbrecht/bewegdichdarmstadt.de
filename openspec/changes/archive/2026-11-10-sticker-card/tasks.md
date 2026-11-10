# Tasks

## 1. Card

- [x] 1.1 In `Card.tsx`, add `tilt?: -3 | -2 | -1 | 1 | 2 | 3`, merged into `style` as `--tilt: <n>deg` without dropping a passed `style`; export `CardLink` (`<a className="card__link">`, props passed through); verify `pnpm check` passes and `tilt={4}` is a type error
- [x] 1.2 In `Card.css`: `.card` gets `position: relative` and `transform: rotate(var(--tilt, 0deg))`; `.card__link` inherits color, has no underline, and its `::after` is `position: absolute; inset: 0`; its own outline goes, and `.card:has(.card__link:focus-visible)` gets the 3px dotted `--focus` outline at 3px offset; only `.card:has(.card__link)` gets hover (`translate(-2px, -2px)`, 10px shadow) and active (`translate(8px, 8px)`, no shadow), transitioning `transform` with `--dur` and `--ease-spring` (`--dur-fast` on press); under `prefers-reduced-motion: reduce` the transform stays `rotate(var(--tilt, 0deg))` with no transition, and the shadow still changes; verify a card without `tilt` renders as before in the existing stories
- [x] 1.3 In `Card.stories.tsx`, add a linked story on cream and night with `tilt={-2}` and a tilted story without a link; play functions check the card's computed transform is a rotation, the card has one link named by its heading, `document.elementFromPoint` at the card's last paragraph returns that link, and the unlinked card holds no link; verify `pnpm test` passes with no axe violations

## 2. Pages

- [x] 2.1 In section 2 of `index.astro`, make both articles `Card`s (`tilt={-2}` Run &amp; Rave, `tilt={2}` Festival 2027) with their heading links in `CardLink`; in section 5, make Steffi's and Lea's articles `Card`s with `tilt={2}` and `tilt={-2}` and no link; leave the lists, "Winterpause", "Save the Date" and "Foto folgt" as they are; verify in the built HTML of `/` that each Termine card holds exactly one `a.card__link` and the person cards hold none
- [x] 2.2 On `/gestaltung`, replace the `.sticker` prototype with a `Card tilt={-2}` and a `CardLink`, and delete the `.stickers`/`.sticker*` CSS; verify the built `/gestaltung` has no `sticker` class left
- [x] 2.3 In `docs/styleguide.md`, change the sticker-card rules: everything in a tilted card tilts with it (drop the counter-rotate rule for paragraphs and dates), only a card with a link moves, `tilt` and `CardLink` under `Card` in Components; verify every token named exists in `tokens.css`
- [x] 2.4 Verify at 320px and 1280px against `astro preview` that tilted cards and their shadows cause no horizontal scroll, that clicking a Termine card's paragraph opens its page, and that tabbing to a Termine card shows the ring around the tilted card

## 3. Checks

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check each `sticker-card` and `home-page` scenario on `/` by hand in Chrome, the reduced-motion one with reduced motion emulated

## Log

- The prototype on `/gestaltung` was pink; as a `Card` it is white, and it lost its `ul.stickers` wrapper because one card is no group.
- Every `Card` now gets `transform: rotate(var(--tilt, 0deg))`, so even an untilted card is a stacking context and a containing block for fixed children. No visible change in the stories.
- Hover isn't behind `@media (hover: hover)`, as in the prototype and the task; `Button` does gate it. Worth deciding in `card-grid` or `event-card`.
- Gotcha: a long-running `astro preview` served an old `_astro/*.css` for a name it had cached at start, and Chrome then kept it as immutable. Restart preview after a rebuild. Build filenames are content-hashed, so production isn't affected.
- Reduced motion was checked in Playwright's Chromium (`reducedMotion: "reduce"`), because Claude in Chrome can't emulate it.
- Termine cards sit close on `/` and the `<ul>` still shows bullets; `card-grid` handles both.
- Renamed `rot`/`--rot` (from the pitch) to `tilt`/`--tilt` after apply, because Gregor prefers full words to abbreviations.
- After apply, Gregor found the shadow moving with the card on hover, the bug already fixed on `Button`. The card now works like `Button`: `.card` stays put and draws the shadow as `::before`, `.card__body` is the face with the border and does all the moving, and `.card__link::after` moves against the face so the pointer stays on the link. Under reduced motion hover moves the shadow out by 2px and press hides it, instead of changing a `box-shadow`. `--frame` takes `--line` on `.card`, so the face's border keeps the parent surface's color inside `data-surface="white"`.
- Gregor then found hover reacting outside the link (on the shadow and the face's border) and asked for sharp corners on clickable cards. Hover and press now key off `.card__link:hover`/`:active`, and the link's `::after` covers the border too, so hover and click share one hit area. Cards with a link take `--radius-control`; the focus ring became a round dotted `::after` 3px outside the face, as on `Button`. Cards without a link keep `--radius-card`.
- A thin light line showed along a tilted card's border: the face's white background ran under the border and bled through its antialiased edge, a seam the old frame's ink background used to hide. The face is now `--frame` under the border and white only on the padding box, through a two-layer background.
- The Card stories now render inside `Prose`, as cards do on the pages, so a plain link in a card gets the wavy underline in Storybook too; "On Cream" checks it. Hero and CtaBand already wrap their own text in `Prose`. Section's stories still show a bare link outside `Prose`.
