// Share studio, invite landing and share nudges (event-sharing spec, design D7/D19).
import { now, resolveScope, renderAll } from "./time-ui.js";
import { findEvent, nextOf, state, relativeLabel, berlinParts, formatTime, formatDate, WEEKDAYS_SHORT } from "./schedule.js";
import { inviteLink, parseInvite, cleanName, NAME_MAX } from "./invite.js";
import { confetti, smiley } from "./confetti.js";

// ---------- Looks, slogans ----------
const LOOKS = [
  { key: "indigo", label: "Indigo", bg: "#25378d", fg: "#ffffff", accent: "#f8971c", deco: "#3d51b8" },
  { key: "orange", label: "Orange", bg: "#f8971c", fg: "#1b1a33", accent: "#25378d", deco: "#ffb04d" },
  { key: "pink", label: "Pink", bg: "#f29ac2", fg: "#1b1a33", accent: "#25378d", deco: "#f7b8d5" },
  { key: "night", label: "Nacht", bg: "#141c4d", fg: "#ffffff", accent: "#f29ac2", deco: "#232e6e" },
];
// Event photos become additional looks once available: { key, label, src } (same-origin, design D7).
export const PHOTO_LOOKS = [];

const SLOGANS = {
  common: ["Kommst du mit?", "Ich bin dabei!", "Demokratie läuft nicht von allein."],
  runrave: ["Run the City. Rave the Streets."],
  runclub: ["Lauf mit uns."],
  festival: ["Save the Date!"],
};

const FORMATS_PX = { story: [1080, 1920], post: [1080, 1350], og: [1200, 630] };

const shortDate = (ms) => {
  const p = berlinParts(ms);
  return `${WEEKDAYS_SHORT[p.weekday]}, ${String(p.d).padStart(2, "0")}.${String(p.m).padStart(2, "0")}.`;
};

// ---------- Canvas renderer ----------
function wrap(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function fitText(ctx, text, maxW, maxLines, startSize, weight, family) {
  let size = startSize, lines;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    lines = wrap(ctx, text, maxW);
    size -= 4;
  } while ((lines.length > maxLines || lines.some((l) => ctx.measureText(l).width > maxW)) && size > 40);
  return { lines, size: size + 4 };
}

const imgCache = new Map();
function loadImage(src) {
  if (!imgCache.has(src)) {
    imgCache.set(src, new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }));
  }
  return imgCache.get(src);
}

