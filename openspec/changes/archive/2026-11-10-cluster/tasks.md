# Tasks

## 1. Cluster

- [x] 1.1 Add `web/src/components/Cluster/` (`Cluster.tsx`, `Cluster.css`): `<div className="cluster">` by default, or `<ul className="cluster" role="list">` with `as="ul"`, children passed through as they are, other props passed through; CSS sets `display: flex`, `flex-wrap: wrap`, `align-items: center`, `gap: var(--space-2) var(--space-4)`, and resets margin, padding and `list-style`; it styles no items and uses no colors; verify `pnpm check` passes
- [x] 1.2 Add `Cluster.stories.tsx`: the four dates as `as="ul"` in `Prose` on night and cream, and a `div` of three `Tag`s on cream; play functions check the `ul` has role `list`, its accessible name from `aria-labelledby`, four `listitem`s in order from "10. Juli" to "30. Oktober", and no bullet (`list-style-type: none`); a story in a 320px-wide frame checks the items wrap onto more than one line and the row is no wider than its frame; verify `pnpm test` passes with no axe violations
- [x] 1.3 Add `Cluster` to the Components section of `docs/styleguide.md` (a wrapping row; `as="ul"` for a set of items, which keeps `role="list"`, `div` for anything else; layout only, never styles its items; one gap for now, buttons' wider gap comes with the first button row); verify every token it names exists in `tokens.css`

## 2. Home page

- [x] 2.1 In section 4 of `index.astro`, replace the dates sentence with `<p id="run-and-rave-2026">Run &amp; Rave 2026</p>` and a `Cluster as="ul" aria-labelledby="run-and-rave-2026"` of `<li>10. Juli</li>`, `<li>20. August</li>`, `<li>24. September</li>`, `<li>30. Oktober</li>`, leaving "Festival 2025 auf dem Friedensplatz" as it is; verify in the built HTML of `/` that section 4 holds one `ul.cluster[role=list]` with four `li` and no "·"
- [x] 2.2 Verify at 320px and 1280px against `astro preview` that the dates sit in one row at 1280px, wrap without a leading separator at 320px, read on night, and there's no horizontal scroll

## 3. Checks

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check the `cluster` scenario and each `home-page` scenario on `/` by hand in Chrome

## Log

- 1.1: the list reset (margin, padding, `list-style`) sits in `:where(.cluster)`, not `.cluster`. `.cluster { margin: 0 }` ties with `.prose > * + *` in specificity, so depending on CSS order it would drop Prose's `--space-4` above the list. Checked on `/`: the list keeps its 16px gap and `list-style-type: none`.
- 2.2: Chrome showed a cached `/` with the old dates sentence until the page was fetched with `cache: 'no-store'`. Chrome won't make a window narrower than about 500px, so the 320px check ran in a 320px iframe. The wide check ran at a 1504px viewport, not 1280px. The dates row is about 400px wide, so it fits in one row at either width.
- 3.1: the scenarios were checked in Chrome through the DOM: list role, name, items and no "·", the hero button, the Termine links, and region names. No VoiceOver pass.

## Workflow follow-up

- Archive with `openspec archive cluster` and tick row 6 in `docs/landing-page-plan.md`.
