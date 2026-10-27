import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import type { Surface } from "../../lib/palette";
import { Heading } from "../Heading/Heading";
import { Tag } from "../Tag/Tag";
import { Card } from "./Card";

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

const on =
  (surface: Surface): Decorator =>
  (Story) => (
    <div data-surface={surface} style={{ padding: "var(--space-6)" }}>
      <Story />
    </div>
  );

const shadowColor = (card: HTMLElement) =>
  getComputedStyle(card).boxShadow.match(/^rgb\([^)]*\)/)?.[0];

export const OnCream: Story = {
  decorators: [on("cream")],
  play: async ({ canvas }) => {
    const card = canvas.getByRole("article");
    await expect(shadowColor(card)).toBe("rgb(27, 26, 51)");
  },
};

export const OnNight: Story = {
  decorators: [on("night")],
  play: async ({ canvas }) => {
    const card = canvas.getByRole("article");
    await expect(shadowColor(card)).toBe("rgb(248, 151, 28)");
    // The body stays a white island with ink text.
    const body = card.firstElementChild!;
    await expect(getComputedStyle(body).backgroundColor).toBe(
      "rgb(255, 255, 255)",
    );
    await expect(getComputedStyle(body).color).toBe("rgb(27, 26, 51)");
  },
};

export const FilledOnCream: Story = {
  args: { fill: "sky" },
  decorators: [on("cream")],
};
