# Proposal

## Why

The event dates on `/` are typed into `index.astro`: four past Run & Rave dates under "Bisher" and the festival date under "Termine". A new date in 2027 means editing markup, and a passed date never moves to "Bisher" on its own. An events collection holds every date in one place, and `event-card` (row 12) builds its cards from it.

## What Changes

- New collection `events` in `web/src/content.config.ts`, loaded from `web/src/content/events.yaml`: one entry per event, keyed by id (`run-and-rave-2026-07-10`, `festival-2027`), each with `kind` (`run-and-rave` or `festival`) and `date` (ISO). A date that isn't a real day fails the build. A comment marks the facts as from the old site, unconfirmed.
- Entries: the Run & Rave dates 10 July, 20 August, 24 September and 30 October 2026, and the festival on 11 September 2027.
- `web/src/lib/events.ts`: a pure function that groups the Run & Rave dates before a given day by year, newest year first, oldest date first; unit tested. `web/src/lib/date.ts` gains today's date in Europe/Berlin.
- "Bisher" renders one labelled list per year from it; the festival card reads its date from `festival-2027`.
- `docs/content.md`: how to add a date.

Decisions:

- One YAML file over a file per event, because each entry is two lines and the list reads as the calendar.
- `kind` and `date` only over time and place too, because nothing renders them from data yet; `event-card` adds them with its code.
- "Before the build day" over a client-side check, because the page ships no JavaScript; a passed date moves on the next deploy.
- The festival card by id over "next festival", because the upcoming and Winterpause states belong to `event-card`.

Out of scope: the "Festival 2025 auf dem Friedensplatz" line (no date is known, so it stays text), the Run & Rave card's Winterpause text, scheduled rebuilds, a CMS.

## Capabilities

### New Capabilities

- `events`: past Run & Rave dates under "Bisher" come from the events collection, and a malformed date fails the build.

### Modified Capabilities

None. `when`, `cluster` and `home-page` keep holding.

## Impact

New `web/src/content.config.ts`, `web/src/content/events.yaml`, `web/src/lib/events.ts` and its test, `docs/content.md`; `web/src/lib/date.ts`, `index.astro`. No new dependencies.
