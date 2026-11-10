# Landing page plan

The plan for the first real home page (`/`), planned 2026-11-10. The page goes up first as a skeleton of bare HTML; then each component gets its own OpenSpec change, which also swaps its bare HTML on `/` for the component. That way the page shows its progress after every change. Tick a change's row when it is archived. Delete this file once the landing page ships.

Names follow [`naming.md`](naming.md).

## Ground rules

- **Copy is new, facts are old.** The wording below is fresh; every fact in it comes from the old site (`source/content.md`) or from Gregor, and counts as unconfirmed until the founders confirm it.
- **No invented facts.** No participant numbers, no claims the sources don't make. Where a fact is missing, the page shows a marked placeholder. Prefer not naming a fact over adding a placeholder, because facts might require updating (e.g. participant numbers)
- **Content lives in Astro content collections** for now; a CMS comes later.
- **The page must read well during the winter break.** Every Run & Rave date for 2026 is in the past, and new dates come in 2027. The festival on 11 September 2027 is the only future date known.

## Page structure

```
+--------------------------------------------------+
| 1 HERO (pink)                                     |
|   h1 + lead + winter line                         |
|   [ HERO CTA: Folge @bewegdichdarmstadt ]         |
+--------------------------------------------------+
| 2 TERMINE (cream)   card grid, tilt - +           |
|   +-- Run & Rave -----+  +-- Festival 2027 ---+   |
|   | Tag: Winterpause  |  | Tag: Save the Date |   |
|   +--> /run-and-rave -+  +--> /festival ------+   |
+--------------------------------------------------+
| 3 FUER ALLE (orange)  h2 + lead + fact list       |
+--------------------------------------------------+
| 4 BISHER (night)  past dates                      |
+--------------------------------------------------+
| 5 WER WIR SIND (cream)  2 person cards -> /ueber-uns
+--------------------------------------------------+
| 6 SPENDEN (pink)  CTA band                        |
+--------------------------------------------------+
```

The hero CTA links to Instagram, because that is where people find out when the next Run & Rave happens. It is the page's only hero button; the footer keeps its Instagram link.

## Draft copy

Each section lists the facts its copy uses, so they can be checked against the source.

### 1 Hero

- h1: "Beweg dich, Darmstadt!"
- Lead: "Wir gehen gemeinsam auf die Straße: laufend, mit dem Rad oder tanzend, mit Musik, durch Darmstadt. Kostenlos und für alle."
- Below the lead: "Gerade ist Winterpause. Auf Instagram erfährst du, wann es weitergeht."
- Hero button: "Folge @bewegdichdarmstadt" → https://www.instagram.com/bewegdichdarmstadt/

Facts used: "Wir gehen auf die Straße"; "Ob laufend, bikend oder tanzend"; Run & Rave runs "begleitet von Beats" through Darmstadt; Run & Rave and festival are free (old site). Winter break until 2027, new dates announced on Instagram (Gregor).

### 2 Termine

h2: "Termine". Two sticker cards, built from the events collection:

- **Run & Rave**, tag "Winterpause": "Die Runden für 2026 sind gelaufen. Neue Termine folgen 2027." → `/run-and-rave`
- **Festival 2027**, tag "Save the Date": "Samstag, 11. September 2027, 14 bis 18 Uhr, bei Menschenskinder in Darmstadt-Kranichstein." → `/festival`

Facts used: the 30 October Run & Rave was "die letzte Runde" for 2026 (old site); all 2026 dates past, next dates in 2027 (Gregor). Festival on Saturday 11 September 2027, 14:00–18:00, at Menschenskinder, Darmstadt-Kranichstein (old site).

### 3 Für alle

- h2: "Du musst nicht schnell sein. Du musst nicht mal laufen."
- Lead: "Beim Run & Rave laufen und fahren wir rund 5,5 km mit Musik, in entspanntem Tempo von etwa 7:30 Minuten pro Kilometer."
- Fact list: Treffpunkt: Friedensplatz · Mit dem Rad dabei sein: geht · Unterwegs abkürzen: geht · Teilnahme: kostenlos · Angemeldet als Demo, mit Polizeibegleitung

Facts used: about 5.5 km, about 7:30 min/km, by bike or cutting the route short is fine, free, meeting point Friedensplatz (old site, all for the 30 October 2026 Run & Rave). Friedensplatz is small enough to need no exact spot; every Run & Rave is a registered demonstration with a police escort (Gregor). The start time stays off this section.

### 4 Bisher

