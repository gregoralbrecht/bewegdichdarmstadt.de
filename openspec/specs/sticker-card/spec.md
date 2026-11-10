# sticker-card Specification

## Purpose
What a sticker card always guarantees: a card that leads somewhere is one link, named by its heading, that covers the whole card, and only cards you can click move.

## Requirements

### Requirement: A linked card is one link covering the card

A card that leads somewhere SHALL hold exactly one link, named by the card's heading, and a click anywhere on the card SHALL follow it.

#### Scenario: Visitor clicks the Run & Rave card

- **WHEN** a visitor clicks the text below the heading of the Run & Rave card under "Termine" on `/`
- **THEN** they land on `/run-and-rave`, and the card holds no other link than "Run & Rave"

### Requirement: Focus shows around the whole card

When a card's link has keyboard focus, the focus ring SHALL surround the whole card, following its tilt.

#### Scenario: Keyboard user tabs to a card

- **WHEN** a keyboard user tabs to the Festival 2027 card on `/`
- **THEN** a dotted ring surrounds the tilted card, outside its border

### Requirement: Only linked cards move, and never under reduced motion

A card SHALL move on hover or press only when it holds a link, and SHALL NOT move at all when the visitor prefers reduced motion.

#### Scenario: Visitor hovers the cards on `/`

- **WHEN** a visitor hovers the Run & Rave card, then Steffi's card, first normally and then with reduced motion on
- **THEN** only the Run & Rave card lifts, and only without reduced motion; with it on, the shadow still changes and both cards keep their tilt
