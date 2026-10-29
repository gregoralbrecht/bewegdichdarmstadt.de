# Design

## Context

Today the role tokens (`--bg`, `--fg`, `--line`, `--accent`) are declared once on `:root`, and composites like `--shadow: 8px 8px 0 var(--line)` resolve there. A section that changes `--line` would not change `--shadow`. `contrast.test.ts` checks hand-listed pairs from `palette.ts`.

## Decisions

**Surfaces are attribute blocks in `tokens.css`.** `:root, [data-surface="cream"]` holds the defaults; each other `[data-surface]` block redeclares every role and sets `background` and `color`. Starting values (pink = #ff90e8, violet = #b05cf8, muted-dark = #c9c6e6):

| surface | fg    | muted      | line   | pop    | accent / label | link        | focus       | hero layers   |
| ------- | ----- | ---------- | ------ | ------ | -------------- | ----------- | ----------- | ------------- |
| cream   | ink   | muted      | ink    | orange | orange / ink   | orange-deep | orange-deep | pink, violet  |
| white   | ink   | muted      | ink    | orange | orange / ink   | orange-deep | orange-deep | pink, violet  |
| night   | white | muted-dark | orange | orange | orange / ink   | pink        | orange      | pink, violet  |
| ink     | cream | muted-dark | orange | orange | orange / ink   | orange      | orange      | pink, violet  |
| orange  | ink   | ink        | ink    | white  | white / ink    | ink         | ink         | pink, violet  |
| pink    | ink   | ink        | ink    | white  | orange / ink   | ink         | ink         | violet, white |
| violet  | ink   | ink        | ink    | white  | orange / ink   | ink         | ink         | pink, white   |

Alternative: a JS theme object passed through React context. Rejected: it needs hydration or prop drilling, and CSS inheritance does the job for free.

**Shadows are offsets, colored at the use site.** `--shadow-sm: 4px 4px 0`, `--shadow: 8px 8px 0`, used as `box-shadow: var(--shadow-sm) var(--line)`. The color then resolves on the element, inside its surface.

**Cards are white islands with an outer shadow from the parent.** `Card` renders an outer element (ink border, `--radius-card`, `box-shadow: var(--shadow) var(--line)`, reading the parent surface) around an inner `data-surface="white"` body. A meaningful color fill (`fill` prop, tag palette, light surfaces only) replaces the inner surface's `--bg`.

**Hero layers are shadow pairs on one element.** Each layer is a fill shadow with `-3px` spread over an edge shadow in `--line`, so the button stays a single `<a>` or `<button>`. Two layers at rest; on `(hover: hover)` the button lifts by one step while the step grows, so the first layer stays put. A transparent `::after` keeps the hover zone over the vacated spot. Reduced motion: layers change, nothing moves.

**The contrast test reads surfaces from `tokens.css`.** It parses each `[data-surface]` block, resolves `var(--x)` to primitive hex values and checks the spec's pairs: fg, muted, link and label at 4.5, line and focus at 3. A surface missing a role fails. `palette.ts` keeps only primitives and the tag palette (with a `wip` flag) for the preview pages.

## Risks / Trade-offs

- Animating `box-shadow` repaints on every frame → limited to the one hero button per page.
- Adjacent basic and hero buttons look wrong → styleguide rule plus a Storybook story showing the allowed pairing (hero plus a text link). No runtime check.
- Violet and pink are placeholders → the test catches any later value that breaks contrast.
