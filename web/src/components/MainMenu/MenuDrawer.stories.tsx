import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { menu } from "../../lib/menu";
import { MainMenu } from "./MainMenu";
import { MenuDrawer } from "./MenuDrawer";

const meta = {
  component: MenuDrawer,
  args: { current: "/festival" },
  parameters: { layout: "fullscreen" },
  // As in Base.astro: the drawer sits inside the menu, on a tall cream page.
  render: (args) => (
    <div data-surface="cream" style={{ minHeight: "100vh" }}>
      <MainMenu current={args.current}>
        <MenuDrawer {...args} />
      </MainMenu>
    </div>
  ),
} satisfies Meta<typeof MenuDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Vitest's real browser, or null in Storybook, where the window sets the width. */
const realBrowser = async () =>
  "__vitest_browser__" in globalThis ? import("vitest/browser") : null;

/** The sheet is portaled to <body>, so query the whole document, not just the story root. */
const screenOf = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body);

/** Every link's href in a list. */
const hrefs = (list: HTMLElement) =>
  [...list.querySelectorAll("a")].map((link) => link.getAttribute("href"));

/** One "Menü" button opens every link in a sheet; Escape, "Schließen" and a tap outside each close
    it, and focus goes back to the button every time. */
export const Sheet: Story = {
  play: async ({ canvasElement }) => {
    const browser = await realBrowser();
    if (!browser) return;
    await browser.page.viewport(320, 800);
    const screen = screenOf(canvasElement);
    await expect(screen.queryByRole("navigation")).toBeNull();

    const open = screen.getByRole("button", { name: "Menü" });
    const opened = async () => {
      await userEvent.click(open);
      return screen.findByRole("dialog", { name: "Menü" });
    };
    const closed = () =>
      waitFor(async () => {
        await expect(screen.queryByRole("dialog")).toBeNull();
        await expect(open).toHaveFocus();
      });

    const sheet = await opened();
    const nav = within(sheet).getByRole("navigation", { name: "Hauptmenü" });
    await expect(hrefs(nav)).toEqual(menu.map(({ href }) => href));
    await expect(
      within(nav).getByRole("link", { current: "page" }),
    ).toHaveTextContent("Festival");
    await browser.userEvent.keyboard("{Escape}");
    await closed();

    await userEvent.click(
      within(await opened()).getByRole("button", { name: "Schließen" }),
    );
    await closed();

    await opened();
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      ".main-menu__backdrop",
    )!;
    await browser.userEvent.click(backdrop, { position: { x: 10, y: 10 } });
    await closed();
    // Closed by pointer, so the returning focus draws no ring.
    await expect(open).not.toHaveAttribute("data-focus-visible");
  },
};

/** The ring shows for the keyboard: Tab to "Menü" and it's flagged. */
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const browser = await realBrowser();
    if (!browser) return;
    await browser.page.viewport(320, 800);
    const open = screenOf(canvasElement).getByRole("button", { name: "Menü" });
    // The card's links come first in the tab order, hidden on phones, so they're skipped.
    await userEvent.tab();
    await expect(open).toHaveFocus();
    await expect(open).toHaveAttribute("data-focus-visible");
    await expect(getComputedStyle(open).outlineStyle).toBe("dotted");
  },
};

/** Widening past 66em closes the sheet, since the card takes over there. */
export const ClosesWhenWide: Story = {
  play: async ({ canvasElement }) => {
    const browser = await realBrowser();
    if (!browser) return;
    await browser.page.viewport(320, 800);
    const screen = screenOf(canvasElement);
    await userEvent.click(screen.getByRole("button", { name: "Menü" }));
    await screen.findByRole("dialog");
    await browser.page.viewport(1280, 800);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};

/** Opens the sheet at phone width; null in Storybook, where the window can't be driven. */
async function openSheet(canvasElement: HTMLElement) {
  const browser = await realBrowser();
  if (!browser) return null;
  await browser.page.viewport(320, 800);
  const screen = screenOf(canvasElement);
  const open = screen.getByRole("button", { name: "Menü" });
  await userEvent.click(open);
  await screen.findByRole("dialog");
  const sheet =
    canvasElement.ownerDocument.querySelector<HTMLElement>(
      ".main-menu__sheet",
    )!;
  // Wait out the entering animation, so the drag starts from rest.
  await waitFor(() => expect(sheet).not.toHaveAttribute("data-entering"));
  return { browser, screen, open, sheet };
}

/** Dragged down past a third of its height and let go: the sheet closes, focus is on "Menü". */
export const SwipeAway: Story = {
  play: async ({ canvasElement }) => {
    const opened = await openSheet(canvasElement);
    if (!opened) return;
    const { browser, screen, open, sheet } = opened;
    await browser.commands.drag(".main-menu__handle", sheet.offsetHeight / 2, {
      steps: 10,
      interval: 16,
      rest: 150,
    });
    await waitFor(async () => {
      await expect(screen.queryByRole("dialog")).toBeNull();
      await expect(open).toHaveFocus();
    });
  },
};

/** A short, fast flick closes it too. */
export const Flick: Story = {
  play: async ({ canvasElement }) => {
    const opened = await openSheet(canvasElement);
    if (!opened) return;
    const { browser, screen } = opened;
    await browser.commands.drag(".main-menu__handle", 60, {
      steps: 3,
      interval: 10,
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  },
};

/** A short, slow drag let go: the sheet settles back fully open. */
export const ShortDrag: Story = {
  play: async ({ canvasElement }) => {
    const opened = await openSheet(canvasElement);
    if (!opened) return;
    const { browser, screen, sheet } = opened;
    const rest = sheet.getBoundingClientRect().top;
    await browser.commands.drag(".main-menu__handle", 40, {
      steps: 8,
      interval: 40,
      rest: 150,
    });
    await expect(screen.getByRole("dialog")).toBeVisible();
    await waitFor(() =>
      expect(sheet.getBoundingClientRect().top).toBeCloseTo(rest, 0),
    );
  },
};

/** With touch, a swipe that starts on a link in the list (scrolled to the top) drags the sheet, and
    letting go doesn't follow the link. */
export const SwipeFromList: Story = {
  play: async ({ canvasElement }) => {
    const opened = await openSheet(canvasElement);
    if (!opened) return;
    const { browser, screen, sheet } = opened;
    const doc = canvasElement.ownerDocument;
    let followed = false;
    // Navigating would unload the test runner; a click that gets this far would have followed.
    const stay = (event: Event) => {
      followed = true;
      event.preventDefault();
    };
    doc.addEventListener("click", stay);
    try {
      await browser.commands.drag(
        ".main-menu__dialog .main-menu__link",
        sheet.offsetHeight / 2,
        { steps: 10, interval: 16, rest: 150, pointer: "touch" },
      );
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      await expect(followed).toBe(false);
    } finally {
      doc.removeEventListener("click", stay);
    }
  },
};
