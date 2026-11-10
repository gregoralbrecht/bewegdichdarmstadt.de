# Spec Delta

## Purpose

What a call-to-action band always guarantees: it is a region named by its own h2, and it asks for one thing with one button that never competes with the page's hero button.

## ADDED Requirements

### Requirement: Named by its h2, one primary button

The CTA band SHALL be a region whose accessible name is its heading, that heading SHALL be an `h2`, and the band SHALL hold exactly one button, which SHALL NOT be hero-styled.

#### Scenario: Visitor reaches the donation band

- **WHEN** a screen reader user lists the regions on `/` and reaches "Kostenlos für alle."
- **THEN** that region is announced with its `h2` text and contains exactly one button-styled link, "Jetzt spenden", which is not hero-styled
