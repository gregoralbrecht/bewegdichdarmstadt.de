import type { ComponentPropsWithoutRef } from "react";
import "./Prose.css";

export type Props = ComponentPropsWithoutRef<"div">;

/** Running text: readable line length, even spacing, wavy links and lists with markers. */
export function Prose(props: Props) {
  return <div className="prose" {...props} />;
}
