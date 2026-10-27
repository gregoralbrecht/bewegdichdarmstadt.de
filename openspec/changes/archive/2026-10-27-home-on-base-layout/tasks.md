# Tasks

## 1. Homepage on the layout

- [x] 1.1 Wrap `web/src/pages/index.astro` in `Base.astro` with `title="Token-Vorschau"`, drop its own shell, font tags and `tokens.css` import, turn its `<header>` and `<main>` into `<div>`s; verify the built `dist/client/index.html` has exactly one `<header>`, one `<main id="main">`, one `<h1>`, the footer links and the title "Token-Vorschau | Beweg dich, Darmstadt!"
- [x] 1.2 Verify `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass, axe reports no issues on `/`, and the token preview looks unchanged apart from the new header and footer

## Log

- The page's own `header` style became `.intro` along with the `<div>`. Its other scoped styles (`ul` reset, `p` width) don't reach the layout's footer.
- Most of the diff in `index.astro` is re-indentation from the wrapper change.
- Verified with Playwright against `astro dev`: axe-core 4.14 reports no violations on `/` in Chromium and WebKit at 1280px and 320px, no horizontal scroll; a full-page screenshot shows the preview unchanged apart from header and footer.

## Workflow follow-up

- Archive with `openspec archive home-on-base-layout`.
