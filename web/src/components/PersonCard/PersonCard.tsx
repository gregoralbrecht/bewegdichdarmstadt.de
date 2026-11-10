import type { ReactNode } from "react";
import { Card, type Props as CardProps } from "../Card/Card";
import { Heading } from "../Heading/Heading";
import "./PersonCard.css";

export type Props = CardProps & {
  /** The person's name, the card's heading. */
  name: string;
  /** The photo, its `alt` included. In Astro, `<Fragment slot="photo">`. Without it the frame says "Foto folgt". */
  photo?: ReactNode;
  /** The one line about the person. */
  children?: ReactNode;
};

/** A team card without a link: the name as its heading, the photo shown above it, then one line. */
export function PersonCard({
  name,
  photo,
  className,
  children,
  ...props
}: Props) {
  return (
    <Card
      className={className ? `person-card ${className}` : "person-card"}
      {...props}
    >
      <Heading level={3}>{name}</Heading>
      {photo ? (
        <div className="person-card__photo">{photo}</div>
      ) : (
        <div className="person-card__photo" data-placeholder="">
          Foto folgt
        </div>
      )}
      {children}
    </Card>
  );
}
