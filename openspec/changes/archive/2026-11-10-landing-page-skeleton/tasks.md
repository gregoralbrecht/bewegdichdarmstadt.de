# Tasks

## 1. Token preview to /gestaltung

- [x] 1.1 Move the token preview's sections from `index.astro` to `/gestaltung`, after the surfaces, each a cream `Section` named by its `Heading`: Farben (the primitive swatches with hex, role and contrast with ink), Schatten und Rahmen, Schriften, Schriftgrößen, Abstände and Sticker-Karte (the tilted prototype with its CSS, kept as reference for `sticker-card`); the tag swatches' hex and ink contrast join the existing Tag-Palette section; reuse `Prose` and drop the preview's local `h1`–`h3`, `p` and `.lead` styles; verify at 1280px that every swatch, shadow, font, step and space from the old `/` shows on `/gestaltung`, that the card still tilts and presses, and that `pnpm check` passes

## 2. Home page skeleton

- [x] 2.1 Rewrite `index.astro` as `<Base>` with no title (so the tab reads "Beweg dich, Darmstadt!") and six `Section`s in the plan's order and surfaces, each with `aria-labelledby` on its `Heading`'s id; verify `/` shows six bands pink, cream, orange, night, cream, pink and has one `h1`
- [x] 2.2 Hero: `Heading level={1}`, `Lead`, the winter line as `<p>`, and `Button variant="hero"` "Folge @bewegdichdarmstadt" to Instagram, with room for its shadow like `/gestaltung`'s `.actions`; verify the button is the page's only `data-variant="hero"`
- [x] 2.3 Termine: `h2` and a bare `<ul>` of two `<article>`s, each with an `h3` link (`/run-and-rave`, `/festival`), its tag as plain text ("Winterpause", "Save the Date") and the plan's text with dates written out; verify both links reach their pages
- [x] 2.4 Für alle: `h2`, `Lead` and a bare `<dl>`: Treffpunkt / Friedensplatz, Mit dem Rad dabei sein / geht, Unterwegs abkürzen / geht, Teilnahme / kostenlos, Demo / angemeldet, mit Polizeibegleitung; verify every pair matches the plan's facts
- [x] 2.5 Bisher: `h2` and two `<p>`s with the 2026 Run & Rave dates and "Festival 2025 auf dem Friedensplatz"; verify against the plan
- [x] 2.6 Wer wir sind: `h2`, the intro, a bare `<ul>` of two `<article>`s (`h3` name, "Foto folgt", the proposal's one line) and `Button` "Mehr über uns" to `/ueber-uns`; verify each line is in that person's bio in `source/content.md`
- [x] 2.7 Spenden: `h2` "Kostenlos für alle.", the text, `Button` "Jetzt spenden" to `#spenden` and the visible note "Platzhalter: PayPal-Link folgt"; verify the button doesn't leave the page
- [x] 2.8 Copy in every section follows `docs/naming.md` (`Run &amp; Rave`, "Beweg dich, Darmstadt" with the comma, "Festival 2027"); verify by searching `index.astro` for "Run Club", "Run and Rave" and "Bewegdich"

## 3. Checks

- [x] 3.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass
- [x] 3.2 Against `astro preview` at 320px and 1280px: no horizontal scroll, headings line up with the logo, the hero button's shadow isn't clipped, axe reports no violations on `/` and `/gestaltung`, and each `home-page` scenario holds

## Log

- The sticker prototype's class is `.sticker`, not `.card`: on `/gestaltung` the `Card` component's global `.card` styles would have applied to it too. Its link has a class so `Prose`'s wavy underline skips it.
- Swatch and sticker headings use `Heading level={3} size="1"`, the old preview's `h3` size; the default `step-2` is too large for the `--muted-light` label in a 15rem column.
- Inside `Prose`, the bare `<ul>`s on `/` show disc markers and the `<article>` children keep browser margins. That's expected for the skeleton; `card-grid` and `sticker-card` replace them.
- Follow-up for `hero`: at 1280px the hero button wraps and hyphenates the handle ("@beweg-dichdarmstadt"). Fix it there, e.g. with `hyphens: none`, or by breaking only after the "@".
- Gotcha: a stale `astro preview` (started before the build) answered on port 4329 and returned 404 for the new CSS hashes. Stop it with `astro preview stop` before verifying.

## Workflow follow-up

- Tick `landing-page-skeleton` in `docs/landing-page-plan.md`.
- Archive with `openspec archive landing-page-skeleton`.
