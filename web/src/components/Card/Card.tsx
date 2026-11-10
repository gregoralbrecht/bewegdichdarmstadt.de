import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import type { TagColor } from "../../lib/palette";
import "./Card.css";

export type Props = ComponentPropsWithoutRef<"article"> & {
  /** A tag-palette fill for cards whose color means something, such as a time slot. Light surfaces only. */
  fill?: TagColor;
  /** The sticker tilt in degrees. The whole card tilts, text included. */
  tilt?: -3 | -2 | -1 | 1 | 2 | 3;
};

/** An `<article>` card: a white body inside a frame whose shadow follows the parent surface. */
export function Card({
  fill,
  tilt,
  className,
  style,
  children,
  ...props
}: Props) {
  return (
    <article
      className={className ? `card ${className}` : "card"}
      data-fill={fill}
      style={
        tilt === undefined
          ? style
          : ({ ...style, "--tilt": `${tilt}deg` } as CSSProperties)
      }
      {...props}
    >
      <div className="card__body" data-surface="white">
        {children}
      </div>
    </article>
  );
}

/** The card's one link, on its heading. It stretches over the whole card, which then moves on hover and press. */
export function CardLink(props: ComponentPropsWithoutRef<"a">) {
  return <a className="card__link" {...props} />;
}
