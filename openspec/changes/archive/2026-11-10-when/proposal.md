# Proposal

## Why

The dates on `/` are plain text: the four past Run & Rave dates in section 4 and the festival date in section 2. Browsers, search engines and assistive technology can't read "11. September 2027" as a date, and every date is formatted by hand. A component that renders `<time datetime>` with German text gives each date one machine-readable source, and the events collection (change `events-collection`) can feed it later.

## What Changes

- New `When`: takes `date` as an ISO date (`"2027-09-11"`) and renders `<time datetime="2027-09-11">` with the date formatted in German. By default it shows day and month ("11. September"); `weekday` adds the weekday ("Samstag, 11. September"), `year` adds the year ("11. September 2027"). Other props pass through.
- The formatting is a pure function in `web/src/lib/date.ts`, with unit tests. An invalid date throws, so a typo fails the build instead of rendering "Invalid Date".
- `/` swaps the written-out dates for `When`: the four past dates in section 4 (day and month; the label carries the year) and the festival date in section 2 (`weekday year`). "14 bis 18 Uhr" stays text.
- `docs/styleguide.md` lists `When` under Components.

Decisions:

- `Intl.DateTimeFormat("de-DE")` over a hand-written month table, because it already gives "Samstag, 11. September 2027" in German and needs no dependency.
- Format in UTC over Europe/Berlin, because a date-only string parses as UTC midnight; formatting it in any other zone can shift the day.
- An ISO string over a `Date`, because the `datetime` attribute is that string and the hardcoded dates are written that way; `events-collection` decides whether `When` also takes a `Date`.
- Two flags over named formats, because the page needs only two shapes and each flag adds one part.
- No CSS and no class, because `When` only marks up text and takes the styling of where it sits.

Out of scope: times and time ranges ("14 bis 18 Uhr"), relative dates ("in 3 Tagen"), the events collection.

## Capabilities

### New Capabilities

- `when`: dates show in German and carry their machine-readable ISO date.

### Modified Capabilities

None. The `cluster` scenario keeps holding: the list items still read "10. Juli" to "30. Oktober".

## Impact

New `web/src/components/When/`, `web/src/lib/date.ts` and its test; `index.astro`, `docs/styleguide.md`. No new dependencies.
