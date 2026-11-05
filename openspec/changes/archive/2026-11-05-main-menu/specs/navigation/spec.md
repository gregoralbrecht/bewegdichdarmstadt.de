# Spec Delta

## Purpose

The main menu: what it links to, when it is visible, and how it works on phones, with a keyboard and without JavaScript.

## ADDED Requirements

### Requirement: Main menu on every page

Every page SHALL offer a main menu with the links Start (`/`), Run & Rave (`/run-and-rave`), Festival (`/festival`) and Über uns (`/ueber-uns`), in that order, and every one of them SHALL lead to an existing page.

#### Scenario: Menu on a legal page

- **WHEN** a visitor opens `/impressum`
- **THEN** the main menu offers Start, Run & Rave, Festival and Über uns, and following each link loads a page without an error

### Requirement: Current page is marked

The menu link to the page the visitor is on SHALL carry `aria-current="page"` and SHALL look different from the other links by more than color alone.

#### Scenario: On the festival page

- **WHEN** a visitor opens `/festival`
- **THEN** only the Festival link has `aria-current="page"`, and it is drawn differently from the others in shape or outline, not only in color

### Requirement: Hides on scroll down, returns on scroll up

The menu SHALL move out of view while the visitor scrolls down and SHALL come back as soon as they scroll up. Near the top of the page it SHALL always be visible.

#### Scenario: Reading down, then back up

- **WHEN** a visitor scrolls down a long page, then scrolls up a little
- **THEN** the menu leaves the view while scrolling down and is fully visible again after scrolling up

### Requirement: Menu visible without JavaScript

Without JavaScript, the menu SHALL stay visible at all times, and every menu link SHALL still be reachable.

#### Scenario: Scripts disabled on a phone

- **WHEN** a visitor with JavaScript disabled opens any page in a 375px wide viewport and scrolls down
- **THEN** the menu stays visible and every menu link can be reached and followed

### Requirement: Keyboard focus never lands out of view

When keyboard focus moves into the menu, the menu SHALL be visible. The menu SHALL NOT cover the element that has focus.

#### Scenario: Shift+Tab back up the page

- **WHEN** a keyboard user tabs down a long page, then presses Shift+Tab back up, and later tabs into the menu
- **THEN** no focused page element is hidden behind the menu, and the menu is visible while one of its links has focus

### Requirement: Menu stands out on every surface

The menu's outline SHALL have a contrast ratio of at least 3:1 against every surface it can float over.

#### Scenario: Menu over a night section

- **WHEN** the menu comes back while a night section is behind it
- **THEN** its edge has a contrast ratio of at least 3:1 against the night background

### Requirement: Menu at the bottom edge on phones

On viewports too narrow for the logo and the full menu side by side, the menu SHALL sit at the bottom edge of the window as one button that opens every menu link. Escape or a close button SHALL close it again, and focus SHALL return to the button.

#### Scenario: Opening the menu on a phone

- **WHEN** a visitor taps "Menü" at the bottom of a 320px wide viewport
- **THEN** every menu link appears at once, and pressing Escape closes them and puts focus back on "Menü"

### Requirement: Menu never covers the footer

The menu SHALL NOT cover the footer's links when the visitor has scrolled to the end of a page.

#### Scenario: End of the page on a phone

- **WHEN** a visitor on a 320px wide viewport scrolls to the end of `/impressum` and the menu is visible
- **THEN** the Impressum, Datenschutz and Instagram links are fully visible and can be tapped

### Requirement: Menu respects reduced motion

When the visitor prefers reduced motion, the menu SHALL NOT slide in or out. It MAY appear and disappear instantly or fade.

#### Scenario: Scrolling with reduced motion

- **WHEN** a visitor with `prefers-reduced-motion: reduce` scrolls down, then up
- **THEN** the menu disappears and reappears without moving across the screen
