// Hides the main menu while scrolling down and brings it back on scroll up, by toggling
// data-menu="hidden"; MainMenu.css does the rest. Nothing here is required: without it the menu
// just stays put.

const THRESHOLD = 8;

const menu = document.querySelector<HTMLElement>(".main-menu");

if (menu) {
  // The drawer's sheet, portaled to <body> while it's open.
  const sheetOpen = () => document.querySelector(".main-menu__sheet") !== null;

  const header = menu.closest("header");
  // Clamped, so iOS overscroll past either end doesn't read as a change of direction.
  const position = () =>
    Math.min(
      Math.max(0, window.scrollY),
      document.documentElement.scrollHeight - window.innerHeight,
    );
  let last = position();
  let queued = false;

  const update = () => {
    queued = false;
    if (sheetOpen()) return;
    const y = position();
    if (y <= (header?.offsetHeight ?? 0)) {
      delete menu.dataset.menu;
      last = y;
      return;
    }
    if (Math.abs(y - last) < THRESHOLD) return;
    if (y > last) menu.dataset.menu = "hidden";
    else delete menu.dataset.menu;
    last = y;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
}
