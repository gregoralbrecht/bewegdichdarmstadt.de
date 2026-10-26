# Design

## Context

- The repository is empty apart from OpenSpec. This is greenfield work.
- The source site (bewegdichdarmstadt.de) runs on Jimdo behind Cloudflare, which blocks `curl`/WebFetch. Text, photos (about 1500 px wide, no alt text) and the Komoot route link have to be captured through the user's real Chrome session.
- Local tooling: Node 24 (so `node --test` and `npx` are available), Python 3 and macOS `sips`. No ImageMagick, libvips or font tools are installed globally.
- Constraints come from the proposal: no framework, no pipeline, no backend, a German-only pitch, ideally demo-ready by 28 Oct 2026.
- Requirements live in `specs/`. This document only covers how they are met.

## Goals / Non-Goals

**Goals:**
- Order of priority for every trade-off (see proposal.md): (1) information within reach, (2) spreading the word, (3) playful and joyful. When they conflict, e.g. an animation against fast access to the meeting point, the higher goal wins.
- Plain files that any static host can serve unchanged, and a local preview with a one-line command.
- The risky logic (dates, recurrence, time zones, invite parsing, .ics) is testable without a browser.
- The pitch can show every time state (tomorrow, today, live, after) on demand, without waiting for the right day.

**Non-Goals:**
- Reusable templating or tooling for the future playbook. Lessons are written down after this run, not built in advance.
- Supporting browsers older than about two years (no polyfills).
- Pixel-perfect parity with the Jimdo content structure.

## Decisions

### D1: Repository layout: `site/` is the deployable root
```
site/                      <- publish this folder as-is
  sw.js                    service worker (must sit at the root for full scope)
  index.html               hub
  run-and-rave/index.html
  festival-2027/index.html
  assets/css/site.css
  assets/js/*.js           ES modules, no bundler
  assets/fonts/*.woff2
  assets/img/...           generated AVIF/WebP variants
  ics/*.ics                static calendar files (no-JS fallback)
  og/*.png                 link-preview images
source/img/                original photos captured from Jimdo (not deployed)
tools/                     dev-only Node scripts (images, ics, route)
tests/                     node --test suites
```
*Alternatives:* Astro or Eleventy would give partials and image pipelines, but they bring exactly the "pipeline" the user ruled out. With three pages, duplicating header and footer by hand costs less than a generator.

### D2: Event data and logic as one pure ES module
`assets/js/schedule.js` exports the event data (Run & Rave date list, Run Club rule, festival, cancellations) and pure functions such as `upcoming(now)`, `nextOf(format, now)`, `relativeLabel(event, now)`, `state(event, now)` and `toICS(event)`. Every function takes `now` as an argument. The same file is imported by the browser and by `tests/*.test.mjs`.
*Alternative:* JSON plus a separate logic file. Rejected: one module is simpler to import in both runtimes and edit by hand.

### D3: Wall-clock times in Europe/Berlin via `Intl`
Events are stored as Berlin wall-clock strings (`2026-10-30T17:30`). They are converted to instants by finding the Berlin UTC offset for that date with `Intl.DateTimeFormat(..., { timeZone: 'Europe/Berlin' })`. Labels are formatted with the same time zone, so a visitor's device time zone never shifts the dates. Tests cover the DST change (25 Oct 2026) and the "1st is a Friday" case.
*Alternative:* a date library (Luxon, Temporal polyfill). Rejected because of bundle size, and `Intl` is enough here.

### D4: Server-rendered absolute dates, JS-enhanced relative labels
The HTML hard-codes the absolute dates (e.g. `<time datetime="2026-10-30T17:30+01:00">Fr, 30. Okt · 17:30</time>`) so the site works without JS. JS replaces or augments them with relative labels, the countdown, live state and the next-up list.
*Risk of drift* between HTML and data: a test reads the three HTML files and asserts that the next Run & Rave and festival dates in the markup match `schedule.js`.

### D5: Demo clock override
A query parameter `?jetzt=2026-10-30T15:17` makes all pages behave as if it were that Berlin time. This exists for the pitch ("look what it shows on the day"). It has no effect on anything persistent and carries no personal data.

### D6: Calendar files: static for the fallback, generated for the rest
`tools/make-ics.mjs` uses `schedule.js` to write `site/ics/runrave-<date>.ics`, `festival-2027.ics` and `run-club.ics` (with `RRULE:FREQ=MONTHLY;BYDAY=2FR`). Links point to these files by default. With JS, single Run Club dates get a Blob download built from `toICS()`. Tests validate the line format (CRLF, folding, `DTSTART;TZID=Europe/Berlin`, plus a `VTIMEZONE` block).