- h2: "Bisher"
- "Run & Rave 2026: 10. Juli · 20. August · 24. September · 30. Oktober"
- "Festival 2025 auf dem Friedensplatz"

Facts used: the old gallery's Run & Rave dates (10 July, 20 August, 24 September 2026), the 30 October 2026 Run & Rave from the old home page, "Beweg dich, Darmstadt Festival 2025 (Friedensplatz)" from the old gallery.

### 5 Wer wir sind

- h2: "Wer wir sind"
- "Hinter _Beweg dich, Darmstadt_ stehen zwei selbstständige Frauen aus Darmstadt: Steffi und Lea."
- Two person cards: name, photo, one line. Steffi Rieger and Lea Emmel have bios on the old site. Photos come later; until then the card shows a marked photo placeholder.
- Button: "Mehr über uns" → `/ueber-uns`

Facts used: the old Über-uns intro and the two bios (old site); the team is Steffi and Lea (Gregor).

### 6 Spenden

- h2: "Kostenlos für alle."
- "Spenden helfen, die laufenden Kosten zu decken."
- Button: "Jetzt spenden" → a PayPal link, placeholder until the founders send it.

Facts used: "Jeder Beitrag … hilft uns, die laufenden Kosten zu decken" (old site); donations go through PayPal (Gregor).

### Left out on purpose

- **A fixed rhythm for Run & Rave.** The old "Run Club" said "jeden 2. Freitag im Monat", but the 2026 dates don't follow it: 20 August and 24 September were Thursdays, and 30 October was the fifth Friday.
- **The old Run Club details:** 45–60 minutes, 5–7 km, warm-up, stretch. They may not apply to Run & Rave.
- **Participant numbers, "lebendige Community", and any promise that Instagram announces cancellations.** No source supports them.

## Changes

In order. One change each.

`landing-page-skeleton` comes first: sections 1–6 with the draft copy in `index.astro`, as bare HTML (`<h2>`, `<p>`, `<ul>`, `<dl>`, plain links). It uses the pieces that already exist: the base layout, `Section` for the surface colors, `Button`, `Prose` and `Lead`. The token preview on `/` merges into `/gestaltung` in the same change.

Every later change builds its component and replaces the matching bare HTML on `/` (the "Replaces on `/`" column). A change is done when the page uses the component.

| Done | #   | Change                  | What it covers                                                                                        | Replaces on `/`                           | Needs |
| ---- | --- | ----------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----- |
| [x]  | 1   | `prose-base`            | Text styling: paragraph width, lead, links, lists. Fixes the unstyled `<h1>` on the placeholder pages | –                                         | –     |
| [x]  | 2   | `landing-page-skeleton` | Sections 1–6 as bare HTML; the token preview merges into `/gestaltung`                                | the token preview                         | 1     |
| [x]  | 3   | `hero`                  | h1, lead and the page's one hero button                                                               | section 1                                 | 2     |
| [x]  | 4   | `cta-band`              | A section with a heading, text and one button                                                         | section 6                                 | 2     |
| [x]  | 5   | `fact-list`             | A `<dl>` of short facts                                                                               | the bare `<dl>` in section 3              | 2     |
| [x]  | 6   | `cluster`               | A wrapping row for buttons, tags and short items such as the past dates                               | the past dates in section 4               | 2     |
| [x]  | 7   | `when`                  | `<time datetime>` with German date formatting                                                         | the written-out dates in sections 2 and 4 | 2     |
| [x]  | 8   | `sticker-card`          | `Card` gets a tilt (`tilt`) and one heading link stretched over the card                              | the bare cards in sections 2 and 5        | 2     |
| [x]  | 9   | `card-grid`             | A `<ul>` of cards whose neighbors tilt in opposite directions                                         | the card lists in sections 2 and 5        | 8     |
| [ ]  | 10  | `person-card`           | A team card, with a placeholder until the photo arrives                                               | the person cards in section 5             | 8     |
| [ ]  | 11  | `events-collection`     | Content collection and schema for Run & Rave and festival dates                                       | the hardcoded dates in sections 2 and 4   | 7     |
| [ ]  | 12  | `event-card`            | A sticker card built from an event entry, with an upcoming and a Winterpause state                    | the event cards in section 2              | 8, 11 |

After launch: icons, sticker photos, a badge sticker, a notice banner for cancellations, add to calendar.

## Open questions

For the founders:

1. **Donations:** the PayPal link for "Jetzt spenden".

Photos follow later from Gregor.
