# Playbook learnings: first run (bewegdichdarmstadt.de, Oct 2026)

What it took to go from "dated Jimdo site" to "pitch-ready concept", and what to reuse next time.

## Capture

- **Jimdo sits behind Cloudflare bot protection.** `curl` and WebFetch get a 403. Reading through the real browser (Claude in Chrome) works: page text via `get_page_text`, other pages via same-origin `fetch()` in the page, colours and fonts via `getComputedStyle`.
- **Images live on `storage.e.jimdo.com`** (cross-origin, no CORS), so they can't be pulled from inside the page. Jimdo's `srcset` URLs contain commas, which break naive srcset parsing; match `(\S+)\s+(\d+)w` instead. The image host itself doesn't block downloads. Easiest route next time: save the pages as "HTML only", extract the URLs locally, then download. Or ask the client for originals.
- **Komoot tours** that aren't public return 403 from the API, but work through the logged-in browser (`/api/v007/tours/<id>?_embedded=coordinates`). Read long outputs in chunks; the browser tool truncates at about 1 KB.
- **Write `source/content.md` straight away:** verbatim text, typos and stale bits marked. It becomes the fact checklist and later the "what we noticed" list for the pitch.

## Design

- Keep the client's colours and logo, and replace the template feel with **one strong idea** (here: "a protest sign that smiles"). Typography does most of the work. Subsetting and instancing variable fonts with fonttools took Bricolage from 131 KB to 33 KB.
- **Compute contrast for every colour pairing up front** and write the rules into the CSS header ("never white on orange").
- **Check at phone width early** by embedding the page in a 390 px `<iframe>`, because macOS won't resize Chrome below about 500 px. The first phone check moved the most important card above the fold.
- **Don't invent facts.** Anything unknown becomes a visible placeholder (donation link, exact meeting spot, missing bios). Sample donation amounts are labelled "Beispielwerte".

## Information within reach

- **The schedule as code** (`schedule.js`: a list plus a recurrence rule plus cancellations) is the single most convincing piece. It's reusable for any club with recurring events. Test the time-zone and DST logic with Node's test runner.
- **The demo clock (`?jetzt=`)** turns "imagine it's Friday" into something you can click. Build it in from the start.
- **The "Wo? Wann?" sheet plus offline service worker** answers the on-the-way question. Register the service worker only off localhost (or with `?sw=1`); otherwise stale CSS during development costs time.

## Share

- **The canvas share studio** (story/post, look, slogan, name) uses Web Share with files on phones and save/copy elsewhere. The same renderer produces the OG images via headless Chrome (`tools/og.sh`), so there's no design tool in the loop.
- **Invite names go in the URL fragment**, so there's no server and no logs. Render them with `textContent` only and cap the length.
- Confetti and toasts have to be appended inside an open `<dialog>`, which sits on the top layer.
- Still to verify per project: the native share sheet on a real iPhone and Android phone.

## Play

- **Load the play layer last** (`requestIdleCallback` after `load`). Lighthouse stays at 98–99.
- **Make decorative smiley fields clickable** by hit-testing `elementsFromPoint` from the section's `pointerdown`. That avoids any `pointer-events` juggling, and buttons are never affected.
- **Tone decorations down** until text contrast still passes in the worst case. The first version was too loud.

## Reuse next time

- `site/assets/js/schedule.js`, `time-ui.js` (state blocks via `data-event-scope` / `data-show`), `quick-info.js`, `share.js`, `invite.js`, `confetti.js`, `play.js`
- `tools/make-ics.mjs`, `tools/og.sh` + `tools/og.html`, `tools/images.mjs`, `tools/route.mjs`
- `pitch/notes.md` structure: before/after table, what we noticed, demo links, open questions
- Tests: `tests/*.test.mjs`, including the check that keeps static no-JS dates in sync

## Time sinks to avoid

- Fighting the service worker cache during development (see above).
- Trying to read image URLs through the browser tool, which redacts them. Go via saved HTML instead.
- Headless Chrome screenshots: it won't write into `/private/tmp` scratch paths, so write into the repo (and clean up).
