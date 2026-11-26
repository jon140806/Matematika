"""Build the portable workbook with offline math and the four original exam sheets."""
import base64
import json
import re
from pathlib import Path
from xml.etree import ElementTree as ET
from latex2mathml.converter import convert

root = Path(__file__).resolve().parent
gradivo = root / "gradivo"
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


def worked_formula(tex):
    # Keep fractions together, but allow a chain of equalities to wrap on a phone.
    math=ET.fromstring(convert(tex))
    ns="{http://www.w3.org/1998/Math/MathML}"
    ET.register_namespace("",ns[1:-1])
    math.set("displaystyle","true")
    if len(math)!=1 or math[0].tag!=ns+"mrow":
        return ET.tostring(math,encoding="unicode")
    groups=[[]]
    for node in math[0]:
        if groups[-1] and node.tag==ns+"mo" and node.text in {"=","⇒","⇔","≤","≥","≈","→"}:
            groups.append([])
        groups[-1].append(node)
    fragments=[]
    for group in groups:
        fragment=ET.Element(math.tag,math.attrib)
        ET.SubElement(fragment,ns+"mrow").extend(group)
        fragments.append(ET.tostring(fragment,encoding="unicode"))
    return "<wbr>".join(fragments)


def worked_rows(rows):
    if len(rows)<2:
        raise ValueError("A worked example needs successive calculation lines")
    return [[math_text(reason),worked_formula(tex)] for reason,tex in rows]


def exercise_steps(rows):
    steps=[]
    for action,reason,tex,*options in rows:
        step=dict(action=math_text(action),reason=math_text(reason),equation=worked_formula(tex))
        if options and isinstance(options[-1],dict):
            note=options.pop()
            if note.get("condition"):
                step["condition"]=True
            if "detail" in note:
                if not steps:
                    raise ValueError("An optional explanation must follow a calculation step")
                step["detail"]=math_text(note["detail"])
            if "flow" in note:
                if len(note["flow"])<2:
                    raise ValueError(f"Missing transition in {action}")
                step["flow"]=list(map(math_text,note["flow"]))
        if options:
            step["visual"],=options
        steps.append(step)
    return steps


def rule_rows(rows):
    return [
        dict(name=name,general=worked_formula(general),mapping=math_text(mapping),
             example=worked_formula(example))
        for name,general,mapping,example in rows
    ]

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
papers=[base64.b64encode((gradivo/p).read_bytes()).decode("ascii") for p in
        ["1kol-ITFR-301122.pdf","1kol-ITFR-301123.pdf","1kol-ITFR-271124.pdf","1kolokvijITRF_T_301122.pdf"]]
extras=json.loads(read("extras.json"))
sources={}
for extra in extras:
    extra["items"]=[[q,math_text(a)] for q,a in extra["items"]]
    for name in extra["files"]:
        if name not in sources:
            sources[name]=base64.b64encode((gradivo/name).read_bytes()).decode("ascii")
symbols=json.loads(read("lessonSymbols.json"))
lesson_purpose=json.loads(read("lessonPurpose.json"))
for item in lessons:
    item["symbols"]=list(map(math_text,symbols[item["plot"]]))
    assert len(item["symbols"])==len(item["steps"])
    purpose=lesson_purpose[item["plot"]]
    assert len(purpose["steps"])==len(item["steps"])
    item["purpose"]={
        "question":math_text(purpose["question"]),
        "use":math_text(purpose["use"]),
        "steps":list(map(math_text,purpose["steps"])),
    }
symbols=json.loads(read("exerciseSymbols.json"))
practice_purpose=json.loads(read("practicePurpose.json"))
for item in exercises:
    item["symbols"]=math_text(symbols[item["plot"]])
    item["purpose"]=math_text(practice_purpose["exercises"][item["plot"]])
