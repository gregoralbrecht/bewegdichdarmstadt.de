import { useId, type ReactNode } from "react";
import type { Surface } from "../../lib/palette";
import { Button } from "../Button/Button";
import { Heading } from "../Heading/Heading";
import { Prose } from "../Prose/Prose";
import { Section } from "../Section/Section";
import "./CtaBand.css";

export type Props = {
  /** The band's h2, which also names it. */
  title: string;
  /** Where the band's one button goes. */
  href: string;
  surface?: Surface;
  /** An id on the section, for links that land on the band. */
  id?: string;
  /** The button's label. In Astro, `<Fragment slot="action">`. */
  action: ReactNode;
  /** The text between the heading and the button. */
  children?: ReactNode;
};

/** A band that asks for one thing: its h2, a line of text and one primary button. */
export function CtaBand({
  title,
  href,
  surface = "pink",
  id,
  action,
  children,
}: Props) {
  const headingId = useId();
  return (
    <Section
      className="cta-band"
      surface={surface}
      id={id}
      aria-labelledby={headingId}
    >
      <Prose>
        <Heading level={2} id={headingId}>
          {title}
        </Heading>
        {children}
        <p className="cta-band__action">
          <Button href={href}>{action}</Button>
        </p>
      </Prose>
    </Section>
  );
}
