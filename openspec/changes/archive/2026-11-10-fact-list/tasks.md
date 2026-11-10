# Tasks

## 1. FactList

- [x] 1.1 Add `web/src/components/FactList/` (`FactList.tsx`, `FactList.css`): `<dl className="fact-list">` from an `items: { term: string; detail: ReactNode }[]` prop, one `<div className="fact-list__fact">` per item holding its `<dt>` and `<dd>`, other `<dl>` props passed through; CSS lays the facts out as a grid (`repeat(auto-fit, minmax(min(100%, 15rem), 1fr))`, gaps from the spacing scale), puts a `--border-thin` rule in `--line` above each fact, resets the `<dd>` indent, draws a `::before` marker on each `<dt>` (a small square, about `0.6em`, in `--accent` with a `--border-thin` `--line` outline and a hard `--line` shadow, zero blur, no text content so it stays silent), and sets the detail in `--font-display` 700 at `--step-1`; colors from roles only; verify `pnpm check` passes
- [x] 1.2 Add `FactList.stories.tsx` with the five Für alle facts in `Prose` on orange, cream, pink and night; play functions check one `dl`, five `dt` and five `dd`, each `dd` directly after its `dt` inside the same `div`, and the first pair reads "Treffpunkt" / "Friedensplatz"; and each `dt`'s accessible text equals its visible term (the marker adds nothing); verify `pnpm test` passes with no axe violations
- [x] 1.3 Add `FactList` to the Components section of `docs/styleguide.md` (a `<dl>` of short facts, one `div` per pair, rules in `--line`, an `--accent` square marker per term until icons arrive, never cards or tilt, `items` prop); verify every token it names exists in `tokens.css`

## 2. Home page

- [x] 2.1 Replace the bare `<dl>` in section 3 of `index.astro` with `FactList`, keeping the five facts and their wording (including term "Demo", detail "angemeldet, mit Polizeibegleitung"); verify in the built HTML of `/` that section 3 holds one `dl.fact-list` with five `div`s, each with one `dt` and one `dd`
- [x] 2.2 Verify at 320px and 1280px against `astro preview` that the facts fill one column at 320px and several at 1280px, rules, markers and text read on orange (white markers, ink outline and shadow), and there's no horizontal scroll

## 3. Checks

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check the `fact-list` scenario and each `home-page` scenario on `/` by hand in Chrome

## Log

- The marker's shadow is `--shadow-sm` (4px), not a hand-picked smaller offset, so it stays on the token scale; it reads as a tiny sticker on the 0.6em square.
- `toHaveAccessibleName` can't check a `dt`: role `term` takes no name from content. The stories check the `dt`'s text equals its term and that the `::before` content is `""` instead.
- `--font-display` isn't in `tokens.css`; it comes from the Astro Fonts API (Storybook: `.storybook/fonts.css`), as the styleguide's Typography section says.
- Chrome wouldn't shrink the window below its minimum width, so the 320px check ran in a 320px iframe of `/` on the preview server.

## Workflow follow-up

- Archive with `openspec archive fact-list` and tick row 5 in `docs/landing-page-plan.md`.
