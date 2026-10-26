# Beweg dich, Darmstadt — Styleguide

This file is the single source of truth for the site's visual design. Change it here, in the repo.

## Direction

The site is **neobrutalist**: loud, tactile, playful, joyful, colorful, and a little crooked, but never at the cost of speed, accessibility or clean markup.

Four pillars define the look:

1. **Huge hard drop shadows everywhere.** Offset, zero blur, always in ink.
2. **A bold but limited palette.** Ink, two backgrounds, a few accents. Nothing else.
3. **High contrast.** Every text and color pair passes WCAG AA; body text aims for AAA.
4. **Sticker-style feature cards.** Thick outlines, slight tilt, they look stuck onto the page.

The quality bar sits above all four. When style and quality conflict, quality wins:

- **Speed:** CSS-first effects; a motion library such as Motion for React only where CSS falls short (e.g. dialogs), loaded on demand. Minimal fonts and JavaScript.
- **Accessibility:** WCAG 2.2 AA as the floor, keyboard-first, respects reduced motion.
- **Semantics:** real HTML elements for real things; ARIA only where HTML has no answer.

## Color

> **Draft:** The colors below are not final. Gregor and the client will define the palette together in a meeting; until then, treat these values as placeholders.

The palette is the pitch's, cut to one ink, two surfaces and three accents. Each accent has one job, and text on it is always ink unless the table says otherwise.

| Token           | Hex     | Role                             | Text on it    | Contrast    |
| --------------- | ------- | -------------------------------- | ------------- | ----------- |
| `--ink`         | #1b1a33 | Text, borders, shadows           | cream / white | 15.9 / 16.9 |
| `--cream`       | #fff7ec | Page background                  | ink           | 15.9        |
| `--white`       | #ffffff | Card and input surface           | ink           | 16.9        |
| `--orange`      | #f8971c | Primary accent: CTAs, highlights | ink           | 7.6         |
| `--pink`        | #f29ac2 | Secondary accent: stickers, tags | ink           | 8.2         |
| `--indigo`      | #25378d | Dark bands, footer, signal       | white / cream | 10.4 / 9.8  |
| `--muted`       | #55536e | Secondary text on light          | on cream      | 6.9         |
| `--orange-deep` | #a85500 | Orange as text or link on light  | on cream      | 5.0         |
| `--pink-deep`   | #b8326f | Pink as text on light            | on cream      | 5.3         |

Rules:

- **Never put white text on orange (2.2) or pink.** Use ink.
- **Never use plain orange or pink as text on cream** (2.1 and 1.9). Use the `-deep` variants.
- **No new colors without a contrast check.** A new accent must pass 4.5 with ink or white before it lands.
- **Three flat steps per accent.** `--{accent}-tint` (light, for surfaces and subtle differentiation), the base color, and `--{accent}-deep` (text on light). No gradients, no blur, no in-between shades. Tint values follow once the palette is agreed with the client.
- **Color never carries meaning alone.** Pair it with an icon, a word or a shape.
- **Dark mode is out of scope for launch.** Tokens stay semantic (`--bg`, `--fg`, `--line`) so it can come later.

Open question: indigo, orange and pink may be one accent too many. Try a version without indigo before launch.

## Shadows and borders

Shadows grow from the pitch's 4px and 7px to a three-step scale, always hard, always ink, always offset down-right.

| Token           | Value                    | Use                          |
| --------------- | ------------------------ | ---------------------------- |
| `--shadow-sm`   | `4px 4px 0 var(--ink)`   | Buttons, tags, inputs        |
| `--shadow`      | `8px 8px 0 var(--ink)`   | Cards, sticker cards         |
| `--shadow-lg`   | `12px 12px 0 var(--ink)` | Hero blocks, featured event  |
| `--border`      | `3px solid var(--ink)`   | Every card, button and input |
| `--border-thin` | `2px solid var(--ink)`   | Small chips, table rules     |

Rules:

- **Zero blur, always.** Blurred shadows break the style and cost paint time.
- **One light source.** Shadows never point up or left.
- **On mobile, step down one size** (`--shadow-lg` becomes `--shadow`) so offsets don't eat the 16px gutter.
- **Radius is small or none:** 0 for cards, 999px for pills. Nothing in between.

**Focus states** must look different from hover:

- Use `:focus-visible` with a 3px `--orange-deep` outline at 3px offset, on top of the normal shadow.
- Never remove an outline without replacing it.
- The focus ring must stay visible on tilted cards and inside dark indigo bands (use cream there).

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

Two self-hosted fonts from the pitch: **Bricolage Grotesque** for display, **Figtree** for text. Each has a metric-matched fallback so the layout doesn't jump while fonts load.

| Token            | Font                      | Use                                |
| ---------------- | ------------------------- | ---------------------------------- |
| `--font-display` | Bricolage, then system-ui | Headings, card titles, big numbers |
| `--font-text`    | Figtree, then system-ui   | Body, UI, forms                    |

Rules:

- **WOFF2 only, subset to Latin plus German characters** (ä ö ü ß, „“, –).
- **At most 2 font files preloaded** on any page. Use variable fonts or one weight per family.
- **`font-display: swap`** with the fallback faces from the pitch.
- **Body text 18px minimum,** line height about 1.5, lines no wider than about 70 characters.
- **Sizes in `rem`** with `clamp()` for headings, so browser zoom and user font settings work.
- **Uppercase sparingly:** short labels only, with a little letter spacing.

## Motion and micro-interactions

Motion is small, springy and physical: things press, wiggle and settle. It is CSS-first, with a motion library only for complex cases like dialog enter and exit, and always has a reduced-motion version (library animations included).

The core pattern is the **press**:

| State          | Transform               | Shadow                        |
| -------------- | ----------------------- | ----------------------------- |
| Rest           | none                    | `--shadow` (8px)              |
| Hover          | `translate(-2px, -2px)` | 10px                          |
| Active (press) | `translate(8px, 8px)`   | 0                             |
| Focus-visible  | none                    | `--shadow` plus focus outline |

Timing:

- **Duration:** 120–200ms for hover and press, up to 400ms for entrances.
- **Easing:** a spring with slight overshoot, e.g. `cubic-bezier(.34, 1.56, .64, 1)`, or `linear()` where supported.
- **Animate only `transform` and `opacity`.** Never width, height, top or box-shadow blur.

Allowed extras, each used sparingly:

- Sticker wiggle on hover (rotate to `--rot` plus or minus 2°).
- Marquee ticker for announcements, pausable and with a pause button.
- Small celebrations (confetti, emoji burst) only after an action, such as adding an event to a calendar.

Reduced motion:

- Under `prefers-reduced-motion: reduce`, keep color and shadow changes, drop movement, rotation animations and marquees.
- Nothing loops forever without a pause control (WCAG 2.2.2).
- Nothing flashes more than 3 times per second.

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
