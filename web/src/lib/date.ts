export type DateParts = { weekday?: boolean; year?: boolean };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Whether `iso` is a real day in `YYYY-MM-DD` form: "2027-09-11", but not "2027-02-30". */
export function isIsoDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  // V8 rolls "2027-02-30" over to 2 March, so the parts must survive the round trip.
  return (
    ISO_DATE.test(iso) &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === iso
  );
}

/** Today in Darmstadt as an ISO date, so a build just after midnight UTC still gets the local day. */
export function today() {
  // The Swedish locale writes dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
  }).format(new Date());
}

/** An ISO date ("2027-09-11") in German: "11. September", plus weekday and year when asked. Throws on anything else. */
export function formatDate(iso: string, { weekday, year }: DateParts = {}) {
  if (!isIsoDate(iso)) {
    throw new RangeError(`Not an ISO date: "${iso}"`);
  }
  // A date-only string is UTC midnight; any other zone could shift the day.
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    ...(weekday && { weekday: "long" }),
    ...(year && { year: "numeric" }),
  }).format(new Date(`${iso}T00:00:00Z`));
}
