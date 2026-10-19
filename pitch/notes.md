# Pitch notes: Beweg dich, Darmstadt

**Live concept:** https://bdd-entwurf-k7q3.round-breeze-7885.workers.dev (unlisted, noindex)

## Before / after (Lighthouse 12, mobile, 19 Oct 2026)

| | Jimdo: Home | Jimdo: Aktuelles | New: Hub | New: Run & Rave | New: Festival |
|---|---|---|---|---|---|
| Performance | **54** | **53** | **98** | **98** | **99** |
| Accessibility | 82 | 90 | 100 | 100 | 100 |
| Best practices | 79 | 79 | 100 | 100 | 100 |
| First contentful paint | 6.4 s | 6.1 s | 1.6 s | 1.7 s | 1.5 s |
| Largest contentful paint | 8.0 s | 7.8 s | 2.1 s | 2.1 s | 2.0 s |
| Total blocking time | 260 ms | 320 ms | 0 ms | 0 ms | 0 ms |
| Page weight | 1,122 KiB | 1,133 KiB | 172 KiB | 167 KiB | 161 KiB |
| Requests | 22 | 21 | 12 | 13 | 13 |
| Third parties | jimstatic.com, jimdo.com, jimdo.systems | same | none | none | none |
| Cookies / cookie banner | yes | yes | none | none | none |

SEO on the new site shows 60 only because the concept is deliberately set to `noindex`.

**Live on Cloudflare (19 Oct 2026, warm cache):**

| | Hub | Run & Rave | Festival |
|---|---|---|---|
| Performance | 97–100 | 98 | 100 |
| Accessibility / Best practices | 100 / 100 | 100 / 100 | 100 / 100 |
| Largest contentful paint | 1.3–2.0 s | 1.4 s | 1.4 s |
| Page weight (Brotli) | 91 KiB | 90 KiB | 88 KiB |

The very first request after a deploy (cold cache) scored 94 on the hub.

**Caveats, so nobody gets surprised:**
- The new site was measured on a local server, without compression and **without the real photos yet**. Once the photos are in, the hub hero will add roughly 60–150 KB (AVIF), so expect performance in the mid-90s rather than 98.
- A real host with compression will shrink the HTML/CSS/JS part to about 33 KB (measured gzip). Fonts are 48 KB.
- Lighthouse simulates a slow mobile connection in both cases, so the comparison is fair in kind, not to the millisecond.

## What we noticed on the current site

- The pink banner still says "Am 9. Oktober fällt der Run Club leider aus." That date has passed.
- "Wir sind auf Spenden angewiesen", but there's no way to donate (no link, no account, no PayPal).
- The text names four founders (Steffi, Lea, Mady, Rahel), but only two have a profile.
- The meeting point is just "Friedensplatz", a large square. On the way there, nobody knows where exactly to go.
- Dates are buried in body text. "Nächster Termin" and "Zu den Terminen" don't lead anywhere useful.
- The Run & Rave details appear almost word for word on both Home and Aktuelles.
- Small typos: "Hinte Beweg dich…", "letzte Runde. für 2026", "ein Zeichen setzten".
- No alt text on any image. A cookie banner is needed because of Jimdo's third parties.

## Demo links (`HOST` = https://bdd-entwurf-k7q3.round-breeze-7885.workers.dev)

The `?jetzt=` parameter makes the site behave as if it were that moment in Darmstadt. It's for demos only.

| State | Link |
|---|---|
| Today, normal | `HOST/` |
| Day before ("MORGEN · 17:30") | `HOST/?jetzt=2026-10-29T20:00` |
| Event day ("HEUTE · in 2 h 13 min", "Wo treffen wir uns?") | `HOST/run-and-rave/?jetzt=2026-10-30T15:17` |
| Running right now | `HOST/run-and-rave/?jetzt=2026-10-30T18:10` |
| Evening after ("Danke!", next date) | `HOST/?jetzt=2026-10-30T21:00` |
| Season over ("Neue Termine folgen") | `HOST/run-and-rave/?jetzt=2026-11-05T12:00` |
| A cancelled Run Club (sad smiley) | `HOST/?jetzt=2026-10-05T12:00` |
| Personal invite | `HOST/run-and-rave/?jetzt=2026-10-29T20:00#einladung/runrave-2026-10-30/Gregor` |
| Festival countdown | `HOST/festival-2027/` |

**Things to try live:**
- **Wo? Wann?** Tap the round button at the bottom right, on any page.
- **Sag's weiter:** make a story image with your name and send it to yourself.
- **Add to calendar:** the Run Club as a recurring entry, every 2nd Friday.
- **Painting:** tap smileys in the hero to recolour them. Make them all the same colour for a surprise.
- **Rave mode:** tap the header smiley five times quickly.
- **No reception:** after one visit, the meeting point still loads offline.

## Open questions for the founders

1. Where exactly do you meet on Friedensplatz? A photo of the spot would be ideal.
2. Where should "Jetzt spenden" lead (PayPal, Betterplace, an association account)?
3. Bios and photos for Mady and Rahel.
4. Run & Rave dates for 2027, and the festival programme details.
5. Original photos in full resolution (the Jimdo copies are capped at about 1500 px).

## Deploying updates

- `cf auth login` (once per session; the OAuth token expires after about an hour), then `sh deploy/deploy.sh`.
- Bump `VERSION` in `site/sw.js` on every update, so returning visitors drop the old cache.
- Calendar files: after changing dates, run `node tools/make-ics.mjs https://bdd-entwurf-k7q3.round-breeze-7885.workers.dev`.
- Keep it unlisted. The pages are `noindex` and carry the "Entwurf" bar.
