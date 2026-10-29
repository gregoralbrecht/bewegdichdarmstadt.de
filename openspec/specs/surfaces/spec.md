# surfaces Specification

## Purpose
What every color surface a section can use guarantees, so text, links, controls and focus stay readable on any of them.

## Requirements

### Requirement: Readable text on every surface

On every surface, body text, secondary text, links and button labels SHALL meet a WCAG AA contrast ratio of at least 4.5:1 against the color behind them.

#### Scenario: Text on the night surface

- **WHEN** a section uses the night surface
- **THEN** its body text, secondary text, links and button labels each have a contrast ratio of at least 4.5:1 against their background

### Requirement: Visible shapes and focus on every surface

On every surface, borders, hard shadows and the keyboard focus outline SHALL have a contrast ratio of at least 3:1 against the surface color.

#### Scenario: Focus inside a dark section

- **WHEN** a keyboard user tabs to a link inside a night section
- **THEN** the focus outline has a contrast ratio of at least 3:1 against the night background

### Requirement: Buttons respect reduced motion

When the visitor prefers reduced motion, no button SHALL move on hover or press.

#### Scenario: Hover with reduced motion

- **WHEN** a visitor with `prefers-reduced-motion: reduce` hovers or presses the hero button or any other button
- **THEN** the button stays in place

### Requirement: Button fill differs from its line

On every surface, a filled button's fill color SHALL differ from the color of its border and shadow, so the button never merges with its shadow.

#### Scenario: Primary button on night

- **WHEN** a primary button sits in a night section, where borders and shadows are orange
- **THEN** its fill is not orange
