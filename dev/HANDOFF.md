# ส่งต่องาน: ทำหลักสูตรที่เหลือต่อบนเครื่องตัวเอง (VS Code + Claude Code)

ไฟล์นี้เขียนให้ AI ที่ทำงานต่อใน VS Code และให้เจ้าของ repo อ่านประกอบ คำสั่งทุกคำสั่งรันจาก root ของ repo

## สถานะ (4 พ.ย. 2026)

ผ่านตัวตรวจแล้ว **76 จาก 76 ส่วน (100%)** ทุกหัวข้อครบ 4 ส่วนแล้ว

- **18 Android:** ครบ 4 ส่วนบนเว็บแล้ว และรีวิวส่วนที่ 2–3 เสร็จแล้ว (งานที่ 2)
- **10 AI and Data Scientist:** ครบ 4 ส่วนบนเว็บแล้ว (งานที่ 3–6) และรีวิวส่วนที่ 3 เสร็จแล้ว (งานที่ 7: รันเฉลยทุกข้อซ้ำจากโค้ดบนหน้าเว็บใน `work/t10-p3-review`) Mini Project ที่ทดสอบแล้วอยู่ที่ `work/t10-p4/churn-ml` ไฟล์ที่รันแล้วอยู่ใน `work/t10-p2/` และ `work/t10-p3/` (ทุกบล็อกโค้ดบนหน้าเว็บตรงกับไฟล์ในโฟลเดอร์เหล่านี้ โจทย์ลงมือทำของส่วนที่ 3 คือ `cafe_week.py`, `condo_model.py`, `fraud_model.py` และ `check_answers.py` ใช้ตรวจเฉลยข้อที่มีโค้ด)

### venv ของหัวข้อ 10 บนเครื่อง local

- WSL ของเครื่องนี้เป็น Ubuntu 26.04 ซึ่ง `python3` เป็น 3.14 จึงใช้ uv (`~/venvs/uvboot/bin/uv`) ติดตั้ง CPython 3.12.3 แล้วสร้าง venv ไว้ที่ `~/venvs/torchvenv` (ext4 เร็วกว่า `/mnt/f`) และทำ symlink เป็น `work/t10/torchvenv`
- มีครบทุกเวอร์ชันใน `versions` ของ `dev/outlines/t10.json`: numpy 2.5.4, pandas 3.1.0, matplotlib 3.11.2, scipy 1.18.1, scikit-learn 1.9.1, jupyterlab 4.6.5, torch 2.14.1+cpu, anthropic 1.15.0
- รันด้วย `wsl -e bash -c 'export LANG=C.UTF-8; work/t10/torchvenv/bin/python ไฟล์.py'` ไฟล์ทดลองของส่วนที่ 1 อยู่ใน `work/t10/p1/` รวมถึง `generate_members.py` ของ Mini Project

### สิ่งที่พบตอนทำ Android บนเครื่อง local (งานที่ 1–2 แก้ครบแล้ว)

- เครื่องนี้มี Android Studio Rabbit 1, Android SDK (platform 36 และ 37), AVD `Me2_Phone` (API 37) และ Gradle 9.7.1 จึง Build และทดสอบ Android ได้จริง โปรเจกต์ที่ทดสอบแล้วอยู่ที่ `work/t18-p4/NotesApp` (git-ignore) ใน WSL มี JDK 21.0.13 ที่ `~/tools/jdk-21.0.13+9` และ kotlinc 2.4.21 ที่ `~/tools/kotlinc` (ไม่ได้ใส่ใน PATH ต้อง export เองทุกคำสั่ง)
- **compileSdk ต้องเป็น 37:** Compose BOM 2026.09.00 (UI 1.12.1), core-ktx 1.19.1, Lifecycle 2.11.0 และ Navigation 2.10.2 ล้มที่ `checkDebugAarMetadata` ถ้า `compileSdk = 36` (targetSdk 36 ใช้ได้) แก้เป็น 37 ในส่วนที่ 1–2 แล้ว
- `androidx.compose.ui.test.junit4.createComposeRule` เป็น Deprecated ใน Compose 1.12.1 ให้ใช้ `androidx.compose.ui.test.junit4.v2.createComposeRule` แก้ใน `QuickNoteScreenTest` ของส่วนที่ 1 แล้ว
- งานที่ 2 ประกอบไฟล์ Android ทั้งหมดของส่วนที่ 1–3 เป็นโปรเจกต์ `work/t18-review-lab/AndroidLab` (สคริปต์ `work/t18-p3-review/mkfull.py`) Build ผ่าน, Unit test 10 ตัวและ `QuickNoteScreenTest` ผ่าน และรันโจทย์ลงมือทำของส่วนที่ 3 กับแนวคิดที่ 8 และ 12 ของส่วนที่ 2 บน Emulator ได้ Logcat ตรงกับหน้าเว็บ
- Windows ที่ตั้ง System locale เป็นไทย ทำให้ `bundleRelease` ล้มที่ `mergeReleaseJavaResource` (VerifyException จากปฏิทินพุทธ) แก้ด้วย `-Duser.language=en -Duser.country=US` ใน `org.gradle.jvmargs`

