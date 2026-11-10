import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";
import type { Surface } from "../../lib/palette";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Tag } from "../Tag/Tag";
import { Card, CardLink } from "./Card";

const meta = {
  component: Card,
  render: (args) => (
    <Card {...args} style={{ maxWidth: "22rem" }}>
      <Heading level={3}>Run &amp; Rave</Heading>
      <p>
        <time dateTime="2026-10-30T19:00">Freitag, 30. Oktober, 19 Uhr</time>
      </p>
      <p>
        Fünf Kilometer durch die Stadt, danach Musik.{" "}
        <a href="#programm">Zum Programm</a>
      </p>
      <Tag color="lime">Laufen</Tag>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Inside Prose, as on the pages, so plain links in a card get the wavy underline.
const on =
  (surface: Surface): Decorator =>
  (Story) => (
    <div data-surface={surface} style={{ padding: "var(--space-6)" }}>
      <Prose>
        <Story />
      </Prose>
    </div>
  );

// The shadow is the card's ::before, a layer behind the face that never moves.
const shadowColor = (card: HTMLElement) =>
  getComputedStyle(card, "::before").backgroundColor;

export const OnCream: Story = {
  decorators: [on("cream")],
  play: async ({ canvas }) => {
    const card = canvas.getByRole("article");
    await expect(shadowColor(card)).toBe("rgb(27, 26, 51)");
    // A plain link in the card's text gets Prose's wave.
    const link = canvas.getByRole("link", { name: "Zum Programm" });
    await expect(getComputedStyle(link).backgroundImage).toMatch(/^url\(/);
  },
};

export const OnNight: Story = {
  decorators: [on("night")],
  play: async ({ canvas }) => {
    const card = canvas.getByRole("article");
    await expect(shadowColor(card)).toBe("rgb(248, 151, 28)");
    // The body stays a white island with ink text. The white is a layer inside the border; under the
    // border the body is the frame color, so no white bleeds through a tilted edge.
    const body = card.firstElementChild!;
    await expect(getComputedStyle(body).backgroundImage).toMatch(
      /^linear-gradient\(rgb\(255, 255, 255\), rgb\(255, 255, 255\)\)/,
    );
    await expect(getComputedStyle(body).backgroundColor).toBe(
      "rgb(248, 151, 28)",
    );
    await expect(getComputedStyle(body).color).toBe("rgb(27, 26, 51)");
    // Its border still follows the night surface, like the shadow.
    await expect(getComputedStyle(body).borderTopColor).toBe(
      "rgb(248, 151, 28)",
    );
  },
};

export const FilledOnCream: Story = {
  args: { fill: "sky" },
  decorators: [on("cream")],
};

// A sticker card: tilted, with one heading link over the whole card and no other link inside.
const sticker =
  (title: ReactNode): Story["render"] =>
  (args) => (
    <Card {...args} style={{ maxWidth: "22rem" }}>
      <Heading level={3}>{title}</Heading>
      <p>
        <time dateTime="2026-10-30T19:00">Freitag, 30. Oktober, 19 Uhr</time>
      </p>
      <p>Fünf Kilometer durch die Stadt, danach Musik.</p>
    </Card>
  );

const runAndRave = sticker(
  <CardLink href="#run-and-rave">Run &amp; Rave</CardLink>,
);

// rotate(θ) computes to matrix(cos θ, sin θ, …); a tilt has a non-zero sin.
const isTilted = (card: HTMLElement) => {
  const [, sin] = new DOMMatrix(getComputedStyle(card).transform)
    .toFloat64Array()
    .slice(0, 2);
  return Math.abs(sin) > 0.01;
};

const linked: Story["play"] = async ({ canvas }) => {
  const card = canvas.getByRole("article");
  await expect(isTilted(card)).toBe(true);
  // A card you can click is a control: sharp, like a button.
  await expect(getComputedStyle(card).borderRadius).toBe("0px");
  const links = canvas.getAllByRole("link");
  await expect(links).toHaveLength(1);
  await expect(links[0]).toHaveAccessibleName(
    canvas.getByRole("heading").textContent!,
  );
  // A click on the text below the heading lands on the link.
  const { left, top, width, height } = card
    .querySelector("p:last-of-type")!
    .getBoundingClientRect();
  await expect(
    document.elementFromPoint(left + width / 2, top + height / 2),
  ).toBe(links[0]);
};

export const LinkedOnCream: Story = {
  args: { tilt: -2 },
  render: runAndRave,
  decorators: [on("cream")],
  play: linked,
};

export const LinkedOnNight: Story = {
  args: { tilt: -2 },
  render: runAndRave,
  decorators: [on("night")],
  play: linked,
};

export const TiltedWithoutLink: Story = {
  args: { tilt: 2 },
  render: sticker("Steffi Rieger"),
  decorators: [on("cream")],
  play: async ({ canvas }) => {
    const card = canvas.getByRole("article");
    await expect(isTilted(card)).toBe(true);
    await expect(getComputedStyle(card).borderRadius).not.toBe("0px");
    await expect(canvas.queryAllByRole("link")).toHaveLength(0);
  },
};
