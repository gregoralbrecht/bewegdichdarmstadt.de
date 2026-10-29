# Proposal

## Why

With `prefers-reduced-motion: reduce`, buttons give no hover or press feedback at all: hover and press are movement only, and reduced motion drops movement. The styleguide asks to keep color and shadow changes and drop only the movement.

## What Changes

- Under reduced motion, hovering a button puts a dotted underline under its label: thick round dots, offset below the text, in the label's color. Only on devices that can hover.
- Under reduced motion, pressing a button hides its shadow instantly; the face stays put and reads as pressed flat. For the hero, both layers hide, which matches how a pressed hero looks with motion.
- Focus is unchanged. Primary, secondary and hero all follow.
- The stories check the underline and the hidden shadow, through new Vitest browser commands that hold the mouse down.
- One line in the styleguide's reduced-motion section.

Decisions:

- An underline over a hover color change, because a color change needs a hover-fill role per surface and contrast checks, which wait for the palette meeting.
- A dotted underline over a solid one, because the neobrutalist direction allows for playful details.
- A hidden shadow over a bigger one, because a bigger shadow changes the button's shape and the spec says it stays in place.
- Hiding both hero layers over only the first, because the second would float one depth away from the face.
- A `(hover: hover)` guard over a bare `:hover`, because on touch screens hover sticks after a tap and the label would stay underlined.
- Playwright `mouse.down()` as a browser command over CDP mouse events, because it presses where the hover left the pointer, with no iframe coordinate math.

Out of scope: hover color changes, forced-colors mode, motion behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `surfaces`: buttons under reduced motion still show hover and press feedback.

## Impact

`Button.css`, `Button.stories.tsx`, `web/vitest.config.ts` plus a type declaration for the commands, `docs/styleguide.md`. No new dependencies.
