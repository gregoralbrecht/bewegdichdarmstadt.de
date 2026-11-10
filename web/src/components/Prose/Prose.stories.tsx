import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect } from "storybook/test";
import { hexTokens, surfaceTokens } from "../../lib/contrast";
import { surfaces, type Surface } from "../../lib/palette";
import { waveDefaults, waveImage } from "../../lib/wave";
import tokensCss from "../../styles/tokens.css?raw";
import { Heading } from "../Heading/Heading";
import { Section } from "../Section/Section";
import { Prose } from "./Prose";

const meta = {
  component: Prose,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

const lines = new Map(
  [...surfaceTokens(tokensCss, hexTokens(tokensCss))].map(
    ([surface, roles]) => [surface as Surface, roles.get("line")!],
  ),
);

const sample = (
  <>
    <Heading level={2} id="titel">
      Run &amp; Rave
    </Heading>
    <p>
      Wir laufen gemeinsam durch die Stadt, mit Musik und in entspanntem Tempo.{" "}
      <a href="#treffpunkt">Zum Treffpunkt</a>
    </p>
    <p>
      Du musst nicht schnell sein, und du musst nicht mal laufen: Mit dem Rad
      dabei sein geht, unterwegs abkürzen auch. Wer mehr wissen will, findet{" "}
      <a href="#ablauf">
        alles über den Ablauf, die Strecke und die Musik auf der Seite zum Run
        &amp; Rave
      </a>
      , und wer Fragen hat, schreibt uns einfach.
    </p>
    <ul>
      <li>Treffpunkt: Friedensplatz</li>
      <li>Mit dem Rad dabei sein: geht</li>
      <li>Teilnahme: kostenlos</li>
    </ul>
    <ol>
      <li>Ankommen</li>
      <li>Loslaufen</li>
      <li>Mitfeiern</li>
    </ol>
  </>
);

const onSurface = (surface: Surface): Story => ({
  render: () => (
    <Section surface={surface} aria-labelledby="titel">
      <Prose>{sample}</Prose>
    </Section>
  ),
  play: async ({ canvas, canvasElement }) => {
    // The underline is the surface's own wave, compared as the browser serializes it.
    const probe = document.createElement("span");
    probe.style.backgroundImage = waveImage(lines.get(surface)!);
    canvasElement.append(probe);
    const wave = getComputedStyle(probe).backgroundImage;
    probe.remove();
    for (const link of canvas.getAllByRole("link")) {
      await expect(getComputedStyle(link).backgroundImage).toBe(wave);
      await expect(getComputedStyle(link).textDecorationLine).toBe("none");
    }

    // No line runs past about 70 characters, however wide the window.
    const long = canvasElement.querySelectorAll("p")[1]!;
    const zero = document.createElement("span");
    zero.textContent = "0";
    long.append(zero);
    const ch = zero.getBoundingClientRect().width;
    zero.remove();
    await expect(long.getBoundingClientRect().width).toBeLessThanOrEqual(
      70 * ch,
    );

    for (const item of canvas.getAllByRole("listitem")) {
      await expect(getComputedStyle(item).listStyleType).not.toBe("none");
    }
  },
});

export const Cream = onSurface("cream");

export const Night = onSurface("night");

export const Pink = onSurface("pink");

/** Vitest's real browser, or null in Storybook, whose userEvent can't trigger :hover or emulate media. */
const realBrowser = async () =>
  "__vitest_browser__" in globalThis ? import("vitest/browser") : null;

/** Hover rolls the wave; with reduced motion it turns into a still, straight line instead. */
export const Hover: Story = {
  render: () => (
    <Section surface="cream" aria-labelledby="titel">
      <Prose>
        <Heading level={2} id="titel">
          Hover
        </Heading>
        <p>
          Mehr dazu <a href="#mehr">auf der Seite zum Run &amp; Rave</a>.
        </p>
      </Prose>
    </Section>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link");
    const browser = await realBrowser();
    if (!browser) return;
    const reducedMotion = (value: "reduce" | "no-preference") =>
      browser.cdp().send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value }],
      });
    try {
      await browser.userEvent.hover(link);
      await expect(getComputedStyle(link).animationName).toBe(
        "prose-wave-roll",
      );
      await expect(getComputedStyle(link).animationIterationCount).toBe(
        "infinite",
      );

      await reducedMotion("reduce");
      await expect(getComputedStyle(link).animationName).toBe("none");
      await expect(getComputedStyle(link).backgroundImage).toMatch(
        /^linear-gradient\(/,
      );
    } finally {
      await browser.userEvent.unhover(link);
      await reducedMotion("no-preference");
    }
  },
};

