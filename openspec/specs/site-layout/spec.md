# site-layout Specification

## Purpose

The shared page shell every page uses: what the footer always offers and where it sits.

## Requirements

### Requirement: Legal links on every page

Every page SHALL link to the Impressum (`/impressum`) and the Datenschutzerklärung (`/datenschutz`) from its footer.

#### Scenario: Footer links to the legal pages

- **WHEN** a visitor opens any page
- **THEN** the footer contains a link "Impressum" to `/impressum` and a link "Datenschutz" to `/datenschutz`

### Requirement: Instagram link on every page

Every page SHALL link to the Instagram account @bewegdichdarmstadt from its footer.

#### Scenario: Footer links to Instagram

- **WHEN** a visitor opens any page
- **THEN** the footer contains a link naming @bewegdichdarmstadt to `https://www.instagram.com/bewegdichdarmstadt/`

### Requirement: Footer at the bottom of the window

When a page's content is shorter than the window, the footer SHALL sit at the bottom edge of the window, not directly under the content.

#### Scenario: Page with only a heading

- **WHEN** a visitor opens `/impressum` in a window taller than its content
- **THEN** the bottom of the footer lines up with the bottom of the window and the page does not scroll
