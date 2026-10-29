export const meta = {
  name: 'write-topic-v4',
  description: 'Write (or resume) all 4 parts of one curriculum topic as HTML fragments, then verify the quiz answer keys',
  phases: [
    { title: 'Roadmap', detail: 'part 1 + outline file (resume-aware)' },
    { title: 'Write', detail: 'parts 2, 3, 4 (resume-aware)' },
    { title: 'Review', detail: 'verify part 3 answer keys and solutions' },
  ],
}

const ROOT = '/tmp/claude-0/-home-user/fe474bf2-4538-5703-885b-2ffd0c503494/scratchpad'
const SPEC = ROOT + '/spec/CONTENT_SPEC.md'
const VAL = ROOT + '/spec/validate_fragment.py'
const BRIEFS = ROOT + '/spec/briefs.json'
const pad = n => String(n).padStart(2, '0')
const t = args.topic
const mode = args.mode
const FILE = k => `${ROOT}/site/topics/t${pad(t.n)}-p${k}.html`
const WORK = k => `${ROOT}/work/t${pad(t.n)}-p${k}`
const OUTLINE = `${ROOT}/spec/outlines/t${pad(t.n)}.json`
const validate = k => `python3 ${VAL} ${FILE(k)} --topic ${t.n} --part ${k}`
const CH = k => `${ROOT}/build/t${pad(t.n)}-p${k}`
const DONE = k => `${ROOT}/build/t${pad(t.n)}-p${k}.done`

const REPORT = {
  type: 'object',
  properties: {
    validator: { type: 'string', description: 'final RESULT line + COUNTS' },
    notes: { type: 'string', description: 'what was tested, what could not be tested, any concerns' },
  },
  required: ['validator', 'notes'],
}

const BRIEF = `TOPIC ${t.n}: "${t.name}".
FIRST read the full spec ${SPEC} (mandatory rules), then print your topic brief and follow it:
python3 -c "import json;b=[x for x in json.load(open('${BRIEFS}')) if x['n']==${t.n}][0];print(json.dumps(b,ensure_ascii=False,indent=1))"
(The brief gives the summary, hours, prerequisites and topics already finished, career tracks, the planned Mini Project, and detailed guidance you must cover.)`

const EFFICIENCY = `WORK EFFICIENTLY (usage limits are tight): plan before writing, write in chunks as described below, batch your test runs, and never re-read files you have already written. Keep depth, but stay near the size target.`

const RESUME = k => `HOW TO WRITE (resume-safe; never re-read finished work):
- Build the part from chunk files in ${CH(k)}/ (mkdir -p it). FIRST write ${CH(k)}/PLAN.txt listing the chunk file names in order (e.g. 00-intro.html, 01-c01.html, 02-c02.html, ...), one per line.
- Write each chunk with ONE Write call (aim for 10–25 KB). Its LAST line must be exactly: <!-- chunk-complete -->
- Never read a chunk back after writing it, unless the validator reports an error inside it (then grep -n for the problem and Edit only that spot).
- Assemble when all chunks exist: (cd ${CH(k)} && cat $(cat PLAN.txt) | grep -v 'chunk-complete' > ${FILE(k)}), then run the validator. Fix the specific chunk and re-assemble until PASS.
- When the validator PASSES, run: touch ${DONE(k)}
RESUME (an earlier run may have been interrupted, e.g. by a usage limit):
- If ${DONE(k)} exists: run the validator once. If PASS, return your report immediately without reading any content.
- Else if ${CH(k)}/PLAN.txt exists: cat PLAN.txt, then run: grep -L 'chunk-complete' ${CH(k)}/*.html (and ls) to see which chunks are unfinished or missing. Do NOT open finished chunks. Delete unfinished ones and write only the missing chunks, then assemble.
- Else if an older single file ${FILE(k)} exists: run the validator. If PASS, touch ${DONE(k)} and return. Otherwise do NOT read the whole file: read only its last 150 lines (tail -n 150) to see where it stopped, and grep -n '<h3 id=' to list the sections it already has. Then move it into ${CH(k)}/00-existing.html, append the chunk marker line to it, list it first in PLAN.txt, and write the remaining content as new chunks (including any missing closing tags).`

function p1Prompt() {
  const head = `You are an expert tech educator, instructional designer and senior engineer writing one topic of a Thai self-study curriculum website.\n\n${BRIEF}\n\n${EFFICIENCY}\n`
  const outlineTask = `Then, unless ${OUTLINE} already exists and is valid JSON with at least 10 concepts (check with: python3 -c "import json;print(len(json.load(open('${OUTLINE}'))['concepts']))"; if so do not touch it), write the topic outline as JSON to ${OUTLINE} with keys:
- "concepts": a list of 12 objects (minimum 10), each with id (c01, c02, ...), level (b/i/a), title (Thai/English, as it will appear), covers (what it teaches and what its runnable example will demonstrate), language and env. Order them easy to hard, with at least 3 per level.
- "mini_project": an object with name, summary, features and stack (exact versions).
- "versions": exact tool/library versions all parts must use.
- "notes": conventions for the other writers, such as sample data, file/folder names, the username somchai and terminology.
The other writers will build Parts 2–4 only from this outline and the brief, so make it specific and consistent with Part 1.`
  if (mode === 'outline') return head + `Part 1 (${FILE(1)}) is ALREADY COMPLETE and passes validation; do not rewrite it. Read it to understand the roadmap. ${outlineTask}\nKeep the Mini Project name from the brief. Return the structured report (validator = output of: ${validate(1)}).`
  return head + `${RESUME(1)}
Write Part 1 (Learning Roadmap) to ${FILE(1)} exactly as specified in spec section 6 (Part 1). Size target: 90–150 KB. Use the verified facts in spec section 2.
Run: ${validate(1)} and fix until RESULT: PASS.
${outlineTask}
Return the structured report.`
}

