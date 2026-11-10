# prose Specification

## Purpose
How running text reads on every surface of the site: how wide its lines get, how links stand out from the text around them, and how lists show they are lists.

## Requirements

### Requirement: Readable line length

Paragraphs and list items in running text SHALL be no wider than about 70 characters, however wide the window.

#### Scenario: Wide window

- **WHEN** a visitor opens a page with running text in a 1440px window
- **THEN** no line of a paragraph holds more than about 70 characters

### Requirement: Links in text are underlined

Links in running text SHALL be underlined on every surface, so they don't rely on color alone.

#### Scenario: Link on a loud surface

- **WHEN** a paragraph on the pink surface contains a link
- **THEN** the link is underlined while not hovered or focused

### Requirement: Link hover stays still under reduced motion

When the visitor prefers reduced motion, hovering a link in running text SHALL change its look without any animation.

#### Scenario: Hover with reduced motion

- **WHEN** a visitor with reduced motion turned on hovers a link in running text
- **THEN** the underline changes once and nothing on the link keeps moving

### Requirement: Lists show markers

Bulleted and numbered lists in running text SHALL show a bullet or number in front of each item.

#### Scenario: Bulleted list

- **WHEN** running text contains a `<ul>`
- **THEN** each item starts with a visible bullet