export async function renderCard(canvas, { event, format = "story", lookKey = "indigo", slogan = "Kommst du mit?", name = "", tagline = "" }) {
  const [W, H] = FORMATS_PX[format];
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  await Promise.all([document.fonts.load("800 100px Bricolage"), document.fonts.load("700 40px Figtree"), document.fonts.load("400 40px Figtree")]);
  const photo = PHOTO_LOOKS.find((p) => p.key === lookKey);
  const look = photo ? { ...LOOKS[3], fg: "#ffffff", accent: "#f29ac2" } : (LOOKS.find((l) => l.key === lookKey) || LOOKS[0]);
  const D = "Bricolage, 'Bricolage Fallback', sans-serif", T = "Figtree, 'Figtree Fallback', sans-serif";
  const pad = Math.round(W * 0.08);

  // Background
  ctx.fillStyle = look.bg; ctx.fillRect(0, 0, W, H);
  if (photo) {
    const img = await loadImage(photo.src);
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
    ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#141c4d55"); g.addColorStop(0.45, "#141c4d88"); g.addColorStop(1, "#141c4df2");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } else {
    // smiley pattern
    const step = W / 5;
    for (let y = -step / 2, row = 0; y < H + step; y += step, row++) {
      for (let x = (row % 2) * step / 2 - step / 2; x < W + step; x += step) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(((x + y) % 7) * 0.12 - 0.3);
        smiley(ctx, step * 0.28, look.deco, look.bg);
        ctx.restore();
      }
    }
  }

  // Top: brand
  const top = format === "story" ? pad * 1.6 : pad;
  ctx.save(); ctx.translate(pad + 44, top + 44); smiley(ctx, 44, look.accent, look.bg); ctx.restore();
  ctx.fillStyle = look.fg; ctx.font = `800 44px ${D}`; ctx.textBaseline = "middle";
  ctx.fillText("Beweg dich, Darmstadt", pad + 112, top + 46);

  // Slogan (big, slightly rotated like a sign)
  const maxW = W - pad * 2;
  const sloganLines = format === "og" ? 2 : 4;
  const { lines, size } = fitText(ctx, slogan, maxW, sloganLines, format === "og" ? 110 : 168, 800, D);
  let y = format === "story" ? H * 0.26 : format === "post" ? H * 0.2 : H * 0.3;
  ctx.save();
  ctx.translate(pad, y); ctx.rotate(-0.03);
  ctx.fillStyle = look.fg; ctx.textBaseline = "alphabetic";
  lines.forEach((l, i) => ctx.fillText(l, 0, (i + 1) * size * 0.98));
  ctx.restore();
  y += lines.length * size * 0.98 + size * 0.5;

  // Tagline (link previews without a date, which would go stale)
  if (tagline) {
    ctx.font = `700 ${format === "og" ? 40 : 56}px ${T}`;
    ctx.fillStyle = look.fg; ctx.textBaseline = "alphabetic";
    wrap(ctx, tagline, maxW).forEach((l, i) => ctx.fillText(l, pad, y + i * 52));
  }

  // Personal line
  if (name && format !== "og") {
    ctx.font = `700 60px ${T}`;
    const label = `${name} ist dabei`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = look.accent;
    roundRect(ctx, pad - 6, y - 4, tw + 60, 92, 46); ctx.fill();
    ctx.fillStyle = look.accent === "#25378d" ? "#ffffff" : "#1b1a33";
    ctx.textBaseline = "middle"; ctx.fillText(label, pad + 24, y + 42);
    y += 140;
  }

  // Event card at the bottom
  if (event) {
    const cardH = format === "og" ? 210 : 330;
    const cy = format === "og" ? H - cardH - pad * 0.6 : H - cardH - (format === "story" ? pad * 2.2 : pad);
    const cx = format === "og" ? W * 0.52 : pad;
    const cw = format === "og" ? W - cx - pad * 0.6 : W - pad * 2;
    ctx.fillStyle = "#1b1a33"; roundRect(ctx, cx + 14, cy + 14, cw, cardH, 40); ctx.fill();
    ctx.fillStyle = "#ffffff"; roundRect(ctx, cx, cy, cw, cardH, 40); ctx.fill();
    ctx.strokeStyle = "#1b1a33"; ctx.lineWidth = 6; ctx.stroke();
    const ix = cx + 48;
    ctx.fillStyle = "#25378d"; ctx.textBaseline = "alphabetic";
    ctx.font = `800 ${format === "og" ? 34 : 44}px ${T}`;
    ctx.fillText(event.title.toUpperCase(), ix, cy + (format === "og" ? 66 : 86));
    ctx.fillStyle = "#1b1a33";
    ctx.font = `800 ${format === "og" ? 56 : 92}px ${D}`;
    const end = event.format === "festival" ? `–${formatTime(event.end)}` : "";
    ctx.fillText(`${shortDate(event.start)} · ${formatTime(event.start)}${end}`, ix, cy + (format === "og" ? 134 : 186));
    ctx.font = `700 ${format === "og" ? 30 : 46}px ${T}`;
    ctx.fillText(`${event.place.name}${event.format === "festival" ? ", Kranichstein" : ", Darmstadt"} · kostenlos`, ix, cy + (format === "og" ? 182 : 268));
  }

  if (format !== "og") {
    ctx.fillStyle = look.fg; ctx.font = `700 40px ${T}`; ctx.textBaseline = "alphabetic";
    ctx.fillText("bewegdichdarmstadt.de", pad, H - (format === "story" ? pad * 1.1 : pad * 0.45));
  }
  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// ---------- Studio dialog ----------
