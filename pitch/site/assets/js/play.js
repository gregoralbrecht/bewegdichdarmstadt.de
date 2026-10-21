// Play layer (brand-experience spec, design D18): cursor smiley, smiley fields, calendar success, rave mode.
// Loaded after the page is idle; everything here is optional decoration.
import { confetti } from "./confetti.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const SMILEY = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#smiley"/></svg>';

function toast(text) {
  const t = Object.assign(document.createElement("p"), { className: "toast", textContent: text });
  t.setAttribute("role", "status");
  document.body.append(t);
  setTimeout(() => t.remove(), 3200);
}

// ---------- Smiley fields: tap to recolour, drag to paint (mouse), "alle bunt" celebration ----------
const PALETTES = {
  light: ["#ece9f8", "#fde4ef", "#feecd5", "#e2e6fa"],
  rave: ["#1d2660", "#3a2150", "#2c2466", "#25327a"],
  indigo: ["#2c3f9b", "#3f3a91", "#4a4060", "#2a3b94"],
};

function fillField(field) {
  const host = field.parentElement;
  const palette = PALETTES[field.classList.contains("smiley-field--rave") ? "rave" : field.classList.contains("smiley-field--soft") ? "indigo" : "light"];
  const size = innerWidth < 600 ? 92 : 118;
  const cols = Math.ceil(host.clientWidth / size) + 1;
  const rows = Math.min(Math.ceil(host.clientHeight / size), 8);
  field.innerHTML = "";
  field.style.setProperty("--sf-size", size + "px");
  field.dataset.palette = palette.join(" ");
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s = document.createElement("span");
      s.className = "sf";
      const ci = (r * 3 + c * 7) % palette.length;
      s.dataset.c = ci;
      s.style.cssText = `left:${c * size - (r % 2 ? size / 2 : 0)}px;top:${r * size}px;color:${palette[ci]};--rot:${((r + c) % 5) * 7 - 14}deg`;
      s.innerHTML = SMILEY;
      field.append(s);
    }
  }
}

function recolour(s, ci) {
  const palette = s.parentElement.dataset.palette.split(" ");
  const next = ci ?? (+s.dataset.c + 1) % palette.length;
  if (+s.dataset.c === next) return;
  s.dataset.c = next;
  s.style.color = palette[next];
  s.classList.remove("sf--pop");
  void s.offsetWidth;
  s.classList.add("sf--pop");
}

function checkAllSame(field) {
  const all = [...field.querySelectorAll(".sf")].filter((s) => {
    const r = s.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; // visible ones count
  });
  if (all.length > 3 && all.every((s) => s.dataset.c === all[0].dataset.c) && field.dataset.celebrated !== all[0].dataset.c) {
    field.dataset.celebrated = all[0].dataset.c;
    confetti({ count: 60 });
    toast("Alle in einer Farbe – so sieht Gemeinschaft aus! 🎉");
  }
}

const IGNORE = "a, button, input, label, select, textarea, summary, .card, .next-card, dialog";
function smileyAt(x, y) {
  return document.elementsFromPoint(x, y).find((el) => el.classList?.contains("sf"));
}

for (const field of document.querySelectorAll("[data-smiley-field]")) {
  fillField(field);
  const host = field.parentElement;
  let painting = null;
  host.addEventListener("pointerdown", (e) => {
    if (e.target.closest(IGNORE)) return;
    const s = smileyAt(e.clientX, e.clientY);
    if (!s) return;
    recolour(s);
    if (e.pointerType === "mouse") { painting = +s.dataset.c; e.preventDefault(); }
    else checkAllSame(field);
  });
  host.addEventListener("pointermove", (e) => {
    if (painting == null) return;
    const s = smileyAt(e.clientX, e.clientY);
    if (s && s.parentElement === field) recolour(s, painting);
  });
  addEventListener("pointerup", () => { if (painting != null) { painting = null; checkAllSame(field); } });
}
let resizeTimer;
addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => document.querySelectorAll("[data-smiley-field]").forEach(fillField), 300);
});

// ---------- Cursor smiley (fine pointers only, never with reduced motion) ----------
if (finePointer && !reduced) {
  const cur = document.createElement("div");
  cur.className = "cursor-smiley";
  cur.setAttribute("aria-hidden", "true");
  cur.innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="currentColor"/><ellipse class="eye-l" cx="35" cy="38" rx="6.5" ry="9.5" fill="#fff"/><ellipse class="eye-r" cx="65" cy="38" rx="6.5" ry="9.5" fill="#fff"/><path d="M27 57 Q50 82 73 57" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/></svg>';
  document.body.append(cur);
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, vx = 0, vy = 0, shown = false;
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    tx = e.clientX + 18; ty = e.clientY + 20;
    if (!shown) { x = tx; y = ty; shown = true; cur.classList.add("is-on"); }
    cur.classList.toggle("is-hover", !!e.target.closest?.("a, button, label, summary, .sf"));
  });
  document.documentElement.addEventListener("pointerleave", () => { shown = false; cur.classList.remove("is-on"); });
  (function tick() {
    // springy follow
    vx = (vx + (tx - x) * 0.12) * 0.72; vy = (vy + (ty - y) * 0.12) * 0.72;
    x += vx; y += vy;
    cur.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.max(-25, Math.min(25, vx * 2))}deg)`;
    requestAnimationFrame(tick);
  })();
}

// ---------- Calendar success microinteraction ----------
document.addEventListener("calendar:added", (e) => {
  const btn = e.detail?.source;
  if (!btn || btn.dataset.celebrating) return;
  btn.dataset.celebrating = "1";
  const label = btn.innerHTML;
  btn.classList.add("is-done");
  btn.innerHTML = `<svg class="smiley-icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#smiley"/></svg> Ist im Kalender!`;
  const r = btn.getBoundingClientRect();
  confetti({ x: r.left + r.width / 2, y: r.top, count: 18 });
  setTimeout(() => { btn.innerHTML = label; btn.classList.remove("is-done"); delete btn.dataset.celebrating; }, 2600);
});

// ---------- Rave mode: tap the header smiley 5× within 3 s ----------
const logo = document.querySelector(".brand .smiley");
let taps = [];
let raveTimer;
logo?.addEventListener("click", (e) => {
  e.preventDefault(); // the smiley is a toy; the brand name stays the home link
  const t = performance.now();
  taps = taps.filter((x) => t - x < 3000).concat(t);
  logo.classList.remove("is-tapped"); void logo.getBoundingClientRect(); logo.classList.add("is-tapped");
  if (taps.length >= 5) {
    taps = [];
    toggleRave();
  }
});
function toggleRave(force) {
  const on = force ?? !document.body.hasAttribute("data-rave");
  document.body.toggleAttribute("data-rave", on);
  clearTimeout(raveTimer);
  if (on) {
    toast(reduced ? "Rave-Modus 🎉" : "Rave-Modus! 🔊 (ganz ohne Ton)");
    if (!reduced) confetti({ count: 50 });
    raveTimer = setTimeout(() => toggleRave(false), 7000);
  }
}
