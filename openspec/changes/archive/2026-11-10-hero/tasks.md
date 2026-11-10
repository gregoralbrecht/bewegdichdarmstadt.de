# Tasks

## 1. Hero button size

- [x] 1.1 In `Button.css` drop the hero variant's `font-size: var(--step-3)`, so it takes the primary's `--step-2`; keep both layers, the hover jump and the reduced-motion rules; change "Always `--step-3`" to "`--step-2`, like the primary" in `docs/styleguide.md`; add a play check to the hero story that its font size equals a default primary's; verify `pnpm test` passes, and on `/gestaltung` at 1280px the second layer still jumps out on hover and both layers hide on press under reduced motion

## 2. Hero

- [x] 2.1 Add `web/src/components/Hero/` (`Hero.tsx`, `Hero.css`): a `Section` (`surface` prop, default `pink`, typed to exclude `night` and `ink`) with `aria-labelledby` set to a `useId()` id on its `Heading level={1}` (`title`), then `Lead` (`lead` slot), `children` as the note, and `Button variant="hero"` (`href`, `action` slot as label) in a row with room for both hero layers; top padding `var(--header-room, 0px)` plus the `Section` default, bottom padding `--space-8`; colors from roles only; verify `pnpm check` passes
- [x] 2.2 On the hero's label set `hyphens: manual`, so only `<wbr>` and spaces break it; verify in a story that the face's computed `hyphens` is `manual` and other buttons keep `auto`
- [x] 2.3 Add `Hero.stories.tsx` with the plan's hero copy on pink, cream and orange, and the handle marked with `<wbr>`; play functions check one `h1`, a region named by its text, and exactly one `[data-variant="hero"]` linking to `href`; verify `pnpm test` passes with no axe violations
- [x] 2.4 Add `Hero` to the Components section of `docs/styleguide.md` (one per page, its own `Section` named by the h1, the header lying over it via `--header-room`, light surfaces only, `--space-8` bottom padding, label slot with `<wbr>` for handles and long words, no hyphens); verify every token it names exists in `tokens.css`

## 3. Home page

- [x] 3.1 In `Base.astro` define `--header-height` (`max(var(--menu-row), 1.05 * var(--step-1))` plus `2 * var(--space-5)`) and use it for the header's `min-height`; under `body:has(.hero)` set `--header-room: var(--header-height)` and make the header `position: absolute`, full width, `height: var(--header-height)`, no background, above the hero; verify `/run-and-rave` keeps its in-flow cream header unchanged and `pnpm check` passes
- [x] 3.2 Replace section 1 in `index.astro` with `Hero`: `title` "Beweg dich, Darmstadt!", `href` to Instagram, the lead in `<Fragment slot="lead">`, the label "Folge @beweg<wbr />dich<wbr />darmstadt" in `<Fragment slot="action">`, the winter line as `<p>`; drop now-unused imports; verify the built HTML of `/` contains the `<wbr>`s inside the button face and the lead inside `.lead` (named slots reach the React props)
- [x] 3.3 Verify at 320px, 768px and 1280px against `astro preview` that the label never shows a hyphen, pink runs from the top edge behind logo and menu with no seam (check with a temporary striped `background-image` on the hero, then remove it), the logo stays on one line and clear of the h1 (also at 400% zoom of 1280px), the white menu card's cream ring still reads over pink, the skip link still shows above everything on focus, logo and menu stay in `<header>` (the banner landmark), there's no horizontal scroll, the h1 lines up with the logo, and neither hero layer is clipped

## 4. Checks

- [x] 4.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check each `hero` and `home-page` scenario on `/` by hand in Chrome and Safari

## Log

- `Section` now merges a `className` prop into `section`, so `Hero` can add `.hero` for `body:has(.hero)`. Before, a passed `className` replaced `section`.
- The skip link went from `z-index: 1` to `2`, because the overlaid header (`z-index: 1`) comes later in the DOM and would paint over it.
- `Hero.css` uses `.section.hero` so its padding beats `.section` whatever order the CSS is bundled in. It repeats Section's `--space-7`.
- `--header-height` and `--header-room` live in `Base.astro`, not `tokens.css`, like `--menu-row` in `MainMenu.css`. Every `tokens.css` token in the styleguide entry exists.
- Gotcha: Prettier reflowed `<Fragment slot="action">Folge @beweg<wbr />dich<wbr />darmstadt</Fragment>` onto one line per part, and Astro rendered the line breaks as spaces ("@beweg dich darmstadt"). Fixed with `set:html` on a single string, and the styleguide says so.
- Named slots reach React as plain props with no `astro-slot` wrapper: the `<wbr>`s land inside `.button__face`, and the lead inside `.lead`.
- 3.3 was measured in same-origin iframes at exactly 320, 768 and 1280px, because Chrome's window couldn't be made that narrow. 400% zoom of 1280 is a 320px viewport, so it's covered. Raising only the root font size to 200% at 320px does wrap the logo, scroll sideways and cut the handle via `overflow-wrap`. That's text-only zoom, outside this change, and noted as a possible follow-up.
- 4.1: all five commands pass; scenarios hold in Chrome, and Gregor checked Safari by hand.

## Workflow follow-up

- Tick `hero` in `docs/landing-page-plan.md`.
- Archive with `openspec archive hero`.
