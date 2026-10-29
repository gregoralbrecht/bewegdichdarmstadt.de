import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, hexTokens, surfaceTokens } from "../lib/contrast";
import { surfaces, tagColors } from "../lib/palette";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
const hexes = hexTokens(css);
const parsed = surfaceTokens(css, hexes);

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

    // A button filled with its line color would merge with its own border and shadow.
    it("fills --accent with a color other than --line", () => {
      expect(role(surface, "accent")).not.toBe(role(surface, "line"));
    });
  });
});

describe("tag palette", () => {
  it.each(tagColors)("ink on --$token passes WCAG AA", ({ token }) => {
    const hex = hexes.get(token);
    if (!hex) throw new Error(`--${token} has no hex value in tokens.css`);
    expect(contrastRatio(hexes.get("ink")!, hex)).toBeGreaterThanOrEqual(4.5);
  });
});
