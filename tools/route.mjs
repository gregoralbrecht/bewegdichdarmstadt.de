// Turns source/route.gpx into a stylised inline SVG and writes it into the Run & Rave page (design D12).
// Run: node tools/route.mjs
import { readFileSync, writeFileSync } from "node:fs";

const gpx = readFileSync(new URL("../source/route.gpx", import.meta.url), "utf8");
const pts = [...gpx.matchAll(/lat="([\d.]+)" lon="([\d.]+)"/g)].map((m) => [+m[1], +m[2]]);

// Equirectangular projection (fine at city scale), metres.
const lat0 = pts.reduce((s, p) => s + p[0], 0) / pts.length;
const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 110540;
const proj = ([la, lo]) => [lo * kx, -la * ky];

// Landmarks (approximate positions, labels only).
const LANDMARKS = [
  { name: "Friedensplatz", ll: [49.87338, 8.65377], start: true },
  { name: "Luisenplatz", ll: [49.87258, 8.65108], side: "left" },
  { name: "Herrngarten", ll: [49.87900, 8.65450], area: true },
];

// Ramer–Douglas–Peucker simplification (metres).
function rdp(points, eps) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let maxD = 0, idx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    // closed loop (a == b): fall back to the distance from a
    const d = len < 1e-9
      ? Math.hypot(p[0] - a[0], p[1] - a[1])
      : Math.abs((b[1] - a[1]) * p[0] - (b[0] - a[0]) * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= eps) return [a, b];
  return [...rdp(points.slice(0, idx + 1), eps).slice(0, -1), ...rdp(points.slice(idx), eps)];
}

const P = pts.map(proj);
const simp = rdp(P, 3);
const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const SIZE = 600, PAD = 70;
const scale = (SIZE - PAD * 2) / Math.max(maxX - minX, maxY - minY);
const ox = (SIZE - (maxX - minX) * scale) / 2, oy = (SIZE - (maxY - minY) * scale) / 2;
const toSvg = ([x, y]) => [+((x - minX) * scale + ox).toFixed(1), +((y - minY) * scale + oy).toFixed(1)];

const d = simp.map(toSvg).map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
let length = 0;
for (let i = 1; i < P.length; i++) length += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);

const marks = LANDMARKS.map((l) => {
  const [x, y] = toSvg(proj(l.ll));
  if (l.start) {
    return `<g class="route__start" transform="translate(${x} ${y})"><circle r="26" class="route__start-ring"/><use href="#smiley" x="-18" y="-18" width="36" height="36"/><text x="34" y="6">Start &amp; Ziel: ${l.name}</text></g>`;
  }
  if (l.area) return `<text class="route__area" x="${x}" y="${y}" text-anchor="middle">${l.name}</text>`;
  const left = l.side === "left";
  return `<g class="route__mark" transform="translate(${x} ${y})"><circle r="7"/><text x="${left ? -14 : 14}" y="26" text-anchor="${left ? "end" : "start"}">${l.name}</text></g>`;
}).join("\n      ");

const svg = `<svg class="route__svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-labelledby="route-svg-title">
      <title id="route-svg-title">Karte der Run &amp; Rave Route: eine Runde von ca. ${(length / 1000).toFixed(1).replace(".", ",")} km ab Friedensplatz, vorbei am Luisenplatz und rund um den Herrngarten</title>
      <path class="route__glow" d="${d}"/>
      <path class="route__line" d="${d}" pathLength="1"/>
      ${marks}
    </svg>`;

const page = new URL("../site/run-and-rave/index.html", import.meta.url);
const html = readFileSync(page, "utf8");
const out = html.replace(/<figure class="route" data-route>[\s\S]*?<\/figure>/, `<figure class="route" data-route>\n      <div class="route__map" data-route-map>\n    ${svg}\n    </div>\n      <figcaption>ca. ${(length / 1000).toFixed(1).replace(".", ",")} km · Runde ab Friedensplatz · <a href="https://www.komoot.com/de-de/tour/3332742205" rel="noopener">Route auf Komoot</a></figcaption>\n    </figure>`);
if (!/<figure class="route" data-route>/.test(html)) throw new Error("route figure not found");
writeFileSync(page, out);
console.log(`route: ${pts.length} → ${simp.length} points, ${(length / 1000).toFixed(2)} km, ${d.length} bytes path`);
