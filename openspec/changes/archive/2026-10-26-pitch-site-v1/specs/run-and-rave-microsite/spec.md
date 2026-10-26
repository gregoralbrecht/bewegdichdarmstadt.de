# Spec Delta

## Purpose

A dedicated, high-energy page for the Run & Rave demo runs. It answers "when, where, can I do this?" at first glance and makes people want to come and bring friends.

## ADDED Requirements

### Requirement: Next Run & Rave hero
The page SHALL open with the next Run & Rave: relative time label (including day-of countdown and live state), meeting place, distance (about 5.5 km), pace (about 7:30 min/km) and "kostenlos". Below it SHALL be the actions "In den Kalender", "Zur Route" and "Sag's weiter".

#### Scenario: Day before
- **WHEN** a visitor opens the page on Thu 29 Oct 2026
- **THEN** the hero reads "MORGEN · 17:30 · Friedensplatz" with 5.5 km, 7:30 min/km and "kostenlos" visible on the first screen

### Requirement: Join-mode picker
The page SHALL let visitors pick how they want to join (Laufen, Radfahren, Tanzen, Gehen, "Ich bin noch nie 5 km gelaufen"). It SHALL answer each choice with a short, reassuring German text explaining how that works at the Run & Rave.

#### Scenario: Beginner
- **WHEN** a visitor picks "Ich bin noch nie 5 km gelaufen"
- **THEN** they read that the pace is relaxed, shortcuts are fine and nobody is left behind

### Requirement: Route visualisation
The page SHALL show the route as an illustrated map in brand colours, marking the start and well-known Darmstadt landmarks. The route SHALL draw itself progressively as it scrolls into view and SHALL link to the Komoot tour.

#### Scenario: Scroll into view
- **WHEN** the route section scrolls into view
- **THEN** the route line animates from start to finish, and a link "Route auf Komoot" is available

#### Scenario: Reduced motion
- **WHEN** the visitor prefers reduced motion
- **THEN** the full route is shown immediately without animation

### Requirement: About the format
The page SHALL explain what Run & Rave is (running, music, community; a sign for connection, diversity and democracy; not about pace) and who it is for, using the project's own wording with obvious errors fixed.

#### Scenario: Content check
- **WHEN** the page is reviewed against the current Jimdo "Aktuelles" text
- **THEN** all facts are present and the known typos are corrected

### Requirement: Past demos gallery
The page SHALL show photos of past Run & Rave demos, grouped by date (newest first). Photos SHALL open larger on tap and SHALL be navigable.

#### Scenario: Browse photos
- **WHEN** a visitor taps a photo of the 24 Sep 2026 demo
- **THEN** it opens enlarged, and they can move to the next photo and close the view with keyboard or touch

### Requirement: Link back to hub
The page SHALL be clearly part of "Beweg dich, Darmstadt", with a way back to the hub and to the other formats.

#### Scenario: Back to hub
- **WHEN** a visitor taps the logo or "Beweg dich, Darmstadt"
- **THEN** the hub opens
