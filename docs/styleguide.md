# Beweg dich, Darmstadt — Styleguide

This file is the single source of truth for the site's visual design. Change it here, in the repo.

In code, every value below lives in [`web/src/styles/tokens.css`](../web/src/styles/tokens.css) as a CSS custom property. Change a value in both places in the same commit. The font stacks are the exception: the Astro Fonts API in `web/astro.config.ts` defines `--font-display` and `--font-text`.

Tokens come in two layers:

- **Primitives** name a raw value: `--ink`, `--cream`, `--orange`. Only the token file uses them.
- **Surface roles** name a job: `--bg`, `--fg`, `--line`. Each surface sets every role, and components read roles only, so a section that changes its surface recolors everything inside it.

## Direction

The site is **neobrutalist**: loud, tactile, playful, joyful, colorful, and a little crooked, but never at the cost of speed, accessibility or clean markup.

Four pillars define the look:

1. **Huge hard drop shadows everywhere.** Offset, zero blur, in the surface's `--line` color.
2. **A bold but limited palette.** Ink, two backgrounds, a few accents. Nothing else.
3. **High contrast.** Every text and color pair passes WCAG AA; body text aims for AAA.
4. **Sticker-style feature cards.** Thick outlines, slight tilt, they look stuck onto the page.

The quality bar sits above all four. When style and quality conflict, quality wins:

- **Speed:** CSS-first effects; a motion library such as Motion for React only where CSS falls short (e.g. dialogs), loaded on demand. Minimal fonts and JavaScript.
- **Accessibility:** WCAG 2.2 AA as the floor, keyboard-first, respects reduced motion.
- **Semantics:** real HTML elements for real things; ARIA only where HTML has no answer.

## Color

> **Draft:** The colors below are not final. Gregor and the client will define the palette together in a meeting; until then, treat these values as placeholders.

### Surfaces

