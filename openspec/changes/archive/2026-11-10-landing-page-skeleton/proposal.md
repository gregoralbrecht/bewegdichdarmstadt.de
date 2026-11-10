# Proposal

## Why

`/` still shows the token preview from the palette meeting. The landing page plan builds the real home page one component at a time, and each component change needs bare HTML on `/` to swap out.

## What Changes

- `/` becomes sections 1–6 of `docs/landing-page-plan.md` with its draft copy: Hero (pink), Termine (cream), Für alle (orange), Bisher (night), Wer wir sind (cream), Spenden (pink). Each is a `Section` named by its heading.
- Hero: `Heading level={1}`, `Lead`, the winter line and the one `hero` button to Instagram. Wer wir sind and Spenden get a primary `Button` each.
- Cards are bare `<ul>`/`<article>`, the fact list a bare `<dl>`, dates written out as text.
- Person cards show one line each, taken from the old bios: Steffi "Yogalehrerin, Unternehmerin und Life & Team Coach", Lea "Gründerin von Outdoor Training Darmstadt und zertifizierte Trainerin".
- The token preview moves to `/gestaltung`: color swatches, shadows and borders, fonts, type steps, spacing and the sticker-card prototype.

Decisions:

- `Heading` over bare `<h2>`, because a bare heading is unstyled, the issue `prose-base` fixed on the placeholder pages.
- "Jetzt spenden" links to `#spenden` with a visible "Platzhalter: PayPal-Link folgt" over a dead `#`, because a marked placeholder can't pass for the real thing.
- The photo placeholder is the text "Foto folgt" over an empty box, because it reads without styling.
- The last fact reads "Demo: angemeldet, mit Polizeibegleitung" over "Anmeldung", which would read as signing up.
- `/` stays indexable, as now.

Out of scope: every component in the plan's table, the events collection, real photos, the PayPal link, `/run-and-rave` and `/festival` content.

## Capabilities

### New Capabilities

- `home-page`: what `/` always offers: one hero button to Instagram, links to the event pages, sections named by their headings.

### Modified Capabilities

None.

## Impact

`web/src/pages/index.astro` (rewritten) and `web/src/pages/gestaltung.astro` (gains the token preview). No new dependencies.
