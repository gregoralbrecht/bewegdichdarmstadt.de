# Tasks

## 1. Dates

- [x] 1.1 In `web/src/lib/date.ts`, pull the real-ISO-date check out of `formatDate` into an exported `isIsoDate(iso)`, and add `today()`, which returns today's date in Europe/Berlin as `YYYY-MM-DD`; verify `date.test.ts` still passes and covers `isIsoDate` (true for `"2027-09-11"`, false for `"2027-02-30"`, `"11.09.2027"`, `""`) and `today()` matching `/^\d{4}-\d{2}-\d{2}$/`

## 2. Collection

- [x] 2.1 Add `web/src/content/events.yaml` with entries keyed by id: `run-and-rave-2026-07-10`, `run-and-rave-2026-08-20`, `run-and-rave-2026-09-24`, `run-and-rave-2026-10-30` (`kind: run-and-rave`) and `festival-2027` (`kind: festival`, `date: 2027-09-11`), dates as quoted strings, with a top comment that the dates come from the old site (`source/content.md`) and are unconfirmed; verify each date against `source/content.md`
- [x] 2.2 Add `web/src/content.config.ts`: collection `events` with `file("src/content/events.yaml")` and a schema of `kind: z.enum(["run-and-rave", "festival"])` and `date: z.string().refine(isIsoDate, …)`; verify `pnpm check` passes, and that changing one date to `2027-02-30` makes `pnpm build` fail with an error naming that entry (then revert)

## 3. Grouping

- [x] 3.1 Add `web/src/lib/events.ts` with `pastByYear(events, kind, before)`: the dates of that kind earlier than `before`, as `{ year, dates }[]`, newest year first, oldest date first, taking plain `{ kind, date }` objects so it needs no Astro; verify `events.test.ts` under `pnpm test` covers: the 2026 dates grouped on `2026-11-10`, a date equal to `before` left out, a later date left out, another kind left out, two years in order, unsorted input sorted, and nothing passed giving `[]`

## 4. Home page

- [x] 4.1 In `index.astro`, read the collection with `getCollection("events")` and render "Bisher" from `pastByYear(…, "run-and-rave", today())`: per year a `<p id="run-and-rave-{year}">Run &amp; Rave {year}</p>` and its `Cluster as="ul"` of `When` dates; "Festival 2025 auf dem Friedensplatz" stays text; verify the built HTML of `/` matches today's for section 4 (same ids, same four `time` elements)
- [x] 4.2 In section 2, take the festival date from `getEntry("events", "festival-2027")` into its `When`; verify the built HTML still has `<time datetime="2027-09-11">Samstag, 11. September 2027</time>`
- [x] 4.3 Temporarily add a `run-and-rave-2027-01-15` entry and build: verify it does not show under "Bisher"; then temporarily build with that entry dated `2026-11-01` and verify it shows after "30. Oktober"; revert both

## 5. Docs

- [x] 5.1 Add `docs/content.md`: where event dates live, the two fields, id pattern, that a passed date moves to "Bisher" on the next deploy, and that facts from the old site stay unconfirmed; verify every path and field it names exists

## 6. Checks

- [x] 6.1 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, then check the `events`, `when` and `cluster` scenarios and each `home-page` scenario on `/` against `astro preview` in Chrome

## Log

- `z` comes from `astro/zod` (zod v4); `astro:content`'s `z` export is deprecated in Astro 7.
- `today()` formats with the `sv-SE` locale, which writes `YYYY-MM-DD`, in `Europe/Berlin`.
- `getEntry("events", "festival-2027")` is typed as possibly undefined, so `index.astro` throws a named error when the entry is missing.
- The malformed-date build error reads `events → run-and-rave-2026-08-20 data does not match collection schema`; both `2027-02-30` and `11.09.2027` fail.
- Built `/` before and after 4.1/4.2 differs only in React's generated `useId` values in the hero and CTA band; sections 2 and 4 are byte-identical.
- The `docs/content.md` example uses an existing entry, so no invented date reads like a fact.

## Workflow follow-up

- Archive with `openspec archive events-collection` and tick row 11 in `docs/landing-page-plan.md`.
