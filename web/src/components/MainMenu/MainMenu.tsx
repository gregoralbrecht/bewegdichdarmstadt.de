import type { ReactNode } from "react";
import { isCurrent, menu } from "../../lib/menu";
import "./MainMenu.css";

export type Props = {
  /** The page's path, usually `Astro.url.pathname`; its link gets `aria-current="page"`. */
  current: string;
};

// Without JavaScript the drawer can't open, so phones get the links inline in the bottom bar
// instead. The breakpoint must match MainMenu.css.
const noscript = `
@media (width < 66em) {
  :root { --menu-room-bottom: var(--menu-room-bottom-inline); }
  .main-menu__card { display: block; top: auto; bottom: var(--menu-bottom); }
  .main-menu__bar { display: none; }
}`;

/** Every menu link; the card and the drawer's sheet both render this. */
export function Links({ current }: Props) {
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
 * The main menu: a fixed sticker card at the top on wide screens. On phones, `children` is the
 * `MenuDrawer` island, which puts a "Menü" button at the bottom edge. Static HTML; the script in
 * main-menu.ts only hides the menu while scrolling down.
 */
export function MainMenu({
  current,
  children,
}: Props & { children?: ReactNode }) {
  return (
    <div className="main-menu">
      <nav
        className="main-menu__card"
        data-surface="white"
        aria-label="Hauptmenü"
      >
        <Links current={current} />
      </nav>
      {children}
      <noscript>
        <style>{noscript}</style>
      </noscript>
    </div>
  );
}
