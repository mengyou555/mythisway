# Topic writing queue (recommended order)

Run 2 at a time. Use the workflow script at `/root/.claude/projects/-home-user/fe474bf2-4538-5703-885b-2ffd0c503494/workflows/scripts/write-topic-v4.js` with args `{"topic":{"n":N,"name":"..."},"mode":"..."}`.

## Modes

| Mode | Meaning |
|---|---|
| `skip` | Part 1 is complete and the outline exists |
| `outline` | Part 1 is complete; write the outline only |
| `complete` | Part 1 is partial; finish it and write the outline |
| `fresh` | Nothing exists yet |

## Queue

| # | Topic | Mode | Status |
|---|---|---|---|
| 1 | 19 Linux | skip | DONE: all 4 PASS, reviewed, published v4 |
| 2 | 17 Git and GitHub | skip | ALL 4 PASS + published (v3); DONE: reviewed, published v4 |
| 3 | 9 Python | skip | DONE: all 4 PASS, p3 reviewed (1 fix), published v6 |
| 4 | 16 Prompt Engineering | skip | DONE: all 4 PASS, p3 reviewed (3 fixes incl. allowlist bypass), published v7 |
| 5 | 14 SQL | skip | DONE: all 4 PASS, p3 reviewed (4 fixes), published v9 (10-21) |
| 6 | 1 Network Engineer | skip | DONE: all 4 PASS, p3 reviewed (7 fixes), published v10 (10-21) |
| 7 | 4 JavaScript | skip | DONE: all 4 PASS, p3 reviewed (2 fixes), published v12 (10-21) |
| 8 | 15 TypeScript | skip | DONE: all 4 PASS, p3 reviewed (4 unrendered placeholders fixed), published v13 (10-21) |
| 9 | 13 Node.js | skip | DONE: all 4 PASS, p3 reviewed (2 fixes), published v15 (10-21) |
| 10 | 8 API Design | skip | DONE: all 4 PASS, p3 reviewed (1 made-up output fixed + 3 clarity edits), published v16 (10-22) |
| 11 | 12 Backend | skip | DONE: all 4 PASS, p3 reviewed (2 fixes), published v17 (10-22) |
| 12 | 6 Go | skip | DONE: all 4 PASS, p3 reviewed (1 clarity edit), published v19 (10-22) |
| 13 | 10 AI and Data Scientist | fresh | NOT STARTED. prompts/t10-*.txt ready (p1 first) |
| 14 | 11 AI Engineer | skip | DONE: all 4 PASS, p3 reviewed (3 fixes incl. KeyError->500 bug in a3_service.py), published v21 (10-22) |
| 15 | 7 AI Agents | skip | DONE: all 4 PASS, p3 reviewed (4 fixes: SDK retry/auth facts, tool_result wording, trace ms note), published v20 (10-22) |
| 16 | 2 Vibe Coding | skip | DONE: all 4 PASS, p3 reviewed (11 text fixes), published v28 (10-29) |
| 17 | 5 Cyber Security | skip | DONE: all 4 PASS; p3 reviewed (11 fixes); ATT&CK fix applied (external scan T1046/TA0007 -> T1595/TA0043 in c02 code+re-run output+prose, c08 prose, p3 MCQ3); published v27 (10-29) |
| 18 | 18 Android | skip | p1 published + outline (10-28). p2 DONE 407 KB PASS ((agent); orchestrator fixed 390px URL overflow in 10-c10). p3 DONE 180 KB PASS ((agent)). p2+p3 published 10-29 14:49 UTC (Version 32) as CONTENT 18:3, QA OK; pushed to GitHub 10-29 21:25 UTC. 5h limit (reset 18:50 UTC) cut p4 (agent) + review (agent) (no output). 21:10 UTC fresh p4 (agent) (wrote build/t18-p4/PLAN.txt = 10 chunks, no chunk yet) + review (agent) (no edits; re-ran Part 3 checks in work/t18-p3-review) STOPPED 21:20 UTC by user ("หยุดและบันทึกก่อน"). NEXT when user says continue: fresh p4 (reuse PLAN.txt) + fresh review (a: restore real http.server date NOT done; b: verified verbatim; c, d unverified). Superseded, do NOT resume: (agent), (agent), (agent), (agent), (agent), (agent). Then CONTENT 18:4 + QA [18] + publish + push |
| 19 | 3 Game Developer | skip | DONE 2026-10-29 09:05 UTC: p1-p4 PASS, p3 reviewed (11 fixes, (agent)); reviewer concern on P2 c02 queue_free checked: 20 runs without --fixed-fps + 10 with = identical, no change; P2 c04 already shows the Parse Error. CONTENT 3:4, QA [3] 1440/390 OK, published |

