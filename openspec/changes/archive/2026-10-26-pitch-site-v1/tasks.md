# Tasks

> Closed 2026-10-26: the pitch was approved and frozen in `pitch/` on 2026-10-21. Unchecked tasks were dropped, not done.

Order follows the pitch goals: information within reach → spreading the word → playful. Groups 9 and 10 can slip if the 28 Oct deadline gets tight.

## 1. Scaffold and content capture

- [x] 1.1 Create the layout from design D1 (`site/`, `source/img/`, `tools/`, `tests/`) with empty `index.html`, `run-and-rave/index.html` and `festival-2027/index.html`. Verify `python3 -m http.server -d site 8080` serves all three URLs.
- [x] 1.2 Capture the full text of the five Jimdo pages via Claude in Chrome into `source/content.md`, marking the typos to fix ("Hinte", "letzte Runde. für"). Verify every fact from the explore notes (times, places, distances, pace, team, festival) is in the file.
- [ ] 1.3 Download all Jimdo photos (hero, Aktuelles, Über uns, Festival, all gallery sections) into `source/img/` with descriptive names, after asking the user to approve the downloads. Pick the best general Friedensplatz shot as the interim meeting-point photo. Verify the file count matches the images found on the pages.
- [x] 1.4 Export or trace the Komoot Run & Rave route into `source/route.gpx`. Verify it opens and roughly matches the Komoot map (start/end at Friedensplatz).

## 2. Brand foundation

- [x] 2.1 Fetch Bricolage Grotesque and Figtree latin variable woff2 into `site/assets/fonts/`, with `@font-face`, preload and metric-matched fallbacks (D9). Verify the Network panel shows only same-origin font requests and no visible font-swap jump on the hub.
- [x] 2.2 Write `site/assets/css/site.css` with colour, space and fluid type tokens, `data-mood` overrides, reduced-motion guards (D10) and CSS-only microinteractions (press squish, smiley icon wink on hover/focus). Verify the brand contrast pairs reach ≥ 4.5:1 for body text with a contrast checker, noting the results in a CSS comment, and that buttons react to hover, press and focus.
- [x] 2.3 Recreate the smiley as an inline SVG symbol with happy, sad and wink variants. Build the shared header (logo, nav to hub, Run & Rave, festival), footer (Instagram) and "Entwurf" badge, and put them on all three pages with noindex meta (D14). Verify all pages show the header, badge and footer, and carry `noindex`.
- [ ] 2.4 Write `tools/images.mjs` and generate AVIF/WebP variants (480/960/1440) into `site/assets/img/` (D11). Verify the output sizes and that the largest hero variant is under 250 KB.

## 3. Schedule logic

- [x] 3.1 Implement `site/assets/js/schedule.js` (D2/D3): the data (Run & Rave 30 Oct 2026, Run Club rule, festival 11 Sep 2027, cancellations, meeting-spot text and photo key per place, with a placeholder flag), `upcoming`, `nextOf`, `state`, `relativeLabel` and the `?jetzt=` override (D5). Verify with `node --test tests/schedule.test.mjs` covering every scenario in `specs/event-schedule` (incl. 13 Nov 2026, 8 Jan 2027, the DST change, MORGEN, HEUTE countdown, Läuft gerade, after-event and the no-future-Run-&-Rave case).
- [x] 3.2 Implement `toICS()` and `tools/make-ics.mjs` writing `site/ics/*.ics`, including recurring `run-club.ics` (D6). Verify with `node --test tests/ics.test.mjs` (CRLF, TZID, RRULE) and by importing one file into macOS Calendar.
- [x] 3.3 Implement `site/assets/js/time-ui.js`, which upgrades `<time>` elements to relative labels, live countdown, live and after states, and the sad smiley for cancellations. Verify in the browser with `?jetzt=2026-10-29T20:00`, `?jetzt=2026-10-30T15:17`, `?jetzt=2026-10-30T18:10` and `?jetzt=2026-10-30T21:00`, matching the spec labels.
- [x] 3.4 Add `tests/html-dates.test.mjs`, which asserts the absolute dates in the three HTML files match `schedule.js` (D4). Verify it passes, and fails when one HTML date is changed.

