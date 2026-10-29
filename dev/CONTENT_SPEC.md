# Content Spec — "แผนที่สายเทค 19 หัวข้อ" curriculum website

You are writing part of a self-study tech curriculum website for Thai learners. Read this whole file before writing anything. Every rule here is mandatory.

## 1. The learner and the voice

- The learner starts from zero, with no tech background.
- They use **Windows**, and practise Linux commands through **WSL2 running Ubuntu 24.04 LTS**.
- Write all explanations in **Thai**. Keep technical terms in **English** (e.g. "ใช้คำสั่ง `ls` เพื่อดูไฟล์ใน Directory").
- **Code comments must be in Thai.**
- Style: W3Schools (short, clear explanations; a complete code example; try-it-yourself tasks) combined with roadmap.sh (a staged path from Beginner to Advanced).
- Write plainly, the way an experienced teacher explains things to a beginner. Use short, direct sentences, and keep the tone respectful and encouraging without filler.
- **Never summarise or cut corners.** Forbidden phrases: "และอื่นๆ", "และอื่น ๆ", "ฯลฯ", "ทำแบบเดียวกัน", "ที่เหลือก็คล้ายกัน", "TODO", "TBD", "lorem". Every item must be written out in full.
- This topic must be just as detailed as every other topic. Late sections must not be shorter or thinner than early ones.

## 2. Facts to use (verified against official sources on 2026-10-19)

Today is **2026-10-19**. Use these values. If you need a fact that is not listed here and you are not sure of it, say so honestly in the text (for example "ตรวจสอบเวอร์ชันล่าสุดที่ ... ก่อนใช้") instead of guessing.

