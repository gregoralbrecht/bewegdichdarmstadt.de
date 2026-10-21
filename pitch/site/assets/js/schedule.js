// Event data and pure date logic (design D2/D3). Imported by the browser and by tests/*.test.mjs.
// All wall-clock times are Europe/Berlin. Every function that depends on time takes `now` (ms).

// ---------- Data ----------

export const PLACES = {
  friedensplatz: {
    name: "Friedensplatz",
    city: "Darmstadt",
    lat: 49.87338,
    lng: 8.65377,
    // Exact spot not confirmed yet → shown as a marked placeholder (event-quick-info spec).
    spot: null,
    spotPlaceholder: "genauer Treffpunkt folgt",
    photo: "friedensplatz",
  },
  menschenskinder: {
    name: "Menschenskinder",
    city: "Darmstadt-Kranichstein",
    query: "Menschenskinder Darmstadt-Kranichstein",
    spot: null,
    spotPlaceholder: "Lageplan folgt",
    photo: null,
  },
};

export const FORMATS = {
  runrave: { title: "Run & Rave", page: "/run-and-rave/", durationMin: 90, place: "friedensplatz", instagramFallback: true },
  runclub: { title: "Run Club", page: "/#run-club", durationMin: 60, place: "friedensplatz" },
  festival: { title: "Beweg dich, Darmstadt Festival", page: "/festival-2027/", place: "menschenskinder" },
};

// Hand-maintained Run & Rave dates (past ones are kept for the gallery and invite fallbacks).
export const RUNRAVE_DATES = ["2026-07-10T17:30", "2026-08-20T17:30", "2026-09-24T17:30", "2026-10-30T17:30"];

// Run Club: every 2nd Friday of the month, 17:30.
export const RUNCLUB_RULE = { weekday: 5, nth: 2, time: "17:30", firstMonth: "2026-01" };

export const FESTIVAL = { start: "2027-09-11T14:00", end: "2027-09-11T18:00" };

// Short notes shown with a specific date.
export const NOTES = {
  "runrave-2026-10-30": "Letzte Runde für 2026",
};

// Cancellations by event id → reason.
export const CANCELLED = {
  "runclub-2026-10-09": "fällt leider aus",
};

export const INSTAGRAM = "https://www.instagram.com/bewegdichdarmstadt/";
export const KOMOOT = "https://www.komoot.com/de-de/tour/3332742205";

// ---------- Europe/Berlin time helpers ----------

const TZ = "Europe/Berlin";
const partsFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, hourCycle: "h23",
  year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric",
});

/** Berlin wall-clock parts for an instant. */
export function berlinParts(ms) {
  const p = Object.fromEntries(partsFmt.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const y = +p.year, m = +p.month, d = +p.day;
  return { y, m, d, hh: +p.hour, mm: +p.minute, ss: +p.second, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}

function offsetMin(ms) {
  const p = berlinParts(ms);
  return (Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm, p.ss) - Math.floor(ms / 1000) * 1000) / 60000;
}

/** "2026-10-30T17:30" (Berlin) → instant in ms. */
export function wallToMs(wall) {
  const [date, time = "00:00"] = wall.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const asUtc = Date.UTC(y, m - 1, d, hh, mm);
  let t = asUtc - offsetMin(asUtc) * 60000;
  const o2 = offsetMin(t);
  if (asUtc - o2 * 60000 !== t) t = asUtc - o2 * 60000;
  return t;
}

/** Berlin calendar day index (days since 1970-01-01) for an instant. */
export function dayIndex(ms) {
  const p = berlinParts(ms);
  return Date.UTC(p.y, p.m - 1, p.d) / 86400000;
}

/** Parses a demo clock value like "2026-10-30T15:17" (Berlin). Returns ms or null (design D5). */
export function parseJetzt(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(value)) return null;
  return wallToMs(value.includes("T") ? value : value + "T12:00");
}

const pad = (n) => String(n).padStart(2, "0");

export const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
export const WEEKDAYS_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
export const MONTHS_SHORT = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
export const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

export function formatTime(ms) {
  const p = berlinParts(ms);
  return `${pad(p.hh)}:${pad(p.mm)}`;
}

/** "Fr, 13. Nov" (+ year if `withYear`). */
export function formatDate(ms, { withYear = false } = {}) {
  const p = berlinParts(ms);
  return `${WEEKDAYS_SHORT[p.weekday]}, ${p.d}. ${MONTHS_SHORT[p.m - 1]}${withYear ? " " + p.y : ""}`;
}

