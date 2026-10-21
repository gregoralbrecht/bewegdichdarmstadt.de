// Short smiley confetti burst (design D18). Shared by share success, calendar success and easter eggs.
const COLORS = ["#25378d", "#f8971c", "#f29ac2", "#dcd8f0", "#b8326f"];

export function confetti({ x = innerWidth / 2, y = innerHeight / 2, count = 36 } = {}) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  c.className = "confetti";
  c.setAttribute("aria-hidden", "true");
  (document.querySelector("dialog[open]") || document.body).append(c); // dialogs live on the top layer
  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  const parts = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 7;
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, r: 7 + Math.random() * 9, c: COLORS[(Math.random() * COLORS.length) | 0], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 };
  });
  const start = performance.now();
  (function frame(t) {
    const p = (t - start) / 1100;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const s of parts) {
      s.vy += 0.32; s.x += s.vx; s.y += s.vy; s.vx *= 0.985; s.rot += s.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p * p);
      ctx.translate(s.x, s.y); ctx.rotate(s.rot);
      smiley(ctx, s.r, s.c);
      ctx.restore();
    }
    if (p < 1) requestAnimationFrame(frame); else c.remove();
  })(start);
}

export function smiley(ctx, r, color, feat = "#fff") {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = feat;
  ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.24, r * 0.13, r * 0.19, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(r * 0.3, -r * 0.24, r * 0.13, r * 0.19, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = feat; ctx.lineWidth = r * 0.18; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-r * 0.46, r * 0.14); ctx.quadraticCurveTo(0, r * 0.64, r * 0.46, r * 0.14); ctx.stroke();
}