| Tool | Version this curriculum uses | Latest on 2026-10-19 | Notes |
|---|---|---|---|
| Ubuntu (WSL) | 24.04 LTS "noble" | 26.04.1 LTS | Installed with `wsl --install -d Ubuntu-24.04`. Plain `wsl --install` now installs 26.04. |
| Python | 3.12.3, the system `python3` on Ubuntu 24.04 | 3.15.0 (2026-10-09); 3.14.8 | Code must run on 3.12+. Install packages only inside a venv (`python3 -m venv .venv`), because Ubuntu 24.04 blocks system pip with `externally-managed-environment`. |
| pip packages | Pin versions or state the version you tested | | Use `python3 -m pip install ...` inside the venv. |
| Git | 2.43.0 (apt) | | |
| SQLite | 3.45.1 (apt `sqlite3`) | | |
| PostgreSQL | 16 (apt `postgresql`) | 18 (19 is RC, GA planned 2026-11-19) | |
| Node.js | Latest LTS via nvm v0.40.8 | 24.22.0 is LTS (24 goes Maintenance 2026-10-20); 26.12.0 becomes Active LTS 2026-10-28 | Install: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh \| bash`, then `nvm install --lts`. Code must run on Node 24 and 26. Use ES modules (`"type": "module"`) or say clearly when you use CommonJS. |
| TypeScript | 7.x (7.0.2) | 7.0.2 (2026-07-08) | 7.0 has a native compiler written in Go; the command is still `tsc`. 6.0.3 is the last JavaScript-based release. Some tools that call the TypeScript API may still need 6.x. |
| Go | 1.27.x (latest 1.27.2, 2026-10-08) | | Install from the official go.dev tarball (apt's Go is older). |
| Android Studio | Latest stable: Rabbit 1 (2026.2.1), on Windows | | Kotlin 2.4.21; Compose UI 1.12.1, Material3 1.4.0; AGP 9.4.0. Minimum 16 GB RAM with the Emulator, 32 GB recommended. Windows on ARM is not supported. |
| Godot | 4.7.2 (stable), on Windows | 4.8 is beta | GDScript is the main language; C# is optional. |
| Docker Desktop | Latest (4.95.0), WSL 2 backend | | Free for personal use, education and small businesses (<250 employees AND <US$10M revenue). |
| WSL app | 2.4.10+ (latest 3.0.3) | | "WSL 2" is the architecture, not the app version. |

Certification status on 2026-10-19:

| Certification | Status |
|---|---|
| ISC2 CC | Active. The free "One Million Certified in Cybersecurity" program closed to new people on 2026-05-20. The exam now costs US$199, plus a US$50 annual fee. |
| CompTIA Security+ | SY0-701 is current. SY0-801 launches around 2026-11-17. |
| CompTIA CySA+ | CS0-004 is current (since 2026-06-23). |
| CompTIA Network+ | N10-009. |
| CompTIA Linux+ | XK0-006. |
| Cisco CCNA | 200-301 v1.1 until 2027-02-02, then v2.0 (same code) from 2027-02-03. |
| INE eJPT | Updated in March 2026: 45 questions, 48-hour hands-on exam. |
| OffSec OSCP | Passing since 2024-11-01 gives OSCP plus OSCP+. OSCP+ expires after 3 years. |
| AWS | CLF-C02 and AIF-C01 are current. DVA-C02 ends 2026-11-30; DVA-C03 starts 2026-12-01. MLA-C01 is no longer offered in English (MLA-C02 beta). |
| Microsoft | PL-300 is active. Azure AI Fundamentals is now earned with exam AI-901 (AI-900 retired 2026-06-30). |
| Python Institute | PCEP-30-02 and PCAP-31-03 are current. PCEP-30-03 and PCAP-31-04 are due 2026-10-31. |
| GitHub | GH-900 Foundations, GH-200 Actions, GH-300 Copilot, GH-500 Advanced Security, GH-100 Administration. |
| Linux | LFCS active; RHCSA EX200 is on RHEL 10; LPI Linux Essentials 010-200 (new, 2026-10-15); 010-160 available until April 2027. |
| Google Associate Android Developer | Retired (no date published). There is no replacement Google Android certification. |
| Unity | Unity Certified User and Unity Certified Associate are still offered. |

## 3. Your sandbox (for testing code before you publish it)

- Testing runs on Linux **Ubuntu 24.04.5**, as root, with 4 CPUs.
- Installed: **Python 3.13**, **Node 22**, **Go 1.24.7**, the **PostgreSQL 16** server (not running; start it with `service postgresql start`), and `tsc` 6.0.2.
- `sqlite3` CLI is not installed; run `apt-get install -y sqlite3`. Python's `sqlite3` module is 3.45.1.
- PyPI, npm and the Ubuntu apt archive are reachable. Most other websites are blocked.
- **Run every code example whose toolchain you can run here.** Paste the **real output** into the page.
- Some outputs differ by machine: usernames, dates, hashes, PIDs, IP addresses, file sizes. For these, show realistic output that uses the learner's username `somchai` and the folder `/home/somchai/...`, and say in Thai that the values on the learner's machine will differ.
- The sandbox versions differ slightly from the target versions (Python 3.12, Node LTS 24/26, Go 1.27). **Write code that runs on the target versions.** Do not use a feature that exists only in a newer version than the target.
- Some code cannot be run here (Windows PowerShell, Android, Godot, GUI programs, real network devices). For that code, be extra careful: follow official syntax and state the version.
- Do your scratch work in `/tmp/claude-0/-home-user/fe474bf2-4538-5703-885b-2ffd0c503494/scratchpad/work/<topic>/`. Never write scratch files into the `site/` folder.

## 4. Safety and API rules

- **Cyber Security, and anything offensive in the Network topic:** practise only in your own lab, on your own machines, VMs or containers, or on legal training platforms. Say this clearly near any offensive technique. Never target third-party systems. In examples, scan only `127.0.0.1`, your own Docker containers, or documentation ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24). Thai law reference: พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์.
- **Anything that needs an API key or a paid service** (LLM APIs, cloud): always give a way to test **without a key**, such as a mock or fake client, recorded sample data, or a local model through Ollama (optional). Write the code so that it detects a missing key and switches to mock mode automatically.
- **Never put real secrets in code.** Read keys from environment variables.

## 5. Output format: HTML fragments

You write **HTML fragments**: no `<html>`, `<head>`, `<body>`, `<style>`, `<script>`, `<iframe>` and no `style=""` attributes. A shell page provides all CSS and JavaScript.

### File names

For topic **N**, written as two digits `NN`:

| File | Content |
|---|---|
| `site/topics/tNN-p1.html` | Part 1 |
| `site/topics/tNN-p2.html` | Part 2 |
| `site/topics/tNN-p3.html` | Part 3 |
| `site/topics/tNN-p4.html` | Part 4 |

The full path of `site/` is `/tmp/claude-0/-home-user/fe474bf2-4538-5703-885b-2ffd0c503494/scratchpad/site/`.

### Writing big files

Files will be long, often 60–200 KB. Write the file in several chunks:

1. Use **Write** for the first chunk.
2. Append each later chunk by running Bash with a quoted heredoc: `cat >> FILE <<'EOF' ... EOF`. The quotes around `'EOF'` stop the shell from expanding `$` and backticks.

**Never** lose earlier chunks. Check the file at the end with the validator.

### IDs

Every `id` must be unique across the whole site. Use only lowercase `a-z`, `0-9` and `-`, and start with `s<N>-`. N is the topic number without zero padding, e.g. `s19-2-c03`.

| Element | ID |
|---|---|
| Part heading (h2) | `s<N>-<part>`, e.g. `s19-1` |
| h3 headings | `s<N>-<part>-<slug>`, e.g. `s19-2-c01`, `s19-3-mcq` |

The table of contents lists every `h2[id]` and `h3[id]`. **Give every h3 an id**, and make it a short, readable heading. h4 and h5 headings do not need ids.

### Escaping inside code

Inside `<pre><code>`, write `<` as `&lt;`, `>` as `&gt;`, and `&` as `&amp;`. **No other tags are allowed inside `<code>` in a `<pre>`.** This matters a lot: an unescaped `<` breaks the page. Inline `<code>` in text follows the same rule.

### Components

Use only these components and classes. The validator rejects unknown classes.

#### Part wrapper

```html
<section class="part" data-part="1">
  <h2 id="s19-1"><span class="sec-no">19.1</span>Learning Roadmap</h2>
  ...
