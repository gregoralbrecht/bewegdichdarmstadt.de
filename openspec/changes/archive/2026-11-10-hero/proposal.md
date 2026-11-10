# Proposal

## Why

Section 1 on `/` is a plain band under a cream header, so the page opens with a cream strip behind the logo and the floating menu. A later background pattern would have to run behind both. The hero button at `--step-3` is far too big, and at 1280px it hyphenates the handle into "@beweg-dichdarmstadt", which reads as a different account.

## What Changes

- New `Hero`: a `Section` (default `pink`) named by its `Heading level={1}`, with the lead, an optional note and the page's one hero `Button`. Props `title`, `href`, `surface`; named slots `lead` and `action` (the label), `children` for the note. Bottom padding `--space-8`.
- On a page with a hero, the header lies transparent over it, and the hero's background starts at the window's top edge (see `design.md`). Logo and menu stay in `<header>`.
- The hero button drops from `--step-3` to the primary's `--step-2`; both layers and the hover jump stay and scale with it, on `/gestaltung` too.
- The hero label never gets a hyphen: `hyphens: manual`, and the handle carries `<wbr>` before "dich" and "darmstadt".
- `/` swaps section 1 for `Hero`.

Decisions:

- The primary's size over a size of its own, because the layers and jump set the hero apart.
- `Hero` renders its `Section` and its hero `Button`, because a hero is a whole band and owns the page's one hero button.
- `useId()` for `aria-labelledby` over an id prop, because nothing links to the hero.
- `<wbr>` plus `hyphens: manual` over `hyphens: none`, because `none` alone lets `overflow-wrap` cut the handle anywhere at 320px.
- Named slots over JSX props, because Astro passes slots to React as props and keeps `<wbr>` in the page.

Out of scope: the background pattern itself, hero images or tilt, dark hero surfaces, hero variants for `/run-and-rave` and `/festival` (planned with those pages), other `Button` sizes, copy changes.

## Capabilities

### New Capabilities

- `hero`: the top band of a page: named by the only h1, one background from the top edge behind the header, label wraps without hyphens.

### Modified Capabilities

None. `home-page`'s "One hero button to Instagram" keeps holding.

## Impact

New `web/src/components/Hero/`; `Button.css`, `Base.astro`, `index.astro`, `docs/styleguide.md`. No new dependencies.
