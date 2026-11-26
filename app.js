const practicePlots={...practicePlots12,...practicePlots34,...practicePlots56,...vajePlots12,...vajePlots34,...vajePlots56};
const stepPlots={...mini12,...mini34,...mini56};
const $=id=>document.getElementById(id);
const icons={book:'M3 4c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2z M12 6v14',folder:'M3 7V5h6l2 2h10v12H3z',chart:'M3 20V7m0 13h18 M7 16v-4m5 4V8m5 8V4',sun:'M12 3v2m0 14v2M3 12h2m14 0h2M5.5 5.5l1.5 1.5m10 10 1.5 1.5m0-13L17 7M7 17l-1.5 1.5 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',info:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 11v6 M12 7v.2',pen:'m5 15 10-10 4 4L9 19l-5 1z M13 7l4 4',cards:'m3 6 12-3 3 10 M7 8h14v12H7z',wave:'M2 15c4 0 4-10 8-10s3 14 7 14 3-6 5-7',pin:'m12 3 2.5 5 5.5.8-4 4 1 5.5-5-2.6-5 2.6 1-5.5-4-4 5.5-.8z',check:'m4 12 5 5L20 6',file:'M5 3h9l5 5v13H5z M14 3v5h5 M8 13h8m-8 4h6',clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 6v6l4 2'};
const icon=n=>'<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="'+icons[n]+'"/></svg>';
document.querySelectorAll('[data-icon]').forEach(el=>el.outerHTML=icon(el.dataset.icon));
const KEY='integral-itfr-workbook-v1', kinds=['lessons','exercises','cards'], names=['Teorija','Naloge','Kartice'];
const empty={day:1,tabs:{},indices:{},marks:{},steps:{},timer:null};
let state,canSave=true;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');state={...empty,...saved}}
catch{state={...empty};canSave=false}
let choice=null,flipped=false,sliderValue,archiveIndex=0,notice='',timerTick,graphStage=0;
const topicNames=['Integrali s parametrom','Gama in beta','Laplaceova transformacija','Preklopi in konvolucija','Vrste in njihove vsote','Reševanje s potenčnimi vrstami'];
const inBank=()=>location.hash==='#vaje';
state.bank??={topic:1,selected:{},marks:{}};
const data=type=>course[type].filter(obj=>obj.day===(type==='drills'?state.bank.topic:state.day));
const tab=()=>inBank()?'drills':kinds.includes(state.tabs[state.day])?state.tabs[state.day]:'lessons';
const idx=(type=tab())=>type==='drills'?Math.max(0,data(type).findIndex(o=>o.plot===state.bank.selected[state.bank.topic])):Math.max(0,Math.min(data(type).length-1,Number(state.indices[state.day+type])||0));
const idAt=(type,index,day=state.day)=>day+'-'+type+'-'+index;
const currentId=()=>inBank()?current().plot:idAt(tab(),idx());
const current=()=>data(tab())[idx()];
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));canSave=true}catch{canSave=false}if(!canSave)$('saveState').textContent='Shranjevanje ni na voljo'}
function counts(day){let total=0,done=0;for(const type of kinds){let items=course[type].filter(o=>!day||o.day===day);total+=items.length;let seen={};for(const item of items){let n=seen[item.day]||0;seen[item.day]=n+1;if(state.marks[idAt(type,n,item.day)])done++}}return {total,done,pct:Math.round(100*done/total)}}
function resetView(){graphStage=tab()==='exercises'&&['atan','gauss'].includes(current()?.plot)?1:0;choice=null;flipped=false;notice='';sliderValue=undefined}
function setDone(value=true){const id=currentId();const marks=inBank()?state.bank.marks:state.marks;if(value){marks[id]??=today()}else delete marks[id];save()}
function migrateExerciseProgress(){
 if(state.originalExercises)return;
 const previous=[
  ['area','gauss','atan','root'],['betasub','cubeta','loggamma','betarec'],
  ['inverse','sys22','sys23','devar'],['triple','force24','force23','volterra'],
  ['sum22','sum24','mtest'],[null,'bessel']
 ];
 const oldMarks={...state.marks};
 for(const key of Object.keys(oldMarks))if(key.includes('-exercises-'))delete state.marks[key];
 previous.forEach((old,dayIndex)=>{
  const day=dayIndex+1,items=course.exercises.filter(o=>o.day===day),position=day+'exercises';
  const selected=old[state.indices[position]??0];
  state.indices[position]=Math.max(0,items.findIndex(item=>item.plot===selected));
  items.forEach((item,index)=>{
   const oldIndex=old.indexOf(item.plot),date=oldMarks[idAt('exercises',oldIndex,day)];
   if(oldIndex>=0&&date)state.marks[idAt('exercises',index,day)]=date;
  });
 });
 state.originalExercises=true;
}
function dashboard(){
 let all=counts(),day=counts(state.day);$('pctAll').textContent=all.pct+' %';$('barAll').value=all.pct;$('pctDay').textContent=day.pct+' %';$('barDay').value=day.pct;$('dayMetricLabel').textContent='Napredek za '+state.day+'. dan';
 const learnedToday=Object.values(state.marks).filter(d=>d===today()).length;$('todayPct').textContent=(100*learnedToday/all.total).toLocaleString('sl-SI',{maximumFractionDigits:1})+' %';$('todayBar').value=100*learnedToday/all.total;
 $('days').innerHTML=course.days.map((d,i)=>'<button class="daybtn '+(!inBank()&&i+1===state.day?'active':'')+'" '+(!inBank()&&i+1===state.day?'aria-current="step"':'')+' data-do="day" data-val="'+(i+1)+'"><span class="daynum">'+(counts(i+1).pct===100?'✓':String(i+1).padStart(2,'0'))+'</span><span><small>'+(i+1)+'. dan</small><strong>'+d.short+'</strong></span></button>').join('');
}
function layout(){
 document.body.classList.toggle('drillBank',inBank());
 $('crumbRoot').textContent=inBank()?'Gradivo':'Učni načrt';
 if(inBank())$('drillLink').setAttribute('aria-current','page');else $('drillLink').removeAttribute('aria-current');
 $('tabs').setAttribute('aria-label',inBank()?'Tema vaj':'Vrsta učenja');
 if(inBank()){
  $('crumbDay').textContent='Vaje za osnove';$('dayTag').textContent='Samostojna vadba';
  $('title').textContent='Vaje za osnove';
  $('intro').textContent='Izberi temo. Začni s prvo vajo ali nadaljuj tam, kjer si končal.';
  $('tabs').innerHTML='<label for="bankTopic">Tema</label><select id="bankTopic">'+topicNames.map((topic,i)=>'<option value="'+(i+1)+'" '+(state.bank.topic===i+1?'selected':'')+'>'+topic+'</option>').join('')+'</select>';
  dashboard();render();return;
 }
 const d=course.days[state.day-1];$('crumbDay').textContent=state.day+'. dan';$('dayTag').textContent=state.day+'. dan od 6';$('title').textContent=d.title;$('intro').textContent=tab()==='lessons'?d.theoryIntro:d.intro;
 $('tabs').innerHTML=kinds.map((t,i)=>'<button data-do="tab" data-val="'+t+'" class="'+(tab()===t?'selected':'')+'" aria-pressed="'+(tab()===t)+'">'+icon(['book','pen','cards'][i])+names[i]+'<span class="tabcount">'+data(t).length+'</span></button>').join('');
 dashboard();render();
}
function setDay(d){if(inBank())history.pushState(null,'',location.pathname+location.search);state.day=d;resetView();save();layout();$('side').classList.remove('open');$('menu').setAttribute('aria-expanded','false');window.scrollTo({top:0})}
function changeTab(t){state.tabs[state.day]=t;resetView();save();layout()}
function selectItem(n){if(inBank())state.bank.selected[state.bank.topic]=data('drills')[n].plot;else state.indices[state.day+tab()]=n;resetView();save();render()}
function showUnitStart(){const start=$('content').querySelector('h2');if(!$('dialog').open&&start){start.tabIndex=-1;start.focus({preventScroll:true});$('tabs').scrollIntoView({block:'start'})}}
function nextUnit(){
 const route=kinds.flatMap(t=>data(t).map((_,i)=>[t,i]));
 const pos=route.findIndex(([t,j])=>t===tab()&&j===idx());
 for(let k=1;k<route.length;k++){const unit=route[(pos+k)%route.length];if(!state.marks[idAt(...unit)])return unit}
 return null;
}
function nextName(){
 const unit=nextUnit();if(!unit)return state.day<6?'Sledi '+(state.day+1)+'. učni dan.':'Sledi preizkus s staro polo.';
 const [t,j]=unit,o=data(t)[j];return 'Sledi '+({lessons:'izpeljava',drills:'vaja',exercises:'naloga',cards:'kartica'}[t])+' »'+(o.title||o.q)+'«.';
}
function advance(){
 if(inBank()){
  const items=[...course.drills].sort((a,b)=>a.day-b.day),position=items.findIndex(o=>o.plot===current().plot);
  for(let shift=1;shift<=items.length;shift++){
   const next=items[(position+shift)%items.length];
   if(!state.bank.marks[next.plot]){
    state.bank.topic=next.day;state.bank.selected[next.day]=next.plot;resetView();save();layout();return;
   }
  }
  resetView();layout();return;
 }
 const unit=nextUnit();if(unit){const [t,j]=unit;state.tabs[state.day]=t;state.indices[state.day+t]=j;resetView();save();layout();return}
 if(state.day<6)setDay(state.day+1);else openArchive();
}
const btn=(act,t,cls='secondary',extra='')=>'<button class="'+cls+'" data-do="'+act+'" '+extra+'>'+t+'</button>';
function toolbar(){
 let type=tab(),items=data(type),label=type==='lessons'?'Lekcija':type==='exercises'?'Naloga':type==='drills'?'Vaja':'Kartica';
 return '<div class="toolbar"><div class="pick"><label for="item">'+label+'</label><select id="item">'+items.map((o,i)=>'<option value="'+i+'" '+(idx()===i?' selected':'')+'>'+ ((inBank()?state.bank.marks[o.plot]:state.marks[idAt(type,i)])?'✓ ':'')+(i+1)+' / '+items.length+'　'+(o.subtitle||o.title||o.q)+'</option>').join('')+'</select></div>'+(type==='lessons'||type==='drills'?'':'<span class="chip">'+icon('pin')+course.days[state.day-1].focus+'</span>')+'</div>'
}
function plotPanel(id,phase=graphStage){
 if(tab()==='exercises' && id==='leg') id='legHomework';
 const cfg=plotSettings(id,phase), value=tab()==='lessons'?cfg[4]:(sliderValue??cfg[4]);
 const views={area:['Ploščina','Prirastek','Odvod'],gauss:['Začetna ploščina do R','Odvod in majoranta','Integral s kosinusom'],atan:['Ploščina','Notranji odvod'],betasub:['Prvotni integral','Nova spremenljivka','Vrednost integrala'],cubeta:['Prvotni integral','Nova spremenljivka'],loggamma:['Prvotni integral','Jedro gama'],leg:['Začetni člen','Koeficient','Polinom'],ortho:['Faktorja','Predznačena ploščina','Tekoči integral'],bessel:['Vodilni člen','Naslednja potenca','Regularna veja']};
 const chooser=tab()==='exercises'&&views[id]?'<div class="viewSelect"><label for="graphView">Pogled</label> <select id="graphView">'+views[id].map((name,i)=>'<option value="'+i+'" '+(i===graphStage?'selected':'')+'>'+name+'</option>').join('')+'</select></div>':'';
 return '<section class="plot" data-plot="'+id+'" data-phase="'+phase+'" aria-label="Interaktivni graf"><div class="plotHead">'+icon('wave')+(tab()==='lessons'?'Ponazoritev':'Graf naloge')+'</div>'+chooser+'<div class="drawing"></div><div class="legend"></div><div class="sliderbox"><label for="slide-'+phase+'">'+cfg[0]+'<output for="slide-'+phase+'"></output></label><input id="slide-'+phase+'" type="range" min="'+cfg[1]+'" max="'+cfg[2]+'" step="'+cfg[3]+'" value="'+value+'"></div><p class="caption"></p></section>';
}
function drawPlot(panel){
 const value=+panel.querySelector('input').value,phase=+panel.dataset.phase;
 const m=chartModel(panel.dataset.plot,phase,value);

 panel.querySelector('output').textContent=fmt(value);
 if(tab()==='lessons'){
  panel.querySelector('.caption').innerHTML=current().steps[phase][3];
  if(current().plot==='area'){
   m.keys.x='x · spremenljivka integriranja';m.keys.y=phase===2?'Δf/h · sprememba višine na enoto parametra':'f · vrednost funkcije';
   m.keys.areas=[['F(0) · začetna ploščina','F(a) − F(0) · sprememba'],['F(a) · prvotna ploščina','ΔF · prirastek'],['F′(a) · odvod']][phase];
  }
  if(current().plot==='gaussTheory')panel.querySelector('.caption').append(' '+m.caption);
 }else panel.querySelector('.caption').textContent=m.caption;
 if(tab()==='lessons')m.caption=panel.querySelector('.caption').textContent;
 panel.querySelector('.drawing').innerHTML=svgChart(m).replaceAll('graph-clip','graph-clip-'+phase);
 const legend=(kind,color,text)=>'<span class="graphKey '+kind+'" style="--key:'+color+'"><i></i>'+escapeGraph(text)+'</span>';
 panel.querySelector('.legend').innerHTML=[
   ...m.curves.map((c,i)=>legend('curveKey',c.color,m.keys.curves[i]||c.name)),
   ...m.fills.map((f,i)=>legend('areaKey',f.color,m.keys.areas[i])),
   ...m.bars.map((bar,i)=>legend('areaKey',m.barColors[i],m.keys.bars[i]+' = '+fmt(bar[1])))
 ].join('');
 if(current().plot==='leib'&&phase<2){
  const scene=panel.closest('.scene'),u=value/2,b=1+value,h=.24;
  const pair=(symbol,meaning,n,index)=>'<span class="boundary b'+index+'"><b>'+symbol+'</b> '+meaning+' <strong>'+fmt(n)+'</strong></span>';
  scene.querySelector('.boundaryKeys').innerHTML=pair('u','leva',u,0)+(phase?pair('u₊','nova leva',u+h/2,3):'')+pair('v','desna',b,1)+(phase?pair('v₊','nova desna',b+h,2):'');
  scene.querySelectorAll('.formula mi,.formula msub,.calcLine mi,.calcLine msub').forEach(node=>{
    if(node.parentElement.tagName.toLowerCase()==='msub')return;
    const role={'u':0,'v':1,'v+':2,'u+':3}[node.textContent.trim()];
    if(role!==undefined)node.setAttribute('mathcolor',['#006353','#613398','#835000','#a32a59'][role]);
  });
 }

}
const source=obj=>'<div class="reference">'+icon('file')+obj.source+'</div>';
function extraMaterial(){
 const ex=course.extras[state.day-1];
 return '<details class="base"><summary>Dopolnilna snov in izvirno gradivo</summary>'+ex.items.map(([q,a,rows])=>'<details class="baseEntry"><summary>'+q+'</summary><p>'+a+'</p>'+calculation(rows,'Zgled po vrsticah')+'</details>').join('')+'<div class="sourceFiles">'+ex.files.map(name=>'<button class="secondary" data-do="sourcePDF" data-val="'+name+'">'+icon('file')+name+'</button>').join('')+'</div></details>';
}
function basics(){return '<details class="base"><summary>Kaj moram že znati?</summary>'+course.days[state.day-1].base.map(([q,a,rows])=>'<details class="baseEntry"><summary>'+q+'</summary><p>'+a+'</p>'+calculation(rows,'Zgled po vrsticah')+'</details>').join('')+'</details>'}
function reading(text){return '<div class="reading"><b>Kako prebereš zapis</b><p>'+text+'</p></div>'}
function application(label,text){return '<div class="application"><b>'+label+'</b><p>'+text+'</p></div>'}
function ruleBridge(rules){
 return '<section class="ruleBridge" aria-label="Povezava med pravilom in zgledom">'+rules.map(rule=>'<div class="rulePair"><h3>'+rule.name+'</h3><div class="rulePart"><b>Splošno</b><div class="calcLine">'+rule.general+'</div></div><p class="ruleMap">'+rule.mapping+'</p><div class="rulePart instance"><b>V tej nalogi</b><div class="calcLine">'+rule.example+'</div></div></div>').join('')+'</section>';
}
function calculation(rows,label){
 return '<div class="calculation"><h3>'+label+'</h3><ol>'+rows.map(([instruction,equation])=>'<li><p>'+instruction+'</p><div class="calcLine">'+equation+'</div></li>').join('')+'</ol></div>';
}
function stepFigure(id,index){
 const plot=stepPlots[id];
 const model={x:plot.x,y:plot.y,bars:[],barColors:[gold,lilac,rose],markColors:[gold,rose,lilac,mint],...plot.make()};
 return compactFigure(plot.label,model,'step-clip-'+index);
}
function compactFigure(label,model,clip){
 const legend=(color,name)=>'<span class="graphKey" style="--key:'+color+'"><i></i>'+escapeGraph(name)+'</span>';
 const keys=model.curves.map((curve,i)=>legend(curve.color,model.keys.curves?.[i]||curve.name))
   .concat(model.fills.map((area,i)=>legend(area.color,model.keys.areas[i])));
 const svg=svgChart(model).replaceAll('graph-clip',clip);
 return '<figure class="stepFigure"><strong>'+escapeGraph(label)+'</strong><div class="drawing">'+svg+'</div><div class="legend">'+keys.join('')+'</div><figcaption>'+escapeGraph(model.caption)+'</figcaption></figure>';
}
function exerciseProcedure(steps){
 const main=[];
 steps.forEach((step,index)=>{
  const flow=step.flow?'<div role="list" aria-label="Pot računa" class="stepFlow">'+step.flow.map((part,i)=>
   '<div role="listitem">'+(i?'<span class="flowArrow" aria-hidden="true"></span>':'')+'<span class="flowPart">'+part+'</span></div>').join('')+'</div>':'';
  const reasonLabel=step.condition?'<b class="conditionLabel">Pogoj</b>':'<b>Zakaj?</b>';
  const body='<h3>'+step.action+'</h3><p>'+reasonLabel+' '+step.reason+'</p>'+flow+'<div class="calcLine">'+step.equation+'</div>'+
   (step.visual?stepFigure(step.visual,index):'');
  if(!step.detail){main.push({body,notes:[]});return}
  const notes=main[main.length-1].notes;
  let group=notes[notes.length-1];
  if(group?.title!==step.detail){group={title:step.detail,rows:[]};notes.push(group)}
  group.rows.push('<div class="noteStep">'+body+'</div>');
 });
 return '<div class="calculation exerciseProcedure"><ol>'+main.map(({body,notes})=>'<li>'+body+
  notes.map(group=>'<details class="stepNote"><summary>'+group.title+'</summary>'+group.rows.join('')+'</details>').join('')+'</li>').join('')+'</ol></div>';
}
function lesson(){
 const o=current(),done=!!state.marks[currentId()];
 const facts=[['Pogoji veljavnosti',o.conditions],['Oznake',o.symbols],['Uporaba',o.use]];
 const intro='<section class="concept"><h3>Definicija</h3><p>'+o.definition+'</p><dl>'+facts.map(([name,value])=>'<div><dt>'+name+'</dt><dd>'+value+'</dd></div>').join('')+'</dl></section>';
 const scenes=o.steps.map(([heading,reason,formula,,rows],i)=>{
  const result='<div class="formula calcLine">'+formula+'</div>';
  const boundaries=o.plot==='leib'&&i<2?'<div class="boundaryKeys"></div>':'';
  const details=rows?'<div class="derivationRows">'+calculation(rows,'Izpeljava po vrsticah')+result+'</div>':'';
  return '<section class="lesson scene"><div class="explain"><div class="stepLabel">Izpeljava · '+(i+1)+' / '+o.steps.length+'</div><h2>'+heading+'</h2><p>'+reason+'</p>'+(rows?'':result)+boundaries+'</div>'+plotPanel(o.plot,i)+details+'</section>';
 }).join('');
 const cases=o.cases?'<section class="concept ruleCases"><h3>Kateri členi ostanejo?</h3><p>Za vsak premični rob pomnoži višino s hitrostjo meje. Če je integrand odvisen samo od <i>x</i>, je notranji odvod enak nič.</p><dl>'+o.cases.map(([label,formula])=>'<div><dt>'+label+'</dt><dd class="calcLine">'+formula+'</dd></div>').join('')+'</dl></section>':'';
 let practice='';
 if(o.plot==='leib')practice=unitLink('exercises','atan','Kolokvij 2023 · premična zgornja meja');
 if(o.plot==='gaussTheory')practice=unitLink('exercises','gauss','Gaussova naloga s kolokvija');
 return '<div class="lessonName"><h2>'+o.title+'</h2>'+source(o)+'</div>'+intro+cases+scenes+practice+'<div class="finish"><span>'+nextName()+'</span>'+btn(done?'advance':'learn',done?'Nadaljuj':'Znam izpeljati · nadaljuj','action')+(done?btn('unlearn','Ponovno v učenje','quiet'):'')+'</div>';
}
function unitLink(kind,plot,label){
 const index=data(kind).findIndex(item=>item.plot===plot);
 return index<0?'':btn('goto',label,'quiet','data-val="'+kind+','+state.day+','+index+'"');
}
function theoryLink(exercise){
 if(exercise.plot==='atan')return unitLink('lessons','leib','Izpeljava Leibnizovega pravila');
 if(exercise.plot==='gauss')return unitLink('lessons','gaussTheory','Izpeljava Gaussovega integrala');
 return '';
}
function exercise(){
 const o=current(),done=!!(inBank()?state.bank.marks:state.marks)[currentId()],answers=o.quiz.slice(1),offset=(idx()+o.day)%answers.length,order=answers.map((_,i)=>(i+offset)%answers.length);
 const hint='<p class="helpText"><b>Namig</b> '+o.hint+'</p>';
 const guide=o.guide?'<section class="methodGuide"><div class="stepLabel">Uvod v metodo</div>'+calculation(o.guide.steps,o.guide.title)+'</section>':'';
 const afterGraph=o.afterGraph?'<section class="methodGuide">'+calculation(o.afterGraph.steps,o.afterGraph.title)+'</section>':'';
 const citation=(o.kind?escapeGraph(o.kind)+' · ':'')+escapeGraph(o.source)+' '+o.references.map(ref=>'<a href="'+pdfLink(ref.key)+(ref.page?'#page='+ref.page:'')+'" aria-label="Odpri '+escapeGraph(ref.label)+'" target="_blank" rel="noopener">'+(o.references.length===1?'PDF':escapeGraph(ref.label))+' ↗</a>').join(' · ');
 const prompt='<header class="exercisePrompt"><div class="taskmeta">'+icon('pen')+citation+'</div><h2>'+o.title+'</h2><div class="question">'+o.prompt+'</div></header>';
 const quiz='<div class="quiz"><h3>'+o.quiz[0]+'</h3><div class="options">'+order.map(i=>btn('answer',answers[i],choice===i?(i===0?'right':'wrong'):'','data-val="'+i+'"')).join('')+'</div><div class="feedback" role="status">'+(choice===0?'Pravilno. Pred potrditvijo samostojno zapiši še celoten postopek.':choice!==null?'Poskusi še enkrat. '+o.hint+'':'')+'</div><div class="actrow">'+(done?(inBank()&&course.drills.every(o=>state.bank.marks[o.plot])?'<strong>Vse vaje so rešene.</strong>':btn('advance','Nadaljuj','action'))+btn('unlearn','✓ Rešeno · ponovi','quiet'):choice===0?btn('learn','Znam rešiti brez pomoči','action'):'')+'</div></div>';
 const help='<details class="base exerciseHelp"><summary>Namig, razlaga in graf</summary><div class="helpBody">'+hint+reading(o.symbols)+application('Uporaba',o.purpose)+'<div class="method"><b>Kako prepoznaš metodo</b><p>'+o.cue+'</p>'+theoryLink(o)+'</div>'+guide+plotPanel(o.plot)+afterGraph+'</div></details>';
 const solution='<details class="base"><summary>Postopek po korakih</summary>'+exerciseProcedure(o.worked)+'<details class="base formulaReference"><summary>Uporabljene formule</summary>'+ruleBridge(o.rules)+'</details></details>';
 return '<article class="practice" data-unit="'+currentId()+'">'+prompt+quiz+help+solution+'</article>';
}
function flash(){
 const c=current(),done=!!state.marks[currentId()];
 return '<article class="flash"><div class="taskmeta">'+icon('cards')+' Kartica '+(idx()+1)+' od '+data('cards').length+(done?' · Naučeno':'')+'</div><h2>'+c.q+'</h2>'+application('Kdaj to potrebuješ',c.purpose)+(flipped?'<div class="back">'+c.a+'</div>'+reading(c.symbols)+calculation(c.worked,'Uporabi pravilo na primeru'):'')+'<div class="actrow">'+(flipped?btn('again','Še ponavljam')+btn('known','Znam','action'):btn('flip','Pokaži odgovor','action'))+'</div><div class="feedback" role="status">'+notice+'</div></article>';
}
function render(){
 const active=document.activeElement,within=$('content').contains(active),oldAct=active?.dataset.do,oldVal=active?.dataset.val;
 const previous=$('content').querySelector('.practice');
 const opened=previous?.dataset.unit===currentId()?Array.from(previous.children).filter(el=>el.tagName==='DETAILS').map(el=>el.open):[];
 const openedNotes=previous?.dataset.unit===currentId()?Array.from(previous.querySelectorAll('.stepNote'),note=>note.open):[];
 const fin=state.day===6&&tab()==='exercises'?'<div class="dayfinish"><div><h2>Preizkus s staro polo</h2><p>Računska pola traja 90 minut, teoretična 30 minut.</p></div>'+btn('archive','Izberi kolokvij')+'</div>':'';
 $('content').innerHTML=toolbar()+(tab()==='lessons'?lesson():tab()==='cards'?flash():exercise())+fin;document.querySelectorAll('#content .plot').forEach(drawPlot);
 if(opened.length)document.querySelectorAll('#content .practice > details').forEach((el,i)=>el.open=opened[i]);
 if(openedNotes.length)document.querySelectorAll('#content .stepNote').forEach((note,i)=>note.open=openedNotes[i]);
 if(within){let match=oldAct&&Array.from($('content').querySelectorAll('[data-do]')).find(b=>b.dataset.do===oldAct&&b.dataset.val===oldVal);let next=match||$('content').querySelector('.explain h2,.practice h2,.flash h2');if(next){if(next.tagName==='H2')next.tabIndex=-1;next.focus({preventScroll:true})}}
}
function modal(title,html){
 $('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;if(!$('dialog').open)$('dialog').showModal();
}
const paperNames=['Račun 2022','Račun 2023','Račun 2024','Teorija 2022'];
const paperEx=[['gauss','sys22','betasub','sum22'],['atan','cubeta','sys23','triple','force23'],['root','loggamma','betarec','force24','sum24']];
const theoryRefs=[['Premikajoči se meji','lessons',1,1,'b'],['Četrti odvod','cards',3,2,'d'],['Faktor t in drugi odvod','exercises',3,'devar','d'],['Kontrapozicija M-testa','exercises',5,'mtest','a'],['Definicija enakomerne konvergence integrala','cards',1,2,''],['Razširitev funkcije gama','cards',2,2,''],['Vrednost B(3, ½)','cards',2,4,''],['Frobeniusov nastavek','cards',6,0,''],['Uteženi skalarni produkt','exercises',6,'ortho',''],['Besselova enačba','exercises',6,'bessel','']];
let pdfUrls={};
function pdfLink(i){
 if(!pdfUrls[i]){const bytes=Uint8Array.from(atob(typeof i==='number'?course.papers[i]:course.sources[i]),c=>c.charCodeAt(0));pdfUrls[i]=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}))}
 return pdfUrls[i];
}
function openArchive(){
 let i=archiveIndex,links=i<3?paperEx[i].map(plot=>{const o=course.exercises.find(ex=>ex.plot===plot);return '<button data-do="goto" data-val="exercises,'+o.day+','+course.exercises.filter(x=>x.day===o.day).indexOf(o)+'"><small>'+o.source+'</small>'+o.title+'</button>'}).join(''):theoryRefs.map(([name,type,d,j,key],n)=>'<button data-do="goto" data-val="'+type+','+d+','+(type==='exercises'?course.exercises.filter(o=>o.day===d).findIndex(o=>o.plot===j):j)+'"><small>Naloga '+(n+1)+(key?' · odgovor '+key:'')+'</small>'+name+'</button>').join('');
 modal('Stari kolokviji','<div class="paperTabs">'+paperNames.map((n,j)=>btn('paper',n,i===j?'active':'','data-val="'+j+'"')).join('')+'</div><p>'+(i===3?'30 minut brez pripomočkov. Pri izbiri je pravilen en odgovor.':'90 minut za štiri naloge. Dovoljen je en list A4 s formulami. Vsak odgovor utemelji.')+'</p><div class="paperActions"><a href="'+pdfLink(i)+'" class="action" target="_blank" rel="noopener">Odpri izvirno polo (PDF)</a>'+(!state.timer?btn('starttimer','Začni merjenje časa'):'')+'</div><div id="timer"></div><details><summary>Razlage in rešitve</summary><div class="paperList">'+links+'</div></details>');timerUpdate();
}
function timerUpdate(){
 const el=$('timer');if(!el||!state.timer)return;let s=Math.max(0,Math.ceil((state.timer.end-Date.now())/1000));
 el.innerHTML='<div class="timerbar"><span>'+paperNames[state.timer.i]+' · '+(s?Math.floor(s/60)+' min '+String(s%60).padStart(2,'0')+' s':'Čas je potekel')+'</span>'+btn('stoptimer',s?'Končaj merjenje':'Zaključi','quiet')+'</div>';
}
function showProgress(){const all=counts(),d=counts(state.day),n=Object.values(state.marks).filter(v=>v===today()).length;
 modal('Kako se meri napredek?','<p><b>Skupaj</b> si potrdil '+all.done+' od '+all.total+' učnih enot. Vsaka izpeljava, samostojno rešena naloga in naučena kartica šteje enkrat.</p><p><b>Za '+state.day+'. dan</b> je dokončanih '+d.done+' od '+d.total+' enot tega dneva načrta.</p><p><b>Danes</b> si potrdil '+n+' novih enot. Odstotek pove, kolikšen del celotne snovi si osvojil na današnji koledarski dan.</p><p class="sourceNote">Napredek se shrani v tem brskalniku. Oznako lahko umakneš, ko želiš enoto še ponoviti.</p>')}
