# Naming

How the site names things. Copy, code, stories and specs all follow it.

| Use                       | Not                         | Notes                                                                                                                                                                                                                                                                                  |
| ------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Beweg dich, Darmstadt** | Bewegdich Darmstadt, BDD    | The project. With the comma. Page titles and the wordmark add an exclamation mark: "Beweg dich, Darmstadt!" (`SITE_NAME` in `web/src/lib/page-title.ts`).                                                                                                                              |
| **Run & Rave**            | Run Club, Run and Rave, RnR | The running event. The old site's "Run Club" is the same event, not a second format. Every Run & Rave is a registered demonstration, so "Demo" may describe it ("die Run & Rave Demo"), but it isn't part of the name. In HTML write `Run &amp; Rave`; in URLs and ids `run-and-rave`. |
| **Festival**              | Yoga Festival               | The project's festival, with the year when it matters: "Festival 2027". The "Yoga Festival Darmstadt" is a separate event that Steffi founded, not this one.                                                                                                                           |

The old site's text is in `source/content.md`, which keeps the old names as they were captured.
