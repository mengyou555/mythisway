/* โหมดออฟไลน์และการติดตั้งเป็นแอป
   - ลงทะเบียน sw.js และบันทึกเนื้อหาทุกส่วน (topics/*.html) ลง Cache "tr19-content-v1" ชื่อเดียวกับใน sw.js
   - ปุ่มในหัวเว็บแสดงสถานะ: ยังไม่บันทึก / กำลังบันทึก (วงแหวนความคืบหน้า) / พร้อมอ่านออฟไลน์ / ไม่มีอินเทอร์เน็ต
   - ครั้งแรกที่เปิดขณะออนไลน์จะเริ่มบันทึกทั้งหมดให้เอง เว้นแต่เครื่องเปิดโหมดประหยัดข้อมูล */
(function () {
  "use strict";
  var CONTENT_CACHE = "tr19-content-v1";
  var CONCURRENCY = 4;
  var $ = function (id) { return document.getElementById(id); };
  var btn = $("off-btn"), label = $("off-label"), panel = $("off-panel");
  if (!btn || !panel) return;

  var supported = "serviceWorker" in navigator && "caches" in window && location.protocol !== "file:";
  var content = window.TR19_CONTENT || {};
  var urls = [];
  Object.keys(content).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
    for (var k = 1; k <= content[n]; k++) urls.push("topics/t" + (n < 10 ? "0" : "") + n + "-p" + k + ".html");
  });
  var abs = function (u) { return new URL(u, location.href).href; };
  var st = { saved: 0, total: urls.length, running: false, failed: 0, bytes: 0, persisted: null, usageMB: null };
  var deferredPrompt = null;
  var clearArmed = null;
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  /* ---------- การแจ้งเตือนสั้นด้านล่างจอ ---------- */
  var toastTimer = null;
  function toast(text, actionLabel, action) {
    var t = $("toast"), b = $("toast-btn");
    $("toast-text").textContent = text;
    b.hidden = !actionLabel;
    b.textContent = actionLabel || "";
    b.onclick = action || null;
    t.hidden = false;
    clearTimeout(toastTimer);
    if (!actionLabel) toastTimer = setTimeout(function () { t.hidden = true; }, 4500);
  }

  /* ---------- แสดงสถานะ ---------- */
  function pct() { return st.total ? Math.round(st.saved / st.total * 100) : 0; }
  function render() {
    var online = navigator.onLine !== false;
    var state = !online ? "offline" : st.running ? "saving" : (st.saved >= st.total && st.total) ? "ready" : st.saved ? "partial" : "idle";
    btn.setAttribute("data-state", state);
    panel.setAttribute("data-state", state);
    btn.style.setProperty("--pct", state === "ready" ? 100 : pct());
    var text = {
      idle: "อ่านออฟไลน์",
      partial: "บันทึกแล้ว " + pct() + "%",
      saving: "กำลังบันทึก " + pct() + "%",
      ready: "พร้อมอ่านออฟไลน์",
      offline: "ออฟไลน์อยู่"
    }[state];
    label.textContent = text;
    btn.setAttribute("aria-label", text + " (บันทึกแล้ว " + st.saved + " จาก " + st.total + " ส่วน)");

    $("off-status").textContent =
      state === "ready" ? "เนื้อหาครบ " + st.total + " ส่วนอยู่ในเครื่องแล้ว เปิดได้แม้ไม่มีอินเทอร์เน็ต" :
      state === "saving" ? "กำลังบันทึก " + st.saved + " จาก " + st.total + " ส่วน..." :
      state === "offline" ? "ไม่มีอินเทอร์เน็ต เปิดได้ " + st.saved + " จาก " + st.total + " ส่วนที่บันทึกไว้" :
      "บันทึกแล้ว " + st.saved + " จาก " + st.total + " ส่วน";
    $("off-fill").style.width = pct() + "%";
    var meta = [];
    if (st.usageMB !== null) meta.push("ใช้พื้นที่ในเครื่องประมาณ " + st.usageMB + " MB");
    if (st.persisted === true) meta.push("เบราว์เซอร์จะไม่ลบข้อมูลนี้เอง");
    if (st.failed) meta.push("บันทึกไม่สำเร็จ " + st.failed + " ส่วน กดบันทึกอีกครั้งได้");
    if (!meta.length) meta.push("เนื้อหาทั้งหมดประมาณ 16 MB บันทึกครั้งเดียว ใช้ได้ทุกหัวข้อ");
    $("off-meta").textContent = meta.join(" · ");

    var save = $("off-save");
    save.disabled = st.running || !online;
    var full = st.saved >= st.total && st.total > 0;
    panel.setAttribute("data-full", full ? "1" : "0");
    save.textContent = st.running ? "กำลังบันทึก..." :
      !online ? (full ? "อัปเดตเนื้อหาได้เมื่อต่ออินเทอร์เน็ต" : "ต่ออินเทอร์เน็ตเพื่อบันทึกส่วนที่เหลือ") :
      full ? "อัปเดตเนื้อหาให้เป็นล่าสุด" : "บันทึกทั้งหมดไว้ในเครื่อง";

    var banner = $("net-banner");
    banner.hidden = online;
    $("net-banner-text").textContent = st.saved >= st.total && st.total
      ? "เปิดได้ทุกส่วน เพราะบันทึกไว้ในเครื่องครบแล้ว"
      : "เปิดได้ " + st.saved + " จาก " + st.total + " ส่วนที่บันทึกไว้ในเครื่อง";
    renderInstall();
  }

  function renderInstall() {
    var text = $("off-install-text"), ib = $("off-install");
    ib.hidden = !deferredPrompt;
    if (standalone) text.textContent = "คุณกำลังเปิดเป็นแอปอยู่แล้ว ไอคอนอยู่บนหน้าจอหลักหรือในรายการแอปของเครื่อง";
    else if (deferredPrompt) text.textContent = "เพิ่มไอคอนบนหน้าจอหลักหรือเดสก์ท็อป เปิดเต็มจอเหมือนแอปทั่วไป และใช้ได้แม้ไม่มีเน็ต";
    else if (isIOS) text.textContent = "บน iPhone และ iPad: เปิดหน้านี้ใน Safari แตะปุ่มแชร์ (สี่เหลี่ยมมีลูกศรชี้ขึ้น) แล้วเลือก \"เพิ่มไปยังหน้าจอโฮม\"";
    else text.textContent = "เปิดเมนูของเบราว์เซอร์ แล้วเลือก \"ติดตั้งแอป\" หรือ \"เพิ่มไปยังหน้าจอหลัก\" (Chrome และ Edge บน Android, Windows และ macOS รองรับ)";
  }

  /* ---------- นับและบันทึกเนื้อหา ---------- */
  function refreshUsage() {
    if (!navigator.storage || !navigator.storage.estimate) return Promise.resolve();
    return navigator.storage.estimate().then(function (e) {
      st.usageMB = Math.max(0.1, Math.round((e.usage || 0) / 1048576 * 10) / 10);
    }).catch(function () {});
  }
  function countSaved() {
    return caches.open(CONTENT_CACHE).then(function (c) { return c.keys(); }).then(function (reqs) {
      var have = {};
      reqs.forEach(function (r) { have[r.url.split("?")[0]] = true; });
      st.saved = urls.filter(function (u) { return have[abs(u)]; }).length;
    }).catch(function () { st.saved = 0; });
  }
  function saveAll(force) {
    if (st.running || !supported) return;
    st.running = true; st.failed = 0;
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function (p) { st.persisted = p; render(); }).catch(function () {});
    }
    render();
    caches.open(CONTENT_CACHE).then(function (cache) {
      return cache.keys().then(function (reqs) {
        var have = {};
        reqs.forEach(function (r) { have[r.url.split("?")[0]] = true; });
        var queue = urls.filter(function (u) { return force || !have[abs(u)]; });
        if (force) st.saved = st.total - queue.length;
        function worker() {
          var u = queue.shift();
          if (!u) return Promise.resolve();
          return fetch(u, { cache: "no-cache" }).then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return cache.put(u, r);
          }).then(function () { st.saved++; }, function () { st.failed++; })
            .then(function () { render(); return worker(); });
        }
        var workers = [];
        for (var i = 0; i < CONCURRENCY; i++) workers.push(worker());
        return Promise.all(workers);
      });
    }).then(countSaved).then(refreshUsage).then(function () {
      st.running = false; render();
      if (st.saved >= st.total) toast(force ? "อัปเดตเนื้อหาครบทุกส่วนแล้ว" : "บันทึกครบ " + st.total + " ส่วนแล้ว อ่านได้แม้ไม่มีอินเทอร์เน็ต");
      else if (st.failed) toast("บันทึกไม่ครบ " + st.failed + " ส่วน", "ลองอีกครั้ง", function () { $("toast").hidden = true; saveAll(false); });
    }).catch(function () { st.running = false; render(); });
  }
  function clearAll() {
    caches.delete(CONTENT_CACHE).then(countSaved).then(refreshUsage).then(function () {
      render(); toast("ลบข้อมูลออฟไลน์แล้ว เนื้อหาจะโหลดจากอินเทอร์เน็ตตามปกติ");
    });
  }

  /* ---------- เปิด/ปิดแผง ---------- */
  function openPanel() {
    panel.hidden = false; btn.setAttribute("aria-expanded", "true");
    countSaved().then(refreshUsage).then(render);
    $("off-close").focus();
  }
  function closePanel(returnFocus) {
    panel.hidden = true; btn.setAttribute("aria-expanded", "false");
    if (returnFocus) btn.focus();
  }
  btn.addEventListener("click", function () { panel.hidden ? openPanel() : closePanel(false); });
  $("off-close").addEventListener("click", function () { closePanel(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) closePanel(true); });
  document.addEventListener("click", function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) closePanel(false);
  });
  $("off-save").addEventListener("click", function () { saveAll(st.saved >= st.total); });
  $("off-clear").addEventListener("click", function () {
    var b = this;
    if (clearArmed) { clearTimeout(clearArmed); clearArmed = null; b.textContent = "ลบข้อมูลออฟไลน์"; clearAll(); return; }
    b.textContent = "แตะอีกครั้งเพื่อยืนยันการลบ";
    clearArmed = setTimeout(function () { clearArmed = null; b.textContent = "ลบข้อมูลออฟไลน์"; }, 4000);
  });

  /* ---------- ติดตั้งเป็นแอป ---------- */
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; renderInstall(); });
  $("off-install").addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () { deferredPrompt = null; renderInstall(); });
  });
  window.addEventListener("appinstalled", function () {
    deferredPrompt = null; standalone = true; renderInstall();
    toast("ติดตั้งแอปแล้ว เปิดได้จากไอคอนบนหน้าจอ");
  });

  window.addEventListener("online", function () { render(); toast("กลับมาออนไลน์แล้ว"); });
  window.addEventListener("offline", render);

  /* ---------- เริ่มทำงาน ---------- */
  if (!supported) return;
  btn.hidden = false;
  render();
  countSaved().then(refreshUsage).then(render);

  navigator.serviceWorker.register("sw.js").then(function (reg) {
    reg.addEventListener("updatefound", function () {
      var nw = reg.installing;
      if (!nw || !navigator.serviceWorker.controller) return;   // ติดตั้งครั้งแรก ไม่ต้องแจ้ง
      nw.addEventListener("statechange", function () {
        if (nw.state === "activated") toast("มีเวอร์ชันใหม่ของเว็บ", "โหลดใหม่", function () { location.reload(); });
      });
    });
    return navigator.serviceWorker.ready;
  }).then(function (reg) {
    if (reg.active) reg.active.postMessage("version");
    var saveData = navigator.connection && navigator.connection.saveData;
    // บันทึกอัตโนมัติครั้งแรกหลังหน้าเว็บโหลดเสร็จ เพื่อให้ครั้งต่อไปเปิดได้แม้ไม่มีเน็ต
    setTimeout(function () {
      countSaved().then(function () {
        if (navigator.onLine !== false && !saveData && st.saved < st.total) saveAll(false);
      });
    }, 1500);
  }).catch(function () { btn.hidden = true; });

  navigator.serviceWorker.addEventListener("message", function (e) {
    if (e.data && e.data.type === "version") $("off-ver").textContent = "เวอร์ชัน " + e.data.version;
  });
})();
