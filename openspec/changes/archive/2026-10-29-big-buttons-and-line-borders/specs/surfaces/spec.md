# Spec Delta

## RENAMED Requirements

- FROM: `### Requirement: Hero button respects reduced motion`
- TO: `### Requirement: Buttons respect reduced motion`

## MODIFIED Requirements

### Requirement: Buttons respect reduced motion

When the visitor prefers reduced motion, no button SHALL move on hover or press.

#### Scenario: Hover with reduced motion

- **WHEN** a visitor with `prefers-reduced-motion: reduce` hovers or presses the hero button or any other button
- **THEN** the button stays in place

## ADDED Requirements

### Requirement: Button fill differs from its line

On every surface, a filled button's fill color SHALL differ from the color of its border and shadow, so the button never merges with its shadow.

#### Scenario: Primary button on night

- **WHEN** a primary button sits in a night section, where borders and shadows are orange
- **THEN** its fill is not orange
