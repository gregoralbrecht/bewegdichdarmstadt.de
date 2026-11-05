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
// with a real mouse or real touch events, so pointer capture and touch-action apply.
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
  const cdp =
    pointer === "touch" ? await page.context().newCDPSession(page) : null;
  const touch = (type: "touchStart" | "touchMove" | "touchEnd", dy: number) =>
    cdp!.send("Input.dispatchTouchEvent", {
      type,
      touchPoints: type === "touchEnd" ? [] : [{ x, y: y + dy }],
    });
  if (cdp) await touch("touchStart", 0);
  else {
    await page.mouse.move(x, y);
    await page.mouse.down();
  }
  for (let step = 1; step <= steps; step++) {
    await page.waitForTimeout(interval);
    const dy = (distance * step) / steps;
    if (cdp) await touch("touchMove", dy);
    else await page.mouse.move(x, y + dy);
  }
  await page.waitForTimeout(rest);
  if (cdp) await touch("touchEnd", distance);
  else await page.mouse.up();
  await cdp?.detach();
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
