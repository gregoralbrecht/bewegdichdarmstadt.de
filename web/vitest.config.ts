import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";

// userEvent can only click, so stories hold the mouse down through these to see :active.
const mouseDown: BrowserCommand<[]> = ({ page }) => page.mouse.down();
const mouseUp: BrowserCommand<[]> = ({ page }) => page.mouse.up();

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
            commands: { mouseDown, mouseUp },
          },
        },
      },
    ],
  },
});
