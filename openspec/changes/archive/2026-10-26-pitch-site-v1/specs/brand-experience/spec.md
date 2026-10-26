# Spec Delta

## Purpose

Defines the look and feel shared by all pages: friendly, approachable, political and joyful ("a protest sign that smiles"). It also covers the small moments of delight that make the site memorable.

## ADDED Requirements

### Requirement: Brand palette and smiley
All pages SHALL use the existing brand colours (indigo, orange, pink, lavender) as one consistent system, and the existing smiley as logo and recurring motif. Text on coloured backgrounds SHALL meet WCAG AA contrast.

#### Scenario: Contrast
- **WHEN** any text/background pairing on the site is checked
- **THEN** it meets a contrast ratio of at least 4.5:1 for body text and 3:1 for large text

### Requirement: Typography
The site SHALL use a bold, characterful display typeface for headlines and slogans (protest-sign feel) and a warm, highly legible typeface for text. Both SHALL be self-hosted and SHALL replace Comfortaa.

#### Scenario: Headline style
- **WHEN** a visitor sees "Demokratie läuft nicht von allein."
- **THEN** it is set in the display typeface, large and heavy, readable at phone width without overflow

### Requirement: Cancellation smiley
When an event shown in a hero or listing is cancelled, its smiley SHALL appear sad next to the cancellation notice.

#### Scenario: Cancelled date
- **WHEN** a listed Run Club date is cancelled
- **THEN** it shows a sad smiley with "fällt leider aus" and the next date

### Requirement: Rave mode
Tapping or clicking the header smiley five times within three seconds SHALL toggle "rave mode": colours cycle, the smiley dances and elements pulse to a beat, for a few seconds or until toggled off. It SHALL NOT play sound and SHALL NOT flash more than three times per second.

#### Scenario: Trigger
- **WHEN** a visitor taps the smiley five times quickly
- **THEN** rave mode starts and ends on its own after a few seconds

#### Scenario: Reduced motion
- **WHEN** the visitor prefers reduced motion
- **THEN** rave mode only swaps to a festive colour scheme, without movement or pulsing

### Requirement: Cursor smiley
On devices with a fine pointer (mouse or trackpad), a small colourful smiley SHALL follow the pointer with a slight, springy delay. It SHALL change its expression or colour over interactive elements. It SHALL never intercept clicks and SHALL be absent on touch-only devices and under reduced motion.

#### Scenario: Desktop
- **WHEN** a visitor moves the mouse across the hub
- **THEN** a colourful smiley trails the pointer, and it reacts (e.g. winks) when hovering a button

#### Scenario: Touch device
- **WHEN** the site is used on a phone
- **THEN** no cursor smiley is shown

### Requirement: Smiley backgrounds
Hero areas SHALL have a decorative background pattern of smileys in brand colours. Clicking or tapping a background smiley SHALL change its colour with a small bounce. The pattern SHALL NOT reduce text contrast below the contrast requirement and SHALL NOT capture taps intended for text, links or buttons.

#### Scenario: Recolour
- **WHEN** a visitor taps a background smiley in the hub hero
- **THEN** it bounces and switches to the next brand colour

#### Scenario: Taps on content
- **WHEN** a visitor taps a button that overlaps the smiley pattern
- **THEN** the button activates and no smiley changes colour

### Requirement: Microinteractions
Buttons and links SHALL respond to hover, press and focus with brief, playful feedback (e.g. a squish on press, a wink of a smiley icon). Successful actions such as adding to the calendar SHALL get a short celebratory acknowledgement.

#### Scenario: Calendar success
- **WHEN** a visitor taps "In den Kalender"
- **THEN** the button briefly confirms with a smiley animation and "Ist im Kalender!"

### Requirement: Hidden easter eggs
The site SHALL contain at least two hidden easter eggs that are discoverable through play and never needed for any task: rave mode (see its own requirement) and an "alle bunt" celebration. The celebration triggers when every smiley in a hero background has been recoloured to the same colour and shows a short confetti and a playful message.

#### Scenario: All one colour
- **WHEN** a visitor recolours every smiley of the hub hero background to orange
- **THEN** a short celebration plays with a playful message, and the pattern stays as recoloured

### Requirement: Motion with restraint
Animations (page transitions, reveals, route drawing) SHALL be short and purposeful. All non-essential motion SHALL be disabled when the visitor prefers reduced motion.

#### Scenario: Reduced motion preference
- **WHEN** the operating system requests reduced motion
- **THEN** content appears without animated transitions and nothing moves on its own except the countdown digits