## งานที่เหลือ (ทำตามลำดับ ทีละงาน)

| # | งาน | ไฟล์คำสั่ง | ผลลัพธ์ | แก้ `var CONTENT` ใน index.html | สถานะ |
|---|---|---|---|---|---|
| 1 | Android ส่วนที่ 4 | `dev/prompts/t18-p4.txt` | `topics/t18-p4.html` | `18:3` → `18:4` | ✅ |
| 2 | รีวิว Android ส่วนที่ 2–3 | `dev/prompts/t18-review.txt` | แก้ `topics/t18-p2.html`, `topics/t18-p3.html` | ไม่ต้องแก้ | ✅ |
| 3 | AI and Data Scientist ส่วนที่ 1 + โครงเนื้อหา | `dev/prompts/t10-p1.txt` | `topics/t10-p1.html`, `dev/outlines/t10.json` | แทรก `10:1, ` ต่อจาก `9:4, ` | ✅ |
| 4 | AI and Data Scientist ส่วนที่ 2 | `dev/prompts/t10-p2.txt` | `topics/t10-p2.html` | `10:1` → `10:2` | ✅ |
| 5 | AI and Data Scientist ส่วนที่ 3 | `dev/prompts/t10-p3.txt` | `topics/t10-p3.html` | `10:2` → `10:3` | ✅ |
| 6 | AI and Data Scientist ส่วนที่ 4 | `dev/prompts/t10-p4.txt` | `topics/t10-p4.html` | `10:3` → `10:4` | ✅ |
| 7 | รีวิว AI and Data Scientist ส่วนที่ 3 | `dev/prompts/t10-review.txt` | แก้ `topics/t10-p3.html` | ไม่ต้องแก้ | ✅ |

- งานที่ 1 และ 2 สลับลำดับกันได้
- งานที่ 3 ต้องเสร็จก่อนงานที่ 4–7 เพราะสร้าง `dev/outlines/t10.json` ที่ส่วนอื่นใช้
- ตัวเลขใน `var CONTENT` คือจำนวนส่วนที่แสดงบนเว็บ ต้องนับต่อเนื่องจากส่วนที่ 1 และเรียงตามเลขหัวข้อ

## ขั้นตอนของแต่ละงาน (สำหรับ AI)

1. `cat` ไฟล์คำสั่งของงานนั้น แล้วทำตามทุกข้อ ไฟล์คำสั่งแปลงมาจากเครื่องคลาวด์แล้ว path ทุกตัวนับจาก root ของ repo
2. เขียนเป็น chunk ลงใน `build/tNN-pK/` และบันทึกลงดิสก์ทันทีที่เขียนเสร็จแต่ละ chunk ถ้าเครดิตหมดกลางทาง รอบหน้าจะทำต่อจาก chunk ที่ค้างได้ตามกติกา RESUME ในไฟล์คำสั่ง
3. ตรวจด้วยตัวตรวจ ต้องได้ `RESULT: PASS`

   ```bash
   python3 dev/validate_fragment.py topics/tNN-pK.html --topic N --part K
   ```

## ขั้นตอนหลังผ่านตัวตรวจ (after-PASS)

1. **ตรวจหน้าจอ (แนะนำ):** รัน `node dev/qa/check-render.js N` ต้องได้ `RESULT: PASS` คือ `sw` เท่ากับ `cw` ทั้งที่ 1440 และ 390 px และ `errors: []`
   - ถ้าล้นจอมือถือ สคริปต์จะบอกข้อความที่ล้น ส่วนใหญ่เป็น URL ยาวที่ไม่ได้อยู่ใน `<code>`
2. **แสดงบนเว็บ:** แก้ `var CONTENT` ใน `index.html` ตามตารางงานด้านบน (เฉพาะงานเขียน ไม่ใช่งานรีวิว)
3. **README.md:**
   - แก้บรรทัด "ผ่านตัวตรวจแล้ว X จาก 76 ส่วน (Y%)" โดยให้ Y = round(X / 76 × 100) เช่น 72 → 95%, 73 → 96%, 74 → 97%, 75 → 99%, 76 → 100%
   - แก้แถวของหัวข้อในตารางสถานะ เช่น `| 18 | Android | ✅ ครบ 4 ส่วน |` หรือ `| 10 | AI and Data Scientist | 🟡 มีส่วนที่ 1 (ส่วนที่ 2–4 กำลังทำ) |`