function writePrompt(k) {
  const common = `You are an expert tech educator and senior engineer writing one part of a Thai self-study curriculum website.

${BRIEF}

Then read the agreed topic outline at ${OUTLINE} and follow it exactly (concept ids and order, mini project, versions, notes).

${EFFICIENCY}
${RESUME(k)}

Write your file to: ${FILE(k)}
Use the scratch directory ${WORK(k)} to create and RUN every example in the sandbox. Copy the real output into the page.
When finished, run: ${validate(k)} and fix until RESULT: PASS. Check each chunk carefully BEFORE writing it (real outputs, working code, natural Thai, escaped HTML) instead of re-reading the file afterwards. Return the structured report.
`
  if (k === 2) return common + `
YOUR PART: Part 2 — Core Concept & Quick Guide. Size target: 130–200 KB.
- Write the setup subsection (id s${t.n}-2-setup), then every concept from the outline, in order, with ids s${t.n}-2-c01, s${t.n}-2-c02, ...
- Every concept needs ALL spec elements:
  - what / why / when;
  - an analogy callout;
  - a complete runnable example (install, file and run blocks);
  - the REAL output;
  - an explanation table;
  - a mistakes table with at least 3 rows and real error messages;
  - a Best Practice callout;
  - a "ลองเอง" task.
- Advanced concepts must be as detailed as beginner ones.`
  if (k === 3) return common + `
YOUR PART: Part 3 — Practice Exercises & Quizzes. Size target: 70–120 KB.
- At least 6 fill-in-the-blank questions (2 ง่าย, 2 กลาง, 2 ยาก).
- At least 10 MCQs, each with exactly 4 options, at least 3 per level, testing understanding of the outline's concepts.
- Exactly 3 hands-on challenges (Beginner, Intermediate, Advanced), each based on a realistic scenario.
- The answers section goes at the end:
  - each MCQ explains why the right answer is right and why EACH of the 3 wrong options is wrong;
  - each hands-on challenge gets a FULL tested solution with real output, the approach, and at least 3 extension ideas.
- Verify every answer key yourself.`
  return common + `
YOUR PART: Part 4 — ส่วนเสริม. Size target: 70–120 KB.
- Mini Project: exactly the outline's project. BUILD AND TEST it for real in the scratch directory, then document it as at least 6 steps with complete code for every file, a verification step with real output, a README template, how to push it to GitHub, and extension ideas.
- Cheat Sheet: at least 30 rows, grouped by theme.
- Exactly 5 interview questions with strong model answers.
- At least 6 resources, using real URLs you are confident about (official docs home pages are safest).`
}

const REVIEWED = `${ROOT}/build/t${pad(t.n)}-p3.reviewed`
const reviewPrompt = `If ${REVIEWED} exists, the review is already finished: run ${validate(3)} once and return immediately without reading the file.\nYou are a strict reviewer for a Thai self-study tech curriculum. Read the spec ${SPEC} (section 6, Part 3) and the outline ${OUTLINE}.
FILE: ${FILE(3)} (Part 3 of topic ${t.n} "${t.name}"). ASSUME it contains mistakes. Your focus is correctness of the answers:
1. For EVERY MCQ, solve it yourself first, then compare with the answer key. Check that the "why-wrong" explanation of each wrong option is accurate. If a question is ambiguous (two defensible answers), rewrite the options.
2. Verify every fill-in-the-blank answer. Where possible, verify it by running the code.
3. Extract and RUN every hands-on solution in ${WORK(3)}-review, and make sure the shown output is the real output.
4. Fix everything directly in the file with Edit. Never delete content just to pass a check.
5. Run ${validate(3)} (it must PASS), then: touch ${REVIEWED}
${EFFICIENCY}
Return the structured report, listing what you fixed in notes.`

let p1 = { validator: 'skipped (already complete with outline)', notes: '' }
if (mode !== 'skip') {
  p1 = await agent(p1Prompt(), { label: `t${t.n}:p1-${mode}`, phase: 'Roadmap', schema: REPORT, effort: mode === 'outline' ? 'medium' : 'high' })
  if (!p1) return { topic: t.n, error: 'part 1 / outline stage failed' }
}
const PARTS = args.parts || [2, 3, 4]
const DO_REVIEW = args.review === undefined ? true : args.review
const res = await parallel(PARTS.map(k => () =>
  agent(writePrompt(k), { label: `t${t.n}:p${k}`, phase: 'Write', schema: REPORT, effort: 'high' })))
const out = { topic: t.n, p1 }
PARTS.forEach((k, i) => { out['p' + k] = res[i] })
const p3ok = PARTS.includes(3) ? !!res[PARTS.indexOf(3)] : true
out.p3review = DO_REVIEW && p3ok
  ? await agent(reviewPrompt, { label: `t${t.n}:p3-review`, phase: 'Review', schema: REPORT, effort: 'medium' })
  : null
return out
