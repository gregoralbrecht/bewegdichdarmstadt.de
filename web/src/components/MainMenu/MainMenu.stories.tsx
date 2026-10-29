import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
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

/** The phone case: one "Menü" button opens every link in a sheet; Escape closes it and focus goes
    back to the button. */
export const Sheet: Story = {
  decorators: [on("cream")],
  play: async ({ canvasElement }) => {
    if (!(await viewport(320))) return;
    // The dialog is modal, so query the whole document, not just the story root.
    const screen = within(canvasElement.ownerDocument.body);
    await expect(screen.queryByRole("navigation")).toBeNull();

    const open = screen.getByRole("button", { name: "Menü" });
    await userEvent.click(open);
    const sheet = screen.getByRole("dialog", { name: "Menü" });
    await waitFor(() => expect(sheet).toHaveAttribute("open"));
    const nav = within(sheet).getByRole("navigation", { name: "Hauptmenü" });
    await expect(hrefs(nav)).toEqual(menu.map(({ href }) => href));
    await expect(
      within(nav).getByRole("link", { current: "page" }),
    ).toHaveTextContent("Festival");

    // Only a trusted key press closes a dialog, so this goes through Playwright.
    const browser = (await realBrowser())!;
    await browser.userEvent.keyboard("{Escape}");
    await waitFor(() => expect(sheet).not.toHaveAttribute("open"));
    await expect(open).toHaveFocus();

    await userEvent.click(open);
    await waitFor(() => expect(sheet).toHaveAttribute("open"));
    await userEvent.click(
      within(sheet).getByRole("button", { name: "Schließen" }),
    );
    await waitFor(() => expect(sheet).not.toHaveAttribute("open"));
    await expect(open).toHaveFocus();
  },
};

/** Both lists come from menu.ts; a drift between them would show here. */
export const SameLinks: Story = {
  decorators: [on("cream")],
  play: async ({ canvasElement }) => {
    const [card, sheet] =
      canvasElement.querySelectorAll<HTMLElement>(".main-menu__list");
    await expect(hrefs(card!)).toEqual(hrefs(sheet!));
    // Two lists, but only one is ever shown, so assistive tech meets one menu.
    if (!(await viewport(1280))) return;
    await expect(card).toBeVisible();
    await expect(sheet).not.toBeVisible();
  },
};
