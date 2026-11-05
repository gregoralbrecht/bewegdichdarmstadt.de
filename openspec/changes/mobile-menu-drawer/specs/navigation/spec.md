# Spec Delta

## MODIFIED Requirements

### Requirement: Menu at the bottom edge on phones

On viewports too narrow for the logo and the full menu side by side, the menu SHALL sit at the bottom edge of the window as one button that opens every menu link in a sheet. Escape, a close button, a tap outside the sheet or swiping the sheet down SHALL close it again, and focus SHALL return to the button. A short drag that is released SHALL leave the sheet open.

#### Scenario: Opening the menu on a phone

- **WHEN** a visitor taps "Menü" at the bottom of a 320px wide viewport
- **THEN** every menu link appears at once, and pressing Escape closes them and puts focus back on "Menü"

#### Scenario: Swiping the sheet away

- **WHEN** a visitor drags the open sheet down past a third of its height, or flicks it down, and lets go
- **THEN** the sheet closes and focus is back on "Menü"

#### Scenario: A short drag

- **WHEN** a visitor drags the open sheet down a little and lets go slowly
- **THEN** the sheet settles back fully open

## ADDED Requirements

### Requirement: Taps leave no trace on menu controls

Tapping a menu link or the "Menü" button on a touch screen SHALL NOT draw a border, shadow or focus ring on it. The focus ring SHALL still appear when the control gets focus from the keyboard.

#### Scenario: Tapping "Menü"

- **WHEN** a visitor taps "Menü", then closes the sheet by tapping outside it
- **THEN** "Menü" shows no border, shadow or focus ring at any point
