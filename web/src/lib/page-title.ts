export const SITE_NAME = "Beweg dich, Darmstadt!";

export function pageTitle(title?: string): string {
  const trimmed = title?.trim();
  return trimmed ? `${trimmed} | ${SITE_NAME}` : SITE_NAME;
}
