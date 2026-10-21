// Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  wallToMs, berlinParts, parseJetzt, nthWeekday, upcoming, nextOf, state, relativeLabel,
  justEnded, findEvent, formatDate, isoBerlin, allEvents, RUNRAVE_DATES,
} from "../site/assets/js/schedule.js";

const at = (wall) => wallToMs(wall);

test("wall times are Europe/Berlin, across DST", () => {
  assert.equal(new Date(at("2026-10-30T17:30")).toISOString(), "2026-10-30T16:30:00.000Z"); // CET (+1)
  assert.equal(new Date(at("2026-10-09T17:30")).toISOString(), "2026-10-09T15:30:00.000Z"); // CEST (+2)
  assert.equal(new Date(at("2026-10-25T01:30")).toISOString(), "2026-10-24T23:30:00.000Z"); // before switch
  assert.equal(new Date(at("2026-10-25T04:00")).toISOString(), "2026-10-25T03:00:00.000Z"); // after switch
  assert.equal(isoBerlin(at("2026-10-30T17:30")), "2026-10-30T17:30+01:00");
  assert.equal(isoBerlin(at("2027-09-11T14:00")), "2027-09-11T14:00+02:00");
});

test("berlinParts is independent of the process time zone", () => {
  const p = berlinParts(Date.UTC(2026, 9, 29, 23, 30)); // 00:30 Berlin on 30 Oct
  assert.deepEqual([p.y, p.m, p.d, p.hh, p.mm, p.weekday], [2026, 10, 30, 0, 30, 5]);
});

test("parseJetzt accepts date-time and date, rejects junk", () => {
  assert.equal(parseJetzt("2026-10-30T15:17"), at("2026-10-30T15:17"));
  assert.equal(parseJetzt("2026-10-30"), at("2026-10-30T12:00"));
  assert.equal(parseJetzt("tomorrow"), null);
  assert.equal(parseJetzt(""), null);
});

test("Run Club: 2nd Friday", () => {
  assert.equal(nthWeekday(2026, 11, 5, 2), 13);
  assert.equal(nthWeekday(2027, 1, 5, 2), 8); // 1 Jan 2027 is a Friday
  assert.equal(nthWeekday(2026, 10, 5, 2), 9);
  assert.equal(nthWeekday(2026, 12, 5, 2), 11);
});

test("next Run Club after Mon 19 Oct 2026 is Fri 13 Nov 2026, 17:30", () => {
  const e = nextOf("runclub", at("2026-10-19T09:00"));
  assert.equal(e.id, "runclub-2026-11-13");
  assert.equal(e.start, at("2026-11-13T17:30"));
});

test("Run & Rave id and combined list order on 19 Oct 2026", () => {
  const now = at("2026-10-19T09:00");
  const list = upcoming(now);
  assert.deepEqual(list.slice(0, 3).map((e) => e.id), ["runrave-2026-10-30", "runclub-2026-11-13", "runclub-2026-12-11"]);
  assert.ok(list.some((e) => e.id === "festival-2027-09-11"));
  const iFest = list.findIndex((e) => e.id === "festival-2027-09-11");
  assert.ok(list.slice(0, iFest).every((e) => e.start < list[iFest].start), "festival sits in date order");
});

test("cancellation: visible until passed, never counted as next", () => {
  const now = at("2026-10-01T09:00");
  const list = upcoming(now, { format: "runclub" });
  assert.equal(list[0].id, "runclub-2026-10-09");
  assert.equal(list[0].cancelled, true);
  assert.equal(nextOf("runclub", now).id, "runclub-2026-11-13");
  // after it passed, it no longer appears
  assert.ok(!upcoming(at("2026-10-10T09:00")).some((e) => e.id === "runclub-2026-10-09"));
});

test("no future Run & Rave dates → nextOf returns null", () => {
  assert.equal(nextOf("runrave", at("2026-11-01T09:00")), null);
});

test("relative labels", () => {
  const rr = findEvent("runrave-2026-10-30", at("2026-10-19T09:00"));
  assert.equal(relativeLabel(rr, at("2026-10-29T20:00")).text, "MORGEN · 17:30");
  assert.equal(relativeLabel(rr, at("2026-10-29T23:30")).text, "MORGEN · 17:30");
  assert.equal(relativeLabel(rr, at("2026-10-30T15:17")).text, "HEUTE · in 2 h 13 min");
  assert.equal(relativeLabel(rr, at("2026-10-30T17:10")).text, "HEUTE · in 20 min");
  assert.equal(relativeLabel(rr, at("2026-10-27T10:00")).text, "Freitag · 17:30");
  assert.equal(relativeLabel(rr, at("2026-10-24T10:00")).text, "Freitag · 17:30"); // 6 days
  assert.equal(relativeLabel(rr, at("2026-10-23T10:00")).text, "in 7 Tagen · 17:30");
  assert.equal(relativeLabel(rr, at("2026-10-16T10:00")).text, "in 14 Tagen · 17:30");
  const rc = findEvent("runclub-2026-11-13", at("2026-10-19T09:00"));
  assert.equal(relativeLabel(rc, at("2026-10-19T09:00")).text, "Fr, 13. Nov · 17:30");
  const fest = findEvent("festival-2027-09-11", at("2026-10-19T09:00"));
  assert.equal(relativeLabel(fest, at("2026-10-19T09:00")).text, "Sa, 11. Sep 2027 · 14:00");
});

test("live and after states", () => {
  const rr = findEvent("runrave-2026-10-30", at("2026-10-19T09:00"));
  assert.equal(state(rr, at("2026-10-30T18:10")), "live");
  assert.equal(relativeLabel(rr, at("2026-10-30T18:10")).text, "Läuft gerade");
  assert.equal(state(rr, at("2026-10-30T21:00")), "after");
  assert.deepEqual(justEnded(at("2026-10-30T21:00"), { format: "runrave" }).map((e) => e.id), ["runrave-2026-10-30"]);
  assert.equal(state(rr, at("2026-10-31T08:00")), "past");
  // live events still count as upcoming / next
  assert.equal(nextOf("runrave", at("2026-10-30T18:10")).id, "runrave-2026-10-30");
});

test("formatting", () => {
  assert.equal(formatDate(at("2026-11-13T17:30")), "Fr, 13. Nov");
  assert.equal(formatDate(at("2027-09-11T14:00"), { withYear: true }), "Sa, 11. Sep 2027");
});

test("all Run & Rave dates are known events", () => {
  const ids = allEvents(at("2026-10-19T09:00")).filter((e) => e.format === "runrave").map((e) => e.id);
  assert.equal(ids.length, RUNRAVE_DATES.length);
});
