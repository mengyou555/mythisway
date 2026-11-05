# แผนที่สายเทค 19 หัวข้อ

หลักสูตรเรียนเองภาษาไทยสำหรับคนที่เริ่มจากศูนย์ ครอบคลุม 19 สายงานเทค ใช้เครื่อง Windows + WSL2 (Ubuntu) อธิบายเป็นภาษาไทยโดยใช้ศัพท์เทคนิคภาษาอังกฤษ โค้ดทุกชิ้นระบุเวอร์ชันและผ่านการรันจริง

แต่ละหัวข้อมี 4 ส่วน

1. **Roadmap**: ลำดับการเรียนทีละขั้น
2. **Core Concepts + Quick Guide**: แนวคิดหลัก ตัวอย่างที่รันได้ ผลลัพธ์จริง ตารางข้อผิดพลาดที่พบบ่อย และแบบฝึก "ลองเอง"
3. **Exercises + Quiz**: เติมคำ ปรนัย และโจทย์ลงมือทำ 3 ข้อ พร้อมเฉลยละเอียด
4. **Extras**: Mini Project, Cheat Sheet, คำถามสัมภาษณ์งาน 5 ข้อ และแหล่งเรียนต่อ

ลำดับการเรียนที่แนะนำดูได้ในหน้าแรกของเว็บ

## อ่านแบบออฟไลน์: เว็บ กับ แอป Android

หลักสูตรนี้อ่านได้ 2 แบบ ซึ่งแยกโปรเจกต์กัน

