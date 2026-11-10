import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import type { Surface } from "../../lib/palette";
import { CardGrid } from "../CardGrid/CardGrid";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import { PersonCard } from "./PersonCard";

const meta = {
  component: PersonCard,
  parameters: { layout: "fullscreen" },
  args: {
    name: "Steffi Rieger",
    tilt: 2,
    style: { maxWidth: "20rem" },
    children: <p>Yogalehrerin, Unternehmerin und Life &amp; Team Coach</p>,
  },
} satisfies Meta<typeof PersonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Inside a Section and Prose, as on the pages.
const on = (surface: Surface): Story["decorators"] => [
  (Story) => (
    <Section surface={surface} aria-labelledby="team">
      <Prose>
        <Heading level={2} id="team">
          Wer wir sind
        </Heading>
        <Story />
      </Prose>
    </Section>
  ),
];

// A portrait, so the square frame has to crop it.
const testPhoto = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#f8971c"/><circle cx="150" cy="150" r="80" fill="#1b1a33"/></svg>',
)}`;

/** Named by the person, no link, and the photo's frame square and shown above the name though it
    comes after it in the markup. */
async function checkCard(card: HTMLElement, name: string) {
  const heading = card.querySelector("h3")!;
  const frame = card.querySelector<HTMLElement>(".person-card__photo")!;
  await expect(heading).toHaveTextContent(name);
  await expect(card.querySelectorAll("a")).toHaveLength(0);
  await expect(
    heading.compareDocumentPosition(frame) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  await expect(frame.getBoundingClientRect().top).toBeLessThan(
    heading.getBoundingClientRect().top,
  );
  // offsetWidth and offsetHeight ignore the tilt.
  await expect(frame.offsetHeight).toBe(frame.offsetWidth);
}

const placeholder: Story["play"] = async ({ canvas, args }) => {
  const card = canvas.getByRole("article");
  await checkCard(card, args.name);
  const frame = card.querySelector(".person-card__photo")!;
  await expect(frame).toHaveAttribute("data-placeholder");
  await expect(frame).toHaveTextContent("Foto folgt");
  await expect(getComputedStyle(frame).borderTopStyle).toBe("dashed");
};

export const PlaceholderOnCream: Story = {
  decorators: on("cream"),
  play: placeholder,
};

export const PlaceholderOnNight: Story = {
  decorators: on("night"),
  play: placeholder,
};

export const WithPhoto: Story = {
  args: {
    photo: <img src={testPhoto} alt="Steffi Rieger" />,
  },
  decorators: on("cream"),
  play: async ({ canvas, args }) => {
    const card = canvas.getByRole("article");
    await checkCard(card, args.name);
    const frame = card.querySelector<HTMLElement>(".person-card__photo")!;
    await expect(frame).not.toHaveAttribute("data-placeholder");
    await expect(frame).not.toHaveTextContent("Foto folgt");
    const image = canvas.getByRole("img", { name: "Steffi Rieger" });
    await expect(frame).toContainElement(image);
    await expect(getComputedStyle(image).objectFit).toBe("cover");
    await expect(getComputedStyle(frame).borderTopStyle).toBe("solid");
  },
};

const team = [
  {
    name: "Steffi Rieger",
    line: "Yogalehrerin, Unternehmerin und Life & Team Coach",
  },
  {
    name: "Lea Emmel",
    line: "Gründerin von Outdoor Training Darmstadt und zertifizierte Trainerin",
  },
];

export const InCardGrid: Story = {
  decorators: on("cream"),
  render: () => (
    <CardGrid>
      {team.map(({ name, line }) => (
        <li key={name}>
          <PersonCard name={name}>
            <p>{line}</p>
          </PersonCard>
        </li>
      ))}
    </CardGrid>
  ),
  play: async ({ canvas }) => {
    const cards = canvas.getAllByRole("article");
    await expect(cards).toHaveLength(team.length);
    for (const [index, card] of cards.entries()) {
      await checkCard(card, team[index].name);
      await expect(card.querySelector("[data-placeholder]")).toHaveTextContent(
        "Foto folgt",
      );
    }
  },
};
