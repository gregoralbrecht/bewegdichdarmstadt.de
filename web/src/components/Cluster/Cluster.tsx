import type { ComponentPropsWithoutRef } from "react";
import "./Cluster.css";

export type Props =
  | ({ as?: "div" } & ComponentPropsWithoutRef<"div">)
  | ({ as: "ul" } & ComponentPropsWithoutRef<"ul">);

/** A wrapping row of short items. `as="ul"` when they form a set, so its `<li>` children are counted. */
export function Cluster({ as, ...props }: Props) {
  // list-style: none drops the list role in Safari, so a ul says it again.
  if (as === "ul") {
    return (
      <ul
        className="cluster"
        role="list"
        {...(props as ComponentPropsWithoutRef<"ul">)}
      />
    );
  }
  return (
    <div className="cluster" {...(props as ComponentPropsWithoutRef<"div">)} />
  );
}
