// สร้าง prompt แบบเดียวกับ write-topic-v4.js แล้วเขียนเป็นไฟล์ให้ agent อ่าน
// usage: node gen.js <n> "<name>" <mode> <which...>   which = p1 | p2 | p3 | p4 | review
const fs = require('fs')
const SCRIPT = '/root/.claude/projects/-home-user/fe474bf2-4538-5703-885b-2ffd0c503494/workflows/scripts/write-topic-v4.js'
const lines = fs.readFileSync(SCRIPT, 'utf8').split('\n')
const body = lines.slice(10, 121).join('\n') // บรรทัด 11-121: ค่าคงที่และฟังก์ชันสร้าง prompt
const [n, name, mode, ...which] = process.argv.slice(2)
const P = new Function('args', body + '\nreturn { p1Prompt, writePrompt, reviewPrompt }')({ topic: { n: +n, name }, mode })
const REPORT = `\n\nFINAL MESSAGE FORMAT (this replaces "the structured report"): your last message must start with a line "VALIDATOR: " followed by the validator's RESULT line and COUNTS line, then a line "NOTES: " followed by what you ran and tested, what could not be tested, any concerns${'${R}'}.`
const pad = String(n).padStart(2, '0')
for (const w of which) {
  const text = w === 'p1' ? P.p1Prompt() : w === 'review' ? P.reviewPrompt : P.writePrompt(+w.slice(1))
  const extra = REPORT.replace('${R}', w === 'review' ? ', and every fix you made' : '')
  const out = `${__dirname}/t${pad}-${w}.txt`
  fs.writeFileSync(out, text + extra + '\n')
  console.log(out, (text + extra).length, 'chars')
}
