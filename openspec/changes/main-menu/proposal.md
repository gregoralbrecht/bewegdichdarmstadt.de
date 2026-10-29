# Proposal

## Why

The site has a logo and nothing else to navigate with. Visitors need to reach Run & Rave, the Festival and the About page from any page, and on a phone with one thumb.

## What Changes

- New `MainMenu` component in `Base.astro` with Start, Run & Rave, Festival and Über uns, built from one data list.
- Desktop: the logo stays at the top left and scrolls away. The menu is a white sticker card, centered and fixed at the top, with a cream die-cut edge so it stands out on every surface.
- Mobile: a fixed "Menü" button at the bottom edge opens a bottom sheet (`<dialog>`) listing every item.
- The menu hides while scrolling down and comes back on scroll up. It is always shown near the top of the page, while focus is inside it, and without JavaScript.
- The current page is marked with `aria-current="page"` and drawn as pressed in.
- Placeholder pages `/run-and-rave`, `/festival` and `/ueber-uns` (noindex), so no menu link leads to a 404.

Decisions:

- Fixed over sticky, because a sticky element can't leave its short `<header>`, and fixed works the same at the top and the bottom.
- A bottom sheet over a tab bar, because "Run & Rave" and future items don't fit four tabs at 320px.
- Invoker commands (`commandfor`) over a React island, because the dialog opens without hydrating anything. A few lines of script cover the scroll direction and older browsers.
- `/festival` over `/festival-2027`, because one URL that stays the same every year keeps links and shares working.

Out of scope: the "Neu"/"Bald" highlight label (the item data stays open for it), real content for the new pages, a CTA in the menu.

## Capabilities

### New Capabilities

- `navigation`: the main menu, what it links to, when it is visible, and how it works on phones, with a keyboard and without JavaScript.

### Modified Capabilities

None.

## Impact

New `web/src/components/MainMenu/` (component, CSS, stories), `web/src/lib/menu.ts`, `Base.astro`, new `pages/run-and-rave.astro`, `pages/festival.astro` and `pages/ueber-uns.astro`, and the Components section of `docs/styleguide.md`. No new dependencies.
