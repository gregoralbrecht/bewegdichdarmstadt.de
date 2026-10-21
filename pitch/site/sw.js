// Offline support (design D17): pages network-first, static assets stale-while-revalidate, versioned caches.
// Bump VERSION on every deploy so returning visitors drop old caches.
const VERSION = "v1";
const CACHE = `bdd-${VERSION}`;
const PRECACHE = [
  "/", "/run-and-rave/", "/festival-2027/",
  "/assets/css/site.css",
  "/assets/js/schedule.js", "/assets/js/time-ui.js", "/assets/js/quick-info.js", "/assets/js/ui.js",
  "/assets/js/share.js", "/assets/js/invite.js", "/assets/js/confetti.js",
  "/assets/fonts/bricolage-display.woff2", "/assets/fonts/figtree.woff2",
  "/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("bdd-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;

  if (req.mode === "navigate") {
    // Network first, so updates show up as soon as the visitor is online.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(url.pathname, copy));
          return res;
        })
        .catch(() => caches.match(url.pathname).then((hit) => hit || caches.match("/")))
    );
    return;
  }

  // Static assets: stale-while-revalidate – answer from cache instantly, refresh it in the background.
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req, { ignoreSearch: true }).then((hit) => {
        const refresh = fetch(req)
          .then((res) => {
            if (res.ok && res.type === "basic") cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        if (hit) event.waitUntil(refresh);
        return hit || refresh;
      })
    )
  );
});