$('menu').onclick=()=>{const open=$('side').classList.toggle('open');$('menu').setAttribute('aria-expanded',open)};
document.addEventListener('change',e=>{if(e.target.id==='bankTopic'){state.bank.topic=+e.target.value;resetView();save();layout();$('bankTopic').focus()}if(e.target.id==='item'){selectItem(+e.target.value);$('item').focus({preventScroll:true})}if(e.target.id==='graphView'){graphStage=+e.target.value;sliderValue=undefined;render();$('graphView').focus({preventScroll:true})}});
document.addEventListener('input',e=>{if(e.target.matches('.plot input[type=range]')){if(tab()!=='lessons')sliderValue=+e.target.value;drawPlot(e.target.closest('.plot'))}});
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-do]');if(!b)return;const act=b.dataset.do,val=b.dataset.val;
 if(act==='day'){setDay(+val);return}if(act==='tab'){changeTab(val);return}
 if(act==='materials'){modal('Gradivo za '+state.day+'. dan',basics()+extraMaterial());return}if(act==='archive'){openArchive();return}if(act==='paper'){archiveIndex=+val;openArchive();return}
 if(act==='sourcePDF'){modal(val,'<p>Izvirno gradivo za '+state.day+'. učni dan.</p><div class="paperActions"><a class="action" href="'+pdfLink(val)+'" target="_blank" rel="noopener">Odpri PDF</a></div>');return}
 if(act==='close'){$('dialog').close();return}if(act==='progress'){showProgress();return}
 if(act==='goto'){const [type,d,i]=val.split(',');$('dialog').close();state.tabs[d]=type;state.indices[d+type]=+i;setDay(+d);return}
 if(act==='starttimer'){state.timer={i:archiveIndex,end:Date.now()+(archiveIndex===3?30:90)*60000};save();openArchive();return}
 if(act==='stoptimer'){state.timer=null;save();openArchive();return}
 if(act==='answer')choice=+val;
 if(act==='unlearn'){setDone(false);resetView();dashboard()}
 if(act==='learn'){setDone();dashboard();advance();showUnitStart();return}
 if(act==='advance'){advance();showUnitStart();return}
 if(act==='flip')flipped=true;
 if(act==='again'){
  setDone(false);let items=data('cards'),next=idx();for(let n=1;n<items.length;n++){let j=(idx()+n)%items.length;if(!state.marks[idAt('cards',j)]){next=j;break}}
  selectItem(next);notice='Kartica ostaja za ponovitev.';dashboard();
 }
 if(act==='known'){setDone();dashboard();advance();showUnitStart();return}
 render();
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){dashboard();timerUpdate()}});
if(!Number.isInteger(state.day)||state.day<1||state.day>6)state.day=1;
// Previous editions stored practice marks by their position in the daily plan.
const formerDrills=[
 [null,null,null,'vRational'],['vHalf','vInt','vTrig','vCube'],
 ['v34exp','v34cos','v34inv','v34tcos'],['v34sinconv','v34three','v34steps','v34sineon'],
 ['v56plus','v56square',null,null],['v56exp',null,null,null]
];
formerDrills.forEach((plots,i)=>plots.forEach((plot,j)=>{
 const key=idAt('drills',j,i+1);
 if(state.marks[key]&&course.drills.some(o=>o.plot===plot))state.bank.marks[plot]=state.marks[key];
 delete state.marks[key];
}));
window.addEventListener('hashchange',()=>{resetView();layout();$('side').classList.remove('open');$('menu').setAttribute('aria-expanded','false');window.scrollTo(0,0)});
migrateExerciseProgress();resetView();layout();save();timerTick=setInterval(timerUpdate,1000);