type WaveArgs = {
  stroke: number;
  amplitude: number;
  length: number;
  height: number;
  gap: number;
  speed: number;
  line: number;
  surface: Surface;
  pinHover: boolean;
};

// Story-only: the hover state from Prose.css, held without a pointer. Never ship this class.
const pinnedHover = `
.wave-story-pinned a:not([class]) {
  animation: prose-wave-roll var(--wave-speed) linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .wave-story-pinned a:not([class]) {
    animation: none;
    background: linear-gradient(var(--line), var(--line)) left 0 bottom
      calc((var(--wave-height) - var(--wave-line)) / 2) / 100% var(--wave-line) no-repeat;
  }
}`;

const range = (min: number, max: number, step: number) => ({
  control: { type: "range" as const, min, max, step },
});

/**
 * Tunes the link underline live. Copy the snippet below the sample into wave.ts, tokens.css and
 * Prose.css; contrast.test.ts fails until tokens.css matches wave.ts.
 */
export const Wave: StoryObj<WaveArgs> = {
  args: {
    stroke: waveDefaults.stroke,
    amplitude: waveDefaults.amplitude,
    length: 0.62,
    height: 0.25,
    gap: 0.32,
    speed: 0.5,
    line: 0.09,
    surface: "cream",
    pinHover: false,
  },
  argTypes: {
    stroke: { name: "stroke (viewBox units)", ...range(0.5, 4, 0.1) },
    amplitude: range(0, 1, 0.05),
    length: { name: "--wave-length (em)", ...range(0.2, 2, 0.01) },
    height: { name: "--wave-height (em)", ...range(0.05, 1, 0.01) },
    gap: { name: "--wave-gap (em)", ...range(0, 1, 0.01) },
    speed: { name: "--wave-speed (s per period)", ...range(0.1, 3, 0.05) },
    line: { name: "--wave-line (em)", ...range(0.02, 0.3, 0.01) },
    surface: { control: "select", options: surfaces },
    pinHover: { name: "pin hover" },
  },
  render: ({
    stroke,
    amplitude,
    length,
    height,
    gap,
    speed,
    line,
    surface,
    pinHover,
  }) => {
    const knobs = { stroke, amplitude };
    const geometry = {
      "--wave-length": `${length}em`,
      "--wave-height": `${height}em`,
      "--wave-gap": `${gap}em`,
      "--wave-speed": `${speed}s`,
      "--wave-line": `${line}em`,
    };
    const hexes = hexTokens(tokensCss);
    const waves = [...new Set(lines.values())].map((hex) => {
      const name = [...hexes].find(([, value]) => value === hex)![0];
      return `--wave-${name}: ${waveImage(hex, knobs)};`;
    });
    const snippet = [
      "/* wave.ts */",
      `export const waveDefaults: WaveOptions = { stroke: ${stroke}, amplitude: ${amplitude} };`,
      "",
      "/* tokens.css, in :root */",
      ...waves,
      "",
      "/* Prose.css, in .prose */",
      ...Object.entries(geometry).map(([name, value]) => `${name}: ${value};`),
    ].join("\n");
    return (
      <Section surface={surface} aria-labelledby="titel">
        <style>{pinnedHover}</style>
        <Prose
          className={pinHover ? "prose wave-story-pinned" : "prose"}
          style={
            {
              ...geometry,
              "--wave": waveImage(lines.get(surface)!, knobs),
            } as CSSProperties
          }
        >
          <Heading level={2} id="titel">
            Wellenlinie
          </Heading>
          <p>
            Wir laufen gemeinsam durch die Stadt,{" "}
            <a href="#strecke">mit Musik und in entspanntem Tempo</a>. Wer
            mitmachen will, findet{" "}
            <a href="#ablauf">
              alles über den Ablauf, die Strecke und die Musik auf der Seite zum
              Run &amp; Rave
            </a>
            .
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              fontSize: "var(--step--1)",
            }}
          >
            <code>{snippet}</code>
          </pre>
        </Prose>
      </Section>
    );
  },
};
