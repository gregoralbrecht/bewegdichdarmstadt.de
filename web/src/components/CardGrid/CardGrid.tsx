import type { ComponentPropsWithoutRef } from "react";
import "./CardGrid.css";

export type Props = ComponentPropsWithoutRef<"ul">;

/** A grid of cards as a list: each `<li>` child holds one `Card`, and neighbors tilt in opposite directions. */
export function CardGrid(props: Props) {
  // list-style: none drops the list role in Safari, so the ul says it again.
  return <ul className="card-grid" role="list" {...props} />;
}
