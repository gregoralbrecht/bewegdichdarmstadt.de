# Spec Delta

## Purpose

Keeps every date on the site correct without manual upkeep. It knows which Run & Rave, Run Club and festival dates are coming up and tells visitors when they happen, in human terms, relative to now.

## ADDED Requirements

### Requirement: Event formats and sources
The site SHALL know three event formats: Run & Rave (a hand-maintained list of dates), Run Club (recurring) and Festival (a single date). Each event SHALL have a format, start date and time, approximate end, meeting place and a stable identifier derived from format and date. All times SHALL be interpreted in the Europe/Berlin time zone.

#### Scenario: Run & Rave from the list
- **WHEN** the Run & Rave list contains Fri 30 Oct 2026, 17:30 at Friedensplatz
- **THEN** the site treats it as a Run & Rave event with identifier `runrave-2026-10-30`

#### Scenario: Time zone independence
- **WHEN** a visitor whose device is set to a non-German time zone views an event starting 17:30
- **THEN** the event is shown as starting 17:30 (Darmstadt time)

### Requirement: Run Club recurrence
Run Club dates SHALL be computed as the 2nd Friday of every month at 17:30, meeting at Friedensplatz, lasting about 60 minutes. The site SHALL compute them indefinitely into the future.

#### Scenario: Next Run Club after a given day
- **WHEN** the current date is Mon 19 Oct 2026
- **THEN** the next Run Club is Fri 13 Nov 2026, 17:30

#### Scenario: Month starting on a Friday
- **WHEN** a month's 1st day is a Friday (e.g. January 2027)
- **THEN** that month's Run Club is on the 8th

### Requirement: Cancellations
Any individual event date SHALL be markable as cancelled, with an optional short reason. A cancelled date SHALL stay visible as cancelled until it has passed, and SHALL NOT count as "the next event" of its format.

#### Scenario: Cancelled Run Club
- **WHEN** the Run Club on Fri 11 Dec 2026 is marked cancelled and today is 1 Dec 2026
- **THEN** listings show 11 Dec as cancelled and name 8 Jan 2027 as the next Run Club

#### Scenario: Past cancellation disappears
- **WHEN** a cancelled date lies in the past
- **THEN** no notice about that cancellation is shown anywhere

### Requirement: Upcoming events
The site SHALL determine each format's next non-cancelled event and a combined, chronologically ordered list of upcoming events across all formats. An event SHALL count as upcoming until its approximate end.

#### Scenario: Combined list
- **WHEN** today is 19 Oct 2026
- **THEN** the combined list starts with Run & Rave 30 Oct 2026, followed by Run Club 13 Nov 2026, and includes the festival on 11 Sep 2027 in its date position

#### Scenario: No future Run & Rave dates known
- **WHEN** the Run & Rave list has no future dates
- **THEN** the Run & Rave format shows "Neue Termine folgen" with a link to Instagram instead of a date

### Requirement: Relative time labels
Each upcoming event SHALL show a German label relative to now: "HEUTE" on the day (with a countdown in hours and minutes before start), "MORGEN" for the next day, the weekday name ("Freitag") within the next 6 days, "in N Tagen" up to 14 days, and the calendar date (e.g. "Fr, 13. Nov") beyond that. The absolute date and time SHALL always be available alongside the label.

#### Scenario: Tomorrow
- **WHEN** it is Thu 29 Oct 2026, 20:00 and the next Run & Rave is Fri 30 Oct, 17:30
- **THEN** the label reads "MORGEN · 17:30"

#### Scenario: Same day countdown
- **WHEN** it is Fri 30 Oct 2026, 15:17
- **THEN** the label reads "HEUTE · in 2 h 13 min" and the countdown keeps updating while the page is open

#### Scenario: Far away
- **WHEN** an event is more than 14 days away
- **THEN** the label shows the weekday and date, e.g. "Fr, 13. Nov · 17:30"

### Requirement: Live and just-finished states
Between an event's start and approximate end the site SHALL show it as happening now ("Läuft gerade"), with the route and meeting place. For the rest of that day after it ends, the site SHALL show a thank-you message that names the next date of the same format.

#### Scenario: During the run
- **WHEN** it is Fri 30 Oct 2026, 18:10
- **THEN** the Run & Rave is shown as "Läuft gerade" instead of a countdown

#### Scenario: Evening after
- **WHEN** it is Fri 30 Oct 2026, 21:00
- **THEN** a thank-you message is shown together with the next Run & Rave date, or "Neue Termine folgen" if none is known

### Requirement: Calendar export
Every upcoming event SHALL offer an "In den Kalender" action that downloads a valid iCalendar file. It SHALL contain title, start, end, location and a link back to the event's page. Run Club SHALL additionally offer a recurring calendar entry (2nd Friday monthly).

#### Scenario: Single event
- **WHEN** a visitor taps "In den Kalender" on the Run & Rave of 30 Oct 2026
- **THEN** a `.ics` file downloads that standard calendar apps import as one event, 17:30–19:00, at Friedensplatz, Darmstadt

#### Scenario: Recurring Run Club
- **WHEN** a visitor adds the recurring Run Club entry
- **THEN** their calendar shows a monthly event on every 2nd Friday at 17:30
