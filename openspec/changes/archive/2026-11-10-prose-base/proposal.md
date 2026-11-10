# Proposal

## Why

Running text is unstyled: full-width paragraphs, color-only links, bare lists. The placeholder pages show a bare `<h1>` outside the content column. The hero, "Für alle" and Spenden all need body text and a lead.

## What Changes

- New `Prose` wrapper: paragraphs about 65 characters wide, vertical rhythm, lists with markers. Links are bold `--fg` with a wavy `--line` underline that rolls on hover; under reduced motion it straightens into a line instead.
- New `--wave` role on every surface: the wave in that surface's `--line`, as an image.
- New `Lead`: the `<p>` under a heading, at `--step-1`.
- `/run-and-rave`, `/festival`, `/ueber-uns`, `/impressum` and `/datenschutz` move into a `Section` with `Heading level={1}` and `Prose`; `/gestaltung` uses `Lead` and `Prose`.

Decisions:

- A scoped wrapper over global element styles, because menu, footer, buttons and cards style their own links and lists.
- `Lead` as its own component over a `Prose` prop, because the hero's lead sits outside prose.
- A wave over a plain underline, because it reads playful, not default.
- An SVG image over `text-decoration: wavy`, because only an image can roll; `contrast.test.ts` checks each wave's stroke matches its `--line`.
- A straight line under reduced motion over no hover change, because one switch is not motion.
- Wave geometry as custom properties and a `waveImage()` helper over fixed values, so a Storybook story can tune it live.

Out of scope: the token preview on `/`, headings in prose, real placeholder copy, tables, quotes.

## Capabilities

### New Capabilities

- `prose`: how running text reads on every surface: line length, link cue, link hover, list markers.

### Modified Capabilities

None.

## Impact

New `web/src/lib/wave.ts`, `web/src/components/Prose/` and `Lead/` (component, CSS, stories), the six pages above, `styles/tokens.css`, `contrast.test.ts` and `docs/styleguide.md`. No new dependencies.