for item,explanation,purpose in zip(cards,json.loads(read("cardSymbols.json")),practice_purpose["cards"],strict=True):
    item["symbols"]=math_text(explanation)
    item["purpose"]=math_text(purpose)
for filename,day_range in [("worked123.json",range(1,4)),("worked456.json",range(4,7))]:
    worked=json.loads(read(filename))
    rules=json.loads(read(filename.replace("worked","rules")))
    for kind,items in [("lessons",lessons),("exercises",exercises)]:
        for item in items:
            if item["day"] in day_range:
                item["rules"]=rule_rows(rules[kind][item["plot"]])
    for item in lessons:
        if item["day"] in day_range:
            scenes=worked["lessons"][item["plot"]]
            assert len(scenes)==len(item["steps"])
            item["worked"]=[worked_rows(rows) for rows in scenes]
    for item in exercises:
        if item["day"] in day_range:
            item["worked"]=exercise_steps(worked["exercises"][item["plot"]])
by_plot={item["plot"]:item for item in exercises}
drills=[]
for pair in ("12","34","56"):
    additions=json.loads(read(f"izvirne{pair}.json"))
    topic_drills=json.loads(read(f"vaje{pair}.json"))
    for group,items in ((exercises,additions["exercises"]),(drills,topic_drills)):
        for item in items:
            if item["plot"] in by_plot or len(item["quiz"])<3 or not item.get("source") or item.get("url"):
                raise ValueError(f"Invalid exercise: {item['title']}")
            for key in ("prompt","cue","hint","symbols","purpose"):
                item[key]=math_text(item[key])
            item["quiz"]=list(map(math_text,item["quiz"]))
            item["worked"]=exercise_steps(item["worked"])
            item["rules"]=rule_rows(item["rules"])
            if group is drills and item.get("kind")!="Izvirna vaja":
                raise ValueError(f"Expected an original PDF exercise: {item['title']}")
            if group is drills and not any(step.get("condition") for step in item["worked"]):
                raise ValueError(f"Missing conditions: {item['title']}")
            group.append(item)
            by_plot[item["plot"]]=item
    for plot,guide in additions.get("guides",{}).items():
        by_plot[plot]["guide"]=dict(title=guide["title"],steps=worked_rows(guide["steps"]))
        if "afterGraph" in guide:
            part=guide["afterGraph"]
            by_plot[plot]["afterGraph"]=dict(title=part["title"],steps=worked_rows(part["steps"]))

# Every exercise opens the matching sheet from the offline workbook.
for item in exercises+drills:
    references=[]
    for paper,year in enumerate(("2022","2023","2024")):
        if year in item["source"]:
            theory="teor" in item["source"].lower()
            references.append(dict(label="Kolokvij "+year,key=3 if theory else paper))
    for filename in sorted(sources,key=len,reverse=True):
        stem=Path(filename).stem
        if re.search(re.escape(stem)+r"(?![\w(-])",item["source"]):
            page=re.search(r"str\.\s*(\d+)",item["source"])
            references.append(dict(label=stem,key=filename,page=int(page[1]) if page else 1))
    if not references:
        raise ValueError(f"Missing original PDF: {item['source']}")
    item["references"]=references

# Show the signs and the three geometrical contributions even when the rule wraps.
def leibniz_line(lhs,terms):
    start='<span class="ruleLhs">'+worked_formula(lhs)+'</span>'
    blocks=[]
    for i,(label,tex) in enumerate(terms):
        blocks.append(f'<span class="term term{i}"><small>{label}</small>{worked_formula(tex)}</span>')
    return start+"".join(blocks)

leibniz=next(item for item in lessons if item["plot"]=="leib")["rules"][0]
leibniz["general"]=leibniz_line(
    r"F'(y)=\frac{d}{dy}\int_{u(y)}^{v(y)} f(x,y)\,dx=",
    [("sprememba višine",r"\int_{u(y)}^{v(y)} f_y(x,y)\,dx"),
     ("desni rob",r"+\,v'(y)\cdot f(v(y),y)"),("levi rob",r"-\,u'(y)\cdot f(u(y),y)")])
