# Proposal

## Why

The card lists in sections 2 and 5 on `/` are plain `<ul>`s inside `Prose`: they show bullets, the cards stack tight, and each card sets its own `tilt` by hand. The styleguide's "neighbors tilt in opposite directions" lives only in that hand-set pattern, so the grid becomes a component.

## What Changes

- New `CardGrid`: a `<ul role="list">` that takes `<li>` children, each holding a `Card`. Other props pass through.
- Layout: CSS grid, `repeat(auto-fill, minmax(min(100%, 15rem), 1fr))`, gap `--space-6` rows and `--space-5` columns, as the grids on `/gestaltung`; list reset in `:where()`, as in `Cluster`. Cards in a row stretch to the same height.
- Tilt: by index in a cycle of four, `--tilt` `-2deg`, `2deg`, `-3deg`, `1deg`. A `Card` without `tilt` inherits it; a `Card` with `tilt` keeps its own.
- `/`: sections 2 and 5 swap their `<ul>` for `CardGrid`, and the cards in them drop `tilt`. Steffi now tilts left and Lea right, the reverse of today.
- `docs/styleguide.md`: `CardGrid` under Components; the "neighbors tilt" rule points to it.

Decisions:

- `<li>` children over wrapping each child, because Astro hands a React component its children as one HTML slot, so `CardGrid` can't wrap them; `Cluster` works the same way.
- Tilt from the grid over a per-card prop, because then no page can put two neighbors the same way.
- Alternating by index over a checkerboard, because the column count changes with the width and CSS can't see it; in a grid with an even column count, cards above each other turn the same way. Both grids have two cards.
- A cycle of four tilts over one fixed ±2°, because then the first and third card differ, and so do cards stacked in a two-column grid.

Out of scope: the `/gestaltung` grids (swatches and fill slots aren't sticker cards), gating card hover behind `@media (hover: hover)`, tags and states (`event-card`), photos (`person-card`).

## Capabilities

### New Capabilities

- `card-grid`: a group of cards announced as a list with each card counted, neighbors tilted in opposite directions.

### Modified Capabilities

None. `sticker-card` and `home-page` keep holding.

## Impact

New `web/src/components/CardGrid/`; `index.astro`, `docs/styleguide.md`. No new dependencies.
