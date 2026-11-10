import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";

// userEvent can only click, so stories hold the mouse down through these to see :active.
const mouseDown: BrowserCommand<[]> = ({ page }) => page.mouse.down();
const mouseUp: BrowserCommand<[]> = ({ page }) => page.mouse.up();

export type DragOptions = {
  /** How the finger moves: in this many steps, this many ms apart, then resting before letting go. */
  steps: number;
  interval: number;
  rest?: number;
  pointer?: "mouse" | "touch";
};

// Drags from the middle of the first element matching `selector` straight down by `distance` px,
// with real mouse or touch events through CDP, so pointer capture and touch-action apply.
// Each event carries a timestamp from a clock that moves exactly `interval` per step and `rest`
// before letting go, so the speed the page sees comes from the options, not from runner load.
// The real waits stay so CSS state and animations move on in between.
const drag: BrowserCommand<[string, number, DragOptions]> = async (
  context,
  selector,
  distance,
  { steps, interval, rest = 0, pointer = "mouse" },
) => {
  const { page } = context;
  const box = (await (
    await context.frame()
  )
    .locator(selector)
    .first()
    .boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const cdp = await page.context().newCDPSession(page);
  let timestamp = Date.now() / 1000;
  let buttons = 0;
  const touch = (type: "touchStart" | "touchMove" | "touchEnd", dy: number) =>
    cdp.send("Input.dispatchTouchEvent", {
      type,
      touchPoints: type === "touchEnd" ? [] : [{ x, y: y + dy }],
      timestamp,
    });
  const mouse = (
    type: "mouseMoved" | "mousePressed" | "mouseReleased",
    dy: number,
  ) => {
    buttons = { mouseMoved: buttons, mousePressed: 1, mouseReleased: 0 }[type];
    return cdp.send("Input.dispatchMouseEvent", {
      type,
      x,
      y: y + dy,
      button: "left",
      buttons,
      clickCount: 1,
      timestamp,
    });
  };
  if (pointer === "touch") await touch("touchStart", 0);
  else {
    await mouse("mouseMoved", 0);
    await mouse("mousePressed", 0);
  }
  for (let step = 1; step <= steps; step++) {
    await page.waitForTimeout(interval);
    timestamp += interval / 1000;
    const dy = (distance * step) / steps;
    if (pointer === "touch") await touch("touchMove", dy);
    else await mouse("mouseMoved", dy);
  }
  await page.waitForTimeout(rest);
  timestamp += rest / 1000;
  if (pointer === "touch") await touch("touchEnd", distance);
  else await mouse("mouseReleased", distance);
  await cdp.detach();
};

// Two projects: plain unit tests in Node, and every story as a test in headless Chromium.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            commands: { mouseDown, mouseUp, drag },
          },
        },
      },
    ],
  },
});
