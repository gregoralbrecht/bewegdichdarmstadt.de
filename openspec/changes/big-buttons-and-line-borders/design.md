# Design

Settled in a throwaway preview sheet before this change; this file is the record of what it found.

## Decisions

**Static link, moving face.** `<a|button class="button"><span class="button__face">…</span></a>`. The outer element never moves: its `::before` is the shadow, a `--line` rectangle offset once by `--depth`; its `::after` stretches the hit area to 44px tall (`inset-block: min(0px, calc(50% - 22px))`). The face has `pointer-events: none` and moves only with `transform`: up-left by `--lift` on `(hover: hover)`, down-right by `--depth` on press, landing exactly on the shadow. On screen the shadow never moves during hover, so it doesn't have to be animated at all.
Over animating `box-shadow` on the moving element, because that flickered at the edge (the hit area moved away from the pointer) and blurred at high zoom (a repainted shadow on a moving layer).

**Depth in `em`, snapped to pixels.** `--depth: round(0.16em, 1px)`, `--lift: round(0.08em, 1px)`; small uses 0.22em so its shadow stays about 4px. The shadow grows with the type, and whole pixels avoid antialiasing seams. `max-width: calc(100% - var(--reach))` keeps face plus shadow inside the column.

**Sizes.** The size sets the primary's step and the secondary sits one below: default `--step-2`/`--step-1`, `small` `--step-0`/`--step--1`, hero `--step-3`. Two secondaries side by side are therefore equal, with no pairing rule.

**Hero layers as pseudo-elements.** The hero's `::before` and `::after` are its two layers, bordered rectangles moved by `transform`. It needs no touch-target pseudo, since `--step-3` is well above 44px.

**`--hero-ink` role.** `--line` on light surfaces, `transparent` on night and ink. A transparent border shows the layer's own fill, so on dark the stack goes flat like the two-tone heading, with one role instead of one per layer. `contrast.test.ts` accepts `transparent` for this role only.

**Border tokens become widths.** `--border: 3px` and `--border-thin: 2px`; use sites write `var(--border) solid var(--line)`. A `var(--line)` inside a `:root` composite would resolve once at the root and stay ink everywhere.

**Card background.** `.card { background: var(--line) }` fills the antialiasing seam between the body's rounded corner and the border.

## Risks / Trade-offs

- [The secondary is no longer see-through; it takes `--bg`] → On a filled card `--bg` is the fill, so it matches. Check every surface in Storybook.
- [Hairline seen once during hover, not reproduced] → Check task; if it returns, `background-clip: padding-box` on the face. That would break `--hero-ink: transparent`, so the hero would then need explicit edge colors.
- [`round()` needs Chrome 125, Safari 15.4, Firefox 118] → Older browsers drop the declaration and fall back to no shadow offset; acceptable for this audience.
