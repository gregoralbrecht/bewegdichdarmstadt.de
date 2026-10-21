// Upgrades server-rendered absolute dates to live, relative ones (design D4/D5).
//
// Markup contract (works without JS: absolute dates stay, [data-show~="upcoming"] stays visible):
//   <section data-event-scope="runrave">            next event of a format ("any" = all formats, "id:<eventId>" = fixed)
//     [data-show="upcoming|live|after|none"]        shown only in those states (space-separated)
//     [data-field="when"]                           "MORGEN · 17:30" (relative, with countdown on the day)
//     [data-field="day"] / [data-field="detail"]    the two halves of the label
//     [data-field="date"] / [data-field="date-long"] / [data-field="time"] / [data-field="title"] / [data-field="place"]
//     [data-field="next-when"]                      after/none states: next date of the same format (or "Neue Termine folgen")
//     [data-ics]                                    calendar link for the scope's event
//   [data-upcoming-list][data-limit="3"]            renders upcoming events from its <template>
import {
  parseJetzt, nextOf, upcoming, justEnded, findEvent, relativeLabel, state, formatDate, formatDateLong, daysUntil,
  formatTime, isoBerlin, toICS, FORMATS,
} from "./schedule.js";

// ---------- Clock (with ?jetzt= demo override, keeps ticking) ----------
const params = new URLSearchParams(location.search);
const fake = parseJetzt(params.get("jetzt"));
const skew = fake == null ? 0 : fake - Date.now();
export const now = () => Date.now() + skew;
export const isDemoClock = fake != null;

/** Adds the demo clock to an internal link so the demo state survives navigation. */
export function withJetzt(path) {
  if (!isDemoClock) return path;
  const url = new URL(path, location.origin);
  url.searchParams.set("jetzt", params.get("jetzt"));
  return url.pathname + url.search + url.hash;
}
if (isDemoClock) {
  for (const a of document.querySelectorAll('a[href^="/"]')) a.setAttribute("href", withJetzt(a.getAttribute("href")));
}

// ---------- Scope resolution ----------
export function resolveScope(spec, t = now()) {
  if (spec.startsWith("id:")) {
    const ev = findEvent(spec.slice(3), t);
    return { event: ev, state: ev ? (state(ev, t) === "past" ? "none" : state(ev, t)) : "none", format: ev?.format };
  }
  const format = spec === "any" ? undefined : spec;
  const next = nextOf(format, t);
  if (next && state(next, t) === "live") return { event: next, state: "live", format: next.format };
  const ended = justEnded(t, { format })[0];
  if (ended) return { event: ended, state: "after", format, next };
  if (next) return { event: next, state: "upcoming", format: next.format };
  return { event: null, state: "none", format, next: null };
}

const set = (root, field, value) => {
  for (const el of root.querySelectorAll(`[data-field="${field}"]`)) {
    if (el.closest("[data-event-scope]") !== root) continue; // belongs to a nested scope
    el.textContent = value;
  }
};

function nextText(format, t) {
  const n = nextOf(format, t);
  if (!n) return "Neue Termine folgen";
  return `${format ? "" : n.title + ", "}${formatDate(n.start)} · ${formatTime(n.start)}`;
}

export function icsHref(event) {
  if (event.format === "runrave") return `/ics/${event.id}.ics`;
  if (event.format === "festival") return "/ics/festival-2027.ics";
  return null; // single Run Club dates are generated on click
}

function bindIcs(el, event) {
  el.dataset.icsEvent = event.id;
  if (el.hasAttribute("data-ics-recurring")) return;
  el.setAttribute("href", icsHref(event) || "/ics/run-club.ics");
}

