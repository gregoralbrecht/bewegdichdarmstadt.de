# Spec Delta

## Purpose

Sets the technical bar that sets the site apart from a template site. It must be fast, private, accessible and robust, and honest about being a draft concept.

## ADDED Requirements

### Requirement: Performance budget
Each page SHALL score at least 95 in Lighthouse Performance on mobile emulation. It SHALL load at most 150 KB of HTML, CSS, JS and fonts combined (compressed, images excluded) and SHALL show no visible layout shift while loading (CLS < 0.05).

#### Scenario: Lighthouse mobile
- **WHEN** Lighthouse runs against the hub, Run & Rave and festival pages with mobile settings
- **THEN** each scores ≥ 95 Performance and reports CLS < 0.05

### Requirement: Responsive images
Photos SHALL be served in modern formats with appropriate sizes for the viewport, with intrinsic dimensions declared. Only the first-screen image of a page SHALL load eagerly.

#### Scenario: Phone
- **WHEN** a page is loaded at 390 px width
- **THEN** no photo larger than needed for that width (at 2x density) is downloaded, and below-the-fold photos load only when approached

### Requirement: No third parties, no tracking
Pages SHALL NOT request any resource from a third-party origin and SHALL NOT set cookies or use tracking. Consequently there SHALL be no cookie banner. External services (Komoot, maps, Instagram, donations) SHALL only be reached via ordinary links.

#### Scenario: Network audit
- **WHEN** a page is loaded with the network panel open
- **THEN** every request goes to the site's own origin and no cookies are set

### Requirement: Accessibility
Pages SHALL use semantic structure (landmarks, one H1, ordered headings) and be fully operable by keyboard with visible focus. Images SHALL have meaningful alt text (empty for purely decorative ones), and dialogs (share studio, photo view) SHALL trap and restore focus. Lighthouse Accessibility SHALL be at least 95.

#### Scenario: Keyboard only
- **WHEN** a visitor uses only the keyboard
- **THEN** they can reach every link and action, open and close the share studio and photo view, and always see where focus is

### Requirement: Offline after first visit
After a page has been visited once, that page, its styles, scripts, fonts and the meeting-point photos SHALL load without a network connection. A newer version SHALL replace the cached one on the next online visit.

#### Scenario: Offline reload
- **WHEN** a visitor has opened the hub once and later reopens it in airplane mode
- **THEN** the hub renders fully with styles and fonts, and the upcoming dates still compute correctly

#### Scenario: Update
- **WHEN** the site is updated and a returning visitor comes back online
- **THEN** they see the updated content no later than their next page load

### Requirement: Play layer stays out of the way
Playful features (cursor smiley, smiley backgrounds, confetti, rave mode) SHALL load only after the main content is visible. They SHALL count towards the performance budget, and SHALL NOT delay or block any information or action.

#### Scenario: Slow connection
- **WHEN** a page loads on a throttled 3G connection
- **THEN** the event information and "Wo? Wann?" button are usable before any play feature appears

### Requirement: Works without JavaScript
Without JavaScript, every page SHALL still show all content, including absolute event dates, and working links. Only the relative labels, countdown, quick-info sheet (its content remains reachable on the page), share studio and nudges, picker, gallery enlargement, offline mode and play features MAY be unavailable.

#### Scenario: JS disabled
- **WHEN** JavaScript is disabled
- **THEN** the hub shows the upcoming dates as absolute dates and all pages remain readable and navigable

### Requirement: Draft concept marking
Every page SHALL show an unobtrusive but clear marker that it is a design concept (e.g. "Entwurf – Konzept für Beweg dich, Darmstadt"). It SHALL instruct search engines not to index it.

#### Scenario: Search engines
- **WHEN** a crawler fetches any page
- **THEN** the page carries a noindex directive

#### Scenario: Visitor sees draft marker
- **WHEN** someone opens any page
- **THEN** a draft/concept marker is visible without obstructing content

### Requirement: Visible placeholders
Content that is not known yet SHALL appear as visibly styled placeholders, never as invented facts presented as real. This covers the exact meeting spot, the donation link, impact numbers, missing bios and photos, programme details and future dates.

#### Scenario: Impact numbers
- **WHEN** impact numbers are shown without confirmed data
- **THEN** they are visibly marked as example values
