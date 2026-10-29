export type MenuItem = {
  label: string;
  href: string;
};

/** The main menu, in order. Both the desktop card and the mobile sheet render from this list. */
export const menu: MenuItem[] = [
  { label: "Start", href: "/" },
  { label: "Run & Rave", href: "/run-and-rave" },
  { label: "Festival", href: "/festival" },
  { label: "Über uns", href: "/ueber-uns" },
];

const trim = (path: string) => path.replace(/\/+$/, "") || "/";

/** Whether `href` is the page at `pathname`. A trailing slash doesn't count; `/` matches only itself. */
export function isCurrent(href: string, pathname: string): boolean {
  return trim(href) === trim(pathname);
}
