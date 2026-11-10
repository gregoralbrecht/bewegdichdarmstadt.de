# Tasks

## 1. CtaBand

- [x] 1.1 Add `web/src/components/CtaBand/` (`CtaBand.tsx`, `CtaBand.css`): a `Section` (`surface` prop, default `pink`; optional `id` on the section) with `aria-labelledby` set to a `useId()` id on its `Heading level={2}` (`title`), inside `Prose`: `children` as the text, then `<p className="cta-band__action">` with one primary `Button` (`href`, `action` slot as label); the action row pads `var(--space-2) var(--space-4)` for the hard shadow; colors from roles only; verify `pnpm check` passes
- [x] 1.2 Add `CtaBand.stories.tsx` with the plan's Spenden copy on pink, cream, orange and night; play functions check one `h2`, a region named by its text, exactly one `.button` linking to `href`, and no `[data-variant="hero"]`; verify `pnpm test` passes with no axe violations
- [x] 1.3 Add `CtaBand` to the Components section of `docs/styleguide.md` (its own `Section` named by the h2, any surface, one primary button, never a hero, `action` slot for the label); verify every token it names exists in `tokens.css`

## 2. Home page

- [x] 2.1 Replace section 6 in `index.astro` with `CtaBand`: `id="spenden"`, `title` "Kostenlos für alle.", `href="#spenden"`, the text and the marked "Platzhalter: PayPal-Link folgt" as `<p>`s, the label "Jetzt spenden" in `<Fragment slot="action">`; keep `.actions` and imports only if section 5 still uses them; verify in the built HTML of `/` that the label sits inside `.button__face`, the section carries `id="spenden"`, and the h2 id matches its `aria-labelledby`
- [x] 2.2 Verify at 320px and 1280px against `astro preview` that the band looks as before (pink, heading, text, button with its full shadow unclipped), there's no horizontal scroll, and clicking "Jetzt spenden" lands on the band

## 3. Checks

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check the `cta-band` scenario and each `home-page` scenario on `/` by hand in Chrome

## Log

- 2.1: The "Platzhalter: PayPal-Link folgt" note now sits above the button, not below it as in the skeleton, because it goes into the band's text children. Moves back out once the PayPal link arrives.
- 2.2: `resize_window` had no effect on the maximized Chrome window, so 320px and 1280px were checked in same-origin iframes of that width. The band is the last section, so "Jetzt spenden" scrolls to the page bottom with the band in view, not to the top edge.
- Follow-up: replace `href="#spenden"` with the PayPal link once the founders send it (open question 1 in `docs/landing-page-plan.md`).
