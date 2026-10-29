import { isCurrent, menu } from "../../lib/menu";
import "./MainMenu.css";

export type Props = {
  /** The page's path, usually `Astro.url.pathname`; its link gets `aria-current="page"`. */
  current: string;
};

const SHEET_ID = "main-menu-sheet";

// Without JavaScript, older browsers can't open the sheet, so phones get the links inline in the
// bottom bar instead. The breakpoint must match MainMenu.css.
const noscript = `
@media (width < 66em) {
  :root { --menu-room-bottom: var(--menu-room-bottom-inline); }
  .main-menu__card { display: block; top: auto; bottom: var(--menu-bottom); }
  .main-menu__bar { display: none; }
}`;

function Links({ current }: Props) {
  return (
    <ul className="main-menu__list" role="list">
      {menu.map(({ label, href }) => (
        <li key={href}>
          <a
            className="main-menu__link"
            href={href}
            aria-current={isCurrent(href, current) ? "page" : undefined}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The main menu: a fixed sticker card at the top on wide screens, a "Menü" button at the bottom
 * edge on phones that opens the same links in a bottom sheet. Static HTML; the script in
 * main-menu.ts only hides it while scrolling down and opens the sheet in older browsers.
 */
export function MainMenu({ current }: Props) {
  return (
    <div className="main-menu">
      <nav
        className="main-menu__card"
        data-surface="white"
        aria-label="Hauptmenü"
      >
        <Links current={current} />
      </nav>
      <div className="main-menu__bar" data-surface="white">
        <button
          type="button"
          className="main-menu__link"
          commandfor={SHEET_ID}
          command="show-modal"
          aria-haspopup="dialog"
        >
          Menü
        </button>
      </div>
      <dialog
        id={SHEET_ID}
        className="main-menu__sheet"
        data-surface="white"
        aria-label="Menü"
        closedby="any"
      >
        <nav aria-label="Hauptmenü">
          <Links current={current} />
        </nav>
        <button
          type="button"
          className="main-menu__link main-menu__close"
          commandfor={SHEET_ID}
          command="close"
        >
          Schließen
        </button>
      </dialog>
      <noscript>
        <style>{noscript}</style>
      </noscript>
    </div>
  );
}
