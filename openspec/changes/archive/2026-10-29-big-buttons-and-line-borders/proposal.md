# Proposal

## Why

On dark surfaces the ink border is invisible (1.05:1 on night), so cards and buttons show a dark seam between the fill and an orange shadow, and the primary and secondary buttons follow two different line rules. Buttons should also be far bigger and more playful, and hover flickers at the button's edge.

## What Changes

- **BREAKING** Borders and shadows of filled shapes use `--line` on every surface: ink on light, orange on night. `--border`/`--border-thin` become widths only. On dark surfaces, `--accent` becomes cream so a button's fill never matches its line.
- **BREAKING** `Button` reworked: primary and secondary rise and press the same way; the primary is filled with `--accent`, the secondary with the surface color, one type step smaller. Labels in Bricolage, default size `--step-2`, `size="small"` at `--step-0` for card actions. The hero is always `--step-3`; on dark surfaces its layers drop their outlines.
- Buttons never grow wider than their column; long labels wrap with hyphenation, never truncate. Every button has a 44px touch target.
- The link is a static hit area that draws the shadow; only an inner face moves, with `transform` only. No hover flicker, sharp shadows at any zoom.
- `Card` gets a `--line` background so no hairline shows at its rounded corner.
- Styleguide, Storybook stories and `/gestaltung` follow.

Decisions:

- Line-colored borders over "borders stay ink", because a border must match the shadow it extrudes into or it reads as a seam.
- A hollow-looking secondary filled with the surface color over a transparent one, because the static shadow rectangle would show through.
- Two sizes plus the hero over a five-step scale, because both ends of a longer scale run off the type scale.

Out of scope: `Tag` borders, final palette values, the unreproduced hover hairline (a check task only).

## Capabilities

### New Capabilities

- `buttons`: label wrapping, touch target and stable hover for every button.

### Modified Capabilities

- `surfaces`: reduced motion covers every button, not just the hero; a button's fill must differ from its line on every surface.

## Impact

`tokens.css`, `contrast.test.ts`, `Button` (markup, CSS, stories), `Card.css`, `Base.astro` skip link, `index.astro`, `gestaltung.astro`, `docs/styleguide.md`. No new dependencies.
