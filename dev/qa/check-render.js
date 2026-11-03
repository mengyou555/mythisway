// ตรวจหน้าเว็บหลังเพิ่มเนื้อหา: เปิดหัวข้อที่ระบุที่ความกว้าง 1440 px และ 390 px (มือถือ)
// ผ่านเมื่อ sw == cw (ไม่มี scroll แนวนอน) และ errors: [] ถ้าล้นจะพิมพ์ข้อความที่ทำให้ล้น
// วิธีใช้ (รันจาก root ของ repo): node dev/qa/check-render.js 18 [10 ...]
// ต้องติดตั้งก่อน: npm install --no-save playwright@1.56.1 && npx playwright install chromium
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const topics = process.argv.slice(2).map(Number).filter(Boolean);
if (!topics.length) { console.error('usage: node dev/qa/check-render.js <topic> [topic ...]'); process.exit(2); }

// เว็บเซิร์ฟเวอร์เล็กๆ เสิร์ฟไฟล์จาก root ของ repo (หน้าเว็บโหลดเนื้อหาด้วย fetch จึงเปิดเป็นไฟล์ตรงๆ ไม่ได้)
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

// หาสิ่งที่กว้างเกินจอ: element และข้อความ (text node) ที่ล้นขอบขวา ไม่นับของที่อยู่ในกล่องที่ scroll ได้เอง
function findOverflow() {
  const cw = document.documentElement.clientWidth, out = [];
  const clipped = el => { for (let p = el.parentElement; p; p = p.parentElement) { if (getComputedStyle(p).overflowX !== 'visible') return p !== document.documentElement && p !== document.body; } return false; };
  const where = el => { const s = el.closest('[id]'); return s ? s.id : ''; };
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > cw + 0.5 && !clipped(el)) out.push({ tag: el.tagName, section: where(el), right: Math.round(r.right), text: el.textContent.trim().slice(0, 100) });
  }
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t; (t = tw.nextNode());) {
    if (!t.textContent.trim()) continue;
    const range = document.createRange(); range.selectNodeContents(t);
    const r = range.getBoundingClientRect(), p = t.parentElement;
    if (r.width && r.right > cw + 0.5 && getComputedStyle(p).overflowX === 'visible' && !clipped(p)) out.push({ tag: '#text in ' + p.tagName, section: where(p), right: Math.round(r.right), text: t.textContent.trim().slice(0, 100) });
  }
  return out.slice(-10);
}

(async () => {
  await new Promise(ok => server.listen(0, '127.0.0.1', ok));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  let failed = false;
  for (const vw of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort()); // ตัดการโหลดจากเว็บนอก (เช่นฟอนต์) ให้ผลคงที่
    await page.goto(base + '#t0', { waitUntil: 'load' });
    for (const n of topics) {
      await page.evaluate(n => { location.hash = '#t' + n; }, n);
      await page.waitForSelector(`#topic-${n}[data-loaded="1"]`, { timeout: 20000 }).catch(() => errors.push('topic ' + n + ' did not load'));
      const info = await page.evaluate(n => {
        const a = document.getElementById('topic-' + n), de = document.documentElement, q = s => (a ? a.querySelectorAll(s).length : 0);
        return { sw: de.scrollWidth, cw: de.clientWidth, code: q('.codebox'), concepts: q('.concept'), mcq: q('ol.mcq > li') };
      }, n);
      console.log(vw, 'topic', n, JSON.stringify(info));
      if (info.sw > info.cw) { failed = true; console.log('  overflow:', JSON.stringify(await page.evaluate(findOverflow), null, 1)); }
    }
    console.log(vw, 'errors:', errors);
    if (errors.length) failed = true;
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(failed ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(failed ? 1 : 0);
})();
