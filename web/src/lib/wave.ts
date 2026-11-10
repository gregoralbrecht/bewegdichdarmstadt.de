export type WaveOptions = {
  /** Line width in viewBox units; the tile is 20 by 8. */
  stroke: number;
  /** How far the wave swings from its middle, from 0 (straight) to 1 (full). */
  amplitude: number;
};

/** The shipped wave. tokens.css holds waveImage() of each line color with these; contrast.test.ts
    checks they match. */
export const waveDefaults: WaveOptions = { stroke: 2.9, amplitude: 1 };

/**
 * One period of the link underline's wave in `color`, as a CSS `url()` to tile with `repeat-x`.
 * The tile stretches to the background size, so a period is exactly one tile and rolls seamlessly.
 */
export function waveImage(
  color: string,
  { stroke, amplitude }: WaveOptions = waveDefaults,
): string {
  // The control point sits 4 above the middle at full amplitude; `T` mirrors it below.
  const peak = +(4 - 4 * amplitude).toFixed(3);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 8' preserveAspectRatio='none'>` +
    `<path d='M0 4Q5 ${peak} 10 4T20 4' fill='none' stroke='${color}' stroke-width='${stroke}'/>` +
    `</svg>`;
  // Single quotes inside, double outside; only the characters a data URL can't hold get escaped.
  return `url("data:image/svg+xml,${svg.replace(/[%#<>]/g, encodeURIComponent)}")`;
}
