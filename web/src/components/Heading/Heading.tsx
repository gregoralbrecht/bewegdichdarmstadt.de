import type { ComponentPropsWithoutRef } from "react";
import "./Heading.css";

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Size = "0" | "1" | "2" | "3" | "4";

// The styleguide's type scale: page title, section, sub-heading, card title, body size.
const sizeForLevel: Record<Level, Size> = {
  1: "4",
  2: "3",
  3: "2",
  4: "1",
  5: "0",
  6: "0",
};

export type Props = ComponentPropsWithoutRef<"h1"> & {
  /** The document outline: renders `h1` to `h6`. */
  level: Level;
  /** The `--step-*` the heading looks like; defaults from the level. */
  size?: Size;
};

export function Heading({
  level,
  size = sizeForLevel[level],
  ...props
}: Props) {
  const Tag = `h${level}` as const;
  return <Tag className="heading" data-size={size} {...props} />;
}
