# Spec Delta

## Purpose

Gets the essentials (where exactly, when, how to get there) to someone who is on their way to an event, from any page and with one tap, even with poor mobile reception.

## ADDED Requirements

### Requirement: Always-available quick access
Every page SHALL show a persistent "Wo? Wann?" button that stays reachable while scrolling and does not cover content. Activating it SHALL open a quick-info sheet for the next event. On the Run & Rave and festival pages that is the next event of that format; on the hub it is the next event of any format.

#### Scenario: On the way
- **WHEN** a visitor on the hub scrolls halfway down on a phone and taps "Wo? Wann?"
- **THEN** a sheet opens with the next event's meeting point and start time, without navigating away

#### Scenario: Close and return
- **WHEN** the visitor closes the sheet by swiping down, tapping outside, pressing Escape or tapping "Schließen"
- **THEN** they are back at the same scroll position with focus on the "Wo? Wann?" button

### Requirement: Quick-info content
The sheet SHALL show the event name, its relative time label and absolute start time, the meeting place with a precise description of the spot, and a photo of the spot. It SHALL also show the actions "Navigation starten", "Route ansehen" (for runs) and "In den Kalender". If the precise spot is not yet confirmed, the description SHALL be a visibly marked placeholder.

#### Scenario: Run & Rave day
- **WHEN** it is Fri 30 Oct 2026, 17:10 and a visitor opens the sheet
- **THEN** it shows "Run & Rave · HEUTE · in 20 min · 17:30", "Friedensplatz" with the spot description and photo, and the three actions

#### Scenario: Unconfirmed spot
- **WHEN** no confirmed spot description exists
- **THEN** the sheet shows "Friedensplatz" and a marked placeholder such as "genauer Treffpunkt folgt"

### Requirement: Navigation hand-off
"Navigation starten" SHALL open walking directions to the meeting point in the device's maps app or a maps website, as an ordinary link. It SHALL NOT load third-party content into the page.

#### Scenario: iPhone
- **WHEN** a visitor on an iPhone taps "Navigation starten"
- **THEN** Apple Maps opens with directions to the meeting point

#### Scenario: Other devices
- **WHEN** a visitor on Android or desktop taps "Navigation starten"
- **THEN** Google Maps opens with directions to the meeting point

### Requirement: Event-day emphasis
On the day of an event, until it ends, its page hero SHALL offer the quick-info sheet as the primary action, and the "Wo? Wann?" button SHALL be visually emphasised.

#### Scenario: Event day hero
- **WHEN** a visitor opens the Run & Rave page on 30 Oct 2026 at 16:00
- **THEN** the hero's primary action is "Wo treffen wir uns?" and opens the quick-info sheet

### Requirement: Offline availability
After a page has been visited once, its quick-info content (next event, meeting point text and photo) SHALL remain available when the device is offline or the connection is very poor.

#### Scenario: No reception at Friedensplatz
- **WHEN** a visitor who opened the Run & Rave page yesterday reopens it today with no connection
- **THEN** the page loads and the quick-info sheet shows the meeting point, photo and start time
