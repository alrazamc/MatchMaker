if ("function" === typeof importScripts) {
  importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
  // Global workbox
  if (workbox) {
    workbox.setConfig({ debug: true });
    self.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
      }
    });
    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute([]);
    // Font caching
    workbox.routing.registerRoute(
      new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "googleapis",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 30
          })
        ]
      })
    );
    // Image caching
    workbox.routing.registerRoute(
      new RegExp("https://matchmaker-images.s3.amazonaws.com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 1000,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
          }),
          {
            cacheKeyWillBeUsed: async ({request, mode}) => {
              return request.url.split("?")[0];
            }
          }
        ]
      })
    );
    
    workbox.routing.registerRoute(
      new RegExp("/api/user/profile"),
      new workbox.strategies.NetworkFirst()
    );
    workbox.routing.registerRoute(
      new RegExp("/api/request/list"),
      new workbox.strategies.NetworkFirst()
    );
    workbox.routing.registerRoute(
      new RegExp("/api/people/profile"),
      new workbox.strategies.NetworkFirst()
    );
    workbox.routing.registerRoute(
      new RegExp("/api/notifications"),
      new workbox.strategies.NetworkFirst()
    );
    workbox.routing.registerRoute(
      new RegExp("/api/system(.*)"),
      workbox.strategies.staleWhileRevalidate({
        cacheName: "system",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 // 20 Days
          })
        ]
      })
    ); 
  
  } else {
  
    console.error("Workbox could not be loaded. No offline support");
  
  }
}