### D7: Share studio: `<dialog>` + `<canvas>` + Web Share
- Opens as a native `<dialog>`, which gives focus trapping and Escape for free.
- Renders at 1080×1920 (Story) or 1080×1350 (Post) on an offscreen canvas. It waits for `document.fonts.load()` of both typefaces before drawing. All photos are same-origin, so the canvas is never tainted.
- Output is `canvas.toBlob('image/png')`. If `navigator.canShare({ files: [file] })` succeeds, it calls `navigator.share({ files, text, url })`. Otherwise it shows "Bild speichern" (`<a download>`) and "Link kopieren" (`navigator.clipboard`).
- Invite fragment: `#einladung/<eventId>/<urlencoded name>`. It is parsed by a pure function (tested for escaping, truncation and unknown IDs) and rendered only via `textContent`.
*Alternative:* server-side image generation for personalised OG previews. Rejected because there is no backend. That stays a phase-2 upsell.

### D8: Link-preview images are produced by the studio itself
OG images (1200×630) are generated once with the studio's renderer in an internal "og" format, saved to `site/og/` and referenced with absolute URLs. The base URL is a single placeholder that gets replaced once hosting is chosen.

### D9: Typography: Bricolage Grotesque + Figtree (self-hosted variable fonts)
Bricolage Grotesque (heavy weights, slightly quirky) is the "protest sign" display face. Figtree is the warm, legible text face. Both are open-licensed. The latin-subset variable woff2 files are taken from the `@fontsource-variable/*` packages (fetched via `npx`/`npm pack` at dev time, not shipped as a dependency). The display face is preloaded and `font-display: swap` is used, with metric-matched fallbacks (`size-adjust`) to avoid layout shift.
*Alternatives:* Gabarito or Rubik (closer to today's rounded look). A quick A/B on the hub hero during the build may still swap the display face. The decision only affects one `@font-face` block.

### D10: One stylesheet with design tokens and per-page moods
`site.css` defines colour, space and type tokens on `:root`, and `body[data-mood="rave"|"festival"]` overrides the accent tokens: Run & Rave is darker indigo/pink with more energy, the festival is light orange/lavender and summery. Type sizes are fluid via `clamp()`. Cross-page view transitions use `@view-transition { navigation: auto; }` as progressive enhancement. All motion is wrapped in `prefers-reduced-motion: no-preference`.

### D11: Images: originals in `source/`, variants generated with sharp
Originals are downloaded from Jimdo's CDN via Chrome (with the user's approval). `tools/images.mjs` (run with `npx sharp-cli` or a one-off `npm i --no-save sharp`) writes AVIF and WebP at 480, 960 and 1440 widths. Pages use `<picture>` with `srcset`/`sizes`, explicit `width`/`height`, `loading="lazy"` except for the hero (`fetchpriority="high"`).

### D12: Route as hand-tuned inline SVG
GPX is taken from the Komoot tour (export, or trace by hand if export needs a login). `tools/route.mjs` projects lat/lon into an SVG path (equirectangular, fine at city scale) and simplifies it. Landmarks (Friedensplatz, Langer Ludwig, Hochzeitsturm) and the stylised streets are hand-placed. Drawing is a `stroke-dashoffset` transition triggered by `IntersectionObserver`.

### D13: Small components without dependencies
Join-mode picker = radio group plus a live region. Gallery = `<a href=full.webp>` links progressively enhanced into a `<dialog>` viewer with arrow and swipe navigation. Rave mode = a click counter on the logo that toggles a `data-rave` attribute, with CSS doing the animation (≤ 3 flashes per second). It lives in the play layer (D18).

### D16: "Wo? Wann?" as a sticky button plus a `<dialog>` bottom sheet
- A fixed button sits bottom-right, respecting the safe-area inset and never overlapping the footer links. It opens a native `<dialog>` styled as a bottom sheet on phones and a centred card on desktop. Swipe-to-close is a small pointer handler; Escape and outside clicks come from `<dialog>`.
- Content comes from `schedule.js` (next event, spot text, photo key). Without JS, the button is an anchor to the page's own meeting-point section, so the content stays reachable.
- "Navigation starten" builds an Apple Maps link (`https://maps.apple.com/?daddr=…&dirflg=w`) on Apple platforms and a Google Maps directions URL elsewhere, both as ordinary links.
*Alternative:* an always-visible info bar. Rejected because it takes permanent screen space, and the sheet keeps the hero clean.

### D17: Service worker for offline access
`site/sw.js` precaches the three pages, CSS, JS, fonts and meeting-point photos on install, under a versioned cache name. It serves pages network-first, falling back to the cache, so updates show up as soon as the visitor is online. Static assets are served stale-while-revalidate: instantly from the cache, refreshed in the background (chosen over pure cache-first during implementation so updated CSS/JS never stick around longer than one visit). Other photos are cached opportunistically when viewed. Bumping the version constant drops old caches.
*Alternative:* a full PWA with a manifest and install prompt. Rejected for now: install prompts feel pushy, and offline access alone serves goal 1. A manifest can be added later in a few lines.