const studio = document.createElement("dialog");
studio.className = "studio";
studio.setAttribute("aria-labelledby", "studio-title");
studio.innerHTML = `
  <div class="studio__head">
    <h2 id="studio-title">Sag’s weiter</h2>
    <button class="btn btn--small" type="button" data-s="close">Schließen</button>
  </div>
  <div class="studio__grid">
    <div class="studio__preview"><canvas data-s="canvas" role="img" aria-label="Vorschau des Teilen-Bildes"></canvas></div>
    <form class="studio__controls" data-s="form">
      <p class="studio__event" data-s="event"></p>
      <fieldset><legend>Format</legend>
        <div class="seg">
          <input type="radio" name="format" id="f-story" value="story" checked><label for="f-story">Story</label>
          <input type="radio" name="format" id="f-post" value="post"><label for="f-post">Post</label>
        </div>
      </fieldset>
      <fieldset><legend>Look</legend><div class="swatches" data-s="looks"></div></fieldset>
      <fieldset><legend>Spruch</legend><div class="slogans" data-s="slogans"></div></fieldset>
      <label class="studio__name">Dein Vorname <span>(optional)</span>
        <input type="text" name="name" maxlength="${NAME_MAX}" autocomplete="given-name" placeholder="z. B. Gregor" data-s="name">
      </label>
      <div class="studio__actions">
        <button class="btn btn--primary" type="button" data-s="share" hidden>Teilen</button>
        <button class="btn" type="button" data-s="save">Bild speichern</button>
        <button class="btn btn--pink" type="button" data-s="copy">Link kopieren</button>
      </div>
      <p class="studio__status" role="status" aria-live="polite" data-s="status"></p>
    </form>
  </div>`;
document.body.append(studio);
const $ = (k) => studio.querySelector(`[data-s="${k}"]`);

let current = null, opener = null, renderToken = 0;

function eventForShare(id) {
  const t = now();
  const ev = id && findEvent(id, t);
  if (ev && state(ev, t) !== "past" && !ev.cancelled) return ev;
  const fallback = nextOf(ev?.format, t) || nextOf(undefined, t);
  return fallback;
}

function buildControls(ev) {
  $("looks").innerHTML = "";
  for (const [i, l] of [...LOOKS, ...PHOTO_LOOKS].entries()) {
    const id = `look-${l.key}`;
    $("looks").insertAdjacentHTML("beforeend",
      `<input type="radio" name="look" id="${id}" value="${l.key}" ${i === 0 ? "checked" : ""}><label for="${id}" title="${l.label}" style="${l.src ? `background-image:url('${l.src}')` : `background:${l.bg}`}"><span class="visually-hidden">${l.label}</span></label>`);
  }
  $("slogans").innerHTML = "";
  [...SLOGANS.common, ...(SLOGANS[ev.format] || [])].forEach((s, i) => {
    $("slogans").insertAdjacentHTML("beforeend",
      `<label class="slogan"><input type="radio" name="slogan" value="${s}" ${i === 0 ? "checked" : ""}> <span>${s}</span></label>`);
  });
}

function opts() {
  const f = new FormData($("form"));
  return { event: current, format: f.get("format"), lookKey: f.get("look"), slogan: f.get("slogan"), name: cleanName(f.get("name")) };
}

async function preview() {
  const token = ++renderToken;
  studio.classList.add("is-rendering");
  const off = document.createElement("canvas");
  await renderCard(off, opts());
  if (token !== renderToken) return;
  const c = $("canvas");
  c.width = off.width; c.height = off.height;
  c.getContext("2d").drawImage(off, 0, 0);
  c.dataset.format = opts().format;
  studio.classList.remove("is-rendering");
}

function link() {
  return inviteLink(current.id, opts().name, { base: location.origin });
}

function message() {
  const e = current;
  const extra = e.format === "runrave" ? " – ca. 5,5 km im Plauder-Tempo, mit Musik" : e.format === "runclub" ? " – lockere Runde, alle Tempos" : " – kostenlos, für Groß und Klein";
  return `${opts().slogan} ${e.title}, ${formatDate(e.start)}, ${formatTime(e.start)} Uhr, ${e.place.name}${extra} 🙂`;
}

