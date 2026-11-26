"""Build the portable workbook with offline math and the four original exam sheets."""
import base64
import json
import re
from pathlib import Path
from latex2mathml.converter import convert

root = Path(__file__).resolve().parent
def read(file):
    return (root/file).read_text(encoding="utf-8").strip()
def math_text(value):
    return re.sub(r"\$([^$]+)\$", lambda m: convert(m[1]), value)
def sections(file):
    for section in ("\n"+read(file)).split("\n@")[1:]:
        head,*body=section.splitlines()
        day,title,plot,source,*subtitle=head.split("|")
        yield dict(day=int(day),title=title,plot=plot,source=source),subtitle,body
def parts(line,maximum=100):
    return re.split(r"\|(?=(?:[^$]*\$[^$]*\$)*[^$]*$)",line,maxsplit=maximum)
def literal(data):
    return json.dumps(data,ensure_ascii=False,separators=(",",":")).replace("</script","<\\/script")

lessons=[]
for item,subtitle,body in sections("lessons.txt"):
    item["subtitle"]=subtitle[0]
    item["steps"]=[]
    for row in body:
        title,prose,formula=parts(row,2)
        item["steps"].append([title,math_text(prose),convert(formula.strip(),display="block")])
    lessons.append(item)
exercises=[]
for item,_,body in sections("exercises.txt"):
    prompt,cue,hint,*solution,quiz=body
    item.update(prompt=math_text(prompt),cue=math_text(cue),hint=math_text(hint),solution=list(map(math_text,solution)),quiz=list(map(math_text,parts(quiz[1:]))))
    exercises.append(item)
cards=[]
for row in read("cards.txt").splitlines():
    day,q,a=parts(row,2)
    cards.append(dict(day=int(day),q=math_text(q),a=math_text(a)))
days=json.loads(read("days.json"))
for day in days:
    day["base"]=[[q,math_text(a)] for q,a in day["base"]]
papers=[base64.b64encode((root.parent/p).read_bytes()).decode("ascii") for p in
        ["1kol-ITFR-301122.pdf","1kol-ITFR-301123.pdf","1kol-ITFR-271124.pdf","1kolokvijITRF_T_301122.pdf"]]
extras=json.loads(read("extras.json"))
sources={}
for extra in extras:
    extra["items"]=[[q,math_text(a)] for q,a in extra["items"]]
    for name in extra["files"]:
        if name not in sources:
            sources[name]=base64.b64encode((root.parent/name).read_bytes()).decode("ascii")
html=read("shell.html").replace("/*STYLE*/",read("style.css")).replace("/*DATA*/","const course="+literal(dict(lessons=lessons,exercises=exercises,cards=cards,days=days,papers=papers,extras=extras,sources=sources))+";").replace("/*PLOTS*/",read("plots.js")).replace("/*APP*/",read("app.js"))
(root/"dist").mkdir(exist_ok=True)
(root/"dist/index.html").write_text(html,encoding="utf-8")
print(f"{len(lessons)} lessons, {len(exercises)} exercises, {len(cards)} cards")
