import { test } from "node:test";
import assert from "node:assert/strict";
import { findEvent, nextOf, toICS, wallToMs, foldLine } from "../site/assets/js/schedule.js";

const now = wallToMs("2026-10-19T09:00");
const bytes = (s) => new TextEncoder().encode(s).length;

test("single Run & Rave event: CRLF, TZID, times, location", () => {
  const ics = toICS(findEvent("runrave-2026-10-30", now), { base: "https://x.test", now });
  assert.ok(ics.endsWith("\r\n"));
  assert.ok(!/[^\r]\n/.test(ics), "only CRLF line endings");
  assert.match(ics, /\r\nDTSTART;TZID=Europe\/Berlin:20261030T173000\r\n/);
  assert.match(ics, /\r\nDTEND;TZID=Europe\/Berlin:20261030T190000\r\n/);
  assert.match(ics, /\r\nLOCATION:Friedensplatz\\, Darmstadt\r\n/);
  assert.match(ics, /\r\nBEGIN:VTIMEZONE\r\nTZID:Europe\/Berlin\r\n/);
  assert.match(ics, /\r\nURL:https:\/\/x\.test\/run-and-rave\/\r\n/);
  assert.doesNotMatch(ics, /RRULE:FREQ=MONTHLY/);
});

test("recurring Run Club has RRULE for 2nd Friday", () => {
  const ics = toICS(nextOf("runclub", now), { now, recurring: true });
  assert.match(ics, /\r\nRRULE:FREQ=MONTHLY;BYDAY=2FR\r\n/);
  assert.match(ics, /\r\nDTSTART;TZID=Europe\/Berlin:20261113T173000\r\n/);
});

test("lines are folded to max 75 octets", () => {
  const ics = toICS(findEvent("festival-2027-09-11", now), { now });
  for (const line of ics.split("\r\n")) assert.ok(bytes(line) <= 75, `too long: ${line}`);
  assert.equal(foldLine("a".repeat(80)), "a".repeat(75) + "\r\n " + "a".repeat(5));
  // never splits a multi-byte character
  const folded = foldLine("ä".repeat(50));
  assert.ok(folded.split("\r\n").every((l) => bytes(l) <= 75));
  assert.equal(folded.replace(/\r\n /g, ""), "ä".repeat(50));
});