const blob = () => new Promise((res) => $("canvas").toBlob(res, "image/png"));
const fileName = () => `beweg-dich-${current.id}-${opts().format}.png`;

function done(text) {
  $("status").textContent = text;
  const r = $("status").getBoundingClientRect();
  confetti({ x: r.left + r.width / 2 || innerWidth / 2, y: r.top || innerHeight / 2 });
  document.dispatchEvent(new CustomEvent("share:done"));
}

$("share").addEventListener("click", async () => {
  const file = new File([await blob()], fileName(), { type: "image/png" });
  try {
    await navigator.share({ files: [file], text: `${message()}\n${link()}` });
    done("Danke fürs Weitersagen! 🧡");
  } catch (err) {
    if (err?.name !== "AbortError") $("status").textContent = "Teilen hat nicht geklappt – speichere das Bild oder kopiere den Link.";
  }
});
$("save").addEventListener("click", async () => {
  const url = URL.createObjectURL(await blob());
  const a = Object.assign(document.createElement("a"), { href: url, download: fileName() });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  done("Bild gespeichert – danke fürs Weitersagen! 🧡");
});
$("copy").addEventListener("click", async () => {
  const text = `${message()}\n${link()}`;
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = Object.assign(document.createElement("textarea"), { value: text });
    studio.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
  done("Link kopiert – danke fürs Weitersagen! 🧡");
});

$("form").addEventListener("input", preview);
$("form").addEventListener("submit", (e) => e.preventDefault());
$("close").addEventListener("click", () => studio.close());
studio.addEventListener("click", (e) => { if (e.target === studio) studio.close(); });
studio.addEventListener("close", () => opener?.focus?.({ preventScroll: true }));

export async function openStudio(eventId, from) {
  current = eventForShare(eventId);
  if (!current) return;
  opener = from || document.activeElement;
  buildControls(current);
  const lbl = relativeLabel(current, now());
  $("event").textContent = `${current.title} · ${formatDate(current.start, { withYear: true })} · ${formatTime(current.start)} Uhr · ${current.place.name}`;
  $("status").textContent = "";
  // Web Share with files? (design D7: feature detection, never UA sniffing)
  const probe = new File([new Blob(["x"], { type: "image/png" })], "x.png", { type: "image/png" });
  $("share").hidden = !(navigator.canShare && navigator.canShare({ files: [probe] }));
  studio.showModal();
  studio.dataset.kind = lbl.kind;
  await preview();
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-share]");
  if (!b || b.closest(".studio")) return;
  e.preventDefault();
  openStudio(b.dataset.share, b);
});

