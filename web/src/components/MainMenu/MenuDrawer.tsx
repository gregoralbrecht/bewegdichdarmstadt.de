import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Links, type Props } from "./MainMenu";
import { useSheetDrag } from "./useSheetDrag";

/** Matches MainMenu.css: from here on the card shows and the drawer has no business being open. */
const WIDE = "(width >= 66em)";

/**
 * The phone menu: a "Menü" button in the bottom bar that opens every menu link in a bottom sheet.
 * An island, hydrated on phones only (`client:media`), passed to `MainMenu` as its child. React
 * Aria handles focus, Escape, the tap outside and the exit animation, and only flags keyboard focus
 * and presses, so a tap leaves no trace. Swiping the sheet down closes it (useSheetDrag).
 */
export function MenuDrawer({ current }: Props) {
  const [isOpen, setOpen] = useState(false);
  const { sheet, handlers } = useSheetDrag(() => setOpen(false));

  // A sheet left open while the window widens would float over the card.
  useEffect(() => {
    const wide = window.matchMedia(WIDE);
    const close = () => wide.matches && setOpen(false);
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, []);

  return (
    <div className="main-menu__bar" data-surface="white">
      <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
        <Button className="main-menu__link">Menü</Button>
        <ModalOverlay className="main-menu__backdrop" isDismissable>
          <Modal ref={sheet} className="main-menu__sheet" data-surface="white">
            <div className="main-menu__drag" {...handlers}>
              <div className="main-menu__handle" aria-hidden="true" />
              <Dialog className="main-menu__dialog" aria-label="Menü">
                <nav aria-label="Hauptmenü">
                  <Links current={current} />
                </nav>
                <Button
                  slot="close"
                  className="main-menu__link main-menu__close"
                >
                  Schließen
                </Button>
              </Dialog>
            </div>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
  );
}