/** "Freitag, 30. Oktober 2026" */
export function formatDateLong(ms) {
  const p = berlinParts(ms);
  return `${WEEKDAYS[p.weekday]}, ${p.d}. ${MONTHS[p.m - 1]} ${p.y}`;
}

/** ISO 8601 with Berlin offset, for <time datetime>. */
export function isoBerlin(ms) {
  const p = berlinParts(ms);
  const o = offsetMin(ms);
  const sign = o >= 0 ? "+" : "-";
  return `${p.y}-${pad(p.m)}-${pad(p.d)}T${pad(p.hh)}:${pad(p.mm)}${sign}${pad(Math.floor(Math.abs(o) / 60))}:${pad(Math.abs(o) % 60)}`;
}

// ---------- Events ----------

function makeEvent(format, startWall, endWall) {
  const f = FORMATS[format];
  const start = wallToMs(startWall);
  const end = endWall ? wallToMs(endWall) : start + f.durationMin * 60000;
  const id = `${format}-${startWall.slice(0, 10)}`;
  return {
    id, format, title: f.title, page: f.page,
    wall: startWall, start, end,
    place: PLACES[f.place], placeKey: f.place,
    cancelled: id in CANCELLED, reason: CANCELLED[id] || null,
    note: NOTES[id] || null,
  };
}

/** Day of the month of the nth given weekday (0=Sun … 6=Sat). */
export function nthWeekday(y, m, weekday, nth) {
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  return 1 + ((weekday - first + 7) % 7) + (nth - 1) * 7;
}

