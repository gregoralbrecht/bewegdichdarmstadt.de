# Tasks

## 1. Wave token

- [x] 1.1 Add `web/src/lib/wave.ts`: `waveImage(color, { stroke, amplitude })` returns the SVG wave (`viewBox 0 0 20 8`, path `M0 4Q5 0 10 4T20 4`) as a CSS `url()`, plus the defaults (stroke 2.9, full amplitude), with a unit test for the encoding; verify `pnpm test` passes
- [x] 1.2 Add `--wave-ink` and `--wave-orange` to `tokens.css` as `waveImage()`'s output with the defaults; give every `[data-surface]` block a `--wave` pointing at the one matching its `--line`; verify `pnpm check` passes
- [x] 1.3 Extend `contrast.test.ts`: every surface declares `--wave`, its image's stroke color equals the surface's `--line`, and `--wave-ink`/`--wave-orange` equal `waveImage()` with the defaults, so the knobs and the tokens can't drift apart; verify `pnpm test` passes, and fails when one surface points at the wrong wave or a default changes
- [x] 1.4 Add `--wave` to the role table and the Color section of `docs/styleguide.md`, with the rule that a new line color needs a new wave; verify the table lists every role the test checks

## 2. Prose

- [x] 2.1 Add `web/src/components/Prose/` (`Prose.tsx`, `Prose.css`): a `<div class="prose">` that zeroes its children's margins and spaces them with `--space-4`; `p` and `li` capped at `65ch`; `<ul>`/`<ol>` with markers and an indent that keeps them inside the column at 320px; colors from roles only; verify `pnpm check` passes
- [x] 2.2 Links in `Prose`: bold, `--fg`, no `text-decoration`, `var(--wave)` as a bottom `repeat-x` background with `box-decoration-break: clone`; every geometry value is a custom property on `.prose` with the comparison page's value as default: `--wave-length` (0.62em), `--wave-height` (0.25em), `--wave-gap` (`padding-bottom`, 0.32em), `--wave-speed` (0.5s per period) and `--wave-line` (0.09em, the reduced-motion bar); on hover the background rolls one period per `--wave-speed`, linear, infinite; under reduced motion hover swaps it for a straight `--line` bar `--wave-line` thick through the wave's middle and nothing animates; the global dotted focus ring stays; verify by hovering at 1280px with and without reduced motion on cream, night and pink, and that a link wrapping onto two lines keeps the wave on both
- [x] 2.3 Add a `Wave` story to `Prose.stories.tsx` with Storybook controls for every knob: stroke and amplitude (rebuilt through `waveImage()` and set as `--wave` inline), the five custom properties from 2.2 as range sliders, the surface, and a toggle that pins the hover (a story-only class, never shipped in `Prose.css`); below the sample it prints the current values as a CSS snippet to paste into `tokens.css` and `Prose.css`, and the defaults match the shipped look; verify that moving each control changes the wave live in `pnpm --filter web storybook`
- [x] 2.4 Add the remaining `Prose.stories.tsx` stories with a heading, paragraphs, a link, a link that wraps, a `<ul>` and an `<ol>` on cream, night and pink; play functions check that the link's `background-image` is the surface's wave, that a long paragraph is no wider than 70 times the width of `0` in its font, and that list items show a marker (`list-style-type` not `none`); verify `pnpm test` passes with no axe violations
- [x] 2.5 Add `Prose` to the Components section of `docs/styleguide.md` (what it styles, the rolling wave and its reduced-motion line, how to tune the wave in the `Wave` story and carry the values over, that headings inside it stay `Heading`, that components keep their own link and list styles); verify every token it names exists in `tokens.css`

## 3. Lead

- [x] 3.1 Add `web/src/components/Lead/` (`Lead.tsx`, `Lead.css`, `Lead.stories.tsx`): a `<p class="lead">` at `--step-1`, line height 1.4, capped at `65ch`, usable inside or outside `Prose`; a story on cream and one inside `Prose`; verify `pnpm test` passes and the lead's font size equals `--step-1`
- [x] 3.2 Add `Lead` to the Components section of `docs/styleguide.md`; verify the entry matches the type scale table (`--step-1`: lead text)

## 4. Pages

- [x] 4.1 Move `/run-and-rave`, `/festival`, `/ueber-uns`, `/impressum` and `/datenschutz` into a `Section` named by its `Heading level={1}`, with the text in `Prose`; verify at 320px and 1280px that each h1 lines up with the logo's left edge and shows the `--pop` text shadow, and that `/impressum` still keeps the footer at the window's bottom without scrolling
- [x] 4.2 Replace `/gestaltung`'s local `.lead` and `p { max-width }` with `Lead` and `Prose`, dropping the styles they made unused; verify the page looks unchanged at 1280px apart from the link underline

## 5. Checks

- [ ] 5.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check every `prose` scenario by hand in Chrome and Safari

## Log

- The wave SVG has `preserveAspectRatio='none'`, so one period always fills one tile exactly and the roll stays seamless when the Wave story's length and height sliders change the tile's ratio.
- `Prose` styles only plain elements: links as `a:not([class])`, lists as `:is(ul, ol):not([class])`. On `/gestaltung` the buttons and the `.slots`/`.tags` lists sit inside `Prose` and keep their own styles. Astro marks scoped elements with `data-astro-cid-*` attributes, not classes, so page-local links still get the wave.
- Hover rolls the wave only under `(hover: hover)`, like `Button`, so a tap on a phone doesn't leave a wave rolling forever.
- The roll animates `background-position-x`, not `transform`/`opacity` as the styleguide's motion rules ask. An image underline can only roll that way; it runs only while hovered.
- Added a `Hover` story whose play function checks the roll and the still, straight bar under emulated reduced motion. Not in the tasks.
- The Wave story's snippet also prints the `waveDefaults` line for `wave.ts`, because `contrast.test.ts` fails if `tokens.css` changes without it.
- `/impressum` and `/datenschutz` have no text yet, so they get `Section` and `Heading` without `Prose`.
- Verified in headless Chromium against `astro preview`: h1 lines up with the logo (16px at 320, 64px at 1280) with the `--pop` shadow on all five pages, the footer ends at the window's bottom with no scroll, and there's no horizontal scroll at 320. Prose stories checked by screenshot on cream, night and pink, at rest, hovered, hovered with reduced motion, and with a wrapping link.
- 5.1's manual pass in Chrome and Safari is still open; only the automated checks and the headless-Chromium checks above ran.

## Workflow follow-up

- Tick `prose-base` in `docs/landing-page-plan.md`.
- Archive with `openspec archive prose-base`.