## 4. Hub page

- [x] 4.1 Build the hub hero (message, smiley, next event across formats) and the next-up strip with calendar and share buttons. Verify at 390 px width that the hero and next event fit the first screen and the strip lists Run & Rave 30 Oct, then Run Club 13 Nov and 11 Dec.
- [x] 4.2 Build the format cards (Run & Rave and festival linking to the microsites) and the Run Club section with its next date, single and recurring calendar actions. Verify the links navigate and `run-club.ics` downloads.
- [x] 4.3 Build the team section with four cards (Steffi and Lea from source content; Mady and Rahel as marked placeholders), plus the donation section with example amounts, a placeholder donate action and the Instagram link. Verify the placeholders are visibly marked and no link is broken.

## 5. Run & Rave microsite

- [x] 5.1 Build the hero with the next Run & Rave (label, place, 5.5 km, 7:30 min/km, kostenlos) and the actions calendar, route (Komoot link) and share, with `data-mood="rave"`. Verify with `?jetzt=2026-10-29T20:00` that "MORGEN · 17:30 · Friedensplatz" and all facts are on the first screen at 390 px.
- [x] 5.2 Write the "about the format" and "who is it for" sections from `source/content.md` with typos fixed, plus a meeting-point section (the no-JS target of "Wo? Wann?"). Verify against the Jimdo Aktuelles text that no fact is missing.
- [x] 5.3 Build the join-mode picker (5 options, reassuring answers, live region). Verify each option shows its answer, and it is operable with arrow keys and announced by VoiceOver.
- [ ] 5.4 Build the past-demos gallery (grouped by date, newest first) with the `<dialog>` lightbox (D13). Verify keyboard (arrows and Escape), swipe on a touch emulator, and that focus returns to the thumbnail.

## 6. Quick info and offline

- [x] 6.1 Build the "Wo? Wann?" sticky button and bottom-sheet `<dialog>` on all three pages (D16), filled from `schedule.js` (event, labels, spot text with placeholder marking, photo). Verify at 390 px that the button never covers content or footer links, the sheet opens from mid-scroll, closes via swipe, Escape, outside tap and "Schließen", and focus returns to the button.
- [x] 6.2 Add "Navigation starten" (Apple Maps on Apple platforms, Google Maps elsewhere), "Route ansehen" and "In den Kalender" to the sheet. Verify both URL variants open walking directions to Friedensplatz (Safari and Chrome device emulation), and that no third-party request happens before the click.
- [x] 6.3 Add the event-day emphasis: the hero's primary action becomes "Wo treffen wir uns?" and the button is highlighted. Verify with `?jetzt=2026-10-30T16:00` (emphasised) and `?jetzt=2026-10-29T20:00` (normal).
- [x] 6.4 Implement `site/sw.js` (D17) with precaching, network-first pages, cache-first assets and versioned caches, registered from all pages. Verify in Chrome DevTools: after one visit, offline reload renders the page with fonts and the sheet works; after bumping the version, the new content appears on the next online load.

## 7. Spreading the word

- [x] 7.1 Implement the pure invite helpers (`inviteLink(eventId, name)`, `parseInvite(hash)`). Verify with `node --test tests/invite.test.mjs` covering the name-less form, escaping, 30-character truncation and unknown IDs.
- [ ] 7.2 Build the studio dialog UI (format, look, slogan, name, live preview) and the canvas renderer for Story and Post, waiting for fonts (D7). Verify the preview updates for every option and the absolute date appears (not "MORGEN") with `?jetzt=2026-10-29T20:00`.
- [ ] 7.3 Wire up sharing: `canShare` → `navigator.share`, else save PNG and copy link. Implement the shared smiley-confetti utility (D18) and the "Danke fürs Weitersagen!" celebration. Verify on desktop Chrome (fallbacks work, confetti and thank-you appear, only the message under reduced motion) and on a real phone (the share sheet opens with the image, and the user checks Instagram Stories or WhatsApp).
- [x] 7.4 Implement the invite landing state on the Run & Rave, festival and hub (Run Club) pages. Verify `/run-and-rave/#einladung/runrave-2026-10-30/Gregor` shows "Gregor ist dabei. Du auch?", a past-event invite points to the next date, and `<b>` in the name renders as text.
- [x] 7.5 Implement the share nudges (after calendar, invite landing, event day, after-event) with the one-per-visit rule (D19). Verify each trigger shows its inline nudge with `?jetzt=` states, dismissal works, and a second trigger in the same visit shows nothing.
- [x] 7.6 Add an OG export format, generate `site/og/{hub,run-and-rave,festival-2027}.png` and add OG/Twitter meta with a placeholder base URL (D8). Verify the images exist at 1200×630 and the meta tags are present on all pages.

