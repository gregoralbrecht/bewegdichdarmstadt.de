import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "../Button/Button";
import { Hero } from "./Hero";

const meta = {
  component: Hero,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Beweg dich, Darmstadt!",
    href: "https://www.instagram.com/bewegdichdarmstadt/",
    lead: "Wir gehen gemeinsam auf die Straße: laufend, mit dem Rad oder tanzend, mit Musik, durch Darmstadt. Kostenlos und für alle.",
    action: (
      <>
        Folge @beweg
        <wbr />
        dich
        <wbr />
        darmstadt
      </>
    ),
    children: (
      <p>
        Gerade ist Winterpause. Auf Instagram erfährst du, wann es weitergeht.
      </p>
    ),
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One h1 names the band, and the band holds the page's one hero button. */
const namedByItsH1: Story["play"] = async ({ args, canvas }) => {
  const headings = canvas.getAllByRole("heading", { level: 1 });
  await expect(headings).toHaveLength(1);
  await expect(
    canvas.getByRole("region", { name: args.title }),
  ).toBeInTheDocument();
  const heroes = canvas
    .getByRole("region")
    .querySelectorAll('[data-variant="hero"]');
  await expect(heroes).toHaveLength(1);
  await expect(heroes[0]).toHaveAttribute("href", args.href);
};

export const Pink: Story = {
  play: async (context) => {
    await namedByItsH1(context);
    const face = context.canvasElement.querySelector(".button__face")!;
    await expect(getComputedStyle(face).hyphens).toBe("manual");
  },
};

export const Cream: Story = { args: { surface: "cream" }, play: namedByItsH1 };

export const Orange: Story = {
  args: { surface: "orange" },
  play: namedByItsH1,
};

/** Only the hero's label drops hyphenation; a button next to the hero keeps `auto`. */
export const OtherButtonsKeepHyphens: Story = {
  render: (args) => (
    <>
      <Hero {...args} />
      <div data-surface="cream" style={{ padding: "var(--space-6)" }}>
        <Button href="#programm">Zum Programm</Button>
      </div>
    </>
  ),
  play: async ({ canvas }) => {
    const face = (name: string) =>
      canvas
        .getByRole("link", { name })
        .querySelector<HTMLElement>(".button__face")!;
    await expect(
      getComputedStyle(face("Folge @bewegdichdarmstadt")).hyphens,
    ).toBe("manual");
    await expect(getComputedStyle(face("Zum Programm")).hyphens).toBe("auto");
  },
};
