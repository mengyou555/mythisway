# แผนที่สายเทค 19 หัวข้อ

หลักสูตรเรียนเองภาษาไทยสำหรับคนที่เริ่มจากศูนย์ ครอบคลุม 19 สายงานเทค ใช้เครื่อง Windows + WSL2 (Ubuntu) อธิบายเป็นภาษาไทยโดยใช้ศัพท์เทคนิคภาษาอังกฤษ โค้ดทุกชิ้นระบุเวอร์ชันและผ่านการรันจริง

แต่ละหัวข้อมี 4 ส่วน

1. **Roadmap**: ลำดับการเรียนทีละขั้น
2. **Core Concepts + Quick Guide**: แนวคิดหลัก ตัวอย่างที่รันได้ ผลลัพธ์จริง ตารางข้อผิดพลาดที่พบบ่อย และแบบฝึก "ลองเอง"
3. **Exercises + Quiz**: เติมคำ ปรนัย และโจทย์ลงมือทำ 3 ข้อ พร้อมเฉลยละเอียด
4. **Extras**: Mini Project, Cheat Sheet, คำถามสัมภาษณ์งาน 5 ข้อ และแหล่งเรียนต่อ

ลำดับการเรียนที่แนะนำดูได้ในหน้าแรกของเว็บ

## ความคืบหน้า

ผ่านตัวตรวจแล้ว 71 จาก 76 ส่วน (93%)

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
| 10 | AI and Data Scientist | ⏳ ยังไม่เริ่ม |
| 11 | AI Engineer | ✅ ครบ 4 ส่วน |
| 12 | Backend | ✅ ครบ 4 ส่วน |
| 13 | Node.js | ✅ ครบ 4 ส่วน |
| 14 | SQL | ✅ ครบ 4 ส่วน |
| 15 | TypeScript | ✅ ครบ 4 ส่วน |
| 16 | Prompt Engineering | ✅ ครบ 4 ส่วน |
| 17 | Git and GitHub | ✅ ครบ 4 ส่วน |
| 18 | Android | 🟡 มีส่วนที่ 1–3 (ส่วนที่ 4 กำลังทำ) |
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

ตรวจไฟล์เนื้อหาด้วยตัวตรวจ

```bash
python3 dev/validate_fragment.py topics/t03-p2.html --topic 3 --part 2
```

## ข้อควรระวัง

- เนื้อหาด้าน Cyber Security ให้ฝึกเฉพาะในแล็บหรือระบบของตัวเองเท่านั้น
- หัวข้อที่ต้องใช้ API Key หรือบริการภายนอก มีวิธีทดสอบแบบไม่ใช้ Key (ใช้ข้อมูลจำลอง) ให้ด้วย