| | เว็บ (repo นี้: `mythisway`) | แอป Android (โปรเจกต์แยก: `mythisway-app`) |
|---|---|---|
| คืออะไร | เว็บบน GitHub Pages ที่ติดตั้งเป็นแอป (PWA) ได้ | แอป Android ที่ Build เป็น APK ด้วย Capacitor + React + Vite + TypeScript |
| อ่านออฟไลน์ | เปิดเว็บขณะออนไลน์ 1 ครั้ง ระบบจะบันทึกครบทั้ง 76 ส่วนให้เอง ดูสถานะได้ที่ปุ่ม "อ่านออฟไลน์" มุมขวาบน | เนื้อหาทั้งหมดอยู่ใน APK อยู่แล้ว ไม่ต้องต่อเน็ตเลย |
| ติดตั้ง | Chrome หรือ Edge: เมนู "ติดตั้งแอป" / iPhone: Safari แล้วกด แชร์ → "เพิ่มไปยังหน้าจอโฮม" | [ดาวน์โหลด APK](https://mengyou555.github.io/mythisway/download/techmap.apk) (10.5 MB) หรือกดปุ่ม "อ่านออฟไลน์" บนเว็บ → "ดาวน์โหลดแอป Android" แล้วเปิดไฟล์และอนุญาต "ติดตั้งแอปที่ไม่รู้จัก" ให้เบราว์เซอร์ |
| ไฟล์ที่เกี่ยวข้อง | `sw.js`, `manifest.webmanifest`, `assets/` (ฟอนต์ ไอคอน highlight.js `offline.js`) | ทั้งโปรเจกต์ `mythisway-app` ดูวิธี Build ใน `BUILD.md` ของโปรเจกต์นั้น ไฟล์ APK ที่แจกอยู่ใน `download/techmap.apk` ของ repo นี้ |

แอป Android ใช้ repo นี้เป็นต้นทางของเนื้อหา คำสั่ง `npm run sync-content` ในโปรเจกต์แอปจะคัดลอก `topics/`, ข้อมูลหลักสูตรใน `index.html` และ `assets/` มาไว้ในแอป
เมื่อแก้เนื้อหาในเว็บแล้ว ต้อง Sync และ Build APK ใหม่ แอปจึงจะได้เนื้อหาล่าสุด

เมื่อแก้ไฟล์ใน `assets/` หรือ `sw.js` ให้เพิ่มค่า `VERSION` ใน `sw.js` ด้วย เพื่อให้เครื่องที่บันทึกเว็บไว้แล้วโหลดไฟล์ชุดใหม่

## ความคืบหน้า

ผ่านตัวตรวจแล้ว 76 จาก 76 ส่วน (100%)

| # | หัวข้อ | สถานะ |
|---|---|---|
| 1 | Network Engineer | ✅ ครบ 4 ส่วน |
| 2 | Vibe Coding | ✅ ครบ 4 ส่วน |
| 3 | Game Developer | ✅ ครบ 4 ส่วน |
| 4 | JavaScript | ✅ ครบ 4 ส่วน |
| 5 | Cyber Security | ✅ ครบ 4 ส่วน |
| 6 | Go | ✅ ครบ 4 ส่วน |
| 7 | AI Agents | ✅ ครบ 4 ส่วน |
| 8 | API Design | ✅ ครบ 4 ส่วน |
| 9 | Python | ✅ ครบ 4 ส่วน |
| 10 | AI and Data Scientist | ✅ ครบ 4 ส่วน |
| 11 | AI Engineer | ✅ ครบ 4 ส่วน |
| 12 | Backend | ✅ ครบ 4 ส่วน |
| 13 | Node.js | ✅ ครบ 4 ส่วน |
| 14 | SQL | ✅ ครบ 4 ส่วน |
| 15 | TypeScript | ✅ ครบ 4 ส่วน |
| 16 | Prompt Engineering | ✅ ครบ 4 ส่วน |
| 17 | Git and GitHub | ✅ ครบ 4 ส่วน |
| 18 | Android | ✅ ครบ 4 ส่วน |
| 19 | Linux | ✅ ครบ 4 ส่วน |

## วิธีเปิดดู

- **ออนไลน์:** https://claude.ai/artifact/CQ9hL7FuzR6uJNEbwEiiH9
- **GitHub Pages:** ไปที่ Settings → Pages → Build and deployment ตั้ง Source เป็น "Deploy from a branch" เลือก Branch `main` โฟลเดอร์ `/ (root)` แล้วกด Save รอสักครู่ เว็บจะอยู่ที่ https://mengyou555.github.io/mythisway/
- **ในเครื่อง:** หน้าเว็บโหลดเนื้อหาแต่ละส่วนด้วย `fetch()` จึงต้องเปิดผ่าน Web Server (ดับเบิลคลิก `index.html` ตรงๆ เนื้อหาจะไม่ขึ้น)

  ```bash
  cd mythisway
  python3 -m http.server 8000
  ```

  แล้วเปิด http://localhost:8000

## โครงสร้างไฟล์

| ไฟล์ / โฟลเดอร์ | คืออะไร |
|---|---|
| `index.html` | หน้าหลัก: แผนที่ 19 หัวข้อ เมนู และตัวโหลดเนื้อหา |
| `topics/tNN-pK.html` | เนื้อหาส่วนที่ K ของหัวข้อที่ NN เช่น `t03-p2.html` คือ Game Developer ส่วนที่ 2 |
| `dev/` | เครื่องมือที่ใช้สร้างและตรวจเนื้อหา: กติกาการเขียน (`CONTENT_SPEC.md`), ตัวตรวจ (`validate_fragment.py`), โครงเนื้อหาแต่ละหัวข้อ (`outlines/`), Brief ของหัวข้อ (`briefs.json`), สคริปต์สร้าง Prompt (`scripts/`) และคิวงาน (`QUEUE.md`) |

ทำส่วนที่เหลือต่อบนเครื่องตัวเอง (VS Code + Claude Code) ดูขั้นตอนใน `dev/HANDOFF.md`

ตรวจไฟล์เนื้อหาด้วยตัวตรวจ

```bash
python3 dev/validate_fragment.py topics/t03-p2.html --topic 3 --part 2
```

## ข้อควรระวัง

- เนื้อหาด้าน Cyber Security ให้ฝึกเฉพาะในแล็บหรือระบบของตัวเองเท่านั้น
- หัวข้อที่ต้องใช้ API Key หรือบริการภายนอก มีวิธีทดสอบแบบไม่ใช้ Key (ใช้ข้อมูลจำลอง) ให้ด้วย
