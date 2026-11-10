# Spec Delta

## Purpose

What the home page (`/`) always offers visitors, whatever components it is built from: where to find the next date, where the events live, and how its sections are named.

## ADDED Requirements

### Requirement: One hero button to Instagram

The home page SHALL have exactly one hero button, and it SHALL link to `https://www.instagram.com/bewegdichdarmstadt/`.

#### Scenario: Visitor looks for the next date

- **WHEN** a visitor opens `/`
- **THEN** the hero contains one hero-styled link naming @bewegdichdarmstadt to the Instagram account, and no other hero-styled button appears on the page

### Requirement: Links to the event pages

The home page's Termine section SHALL link to `/run-and-rave` and to `/festival`.

#### Scenario: Visitor wants to know more about an event

- **WHEN** a visitor opens `/` and reaches Termine
- **THEN** one link leads to `/run-and-rave` and one to `/festival`

### Requirement: Sections named by their headings

Every section on the home page SHALL be named by its own heading, and the page SHALL have exactly one `h1`.

#### Scenario: Screen reader lists landmarks

- **WHEN** a screen reader user lists the regions on `/`
- **THEN** each region is announced with the text of its heading, and only the hero's heading is an `h1`
