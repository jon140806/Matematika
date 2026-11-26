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
const data=type=>course[type].filter(obj=>obj.day===state.day);
const tab=()=>kinds.includes(state.tabs[state.day])?state.tabs[state.day]:'lessons';
const idx=(type=tab())=>Math.max(0,Math.min(data(type).length-1,Number(state.indices[state.day+type])||0));
const idAt=(type,index,day=state.day)=>day+'-'+type+'-'+index;
const currentId=()=>idAt(tab(),idx());
const current=()=>data(tab())[idx()];
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));canSave=true}catch{canSave=false}if(!canSave)$('saveState').textContent='Shranjevanje ni na voljo'}
function counts(day){let total=0,done=0;for(const type of kinds){let items=course[type].filter(o=>!day||o.day===day);total+=items.length;let seen={};for(const item of items){let n=seen[item.day]||0;seen[item.day]=n+1;if(state.marks[idAt(type,n,item.day)])done++}}return {total,done,pct:Math.round(100*done/total)}}
function resetView(){graphStage=0;choice=null;flipped=false;notice='';sliderValue=undefined}
function setDone(value=true){const id=currentId();if(value){state.marks[id]??=today()}else delete state.marks[id];save()}
function dashboard(){
 let all=counts(),day=counts(state.day);$('pctAll').textContent=all.pct+' %';$('barAll').value=all.pct;$('pctDay').textContent=day.pct+' %';$('barDay').value=day.pct;$('dayMetricLabel').textContent='Napredek za '+state.day+'. dan';
 const learnedToday=Object.values(state.marks).filter(d=>d===today()).length;$('todayPct').textContent=(100*learnedToday/all.total).toLocaleString('sl-SI',{maximumFractionDigits:1})+' %';$('todayBar').value=100*learnedToday/all.total;
 $('days').innerHTML=course.days.map((d,i)=>'<button class="daybtn '+(i+1===state.day?'active':'')+'" '+(i+1===state.day?'aria-current="step"':'')+' data-do="day" data-val="'+(i+1)+'"><span class="daynum">'+(counts(i+1).pct===100?'✓':String(i+1).padStart(2,'0'))+'</span><span><small>'+(i+1)+'. dan</small><strong>'+d.short+'</strong></span></button>').join('');
}
function layout(){
 const d=course.days[state.day-1];$('crumbDay').textContent=state.day+'. dan';$('dayTag').textContent=state.day+'. dan od 6';$('title').textContent=d.title;$('intro').textContent=tab()==='lessons'?d.theoryIntro:d.intro;
 $('tabs').innerHTML=kinds.map((t,i)=>'<button data-do="tab" data-val="'+t+'" class="'+(tab()===t?'selected':'')+'" aria-pressed="'+(tab()===t)+'">'+icon(['book','pen','cards'][i])+names[i]+'<span class="tabcount">'+data(t).length+'</span></button>').join('');
 dashboard();render();
}
function setDay(d){state.day=d;resetView();save();layout();$('side').classList.remove('open');$('menu').setAttribute('aria-expanded','false');window.scrollTo({top:0})}
function changeTab(t){state.tabs[state.day]=t;resetView();save();layout()}
function selectItem(n){state.indices[state.day+tab()]=n;resetView();save();render()}
function showUnitStart(){const start=$('content').querySelector('h2');if(!$('dialog').open&&start){start.tabIndex=-1;start.focus({preventScroll:true});$('tabs').scrollIntoView({block:'start'})}}
function nextUnit(){
 const route=kinds.flatMap(t=>data(t).map((_,i)=>[t,i]));
 const pos=route.findIndex(([t,j])=>t===tab()&&j===idx());
 for(let k=1;k<route.length;k++){const unit=route[(pos+k)%route.length];if(!state.marks[idAt(...unit)])return unit}
 return null;
}
function nextName(){
 const unit=nextUnit();if(!unit)return state.day<6?'Sledi '+(state.day+1)+'. učni dan.':'Sledi preizkus s staro polo.';
 const [t,j]=unit,o=data(t)[j];return 'Sledi '+({lessons:'izpeljava',exercises:'naloga',cards:'kartica'}[t])+' »'+(o.title||o.q)+'«.';
}
function advance(){
 const unit=nextUnit();if(unit){const [t,j]=unit;state.tabs[state.day]=t;state.indices[state.day+t]=j;resetView();save();layout();return}
 if(state.day<6)setDay(state.day+1);else openArchive();
}
const btn=(act,t,cls='secondary',extra='')=>'<button class="'+cls+'" data-do="'+act+'" '+extra+'>'+t+'</button>';
function toolbar(){
 let type=tab(),items=data(type),label=type==='lessons'?'Lekcija':type==='exercises'?'Naloga':'Kartica';
 return '<div class="toolbar"><div class="pick"><label for="item">'+label+'</label><select id="item">'+items.map((o,i)=>'<option value="'+i+'" '+(idx()===i?' selected':'')+'>'+ (state.marks[idAt(type,i)]?'✓ ':'')+(i+1)+' / '+items.length+'　'+(o.subtitle||o.title||o.q)+'</option>').join('')+'</select></div>'+(type==='lessons'?'':'<span class="chip">'+icon('pin')+course.days[state.day-1].focus+'</span>')+'</div>'
}
function plotPanel(id,phase=graphStage){
 const cfg=plotSettings(id,phase), value=tab()==='lessons'?cfg[4]:(sliderValue??cfg[4]);
 const views={area:['Ploščina','Prirastek','Odvod'],gauss:['Integral','Odvod in majoranta'],atan:['Ploščina','Notranji odvod'],betasub:['Prvotni integral','Nova spremenljivka','Vrednost integrala'],cubeta:['Prvotni integral','Nova spremenljivka'],loggamma:['Prvotni integral','Jedro gama'],leg:['Začetni člen','Koeficient','Polinom'],ortho:['Faktorja','Predznačena ploščina','Tekoči integral'],bessel:['Vodilni člen','Naslednja potenca','Regularna veja']};
 const chooser=tab()==='exercises'&&views[id]?'<div class="viewSelect"><label for="graphView">Pogled</label> <select id="graphView">'+views[id].map((name,i)=>'<option value="'+i+'" '+(i===graphStage?'selected':'')+'>'+name+'</option>').join('')+'</select></div>':'';
 return '<section class="plot" data-phase="'+phase+'" aria-label="Interaktivni graf"><div class="plotHead">'+icon('wave')+(tab()==='lessons'?'Ponazoritev':'Graf naloge')+'</div>'+chooser+'<div class="drawing"></div><div class="legend"></div><div class="sliderbox"><label for="slide-'+phase+'">'+cfg[0]+'<output for="slide-'+phase+'"></output></label><input id="slide-'+phase+'" type="range" min="'+cfg[1]+'" max="'+cfg[2]+'" step="'+cfg[3]+'" value="'+value+'"></div><p class="caption"></p></section>';
}
function drawPlot(panel){
 const value=+panel.querySelector('input').value,phase=+panel.dataset.phase;
 const m=chartModel(current().plot,phase,value);

 panel.querySelector('output').textContent=fmt(value);
 if(tab()==='lessons'){
  panel.querySelector('.caption').innerHTML=current().steps[phase][3];
  if(current().plot==='area'){
   m.keys.x='x · spremenljivka integriranja';m.keys.y=phase===2?'Δf/h · sprememba višine na enoto parametra':'f · vrednost funkcije';
   m.keys.areas=[['F(0) · začetna ploščina','F(a) − F(0) · sprememba'],['F(a) · prvotna ploščina','ΔF · prirastek'],['F′(a) · odvod']][phase];
  }
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
function lesson(){
 const o=current(),done=!!state.marks[currentId()];
 const facts=[['Pogoji veljavnosti',o.conditions],['Oznake',o.symbols],['Uporaba',o.use]];
 const intro='<section class="concept"><h3>Definicija</h3><p>'+o.definition+'</p><dl>'+facts.map(([name,value])=>'<div><dt>'+name+'</dt><dd>'+value+'</dd></div>').join('')+'</dl></section>';
 const scenes=o.steps.map(([heading,reason,formula],i)=>'<section class="lesson scene"><div class="explain"><div class="stepLabel">Izpeljava · '+(i+1)+' / '+o.steps.length+'</div><h2>'+heading+'</h2><p>'+reason+'</p><div class="formula calcLine">'+formula+'</div>'+(o.plot==='leib'&&i<2?'<div class="boundaryKeys"></div>':'')+'</div>'+plotPanel(o.plot,i)+'</section>').join('');
 return '<div class="lessonName"><h2>'+o.title+'</h2>'+source(o)+'</div>'+intro+scenes+'<div class="finish"><span>'+nextName()+'</span>'+btn(done?'advance':'learn',done?'Nadaljuj':'Znam izpeljati · nadaljuj','action')+(done?btn('unlearn','Ponovno v učenje','quiet'):'')+'</div>';
}
function solvedExamples(){
 const examples=course.examples.filter(o=>o.day===state.day);
 return '<details class="base examples"><summary>Rešeni zgledi za '+state.day+'. dan</summary>'+examples.map(o=>'<details class="baseEntry"><summary>'+o.subtitle+'</summary><p>'+o.purpose.question+'</p><p>'+o.purpose.use+'</p>'+ruleBridge(o.rules)+o.steps.map(([heading],i)=>calculation(o.worked[i],heading)).join('')+'</details>').join('')+'</details>';
}
function exercise(){
 const o=current(),done=!!state.marks[currentId()],answers=o.quiz.slice(1),order=[[1,0,2],[2,1,0],[0,2,1]][(idx()+state.day)%3];
 const hint='<p class="helpText"><b>Namig</b> '+o.hint+'</p>';
 return '<article class="practice"><div class="taskmeta">'+icon('pen')+o.source+'</div><h2>'+o.title+'</h2>'+application('Kaj iščeš in zakaj',o.purpose)+'<p class="question">'+o.prompt+'</p>'+reading(o.symbols)+'<div class="method"><b>Kako prepoznaš metodo</b><p>'+o.cue+'</p></div>'+plotPanel(o.plot)+(choice!==null&&choice!==0?hint:'<details class="base"><summary>Potrebujem namig</summary>'+hint+'</details>')+'<details class="base"><summary>Poglej celoten postopek</summary>'+ruleBridge(o.rules)+calculation(o.worked,'Od pravila do rezultata')+'</details>' +'<div class="quiz"><h3>'+o.quiz[0]+'</h3><div class="options">'+order.map(i=>btn('answer',answers[i],choice===i?(i===0?'right':'wrong'):'','data-val="'+i+'"')).join('')+'</div><div class="feedback" role="status">'+(choice===0?'Pravilno. Pred potrditvijo samostojno zapiši še celoten postopek.':choice!==null?'Poskusi še enkrat. '+o.hint+'':'')+'</div><div class="actrow">'+(done?btn('advance','Nadaljuj','action')+btn('unlearn','✓ Rešeno · ponovi','quiet'):choice===0?btn('learn','Znam rešiti brez pomoči','action'):'')+'</div></div></article>';
}
function flash(){
 const c=current(),done=!!state.marks[currentId()];
 return '<article class="flash"><div class="taskmeta">'+icon('cards')+' Kartica '+(idx()+1)+' od '+data('cards').length+(done?' · Naučeno':'')+'</div><h2>'+c.q+'</h2>'+application('Kdaj to potrebuješ',c.purpose)+(flipped?'<div class="back">'+c.a+'</div>'+reading(c.symbols)+calculation(c.worked,'Uporabi pravilo na primeru'):'')+'<div class="actrow">'+(flipped?btn('again','Še ponavljam')+btn('known','Znam','action'):btn('flip','Pokaži odgovor','action'))+'</div><div class="feedback" role="status">'+notice+'</div></article>';
}
function render(){
 const active=document.activeElement,within=$('content').contains(active),oldAct=active?.dataset.do,oldVal=active?.dataset.val;
 const fin=state.day===6&&tab()==='exercises'?'<div class="dayfinish"><div><h2>Preizkus s staro polo</h2><p>Računska pola traja 90 minut, teoretična 30 minut.</p></div>'+btn('archive','Izberi kolokvij')+'</div>':'';
 $('content').innerHTML=toolbar()+(tab()==='lessons'?lesson():tab()==='exercises'?exercise()+solvedExamples():flash())+fin;document.querySelectorAll('#content .plot').forEach(drawPlot);
 if(within){let match=oldAct&&Array.from($('content').querySelectorAll('[data-do]')).find(b=>b.dataset.do===oldAct&&b.dataset.val===oldVal);let next=match||$('content').querySelector('.explain h2,.practice h2,.flash h2');if(next){if(next.tagName==='H2')next.tabIndex=-1;next.focus({preventScroll:true})}}
}
function modal(title,html){
 $('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;if(!$('dialog').open)$('dialog').showModal();
}
const paperNames=['Račun 2022','Račun 2023','Račun 2024','Teorija 2022'];
const paperEx=[[1,9,4,16],[2,5,10,12,14],[3,6,7,13,17]];
const theoryRefs=[['Premikajoči se meji','lessons',1,1,'b'],['Četrti odvod','cards',3,2,'d'],['Faktor t in drugi odvod','exercises',3,3,'d'],['Kontrapozicija M-testa','exercises',5,2,'a'],['Definicija enakomerne konvergence integrala','cards',1,2,''],['Razširitev funkcije gama','cards',2,2,''],['Vrednost B(3, ½)','cards',2,4,''],['Frobeniusov nastavek','cards',6,0,''],['Uteženi skalarni produkt','exercises',6,2,''],['Besselova enačba','exercises',6,1,'']];
let pdfUrls={};
function pdfLink(i){
 if(!pdfUrls[i]){const bytes=Uint8Array.from(atob(typeof i==='number'?course.papers[i]:course.sources[i]),c=>c.charCodeAt(0));pdfUrls[i]=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}))}
 return pdfUrls[i];
}
function openArchive(){
 let i=archiveIndex,links=i<3?paperEx[i].map(j=>{const o=course.exercises[j];return '<button data-do="goto" data-val="exercises,'+o.day+','+course.exercises.filter(x=>x.day===o.day).indexOf(o)+'"><small>'+o.source+'</small>'+o.title+'</button>'}).join(''):theoryRefs.map(([name,type,d,j,key],n)=>'<button data-do="goto" data-val="'+type+','+d+','+j+'"><small>Naloga '+(n+1)+(key?' · odgovor '+key:'')+'</small>'+name+'</button>').join('');
 modal('Stari kolokviji','<div class="paperTabs">'+paperNames.map((n,j)=>btn('paper',n,i===j?'active':'','data-val="'+j+'"')).join('')+'</div><p>'+(i===3?'30 minut brez pripomočkov. Pri izbiri je pravilen en odgovor.':'90 minut za štiri naloge. Dovoljen je en list A4 s formulami. Vsak odgovor utemelji.')+'</p><div class="paperActions"><a href="'+pdfLink(i)+'" class="action" target="_blank" rel="noopener">Odpri izvirno polo (PDF)</a>'+(!state.timer?btn('starttimer','Začni merjenje časa'):'')+'</div><div id="timer"></div><details><summary>Razlage in rešitve</summary><div class="paperList">'+links+'</div></details>');timerUpdate();
}
function timerUpdate(){
 const el=$('timer');if(!el||!state.timer)return;let s=Math.max(0,Math.ceil((state.timer.end-Date.now())/1000));
 el.innerHTML='<div class="timerbar"><span>'+paperNames[state.timer.i]+' · '+(s?Math.floor(s/60)+' min '+String(s%60).padStart(2,'0')+' s':'Čas je potekel')+'</span>'+btn('stoptimer',s?'Končaj merjenje':'Zaključi','quiet')+'</div>';
}
function showProgress(){const all=counts(),d=counts(state.day),n=Object.values(state.marks).filter(v=>v===today()).length;
 modal('Kako se meri napredek?','<p><b>Skupaj</b> si potrdil '+all.done+' od '+all.total+' učnih enot. Vsaka izpeljava, samostojno rešena naloga in naučena kartica šteje enkrat.</p><p><b>Za '+state.day+'. dan</b> je dokončanih '+d.done+' od '+d.total+' enot tega dneva načrta.</p><p><b>Danes</b> si potrdil '+n+' novih enot. Odstotek pove, kolikšen del celotne snovi si osvojil na današnji koledarski dan.</p><p class="sourceNote">Napredek se shrani v tem brskalniku. Oznako lahko umakneš, ko želiš enoto še ponoviti.</p>')}
$('menu').onclick=()=>{const open=$('side').classList.toggle('open');$('menu').setAttribute('aria-expanded',open)};
document.addEventListener('change',e=>{if(e.target.id==='item'){selectItem(+e.target.value);$('item').focus({preventScroll:true})}if(e.target.id==='graphView'){graphStage=+e.target.value;sliderValue=undefined;render();$('graphView').focus({preventScroll:true})}});
document.addEventListener('input',e=>{if(e.target.matches('.plot input[type=range]')){if(tab()==='exercises')sliderValue=+e.target.value;drawPlot(e.target.closest('.plot'))}});
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
resetView();layout();save();timerTick=setInterval(timerUpdate,1000);
