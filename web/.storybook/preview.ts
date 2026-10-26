import type { Preview } from "@storybook/react-vite";
import "../src/styles/tokens.css";
import "./fonts.css";

// The site is German; screen readers and axe read the language from <html>.
document.documentElement.lang = "de";

const preview: Preview = {
  parameters: {
    // axe violations fail the story's test, not just show in the panel.
    a11y: { test: "error" },
  },
};

export default preview;
