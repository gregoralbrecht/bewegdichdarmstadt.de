# Proposal

## Why

Every page and component will need the styleguide's values, and the palette is still a placeholder until Gregor and the client decide on the colors together. Tokens in code, plus a preview page on the deploy URL, give that meeting something real to react to, and changing a color afterwards becomes a one-line edit.

## What Changes

- `web/src/styles/tokens.css`: CSS custom properties in two layers. The primitives hold the palette (`--ink`, `--cream`, `--orange`, ...); the semantic aliases (`--bg`, `--fg`, `--line`, `--card`, `--accent`) are what components use. It also holds the styleguide's shadows, borders and font stacks.
- The styleguide's gaps get filled, mostly from the pitch: type scale `--step--1..4`, spacing `--space-1..8`, motion (`--ease-spring`, `--dur-fast`/`--dur`/`--dur-slow`), layout (`--maxw`, `--gutter`), `--radius-pill`. `docs/styleguide.md` documents them.
- Fonts come in through the Astro Fonts API with the local provider, using the pitch's subset variable WOFF2 files (Bricolage Grotesque, Figtree). Astro generates the fallback faces and the preload links.
- A Vitest contrast test reads `tokens.css` and checks every pair from the styleguide's Color table against WCAG AA.
- The hello page becomes a token preview: swatches with their contrast pairs, shadows and borders, both fonts, the type scale, spacing, and one sticker card with the press interaction.

Out of scope: accent tints (they wait for the client meeting), dark mode, components beyond the preview card, Storybook, a separate route for the preview.

Decisions:

- Plain CSS custom properties over Tailwind, because the look relies on per-element custom properties (`--rot`, the press states) and plain CSS keeps the CSS budget small.
- Astro Fonts API over copying the pitch's hand-written `@font-face` rules, because it generates fallback metrics, so changing a font later only means swapping a file.
- Styleguide shadows (4/8/12px) and radius (0 or pill) over the pitch's 4/7px and 1.1rem, because the styleguide is newer and is the source of truth.
- Preview on `/` over a separate route, because it is the only page for now; it moves to Storybook or its own route once real pages arrive.

## Capabilities

### New Capabilities

None. Design tooling and a temporary preview page, `skip_specs: true`.

### Modified Capabilities

None.

## Impact

New: `web/src/styles/tokens.css`, a contrast test, and font files with their OFL licences under `web/src/assets/fonts/`. Changed: `web/astro.config.ts` (fonts), `web/src/pages/index.astro`, `docs/styleguide.md`. No new runtime dependencies.
