import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";
import type { Surface } from "../../lib/palette";
import { Card, CardLink } from "../Card/Card";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import { CardGrid } from "./CardGrid";

const meta = {
  component: CardGrid,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Vitest's real browser, or null in Storybook, where the window sets the width. */
const realBrowser = async () =>
  "__vitest_browser__" in globalThis ? import("vitest/browser") : null;

/** Wide enough in Vitest for cards side by side; in Storybook the window decides. */
async function wide() {
  const browser = await realBrowser();
  await browser?.page.viewport(1280, 800);
}

type Entry = {
  title: string;
  href?: string;
  text: ReactNode;
  tilt?: 3;
};

const events: Entry[] = [
  {
    title: "Run & Rave",
    href: "#run-and-rave",
    text: "Die Runden für 2026 sind gelaufen. Neue Termine folgen 2027.",
  },
  {
    title: "Festival 2027",
    href: "#festival",
    text: "Samstag, 11. September 2027, 14 bis 18 Uhr, bei Menschenskinder in Darmstadt-Kranichstein.",
  },
  {
    title: "Festival 2025",
    href: "#festival-2025",
    text: "Auf dem Friedensplatz.",
  },
];

const team: Entry[] = [
  {
    title: "Steffi Rieger",
    text: "Yogalehrerin, Unternehmerin und Life & Team Coach",
  },
  {
    title: "Lea Emmel",
    text: "Gründerin von Outdoor Training Darmstadt und zertifizierte Trainerin",
  },
];

const grid = (entries: Entry[]) => (
  <CardGrid>
    {entries.map(({ title, href, text, tilt }) => (
      <li key={title}>
        <Card tilt={tilt}>
          <Heading level={3}>
            {href ? <CardLink href={href}>{title}</CardLink> : title}
          </Heading>
          <p>{text}</p>
        </Card>
      </li>
    ))}
  </CardGrid>
);

const inSection = (surface: Surface, entries: Entry[]) => (
  <Section surface={surface} aria-labelledby="karten">
    <Prose>
      <Heading level={2} id="karten">
        Karten
      </Heading>
      {grid(entries)}
    </Prose>
  </Section>
);

/** The grid's tilts in degrees, repeating every four cards. */
const cycle = [-2, 2, -3, 1];

// rotate(θ) computes to matrix(cos θ, sin θ, …).
const rotation = (card: HTMLElement) => {
  const { a, b } = new DOMMatrix(getComputedStyle(card).transform);
  return (Math.atan2(b, a) * 180) / Math.PI;
};

/** One list, one item per card in order, no bullets, neighbors tilted apart and cards two apart tilted
    differently, rows of equal height. */
const countedAndTilted =
  (entries: Entry[]): NonNullable<Story["play"]> =>
  async ({ canvas }) => {
    const list = canvas.getByRole("list");
    await expect(list.tagName).toBe("UL");
    await expect(list).toHaveAttribute("role", "list");
    await expect(getComputedStyle(list).listStyleType).toBe("none");
    const items = canvas.getAllByRole("listitem");
    await expect(
      items.map((item) => item.querySelector("h3")!.textContent),
    ).toEqual(entries.map(({ title }) => title));

    const cards = canvas.getAllByRole("article");
    const angles = cards.map(rotation);
    for (const [index, angle] of angles.entries()) {
      const { tilt } = entries[index];
      await expect(angle).toBeCloseTo(tilt ?? cycle[index % cycle.length]);
      if (tilt === undefined && index > 0) {
        await expect(Math.sign(angle)).toBe(-Math.sign(angles[index - 1]));
      }
      if (tilt === undefined && index > 1 && !entries[index - 2].tilt) {
        await expect(angle).not.toBeCloseTo(angles[index - 2]);
      }
    }

    // offsetTop and offsetHeight ignore the tilt, so cards in a row share both.
    for (const card of cards) {
      const row = cards.filter(
        (other) =>
          other.parentElement!.offsetTop === card.parentElement!.offsetTop,
      );
      await expect(row.map((other) => other.offsetHeight)).toEqual(
        row.map(() => card.offsetHeight),
      );
    }
  };

const on = (surface: Surface, entries: Entry[]): Story => ({
  render: () => inSection(surface, entries),
  play: async (context) => {
    await wide();
    await countedAndTilted(entries)(context);
  },
});

export const LinkedOnCream = on("cream", events);

export const UnlinkedOnNight = on("night", team);

/** An explicit tilt wins over the grid's; the card after it still turns the other way. */
export const ExplicitTilt = on(
  "cream",
  events.map((entry, index) => (index === 1 ? { ...entry, tilt: 3 } : entry)),
);

/** The phone case: a 320px viewport with 16px gutters stacks the cards in one column. */
export const At320: Story = {
  render: () => (
    <div
      data-surface="cream"
      data-testid="column"
      style={{ width: "320px", paddingInline: "16px" }}
    >
      <Prose>{grid(events)}</Prose>
    </div>
  ),
  play: async (context) => {
    await countedAndTilted(events)(context);
    const { canvas } = context;
    const column = canvas.getByTestId("column");
    const list = canvas.getByRole("list");
    await expect(column.scrollWidth).toBeLessThanOrEqual(column.clientWidth);
    // The grid box fits the frame; only the tilted cards' shadows reach into the gutter.
    await expect(list.offsetWidth).toBeLessThanOrEqual(column.clientWidth - 32);
    const lefts = new Set(
      canvas.getAllByRole("listitem").map((item) => item.offsetLeft),
    );
    await expect(lefts.size).toBe(1);
  },
};
