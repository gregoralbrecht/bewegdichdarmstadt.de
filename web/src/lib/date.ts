export type DateParts = { weekday?: boolean; year?: boolean };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** An ISO date ("2027-09-11") in German: "11. September", plus weekday and year when asked. Throws on anything else. */
export function formatDate(iso: string, { weekday, year }: DateParts = {}) {
  const date = new Date(`${iso}T00:00:00Z`);
  // V8 rolls "2027-02-30" over to 2 March, so the parts must survive the round trip.
  const real =
    ISO_DATE.test(iso) &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === iso;
  if (!real) {
    throw new RangeError(`Not an ISO date: "${iso}"`);
  }
  // A date-only string is UTC midnight; any other zone could shift the day.
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    ...(weekday && { weekday: "long" }),
    ...(year && { year: "numeric" }),
  }).format(date);
}