/** Run Club events for `months` months starting with the month before `now`. */
export function runClubEvents(now, months = 14) {
  const p = berlinParts(now);
  const out = [];
  let y = p.y, m = p.m - 1;
  if (m < 1) { m = 12; y -= 1; }
  for (let i = 0; i < months; i++) {
    const key = `${y}-${pad(m)}`;
    if (key >= RUNCLUB_RULE.firstMonth) {
      const d = nthWeekday(y, m, RUNCLUB_RULE.weekday, RUNCLUB_RULE.nth);
      out.push(makeEvent("runclub", `${key}-${pad(d)}T${RUNCLUB_RULE.time}`));
    }
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return out;
}

/** Every known event around `now`, sorted by start. */
export function allEvents(now) {
  return [
    ...RUNRAVE_DATES.map((w) => makeEvent("runrave", w)),
    ...runClubEvents(now),
    makeEvent("festival", FESTIVAL.start, FESTIVAL.end),
  ].sort((a, b) => a.start - b.start);
}

export function findEvent(id, now) {
  return allEvents(now).find((e) => e.id === id) || null;
}

/** Events that have not ended yet (cancelled ones included, flagged), sorted by start. */
export function upcoming(now, { format } = {}) {
  return allEvents(now).filter((e) => now < e.end && (!format || e.format === format));
}

/** Next non-cancelled event of a format (or any format), or null. */
export function nextOf(format, now) {
  return upcoming(now, { format }).find((e) => !e.cancelled) || null;
}

/** 'upcoming' | 'live' | 'after' (rest of the event's day) | 'past' */
export function state(event, now) {
  if (now < event.start) return "upcoming";
  if (now < event.end) return "live";
  if (dayIndex(now) === dayIndex(event.end)) return "after";
  return "past";
}

/** Events that just ended today (for the thank-you state). */
export function justEnded(now, { format } = {}) {
  return allEvents(now).filter((e) => (!format || e.format === format) && !e.cancelled && state(e, now) === "after");
}

function countdown(ms) {
  const totalMin = Math.max(0, Math.ceil(ms / 60000));
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return h > 0 ? `in ${h} h ${m} min` : `in ${m} min`;
}

/**
 * Relative label (event-schedule spec). Returns { kind, day, detail, text }:
 *   live      → "Läuft gerade"
 *   today     → "HEUTE · in 2 h 13 min"
 *   tomorrow  → "MORGEN · 17:30"
 *   weekday   → "Freitag · 17:30"           (2–6 days)
 *   days      → "in 9 Tagen · 17:30"        (7–14 days)
 *   date      → "Fr, 13. Nov · 17:30"       (> 14 days; year added if different)
 */
export function relativeLabel(event, now) {
  const st = state(event, now);
  const time = formatTime(event.start);
  if (st === "live") return { kind: "live", day: "Läuft gerade", detail: "", text: "Läuft gerade" };
  if (st !== "upcoming") return { kind: "past", day: formatDate(event.start, { withYear: true }), detail: time, text: `${formatDate(event.start, { withYear: true })} · ${time}` };
  const diff = dayIndex(event.start) - dayIndex(now);
  let kind, day, detail = time;
  if (diff === 0) { kind = "today"; day = "HEUTE"; detail = countdown(event.start - now); }
  else if (diff === 1) { kind = "tomorrow"; day = "MORGEN"; }
  else if (diff <= 6) { kind = "weekday"; day = WEEKDAYS[berlinParts(event.start).weekday]; }
  else if (diff <= 14) { kind = "days"; day = `in ${diff} Tagen`; }
  else {
    kind = "date";
    day = formatDate(event.start, { withYear: berlinParts(event.start).y !== berlinParts(now).y });
  }
  return { kind, day, detail, text: `${day} · ${detail}` };
}

/** Days until an event's Berlin calendar day. */
export function daysUntil(event, now) {
  return dayIndex(event.start) - dayIndex(now);
}

// ---------- Maps ----------

/** Walking directions link (event-quick-info spec, design D16). */
export function directionsUrl(place, { apple = false } = {}) {
  const dest = place.lat ? `${place.lat},${place.lng}` : encodeURIComponent(place.query || `${place.name}, ${place.city}`);
  return apple
    ? `https://maps.apple.com/?daddr=${dest}&dirflg=w`
    : `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
}

// ---------- iCalendar (design D6) ----------

const VTIMEZONE = [
  "BEGIN:VTIMEZONE", "TZID:Europe/Berlin",
  "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0200", "TZNAME:CEST", "DTSTART:19700329T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
  "BEGIN:STANDARD", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "TZNAME:CET", "DTSTART:19701025T030000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
  "END:VTIMEZONE",
];

const icsEscape = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

function icsLocal(ms) {
  const p = berlinParts(ms);
  return `${p.y}${pad(p.m)}${pad(p.d)}T${pad(p.hh)}${pad(p.mm)}00`;
}
function icsUtc(ms) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Folds a content line to max 75 octets (RFC 5545 §3.1). */
export function foldLine(line) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out = [];
  let cur = "", curLen = 0, limit = 75;
  for (const ch of line) {
    const len = new TextEncoder().encode(ch).length;
    if (curLen + len > limit) { out.push(cur); cur = ""; curLen = 0; limit = 74; }
    cur += ch; curLen += len;
  }
  out.push(cur);
  return out.join("\r\n ");
}

const DESCRIPTIONS = {
  runrave: "Gemeinsam ca. 5,5 km durch Darmstadt – mit Musik\\, im entspannten Tempo (ca. 7:30 min/km). Laufen\\, biken oder tanzen. Kostenlos. Komm\\, wie du bist.",
  runclub: "Run Club von Beweg dich\\, Darmstadt: Warm-up\\, lockere Runde (ca. 5–7 km)\\, verschiedene Tempos – niemand läuft allein. Kostenlos.",
  festival: "Yoga\\, Training\\, Bewegungsangebote\\, Food\\, Drinks und gute Stimmung – für große und kleine Menschen. Kostenlos\\, Spenden willkommen.",
};

/**
 * iCalendar text for an event. Options: base (site origin for URL), now (DTSTAMP), recurring (Run Club RRULE).
 */
export function toICS(event, { base = "https://example.invalid", now = Date.now(), recurring = false } = {}) {
  const place = event.place;
  const location = `${place.name}, ${place.city}`;
  const url = base + event.page;
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Beweg dich Darmstadt//Entwurf//DE", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    ...VTIMEZONE,
    "BEGIN:VEVENT",
    `UID:${recurring ? "runclub-recurring" : event.id}@bewegdichdarmstadt.de`,
    `DTSTAMP:${icsUtc(now)}`,
    `DTSTART;TZID=Europe/Berlin:${icsLocal(event.start)}`,
    `DTEND;TZID=Europe/Berlin:${icsLocal(event.end)}`,
    ...(recurring ? ["RRULE:FREQ=MONTHLY;BYDAY=2FR"] : []),
    `SUMMARY:${icsEscape(event.format === "festival" ? `${event.title} ${berlinParts(event.start).y}` : `${event.title} · Beweg dich, Darmstadt`)}`,
    `LOCATION:${icsEscape(location)}`,
    ...(place.lat ? [`GEO:${place.lat};${place.lng}`] : []),
    `DESCRIPTION:${DESCRIPTIONS[event.format]}\\n\\n${icsEscape(url)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
