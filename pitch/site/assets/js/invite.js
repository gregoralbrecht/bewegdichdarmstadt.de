// Personal invite links (event-sharing spec, design D7). Pure functions, shared by browser and tests.
// The name lives only in the URL fragment, so it never reaches a server.
import { FORMATS } from "./schedule.js";

export const NAME_MAX = 30;
const ID_RE = /^(runrave|runclub|festival)-\d{4}-\d{2}-\d{2}$/;

/** Normalises a first name: no control characters, single spaces, max 30 characters. */
export function cleanName(raw) {
  const s = String(raw ?? "").replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮]/g, "").replace(/\s+/g, " ").trim();
  return [...s].slice(0, NAME_MAX).join("").trim();
}

/** Page path that hosts an event's invite landing. */
export function invitePage(eventId) {
  const format = eventId.split("-")[0];
  return format === "runclub" ? "/" : (FORMATS[format]?.page || "/");
}

/** "/run-and-rave/#einladung/runrave-2026-10-30/Gregor" (absolute if `base` given). */
export function inviteLink(eventId, name = "", { base = "" } = {}) {
  const n = cleanName(name);
  return `${base}${invitePage(eventId)}#einladung/${eventId}${n ? "/" + encodeURIComponent(n) : ""}`;
}

/** Parses "#einladung/<id>[/<name>]". Returns { eventId, name } or null. */
export function parseInvite(hash) {
  const m = String(hash || "").match(/^#einladung\/([^/]+)(?:\/(.*))?$/);
  if (!m || !ID_RE.test(m[1])) return null;
  let name = "";
  if (m[2]) {
    try { name = decodeURIComponent(m[2]); } catch { name = m[2]; }
  }
  return { eventId: m[1], name: cleanName(name) };
}
