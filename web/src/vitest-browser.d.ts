// The custom commands from vitest.config.ts, as stories see them through vitest/browser.
import "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    mouseDown: () => Promise<void>;
    mouseUp: () => Promise<void>;
  }
}
