# Spec Delta

## Purpose

What a list of short facts always guarantees: it is a description list, so assistive technology announces every term together with its one detail.

## ADDED Requirements

### Requirement: Each term paired with its detail

A fact list SHALL be a description list in which every term has exactly one detail, in the order given.

#### Scenario: Visitor checks the Run & Rave facts

- **WHEN** a screen reader user reaches the facts in "Du musst nicht schnell sein. Du musst nicht mal laufen." on `/`
- **THEN** they hear a description list of five terms, each followed by its detail, starting with "Treffpunkt" and "Friedensplatz"
