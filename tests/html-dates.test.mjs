// Keeps the server-rendered (no-JS) dates in the HTML in sync with schedule.js (design D4).
// Fails when a hard-coded date has a typo, or when the static "next event" fallback has gone stale.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { allEvents, nextOf, isoBerlin, findEvent } from "../site/assets/js/schedule.js";

const PAGES = ["site/index.html", "site/run-and-rave/index.html", "site/festival-2027/index.html"];
const now = Date.now();
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const knownStarts = new Set(allEvents(now).map((e) => isoBerlin(e.start)));

/** First <time datetime> inside the element carrying `attr`, e.g. data-event-scope="any". */
function firstDatetimeAfter(html, marker) {
  const i = html.indexOf(marker);
  if (i < 0) return null;
  const m = html.slice(i).match(/<time[^>]*datetime="([^"]+)"/);
  return m && m[1];
}

for (const page of PAGES) {
  const html = read(page);

  test(`${page}: every <time datetime> is a known event start`, () => {
    for (const [, dt] of html.matchAll(/<time[^>]*datetime="([^"]+)"/g)) {
      assert.ok(knownStarts.has(dt), `unknown or mistyped date ${dt}`);
    }
  });

  test(`${page}: list items' dates match their event ids`, () => {
    for (const [, id, body] of html.matchAll(/<li[^>]*data-event-id="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)) {
      const ev = findEvent(id, now);
      assert.ok(ev, `unknown event id ${id}`);
      for (const [, dt] of body.matchAll(/datetime="([^"]+)"/g)) assert.equal(dt, isoBerlin(ev.start), id);
    }
  });

  test(`${page}: static "next event" fallbacks are current`, () => {
    const scopes = [["any", undefined], ["runrave", "runrave"], ["runclub", "runclub"], ["festival", "festival"]];
    for (const [spec, format] of scopes) {
      const dt = firstDatetimeAfter(html, `data-event-scope="${spec}"`);
      if (!dt) continue;
      const next = nextOf(format, now);
      if (!next) continue; // "Neue Termine folgen" state – nothing to compare
      assert.equal(dt, isoBerlin(next.start), `${spec} fallback is stale – update the HTML`);
    }
  });
}