## After each topic completes

1. Run the validator on all 4 parts.
2. Set `CONTENT[N]=4` in `site/tech-roadmap.html` (`var CONTENT = {...}`).
3. Republish the artifact. It lives at https://claude.ai/artifact/CQ9hL7FuzR6uJNEbwEiiH9, file path `site/tech-roadmap.html`, with `files` mapping `topics/tNN-pK.html` to the files in `site/topics/`.
4. If the session limit is hit, resume the failed run with `resumeFromRunId`. Agents are resume-aware and continue partially written files.

## Resume rule (v4, from 2026-10-19 22:40)

- The v4 script writes each part as chunk files in `build/tNN-pK/`. Each chunk ends with `<!-- chunk-complete -->`, and a finished part gets a `build/tNN-pK.done` marker.
- After a usage-limit cut, re-launch v4 for the same topic with mode `skip` once the outline exists. Agents skip finished work with `ls`/`grep` and never re-read finished chunks.
- Runs launched before v4 (19 and 17) wrote single files. If they are cut, re-launch them with v4: agents read only the last 150 lines.

## 2026-10-20 08:45 UTC note
- Ultracode was turned OFF at ~08:45. The user then explicitly opted in with "ใช้ workflow" (~09:00 UTC 2026-10-20), so workflows are allowed again for this task.
- work/t16-p2/expand.py pattern: src/NAME.src.html with @@FILE path@@ / @@OUT name@@ placeholders -> build chunk (auto-escaped).
- 2026-10-20 ~10:05 UTC: session limit hit again (reset 13:40). Relaunched 14 and 1 at 15:01 with mode skip.
- 2026-10-20 ~15:10 UTC: WEEKLY limit hit (reset 10:00 UTC 10-21). User said "ลองอีกครั้ง"; relaunched 14 and 1 at 11:28 UTC 10-21.
- QA render check now uses its own server on port 8799 (qa/srv). Port 8765 was taken by an agent lab server on 10-21.
- 2026-10-21: validator now FAILS on unrendered template placeholders (@@FILE x@@, @@OUT:x@@, {{FILE x}}). Found + fixed 6 in published t09-p4 (Mini Project code) via work/t09-p4/render.py; republished v13.
- 2026-10-22: ORDER CHANGE for weekly-limit risk: do topics whose Part 1 + outline already exist first: 7 (skip), then 11 (outline), 5 (outline), then 2/18/3 (complete), then 10 (fresh) last.
- 2026-10-22: validator now also FAILS on literal U+FFFD (publisher refuses it). Intended ones (Go byte-slicing demo) rewritten as &#xFFFD; in t06-p2/p3 + chunks.
- 2026-10-22: published t06-p2 (v19) had 42 unrendered {{F:..}}/{{O:..}} placeholders from an earlier run. Rendered via work/t06-p2/render.py (go vet + tests pass on go1.27.2), byte-checked, republished v20. Validator regex broadened to catch {{X:...}}.
- 2026-10-22 22:10 UTC: the Workflow tool was REMOVED from this session. New procedure: `node prompts/gen.js <n> "<name>" <mode> p1|p2|p3|p4|review` writes the exact v4 prompts to prompts/tNN-<which>.txt (plus a final-message format); launch one Agent (general-purpose) per file with a short prompt telling it to cat the file and follow it. Order per topic: p1 (if not done) -> p2,p3,p4 in parallel -> review after p3.
- 2026-10-23 06:10 UTC: container restarted overnight; scratchpad intact. PASS 60/76 (published 58 + t05-p3/p4 uploaded hidden). Backup of tooling + in-progress chunks uploaded to the artifact under backup/ (see backup/README.txt).
- 2026-10-28 10:16 UTC: weekly limit reset; scratchpad intact. Relaunched via Agent tool: t05-p2, t02-p2, t02-p3, t02-p4, t18-p1, t03-p1. Next: t02-review (after p3), t18/t03 p2-p4 + review (after their p1+outline), t10 p1 (fresh) then p2-p4 + review, c02 ATT&CK fix after t05-p2.
- 2026-10-28: quota-bound -> keep <= 6 agents at once (more concurrency only adds re-processing waste at each 5-hour boundary). Resume cut agents with SendMessage after reset.
- 2026-10-28 20:45 UTC: user asked to save. PASS 64/76. All agents were cut by the 5h limit (reset 20:40 UTC); NOT resumed (user said save first). Backup refreshed in artifact v25. Agents to resume with SendMessage when the user says continue: t05-p2, t02-p2, t02-review, t03-p2, t03-p3, t03-p4.
- 2026-10-28 22:30 UTC: user said continue. Cleared /root/.cache/{pip,go-build,uv} (disk 4.3G -> 11G free). Resumed via SendMessage: t05-p2, t02-p2, t02-review, t03-p2, t03-p3, t03-p4. Queue next: t18-p2/p3/p4 (+review), t03-review, t10-p1 (reuse work/t10/torchvenv), c02 ATT&CK fix.
- USER PREFERENCE (2026-10-28): report the progress percentage every round, and explicitly when credits are close to running out. How to check: mcp__claude-code-remote__get_session (no session_id) -> external_metadata.rate_limit_info {rateLimitType, status, resetsAt}. status "allowed_warning" = near the limit -> warn the user with the % and what is saved. Include "X/76 (Y%)" in every update.
- 2026-10-28 22:35 UTC: rate_limit_info = seven_day / allowed_warning, resetsAt 1793786400 = 2026-11-04 10:00 UTC (17:00 Thai). Paused t03-p2/p3/p4 (asked to checkpoint verified work as chunks) so quota goes to t05-p2, t02-p2, t02-review first.
- 2026-10-28 22:35 UTC: rate_limit_info now five_hour / allowed_warning (resets 1793238000 = 10-29 01:40 UTC = 08:40 Thai). Weekly also warned earlier. Backup refreshed (t05-p2 12/14, t02-p2 7/13, t03-p2 1/13, t03-p4 PLAN).
- 2026-10-29 03:20 UTC: 5h limit had reset (01:40); weekly still allowed_warning (resets 11-04 10:00 UTC). User said continue. Resumed ONLY t05-p2 (12/14), t02-p2 (8/13), t02-review. t03-p2 (2/13), t03-p3 (PLAN 9, 0 chunks), t03-p4 (PLAN 9, 0 chunks) stay paused; resume them with SendMessage when weekly credit allows.
- 2026-10-29 03:30 UTC: USER COMPLAINT: "continue" burns ~30% of the credit window at the start. Cause: (1) main session context ~540k tokens re-read on every tool call (cache expired after pauses); (2) each resumed agent reloads its whole history (~250-290k tokens each, e.g. t03-p1 resume used 248k tokens for 3 tool calls). NEW POLICY: max 2-3 agents at once; resume an old agent only if it has substantial unsaved in-context progress, otherwise start a FRESH agent from the prompt file (loads ~50k); never pause agents mid-part; batch checks into one Bash call; suggest the user run /compact.
- Resumable agent IDs (SendMessage): t02-p2 (agent) (running), t03-p2 (agent) (2/13 chunks), t03-p3 (agent) (PLAN only), t03-p4 (agent) (PLAN only; project code in work/t03-p4/star-dodger, untested). For t03-p3/p4 prefer FRESH agents (little saved progress).
- 2026-10-29 03:35 UTC: PASS 66/76. Running only 2 agents (t03-p2, t03-p4). Old agents (agent) / (agent) / (agent) are superseded: do NOT resume them.
