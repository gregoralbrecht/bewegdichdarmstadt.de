# Proposal

## Why

Section 4 on `/` (Bisher) packs the four 2026 Run & Rave dates into one sentence joined by "·": a screen reader hears one long line, and at 320px the separators wrap to the start of a line. Buttons, tags and short items elsewhere each get their own `display: flex; flex-wrap: wrap` (`.actions` on `/` and `/gestaltung`, the footer, the Tag stories), so the wrapping row becomes a component.

## What Changes

- New `Cluster`: a wrapping row of short items. `as="div"` (default) or `as="ul"`; children pass through as they are, so a `ul` takes `<li>` children. A `ul` gets `role="list"`, because `list-style: none` drops the list role in Safari. Other props pass through.
- CSS only lays out: flex, wrap, `align-items: center`, a gap from the spacing scale (`--space-2` rows, `--space-4` columns), list reset. It never styles its items.
- `/` swaps the dates sentence in section 4 for a label "Run &amp; Rave 2026" and a `Cluster as="ul"` of the four dates, named by the label through `aria-labelledby`. The "·" separators go; the gap separates. "Festival 2025 auf dem Friedensplatz" stays a paragraph.
- `docs/styleguide.md` lists `Cluster` under Components.

Decisions:

- Children over an `items` prop, because buttons, tags and dates are different elements; a list of strings would only fit the dates.
- An `as` prop over two components, because the layout is the same and only the semantics differ: a `ul` when the items are a set to count, a `div` for a row of buttons.
- One fixed gap over a size prop, because only the dates use it now; the wider gap buttons need (`.actions`) comes with the first change that moves a button row onto `Cluster`.
- No separators over CSS "·" markers, because a marker before each item would start wrapped lines with a dot.

Out of scope: moving `.actions`, the footer or `/gestaltung` onto `Cluster`; `<time>` for the dates (change `when`); styling the dates.

## Capabilities

### New Capabilities

- `cluster`: a wrapping row whose list form is announced as a list, with each item counted.

### Modified Capabilities

None. `home-page`'s requirements keep holding.

## Impact

New `web/src/components/Cluster/`; `index.astro`, `docs/styleguide.md`. No new dependencies.
