# Proposal

## Why

The homepage (the token preview) still brings its own `<html>` shell, so it has no skip link, header or footer. The `site-layout` spec says every page links to Impressum and Datenschutz from its footer; `/` doesn't yet.

## What Changes

- `web/src/pages/index.astro` renders inside `Base.astro` with the title "Token-Vorschau". Its own `<html>`, `<head>`, font tags and `tokens.css` import go; `Base.astro` provides them.
- The page's own `<header>` and `<main>` become plain `<div>`s, so the page has one banner and one main landmark.

Out of scope: replacing the token preview with a real homepage, the trailing-slash redirect.

Decisions:

- Keep the preview's "Beweg dich, Darmstadt!" `<h1>` over dropping it, because the page still needs one `<h1>` and the preview is temporary.

## Capabilities

### New Capabilities

None. `/` now meets the existing `site-layout` requirements, so `skip_specs: true`.

### Modified Capabilities

None.

## Impact

`web/src/pages/index.astro`. No new dependencies.
