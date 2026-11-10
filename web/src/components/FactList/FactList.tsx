import type { ComponentPropsWithoutRef, ReactNode } from "react";
import "./FactList.css";

export type Fact = {
  term: string;
  /** A ReactNode, so a detail can hold a link or a `<time>`. */
  detail: ReactNode;
};

export type Props = Omit<ComponentPropsWithoutRef<"dl">, "children"> & {
  items: Fact[];
};

/** Short facts as a description list: one box per term and its detail, laid out in columns. */
export function FactList({ items, ...props }: Props) {
  return (
    <dl className="fact-list" {...props}>
      {items.map(({ term, detail }) => (
        <div className="fact-list__fact" key={term}>
          <dt>{term}</dt>
          <dd>{detail}</dd>
        </div>
      ))}
    </dl>
  );
}
