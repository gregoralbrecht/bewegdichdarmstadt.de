import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { contrastRatio } from "../../lib/contrast";
import { menu } from "../../lib/menu";
import type { Surface } from "../../lib/palette";
import { MainMenu } from "./MainMenu";

const meta = {
  component: MainMenu,
  args: { current: "/festival" },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MainMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A tall page on one surface for the fixed menu to float over. */
const on =
  (surface: Surface): Decorator =>
  (Story) => (
    <div data-surface={surface} style={{ minHeight: "100vh" }}>
      <Story />
    </div>
  );

/** Vitest's real browser, or null in Storybook, where the window sets the width. */
const realBrowser = async () =>
  "__vitest_browser__" in globalThis ? import("vitest/browser") : null;

/** Sets the viewport in Vitest; the card shows from 66em, the bottom bar below that. */
async function viewport(width: number) {
  const browser = await realBrowser();
  if (!browser) return false;
  await browser.page.viewport(width, 800);
  return true;
}

const hex = (rgb: string) =>
  "#" +
  rgb
    .match(/\d+/g)!
    .slice(0, 3)
    .map((n) => Number(n).toString(16).padStart(2, "0"))
    .join("");

/** Every link's href, hidden or not (a closed sheet's links are hidden). */
const hrefs = (list: HTMLElement) =>
  [...list.querySelectorAll("a")].map((link) => link.getAttribute("href"));

/** The card's outermost line must reach 3:1 against the surface: the cream cut where the surface is
    dark, the ink border where it's light. */
const standsOut: Story["play"] = async ({ canvasElement, canvas }) => {
  if (!(await viewport(1280))) return;
  const nav = canvas.getByRole("navigation", { name: "Hauptmenü" });
  await expect(nav).toBeVisible();

  const surface = hex(
    getComputedStyle(canvasElement.querySelector("[data-surface]")!)
      .backgroundColor,
  );
  const border = hex(getComputedStyle(nav).borderTopColor);
  const cut = hex(getComputedStyle(nav).boxShadow.match(/rgb\([^)]*\)/g)![1]!);
  await expect(contrastRatio(border, cut)).toBeGreaterThanOrEqual(3);
  await expect(
    Math.max(contrastRatio(cut, surface), contrastRatio(border, surface)),
  ).toBeGreaterThanOrEqual(3);
};

export const OnCream: Story = {
  decorators: [on("cream")],
  play: async (context) => {
    await standsOut(context);
    if (!(await viewport(1280))) return;
    const nav = context.canvas.getByRole("navigation", { name: "Hauptmenü" });
    await expect(hrefs(nav)).toEqual(menu.map(({ href }) => href));

    const current = within(nav).getByRole("link", { current: "page" });
    await expect(current).toHaveTextContent("Festival");
    await expect(nav.querySelectorAll("[aria-current]")).toHaveLength(1);
    // Pressed in: edged, unlike the other links, not only filled.
    const start = within(nav).getByRole("link", { name: "Start" });
    await expect(getComputedStyle(current).borderTopColor).not.toBe(
      getComputedStyle(start).borderTopColor,
    );
    await expect(getComputedStyle(current).boxShadow).toBe("none");
    await expect(getComputedStyle(nav).transform).toBe("none");
  },
};

export const OnNight: Story = { decorators: [on("night")], play: standsOut };

export const OnPink: Story = { decorators: [on("pink")], play: standsOut };

export const OnStart: Story = {
  args: { current: "/" },
  decorators: [on("cream")],
  play: async ({ canvas }) => {
    if (!(await viewport(1280))) return;
    const nav = canvas.getByRole("navigation", { name: "Hauptmenü" });
    await expect(
      within(nav).getByRole("link", { current: "page" }),
    ).toHaveTextContent("Start");
  },
};

/** The card is the only list until the drawer opens; on phones it hides. */
export const CardOnly: Story = {
  decorators: [on("cream")],
  play: async ({ canvasElement }) => {
    const lists = canvasElement.querySelectorAll(".main-menu__list");
    await expect(lists).toHaveLength(1);
    if (!(await viewport(320))) return;
    await expect(lists[0]).not.toBeVisible();
  },
};
