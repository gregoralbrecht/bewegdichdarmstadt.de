# Tasks

## 1. Tokens

- [x] 1.1 Add `web/src/styles/tokens.css` with the primitives (Color table hex values), semantic aliases (`--bg`, `--fg`, `--line`, `--card`, `--accent`, `--muted`), shadows, borders, `--radius-pill`, type scale, spacing, motion and layout tokens, plus a minimal base (box-sizing, body font, colors, 18px text); import it from the page and verify `pnpm build` passes and the built CSS contains the tokens
- [x] 1.2 Add a Vitest contrast test that parses hex primitives from `tokens.css`, computes WCAG contrast, and checks every pair in the styleguide's Color table (AA 4.5, plus the documented "never" pairs fail); verify `pnpm test` passes and a temporarily broken hex makes it fail
- [x] 1.3 Update `docs/styleguide.md`: point to `tokens.css` as the code source, document the two layers and the new scales (type, spacing, motion, layout, radius); verify every token named in the doc exists in `tokens.css`

## 2. Fonts

- [x] 2.1 Copy the pitch's `bricolage-display.woff2`, `figtree.woff2` and OFL licences to `web/src/assets/fonts/`, configure both families in `web/astro.config.ts` with the local provider (variable weights 500–800 and 400–800, `swap`, CSS variables `--font-display` / `--font-text`), and render them via `<Font>` with preload; verify the built HTML has at most 2 font preloads and generated fallback `@font-face` rules with metric overrides
- [x] 2.2 Verify the font files contain the German characters (ä ö ü ß „ “ –), e.g. by rendering them on the preview page and checking no fallback glyphs show in the browser

## 3. Token preview

- [x] 3.1 Turn `web/src/pages/index.astro` into the token preview: swatches with hex, role and contrast pairs; shadow and border scale; both fonts with sample German text; type scale; spacing; one sticker card in a `<ul>` with the press interaction and reduced-motion handling; keep `.astro` thin (data in a `.ts` file if it grows logic); verify in the browser at 320px and desktop width, keyboard focus is visible, and axe in the browser reports no issues
- [ ] 3.2 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then after the user confirms the push, verify the deploy is green and the preview is live on the workers.dev URL

## Log

- Font stacks are not in `tokens.css`: the Fonts API's `<Font>` already sets `--font-display` / `--font-text` on `:root`, and a second definition would fight it over cascade order. The styleguide says so.
- Vitest stubs CSS imports to an empty string, even with `?raw`, so the contrast test reads `tokens.css` with `node:fs`. That needed `@types/node` as a dev dependency for `tsc`; still no new runtime dependencies.
- Contrast math lives in `web/src/lib/contrast.ts` and the Color table in `web/src/lib/palette.ts`, shared by the test and the preview page, so the ratios shown on the page are the ones the test checks.
- Added a `--focus` alias (→ `--orange-deep`) and a global `:focus-visible` rule in the base; the styleguide's focus rule names it now.
- `--step-0` min raised from the pitch's 1.06rem to 1.125rem to meet the 18px body text rule.
- Generated fallback faces use Arial with metric overrides; `system-ui` sits after them in the stack.
- Glyph check (2.2) done two ways: fontTools cmap check of both WOFF2 files and `document.fonts.check` in the browser.
- 320px check done in a 320px iframe, because Chrome windows can't get that narrow: no element wider than the viewport. axe-core 4.10.2: 0 violations.
- Follow-up: the preview has no skip link or footer; fine for a temporary page, but the real layout needs both (styleguide checklist).

## Workflow follow-up

- Archive with `openspec archive design-tokens`.
