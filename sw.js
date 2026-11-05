/* Service Worker ของ "แผนที่สายเทค 19 หัวข้อ": ทำให้เปิดได้แม้ไม่มีอินเทอร์เน็ต
   - App shell (หน้าเว็บ ฟอนต์ ไอคอน highlight.js) บันทึกตอนติดตั้ง
   - เนื้อหา topics/*.html เก็บใน CONTENT_CACHE ซึ่งหน้าเว็บสั่งบันทึกทั้งหมดได้ และไม่ถูกลบเมื่ออัปเดตเวอร์ชัน
   - HTML ใช้ Network-first (ออนไลน์ได้ของใหม่เสมอ ออฟไลน์ใช้ของที่บันทึกไว้) ไฟล์ใน assets/ ใช้ Cache-first */
const VERSION = "2026-11-05.1";
const SHELL_CACHE = "tr19-shell-" + VERSION;
const CONTENT_CACHE = "tr19-content-v1";
const NETWORK_TIMEOUT_MS = 4000;
const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/fonts.css",
  "./assets/offline.js",
  "./assets/hljs/highlight.min.js",
  "./assets/hljs/powershell.min.js",
  "./assets/hljs/dockerfile.min.js",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL_FILES.map((u) => new Request(u, { cache: "reload" })));
    // อ่านรายชื่อไฟล์ฟอนต์จาก fonts.css จะได้ไม่ต้องเขียนชื่อไฟล์ซ้ำในที่นี้
    const css = await (await cache.match("./assets/fonts.css")).text();
    const fonts = [...css.matchAll(/url\((fonts\/[^)]+)\)/g)].map((m) => "./assets/" + m[1]);
    await cache.addAll([...new Set(fonts)]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith("tr19-shell-") && n !== SHELL_CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then((v) => { clearTimeout(timer); resolve(v); }, (e) => { clearTimeout(timer); reject(e); });
  });
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await withTimeout(fetch(request), NETWORK_TIMEOUT_MS);
    if (response.ok) await cache.put(fallbackUrl || request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(fallbackUrl || request, { ignoreSearch: true });
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(SHELL_CACHE)).put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname.slice(self.registration.scope.length - self.location.origin.length);

  if (request.mode === "navigate" || path === "" || path === "index.html") {
    event.respondWith(networkFirst(request, SHELL_CACHE, "./index.html"));
  } else if (path.startsWith("topics/")) {
    event.respondWith(networkFirst(request, CONTENT_CACHE));
  } else if (path.startsWith("assets/") || path === "manifest.webmanifest") {
    event.respondWith(cacheFirst(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "version") event.source.postMessage({ type: "version", version: VERSION });
});
