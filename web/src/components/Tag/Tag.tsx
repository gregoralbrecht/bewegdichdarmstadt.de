import type { ComponentPropsWithoutRef } from "react";
import type { TagColor } from "../../lib/palette";
import "./Tag.css";

export type Props = ComponentPropsWithoutRef<"span"> & {
  color: TagColor;
};

/** A short label in a pill. The color helps scanning; the text carries the meaning. */
export function Tag({ color, ...props }: Props) {
  return <span className="tag" data-color={color} {...props} />;
}
