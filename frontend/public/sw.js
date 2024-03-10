if (!self.define) {
  let e,
    i = {};
  const n = (n, s) => (
    (n = new URL(n + ".js", s).href),
    i[n] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = i), document.head.appendChild(e);
        } else (e = n), importScripts(n), i();
      }).then(() => {
        let e = i[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, r) => {
    const o =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (i[o]) return;
    let t = {};
    const c = (e) => n(e, o),
      f = { module: { uri: o }, exports: t, require: c };
    i[o] = Promise.all(s.map((e) => f[e] || c(e))).then((e) => (r(...e), t));
  };
}
define(["./workbox-fa446783"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "assets/index-4e740814.css", revision: null },
        { url: "assets/index-84684694.js", revision: null },
        { url: "index.html", revision: "01bf855e783bf984a27a417d0664891d" },
        { url: "registerSW.js", revision: "1872c500de691dce40960bb85481de07" },
        { url: "favicon.ico", revision: "f2413d192135c1f5194f5e7016a8a4d0" },
        { url: "pwa-64x64.png", revision: "d701c68c99d7878c99e674e07ee980ee" },
        {
          url: "pwa-192x192.png",
          revision: "befb82638ebfb5c672ec7f706c36f760",
        },
        {
          url: "pwa-512x512.png",
          revision: "65d2283264dbc6fc7c46ed485302b02b",
        },
        {
          url: "manifest.webmanifest",
          revision: "b8d57f38bba01eea8bf3cc8f8a90f85a",
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))
    );
});
