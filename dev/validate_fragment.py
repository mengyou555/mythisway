#!/usr/bin/env python3
"""ตรวจไฟล์ HTML fragment ของหลักสูตรตาม CONTENT_SPEC.md

ใช้: python3 validate_fragment.py <file> --topic N --part K [--all-ids-from DIR]
ออกด้วย code 1 ถ้ามี ERROR
"""
import argparse
import re
import sys
from html.parser import HTMLParser

VOID = {"br", "hr", "img", "input", "meta", "link", "wbr", "col", "source"}
FORBIDDEN_TAGS = {"html", "head", "body", "style", "script", "iframe", "object", "embed", "form", "link", "meta"}
ALLOWED_TAGS = {
    "section", "h2", "h3", "h4", "h5", "p", "ul", "ol", "li", "div", "span", "pre", "code", "table", "thead",
    "tbody", "tr", "th", "td", "a", "strong", "em", "kbd", "br", "details", "summary", "article", "header",
    "dl", "dt", "dd", "sup", "sub", "small", "b", "i", "hr", "caption",
}
ALLOWED_CLASSES = {
    "part", "sec-no", "rm-overview", "rm-step", "rm-no", "rm-time", "lvl", "skills", "tools", "careers",
    "concept", "concept-meta", "c-no", "callout", "warn", "ok", "sec", "note", "analogy", "c-label", "tip",
    "try", "check", "code", "tbl", "wide", "mid", "explain", "mistakes", "qlist", "fill", "mcq", "choices",
    "challenge", "hint", "ans", "why-wrong", "proj-steps", "cheat", "iq", "res", "pill", "muted", "small",
    "nw", "num",
}
ALLOWED_ATTRS = {"id", "class", "href", "target", "rel", "data-part", "data-lvl", "data-env", "data-label",
                 "data-kind", "data-t", "title", "colspan", "rowspan", "scope", "open", "start", "type"}
ENVS = {"wsl", "win", "file", "app", "out", "tpl"}
FORBIDDEN_PHRASES = ["และอื่นๆ", "และอื่น ๆ", "ฯลฯ", "ทำแบบเดียวกัน", "ที่เหลือก็คล้ายกัน", "TODO", "TBD", "lorem", "Lorem"]


