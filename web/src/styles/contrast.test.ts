import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio, hexTokens } from "../lib/contrast";
import { forbiddenPairs, swatches, type Pair } from "../lib/palette";

const hexes = hexTokens(
  readFileSync(new URL("./tokens.css", import.meta.url), "utf8"),
);

function hex(token: string): string {
  const value = hexes.get(token);
  if (!value) throw new Error(`--${token} has no hex value in tokens.css`);
  return value;
}

const ratio = ({ text, surface }: Pair) =>
  contrastRatio(hex(text), hex(surface));

describe("color contrast", () => {
  it.each(swatches.flatMap((s) => s.pairs))(
    "$text on $surface passes WCAG AA",
    (pair) => {
      expect(ratio(pair)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(forbiddenPairs)("$text on $surface fails WCAG AA", (pair) => {
    expect(ratio(pair)).toBeLessThan(4.5);
  });
});
