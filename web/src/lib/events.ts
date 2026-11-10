export type EventKind = "run-and-rave" | "festival";

export type Event = { kind: EventKind; date: string };

export type Year = { year: string; dates: string[] };

/** The dates of `kind` before `before` (both ISO dates), grouped by year: newest year first, oldest date first. */
export function pastByYear(
  events: Event[],
  kind: EventKind,
  before: string,
): Year[] {
  // ISO dates sort as strings.
  const dates = events
    .filter((event) => event.kind === kind && event.date < before)
    .map(({ date }) => date)
    .sort();
  const years: Year[] = [];
  for (const date of dates) {
    const year = date.slice(0, 4);
    if (years[0]?.year === year) {
      years[0].dates.push(date);
    } else {
      years.unshift({ year, dates: [date] });
    }
  }
  return years;
}
