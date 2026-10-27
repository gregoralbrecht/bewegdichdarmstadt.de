import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import type { Surface } from "../../lib/palette";
import { Button } from "./Button";

const meta = {
  component: Button,
  args: { children: "Jetzt anmelden", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Renders the story inside a surface, with room for the shadows. */
const on =
  (surface: Surface): Decorator =>
  (Story) => (
    <div data-surface={surface} style={{ padding: "var(--space-6)" }}>
      <Story />
    </div>
  );

export const Primary: Story = {
  decorators: [on("cream")],
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

export const PrimaryOnNight: Story = { decorators: [on("night")] };

export const PrimaryOnOrange: Story = { decorators: [on("orange")] };

export const Secondary: Story = {
  args: { variant: "secondary" },
  decorators: [on("cream")],
};

export const SecondaryOnNight: Story = {
  args: { variant: "secondary" },
  decorators: [on("night")],
};

export const SecondaryOnOrange: Story = {
  args: { variant: "secondary" },
  decorators: [on("orange")],
};

export const Hero: Story = {
  args: { variant: "hero", href: "#mitmachen", children: "Mitmachen" },
  decorators: [on("cream")],
  play: async ({ canvas }) => {
    const hero = canvas.getByRole("link", { name: "Mitmachen" });
    // Storybook's userEvent can't trigger :hover or emulate media; pnpm test runs this part with
    // Vitest's real browser events.
    if (!("__vitest_browser__" in globalThis)) return;
    const browser = await import("vitest/browser");
    const reducedMotion = (value: "reduce" | "no-preference") =>
      browser.cdp().send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value }],
      });

    const rest = getComputedStyle(hero).boxShadow;
    try {
      await browser.userEvent.hover(hero);
      await waitFor(() =>
        expect(getComputedStyle(hero).transform).toBe(
          "matrix(1, 0, 0, 1, -6, -6)",
        ),
      );
      await browser.userEvent.unhover(hero);

      await reducedMotion("reduce");
      await browser.userEvent.hover(hero);
      await expect(getComputedStyle(hero).transform).toBe("none");
      // The layers still change, only the movement goes.
      await expect(getComputedStyle(hero).boxShadow).not.toBe(rest);
    } finally {
      await browser.userEvent.unhover(hero);
      await reducedMotion("no-preference");
    }
  },
};

export const HeroOnNight: Story = {
  ...Hero,
  play: undefined,
  decorators: [on("night")],
};

export const HeroOnOrange: Story = {
  ...Hero,
  play: undefined,
  decorators: [on("orange")],
};

/** The allowed pairing: a hero never sits next to another button, only next to a text link. */
export const HeroWithTextLink: Story = {
  args: { variant: "hero", href: "#mitmachen", children: "Mitmachen" },
  decorators: [on("night")],
  render: (args) => (
    <p
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-6)",
        margin: 0,
      }}
    >
      <Button {...args} />
      <a href="#programm">Erst das Programm ansehen</a>
    </p>
  ),
};

export const Small: Story = {
  args: { size: "small" },
  decorators: [on("cream")],
};

export const Link: Story = {
  args: { href: "#programm", children: "Zum Programm" },
  decorators: [on("cream")],
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

export const LinkSecondarySmall: Story = {
  args: { href: "#programm", variant: "secondary", size: "small" },
  decorators: [on("cream")],
};
