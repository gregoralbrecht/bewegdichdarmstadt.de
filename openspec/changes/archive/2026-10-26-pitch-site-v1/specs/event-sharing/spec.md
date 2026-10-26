# Spec Delta

## Purpose

Turns visitors into recruiters. Anyone can invite friends to a specific event with a good-looking image or a personal link, without an account and without a server.

## ADDED Requirements

### Requirement: Share entry points
Every upcoming Run & Rave, Run Club and festival event SHALL offer a "Sag's weiter" action that opens the share studio for that specific event, with the event pre-selected.

#### Scenario: Open from the Run & Rave hero
- **WHEN** a visitor taps "Sag's weiter" on the next Run & Rave
- **THEN** the share studio opens, showing a preview for that date

### Requirement: Share image composition
The share studio SHALL compose an image from a chosen format (Story 9:16 or Post 4:5), a chosen look (one of the brand colours or one of several event photos), a chosen slogan (from a predefined list) and an optional first name. The event's absolute date, time and meeting place SHALL always be on the image. The preview SHALL update live as choices change.

#### Scenario: Story with name
- **WHEN** a visitor chooses Story, the orange look, slogan "Kommst du mit?" and name "Gregor"
- **THEN** the preview shows a 9:16 image with that slogan, "Gregor ist dabei", "Fr, 30.10. · 17:30 · Friedensplatz" and the smiley

#### Scenario: Absolute date on images
- **WHEN** an image is created the day before the event
- **THEN** it shows the calendar date, not "MORGEN", because the image will be seen later

### Requirement: Sharing and saving
Where the device supports sharing files, "Teilen" SHALL hand the image and invite link to the device's share sheet. Otherwise the studio SHALL offer "Bild speichern" (download as PNG) and "Link kopieren".

#### Scenario: Phone with share sheet
- **WHEN** a visitor on a current iOS or Android phone taps "Teilen"
- **THEN** the native share sheet opens with the image attached, so it can go to Instagram Stories, WhatsApp or Signal

#### Scenario: Desktop fallback
- **WHEN** the browser cannot share files
- **THEN** "Bild speichern" downloads the PNG and "Link kopieren" copies the invite link and confirms it visibly

### Requirement: Personal invite link
The studio SHALL produce an invite link to the event's page that encodes the event and, if given, the inviter's first name. The name SHALL be carried only in the URL fragment so it is never sent to the server.

#### Scenario: Link with name
- **WHEN** "Gregor" invites to the Run & Rave of 30 Oct 2026
- **THEN** the link has the form `/run-and-rave/#einladung/runrave-2026-10-30/Gregor`

#### Scenario: Link without name
- **WHEN** no name is entered
- **THEN** the link still identifies the event, and the landing state uses a generic greeting

### Requirement: Invite landing state
Opening an invite link SHALL show a personalised greeting at the top of the event page ("Gregor ist dabei. Du auch?"), focused on that event's date, place, calendar action and its own "Sag's weiter" action. Names SHALL be shown as plain text only and limited in length.

#### Scenario: Friend opens invite
- **WHEN** a friend opens `/run-and-rave/#einladung/runrave-2026-10-30/Gregor` before the event
- **THEN** the page greets them with "Gregor ist dabei. Du auch?" and the countdown for 30 Oct

#### Scenario: Invite for a past event
- **WHEN** the invited event has already passed
- **THEN** the greeting says the event is over and points to the next date of that format

#### Scenario: Malicious name
- **WHEN** the fragment contains markup or an overly long name
- **THEN** it is shown as escaped text, truncated to 30 characters, and never interpreted as HTML

### Requirement: Share nudges
The site SHALL invite sharing at moments of high motivation: right after "In den Kalender", on an invite landing ("Bring deine +1 mit"), on event day before the start ("Noch schnell jemandem schreiben?") and in the after-event thank-you. A nudge SHALL be inline (never a blocking pop-up) and dismissible, and SHALL open the share studio for that event. At most one nudge SHALL appear per visit.

#### Scenario: After adding to calendar
- **WHEN** a visitor taps "In den Kalender" for the Run & Rave
- **THEN** an inline message "Wer kommt mit?" appears next to the action, offering "Sag's weiter"

#### Scenario: Only once
- **WHEN** a visitor has already seen or dismissed a nudge during this visit
- **THEN** no further nudge appears until a later visit

### Requirement: Share celebration
After a successful share, saved image or copied link, the site SHALL acknowledge it with a short celebratory animation and a thank-you ("Danke fürs Weitersagen!").

#### Scenario: Link copied
- **WHEN** a visitor taps "Link kopieren"
- **THEN** the link is copied, a short smiley confetti burst plays and "Danke fürs Weitersagen!" is shown

#### Scenario: Reduced motion
- **WHEN** the visitor prefers reduced motion
- **THEN** only the thank-you message is shown, without confetti

### Requirement: Link previews
Shared links to each page SHALL produce a branded preview (title, description, image) in messengers and social apps. Personalisation is not required for previews.

#### Scenario: WhatsApp preview
- **WHEN** an invite link to the Run & Rave page is pasted into WhatsApp
- **THEN** the preview shows the Run & Rave title, a short description and the Run & Rave preview image
