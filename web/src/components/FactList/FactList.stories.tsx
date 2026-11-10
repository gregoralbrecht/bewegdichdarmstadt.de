import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import type { Surface } from "../../lib/palette";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import { FactList } from "./FactList";

const meta = {
  component: FactList,
  parameters: { layout: "fullscreen" },
  args: {
    items: [
      { term: "Treffpunkt", detail: "Friedensplatz" },
      { term: "Mit dem Rad dabei sein", detail: "geht" },
      { term: "Unterwegs abkürzen", detail: "geht" },
      { term: "Teilnahme", detail: "kostenlos" },
      { term: "Demo", detail: "angemeldet, mit Polizeibegleitung" },
    ],
  },
} satisfies Meta<typeof FactList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One dl, every dt followed by its one dd in the same div, and the marker adds nothing to the term. */
const pairedFacts: Story["play"] = async ({ args, canvas, canvasElement }) => {
  const lists = canvasElement.querySelectorAll("dl");
  await expect(lists).toHaveLength(1);
  const terms = canvas.getAllByRole("term");
  const details = canvas.getAllByRole("definition");
  await expect(terms).toHaveLength(args.items.length);
  await expect(details).toHaveLength(args.items.length);
  for (const [i, term] of terms.entries()) {
    const fact = term.parentElement!;
    await expect(fact.tagName).toBe("DIV");
    await expect(fact.parentElement).toBe(lists[0]);
    await expect(fact.children).toHaveLength(2);
    await expect(term.nextElementSibling).toBe(details[i]);
    // A dt takes no accessible name, so check what a screen reader reads: its text, plus the
    // marker's generated content, which must stay empty.
    await expect(term).toHaveTextContent(
      new RegExp(`^${args.items[i]!.term}$`),
    );
    await expect(getComputedStyle(term, "::before").content).toBe('""');
  }
  await expect(terms[0]).toHaveTextContent(/^Treffpunkt$/);
  await expect(details[0]).toHaveTextContent(/^Friedensplatz$/);
};

const onSurface = (surface: Surface): Story => ({
  render: (args) => (
    <Section surface={surface} aria-labelledby="titel">
      <Prose>
        <Heading level={2} id="titel">
          Du musst nicht schnell sein. Du musst nicht mal laufen.
        </Heading>
        <FactList {...args} />
      </Prose>
    </Section>
  ),
  play: pairedFacts,
});

export const Orange = onSurface("orange");

export const Cream = onSurface("cream");

export const Pink = onSurface("pink");

export const Night = onSurface("night");
