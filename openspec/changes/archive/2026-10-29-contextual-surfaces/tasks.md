# Tasks

## 1. Palette and surface tokens

- [x] 1.1 In `web/src/styles/tokens.css`: add `--night`, `--violet`, `--muted-dark`, set `--pink` to #ff90e8, drop `--indigo` and `--pink-deep`; add the tag palette primitives (`--tag-lime`, `--tag-sky`, `--tag-mint`, `--tag-lilac`, `--tag-yellow`, `--tag-lavender`, `--tag-peach`) under a WIP comment; verify `pnpm build` passes and `grep -r indigo web/src` finds nothing
- [x] 1.2 Add the surface blocks from design.md (`:root, [data-surface="cream"]` plus white, night, ink, orange, pink, violet), each declaring every role (`--bg --fg --muted --line --pop --accent --on-accent --link --focus --hero-1 --hero-2`) and setting `background`/`color`; verify in the browser that a `<div data-surface="night">` turns night with white text
- [x] 1.3 Turn the shadow tokens into offsets (`--shadow-sm: 4px 4px 0` etc., `--shadow-pop: 0.06em 0.06em 0`), add `--radius-control: 0`, `--radius-card: 1.5rem`, `--radius-tag: 999px`; update every `var(--shadow…)` use in `Base.astro`, `index.astro` and `Button.css` to add `var(--line)`; verify `pnpm build` passes and the token preview at `/` still shows its shadows
- [x] 1.4 Rewrite `web/src/styles/contrast.test.ts` to parse each `[data-surface]` block, resolve `var(--x)` to hex and check fg, muted, link and label (`--on-accent` on `--accent`) at 4.5, line and focus at 3, failing on a missing role; check every tag color with ink at 4.5; trim `palette.ts` to primitives and the tag palette with a `wip` flag; verify `pnpm test` passes and setting `--violet` back to #ab54f7 makes it fail
- [x] 1.5 Update `docs/styleguide.md` Color, Shadows and Spacing sections: the surface table, the two-tier palette (tag palette marked WIP/TBD), polarity rule, card rule (white on dark/loud, color fills only when they carry meaning), radius tokens; verify every token named in the doc exists in `tokens.css`

## 2. Components

- [x] 2.1 Add `Section` (`surface` prop → `<section data-surface>` with the content column) with one story per surface; verify `pnpm test` runs every story with no axe violations
- [x] 2.2 Rework `Button`: `variant="primary|secondary|hero"` replaces `pink`; primary = `--accent` fill with one `--line` shadow and the existing lift/press; secondary = outline in `--line`; hero = primary plus the two shadow-pair layers (`--hero-1`, `--hero-2`) that explode on `(hover: hover)`, with the `::after` hover zone and reduced-motion handling; corners `--radius-control`; update stories (each variant on cream, night and orange, plus "hero with a text link"); verify `pnpm test` passes, including a play function asserting the hero's `transform` stays `none` under reduced motion
- [x] 2.3 Give `Heading` level 1 a `text-shadow: var(--shadow-pop) var(--pop)`; verify in Storybook it is orange on cream and night
- [x] 2.4 Add `Card` (outer border, `--radius-card`, `box-shadow: var(--shadow) var(--line)` from the parent; inner `data-surface="white"`; optional `fill` from the tag palette) and `Tag` (pill, tag color fill, ink text, thin ink border); stories on cream and night; verify the card shadow is orange on night and ink on cream, and axe passes
- [x] 2.5 Update the styleguide Components section: Button variants, the rule that a hero never sits next to a basic button, Section/Card/Tag usage; verify the rule matches the "hero with a text link" story

## 3. Pages

- [x] 3.1 Make the `Base.astro` footer `data-surface="ink"` and drop its local `--focus` override; verify the footer links pass the focus check on ink and the `site-layout` scenarios still hold
- [x] 3.2 Add a `robots` prop to `Base.astro` and `web/src/pages/gestaltung.astro` with `noindex`: one section per surface (h1 or h2, body text, link, primary + secondary buttons, a card), a night hero with the hero button, a festival-style cream section with colored time-slot cards, and a tag palette row marked WIP; verify at 320px and desktop width that nothing scrolls sideways, keyboard focus is visible on every surface, and axe reports no issues
- [x] 3.3 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then after the user confirms the push, verify the deploy is green and `/gestaltung` is live

## Log

- Tag palette hex values were not specified anywhere; picked light placeholders (lime #c6f36b, sky #8fd3ff, mint #9ef0c8, lilac #d4b8ff, yellow #ffd84d, lavender #dcd8f0 from the pitch, peach #ffc3a0), all ≥ 9.7 with ink. Settle in the palette meeting.
- `--muted` is now a role, so the old #55536e became the primitive `--muted-light` next to `--muted-dark`.
- `--card` and `--radius-pill` removed: cards use `data-surface="white"`, pills use `--radius-tag`. The skip link is now a white surface.
- `--border`/`--border-thin` stay a fixed ink composite (not offset + color): ink borders separate a fill from its `--line` shadow, which on night is the same orange as the button fill. Only the secondary button's unfilled outline uses `--line`, so the spec's 3:1 for borders holds for outlines sitting directly on a surface.
- Added a global `a { color: var(--link) }` so the `--link` role actually applies.
- A tag-palette fill on a card turns `--muted`, `--link` and `--focus` ink: axe caught orange-deep on sky at 3.26.
- Hero reduced-motion play function: Storybook's userEvent can't trigger `:hover` or emulate media, so under `pnpm test` it dynamically imports `vitest/browser` (real hover, CDP `Emulation.setEmulatedMedia`) and skips that part in the Storybook UI. Mutation-checked: removing the hero's reduced-motion rule fails it.
- Secondary button hover inverts (fills with `--line`, text `--bg`) instead of lifting; not specified in design.md.
- `/gestaltung` shows each surface's live contrast ratios, computed from tokens.css by the new `surfaceTokens` parser in `lib/contrast.ts`.
- Footer links keep `color: inherit` (cream on ink) rather than the ink surface's orange `--link`.

## Workflow follow-up

- Archive with `openspec archive contextual-surfaces`.