export function renderScope(root, t = now()) {
  const spec = root.dataset.eventScope;
  const r = resolveScope(spec, t);
  root.dataset.state = r.state;
  const ev = r.event;
  if (ev) {
    const lbl = relativeLabel(ev, t);
    root.dataset.kind = lbl.kind;
    root.dataset.cancelled = ev.cancelled ? "true" : "false";
    set(root, "when", lbl.text);
    set(root, "day", lbl.day);
    set(root, "detail", lbl.detail);
    set(root, "date", formatDate(ev.start, { withYear: new Date(ev.start).getUTCFullYear() !== new Date(t).getUTCFullYear() }));
    set(root, "date-long", formatDateLong(ev.start));
    set(root, "time", formatTime(ev.start));
    set(root, "title", ev.title);
    set(root, "place", ev.place.name);
    set(root, "note", ev.note || "");
    const d = daysUntil(ev, t);
    set(root, "days-left", d <= 0 ? "heute!" : d === 1 ? "morgen!" : `noch ${d} Tage`);
    for (const timeEl of root.querySelectorAll("time[data-field], time.when")) timeEl.dateTime = isoBerlin(ev.start);
    for (const a of root.querySelectorAll("[data-ics]")) bindIcs(a, ev);
    const shareTarget = r.state === "after" ? r.next : ev;
    for (const b of root.querySelectorAll("[data-share-scope]")) {
      if (shareTarget) b.dataset.share = shareTarget.id;
      b.hidden = !shareTarget;
    }
    root.dataset.eventId = ev.id;
  } else {
    delete root.dataset.eventId;
  }
  set(root, "next-when", nextText(r.format, t));
  return r;
}

// ---------- Upcoming list ----------
function renderList(listEl, t = now()) {
  const tpl = listEl.querySelector("template");
  if (!tpl) return;
  const limit = +(listEl.dataset.limit || 4);
  const formats = (listEl.dataset.formats || "runrave runclub festival").split(" ");
  const items = upcoming(t).filter((e) => formats.includes(e.format)).slice(0, limit);
  const existing = [...listEl.children].filter((n) => n.tagName !== "TEMPLATE");
  const sameItems = existing.length === items.length && existing.every((n, i) => n.dataset.eventId === items[i].id);
  const nodes = sameItems ? existing : items.map(() => tpl.content.firstElementChild.cloneNode(true));
  items.forEach((ev, i) => fillItem(nodes[i], ev, t));
  if (!sameItems) {
    existing.forEach((n) => n.remove());
    listEl.append(...nodes);
  }
}

function fillItem(node, ev, t) {
  const lbl = relativeLabel(ev, t);
  node.dataset.format = ev.format;
  node.dataset.kind = lbl.kind;
  node.dataset.cancelled = String(ev.cancelled);
  node.dataset.eventId = ev.id;
  const f = (name, v) => node.querySelectorAll(`[data-field="${name}"]`).forEach((el) => { el.textContent = v; });
  f("title", ev.title);
  f("day", lbl.day);
  f("detail", lbl.detail);
  f("when", lbl.text);
  f("date", formatDate(ev.start, { withYear: true }));
  f("place", ev.place.name);
  f("reason", ev.reason || "");
  node.querySelectorAll("time").forEach((el) => { el.dateTime = isoBerlin(ev.start); });
  node.querySelectorAll("[data-link]").forEach((a) => { a.href = withJetzt(FORMATS[ev.format].page); });
  node.querySelectorAll("[data-ics]").forEach((a) => bindIcs(a, ev));
  node.querySelectorAll("[data-share]").forEach((b) => { b.dataset.share = ev.id; });
}

// ---------- Calendar downloads ----------
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-ics]");
  if (!a) return;
  const id = a.dataset.icsEvent || a.dataset.ics;
  const ev = id && findEvent(id, now());
  if (ev && !icsHref(ev) && !a.hasAttribute("data-ics-recurring")) {
    e.preventDefault();
    const blob = new Blob([toICS(ev, { base: location.origin, now: Date.now() })], { type: "text/calendar" });
    const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${ev.id}.ics` });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  }
  document.dispatchEvent(new CustomEvent("calendar:added", { detail: { eventId: ev?.id, source: a } }));
});

// ---------- Render loop ----------
export function renderAll() {
  const t = now();
  document.querySelectorAll("[data-event-scope]").forEach((el) => renderScope(el, t));
  document.querySelectorAll("[data-upcoming-list]").forEach((el) => renderList(el, t));
  document.documentElement.dataset.timeReady = "";
  document.dispatchEvent(new CustomEvent("schedule:tick", { detail: { now: t } }));
}

renderAll();
let timer = setInterval(renderAll, 15000);
document.addEventListener("visibilitychange", () => {
  clearInterval(timer);
  if (!document.hidden) { renderAll(); timer = setInterval(renderAll, 15000); }
});

// ---------- Offline support (design D17) ----------
// On localhost it only runs with ?sw=1, so development always sees fresh files.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const dev = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (!dev || params.has("sw")) {
    addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  } else {
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
  }
}

// ---------- Play layer, loaded only once the page is idle (design D18) ----------
addEventListener("load", () => {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  idle(() => import("./play.js"));
});
