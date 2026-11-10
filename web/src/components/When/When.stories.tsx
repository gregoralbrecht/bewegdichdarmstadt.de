import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Cluster } from "../Cluster/Cluster";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import { When } from "./When";

const meta = {
  component: When,
  parameters: { layout: "fullscreen" },
  args: { date: "2027-09-11" },
} satisfies Meta<typeof When>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every `time` carries its ISO date and reads as that day in German. */
const reads =
  (expected: [string, string][]): Story["play"] =>
  async ({ canvasElement }) => {
    const times = [...canvasElement.querySelectorAll("time")];
    await expect(
      times.map((time) => [time.dateTime, time.textContent]),
    ).toEqual(expected);
  };

export const DayAndMonth: Story = {
  render: (args) => (
    <Section surface="cream" aria-label="Datum">
      <p>
        <When {...args} />
      </p>
    </Section>
  ),
  play: reads([["2027-09-11", "11. September"]]),
};

export const WeekdayAndYear: Story = {
  args: { weekday: true, year: true },
  render: (args) => (
    <Section surface="cream" aria-label="Datum">
      <p>
        <When {...args} />, 14 bis 18 Uhr
      </p>
    </Section>
  ),
  play: reads([["2027-09-11", "Samstag, 11. September 2027"]]),
};

const past = [
  ["2026-07-10", "10. Juli"],
  ["2026-08-20", "20. August"],
  ["2026-09-24", "24. September"],
  ["2026-10-30", "30. Oktober"],
] satisfies [string, string][];

/** The past Run & Rave dates on /, in a Cluster on night. */
export const PastDatesOnNight: Story = {
  render: () => (
    <Section surface="night" aria-labelledby="bisher">
      <Prose>
        <Heading level={2} id="bisher">
          Bisher
        </Heading>
        <p id="run-and-rave-2026">Run &amp; Rave 2026</p>
        <Cluster as="ul" aria-labelledby="run-and-rave-2026">
          {past.map(([date]) => (
            <li key={date}>
              <When date={date} />
            </li>
          ))}
        </Cluster>
      </Prose>
    </Section>
  ),
  play: reads(past),
};
