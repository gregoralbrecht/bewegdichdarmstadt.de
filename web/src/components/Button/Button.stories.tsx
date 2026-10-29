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

const face = (button: HTMLElement) =>
  button.querySelector<HTMLElement>(".button__face")!;

/** Vitest's real browser, or null in Storybook, whose userEvent can't trigger :hover or emulate media. */
const realBrowser = async () =>
  "__vitest_browser__" in globalThis ? import("vitest/browser") : null;

/** Hovers and presses with reduced motion on: the face never moves, but hover underlines the label
    and press hides the shadow (on the hero, both layers). */
async function staysPutWithReducedMotion(button: HTMLElement) {
  const browser = await realBrowser();
  if (!browser) return;
  const reducedMotion = (value: "reduce" | "no-preference") =>
    browser.cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value }],
    });
  const settled = () => new Promise((resolve) => setTimeout(resolve, 300));
  const layers =
    button.dataset.variant === "hero" ? ["::before", "::after"] : ["::before"];
  // Releasing over a link clicks it, and navigating would unload the test runner.
  const stay = (event: Event) => event.preventDefault();
  button.addEventListener("click", stay);
  try {
    await reducedMotion("reduce");
    await browser.userEvent.hover(button);
    await settled();
    await expect(getComputedStyle(face(button)).transform).toBe("none");
    await expect(getComputedStyle(face(button)).textDecorationLine).toBe(
      "underline",
    );
    await expect(getComputedStyle(face(button)).textDecorationStyle).toBe(
      "dotted",
    );

    await browser.commands.mouseDown();
    await expect(button.matches(":active")).toBe(true);
    await expect(getComputedStyle(face(button)).transform).toBe("none");
    for (const layer of layers) {
      await expect(getComputedStyle(button, layer).opacity).toBe("0");
    }
  } finally {
    await browser.commands.mouseUp();
    await browser.userEvent.unhover(button);
    button.removeEventListener("click", stay);
    await reducedMotion("no-preference");
  }
}

export const Primary: Story = {
  decorators: [on("cream")],
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toHaveAttribute("type", "button");

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(getComputedStyle(face(button)).outlineStyle).toBe("solid");

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** The pointer rests on the bottom-right edge while the face lifts away from it. */
export const Hover: Story = {
  args: { href: "#programm", children: "Zum Programm" },
  decorators: [on("cream")],
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Zum Programm" });
    const browser = await realBrowser();
    if (!browser) return;

    const rest = link.getBoundingClientRect().toJSON();
    try {
      await browser.userEvent.hover(link, {
        position: { x: rest.width - 2, y: rest.height - 2 },
      });
      await waitFor(() =>
        expect(
          new DOMMatrix(getComputedStyle(face(link)).transform).m41,
        ).toBeLessThan(0),
      );
      await expect(link.matches(":hover")).toBe(true);
      await expect(link.getBoundingClientRect().toJSON()).toEqual(rest);
    } finally {
      await browser.userEvent.unhover(link);
    }
    await staysPutWithReducedMotion(link);
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
    const browser = await realBrowser();
    if (!browser) return;

    try {
      await browser.userEvent.hover(hero);
      await waitFor(() =>
        expect(
          new DOMMatrix(getComputedStyle(face(hero)).transform).m41,
        ).toBeLessThan(0),
      );
    } finally {
      await browser.userEvent.unhover(hero);
    }
    await staysPutWithReducedMotion(hero);
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

/** The spec's phone case: a 320px viewport with 16px gutters, and a label too long for one line. */
export const HeroLongLabel: Story = {
  args: {
    variant: "hero",
    href: "#mitmachen",
    children: "Jetzt kostenlos beim Lauftreff anmelden",
  },
  decorators: [on("cream")],
  render: (args) => (
    <div data-testid="column" style={{ width: "320px", paddingInline: "16px" }}>
      <Button {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const column = canvas.getByTestId("column");
    await expect(column.scrollWidth).toBeLessThanOrEqual(column.clientWidth);
    const hero = face(canvas.getByRole("link"));
    await expect(hero.scrollWidth).toBeLessThanOrEqual(hero.clientWidth);
  },
};

export const Small: Story = {
  args: { size: "small" },
  decorators: [on("cream")],
  play: async ({ canvas }) => {
    // The hit area reaches 22px above and below the middle, whatever the face's height.
    const button = canvas.getByRole("button");
    const { left, width, top, height } = button.getBoundingClientRect();
    const [x, y] = [left + width / 2, top + height / 2];
    for (const dy of [-21.5, 21.5]) {
      await expect(
        document.elementFromPoint(x, y + dy)?.closest(".button"),
      ).toBe(button);
    }
  },
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
