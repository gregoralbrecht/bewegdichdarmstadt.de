// The custom commands from vitest.config.ts, as stories see them through vitest/browser.
import "vitest/browser";
import type { DragOptions } from "../vitest.config";

declare module "vitest/browser" {
  interface BrowserCommands {
    mouseDown: () => Promise<void>;
    mouseUp: () => Promise<void>;
    drag: (
      selector: string,
      distance: number,
      options: DragOptions,
    ) => Promise<void>;
  }
}
