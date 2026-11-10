# Spec Delta

## Purpose

What the site's event dates always guarantee: they live in one collection, passed Run & Rave dates show under "Bisher" without editing the page, and a malformed date never reaches it.

## ADDED Requirements

### Requirement: Passed Run & Rave dates show under "Bisher"

Every Run & Rave in the events collection dated before the day the site is built SHALL appear under "Bisher" on `/`, in a labelled list for its year, newest year first and oldest date first within a year. Later dates SHALL NOT appear there.

#### Scenario: Site built after the 2026 season

- **WHEN** the site is built on 10 November 2026 and the collection also holds a Run & Rave on a day in 2027
- **THEN** "Bisher" shows one list labelled "Run & Rave 2026" reading "10. Juli", "20. August", "24. September", "30. Oktober", and the 2027 date appears nowhere under "Bisher"

### Requirement: A malformed event date fails the build

An event whose date is not a real day in `YYYY-MM-DD` form SHALL fail the build with a message naming the entry.

#### Scenario: Typo in a new date

- **WHEN** an entry's date is `2027-02-30` or `11.09.2027`
- **THEN** the build stops with an error naming that entry
