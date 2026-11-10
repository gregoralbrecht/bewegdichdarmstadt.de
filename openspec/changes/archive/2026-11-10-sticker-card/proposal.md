# Proposal

## Why

The cards in sections 2 and 5 on `/` are bare `<article>`s: only the heading text links, and nothing looks like a sticker. The styleguide's sticker card (tilt, one stretched heading link, the press) exists only as a prototype on `/gestaltung`, so `Card` takes it over.

## What Changes

- `Card` gets `tilt` (`-3` to `3`, no `0`), set as `--tilt` in degrees. The whole card tilts, text and dates included.
- New `CardLink` in `Card.tsx`: an `<a class="card__link">` for the card's heading, whose `::after` covers the card. The focus ring goes on the card and tilts with it.
- Only a card with a `CardLink` moves: hover lifts it 2px with a 10px shadow, press pushes it in. Under reduced motion it keeps tilt and shadow change but doesn't move.
- `/`: Run & Rave (`tilt={-2}`) and Festival 2027 (`tilt={2}`) use `CardLink`; Steffi and Lea become tilted `Card`s without a link.
- `/gestaltung`: the sticker prototype becomes a `Card`; its CSS goes.
- `docs/styleguide.md`: a tilted card tilts everything in it; only linked cards move.

Decisions:

- Tilting everything together over counter-rotating text, because crooked text inside a card looks wrong (Gregor).
- `CardLink` over `title`/`href` props, because what comes before the heading differs per card (the festival slot's time).
- No link on person cards, because there's no page per person and "Mehr über uns" links to `/ueber-uns`; things you can't click don't move.
- A `tilt` union over a free number, because the types then keep the range.

Out of scope: alternating tilts and the list layout (`card-grid`), tags and states (`event-card`), photos (`person-card`), wiggle, tape, badges.

## Capabilities

### New Capabilities

- `sticker-card`: one link covering the card, a focus ring around it, movement only on linked cards and never under reduced motion.

### Modified Capabilities

None. `home-page`'s requirements keep holding.

## Impact

`web/src/components/Card/`, `index.astro`, `gestaltung.astro`, `docs/styleguide.md`. No new dependencies.
