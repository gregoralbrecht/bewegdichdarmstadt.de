# Proposal

## Why

"Beweg dich, Darmstadt" runs its site on a Jimdo template. It loads slowly, shows stale content (a cancellation banner for a date that has passed), buries the essentials (when, where, how hard) in prose and gives visitors no way to bring friends along. This change builds a static redesign to pitch to the founders, who are friends of ours. It should make them think "please build this for real". Ideally it is ready to show in person at the Run & Rave on Fri 30 Oct 2026.

The pitch focuses on three goals, in this order of priority:

1. **Information within reach.** Whoever is on their way to a Run & Rave and wonders "where exactly do we meet?" gets the answer with one tap, from any page, even with bad reception.
2. **Spreading the word.** The site actively encourages people to share and invite friends, at the right moments, without nagging.
3. **Playful and joyful.** Animations, microinteractions and hidden easter eggs make the site feel like the events themselves.

It is also the first run of a repeatable business-development playbook ("find a dated site, one-shot a much better one, send the link"). This first run should therefore stay simple.

## What Changes

- New static website (German) replacing the five Jimdo pages with three:
  - **Hub** (`/`): mission, a "next up" strip across all formats, the Run Club section, the team (all four founders), donations, Instagram.
  - **Run & Rave microsite** (`/run-and-rave/`): the next demo run, front and centre. It also has an illustrated route, a "how will you join" picker and the gallery of past demos.
  - **Festival microsite** (`/festival-2027/`): save the date (Sat 11 Sep 2027, 14–18 h, Menschenskinder Kranichstein), programme tiles, impressions from 2025 and donations.
- Data-driven schedule:
  - Run Club dates are computed (2nd Friday of each month, 17:30), with per-date cancellations.
  - Run & Rave and festival dates come from a hand-maintained list.
  - All dates are shown relative to now ("MORGEN!", "HEUTE · in 2 h 13 min", "Läuft gerade").
  - Every event offers a calendar file.
- Share studio: visitors make a story or post image for a specific date (choice of colour/photo, slogan and an optional name) and share it through the device share sheet. They can also copy a personal invite link, which opens a personalised landing state ("Gregor ist dabei. Du auch?").
- "Wo? Wann?" quick access: a button on every page opens the next event's meeting point (precise description and photo), start time, "Navigation starten" and the route. It also works offline after the first visit.
- Share nudges: gentle, dismissible prompts at the right moments (after adding to the calendar, on invite landings, on event day, after the event), plus a small celebration after sharing.
- Brand refresh: same colours and smiley, a stronger type pairing ("a protest sign that smiles") and a sad smiley for cancelled dates.
- Play layer: a colourful smiley that follows the cursor, hero backgrounds made of smileys you can tap to recolour, microinteractions and confetti on success, and hidden easter eggs ("rave mode", an "all one colour" celebration).
- Technical stance: hand-written HTML/CSS with small vanilla JS modules. No framework, build pipeline, third-party requests, tracking or cookie banner. Optimised self-hosted images and fonts, and a service worker for offline access. The site is marked as a draft concept and excluded from search engines.
- Pitch evidence: Lighthouse before/after (Jimdo vs. new) and a short "what we noticed" list for the handover.
- Explicitly out of scope: CMS or editing UI, forms or registration, backend (e.g. attendee counter), legal pages (Impressum/Datenschutz), multilingual content, deployment pipeline.

## Capabilities

### New Capabilities

- `event-schedule`: event data for Run & Rave, Run Club and the festival, computing upcoming dates, recurrence and cancellations, relative and live time states, and calendar (.ics) export.
- `event-quick-info`: the always-available "Wo? Wann?" access to the next event's meeting point, time, navigation and route, including offline availability.
- `event-sharing`: the share studio (image composition, formats, device sharing and download), personal invite links, the personalised invite landing state and share nudges.
- `hub-page`: the main landing page and its content: mission, cross-format "next up", Run Club, team, donations and links to the microsites.
- `run-and-rave-microsite`: the Run & Rave page: next-event hero, route visualisation, join-mode picker, event facts and the past-demos gallery.
- `festival-microsite`: the Festival 2027 page: save-the-date hero, programme, impressions, directions and donations.
- `brand-experience`: the visual identity and playful behaviours shared across pages: palette, smiley, typography, motion, the cancellation smiley, cursor smiley, smiley backgrounds, microinteractions and easter eggs.
- `site-quality`: cross-cutting constraints: performance budget, privacy (no third-party requests or cookies), accessibility, offline availability, behaviour without JavaScript, draft/noindex marking and visible placeholders for unknown content.

### Modified Capabilities

(none, since no specs exist yet)

## Impact

- New repository content: a deployable static site folder, its source images and a few dev-only helper scripts (image conversion, a date-logic test run with Node's built-in test runner). No runtime dependencies.
- External inputs: text and photos from the live Jimdo site (captured through the browser because Cloudflare blocks scripted access) and the Komoot route of the Run & Rave.
- Unknowns are shipped as visible placeholders: the exact meeting spot on Friedensplatz, the donation link, impact numbers, bios and photos for Mady and Rahel, festival programme details and 2027 Run & Rave dates.
- Hosting: any static host. Where it lives is decided at handover and isn't part of this change's behaviour.
