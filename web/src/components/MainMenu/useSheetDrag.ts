import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type UIEvent as ReactUIEvent,
} from "react";

/** Past this share of the sheet's height, letting go closes it. */
const DISTANCE = 1 / 3;
/** Faster than this downward (px/ms) when let go, it's a flick and closes too. */
const FLICK = 0.5;
/** A list drag starts only once the finger has moved this far down, so a tap stays a tap. */
const SLOP = 6;
/** A finger that rests this long (ms) before letting go has no speed left. */
const REST = 100;

type Drag = {
  id: number;
  start: number;
  y: number;
  t: number;
  speed: number;
  active: boolean;
};

/**
 * Swipe-to-close for the drawer's sheet. A drag starts on anything outside the scrolling list (the
 * handle bar and the padding around it), or on the list once it's scrolled to the top and the finger
 * moves down. `--drag` on the sheet follows the finger; letting go past a third of the height, or
 * with a flick, closes it from where it is, otherwise it springs back (`data-settling`).
 */
export function useSheetDrag(close: () => void) {
  const sheet = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const dragged = useRef(false);

  const move = (offset: number) =>
    sheet.current?.style.setProperty("--drag", `${offset}px`);

  const end = (event: ReactPointerEvent, cancelled: boolean) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (!current.active || !sheet.current) return;
    sheet.current.removeAttribute("data-dragging");
    const offset = Math.max(0, event.clientY - current.start);
    const speed = event.timeStamp - current.t > REST ? 0 : current.speed;
    if (
      !cancelled &&
      (offset > sheet.current.offsetHeight * DISTANCE || speed > FLICK)
    ) {
      close();
      return;
    }
    sheet.current.setAttribute("data-settling", "");
    move(0);
  };

  const handlers = {
    onPointerDown(event: ReactPointerEvent<HTMLElement>) {
      if (event.button !== 0 || !sheet.current) return;
      const list = sheet.current.querySelector(".main-menu__dialog");
      const inList = list?.contains(event.target as Node) ?? false;
      if (inList && list!.scrollTop > 0) return;
      dragged.current = false;
      drag.current = {
        id: event.pointerId,
        start: event.clientY,
        y: event.clientY,
        t: event.timeStamp,
        speed: 0,
        active: !inList,
      };
      if (!inList) event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event: ReactPointerEvent<HTMLElement>) {
      const current = drag.current;
      if (!current || current.id !== event.pointerId || !sheet.current) return;
      const offset = event.clientY - current.start;
      if (!current.active) {
        // Moving up first means the list scrolls, not the sheet.
        if (offset < 0) drag.current = null;
        if (offset < SLOP) return;
        current.active = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      dragged.current = true;
      sheet.current.setAttribute("data-dragging", "");
      sheet.current.removeAttribute("data-settling");
      const elapsed = Math.max(1, event.timeStamp - current.t);
      current.speed =
        0.8 * ((event.clientY - current.y) / elapsed) + 0.2 * current.speed;
      current.y = event.clientY;
      current.t = event.timeStamp;
      move(Math.max(0, offset));
    },
    onPointerUp: (event: ReactPointerEvent) => end(event, false),
    onPointerCancel: (event: ReactPointerEvent) => end(event, true),
    // At the top, the list leaves downward swipes to the drag (see MainMenu.css).
    onScrollCapture(event: ReactUIEvent) {
      const list = event.target as HTMLElement;
      if (list.matches(".main-menu__dialog"))
        list.toggleAttribute("data-scrolled", list.scrollTop > 0);
    },
    // A drag that started on a link must not follow it when let go.
    onClickCapture(event: ReactMouseEvent) {
      if (!dragged.current) return;
      dragged.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };

  return { sheet, handlers };
}
