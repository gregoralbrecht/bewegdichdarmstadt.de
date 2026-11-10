# Content

Where the site's content lives and how to change it. Content lives in Astro content collections until a CMS comes.

## Event dates

Every event date is in `web/src/content/events.yaml`, one entry per event, read by the `events` collection in `web/src/content.config.ts`.

```yaml
run-and-rave-2026-10-30:
  kind: run-and-rave
  date: "2026-10-30"
```

- **Id:** `run-and-rave-YYYY-MM-DD` for a Run & Rave, `festival-YYYY` for a festival.
- **`kind`:** `run-and-rave` or `festival`.
- **`date`:** the day as `YYYY-MM-DD`, in quotes. A date that isn't a real day, such as `2027-02-30` or `30.10.2026`, fails the build with an error naming the entry.

To add a date, add an entry and deploy. A Run & Rave dated before the day the site is built shows under "Bisher" on `/`, in the list for its year. The page ships no JavaScript, so a date that passes moves to "Bisher" on the next deploy, not on the day itself.

The festival card on `/` reads its date from `festival-2027`.

## Facts from the old site

The dates and other facts taken from the old site (`source/content.md`) count as unconfirmed until the founders confirm them. Mark them so where they live, as the comment at the top of `events.yaml` does, and drop the mark once a founder confirms.
