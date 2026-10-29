# Spec Delta

## MODIFIED Requirements

### Requirement: Buttons respect reduced motion

When the visitor prefers reduced motion, no button SHALL move on hover or press, and every button SHALL still show hover and press feedback.

#### Scenario: Hover with reduced motion

- **WHEN** a visitor with `prefers-reduced-motion: reduce` hovers or presses the hero button or any other button
- **THEN** the button stays in place

#### Scenario: Feedback with reduced motion

- **WHEN** a visitor with `prefers-reduced-motion: reduce` hovers, then presses, the hero button or any other button
- **THEN** the label is underlined on hover, and the shadow disappears while pressed
