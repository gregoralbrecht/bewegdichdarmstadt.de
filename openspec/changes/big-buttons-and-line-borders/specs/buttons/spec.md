# Spec Delta

## Purpose

What every button guarantees regardless of its label, size or surface, so it stays readable, easy to hit and steady under the pointer.

## ADDED Requirements

### Requirement: Labels wrap inside the column

A button, including its shadow, SHALL never be wider than the column it sits in. A label too long for one line SHALL wrap onto further lines and SHALL NOT be truncated.

#### Scenario: Long hero label on a phone

- **WHEN** the hero button reads "Jetzt kostenlos beim Lauftreff anmelden" in a 320px wide viewport
- **THEN** the label wraps, every word is fully visible, and the page does not scroll sideways

### Requirement: Touch target of at least 44px

Every button SHALL have a hit area at least 44px tall, even when its visible shape is smaller.

#### Scenario: Small button inside a card

- **WHEN** a card shows a small "Kalender" button
- **THEN** the area that responds to a tap or click is at least 44px tall

### Requirement: Hover does not flicker

The area that responds to the pointer SHALL stay where it is while the button lifts or presses, so a pointer resting anywhere on the button keeps a steady hover state.

#### Scenario: Pointer on the bottom-right edge

- **WHEN** the pointer rests on the button's bottom-right edge and the button lifts
- **THEN** the button stays hovered and does not switch back and forth
