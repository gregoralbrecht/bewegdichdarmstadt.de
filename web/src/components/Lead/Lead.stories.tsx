import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import { Lead } from "./Lead";

const meta = {
  component: Lead,
  parameters: { layout: "fullscreen" },
  args: {
    children:
      "Wir gehen gemeinsam auf die Straße: laufend, mit dem Rad oder tanzend, mit Musik, durch Darmstadt.",
  },
} satisfies Meta<typeof Lead>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The lead is set at --step-1, whatever surrounds it. */
const atStepOne: Story["play"] = async ({ canvasElement }) => {
  const lead = canvasElement.querySelector<HTMLElement>(".lead")!;
  const probe = document.createElement("span");
  probe.style.fontSize = "var(--step-1)";
  canvasElement.append(probe);
  await expect(getComputedStyle(lead).fontSize).toBe(
    getComputedStyle(probe).fontSize,
  );
  probe.remove();
};

export const Cream: Story = {
  render: (args) => (
    <Section surface="cream" aria-labelledby="titel">
      <Heading level={2} id="titel">
        Beweg dich, Darmstadt!
      </Heading>
      <Lead {...args} />
    </Section>
  ),
  play: atStepOne,
};

export const InProse: Story = {
  render: (args) => (
    <Section surface="cream" aria-labelledby="titel">
      <Prose>
        <Heading level={2} id="titel">
          Run &amp; Rave
        </Heading>
        <Lead {...args} />
        <p>
          Du musst nicht schnell sein. <a href="#mehr">Mehr erfahren</a>
        </p>
      </Prose>
    </Section>
  ),
  play: atStepOne,
};
