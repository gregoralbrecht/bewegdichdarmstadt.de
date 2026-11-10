import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CtaBand } from "./CtaBand";

const meta = {
  component: CtaBand,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Kostenlos für alle.",
    href: "#spenden",
    id: "spenden",
    action: "Jetzt spenden",
    children: (
      <>
        <p>Spenden helfen, die laufenden Kosten zu decken.</p>
        <p>Platzhalter: PayPal-Link folgt</p>
      </>
    ),
  },
} satisfies Meta<typeof CtaBand>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One h2 names the band, and the band holds exactly one button, never a hero. */
const namedByItsH2: Story["play"] = async ({ args, canvas }) => {
  await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  const region = canvas.getByRole("region", { name: args.title });
  const buttons = region.querySelectorAll(".button");
  await expect(buttons).toHaveLength(1);
  await expect(buttons[0]).toHaveAttribute("href", args.href);
  await expect(region.querySelector('[data-variant="hero"]')).toBeNull();
};

export const Pink: Story = { play: namedByItsH2 };

export const Cream: Story = { args: { surface: "cream" }, play: namedByItsH2 };

export const Orange: Story = {
  args: { surface: "orange" },
  play: namedByItsH2,
};

export const Night: Story = { args: { surface: "night" }, play: namedByItsH2 };
