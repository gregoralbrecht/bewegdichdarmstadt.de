# Spec Delta

## Purpose

What a wrapping row of short items always guarantees: when its items form a set, such as a run of dates, it is a list, so assistive technology announces how many there are and reads each one on its own.

## ADDED Requirements

### Requirement: A set of items is announced as a list

A cluster of items that form a set SHALL be exposed as a list with one list item per entry, in the order given, and SHALL keep the list role when its bullets are removed.

#### Scenario: Visitor checks the past Run & Rave dates

- **WHEN** a screen reader user reaches "Run & Rave 2026" under "Bisher" on `/`
- **THEN** they hear a list named "Run & Rave 2026" with four items, from "10. Juli" to "30. Oktober", and no "·" separators
