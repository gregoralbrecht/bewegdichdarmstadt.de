// "Wo? Wann?" – sticky button + bottom sheet with the next event's essentials (design D16).
// The page declares which events count: <body data-quick-scope="any|runrave|festival">.
// Without JS the sticky button is a plain anchor to the page's own meeting-point section.
import { now, resolveScope, withJetzt } from "./time-ui.js";
import { relativeLabel, formatDateLong, formatTime, directionsUrl, KOMOOT, FORMATS } from "./schedule.js";
import { icsHref } from "./time-ui.js";

const scopeSpec = document.body.dataset.quickScope || "any";
const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
const fab = document.querySelector("[data-quick-fab]");

// Directions links anywhere on the page use the platform's maps app.
for (const a of document.querySelectorAll("[data-directions]")) {
  const place = a.dataset.directions === "menschenskinder"
    ? { name: "Menschenskinder", city: "Darmstadt-Kranichstein", query: "Menschenskinder Darmstadt-Kranichstein" }
    : { lat: 49.87338, lng: 8.65377 };
  a.href = directionsUrl(place, { apple: isApple });
}

// ---------- Sheet ----------
const sheet = document.createElement("dialog");
sheet.className = "sheet";
sheet.setAttribute("aria-labelledby", "sheet-title");
sheet.innerHTML = `
  <div class="sheet__handle" aria-hidden="true"></div>
  <div class="sheet__body">
    <p class="sheet__format" data-q="format"></p>
    <h2 class="sheet__when" id="sheet-title"><span data-q="day"></span><span class="sheet__detail" data-q="detail"></span></h2>
    <p class="sheet__abs" data-q="abs"></p>
    <div class="sheet__place">
      <div class="sheet__photo" data-q="photo" aria-hidden="true">
        <svg class="smiley" viewBox="0 0 100 100"><use href="#smiley"/></svg>
      </div>
      <div>
        <p class="sheet__place-name"><span aria-hidden="true">📍</span> <span data-q="place"></span></p>
        <p class="sheet__spot" data-q="spot"></p>
      </div>
    </div>
    <div class="sheet__actions">
      <a class="btn btn--primary" data-q="nav" href="${directionsUrl({ lat: 49.87338, lng: 8.65377 }, { apple: isApple })}" rel="noopener">Navigation starten</a>
      <a class="btn" data-q="route" href="${KOMOOT}" rel="noopener">Route ansehen</a>
      <a class="btn" data-q="ics" href="/ics/run-club.ics" data-ics>In den Kalender</a>
    </div>
    <p class="nudge" data-nudge="calendar" hidden></p>
    <button class="btn btn--small sheet__close" type="button" data-q="close">Schließen</button>
  </div>`;
document.body.append(sheet);

const q = (k) => sheet.querySelector(`[data-q="${k}"]`);
let opener = null;

function fill() {
  const t = now();
  const r = resolveScope(scopeSpec, t);
  const ev = r.state === "after" ? r.next : r.event;
  if (!ev) {
    q("format").textContent = "Beweg dich, Darmstadt";
    q("day").textContent = "Neue Termine folgen";
    q("detail").textContent = "";
    q("abs").textContent = "Neue Termine gibt’s zuerst auf Instagram.";
    sheet.querySelector(".sheet__place").hidden = true;
    sheet.querySelector(".sheet__actions").hidden = true;
    return;
  }
  sheet.querySelector(".sheet__place").hidden = false;
  sheet.querySelector(".sheet__actions").hidden = false;
  const lbl = relativeLabel(ev, t);
  sheet.dataset.kind = lbl.kind;
  q("format").textContent = ev.title;
  q("day").textContent = lbl.day;
  q("detail").textContent = lbl.kind === "live" ? "" : (lbl.kind === "today" ? lbl.detail : " · " + lbl.detail);
  q("abs").textContent = `${formatDateLong(ev.start)} · ${formatTime(ev.start)} Uhr`;
  q("place").textContent = `${ev.place.name}, ${ev.place.city}`;
  const spot = q("spot");
  spot.textContent = ev.place.spot || ev.place.spotPlaceholder;
  spot.classList.toggle("placeholder", !ev.place.spot);
  q("nav").href = directionsUrl(ev.place, { apple: isApple });
  q("route").hidden = ev.format === "festival";
  const ics = q("ics");
  ics.dataset.ics = ev.id;
  ics.dataset.icsEvent = ev.id;
  ics.href = icsHref(ev) || "/ics/run-club.ics";
  sheet.dataset.eventId = ev.id;
}

export function openQuickInfo(from) {
  opener = from || document.activeElement;
  fill();
  sheet.showModal();
  sheet.querySelector(".sheet__actions:not([hidden]) .btn, .sheet__close").focus({ preventScroll: true });
}

function close() {
  if (!sheet.open) return;
  sheet.classList.add("is-closing");
  const done = () => {
    sheet.classList.remove("is-closing");
    sheet.style.removeProperty("--drag");
    sheet.close();
  };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) done();
  else setTimeout(done, 180);
}

sheet.addEventListener("close", () => {
  opener?.focus?.({ preventScroll: true });
});
q("close").addEventListener("click", close);
sheet.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
sheet.addEventListener("click", (e) => { if (e.target === sheet) close(); }); // backdrop

// Swipe down to close (phones).
let startY = null;
sheet.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse" || e.target.closest("a, button")) return;
  startY = e.clientY;
});
sheet.addEventListener("pointermove", (e) => {
  if (startY == null) return;
  const dy = Math.max(0, e.clientY - startY);
  sheet.style.setProperty("--drag", dy + "px");
});
const endDrag = (e) => {
  if (startY == null) return;
  const dy = e.clientY - startY;
  startY = null;
  if (dy > 90) close();
  else sheet.style.removeProperty("--drag");
};
sheet.addEventListener("pointerup", endDrag);
sheet.addEventListener("pointercancel", endDrag);

// ---------- Openers ----------
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-quick-info], [data-quick-fab]");
  if (!btn) return;
  e.preventDefault();
  openQuickInfo(btn);
});

// ---------- Event-day emphasis (D16, task 6.3) + hide the FAB while the hero button is visible ----------
function emphasise() {
  const r = resolveScope(scopeSpec, now());
  const ev = r.event;
  const kind = ev ? relativeLabel(ev, now()).kind : null;
  const day = r.state === "live" || (r.state === "upcoming" && kind === "today");
  document.body.toggleAttribute("data-event-day", day);
  for (const label of document.querySelectorAll("[data-quick-label]")) {
    label.textContent = day ? "Wo treffen wir uns?" : "Wo? Wann?";
  }
  if (sheet.open) fill();
}
document.addEventListener("schedule:tick", emphasise);
emphasise();

const heroBtn = document.querySelector(".hero [data-quick-info]");
if (fab && heroBtn && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => fab.classList.toggle("is-tucked", entry.isIntersecting)).observe(heroBtn);
}
if (fab) fab.setAttribute("href", withJetzt(fab.getAttribute("href")));
