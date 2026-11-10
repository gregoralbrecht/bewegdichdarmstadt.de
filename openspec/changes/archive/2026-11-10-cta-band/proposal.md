# Proposal

## Why

Section 6 on `/` (Spenden) is bare HTML: a `Section`, `Prose`, an `h2`, a paragraph and a `Button` in the page's own `.actions` row. The same shape (a heading, a line of text, one button) will close other pages too, so it becomes a component.

## What Changes

- New `CtaBand`: a `Section` (default `pink`) named by its `Heading level={2}` (`title`), then `children` as the text, then one primary `Button` to `href` with the `action` slot as its label. Props `title`, `href`, `surface`, `id`; named slot `action`.
- The button row gets room for the hard shadow, like `.hero__action`.
- `/` swaps section 6 for `CtaBand`, with `id="spenden"` so the placeholder href `#spenden` still lands on it. The PayPal placeholder note stays as a marked `<p>` in the text.
- `docs/styleguide.md` lists `CtaBand` under Components.

Decisions:

- Primary over hero button, because the hero is the page's one hero button.
- `CtaBand` renders its own `Section`, like `Hero`, because the band is the whole component.
- `useId()` for `aria-labelledby` plus an optional `id` on the section over a heading-id prop, because only a placeholder link targets the band, and an id on the section does that without the caller naming the heading.
- Any surface, because a primary button reads on every surface through the roles.
- `action` as a named slot over a string prop, to match `Hero` and allow `<wbr>`.

Out of scope: the PayPal link itself (open question for the founders), a second button, images or tilt, other pages using the band, copy changes.

## Capabilities

### New Capabilities

- `cta-band`: a band named by its h2 that holds exactly one button, never a hero button.

### Modified Capabilities

None. `home-page`'s "One hero button to Instagram" and "Sections named by their headings" keep holding.

## Impact

New `web/src/components/CtaBand/`; `index.astro`, `docs/styleguide.md`. No new dependencies.
