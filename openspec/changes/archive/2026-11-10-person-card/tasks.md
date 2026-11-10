# Tasks

## 1. PersonCard

- [x] 1.1 Add `web/src/components/PersonCard/` (`PersonCard.tsx`, `PersonCard.css`): props `name: string`, `photo?: ReactNode` (`<Fragment slot="photo">` in Astro), children for the one line, other `Card` props passed through; renders `Card` (no `CardLink`) holding `Heading level={3}` with the name, then `<div className="person-card__photo">` with `photo`, or "Foto folgt" with `data-placeholder` when there's none, then the children; verify `pnpm check` passes and `href` is no prop
- [x] 1.2 In `PersonCard.css`: the card's body is a flex column with the photo frame at `order: -1`; the frame is `aspect-ratio: 1`, `--border-thin` solid `--line`, and an `img` inside fills it (`width: 100%`, `height: 100%`, `object-fit: cover`, `display: block`); `[data-placeholder]` is dashed instead, centers its text in `--muted`, `--font-display` 700 at `--step-0`; spacing from `Prose` still applies between the parts; verify every token named exists in `tokens.css`
- [x] 1.3 Add `PersonCard.stories.tsx` inside `Section` and `Prose`: a placeholder card on cream and on night, one with a photo (a local test image or a data-URI SVG), and two in a `CardGrid`; play functions check the heading is the name, the card has no link, the placeholder reads "Foto folgt" and sits visually above the heading (its `getBoundingClientRect().top` is smaller) while coming after it in the DOM, the frame is square, and the photo story shows the image instead of the placeholder; verify `pnpm test` passes with no axe violations
- [x] 1.4 Add `PersonCard` to the Components section of `docs/styleguide.md` (a `Card` without a link; name as `h3` first in the markup, photo shown above in a square frame; without `photo` a dashed "Foto folgt" placeholder; the photo's `alt` comes with the photo); verify every token it names exists in `tokens.css`

## 2. Home page

- [x] 2.1 In section 5 of `index.astro`, replace Steffi's and Lea's `Card`s with `PersonCard`s (`name`, the existing line as children, no `photo`), drop their "Foto folgt" paragraphs and the unused imports; verify in the built HTML of `/` that section 5 holds two `.person-card__photo[data-placeholder]`, no `a` inside the cards, and still one `ul.card-grid` with two `li`
- [x] 2.2 Verify at 320px and 1280px against `astro preview` (restarted after the build) that the placeholders are square and above the names, the cards tilt in opposite directions and stay put on hover, and nothing scrolls sideways

## 3. Checks

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check each `person-card`, `card-grid`, `sticker-card` and `home-page` scenario on `/` by hand in Chrome

## Log

- `Card` now merges `className` into `card` (as `Section` does): it spread props after `className="card"`, so `PersonCard`'s root class would have replaced `card` and dropped every card style.
- "Spacing from `Prose`" read as Prose's `--space-4`, applied as a flex `gap` with the parts' margins zeroed: the card body isn't a `.prose`, and in a flex column the `<p>`'s UA margins wouldn't collapse, while the photo frame would sit flush against the name.
- The photo frame needs `overflow: hidden`: without it a portrait photo's height wins over `aspect-ratio: 1` (the flex item's automatic minimum size), and the `WithPhoto` story caught it as 266 × 353.
- Chrome won't size a window to 320px, so 2.2 checked the narrow case in a 320px `iframe` of `/`. The "1280px" window reported `innerWidth` 1504 because of display scaling; both widths passed.
- 3.1's last two hand checks (focus ring on the Festival card, Run & Rave hover with and without reduced motion) ran after the Chrome extension dropped; Gregor confirmed them by hand.
