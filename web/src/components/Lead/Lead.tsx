import type { ComponentPropsWithoutRef } from "react";
import "./Lead.css";

export type Props = ComponentPropsWithoutRef<"p">;

/** The paragraph under a heading that says what the section is about, one step larger. */
export function Lead(props: Props) {
  return <p className="lead" {...props} />;
}
