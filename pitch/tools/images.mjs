// Generates responsive AVIF/WebP variants from source/img into site/assets/img (design D11).
// Dev-only. Setup once: npm install --no-save sharp
// Run:            node tools/images.mjs
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const SRC = new URL("../source/img/", import.meta.url).pathname;
const OUT = new URL("../site/assets/img/", import.meta.url).pathname;
const WIDTHS = [480, 960, 1440];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const { name } = parse(file);
  const input = sharp(join(SRC, file)).rotate();
  const { width: srcW, height: srcH } = await input.metadata();
  for (const w of WIDTHS.filter((w, i) => w <= srcW || i === 0)) {
    const resized = input.clone().resize({ width: Math.min(w, srcW) });
    await resized.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: 74 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  const sizes = await Promise.all(
    WIDTHS.map((w) => stat(join(OUT, `${name}-${w}.avif`)).then((s) => `${w}:${Math.round(s.size / 1024)}KB`, () => null))
  );
  console.log(`${name} (${srcW}×${srcH}) → ${sizes.filter(Boolean).join(" ")}`);
}
