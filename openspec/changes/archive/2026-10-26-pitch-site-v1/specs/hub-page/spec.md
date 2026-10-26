# Spec Delta

## Purpose

The front door of "Beweg dich, Darmstadt". It explains in seconds what the project stands for, what is coming up next and where to go from here, and it carries the Run Club, the team and donations.

## ADDED Requirements

### Requirement: Mission hero
The hub SHALL open with the project's message ("Demokratie läuft nicht von allein." / "Für Verbindung. Für Vielfalt. Für Gemeinschaft. Für Demokratie.") and the smiley, followed directly by the next upcoming event across all formats with its relative time label.

#### Scenario: First screen
- **WHEN** a visitor opens the hub on a phone on 29 Oct 2026
- **THEN** the first screen shows the message and "MORGEN · 17:30 · Run & Rave · Friedensplatz" without scrolling

### Requirement: Next-up strip
The hub SHALL list the upcoming events of all formats in date order (at least the next three). Each entry SHALL show format, relative label, place and actions for calendar and sharing, and SHALL link to the format's page or section.

#### Scenario: Mixed list
- **WHEN** today is 19 Oct 2026
- **THEN** the strip shows Run & Rave (30 Oct), Run Club (13 Nov) and Run Club (11 Dec) in that order, with the festival reachable via its card

### Requirement: Format cards
The hub SHALL present Run & Rave and Festival 2027 as prominent cards that link to their microsites, and Run Club as a section on the hub itself.

#### Scenario: Navigate to a microsite
- **WHEN** a visitor taps the Run & Rave card
- **THEN** the Run & Rave microsite opens

### Requirement: Run Club section
The hub SHALL describe the Run Club (meeting point Friedensplatz, every 2nd Friday at 17:30, 45–60 min, 5–7 km, warm-up, mixed paces, "niemand läuft allein", stretch and time to chat). It SHALL show the next Run Club date with calendar, recurring calendar and share actions.

#### Scenario: Run Club details
- **WHEN** a visitor reaches the Run Club section
- **THEN** they see the next date, what to expect, and can add the recurring entry to their calendar

### Requirement: Team section
The hub SHALL introduce all four founders (Steffi, Lea, Mady, Rahel) with name, role and a short text. Founders without supplied photo or bio SHALL appear with a clearly marked placeholder.

#### Scenario: Missing bio
- **WHEN** no bio exists for Mady
- **THEN** her card shows her name and a visible "Text folgt" placeholder instead of being omitted

### Requirement: Donations and social
The hub SHALL explain why donations matter, using concrete example amounts, and offer a prominent donate action. It SHALL also link to the project's Instagram. Until the real donation target is known, the action SHALL be a visibly marked placeholder.

#### Scenario: Donate placeholder
- **WHEN** a visitor taps the donate action while no real link is configured
- **THEN** it is clearly identifiable as a placeholder and does not lead to a broken or unrelated page