A section picks one surface with `data-surface` (the `Section` component's `surface` prop), and everything inside follows. The page itself is cream. Each surface sets every role:

| Surface  | `--fg` | `--muted`   | `--line` | `--pop` | `--accent` / `--on-accent` | `--link`    | `--focus`   | `--hero-1` / `--hero-2` | `--hero-ink` |
| -------- | ------ | ----------- | -------- | ------- | -------------------------- | ----------- | ----------- | ----------------------- | ------------ |
| `cream`  | ink    | muted-light | ink      | orange  | orange / ink               | orange-deep | orange-deep | pink / violet           | `--line`     |
| `white`  | ink    | muted-light | ink      | orange  | orange / ink               | orange-deep | orange-deep | pink / violet           | `--line`     |
| `night`  | white  | muted-dark  | orange   | orange  | cream / ink                | pink        | orange      | pink / violet           | transparent  |
| `ink`    | cream  | muted-dark  | orange   | orange  | cream / ink                | orange      | orange      | pink / violet           | transparent  |
| `orange` | ink    | ink         | ink      | white   | white / ink                | ink         | ink         | pink / violet           | `--line`     |
| `pink`   | ink    | ink         | ink      | white   | orange / ink               | ink         | ink         | violet / white          | `--line`     |
| `violet` | ink    | ink         | ink      | white   | orange / ink               | ink         | ink         | pink / white            | `--line`     |

`--bg` is the surface's own color. `--line` draws the borders and shadows of filled shapes. `--pop` is the h1's text shadow, `--accent` the primary button fill with `--on-accent` as its label, `--hero-1` and `--hero-2` the hero button's two layers, and `--hero-ink` their edges: `--line` on light surfaces, transparent on dark ones, so the stack goes flat there like the two-tone heading. On dark surfaces `--accent` is cream, because an orange button would merge with its orange line.

A Vitest test (`web/src/styles/contrast.test.ts`) reads every `[data-surface]` block from `tokens.css` and checks that each declares every role and that `--fg`, `--muted`, `--link` and `--on-accent` (on `--accent`) reach 4.5, and `--line` and `--focus` reach 3, against the surface. It also checks that `--accent` differs from `--line`, and that no role but `--hero-ink` is transparent. A new surface needs no new test, only a new block.

### Palette

Two tiers. The **core palette** makes surfaces and accents:

| Token           | Hex     | Role                                |
| --------------- | ------- | ----------------------------------- |
| `--ink`         | #1b1a33 | Text, borders, the footer's surface |
| `--night`       | #141c4d | Dark surface: Run & Rave            |
| `--cream`       | #fff7ec | Page surface                        |
| `--white`       | #ffffff | Card and input surface              |
| `--orange`      | #f8971c | Primary accent: CTAs, highlights    |
| `--pink`        | #ff90e8 | Loud surface, hero layer            |
| `--violet`      | #b05cf8 | Loud surface, hero layer            |
| `--orange-deep` | #a85500 | Orange as text or link on light     |
| `--muted-light` | #55536e | Secondary text on light             |
| `--muted-dark`  | #c9c6e6 | Secondary text on dark              |

`--violet` is #b05cf8, not the requested #ab54f7: ink on #ab54f7 is 4.30, below AA.

The **tag palette** (WIP, values TBD with the client) is for tags and card fills only, never for a surface, and always carries ink text. The test checks each against ink at 4.5.

| Token            | Hex     |
| ---------------- | ------- |
| `--tag-lime`     | #c6f36b |
| `--tag-sky`      | #8fd3ff |
| `--tag-mint`     | #9ef0c8 |
| `--tag-lilac`    | #d4b8ff |
| `--tag-yellow`   | #ffd84d |
| `--tag-lavender` | #dcd8f0 |
| `--tag-peach`    | #ffc3a0 |

Rules:

- **Polarity.** Light surfaces (cream, white, orange, pink, violet) carry ink text; dark surfaces (night, ink) carry white or cream. Never white on orange (2.2) or pink (2.0), never plain orange as text on cream (2.1).
- **Cards are white islands.** On a dark or loud surface, a card is white, so its content reads like on cream. A card gets a color fill from the tag palette only when the color carries meaning (a time slot, a category), and only on light surfaces.
- **No new colors without a contrast check.** A new surface or tag color lands with its block in `tokens.css`, and the test must pass.
- **Color never carries meaning alone.** Pair it with an icon, a word or a shape.
- **Dark mode is out of scope for launch.** Components read roles, so it can come later as a surface.

## Shadows and borders

Shadow tokens are offsets only and border tokens are widths only. The use site adds the color, so both follow the surface they sit on: `box-shadow: var(--shadow) var(--line)`, `border: var(--border) solid var(--line)`. A color inside a `:root` token would resolve once at the root and stay ink everywhere.

| Token           | Value             | Use                               |
| --------------- | ----------------- | --------------------------------- |
| `--shadow-sm`   | `4px 4px 0`       | Buttons, tags, inputs             |
| `--shadow`      | `8px 8px 0`       | Cards, sticker cards              |
| `--shadow-lg`   | `12px 12px 0`     | Hero blocks, featured event       |
| `--shadow-pop`  | `0.06em 0.06em 0` | The h1's text shadow, in `--pop`  |
| `--border`      | `3px`             | Every filled card, button and tag |
| `--border-thin` | `2px`             | Small chips, table rules          |

Rules:

- **Zero blur, always.** Blurred shadows break the style and cost paint time.
- **One light source.** Shadows never point up or left.
- **On mobile, step down one size** (`--shadow-lg` becomes `--shadow`) so offsets don't eat the 16px gutter.
- **Borders follow `--line`,** like the shadow they extrude into: ink on light surfaces, orange on dark ones. A border in another color than its shadow reads as a seam. `Tag` is the exception and keeps an ink outline on every surface.
- **A fill never matches its line.** That is why `--accent` is cream on dark surfaces.

**Focus states** must look different from hover:

- Use `:focus-visible` with a 3px `--focus` outline at 3px offset, on top of the normal shadow (on a button, around its face). Each surface sets its own `--focus`; never override it locally.
- Never remove an outline without replacing it.
- The focus ring must stay visible on tilted cards and on every surface.

## Sticker cards

A sticker card is a bordered, shadowed card tilted between -3° and 3°, so it looks hand-placed. It is the main way features and events get attention.

Look:

- `--border`, `--shadow`, a white or accent surface.
- Tilt set per card with a `--rot` custom property (as in the pitch), between -3° and 3°.
- Neighbors tilt in opposite directions; never two in a row the same way.
- Optional extras: a tape strip on one corner, a small badge sticker overlapping the edge.

What may tilt:

- **Yes:** cards, badges, images, short headlines (up to about 5 words).
- **No:** paragraphs, forms, inputs, navigation, tables, dates and times inside a card. These stay straight; tilt the card, then counter-rotate long content if needed.

Markup:

- A group of cards is a `<ul>` with one `<li>` per card, and the card is an `<article>` with a real heading.
- The whole card is clickable through **one** link on the heading, stretched over the card with a pseudo-element. No nested links or buttons.
- Decorative extras (tape, doodles) are CSS or `aria-hidden` SVG.
- Dates use `<time datetime>`.

## Typography

Two self-hosted fonts from the pitch: **Bricolage Grotesque** for display, **Figtree** for text. The files live in `web/src/assets/fonts/` and come in through the Astro Fonts API, which generates a metric-matched fallback face for each so the layout doesn't jump while fonts load.

| Token            | Font                      | Use                                         |
| ---------------- | ------------------------- | ------------------------------------------- |
| `--font-display` | Bricolage, then system-ui | Headings, card titles, big numbers, buttons |
| `--font-text`    | Figtree, then system-ui   | Body, UI, forms                             |

Rules:

- **WOFF2 only, subset to Latin plus German characters** (ä ö ü ß, „“, –).
- **At most 2 font files preloaded** on any page. Use variable fonts or one weight per family.
- **`font-display: swap`** with the generated fallback faces.
- **Body text 18px minimum,** line height about 1.5, lines no wider than about 70 characters.
- **Sizes in `rem`** with `clamp()` for headings, so browser zoom and user font settings work.
- **Uppercase sparingly:** short labels only, with a little letter spacing.

The type scale is fluid, from 320px to wide screens:

| Token       | Range         | Use                     |
| ----------- | ------------- | ----------------------- |
| `--step-4`  | 2.6–5.6rem    | Page title (`<h1>`)     |
| `--step-3`  | 2.1–3.6rem    | Section headings        |
| `--step-2`  | 1.65–2.3rem   | Sub-headings            |
| `--step-1`  | 1.3–1.6rem    | Card titles, lead text  |
| `--step-0`  | 1.125–1.25rem | Body text (18px and up) |
| `--step--1` | 0.875–0.95rem | Short labels only       |

## Spacing and layout

Spacing is one scale, used for padding, gaps and margins alike:

| Token       | Value   |
| ----------- | ------- |
| `--space-1` | 0.25rem |
| `--space-2` | 0.5rem  |
| `--space-3` | 0.75rem |
| `--space-4` | 1rem    |
| `--space-5` | 1.5rem  |
| `--space-6` | 2.25rem |
| `--space-7` | 3.5rem  |
| `--space-8` | 5.5rem  |

Layout:

- `--maxw` (72rem): the widest a content column gets.
- `--gutter`: the side padding, 16px or the device's safe area, whichever is larger.

Radius has three steps, one per kind of thing:

| Token              | Value  | Use                       |
| ------------------ | ------ | ------------------------- |
| `--radius-control` | 0      | Buttons and inputs: sharp |
| `--radius-card`    | 1.5rem | Cards: very round         |
| `--radius-tag`     | 999px  | Tags: pill                |

## Motion and micro-interactions

Motion is small, springy and physical: things press, wiggle and settle. It is CSS-first, with a motion library only for complex cases like dialog enter and exit, and always has a reduced-motion version (library animations included).

The core pattern is the **press**. For cards:

| State          | Transform               | Shadow                        |
| -------------- | ----------------------- | ----------------------------- |
| Rest           | none                    | `--shadow` (8px)              |
| Hover          | `translate(-2px, -2px)` | 10px                          |
| Active (press) | `translate(8px, 8px)`   | 0                             |
| Focus-visible  | none                    | `--shadow` plus focus outline |

Buttons press in `em`, so the shadow grows with the label, each value rounded to whole pixels with `round(…, 1px)`. The shadow stays put; only the face moves:

| State          | Face transform                | Shadow offset                  |
| -------------- | ----------------------------- | ------------------------------ |
| Rest           | none                          | 0.16em (small: 0.22em)         |
| Hover          | up-left by half the offset    | unchanged                      |
| Active (press) | down-right by the full offset | unchanged; the face covers it  |
| Focus-visible  | none                          | unchanged, outline on the face |

Timing:

- **Duration:** `--dur-fast` (120ms) and `--dur` (200ms) for hover and press, `--dur-slow` (400ms) for entrances.
- **Easing:** `--ease-spring`, a spring with slight overshoot (`cubic-bezier(.34, 1.56, .64, 1)`); `linear()` where supported.
- **Animate only `transform` and `opacity`.** Never width, height, top or box-shadow blur.

Allowed extras, each used sparingly:

- Sticker wiggle on hover (rotate to `--rot` plus or minus 2°).
- Marquee ticker for announcements, pausable and with a pause button.
- Small celebrations (confetti, emoji burst) only after an action, such as adding an event to a calendar.

Reduced motion:

- Under `prefers-reduced-motion: reduce`, keep color and shadow changes, drop movement, rotation animations and marquees. No button moves on hover or press.
- Buttons still give feedback without moving: hover puts a dotted underline under the label (on devices that can hover), press hides the shadow (on the hero, both layers).
- Nothing loops forever without a pause control (WCAG 2.2.2).
- Nothing flashes more than 3 times per second.

## Components

Reusable parts live in `web/src/components/<Name>/`, one folder per component. Pages, layouts and the page shell stay `.astro`.

- **React `.tsx`** for every reusable part, so Storybook can render it. Astro renders it to static HTML at build time.
- **No `client:*` by default.** Without it a component ships no JavaScript. Hydrate only when a component needs to react to the user after load, and say why next to the directive.
- **Plain CSS per component** in `<Name>.css`, imported by the component and built only from tokens. No CSS-in-JS, no Tailwind. The root element gets a class named after the component (`.button`, `.heading`).
- **Variants are `data-*` attributes** named after the prop: `variant="hero"` becomes `data-variant="hero"`, styled as `.button[data-variant="hero"]`. No modifier classes.
- **Colors come from roles, never primitives.** A component reads `--fg`, `--line`, `--accent` and so on, so it works on every surface without a color prop. The tag palette is the one exception, through `Card`'s `fill` and `Tag`'s `color`.
- **Real elements decide behavior.** A component that can act as a link or a button renders `<a href>` or `<button type="button">`, never a `role`.
- **Every component has stories** in `<Name>.stories.tsx`: one per variant, plus play functions for keyboard use and anything the markup must guarantee. `pnpm test` runs every story in Chromium, and an axe violation fails it.

The building blocks:

- **`Section`** is a full-width band: `surface="night"` renders `<section data-surface="night">` with the content column inside. Give it an accessible name with `aria-labelledby` on its heading.
- **`Button`** is a static link or `<button>` that draws the shadow, with a `.button__face` inside that is the only part that moves. Labels are Bricolage. It has three variants:
  - `primary` (default): `--accent` fill, `--on-accent` label, `--line` border and shadow; lifts on hover, sinks on press.
  - `secondary`: rises and presses like the primary, filled with the surface's `--bg` so it looks hollow, `--fg` label, one type step smaller.
  - `hero`: the primary plus two layers in `--hero-1` and `--hero-2`, edged in `--hero-ink`; on hover the second layer jumps out. Always `--step-3`. At most one per page, for the main call to action.
- **Sizes.** The default is `--step-2` (secondary `--step-1`); `size="small"` is `--step-0` (secondary `--step--1`), for card actions. Two secondaries side by side are therefore equal.
- **Buttons fit their column.** A button and its shadow are never wider than the column; long labels wrap with hyphenation, never truncate. Every button's hit area is at least 44px tall.
- **A hero never sits next to another button.** Primary and secondary pair freely.
- **`Heading`** level 1 gets one hard text shadow in `--pop`.
- **`Card`** is an `<article>` with a white body (`data-surface="white"`) inside a frame whose `--line` border and shadow come from the surface around it: ink on cream, orange on night. `fill` gives the body a tag-palette color, only when the color carries meaning and only on light surfaces.
- **`Tag`** is a pill with a tag-palette `color`, ink text and a thin ink border, on any surface. The word carries the meaning, the color helps scanning.
- **`MainMenu`** is the main navigation in `Base.astro`'s header, built from the list in `web/src/lib/menu.ts`. To add a page to the menu, add an item there; both lists below pick it up.
  - From `66em` (wide enough for the logo beside it): a white sticker card (`data-surface="white"`, `--border`, `--shadow`, `--radius-card`), fixed and centered at the top. It never tilts. A `--menu-cut` ring in cream wraps the card and its shadow like a die-cut sticker, so the edge reaches 3:1 over every surface: ink meets cream, cream meets night and ink. Cream is a primitive here on purpose.
  - Below `66em`: a "Menü" button in the same card at the bottom edge (above the safe area) opens a `<dialog>` bottom sheet with the same links, through invoker commands (`commandfor`, `command`). Escape, "Schließen" or a tap outside close it, and focus returns to "Menü".
  - The current page has `aria-current="page"` and is drawn pressed in: `--accent` fill, `--line` edge, no shadow.
  - It hides while scrolling down and comes back on scroll up, near the top of the page and whenever focus is inside it. Under reduced motion it fades instead of sliding. A small script sets `data-menu="hidden"`; without JavaScript the menu never hides, and phones show the links inline in the bottom bar instead of the button.
  - `MainMenu.css` publishes the room the menu needs (`--menu-row`, `--menu-room-top`, `--menu-room-bottom`); `Base.astro` reserves it as header height, scroll padding and footer padding, so the menu never covers a focused element or the footer.

Storybook can't use the Astro Fonts API, so `web/.storybook/fonts.css` loads the same WOFF2 files with plain `@font-face` and sets `--font-display` and `--font-text`. Run it with `pnpm --filter web storybook`.

## Checklist for every page

A page ships when every box below is ticked.

**Speed**

- [ ] Lighthouse performance 95 or higher on mobile
- [ ] LCP under 2.0s, CLS under 0.05, INP under 200ms
- [ ] Under 100 KB of CSS and JS combined (compressed), and no JavaScript needed to read content
- [ ] Images in AVIF or WebP, with `width`, `height` and `loading="lazy"` below the fold

**Accessibility**

- [ ] Every color pair checked against the Color table
- [ ] Whole page usable by keyboard alone, with a visible focus ring everywhere
- [ ] Skip link to `<main>` as the first focusable element
- [ ] Works at 200% zoom and 320px width without horizontal scrolling
- [ ] Reduced-motion version checked
- [ ] Tested with VoiceOver, and axe reports no issues

**Semantics**

- [ ] One `<h1>`, headings in order with no skipped levels
- [ ] Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] Lists are lists, buttons are `<button>`, links are `<a href>`
- [ ] `lang="de"` on `<html>`, and `lang` set on any English text
- [ ] Meaningful `alt` text, empty `alt` on decorative images
- [ ] Events marked up with `<time datetime>` and schema.org `Event` data
