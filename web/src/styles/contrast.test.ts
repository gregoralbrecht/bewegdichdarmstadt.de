import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, hexTokens, surfaceTokens } from "../lib/contrast";
import { surfaces, tagColors } from "../lib/palette";
import { waveImage } from "../lib/wave";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
const hexes = hexTokens(css);
const parsed = surfaceTokens(css, hexes);
// The `--wave-<primitive>: url(…)` images, by primitive name.
const waves = new Map(
  [...css.matchAll(/--wave-([\w-]+):\s*(url\([^;]+\))\s*;/g)].map(
    ([, name, image]) => [name!, image!],
  ),
);

const roles = [
  "bg",
  "fg",
  "muted",
  "line",
  "pop",
  "accent",
  "on-accent",
  "link",
  "focus",
  "hero-1",
  "hero-2",
  "hero-ink",
];

// A transparent edge lets the hero's layers go flat on dark surfaces; no other role may vanish.
const mayBeTransparent = new Set(["hero-ink"]);

// The surfaces spec: text at 4.5 against its background, shapes and focus at 3 against the surface.
const checks = [
  { text: "fg", on: "bg", min: 4.5 },
  { text: "muted", on: "bg", min: 4.5 },
  { text: "link", on: "bg", min: 4.5 },
  { text: "on-accent", on: "accent", min: 4.5 },
  { text: "line", on: "bg", min: 3 },
  { text: "focus", on: "bg", min: 3 },
];

function role(surface: string, name: string): string {
  const value = parsed.get(surface)?.get(name);
  if (!value) throw new Error(`[data-surface="${surface}"] has no --${name}`);
  if (value === "transparent" && mayBeTransparent.has(name)) return value;
  // A role may point at another role of the same surface, like `--hero-ink: var(--line)`.
  const ref = /^var\(--([\w-]+)\)$/.exec(value);
  if (ref && roles.includes(ref[1]!)) return role(surface, ref[1]!);
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`--${name} on ${surface} is ${value}, not a hex primitive`);
  }
  return value;
}

describe("surfaces", () => {
  it("tokens.css declares exactly the listed surfaces", () => {
    expect([...parsed.keys()].sort()).toEqual([...surfaces].sort());
  });

  describe.each(surfaces)("%s", (surface) => {
    it.each(roles)("declares --%s", (name) => {
      expect(role(surface, name)).toBeTruthy();
    });

    it.each(checks)("$text on $on reaches $min", ({ text, on, min }) => {
      expect(
        contrastRatio(role(surface, text), role(surface, on)),
      ).toBeGreaterThanOrEqual(min);
    });

    // The link underline is the surface's line, so it reads like every other line on it.
    it("points --wave at the wave in its --line", () => {
      const ref = /^var\(--wave-([\w-]+)\)$/.exec(
        parsed.get(surface)?.get("wave") ?? "",
      );
      if (!ref) throw new Error(`--wave on ${surface} is not var(--wave-…)`);
      expect(waves.get(ref[1]!)).toBe(waveImage(role(surface, "line")));
    });

    // A button filled with its line color would merge with its own border and shadow.
    it("fills --accent with a color other than --line", () => {
      expect(role(surface, "accent")).not.toBe(role(surface, "line"));
    });
  });
});

describe("waves", () => {
  it("declares at least one", () => {
    expect(waves.size).toBeGreaterThan(0);
  });

  // The Wave story tunes waveImage()'s defaults; tokens.css must carry the result.
  it.each([...waves])(
    "--wave-%s is waveImage() with the defaults",
    (name, image) => {
      const hex = hexes.get(name);
      if (!hex) throw new Error(`--wave-${name} names no hex primitive`);
      expect(image).toBe(waveImage(hex));
    },
  );
});

describe("tag palette", () => {
  it.each(tagColors)("ink on --$token passes WCAG AA", ({ token }) => {
    const hex = hexes.get(token);
    if (!hex) throw new Error(`--${token} has no hex value in tokens.css`);
    expect(contrastRatio(hexes.get("ink")!, hex)).toBeGreaterThanOrEqual(4.5);
  });
});
