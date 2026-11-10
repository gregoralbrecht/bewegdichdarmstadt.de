# Spec Delta

## Purpose

What the hero at the top of a page always guarantees: it is the band named by the page's only h1, and its one button label stays readable.

## ADDED Requirements

### Requirement: Named by the page's h1

The hero SHALL be a region whose accessible name is its heading, and that heading SHALL be an `h1`.

#### Scenario: Screen reader lists landmarks

- **WHEN** a screen reader user lists the regions on a page with a hero
- **THEN** the first region is announced with the hero's `h1` text

### Requirement: Runs up behind the header

The hero's background SHALL be one continuous area from the window's top edge, behind the logo and the menu, with no seam where the header ends. The logo and the menu SHALL stay in the page's banner landmark, outside `main`, and SHALL NOT overlap the hero's content.

#### Scenario: Visitor opens the home page

- **WHEN** a visitor opens `/` at 320px or 1280px, scrolled to the top
- **THEN** the hero's background starts at the window's top edge and runs unbroken behind the logo, the logo is readable on it and clear of the h1, and the logo and menu are inside `<header>`, not inside `<main>`

### Requirement: Hero label wraps without hyphens

The hero button's label SHALL wrap only at spaces or marked break points and SHALL NOT show a hyphen the label doesn't contain.

#### Scenario: Instagram handle on a phone and on desktop

- **WHEN** the hero button reads "Folge @bewegdichdarmstadt" at 320px and at 1280px
- **THEN** no line of the label ends in a hyphen, every letter is visible, and the page does not scroll sideways
