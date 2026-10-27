# Proposal

## Why

Components pick their colors by hand (`variant="pink"`, the indigo footer), so a dark Run & Rave section or a loud band means restyling everything inside it. Sections need to set a surface once and have headings, text, links, buttons and cards follow. The client needs to see this before the palette meeting.

## What Changes

- **BREAKING** `tokens.css` gains a surface layer: `[data-surface="cream|white|night|ink|orange|pink|violet"]` sets the role tokens (`--bg`, `--fg`, `--muted`, `--line`, `--pop`, `--accent`, `--on-accent`, `--link`, `--focus`, hero layers). Components read roles only.
- **BREAKING** Shadow tokens become offsets (`--shadow-sm: 4px 4px 0`), and components add the color, so nested surfaces recolor shadows.
- Palette: adds `--night` (#141c4d) and `--violet` (#b05cf8); pink becomes #ff90e8; `--indigo` and `--pink-deep` go. A tag palette (lime, sky, mint, lilac, yellow, lavender, peach) is marked WIP, for chips and fills only.
- Radius tokens: controls sharp, cards very round, tags pill.
- New `Section`, `Card` and `Tag` components. `Button` gets `variant="primary|secondary|hero"`: one hard shadow, or the hero's two exploding layers. `Heading` gets one `--pop` text shadow for the h1.
- Footer becomes an ink surface.
- New page `/gestaltung` (noindex) showing every surface, the button set, cards and tags, for the client.
- The styleguide's Color, Shadows and Components sections describe the new system.

Decisions:

- `#b05cf8` over the requested `#ab54f7`, because ink on `#ab54f7` is 4.30, below AA. It's the closest passing value.
- One `surface` attribute over a theme plus a surface, because a page's mood is its base surface.
- Tag violet renamed "lilac" over two violets, because `--violet` is now a loud surface.
- `/gestaltung` over replacing `/`, because the token preview stays until real pages arrive.

Out of scope: final palette values, a fixed color per topic, dark mode, real Run & Rave or Festival pages.

## Capabilities

### New Capabilities

- `surfaces`: what every surface guarantees about contrast and focus visibility.

### Modified Capabilities

None.

## Impact

`web/src/styles/tokens.css`, `web/src/lib/palette.ts`, `web/src/styles/contrast.test.ts`, `Button`, `Heading`, new `Section`/`Card`/`Tag`, `Base.astro`, `index.astro`, new `pages/gestaltung.astro`, `docs/styleguide.md`. No new dependencies.