class Node:
    __slots__ = ("tag", "attrs", "children", "parent", "text")

    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children, self.text = [], []

    def classes(self):
        return set((self.attrs.get("class") or "").split())

    def iter(self):
        yield self
        for c in self.children:
            yield from c.iter()

    def find_all(self, tag=None, cls=None):
        for n in self.iter():
            if n is self:
                continue
            if tag and n.tag != tag:
                continue
            if cls and cls not in n.classes():
                continue
            yield n

    def direct(self, tag=None, cls=None):
        for n in self.children:
            if (not tag or n.tag == tag) and (not cls or cls in n.classes()):
                yield n

    def all_text(self):
        out = list(self.text)
        for c in self.children:
            out.append(c.all_text())
        return "".join(out)


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", [], None)
        self.cur = self.root
        self.errors, self.warnings = [], []
        self.ids = []

    def handle_starttag(self, tag, attrs):
        line = self.getpos()[0]
        # ตรวจว่ามีแท็กอยู่ใน <pre><code> หรือไม่ (แปลว่าลืม escape)
        anc = self.cur
        while anc is not None:
            if anc.tag == "code" and anc.parent is not None and anc.parent.tag == "pre":
                self.errors.append(f"line {line}: <{tag}> inside <pre><code> — unescaped HTML (use &lt; &gt; &amp;)")
                break
            anc = anc.parent
        if tag in FORBIDDEN_TAGS:
            self.errors.append(f"line {line}: forbidden tag <{tag}>")
        elif tag not in ALLOWED_TAGS:
            self.warnings.append(f"line {line}: unusual tag <{tag}>")
        for k, v in attrs:
            if k.startswith("on"):
                self.errors.append(f"line {line}: event handler attribute {k}")
            elif k == "style":
                self.errors.append(f"line {line}: style attribute not allowed")
            elif k not in ALLOWED_ATTRS:
                self.warnings.append(f"line {line}: unusual attribute {k}")
            if k == "class" and v:
                for c in v.split():
                    if c.startswith("language-"):
                        continue
                    if c not in ALLOWED_CLASSES:
                        self.errors.append(f"line {line}: unknown class '{c}' on <{tag}>")
            if k == "id":
                self.ids.append((v or "", line))
            if k == "data-env" and v not in ENVS:
                self.errors.append(f"line {line}: bad data-env '{v}'")
            if k == "href" and v and not (v.startswith("https://") or v.startswith("http://") or v.startswith("#")):
                self.warnings.append(f"line {line}: unusual href '{v}'")
        node = Node(tag, attrs, self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and self.cur.tag == tag:
            self.cur = self.cur.parent

    def handle_endtag(self, tag):
        line = self.getpos()[0]
        if tag in VOID:
            return
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is None:
            self.errors.append(f"line {line}: stray </{tag}>")
            return
        m = self.cur
        while m is not n:
            if m.tag not in ("li", "p", "dt", "dd", "td", "th", "tr", "thead", "tbody"):
                self.errors.append(f"line {line}: <{m.tag}> not closed before </{tag}>")
            m = m.parent
        self.cur = n.parent

    def handle_data(self, data):
        self.cur.text.append(data)


def lvl_of(node):
    for s in node.find_all("span", "lvl"):
        return s.attrs.get("data-lvl")
    return None


def check(path, topic, part):
    src = open(path, encoding="utf-8").read()
    p = P()
    p.feed(src)
    p.close()
    E, W = p.errors, p.warnings
    root = p.root
    if p.cur is not root:
        open_tags = []
        n = p.cur
        while n is not root:
            open_tags.append(n.tag)
            n = n.parent
        E.append("unclosed tags at end of file: " + " > ".join(reversed(open_tags)))

    # ids
    seen = set()
    pref = f"s{topic}-"
    for i, line in p.ids:
        if not re.fullmatch(r"[a-z0-9-]+", i or ""):
            E.append(f"line {line}: id '{i}' must use only a-z 0-9 -")
        if not i.startswith(pref):
            E.append(f"line {line}: id '{i}' must start with '{pref}'")
        if i in seen:
            E.append(f"line {line}: duplicate id '{i}'")
        seen.add(i)
    for h in root.find_all("h3"):
        if not h.attrs.get("id"):
            E.append(f"h3 without id: '{h.all_text().strip()[:60]}'")

    # phrases
    text = root.all_text()
    for ph in FORBIDDEN_PHRASES:
        if ph in text:
            E.append(f"forbidden phrase found: '{ph}'")

    # literal U+FFFD is refused by the publisher; an intended one must be written as &#xFFFD;
    for m in re.finditer("\ufffd", src):
        line = src.count("\n", 0, m.start()) + 1
        E.append(f"line {line}: literal U+FFFD replacement character (write &#xFFFD; if intended, else fix the broken text)")

    # template placeholders left unrendered (git hunk headers "@@ -1,3 +1,4 @@" are fine)
    # also {{F:path}} / {{O:name}} / {{FILE x}}; Go composite literals like {{Supplier: "x"}} are fine
    for m in re.finditer(r"@@[A-Z][A-Z_]*[ :][^@\n]{0,200}@@|\{\{[A-Z]{1,6}[ :][^}\s\"]{1,200}\}\}", src):
        line = src.count("\n", 0, m.start()) + 1
        E.append(f"line {line}: unrendered template placeholder {m.group(0)[:80]!r}")

    # part wrapper
    secs = [s for s in root.find_all("section", "part")]
    if len(secs) != 1:
        E.append(f"expected exactly 1 <section class=\"part\">, found {len(secs)}")
    h2 = [h for h in root.find_all("h2")]
    if not h2 or h2[0].attrs.get("id") != f"s{topic}-{part}":
        E.append(f"first h2 must have id s{topic}-{part}")

    # code blocks
    pres = list(root.find_all("pre"))
    for pre in pres:
        if "code" not in pre.classes():
            E.append("<pre> without class 'code'")
        env = pre.attrs.get("data-env")
        if not env:
            E.append("<pre class=code> without data-env")
        if not pre.attrs.get("data-label") and pre.attrs.get("data-kind") != "out":
            W.append("<pre> without data-label")
        codes = list(pre.direct("code"))
        if len(codes) != 1:
            E.append("<pre> must contain exactly one <code>")
        if env == "out" and pre.attrs.get("data-kind") != "out":
            E.append("output block needs data-kind=\"out\"")
        if pre.attrs.get("data-kind") == "out" and env != "out":
            E.append("data-kind=out needs data-env=out")

    counts = {}

    def need(name, val, minimum):
        counts[name] = val
        if val < minimum:
            E.append(f"COUNT {name} = {val} (need >= {minimum})")

    if part == 1:
        steps = list(root.find_all("article", "rm-step"))
        need("rm-step", len(steps), 10)
        lv = [s.attrs.get("data-lvl") for s in steps]
        for L in "bia":
            need(f"rm-step level {L}", lv.count(L), 3)
        for s in steps:
            subs = sum(len(list(ul.find_all("li"))) for ul in s.find_all("ul"))
            if subs < 4:
                E.append(f"rm-step '{s.all_text().strip()[:40]}' has {subs} sub-topics (need >= 4)")
            if not any("check" in c.classes() for c in s.find_all("span", "c-label")):
                E.append(f"rm-step '{s.all_text().strip()[:40]}' missing Checkpoint")
            if not list(s.find_all("span", "rm-time")):
                E.append("rm-step missing rm-time")
        need("skills items", sum(len(list(o.direct("li"))) for o in root.find_all("ol", "skills")), 8)
        need("tools rows", sum(len(list(t.find_all("tr"))) - 1 for t in root.find_all("table", "tools")), 8)
        need("careers rows", sum(len(list(t.find_all("tr"))) - 1 for t in root.find_all("table", "careers")), 5)
        need("rm-overview items", sum(len(list(o.direct("li"))) for o in root.find_all("ol", "rm-overview")), 10)
        for hid in ("overview", "prereq", "beginner", "intermediate", "advanced", "skills", "tools", "career"):
            if f"s{topic}-1-{hid}" not in seen:
                E.append(f"missing h3 id s{topic}-1-{hid}")
    elif part == 2:
        concepts = list(root.find_all("article", "concept"))
        need("concepts", len(concepts), 10)
        lv = [lvl_of(c) for c in concepts]
        for L in "bia":
            need(f"concept level {L}", lv.count(L), 3)
        for idx, c in enumerate(concepts, 1):
            label = f"concept {idx} '{(next(c.find_all('h3'), None) or c).all_text().strip()[:40]}'"
            if not list(c.find_all("h3")):
                E.append(f"{label}: missing h3")
            if not any("analogy" in d.classes() for d in c.find_all("div", "callout")):
                E.append(f"{label}: missing analogy callout")
            code_blocks = [x for x in c.find_all("pre") if x.attrs.get("data-kind") not in ("out", "tpl")]
            outs = [x for x in c.find_all("pre") if x.attrs.get("data-kind") == "out"]
            if not code_blocks:
                E.append(f"{label}: missing code block")
            if not outs:
                E.append(f"{label}: missing output block")
            ex = list(c.find_all("table", "explain"))
            if not ex:
                E.append(f"{label}: missing explain table")
            elif len(list(ex[0].find_all("tr"))) - 1 < 3:
                W.append(f"{label}: explain table has < 3 rows")
            mk = list(c.find_all("table", "mistakes"))
            if not mk:
                E.append(f"{label}: missing mistakes table")
            elif len(list(mk[0].find_all("tr"))) - 1 < 3:
                E.append(f"{label}: mistakes table needs >= 3 rows")
            labels = set()
            for s in c.find_all("span", "c-label"):
                labels |= s.classes()
            if "ok" not in labels:
                E.append(f"{label}: missing Best Practice callout")
            if "try" not in labels:
                E.append(f"{label}: missing ลองเอง callout")
        if f"s{topic}-2-setup" not in seen:
            E.append(f"missing h3 id s{topic}-2-setup")
    elif part == 3:
        fill = [li for o in root.find_all("ol", "fill") for li in o.direct("li")]
        need("fill-in items", len(fill), 6)
        flv = [lvl_of(li) for li in fill]
        for L in "bia":
            need(f"fill level {L}", flv.count(L), 2)
        mcq = [li for o in root.find_all("ol", "mcq") for li in o.direct("li")]
        need("mcq items", len(mcq), 10)
        mlv = [lvl_of(li) for li in mcq]
        for L in "bia":
            need(f"mcq level {L}", mlv.count(L), 3)
        for k, li in enumerate(mcq, 1):
            ch = list(li.find_all("ol", "choices"))
            if not ch or len(list(ch[0].direct("li"))) != 4:
                E.append(f"mcq {k}: needs <ol class=choices> with exactly 4 <li>")
        chal = list(root.find_all("article", "challenge"))
        need("challenges", len(chal), 3)
        if sorted(c.attrs.get("data-lvl") or "" for c in chal) != ["a", "b", "i"]:
            E.append("challenges must be one each of data-lvl b, i, a")
        for c in chal:
            if not list(c.find_all("details", "hint")):
                E.append("challenge missing Hint")
            if len([x for x in c.find_all("h5")]) < 3:
                E.append("challenge needs h5 สถานการณ์ / สิ่งที่ต้องทำ / ผลลัพธ์ที่คาดหวัง")
        if f"s{topic}-3-answers" not in seen:
            E.append(f"missing h3 id s{topic}-3-answers")
        ans = list(root.find_all("details", "ans"))
        need("answer blocks", len(ans), len(fill) + len(mcq) + len(chal))
        ww = list(root.find_all("ul", "why-wrong"))
        need("mcq why-wrong lists", len(ww), len(mcq))
        for k, u in enumerate(ww, 1):
            if len(list(u.direct("li"))) < 3:
                E.append(f"why-wrong list {k} needs 3 items (one per wrong choice)")
        hands_ans = [a for a in ans if list(a.find_all("pre"))]
        if len(hands_ans) < 3:
            E.append("hands-on answers must include full code blocks")
    elif part == 4:
        if f"s{topic}-4-project" not in seen:
            E.append(f"missing h3 id s{topic}-4-project")
        need("project steps", sum(len(list(o.direct("li"))) for o in root.find_all("ol", "proj-steps")), 6)
        need("cheat rows", sum(len(list(t.find_all("tr"))) - 1 for t in root.find_all("table", "cheat")), 30)
        need("interview questions", len(list(root.find_all("details", "iq"))), 5)
        need("resources", sum(len(list(u.direct("li"))) for u in root.find_all("ul", "res")), 6)
        for hid in ("cheat", "interview", "resources"):
            if f"s{topic}-4-{hid}" not in seen:
                E.append(f"missing h3 id s{topic}-4-{hid}")

    counts["code blocks"] = len(pres)
    counts["bytes"] = len(src.encode("utf-8"))
    return E, W, counts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--topic", type=int, required=True)
    ap.add_argument("--part", type=int, required=True)
    a = ap.parse_args()
    E, W, counts = check(a.file, a.topic, a.part)
    print("COUNTS:", ", ".join(f"{k}={v}" for k, v in counts.items()))
    for w in W[:60]:
        print("WARNING:", w)
    if len(W) > 60:
        print(f"... {len(W) - 60} more warnings")
    for e in E:
        print("ERROR:", e)
    print("RESULT:", "PASS" if not E else f"FAIL ({len(E)} errors)")
    sys.exit(1 if E else 0)


if __name__ == "__main__":
    main()
