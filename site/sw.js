const CACHE_NAME = "guobu-sop-v1-1789024041085";
const urlsToCache = ["./index.html","./manifest.json","./icon.svg","./images/img_0.jpg","./images/img_0.png","./images/img_1.jpg","./images/img_1.png","./images/img_10.jpg","./images/img_10.png","./images/img_11.jpg","./images/img_11.png","./images/img_12.jpg","./images/img_12.png","./images/img_13.jpg","./images/img_13.png","./images/img_14.jpeg","./images/img_14.jpg","./images/img_15.jpeg","./images/img_15.jpg","./images/img_16.jpeg","./images/img_16.jpg","./images/img_17.jpeg","./images/img_17.jpg","./images/img_18.jpeg","./images/img_18.jpg","./images/img_19.jpg","./images/img_19.png","./images/img_2.jpg","./images/img_2.png","./images/img_20.jpg","./images/img_20.png","./images/img_21.jpeg","./images/img_21.jpg","./images/img_22.jpg","./images/img_22.png","./images/img_23.jpeg","./images/img_23.jpg","./images/img_24.jpeg","./images/img_24.jpg","./images/img_25.jpeg","./images/img_25.jpg","./images/img_26.jpeg","./images/img_26.jpg","./images/img_27.jpeg","./images/img_27.jpg","./images/img_28.jpg","./images/img_28.png","./images/img_29.jpg","./images/img_29.png","./images/img_3.jpg","./images/img_3.png","./images/img_30.jpg","./images/img_30.png","./images/img_31.jpg","./images/img_31.png","./images/img_32.jpeg","./images/img_32.jpg","./images/img_33.jpg","./images/img_33.png","./images/img_34.jpeg","./images/img_34.jpg","./images/img_35.jpeg","./images/img_35.jpg","./images/img_36.jpeg","./images/img_36.jpg","./images/img_4.jpg","./images/img_4.png","./images/img_5.jpg","./images/img_5.png","./images/img_6.jpg","./images/img_6.png","./images/img_7.jpeg","./images/img_7.jpg","./images/img_8.jpg","./images/img_8.png","./images/img_9.jpg","./images/img_9.png","./images/佳明穿戴&苹果17AIR.jpg","./images/佳明穿戴&苹果17AIR.png","./images/四角齐全.jpg","./images/四角齐全.png","./images/手表SN合照.jpg","./images/手表SN合照.png","./images/派件操作SOP.jpg","./images/派件操作SOP.png","./images/游戏机.jpg","./images/游戏机.png","./images/相机SN码.jpg","./images/相机SN码.png","./images/相机镜头.jpg","./images/相机镜头.png","./images/能良苹果5张.jpg","./images/能良苹果5张.png","./images/苹果MINI小电脑.jpg","./images/苹果MINI小电脑.png"];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name.startsWith("guobu-sop-") && name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(event) {
  const requestUrl = new URL(event.request.url);
  const pathname = requestUrl.pathname;
  const isHtml = pathname.endsWith("index.html") || pathname.endsWith("/") || pathname.endsWith("/site");

  if (isHtml) {
    event.respondWith(
      fetch(event.request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          if (cached) { return cached; }
          return caches.match("./index.html");
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) { return response; }
        return fetch(event.request).then(function(networkResponse) {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
  }
});