# when Specification

## Purpose
What a date on the site always guarantees: it reads in German, and it carries its date in a form machines can read.

## Requirements

### Requirement: A date carries its ISO date

A date on the site SHALL be a `time` element whose `datetime` is the ISO date (`YYYY-MM-DD`) and whose text is that same day written in German.

#### Scenario: Visitor checks the festival date

- **WHEN** a visitor reaches the festival card under "Termine" on `/`
- **THEN** it reads "Samstag, 11. September 2027", inside a `time` element with `datetime="2027-09-11"`, and each past Run & Rave date under "Bisher" is a `time` element whose `datetime` matches its text, from `2026-07-10` ("10. Juli") to `2026-10-30` ("30. Oktober")