4. **ตารางในไฟล์นี้:** เปลี่ยนสถานะของงานที่เสร็จจาก ⬜ เป็น ✅ และอัปเดตหัวข้อ "สถานะ" ด้านบน
5. **บันทึกขึ้น GitHub:** commit แล้ว push ขึ้น `main` เช่น `git add -A && git commit -m "Add Android Part 4 (72/76 parts)" && git push` แล้ว GitHub Pages จะอัปเดตเองภายใน 1–2 นาที
   - `build/` และ `work/` อยู่ใน `.gitignore` จึงไม่ถูก commit
6. **สรุปให้เจ้าของ repo เป็นภาษาไทย:** บอกว่าเสร็จอะไร ทดสอบอะไรได้หรือไม่ได้ ความคืบหน้า X/76 (Y%) แล้ว **หยุดรอ** จนกว่าเจ้าของจะสั่ง "ทำต่อ"

## เตรียมเครื่อง (Windows + WSL2 Ubuntu)

- **ที่เก็บ repo:** clone ไว้ในฝั่ง WSL เช่น `~/mythisway` แล้วเปิดด้วย VS Code ผ่านส่วนขยาย WSL (`code .` จาก WSL) ไม่ควรเก็บไว้ใต้ `/mnt/c` เพราะช้า
- **ทุกงาน:** ต้องมี git และ python3 ตัวตรวจใช้แค่ standard library
- **ตรวจหน้าจอ (ไม่บังคับ):** ต้องมี Node.js แล้วรันใน root ของ repo

  ```bash
  npm install --no-save playwright@1.56.1
  npx playwright install --with-deps chromium
  node dev/qa/check-render.js 18
  ```

- **หัวข้อ 18 Android:**
  - ต้องมี kotlinc 2.4.21 และ JDK 21 เช่นติดตั้งด้วย SDKMAN แล้วใช้ `sdk install kotlin 2.4.21` และ `sdk install java` รุ่น 21
  - ต้องมี jar ของไลบรารีจาก Maven Central ดูรายชื่อและ URL ใน notes ของ `dev/outlines/t18.json`
  - ถ้าเครื่องมี Android Studio และ Android SDK จะทดสอบโค้ด Android ได้จริง
- **หัวข้อ 10:** ใช้ venv เดียวที่ `work/t10/torchvenv` และใช้ PyTorch แบบ CPU รายละเอียดอยู่ในไฟล์คำสั่ง

## กฎสำคัญของเนื้อหา

ย่อมาจาก `dev/CONTENT_SPEC.md` ซึ่งเป็นฉบับเต็มที่ต้องอ่านก่อนเขียน

- อธิบายเป็นภาษาไทย ใช้ศัพท์เทคนิคภาษาอังกฤษ ผู้เรียนเริ่มจากศูนย์ ใช้ Windows + WSL2 Ubuntu
- โค้ดต้องรันได้จริงและระบุเวอร์ชันชัด ผลลัพธ์ต้องมาจากการรันจริง ห้ามแต่งขึ้น คอมเมนต์ในโค้ดเป็นภาษาไทย
- ห้ามสรุปห้วนๆ หรือเขียน "...และอื่นๆ" และหัวข้อหลังๆ ต้องไม่สั้นกว่าหัวข้อแรกๆ
- เนื้อหาด้าน Cyber Security ให้ฝึกเฉพาะในแล็บหรือระบบของตัวเองเท่านั้น
- หัวข้อที่ต้องใช้ API Key หรือบริการภายนอก ต้องมีวิธีทดสอบแบบไม่ใช้ Key ด้วย เช่น ใช้ข้อมูลจำลอง ดู `dev/AI_GUIDE.md`

## ไฟล์ที่เกี่ยวข้อง

| ไฟล์ / โฟลเดอร์ | คืออะไร |
|---|---|
| `dev/prompts/` | ไฟล์คำสั่งของแต่ละงาน แปลงให้ใช้ path ใน repo แล้ว |
| `dev/CONTENT_SPEC.md` | กติกาการเขียนฉบับเต็ม |
| `dev/briefs.json` | brief ของแต่ละหัวข้อ |
| `dev/outlines/` | โครงเนื้อหาที่ตกลงแล้ว ของหัวข้อ 10 จะถูกสร้างในงานที่ 3 |
| `dev/validate_fragment.py` | ตัวตรวจไฟล์เนื้อหา |
| `dev/qa/check-render.js` | ตรวจหน้าจอ desktop และมือถือ |
| `dev/AI_GUIDE.md` | วิธีเขียนโค้ดที่เรียก LLM ในบทเรียน |
| `dev/QUEUE.md` | บันทึกการทำงานบนเครื่องคลาวด์ (ประวัติ ไม่จำเป็นต้องอ่าน) |
| `build/`, `work/` | ไฟล์ชั่วคราวในเครื่อง (อยู่ใน `.gitignore`) |
