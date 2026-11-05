# Proposal

## Why

On phones the "Menü" button flashes a border on every tap, and the sheet can't be swiped away like people expect. The square solid focus rings don't fit the comic look.

## What Changes

- The phone sheet becomes a React Aria drawer, hydrated on phones only. Dragging it down past a threshold, or flicking it, closes it. Escape, a tap outside, "Schließen" and focus return keep working.
- Menu controls show press styles only for a mouse or trackpad, and their focus ring only for the keyboard. A tap draws nothing.
- Every focus ring is dotted with rounded corners, like the reduced-motion hover underline.
- The desktop card and the no-JS bottom bar stay as they are.

Decisions:

- React Aria over the invoker-command `<dialog>`, because it brings touch-aware press and focus handling and exit animations, which drag-to-close needs.
- Own pointer-event drag code over a gesture or motion library, because React Aria has no drawer and a library would put the 100 KB page budget at risk.
- Hydrate with `client:media` over `client:load`, because desktop never needs the drawer and should ship no JavaScript for it.
- Guard press styles in the menu only, over all buttons, because `Button`'s press on tap reads as a real press.

Out of scope: drawer snap points, a drag handle on desktop, changing `Button`'s press.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `navigation`: the phone sheet can be swiped down to close, and taps draw no press flash or focus ring. (Defined by the `main-menu` change, which must be archived first.)
- `surfaces`: the keyboard focus outline is dotted with rounded corners.

## Impact

New dependency `react-aria-components`. New `MenuDrawer` island next to `MainMenu`; changes to `MainMenu`, `main-menu.ts`, `Base.astro`, the focus styles in `tokens.css`, `Button.css` and `index.astro`, and `docs/styleguide.md`. Phones now ship React and the drawer, measured against the 100 KB budget; desktop ships nothing new.
