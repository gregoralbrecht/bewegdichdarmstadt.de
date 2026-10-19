import { test } from "node:test";
import assert from "node:assert/strict";
import { inviteLink, parseInvite, cleanName } from "../site/assets/js/invite.js";

test("link with and without name", () => {
  assert.equal(inviteLink("runrave-2026-10-30", "Gregor"), "/run-and-rave/#einladung/runrave-2026-10-30/Gregor");
  assert.equal(inviteLink("runrave-2026-10-30", ""), "/run-and-rave/#einladung/runrave-2026-10-30");
  assert.equal(inviteLink("runclub-2026-11-13", "Lea"), "/#einladung/runclub-2026-11-13/Lea");
  assert.equal(inviteLink("festival-2027-09-11", "Jörg Müller", { base: "https://x.test" }), "https://x.test/festival-2027/#einladung/festival-2027-09-11/J%C3%B6rg%20M%C3%BCller");
});

test("round trip", () => {
  for (const name of ["Gregor", "Jörg Müller", "Ana-María", "李雷", "🏃‍♀️ Steffi", ""]) {
    const hash = "#" + inviteLink("runrave-2026-10-30", name).split("#")[1];
    assert.deepEqual(parseInvite(hash), { eventId: "runrave-2026-10-30", name: cleanName(name) });
  }
});

test("markup stays text; length is capped at 30 characters", () => {
  const p = parseInvite("#einladung/runrave-2026-10-30/" + encodeURIComponent("<b>Gregor</b><img src=x onerror=alert(1)>"));
  assert.equal(p.name, "<b>Gregor</b><img src=x onerro"); // returned as plain text; rendered via textContent
  assert.equal([...p.name].length, 30);
  assert.equal([...parseInvite("#einladung/runrave-2026-10-30/" + "x".repeat(100)).name].length, 30);
});

test("control characters and whitespace are cleaned", () => {
  assert.equal(cleanName("  Lea\n\t Emmel‮ "), "Lea Emmel");
});

test("rejects unknown shapes, tolerates broken encoding", () => {
  assert.equal(parseInvite("#einladung/whatever/Gregor"), null);
  assert.equal(parseInvite("#run-club"), null);
  assert.equal(parseInvite(""), null);
  assert.deepEqual(parseInvite("#einladung/runclub-2026-11-13/%E0%A4%A"), { eventId: "runclub-2026-11-13", name: "%E0%A4%A" });
});
