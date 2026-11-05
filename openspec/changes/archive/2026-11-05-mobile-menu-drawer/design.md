# Design

## Context

`MainMenu.tsx` renders static HTML: the desktop card, the phone bar with an invoker-command "Menü" button, and a `<dialog>` sheet. `main-menu.ts` hides the menu on scroll and looks for that `<dialog>` to freeze while it's open. Menu links draw a border and shadow on `:active` for every pointer, which is the tap flash. Focus rings come from `:focus-visible` in `tokens.css` (3px solid), and `Button.css` draws its own ring on `.button__face`, whose corners are sharp.

## Decisions

**The phone bar and sheet become an island; the card stays static.** A new `MenuDrawer.tsx` holds the "Menü" button and a React Aria `DialogTrigger` > `ModalOverlay` > `Modal` > `Dialog` with the same `Links`. `MainMenu` keeps the card and the noscript style, and takes the drawer as `children`, so `Base.astro` writes `<MainMenu><MenuDrawer client:media="(width < 66em)" /></MainMenu>` and both stay inside `.main-menu` for `:focus-within` and `data-menu`. Astro server-renders the button, so the bar appears before hydration; a tap in that moment does nothing. A static `MainMenu` can't hydrate its own child, which is why the island sits in `Base.astro`.

**Drag is pointer events on the sheet, about 60 lines in a `useSheetDrag` hook.** A drag starts on `pointerdown` in the sheet's top area (a visible handle bar plus the padding around it) or anywhere once the link list is scrolled to the top. `touch-action: none` on the handle stops the page from scrolling. While dragging, the sheet follows the finger through `--drag` (`translateY`, never above 0) with no transition. On release it closes if the drag passes a third of the sheet's height or ends faster than about 0.5px/ms downward; otherwise it springs back with `--ease-spring`. Closing sets the React Aria state, and the exit animation starts from `--drag`, so the sheet keeps moving from where the finger left it. Under reduced motion the sheet still follows the finger, because the person is moving it, but it opens, closes and settles back with a fade, never a slide.

**Enter and exit through React Aria's `data-entering`/`data-exiting`.** CSS keyframes slide the sheet up from below and fade the backdrop; React Aria waits for the exit animation before unmounting. `isDismissable` gives tap-outside, `isKeyboardDismissDisabled` stays off for Escape, and focus returns to the trigger on close.

**Touch never shows press or focus.** The "Menü" and "Schließen" buttons are React Aria `Button`s styled through `[data-pressed]` and `[data-focus-visible]`, which React Aria only sets for keyboard focus. For the static card links, `:active` styles move under `@media (hover: hover) and (pointer: fine)`. The global `:focus-visible` stays for everything else; browsers already skip it after a tap.

**Dotted rounded rings: an outline where the shape allows, a pseudo-element where it doesn't.** `tokens.css` gets `--radius-focus` (0.5rem) and the rule becomes `outline: 3px dotted var(--focus)`. `:where(a, button, summary, [tabindex])` gets `border-radius: var(--radius-focus)`, so plain links and controls, whose only visible shape is the outline, get round corners at zero specificity, and every component's own radius wins. `Button` keeps its sharp face: its ring moves to a `.button__face::after` with a dotted border and `--radius-focus`, drawn 3px outside the face. Menu links already have rounded corners, so their outline just turns dotted. The index preview card's `:has(:focus-visible)` outline turns dotted and stays square, because that page is temporary.

**`main-menu.ts` freezes on the open drawer.** It checks for `.main-menu__sheet` in the document (React Aria portals the modal to `<body>`), and drops the invoker-command fallback.

## Risks / Trade-offs

- [React plus React Aria on phones breaks the 100 KB CSS+JS budget] → import only `DialogTrigger`, `Modal`, `ModalOverlay`, `Dialog` and `Button`, and measure the gzipped total of `/` at 320px. If it's over budget, stop and decide before going on.
- [A drag fights the link list's own scroll] → drags start on the handle, or in the list only when it's scrolled to the top and the finger moves down.
- [Dotted outlines draw as squares in Safari and round dots in Chrome] → accepted; both read as dotted.
- [A sheet left open while the window widens past 66em] → the drawer closes itself when that media query starts matching.