## 8. Play layer

- [x] 8.1 Create `assets/js/play.js` loaded via `requestIdleCallback` after `load` (D18). Move rave mode into it (5 taps in 3 s on the logo, auto-off, ≤ 3 flashes/s, colour-only under reduced motion), and add the calendar-success animation "Ist im Kalender!". Verify in the Performance panel that `play.js` loads after first contentful paint, and that rave mode triggers with mouse and touch.
- [x] 8.2 Implement the cursor smiley (spring follow, wink over links and buttons, `pointer-events: none`, only with a fine pointer and no reduced motion). Verify it follows on desktop, never blocks a click, and is absent in touch emulation and with reduced motion emulated.
- [x] 8.3 Implement the smiley backgrounds in hero areas (tap to cycle colour with a bounce, `aria-hidden`, content layer on top) and the "alle bunt" celebration. Verify that tapping smileys recolours them, taps on hero buttons never recolour a smiley, text contrast over the pattern still passes, and recolouring all smileys to one colour triggers the celebration.
- [x] 8.4 Add cross-page view transitions. Verify navigating hub → Run & Rave animates in Chrome and is instant with reduced motion.

## 9. Festival microsite (can slip)

- [ ] 9.1 Build the festival page with `data-mood="festival"`: save-the-date hero (date, time, venue, relative label, calendar, Anfahrt link, share), programme tiles with "mehr folgt", kostenlos + donations, and the 2025 impressions using the shared lightbox. Verify all spec scenarios with `?jetzt=2026-10-19T12:00`, the quick-info sheet for the festival, and that the page looks clearly distinct from Run & Rave side by side.

## 10. Route animation (can slip)

- [x] 10.1 Generate the stylised route SVG from `source/route.gpx` with `tools/route.mjs`, add landmarks, and animate the drawing on scroll (D12). Verify the line draws when scrolled into view and appears fully drawn under reduced motion.

## 11. Integration and pitch

- [x] 11.1 Quality pass on all pages with the play layer active. Run `npx lighthouse` (mobile) against the local server. Verify Performance ≥ 95, Accessibility ≥ 95, CLS < 0.05 and ≤ 150 KB of non-image transfer per page, and that the Network panel shows zero third-party requests and no cookies.
- [x] 11.2 No-JS, keyboard and throttling pass. Verify with JavaScript disabled that all pages show content, absolute dates and the meeting-point section. Every action must be reachable by keyboard with visible focus, and on throttled 3G the event info and "Wo? Wann?" must be usable before any play feature appears.
- [x] 11.3 Run Lighthouse against the live Jimdo pages and write `pitch/notes.md` with:
  - the before/after scores;
  - the "what we noticed" list (stale banner, missing donation link, two missing founders, typos, buried dates, no exact meeting point);
  - demo links for the `?jetzt=` states, including the event-day quick-info and an invite link.

  Verify the file contains real numbers from both runs.
- [x] 11.4 Write `pitch/playbook-learnings.md`: what was easy, what was hard (Cloudflare, image capture, Komoot) and what to reuse next time. Verify it exists and names at least the capture, design, quick-info, share and play steps.

## Workflow follow-up

- Ask the founders for the exact meeting spot and a photo of it, then replace the placeholder.
- Deploy `site/` to the chosen static host after replacing the OG base-URL placeholder and bumping the service worker version, then send the link to the founders.
- Archive the change once the pitch version is final.
