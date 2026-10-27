import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Heading } from "../Heading/Heading";
import { Section } from "./Section";

const meta = {
  component: Section,
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <Section {...args} aria-labelledby="titel">
      <Heading level={2} id="titel">
        Run &amp; Rave
      </Heading>
      <p>
        Fünf Kilometer durch die Stadt, danach Musik.{" "}
        <a href="#programm">Zum Programm</a>
      </p>
    </Section>
  ),
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cream: Story = {
  args: { surface: "cream" },
  play: async ({ canvas }) => {
    const section = canvas.getByRole("region", { name: "Run & Rave" });
    await expect(section).toHaveAttribute("data-surface", "cream");
  },
};

export const White: Story = { args: { surface: "white" } };

export const Night: Story = {
  args: { surface: "night" },
  play: async ({ canvas }) => {
    const section = canvas.getByRole("region", { name: "Run & Rave" });
    // The surface sets the colors; nothing inside picks its own.
    await expect(getComputedStyle(section).backgroundColor).toBe(
      "rgb(20, 28, 77)",
    );
    await expect(getComputedStyle(canvas.getByRole("heading")).color).toBe(
      "rgb(255, 255, 255)",
    );
  },
};

export const Ink: Story = { args: { surface: "ink" } };

export const Orange: Story = { args: { surface: "orange" } };

export const Pink: Story = { args: { surface: "pink" } };

export const Violet: Story = { args: { surface: "violet" } };
