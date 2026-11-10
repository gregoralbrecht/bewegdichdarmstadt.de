# Proposal

## Why

Section 3 on `/` (Für alle) ends in a bare `<dl>` with browser defaults: the details sit indented under their terms and the list reads as leftover markup. Event pages will list the same kind of short facts (Treffpunkt, Teilnahme), so it becomes a component.

## What Changes

- New `FactList`: a `<dl class="fact-list">` built from an `items` prop of `{ term, detail }` pairs, each pair wrapped in its own `<div>`. Other `<dl>` props pass through.
- The facts wrap in a grid of columns that fill the content column and drop to one column at 320px. Each fact gets a `--border-thin` rule in `--line` above it; the term reads as the label, the detail in Bricolage one step up. Each term gets a CSS marker before it: a small square in `--accent` with a `--border-thin` outline and a hard shadow in `--line`, hidden from assistive technology. Colors from roles only.
- `/` swaps the bare `<dl>` in section 3 for `FactList`, with the same five facts and wording.
- `docs/styleguide.md` lists `FactList` under Components.

Decisions:

- An `items` prop over `<dt>`/`<dd>` children, because it keeps every term paired with exactly one detail, and the events collection can later hand its entries straight in.
- A `<div>` per pair over a flat `<dl>`, because the grid needs one box per fact, and HTML allows `<div>` as a `<dl>` child.
- Rules over a card per fact, because sticker cards are for things you click; five bordered boxes would compete with the Termine cards above.
- A CSS marker over an icon per fact, because no icon library is chosen yet (icons come after launch), and a `::before` square needs no dependency and follows every surface through the roles.
- `detail` as `ReactNode` over a string, so a detail can hold a link or `<time>` later.

Out of scope: copy changes (the "Demo" fact keeps the skeleton's split into term and detail), icons per fact, tilt, other pages using the list.

## Capabilities

### New Capabilities

- `fact-list`: short facts as a description list, so each term is announced with its detail.

### Modified Capabilities

None. `home-page`'s requirements keep holding.

## Impact

New `web/src/components/FactList/`; `index.astro`, `docs/styleguide.md`. No new dependencies.
