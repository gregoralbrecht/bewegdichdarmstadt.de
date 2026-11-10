# Spec Delta

## Purpose

What a group of cards always guarantees: it is announced as a list with each card counted, and no two neighboring cards tilt the same way.

## ADDED Requirements

### Requirement: A group of cards is announced as a list

A group of cards SHALL be exposed as a list with one list item per card, in the order given, and SHALL keep the list role without bullets.

#### Scenario: Screen reader user reaches Termine

- **WHEN** a screen reader user reaches "Termine" on `/`
- **THEN** they hear a list of two items, Run & Rave first and Festival 2027 second, and no bullets show

### Requirement: Neighboring cards tilt in opposite directions

Each card in a group SHALL tilt the opposite way from the card before it.

#### Scenario: Visitor looks at the team cards

- **WHEN** a visitor looks at the cards under "Wer wir sind" on `/`
- **THEN** Steffi's card and Lea's card tilt in opposite directions
