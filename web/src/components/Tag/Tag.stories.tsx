import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { tagNames, type Surface } from "../../lib/palette";
import { Tag } from "./Tag";

const meta = {
  component: Tag,
  args: { color: "lime", children: "Laufen" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

const on =
  (surface: Surface): Decorator =>
  (Story) => (
    <div data-surface={surface} style={{ padding: "var(--space-6)" }}>
      <Story />
    </div>
  );

/** The tag palette is WIP: placeholder values until the palette meeting. */
const palette: Story["render"] = () => (
  <p style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
    {tagNames.map((color) => (
      <Tag key={color} color={color}>
        {color}
      </Tag>
    ))}
  </p>
);

export const Single: Story = { decorators: [on("cream")] };

export const PaletteOnCream: Story = {
  decorators: [on("cream")],
  render: palette,
};

export const PaletteOnNight: Story = {
  decorators: [on("night")],
  render: palette,
};
