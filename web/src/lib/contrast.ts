/** Reads every `--name: #rrggbb;` declaration from a stylesheet. */
export function hexTokens(css: string): Map<string, string> {
  return new Map(
    [...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(
      ([, name, hex]) => [name!, hex!],
    ),
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two `#rrggbb` colors. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Reads every `[data-surface="name"] { … }` block from a stylesheet, as surface name to its
 * `--role: value` declarations. `var(--x)` values resolve through `hexes`; anything else is kept.
 */
export function surfaceTokens(
  css: string,
  hexes: Map<string, string>,
): Map<string, Map<string, string>> {
  const surfaces = new Map<string, Map<string, string>>();
  const uncommented = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, selector, body] of uncommented.matchAll(
    /([^{}]+)\{([^{}]*)\}/g,
  )) {
    const roles = new Map(
      [...body!.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => {
        const ref = /^var\(--([\w-]+)\)$/.exec(value!.trim());
        return [name!, (ref && hexes.get(ref[1]!)) ?? value!.trim()];
      }),
    );
    for (const [, name] of selector!.matchAll(/\[data-surface="([\w-]+)"\]/g)) {
      surfaces.set(name!, roles);
    }
  }
  return surfaces;
}
