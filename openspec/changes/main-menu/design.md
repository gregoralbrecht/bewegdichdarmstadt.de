# Design

## Context

`Base.astro` has a `<header class="wrap">` holding only `<Logo />`. Components are React `.tsx`, rendered to static HTML with no `client:*`. Shadows and borders take their color from `--line` at the use site, so they follow the surface the element sits on. A menu that floats over every section can't rely on that.

## Decisions

**Two lists from one data array, one shown per breakpoint.** `MainMenu` renders the desktop card list and, separately, a `<dialog>` with the same items for mobile. The hidden one is `display: none`, so assistive tech only ever meets one. The alternative was one list that acts as an inline card on desktop and a dialog on mobile, either by forcing a closed `<dialog>` or a `[popover]` to display. That fights the browser's own rendering and makes the dialog's role and focus behavior unreliable. The duplicate is a handful of links, written once in `lib/menu.ts`.

**A fixed position with its own surface and a halo.** The card is `data-surface="white"` (ink text, ink border, ink `--shadow`) and gets a cream die-cut edge: a second `box-shadow` ring with spread that wraps both the border and the shadow. Ink against cream, or cream against ink and night, always reaches 3:1, whatever is behind. Desktop: `position: fixed; top`, centered on the window. The logo stays in normal flow in `<header>`, which reserves the card's height so nothing jumps. Mobile: the same mechanism at `bottom`, plus `env(safe-area-inset-bottom)`. `<body>` gets a matching `padding-bottom` so the footer is never covered.

**Scroll direction in a small Astro `<script>`, never required.** One passive scroll listener with `requestAnimationFrame`. It ignores changes under about 8px, clamps a negative `scrollY` (iOS overscroll), always shows the menu within the header's height of the top, and stays frozen while the dialog is open. It sets `data-menu="hidden"` on the menu. CSS translates the menu out only under that attribute, so without the script nothing ever hides. `:focus-within` overrides the hidden state. `scroll-padding-top` (desktop) and `scroll-padding-bottom` (mobile) keep focused elements clear of the menu. Under reduced motion the transition is `opacity` only.

**The dialog opens through invoker commands, with a script fallback.** "Menü" is `<button commandfor="menu-sheet" command="show-modal">`, and the sheet's close button is `command="close"`. The same `<script>` adds a click handler that calls `showModal()` when `HTMLButtonElement.prototype` lacks `command`. Without any JS the sheet can't open, so the mobile fallback is a `<noscript>` style that shows the mobile list as an inline bar instead of the button.

**The current page comes from `Astro.url.pathname`.** `Base.astro` passes it to `MainMenu`. The match ignores a trailing slash, and `/` matches only exactly.

## Risks / Trade-offs

- [Two lists drift] → both render from the same `menu.ts` array, and a story checks that their links are equal.
- [The fixed card covers a heading at the top] → the header reserves the card's height, and `scroll-padding-top` covers anchor jumps.
- [Bottom bar collides with Safari's own toolbar] → safe-area inset, and test on an iPhone before archiving.