</section>
```

Part titles:

| Part | Title |
|---|---|
| 1 | `Learning Roadmap` |
| 2 | `Core Concept &amp; Quick Guide` |
| 3 | `Practice Exercises &amp; Quizzes` |
| 4 | `ส่วนเสริม: Mini Project, Cheat Sheet, Interview` |

#### Level badge

```html
<span class="lvl" data-lvl="b">Beginner</span>
<span class="lvl" data-lvl="i">Intermediate</span>
<span class="lvl" data-lvl="a">Advanced</span>
```

For quiz difficulty use the Thai labels ง่าย, กลาง and ยาก with the same `data-lvl` values `b`, `i` and `a`.

#### Callouts

`<div class="callout [variant]"><span class="c-label [label-variant]">LABEL</span><p>...</p></div>`

| Variant | Label variant | Default label | Use for |
|---|---|---|---|
| (none) | `tip` | Tip | Tips |
| `warn` | `warn` | ระวัง | Warnings, common mistakes |
| `ok` | `ok` | Best Practice | Best practice |
| `sec` | `sec` | Security | Security |
| `note` | `note` | หมายเหตุ | Notes |
| `note` | `try` | ลองเอง | Try it yourself |
| (none) | `check` | Checkpoint | Checkpoints |
| `analogy` | `analogy` | เปรียบเทียบ | Real-life analogy |

Callouts may contain `p`, `ul`, `ol` and code blocks.

#### Code blocks

```html
<pre class="code" data-env="wsl" data-label="Bash · Ubuntu (WSL)"><code class="language-bash">...escaped code...</code></pre>
```

- `data-env` is one of the values below. Write `data-label` in the format `Language · where` (use the middle dot).

  | `data-env` | Meaning | Example `data-label` |
  |---|---|---|
  | `wsl` | Commands typed in the Ubuntu terminal | `Bash · Ubuntu (WSL)` |
  | `win` | Commands typed in Windows PowerShell | `PowerShell · Windows` |
  | `file` | Content of a source file the learner creates | `Python · hello.py` |
  | `app` | Code run inside an app | `GDScript · Godot Editor`, `Kotlin · Android Studio`, `JavaScript · Browser Console` |
  | `out` | Output, used together with `data-kind="out"` | `Output` |
  | `tpl` | Text template, used together with `data-kind="tpl"` | |

- Output example: `<pre class="code" data-kind="out" data-env="out" data-label="Output"><code>...</code></pre>`.
- Language classes: `language-bash`, `language-powershell`, `language-python`, `language-javascript`, `language-typescript`, `language-go`, `language-sql`, `language-kotlin`, `language-json`, `language-yaml`, `language-xml` (HTML too), `language-css`, `language-dockerfile`, `language-ini`, `language-markdown`, `language-plaintext`.
  - For GDScript use `language-python`.
  - For Cisco IOS or config files use `language-plaintext` or `language-ini`.
- **When a program is a file, show it as a `file` block, then show the command that runs it as a `wsl` or `win` block, then show the `out` block.** Install commands always come first, in their own block.

#### Tables

```html
<div class="tbl"><table class="[purpose class]"><thead>...</thead><tbody>...</tbody></table></div>
```

- Add `wide` to the div (`class="tbl wide"`) for tables with 4 or more columns. Add `mid` for 3 columns that need room.
- Purpose classes are listed with each part below.
- Inside cells, `class="nw"` (no wrap) and `class="num"` (numbers) are allowed.

#### Other elements

- **Details (collapsible):** `<details class="ans"><summary>...</summary><div>...</div></details>` for answers, and `<details class="hint"><summary>Hint</summary><div>...</div></details>` for hints. Interview questions use `<details class="iq">` with the same structure.
- **Inline elements:** `<code>`, `<kbd>`, `<strong>`, `<em>`, `<a href="https://..." target="_blank" rel="noopener">`, `<br>`.
- **Lists:** `ul`, `ol`, `li`, `p`, `h3`, `h4`, `h5`, `dl`/`dt`/`dd` (only inside `rm-step`).
- **Muted text:** `<span class="muted small">`.
- **Pill:** `<span class="pill">ฟรี</span>`.
- **Links to other topics:** `<a data-t="17"></a>`. The shell turns this into a chip. Use it for prerequisites and cross-references.

## 6. What each part must contain (minimum counts are hard requirements)

### Part 1 — `tNN-p1.html` — Learning Roadmap (roadmap.sh style)

1. **Overview.** `<h3 id="sN-1-overview">ภาพรวมเส้นทาง</h3>` then a short intro, then `<ol class="rm-overview">`. The list has one `<li>` per step: `<span class="lvl" data-lvl="b">Beginner</span> Step 1 · ชื่อขั้น`. It shows the path Step 1 → Step 2 → ...
2. **Prerequisites.** `<h3 id="sN-1-prereq">Prerequisites: ต้องรู้อะไรมาก่อน</h3>`. Say what the learner must know first, and link earlier topics with `<a data-t="..."></a>`.
3. **At least 10 steps.** Group them under three h3 headings: `sN-1-beginner`, `sN-1-intermediate` and `sN-1-advanced`. Each level must have at least 3 steps. Each step is:

   ```html
   <article class="rm-step" data-lvl="b">
     <header><span class="rm-no">STEP 1</span><h4>ชื่อขั้น</h4><span class="rm-time">1 สัปดาห์ · 6–8 ชม.</span></header>
     <dl>
       <dt>หัวข้อย่อย</dt><dd><ul><li>...</li></ul></dd>
       <dt>ทำไมต้องเรียน</dt><dd>...</dd>
       <dt>ใช้เวลา</dt><dd>...</dd>
     </dl>
     <div class="callout"><span class="c-label check">Checkpoint</span><p>ก่อนไปขั้นถัดไป คุณต้องทำสิ่งเหล่านี้ได้: ...</p></div>
   </article>
   ```

   - List at least 4 sub-topics per step.
   - The checkpoint must name concrete, testable abilities.
   - The step times should add up to roughly the topic's estimated hours (given in your task).
4. **Must-know skills.** `<h3 id="sN-1-skills">Must-know Skills</h3>` then `<ol class="skills">` with **at least 8** items. Each item: `<strong>skill</strong>` plus one sentence on why it matters.
5. **Tools & Frameworks.** `<h3 id="sN-1-tools">Tools &amp; Frameworks</h3>` then a table `<table class="tools">` with columns ชื่อ | ใช้ทำอะไร | ควรเริ่มใช้ในขั้นไหน. Include **at least 8** rows and give versions where relevant.
6. **Careers.** `<h3 id="sN-1-career">เส้นทางอาชีพ ตำแหน่งงาน และใบรับรอง</h3>`:
   - a table `<table class="careers">` with columns ตำแหน่ง | ทำอะไร | ระดับ | ทักษะที่ต้องมี, with at least 5 roles;
   - certifications as a list or table, with exam codes and statuses from section 2 (write "ไม่มีใบรับรองหลัก" if none exists);
   - a note that salaries vary and how to research them (JobsDB, LinkedIn). **Do not invent salary numbers.**

### Part 2 — `tNN-p2.html` — Core Concept & Quick Guide (W3Schools style)

- Start with an intro `<p>`, plus an environment-setup subsection `<h3 id="sN-2-setup">เตรียมเครื่องสำหรับหัวข้อนี้</h3>` with exact install commands and version checks, including their outputs.
- Then write **at least 10 concepts (aim for 12)**, ordered from easy to hard. Cover all three levels, with at least 3 concepts per level.
- The concepts must be exactly the ones in the outline you are given, with the same ids and order.
- Each concept:

  ```html
  <article class="concept">
    <div class="concept-meta"><span class="c-no">แนวคิดที่ 1</span><span class="lvl" data-lvl="b">Beginner</span></div>
    <h3 id="sN-2-c01">ชื่อแนวคิด</h3>
    <h4>คืออะไร ทำไมต้องใช้ และใช้เมื่อไร</h4>
    <p>...</p> (at least 2 paragraphs or a paragraph plus a list)
    <div class="callout analogy"><span class="c-label analogy">เปรียบเทียบ</span><p>real-life analogy</p></div>
    <h4>ตัวอย่างโค้ด</h4>
    (install block if needed) (file block) (run block)
    <h4>ผลลัพธ์ที่ได้จริง</h4>
    <pre class="code" data-kind="out" ...>REAL output</pre>
    <h4>อธิบายโค้ดทีละส่วน</h4>
    <div class="tbl mid"><table class="explain"><thead><tr><th>บรรทัด / ส่วน</th><th>ความหมาย</th></tr></thead><tbody>... one row per meaningful line or block ...</tbody></table></div>
    <h4>ข้อผิดพลาดที่มือใหม่เจอบ่อย</h4>
    <div class="tbl wide"><table class="mistakes"><thead><tr><th>อาการ / Error</th><th>สาเหตุ</th><th>วิธีแก้</th></tr></thead><tbody>... at least 3 rows, with real error messages ...</tbody></table></div>
    <div class="callout ok"><span class="c-label ok">Best Practice</span><p or ul>... practices used in real jobs ...</div>
    <div class="callout note"><span class="c-label try">ลองเอง</span><p>a short task that modifies the example</p><ol>...</ol></div>
  </article>
  ```

- Every code example must be **complete and runnable**: imports, install commands and sample data included, and no fragments.
- **Never show an output you did not get or could not reasonably predict exactly.**

### Part 3 — `tNN-p3.html` — Practice Exercises & Quizzes

1. **Fill-in-the-blank.** `<h3 id="sN-3-fill">Fill-in-the-blank</h3>`, then `<ol class="qlist fill">` with **at least 6** items: 2 ง่าย (`b`), 2 กลาง (`i`), 2 ยาก (`a`), in that order.
   - Each `<li>` starts with a level badge.
   - Show the blank as `_____`, inside the text or inside a code block.
2. **Multiple choice.** `<h3 id="sN-3-mcq">Multiple Choice</h3>`, then `<ol class="qlist mcq">` with **at least 10** items.
   - Each `<li>` has a level badge, a `<p>` question (code block allowed), and `<ol class="choices">` with **exactly 4** `<li>` options (shown as A–D).
   - Mix the levels, with at least 3 of each level.
3. **Hands-on challenges.** `<h3 id="sN-3-hands">Hands-on Challenge</h3>`, then **exactly 3** `<article class="challenge" data-lvl="b|i|a">` (Beginner, Intermediate, Advanced). Each contains:

   ```html
   <div class="concept-meta"><span class="c-no">โจทย์ที่ 1</span><span class="lvl" data-lvl="b">Beginner</span></div>
   <h4>title</h4>
   <h5>สถานการณ์</h5><p>a real-world scenario</p>
   <h5>สิ่งที่ต้องทำ</h5><ol>...at least 4 steps...</ol>
   <h5>ผลลัพธ์ที่คาดหวัง</h5> (text plus an example output block)
   <details class="hint"><summary>Hint</summary><div>...</div></details>
   ```

4. **Answers.** Put all answers at the end, under `<h3 id="sN-3-answers">เฉลย</h3>`, preceded by a `callout warn` that says to try first.
   - `<h4>เฉลย Fill-in-the-blank</h4>`, then one `<details class="ans">` per question: `<summary>ข้อ 1</summary>`. Give the answer and why.
   - `<h4>เฉลย Multiple Choice</h4>`, then one `<details class="ans">` per question. **Do not reveal the answer in the summary.** Inside:
     - `<p><strong>คำตอบ: B</strong> ...why it is correct...</p>`
     - `<ul class="why-wrong">` with one `<li>` for **each** of the 3 wrong options: `<strong>A</strong> ผิดเพราะ ...`
   - `<h4>เฉลย Hands-on Challenge</h4>`, then one `<details class="ans">` per challenge. Inside:
     - the **full** solution code (file and run blocks), tested;
     - its real output;
     - `<h5>แนวคิด</h5>` explaining the approach;
     - `<h5>ไอเดียต่อยอด</h5>` with at least 3 extension ideas.

### Part 4 — `tNN-p4.html` — ส่วนเสริม

1. **Mini project.** `<h3 id="sN-4-project">Mini Project: name</h3>`. Use the planned project given in your task, and make it portfolio-worthy. Include:
   - the goal, the features, and the final folder structure (a `plaintext` code block);
   - `<ol class="proj-steps">` with **at least 6** steps. Each step is an `<li>` with `<h4>Step k: ...</h4>`, an explanation, and **complete code or commands** for that step;
   - a test or verification step with real output;
   - a README template, and how to push it to GitHub (link `<a data-t="17"></a>`);
   - extension ideas.
2. **Cheat sheet.** `<h3 id="sN-4-cheat">Cheat Sheet</h3>`. Write one or more `<div class="tbl"><table class="cheat">` tables, grouped by theme with h4 headings, and **at least 30 rows** in total. Columns: คำสั่ง / Syntax | ใช้ทำอะไร | ตัวอย่าง.
3. **Interview questions.** `<h3 id="sN-4-interview">Interview Questions</h3>`, then **exactly 5** `<details class="iq"><summary>1. question</summary><div>model answer: what a strong candidate says, key points, and a short example if useful</div></details>`. Mix junior and mid-level questions.
4. **Resources.** `<h3 id="sN-4-resources">แหล่งเรียนต่อ</h3>`, then `<ul class="res">` with **at least 6** items: official docs and well-known free courses.
   - Each item: `<a href="https://..." target="_blank" rel="noopener">Name</a>`, a dash, a Thai description, and `<span class="pill">ฟรี</span>` or `<span class="pill">มีค่าใช้จ่าย</span>`.
   - Use only real, long-standing URLs that you are confident exist (official documentation home pages are safest).

## 7. Validation (mandatory)

Run the validator on your file, and fix **every** error before you finish. Warnings should also be fixed unless they are clearly fine.

```bash
python3 /tmp/claude-0/-home-user/fe474bf2-4538-5703-885b-2ffd0c503494/scratchpad/spec/validate_fragment.py <file> --topic N --part K
```

The validator checks:

- that tags are balanced;
- that there is no unescaped HTML inside code blocks;
- the ids;
- the classes;
- the minimum counts;
- the forbidden phrases.
