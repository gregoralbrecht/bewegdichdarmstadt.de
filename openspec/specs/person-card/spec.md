# person-card Specification

## Purpose
What a team card always guarantees: the person's name heads it, and until their photo arrives, the photo's place says so.

## Requirements

### Requirement: A missing photo shows a marked placeholder

A person card without a photo SHALL show, in the photo's place, a placeholder that reads "Foto folgt", and the card SHALL still be named by the person's name.

#### Scenario: Visitor looks at the team cards

- **WHEN** a visitor reaches "Wer wir sind" on `/`
- **THEN** Steffi's card and Lea's card each show a framed "Foto folgt" placeholder above the name, and each card's heading is the person's name
