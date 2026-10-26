import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "./Button";

const meta = {
  component: Button,
  args: { children: "Jetzt anmelden", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toHaveAttribute("type", "button");

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(getComputedStyle(button).outlineStyle).toBe("solid");

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Pink: Story = {
  args: { variant: "pink" },
};

export const Small: Story = {
  args: { size: "small" },
};

export const SmallPink: Story = {
  args: { variant: "pink", size: "small" },
};

export const Link: Story = {
  args: { href: "#programm", children: "Zum Programm" },
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Zum Programm" });
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", "#programm");
    await expect(link).not.toHaveAttribute("role");

    // Navigating would unload the test runner, so catch the activation and stop it there.
    const followed = new Promise<string>((resolve) =>
      link.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          resolve(link.getAttribute("href") ?? "");
        },
        { once: true },
      ),
    );
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(await followed).toBe("#programm");
  },
};

export const LinkPink: Story = {
  args: { href: "#programm", variant: "pink" },
};

export const LinkSmall: Story = {
  args: { href: "#programm", size: "small" },
};

export const LinkSmallPink: Story = {
  args: { href: "#programm", variant: "pink", size: "small" },
};
