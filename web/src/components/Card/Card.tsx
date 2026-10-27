import type { ComponentPropsWithoutRef } from "react";
import type { TagColor } from "../../lib/palette";
import "./Card.css";

export type Props = ComponentPropsWithoutRef<"article"> & {
  /** A tag-palette fill for cards whose color means something, such as a time slot. Light surfaces only. */
  fill?: TagColor;
};

/** An `<article>` card: a white body inside a frame whose shadow follows the parent surface. */
export function Card({ fill, children, ...props }: Props) {
  return (
    <article className="card" data-fill={fill} {...props}>
      <div className="card__body" data-surface="white">
        {children}
      </div>
    </article>
  );
}
