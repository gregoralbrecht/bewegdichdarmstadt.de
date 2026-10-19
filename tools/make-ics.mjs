// Writes static calendar files into site/ics/ from schedule.js (design D6). Run: node tools/make-ics.mjs [base-url]
import { writeFile, mkdir } from "node:fs/promises";
import { allEvents, nextOf, toICS } from "../site/assets/js/schedule.js";

const base = process.argv[2] || "https://example.invalid"; // replace with the real host at handover (design D8)
const now = Date.now();
const out = new URL("../site/ics/", import.meta.url).pathname;
await mkdir(out, { recursive: true });

const written = [];
for (const e of allEvents(now).filter((e) => e.format !== "runclub" && now < e.end)) {
  const name = e.format === "festival" ? "festival-2027.ics" : `${e.id}.ics`;
  await writeFile(out + name, toICS(e, { base, now }));
  written.push(name);
}
const rc = nextOf("runclub", now);
await writeFile(out + "run-club.ics", toICS(rc, { base, now, recurring: true }));
written.push("run-club.ics");
console.log("wrote", written.join(", "));
