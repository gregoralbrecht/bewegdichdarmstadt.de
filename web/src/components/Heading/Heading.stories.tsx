import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Heading } from "./Heading";

const meta = {
  component: Heading,
  args: { level: 1, children: "Beweg dich, Darmstadt!" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {
  render: (args) => (
    <>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} {...args} level={level}>
          Überschrift h{level}
        </Heading>
      ))}
    </>
  ),
};

export const LevelOne: Story = {};

/** The outline says h2, the look says page title. */
export const LevelTwoAtStepFour: Story = {
  args: { level: 2, size: "4", children: "Run & Rave" },
  play: async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole("heading", { level: 2 });
    await expect(heading.tagName).toBe("H2");

    const probe = document.createElement("span");
    probe.style.fontSize = "var(--step-4)";
    canvasElement.append(probe);
    await expect(getComputedStyle(heading).fontSize).toBe(
      getComputedStyle(probe).fontSize,
    );
    probe.remove();
  },
};