### D18: Play layer as one deferred module
`assets/js/play.js` is imported only after `load` via `requestIdleCallback`, so it never competes with content.
- **Cursor smiley:** one absolutely positioned SVG moved with `transform` in a `requestAnimationFrame` spring loop. Enabled only if `matchMedia('(pointer: fine)')` matches and reduced motion is off. `pointer-events: none`. It changes expression when the pointer is over `a, button`.
- **Smiley backgrounds:** a grid of inline SVG `<use href="#smiley">` elements (about 40–80 per hero, scaled to viewport) inside an `aria-hidden` layer behind the content. The content layer sits above with its own stacking context, so taps on text and buttons never hit smileys. A tap cycles `data-c` through the palette via event delegation. The "alle bunt" check runs after each tap.
- **Confetti:** a short burst of small smileys drawn on a temporary full-screen canvas (about 1 s, then removed). It is shared by share success, calendar success and the "alle bunt" celebration.
- **Microinteractions:** CSS-only where possible (`:active` squish, smiley icon wink on `:hover`/`:focus-visible`).
- Rave mode (D13) moves into this module.
*Alternative:* a canvas-only background. Rejected because DOM smileys are simpler to hit-test, colour via CSS and keep crisp, and the count is small.

### D19: Nudges with per-visit memory
Each nudge is an inline element that is hidden by default and revealed at its trigger (calendar click, invite landing, event-day state, after-event state). A `sessionStorage` flag ensures only one nudge per visit. Storage access is wrapped in try/catch: if storage is unavailable, at most the first triggered nudge per page view shows.

### D14: Draft marking and indexing
Every page has `<meta name="robots" content="noindex, nofollow">` and a small fixed "Entwurf" badge. There is no `robots.txt` disallow: it would stop crawlers from seeing the noindex directive.

### D15: Verification without a pipeline
- `node --test tests/` covers the logic.
- `python3 -m http.server -d site 8080` gives a local preview.
- `npx lighthouse` runs against the local server for the budget checks, and also against the live Jimdo site for the before/after comparison.
- A manual pass in Chrome via Claude in Chrome checks phone width, keyboard use and no-JS behaviour.

## Risks / Trade-offs

- [Web Share with files is unreliable on desktop and in some in-app browsers] → Always show save and copy fallbacks, and feature-detect with `canShare` instead of user-agent sniffing.
- [Canvas draws fallback fonts if fonts haven't loaded] → Await `document.fonts.load()` for each face before the first render. Show a spinner state in the preview until ready.
- [Hard-coded HTML dates drift from `schedule.js`] → The drift test from D4, plus D6 generating the .ics files from the same data.
- [DST and time-zone bugs make "MORGEN" wrong] → Pure functions with injected `now` and tests around 25 Oct 2026 and late-evening edges (23:30 the day before).
- [Deadline of 28 Oct for an in-person demo] → Tasks follow the three goals: hub, Run & Rave and quick-info first, then sharing (studio and nudges), then the play layer. The festival microsite and the route animation can slip without breaking the pitch.
- [Play layer hurts performance or distracts] → Deferred loading (D18), `pointer-events: none` on decorations, a capped smiley count, and the Lighthouse budget check also running with the play layer active. Reduced motion turns most of it off.
- [Smiley background reduces text legibility] → Smileys use low-contrast tints in hero areas, and text sits on a solid or scrim layer. The contrast check includes the worst-case smiley colour behind text.
- [A stale service worker keeps an old pitch version on the founders' phones] → Network-first for pages and a versioned cache bumped with every deploy. As a last resort, a kill switch: deploy an `sw.js` that unregisters itself.
- [Nudges feel pushy] → Inline only, one per visit, always dismissible, and the copy stays warm ("Wer kommt mit?"), not salesy.
- [Publishing someone else's brand and photos] → Noindex, a visible "Entwurf" marker and an unlisted URL shared only with the founders.
- [Jimdo CDN images may be recompressed or capped at 1500 px] → Good enough for 1440 px variants. Ask the founders for originals if the pitch lands.
- [Komoot GPX export requires a login] → Trace the route manually from the map. Exact geometry isn't needed for a stylised illustration.

## Migration Plan

Not applicable. Nothing is replaced: the Jimdo site stays live. Deployment means uploading `site/` to a static host after replacing the OG base-URL placeholder. Rollback means taking the link down.

## Open Questions

- Final host and URL (needed only for absolute OG URLs and the handover).
- The exact meeting spot on Friedensplatz (and ideally a photo of it). Until then, a marked placeholder plus a general Friedensplatz photo from the captured set.
- Real donation target, impact numbers, Mady's and Rahel's bios and photos, festival programme details and 2027 Run & Rave dates. These are all placeholders until the founders supply them.
