import { useId, type ReactNode } from "react";
import type { Surface } from "../../lib/palette";
import { Button } from "../Button/Button";
import { Heading } from "../Heading/Heading";
import { Lead } from "../Lead/Lead";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import "./Hero.css";

export type Props = {
  /** The page's h1, which also names the band. */
  title: string;
  /** Where the page's one hero button goes. */
  href: string;
  /** Light surfaces only: the header lies over the hero and keeps the body's ink roles. */
  surface?: Exclude<Surface, "night" | "ink">;
  /** The lead under the h1. In Astro, `<Fragment slot="lead">`. */
  lead: ReactNode;
  /** The hero button's label; mark break points in handles and long words with `<wbr>`. In Astro,
      `<Fragment slot="action">`. */
  action: ReactNode;
  /** An optional note between the lead and the button. */
  children?: ReactNode;
};

/** The top band of a page: its h1, the lead and the page's one hero button. */
export function Hero({
  title,
  href,
  surface = "pink",
  lead,
  action,
  children,
}: Props) {
  const id = useId();
  return (
    <Section className="hero" surface={surface} aria-labelledby={id}>
      <Prose>
        <Heading level={1} id={id}>
          {title}
        </Heading>
        <Lead>{lead}</Lead>
        {children}
        <p className="hero__action">
          <Button variant="hero" href={href}>
            {action}
          </Button>
        </p>
      </Prose>
    </Section>
  );
}
