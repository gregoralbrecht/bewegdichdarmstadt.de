# Design

## Context

`<header>` (logo, and the fixed `MainMenu`) sits in flow above `<main>` on the body's cream. The hero is the first `Section` in `<main>`. For a pattern to run behind the logo, one element has to paint it from the window's top edge. The reference is the Schalke 04 ticket shop: a transparent header over the first block, which pads its content by `--header-height`.

## Decisions

**The header overlays the hero, and the hero paints from the top.** On a page with a hero, `Base.astro` sets the header to `position: absolute`, full width, no background, above the hero. The hero's top padding is `--header-room` plus the `Section` default.

- Over coloring the header with the hero's surface: two elements would paint the background, so a pattern would break at the seam.
- Over pulling the hero up with a negative margin: same height math, plus margin collapsing with `<main>`.
- Over moving the logo into the hero: logo and menu are the banner landmark; inside `<main>` they'd lose it.

**`Base.astro` publishes the room, `Hero` uses it.** `Base` defines `--header-height` (the header's own height: `max(--menu-row, the logo's line)` plus `2 * --space-5`, as it already computes) and sets `--header-room: var(--header-height)` under `body:has(.hero)`. `Hero.css` reads `var(--header-room, 0px)`. The header gets `height: var(--header-height)` on hero pages, so overlay and padding always match.

- `:has()` over a `Base` prop, because the page can't forget to pass it. Without `:has()` the header stays in flow and `--header-room` stays 0: cream strip, nothing overlaps.

**Light surfaces only, for now.** The header is transparent and its roles come from the body (cream): ink logo, ink focus ring. That reads on every light surface. `Hero`'s `surface` type excludes `night` and `ink` until a dark hero is needed; then the header takes the hero's roles.

## Risks / Trade-offs

- [The logo wraps and the header grows past `--header-height`, so it overlaps the h1] → the logo fits on one line at 320px; task 3.3 checks it at 320px and at 400% zoom of 1280px. If it wraps, `--header-height` counts the logo's real line count.
- [The fixed menu card covers the h1 on wide screens] → the hero's top padding already includes `--menu-row` through `--header-height`.