leibniz["example"]=leibniz_line(r"F'(a)=",
    [("sprememba višine",r"\int_{a/2}^{1+a}1\,dx"),
     ("desni rob",r"+\,1\cdot(1+2a)"),("levi rob",r"-\,\tfrac12\cdot\tfrac{3a}{2}")])+worked_formula(r"=2+\tfrac74a")
for card,rows in zip(cards,json.loads(read("workedCards.json")),strict=True):
    card["worked"]=worked_rows(rows)
base_items=[item for day in days for item in day["base"]]
for item,rows in zip(base_items,json.loads(read("workedBasics.json")),strict=True):
    item.append(worked_rows(rows))
extra_items=[item for day in extras for item in day["items"]]
for item,rows in zip(extra_items,json.loads(read("workedExtras.json")),strict=True):
    item.append(worked_rows(rows))
theory={**json.loads(read("theory123.json")),**json.loads(read("theory456.json"))}
lesson_topics=[{key:example[key] for key in ("day","plot","source")} for example in lessons]
lesson_topics.append(dict(day=1,plot="gaussTheory",source="ITFR-01p, str. 11 · račun 2022, nal. 1"))
if set(theory)!={item["plot"] for item in lesson_topics}:
    raise ValueError("Theory must cover every original topic")
lessons=[]
for lesson in lesson_topics:
    topic=theory[lesson["plot"]]
    lesson["title"]=topic["title"]
    lesson["intuition"]=list(map(math_text,topic["intuition"]))
    lesson["reading"]=topic["reading"]
    if lesson["reading"] and lesson["reading"][0] not in sources:
        raise ValueError(f"Missing lecture PDF: {lesson['reading'][0]}")
    lesson["papers"]=topic["papers"]
    lesson["focus"]=math_text(topic["focus"])
    if "calculation" in topic:
        lesson["quickCalc"]=math_text(topic["calculation"])
    for key in ("definition","conditions","symbols","use"):
        lesson[key]=math_text(topic[key])
    lesson["stepConditions"]=list(map(math_text,topic["stepConditions"]))
    if len(lesson["stepConditions"])!=len(topic["steps"]):
        raise ValueError(f"Missing conditions in {lesson['title']}")
    lesson["steps"]=[]
    for title,explanation,tex,graph,*details in topic["steps"]:
        step=[title,math_text(explanation),worked_formula(tex),math_text(graph)]
        if details:
            rows,=details
            step.append([[math_text(reason),worked_formula(formula)] for reason,formula in rows])
        lesson["steps"].append(step)
    if len(lesson["steps"])!=3:
        raise ValueError(f"Missing illustration stage for {lesson['plot']}")
    if lesson["plot"]=="leib":
        lesson["steps"][-1][2]=leibniz["general"]
        lesson["cases"]=[[label,worked_formula(tex)] for label,tex in topic["cases"]]
    lessons.append(lesson)
html=read("shell.html").replace("/*STYLE*/",read("style.css")).replace("/*DATA*/","const course="+literal(dict(lessons=lessons,exercises=exercises,drills=drills,cards=cards,days=days,papers=papers,extras=extras,sources=sources))+";").replace("/*PLOTS*/","\n".join(read(f) for f in ["graphKeys123.js","graphKeys456.js","plots.js","areaLab.js","plots12.js","plots34.js","plots56.js","vaje12.js","vaje34.js","vaje56.js","mini12.js","mini34.js","mini56.js"])).replace("/*APP*/",read("app.js"))
(root/"dist").mkdir(exist_ok=True)
(root/"dist/index.html").write_text(html,encoding="utf-8")
print(f"{len(lessons)} lessons, {len(exercises)} exercises, {len(drills)} drills, {len(cards)} cards")
