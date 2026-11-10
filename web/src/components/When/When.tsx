import type { ComponentPropsWithoutRef } from "react";
import { formatDate } from "../../lib/date";

export type Props = Omit<
  ComponentPropsWithoutRef<"time">,
  "dateTime" | "children"
> & {
  /** The ISO date, such as "2027-09-11". */
  date: string;
  weekday?: boolean;
  year?: boolean;
};

/** A date in German ("11. September") that carries its ISO date. `weekday` and `year` add those parts. */
export function When({ date, weekday, year, ...props }: Props) {
  return (
    <time dateTime={date} {...props}>
      {formatDate(date, { weekday, year })}
    </time>
  );
}
