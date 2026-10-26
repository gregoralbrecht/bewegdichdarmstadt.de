import { SITE_NAME } from "../../lib/page-title";
import "./Logo.css";

/** Stands in for the real logo: the site name as a text wordmark, linking home. Swap the file in here. */
export function Logo() {
  return (
    <a className="logo" href="/">
      {SITE_NAME}
    </a>
  );
}
