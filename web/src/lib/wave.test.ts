import { describe, expect, it } from "vitest";
import { waveDefaults, waveImage } from "./wave";

const decode = (image: string) =>
  decodeURIComponent(/^url\("data:image\/svg\+xml,(.*)"\)$/.exec(image)![1]!);

describe("waveImage", () => {
  it("encodes the wave as a data URL CSS can hold", () => {
    const image = waveImage("#1b1a33");
    expect(image).toMatch(/^url\("data:image\/svg\+xml,%3Csvg /);
    // `#` would end the URL, and `;`, braces or a double quote would end the declaration.
    expect(image.slice(5, -2)).not.toMatch(/[#<>";{}]/);
  });

  it("draws one period in the color, with the default stroke and full amplitude", () => {
    const svg = decode(waveImage("#f8971c"));
    expect(svg).toContain("viewBox='0 0 20 8'");
    expect(svg).toContain("d='M0 4Q5 0 10 4T20 4'");
    expect(svg).toContain("stroke='#f8971c'");
    expect(svg).toContain(`stroke-width='${waveDefaults.stroke}'`);
  });

  it("scales the swing with the amplitude", () => {
    const svg = decode(waveImage("#1b1a33", { stroke: 2, amplitude: 0.5 }));
    expect(svg).toContain("d='M0 4Q5 2 10 4T20 4'");
    expect(svg).toContain("stroke-width='2'");
  });
});
