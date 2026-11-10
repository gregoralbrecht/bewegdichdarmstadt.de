# Proposal

## Why

The team cards in section 5 on `/` are plain `Card`s with a `<p>Foto folgt</p>` between name and line: nothing marks it as a photo's place, and when the photos arrive each card would need its own image markup. A person card makes the photo spot, and its placeholder, one component.

## What Changes

- New `PersonCard` in `web/src/components/PersonCard/`: a `Card` with the person's `name` as its `Heading level={3}`, a `photo` slot, and the one line as children. Other `Card` props pass through, `tilt` included.
- The photo sits above the name, in a square frame with a `--border-thin` `--line` border; a photo fills it with `object-fit: cover`.
- Without `photo`, the frame shows a placeholder: a dashed `--border-thin` `--line` border and the text "Foto folgt" in `--muted`, centered.
- No link, so the card tilts but never moves, as `sticker-card` requires.
- `/`: Steffi's and Lea's cards become `PersonCard`s without a photo; their "Foto folgt" paragraphs go.
- `docs/styleguide.md`: `PersonCard` under Components.

Decisions:

- A `photo` slot over an image prop, because Astro's `<Image>` (AVIF/WebP, `width`, `height`) only renders in `.astro`, and `Hero` already takes slots this way.
- Name first in the markup, photo moved above it with `order`, because the heading then opens the card for screen readers and the photo isn't focusable.
- Square over the old site's portrait crop, because it fits a two-column `CardGrid` at any width; the photos aren't here to say otherwise.
- "Foto folgt" as real text over an `aria-hidden` box, because a placeholder should be marked for everyone until it goes.

Out of scope: the photos themselves and their `alt` text, `/ueber-uns`, links to a page per person, sticker or tape effects on photos.

## Capabilities

### New Capabilities

- `person-card`: a team card without a photo shows a marked placeholder in the photo's place.

### Modified Capabilities

None. `sticker-card`, `card-grid` and `home-page` keep holding.

## Impact

New `web/src/components/PersonCard/`; `index.astro`, `docs/styleguide.md`. No new dependencies.
