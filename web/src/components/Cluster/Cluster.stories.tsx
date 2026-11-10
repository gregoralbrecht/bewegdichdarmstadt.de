import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import type { Surface } from "../../lib/palette";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import { Tag } from "../Tag/Tag";
import { Cluster } from "./Cluster";

const meta = {
  component: Cluster,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

const dates = ["10. Juli", "20. August", "24. September", "30. Oktober"];

const datesList = (
  <>
    <p id="run-and-rave-2026">Run &amp; Rave 2026</p>
    <Cluster as="ul" aria-labelledby="run-and-rave-2026">
      {dates.map((date) => (
        <li key={date}>{date}</li>
      ))}
    </Cluster>
  </>
);

/** One list named by its label, every date an item in order, and no bullets. */
const countedDates: Story["play"] = async ({ canvas }) => {
  const list = canvas.getByRole("list", { name: "Run & Rave 2026" });
  await expect(list.tagName).toBe("UL");
  await expect(list).toHaveAttribute("role", "list");
  await expect(getComputedStyle(list).listStyleType).toBe("none");
  const items = canvas.getAllByRole("listitem");
  await expect(items.map((item) => item.textContent)).toEqual(dates);
};

const datesOn = (surface: Surface): Story => ({
  render: () => (
    <Section surface={surface} aria-labelledby="bisher">
      <Prose>
        <Heading level={2} id="bisher">
          Bisher
        </Heading>
        {datesList}
      </Prose>
    </Section>
  ),
  play: countedDates,
});

export const DatesOnNight = datesOn("night");

export const DatesOnCream = datesOn("cream");

/** A row that isn't a set: a div, and the tags keep their own looks. */
export const TagsOnCream: Story = {
  render: () => (
    <Section surface="cream" aria-label="Tags">
      <Cluster>
        <Tag color="lime">Laufen</Tag>
        <Tag color="sky">Radfahren</Tag>
        <Tag color="lilac">Tanzen</Tag>
      </Cluster>
    </Section>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("list")).toBeNull();
    await expect(canvas.getByText("Laufen").parentElement?.tagName).toBe("DIV");
  },
};

/** The phone case: a 320px viewport with 16px gutters wraps the dates without overflowing. */
export const DatesAt320: Story = {
  render: () => (
    <div
      data-surface="night"
      data-testid="column"
      style={{ width: "320px", paddingInline: "16px" }}
    >
      <Prose>{datesList}</Prose>
    </div>
  ),
  play: async (context) => {
    await countedDates(context);
    const { canvas } = context;
    const column = canvas.getByTestId("column");
    const list = canvas.getByRole("list");
    await expect(column.scrollWidth).toBeLessThanOrEqual(column.clientWidth);
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
    const tops = new Set(
      canvas.getAllByRole("listitem").map((item) => item.offsetTop),
    );
    await expect(tops.size).toBeGreaterThan(1);
  },
};
