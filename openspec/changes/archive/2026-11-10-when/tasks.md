# Tasks

## 1. Formatting

- [x] 1.1 Add `web/src/lib/date.ts` with `formatDate(iso, { weekday?, year? })`: it accepts only `YYYY-MM-DD` that names a real day, formats with `Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", timeZone: "UTC" })` plus `weekday: "long"` and `year: "numeric"` when asked, and throws on anything else; verify `date.test.ts` passes under `pnpm test`, covering "10. Juli", "Samstag, 11. September 2027", "11. September 2027", "Samstag, 11. September", a first and a last of the month (no day shift), and throws for `"2027-02-30"`, `"11.09.2027"` and `""`

## 2. When

- [x] 2.1 Add `web/src/components/When/When.tsx`: `<time dateTime={date}>` with the text from `formatDate`, `weekday` and `year` flags, other `<time>` props passed through, no CSS file and no class; verify `pnpm check` passes
- [x] 2.2 Add `When.stories.tsx`: day and month, `weekday year`, and the four past dates in a `Cluster as="ul"` on night; play functions check each `time` has the given `datetime` and the expected German text; verify `pnpm test` passes with no axe violations
- [x] 2.3 Add `When` to the Components section of `docs/styleguide.md` (every date on the site goes through it; ISO date in, German text out; `weekday` and `year` add parts; times stay text for now); verify it names no props that `When` lacks

## 3. Home page

- [x] 3.1 In section 4 of `index.astro`, wrap each past date: `<li><When date="2026-07-10" /></li>` and so on for `2026-08-20`, `2026-09-24`, `2026-10-30`; in section 2, replace "Samstag, 11. September 2027" with `<When date="2027-09-11" weekday year />`, keeping ", 14 bis 18 Uhr, bei Menschenskinder in Darmstadt-Kranichstein." as text; verify in the built HTML of `/` five `time` elements with those `datetime` values and the same visible text as before
- [x] 3.2 Verify against `astro preview` at 320px and wide that the dates look as before on cream and night and the festival sentence has no stray spaces around the date

## 4. Checks

- [x] 4.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check the `when` and `cluster` scenarios and each `home-page` scenario on `/` by hand in Chrome

## Log

- `formatDate` also checks the parsed `Date` isn't NaN: V8 rolls "2027-02-30" over to 2 March, other engines return Invalid Date, and both now throw the same `RangeError`.
- Unit tests also pass with `TZ=Pacific/Honolulu`, so formatting in UTC holds off Berlin time.
- React renders the attribute as `dateTime`; HTML attribute names are case-insensitive, so the browser reads it as `datetime`.
- Prettier puts each `<When>` on its own line inside `<li>`; Astro drops that whitespace, so the built HTML has none inside the items or before the festival comma.
- Gotcha: a preview server was already running on port 4329, and Chrome kept serving the old `/` from cache (`cf-cache-status: HIT`, 300-byte transfer) after the rebuild. A query string (`/?when=1`) loaded the fresh build.

## Workflow follow-up

- Archive with `openspec archive when` and tick row 7 in `docs/landing-page-plan.md`.
