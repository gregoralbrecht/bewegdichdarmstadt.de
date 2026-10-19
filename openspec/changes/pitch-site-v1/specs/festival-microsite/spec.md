# Spec Delta

## Purpose

A summery, family-friendly page for the "Beweg dich, Darmstadt" Festival 2027. It makes the date stick, shows what to expect and gets the festival into people's calendars.

## ADDED Requirements

### Requirement: Save-the-date hero
The page SHALL open with the festival date and time (Samstag, 11. September 2027, 14–18 Uhr), the venue (Menschenskinder, Darmstadt-Kranichstein), a relative label ("in N Tagen" or the date) and the actions "In den Kalender", "Anfahrt" and "Sag's weiter".

#### Scenario: Months ahead
- **WHEN** a visitor opens the page on 19 Oct 2026
- **THEN** the hero shows "Sa, 11. Sep 2027 · 14–18 Uhr · Menschenskinder Kranichstein" and a calendar action

#### Scenario: Directions
- **WHEN** a visitor taps "Anfahrt"
- **THEN** a map or directions for the venue open in a new context without loading third-party content into the page beforehand

### Requirement: Programme overview
The page SHALL present what's on (yoga, training, movement offers, small activities, food, drinks; for adults and children) as visual tiles. Details not yet known SHALL be marked "mehr folgt".

#### Scenario: Programme tiles
- **WHEN** a visitor scrolls to the programme
- **THEN** they see tiles for each offer type and a visible "mehr folgt" note

### Requirement: Free entry and donations
The page SHALL state that entry is free and ask for donations, offering the same donate action as the hub.

#### Scenario: Free
- **WHEN** a visitor reads the festival page
- **THEN** "kostenlos" and the donation request are clearly visible

### Requirement: Impressions from 2025
The page SHALL show photos from the 2025 festival at Friedensplatz, using the same enlarged-view behaviour as the Run & Rave gallery.

#### Scenario: Impressions
- **WHEN** a visitor reaches the impressions section
- **THEN** photos from Festival 2025 are shown and can be enlarged

### Requirement: Distinct summer mood
The festival page SHALL feel visibly distinct from the Run & Rave page (lighter, summery, family-oriented), while sharing the logo, smiley, typography and navigation of the brand.

#### Scenario: Side by side
- **WHEN** the festival and Run & Rave pages are viewed side by side
- **THEN** both are recognisably the same brand, but differ in dominant colours and mood
