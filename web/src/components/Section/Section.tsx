import type { ComponentPropsWithoutRef } from "react";
import type { Surface } from "../../lib/palette";
import "./Section.css";

export type Props = ComponentPropsWithoutRef<"section"> & {
  /** Sets every color role inside: text, links, buttons, cards and shadows follow. */
  surface?: Surface;
};

/** A full-width band on one surface, with the content column inside. */
export function Section({
  surface = "cream",
  className,
  children,
  ...props
}: Props) {
  return (
    <section
      className={className ? `section ${className}` : "section"}
      data-surface={surface}
      {...props}
    >
      <div className="section__inner">{children}</div>
    </section>
  );
}
