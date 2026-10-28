// Asistan service worker: bildirimleri gösterir ve tıklanınca uygulamayı açar.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Asistan", {
      body: data.body || "",
      icon: "icon-192.png",
      badge: "icon-192.png",
      tag: "gunluk-ozet",
      data: { url: data.url || "./" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || "./", self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windows) => {
      for (const w of windows) {
        if (w.url.startsWith(self.registration.scope)) {
          try { await w.navigate(url); } catch (e) { /* bazı tarayıcılar izin vermez */ }
          return w.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
