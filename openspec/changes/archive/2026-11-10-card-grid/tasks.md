# Tasks

## 1. CardGrid

- [x] 1.1 Add `web/src/components/CardGrid/` (`CardGrid.tsx`, `CardGrid.css`): `<ul className="card-grid" role="list">`, `<li>` children passed through, other props passed through; CSS sets `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr))`, `gap: var(--space-6) var(--space-5)`, `--tilt` on `> li:nth-child(4n + 1)` to `4n + 4` as `-2deg`, `2deg`, `-3deg`, `1deg`, `height: 100%` on `> li > .card`, and resets margin, padding and `list-style` in `:where(.card-grid)`; verify `pnpm check` passes
- [x] 1.2 Add `CardGrid.stories.tsx` inside `Section` and `Prose`: three linked cards on cream, two unlinked on night, and one where the second card sets `tilt={3}`; play functions check role `list`, one `listitem` per card in order, `list-style-type: none`, each card's computed rotation matches the cycle, has the opposite sign of the one before and differs from the one two before (except the explicit `tilt={3}`, which renders as 3°), and cards in a row share a height; a 320px-wide story checks one column and the grid is no wider than its frame; verify `pnpm test` passes with no axe violations
- [x] 1.3 Add `CardGrid` to the Components section of `docs/styleguide.md` (a `<ul>` of `<li>`-wrapped cards, tilts alternate by index in the cycle −2°, 2°, −3°, 1°, an explicit `tilt` wins, even column counts stack same-tilt cards) and point the "Neighbors tilt in opposite directions" rule to it; verify every token it names exists in `tokens.css`

## 2. Home page

- [x] 2.1 In sections 2 and 5 of `index.astro`, replace each `<ul>` with `CardGrid` and drop `tilt` from the four cards, leaving their content as it is; verify in the built HTML of `/` that both sections hold one `ul.card-grid[role=list]` with two `li` each and no `--tilt` inline style
- [x] 2.2 Verify at 320px and 1280px against `astro preview` (restarted after the build) that the cards sit side by side at 1280px and stack at 320px, tilt in opposite directions, show no bullets, keep their shadows clear of the neighbor, and cause no horizontal scroll

## 3. Checks

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check each `card-grid`, `sticker-card` and `home-page` scenario on `/` by hand in Chrome

## Log

- The 320px story checks the grid box (`offsetWidth`) against the frame's content width, not `scrollWidth`: the tilted cards and their shadows overhang the grid by about 12px, into the gutter, which counts as scroll overflow on the list but doesn't scroll the column.
- The wide stories set the Vitest viewport to 1280px (as in `MainMenu`), because the default 414px puts every card in its own row and the equal-height check would compare nothing.
- At 1280px `auto-fill` makes four tracks, so the two cards on `/` sit in the left half of the column with the right half empty. That's as specified (and as on `/gestaltung`); `auto-fit` would stretch them across instead, if that's wanted later.
- At 1280px the first card's shadow ends 6px before the second card: clear, but tight.
- After review the fixed ±2° became a cycle of four (−2°, 2°, −3°, 1°), so the first and third card no longer match; the two cards on `/` keep −2° and 2°.

## Workflow follow-up

- Archive with `openspec archive card-grid` and tick row 9 in `docs/landing-page-plan.md`.
