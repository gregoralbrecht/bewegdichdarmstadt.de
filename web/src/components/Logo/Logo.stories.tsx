import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Logo } from "./Logo";

const meta = {
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wordmark: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Beweg dich, Darmstadt!" });
    await expect(link).toHaveAttribute("href", "/");
  },
};