// ---------- Invite landing (task 7.4) ----------
function inviteLanding() {
  const inv = parseInvite(location.hash);
  if (!inv) return;
  const t = now();
  const ev = findEvent(inv.eventId, t);
  const main = document.querySelector("main");
  const box = document.createElement("section");
  box.className = "invite";
  box.setAttribute("aria-labelledby", "invite-title");
  box.tabIndex = -1;
  const past = !ev || state(ev, t) === "past" || ev.cancelled;
  const sameFormat = past ? nextOf(ev?.format, t) : ev;
  const next = sameFormat || nextOf(undefined, t); // no date of that format yet → offer whatever comes next
  box.innerHTML = `
    <div class="wrap invite__inner">
      <p class="invite__hello">Du wurdest eingeladen <span aria-hidden="true">💌</span></p>
      <h2 id="invite-title" class="invite__title"></h2>
      <p class="invite__when"></p>
      <div class="btn-row invite__actions"></div>
      <p class="nudge" data-nudge="invite" hidden></p>
    </div>`;
  const title = box.querySelector(".invite__title");
  const whenEl = box.querySelector(".invite__when");
  const actions = box.querySelector(".invite__actions");
  if (!past) {
    title.textContent = inv.name ? `${inv.name} ist dabei. Du auch?` : "Wir sind dabei. Du auch?";
    whenEl.textContent = `${ev.title} · ${relativeLabel(ev, t).text} · ${ev.place.name}`;
  } else {
    title.textContent = `${inv.name ? inv.name + " hat dich eingeladen – " : ""}der Termin ist leider schon vorbei.`;
    const lead = sameFormat ? "Aber der nächste kommt:" : `Neue ${ev?.title || ""} Termine folgen. Bis dahin:`;
    whenEl.textContent = next ? `${lead} ${next.title} · ${formatDate(next.start, { withYear: true })} · ${formatTime(next.start)} Uhr · ${next.place.name}` : "Neue Termine folgen – schau auf Instagram vorbei.";
  }
  if (next) {
    actions.innerHTML = `
      <button class="btn btn--primary" type="button" data-quick-info>Wo? Wann?</button>
      <a class="btn" href="/ics/run-club.ics" data-ics="${next.id}">In den Kalender</a>
      <button class="btn btn--pink" type="button" data-share="${next.id}">Bring deine +1 mit</button>`;
  }
  main.prepend(box);
  renderAll(); // binds the calendar link
  for (const a of box.querySelectorAll("[data-ics]")) {
    a.setAttribute("href", next.format === "runrave" ? `/ics/${next.id}.ics` : next.format === "festival" ? "/ics/festival-2027.ics" : "/ics/run-club.ics");
    a.dataset.icsEvent = next.id;
  }
  box.focus({ preventScroll: true });
  scrollTo(0, 0);
  showNudge("invite", box.querySelector('[data-nudge="invite"]'), next);
}

// ---------- Nudges (task 7.5, design D19): inline, dismissible, max one per visit ----------
const NUDGE_TEXT = {
  calendar: "Ist im Kalender! Wer kommt mit?",
  invite: "Bring deine +1 mit – zusammen läuft’s sich besser.",
  eventday: "Heute ist es so weit. Noch schnell jemandem schreiben?",
  after: "Danke fürs Dabeisein! Erzähl’s weiter – beim nächsten Mal mit +1?",
};
const seenKey = "bdd-nudge-seen";
let seenThisPage = false;
function nudgeSeen() {
  if (seenThisPage) return true;
  try { return sessionStorage.getItem(seenKey) === "1"; } catch { return false; }
}
function markSeen() {
  seenThisPage = true;
  try { sessionStorage.setItem(seenKey, "1"); } catch { /* storage unavailable: one per page view */ }
}

export function showNudge(kind, el, ev) {
  if (!el || !ev || nudgeSeen()) return;
  markSeen();
  el.innerHTML = "";
  const text = document.createElement("span");
  text.textContent = NUDGE_TEXT[kind];
  const share = Object.assign(document.createElement("button"), { type: "button", className: "btn btn--small btn--pink", textContent: "Sag’s weiter" });
  share.dataset.share = ev.id;
  const dismiss = Object.assign(document.createElement("button"), { type: "button", className: "nudge__close", textContent: "×" });
  dismiss.setAttribute("aria-label", "Hinweis schließen");
  dismiss.addEventListener("click", () => { el.hidden = true; });
  el.append(text, share, dismiss);
  el.hidden = false;
}

document.addEventListener("calendar:added", (e) => {
  const src = e.detail?.source;
  const host = src?.closest(".card, .hero, .sheet__body, .invite, section");
  const el = host?.querySelector('[data-nudge]');
  const ev = e.detail?.eventId && findEvent(e.detail.eventId, now());
  showNudge("calendar", el, ev && !ev.cancelled ? ev : nextOf(ev?.format, now()));
});

function dayNudges() {
  const scope = document.querySelector(".hero [data-event-scope], [data-event-scope].hero, #als-naechstes");
  if (!scope) return;
  const r = resolveScope(scope.dataset.eventScope, now());
  const el = scope.querySelector("[data-nudge]");
  if (r.state === "upcoming" && relativeLabel(r.event, now()).kind === "today") showNudge("eventday", el, r.event);
  else if (r.state === "after" && r.next) showNudge("after", el, r.next);
}

inviteLanding();
dayNudges();
