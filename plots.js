const mint='#92efd5', lilac='#c4a8ff', gold='#ffcc93', rose='#ffa5bf';
const sq=x=>x*x, exp=Math.exp, sin=Math.sin, cos=Math.cos, sqrt=Math.sqrt, abs=Math.abs;
const sum=(n,fn,start=0)=>{let s=0;for(let i=start;i<=n;i++) s+=fn(i);return s};
const fmt=n=>new Intl.NumberFormat('sl-SI',{maximumFractionDigits:2}).format(n);
const line=(name,fn,color=mint)=>({name,fn,color});
const fill=(fn,a,b,color=mint,low=()=>0)=>({fn,a,b,color,low});
function plotSettings(id,k=0){
 if(practicePlots[id])return practicePlots[id].slider;
 if(id==='gaussTheory')return k===0?['Meja polmera R',.2,3,.05,1.2]:['Parameter a',0,5,.1,1.5];
 if(id==='beta'&&k===1)return ['Vsota r = x + y',1,4,.1,2];
 if(id==='radius'&&k===1)return ['Zadnji indeks N',2,40,1,12];
 const settings={
 area:['Parameter a',0,1.4,.05,.65],leib:['Parameter a',.25,1.25,.05,.7],tail:['Meja R',.4,3,.05,1.2],
 gamma:['Argument p',1,4,.1,2],beta:['Argument p',1,4,.1,2],betasub:['Zgornja meja x',.1,2,.05,1.6],
 lap:['Parameter s',1.2,3.2,.1,1.8],deriv:['Parameter s',.6,2.5,.1,1.2],system:['Čas t',0,2,.05,1],
 shift:['Čas preklopa a',.5,3,.1,2],conv:['Čas t',.1,4,.05,2],impulse:['Širina h',.1,1,.05,.6],
 radius:['Vrednost x',-1.15,1.15,.05,-1],series:['Zadnji indeks N',1,20,1,4],uniform:['Zadnji indeks N',1,20,1,5],
 leg:['Vrednost x',-1,1,.05,.6],bessel:['Število členov N',1,12,1,4],ortho:['Zgornja meja b',-1,1,.05,.6],pde:['Prerez y',-2,2,.1,1],
 gauss:['Parameter a',0,8,.1,3],atan:['Parameter t',.2,1.6,.05,1.2],root:['Parameter t',2,4,.05,2.5],
 cubeta:['Zgornja meja x',.02,.5,.01,.35],loggamma:['Zgornja meja x',1.1,8,.1,4],betarec:['Argument p',1,4,.1,2.5],
 inverse:['Čas t',0,2,.05,1],sys22:['Čas t',0,2.3,.05,1],sys23:['Čas t',0,2,.05,.7],devar:['Parameter s',0,4,.1,1.5],
 triple:['Čas x',0,5,.1,2],force24:['Čas t',0,5,.05,3],force23:['Čas t',0,6,.05,3],volterra:['Čas t',0,5,.05,2],
 sum22:['Zadnji indeks N',2,36,1,5],sum24:['Zadnji indeks N',0,20,1,3],mtest:['Zadnji indeks N',1,20,1,3]};
 return settings[id];
}
const graphKeys={...graphKeys123,...graphKeys456};
const escapeGraph=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function chartModel(id,k,v){
 if(practicePlots[id])return {bars:[],barColors:[lilac,gold,rose],markColors:[gold,rose,lilac,mint],...practicePlots[id].make(v)};
 let x=[0,4],y=[0,4],curves=[],fills=[],marks=[],bars=[],label='x',caption='',points=[];
 const graph=(name,fn,color)=>{curves.push(line(name,fn,color));return fn};
 const area=(fn,a,b,color,low)=>fills.push(fill(fn,a,b,color,low));
 const mark=(a,fn,color=mint)=>{marks.push(a);points.push([a,fn(a),color])};
 const twoSignals=(f,g,end,lo,hi)=>{x=[0,end];y=[lo,hi];label='t';graph('y(t)',f);graph('z(t)',g,lilac);mark(v,f);points.push([v,g(v),lilac]);caption='Pri t = '+fmt(v)+' je y = '+fmt(f(v))+' in z = '+fmt(g(v))+'.'};
 if(id==='gaussTheory'){
  if(k===0){
   x=[0,3];y=[0,1.05];const radial=r=>Math.PI/2*r*exp(-r*r);
   graph('Prispevek četrtinskega kolobarja',radial);area(radial,0,v);mark(v,radial,gold);
   caption='Do R = '+fmt(v)+' je prispevek k I(0)² enak '+fmt(Math.PI/4*(-Math.expm1(-v*v)))+'.';
  }else if(k===1){
   x=[0,3.5];y=[-.55,.55];const g=t=>-t*exp(-t*t)*sin(v*t),bound=t=>t*exp(-t*t);
   graph('Odvod po parametru',g);graph('Zgornja ovojnica',bound,lilac);graph('Spodnja ovojnica',t=>-bound(t),lilac);area(g,0,3.5);
   caption='Pri a = '+fmt(v)+' ostane odvod med istima ovojnicama.';
  }else{
   x=[0,5];y=[0,1];const response=a=>Math.sqrt(Math.PI)/2*exp(-a*a/4);
   graph('I(a)',response);mark(v,response,gold);points.push([0,response(0),lilac]);
   caption='Za a = '+fmt(v)+' je I(a) ≈ '+fmt(response(v))+'.';
  }
 }else if(id==='area'){
  x=[0,2.35];y=[0,8];label='x (m)';const f=a=>u=>1+a*u*u;
  if(k===0){
   graph('Izbrani rob',f(v));graph('Rob pri a = 0',f(0),gold);marks=[2];
   area(f(0),0,2,gold);area(f(v),0,2,mint,f(0));
   caption='Pri a = 0 ostane pravokotnik. Njegova ploščina je F(0) = 2 × 1 = 2 m², zato je C = 2.'+
    (v>0?' Pri a = '+fmt(v)+' se prišteje še '+fmt(8*v/3)+' m².':'');
  }else if(k===1){
   graph('Višina plošče (m)',f(v));graph('f(x, a + h)',f(v+.3),lilac);marks=[2];
   area(f(v),0,2);area(f(v+.3),0,2,lilac,f(v));
   caption='Če a povečaš za 0,3, vijolični pas pokaže dodatnih 0,8 m² pločevine.';
  }
  else {const h=.3;graph('Δf / h',u=>(f(v+h)(u)-f(v)(u))/h);area(u=>u*u,0,2);y=[0,5];caption='Za vsak dodaten 0,1 pri a potrebuješ približno 0,27 m² več pločevine.'}
 }else if(id==='leib'){
  x=[0,2.8];y=[0,5];const u=v/2,b=1+v,h=.24,f=t=>t+v,g=t=>t+v+h;graph('Stara višina',f);marks=[u,b];area(f,u,b);
  if(k>0){graph('Nova višina',g,lilac);area(g,u,b,lilac,f);area(g,b,b+h,gold);area(g,u,u+h/2,rose);marks.push(b+h,u+h/2)}
  caption=k===0?'Meji sta '+fmt(u)+' in '+fmt(b)+'.':'Desni rob doda ploščino, levi jo odvzame. Vijoličen pas meri spremembo višine.';
 }else if(id==='tail'||id==='gauss'){
  const a=id==='gauss'?v:4;x=[0,3.5]; y=[-.95,1.1];const f=t=>exp(-t*t)*cos(a*t),g=t=>-t*exp(-t*t)*sin(a*t),m=t=>t*exp(-t*t);
  if(k===0){graph('Integrand',f);area(f,0,id==='tail'?v:3.5);if(id==='tail')marks=[v];caption='Eksponentno dušenje omeji prispevek oddaljenih nihajev.'}
  else{graph('Odvod po a',g);graph('Ovojnici ±x exp(−x²)',m,lilac);graph('Spodnja meja',t=>-m(t),lilac);let r=id==='tail'?v:1.2;area(m,r,3.5,gold);marks=[r];caption='Za R = '+fmt(r)+' je integral repa majorante '+fmt(.5*exp(-r*r))+'.'}
 }else if(id==='gamma'||id==='loggamma'){
  x=[0,id==='gamma'?10:8];label=id==='loggamma'&&k===0?'x':'u';const p=id==='gamma'?v:1.5;
  let f=t=>Math.pow(t,p-1)*exp(-t),g=t=>Math.pow(t,p)*exp(-t);
  if(id==='loggamma'&&k===0){x=[1,8];y=[0,.42];f=t=>sqrt(Math.log(t))/(t*t);graph('Prvotni integrand',f);area(f,1,v);marks=[v];caption='Zgornji meji x = '+fmt(v)+' ustreza u = '+fmt(Math.log(v))+'.'}
  else{y=[0,Math.max(1.15,1.2*(k>0&&id==='gamma'?g(p):f(Math.max(.01,p-1))))];graph('Jedro gama',f);area(f,0,id==='gamma'?10:Math.log(v));if(k>0&&id==='gamma')graph('Jedro za p + 1',g,lilac);caption=id==='gamma'?(k===0?'Pri p = '+fmt(p)+' prikazana ploščina prispeva k Γ(p).':'Ploščini pod celotnima krivuljama sta v razmerju p = '+fmt(p)+'.'):'Po menjavi meja je označena ploščina enaka prvotni.'}
 }else if(id==='beta'||id==='betarec'){
  const p=v,q=2;x=[0,1];label='u';let f=u=>u**(p-1)*(1-u)**(q-1);
  if(id==='beta'&&k===1){x=[0,4.2];y=[0,4.2];label='x';let r=v;const g=t=>t<=r?r-t:NaN;graph('x + y = r',g);marks=[r/2];points=[[r/2,r/2,mint]];caption='Na daljici x + y = '+fmt(r)+' teče u od 0 do 1. Sredina ima u = ½.'}
  else if(id==='betarec'){y=[0,1.12];const a=t=>t**(p-1)*(1-t)**q,b=t=>t**p*(1-t)**(q-1);graph('B(p, q + 1)',a);graph('B(p + 1, q)',b,lilac);area(a,0,1);area(b,0,1,lilac);caption='Za q = 2 je količnik ploščin q/p = '+fmt(2/p)+'.'}
  else{if(k===2){const norm=p*(p+1);y=[0,5];graph('p, 2',u=>norm*f(u));graph('2, p',u=>norm*f(1-u),lilac);caption='Zamenjava u z 1 − u zrcali gostoto. Obe normalizirani ploščini sta 1.'}else{y=[0,1.1];graph('Beta jedro',f);area(f,0,1);caption='Ploščina pri q = 2 je 1/[p(p+1)] = '+fmt(1/(p*(p+1)))+'.'}}
 }else if(id==='betasub'||id==='cubeta'){
  const old=id==='betasub',a=old?2:.5,u=old?v*v/4:4*v*v;
  if(k===0){x=[0,a];y=[0,old?3.6:.55];const f=old?t=>t*t*sqrt(Math.max(0,4-t*t)):t=>sqrt(Math.max(0,t-4*t**3));graph('Pred menjavo',f);area(f,0,v);mark(v,f);caption='Meja x = '+fmt(v)+' se preslika v u = '+fmt(u)+'.'}
  else{x=[0,1];y=[0,old?4.6:1];label='u';const g=old?t=>8*sqrt(t*(1-t)):t=>t===0?NaN:t**(-.25)*sqrt(1-t)/(4*sqrt(2));graph('Po menjavi',g);area(g,0,u);mark(u,g);caption='Do u = '+fmt(u)+' je ploščina enaka prvotni do x = '+fmt(v)+'.'}
 }else if(id==='lap'||id==='deriv'){
  x=[0,5];y=[0,2];label='t';let f=id==='lap'?t=>exp(-(v-1)*t):k===2?t=>t*(1+t)*exp(-v*t):k===0?t=>exp(-v*t):t=>v*(1+t)*exp(-v*t);
  if(id==='lap'&&k===2){x=[1.1,3.3];y=[0,5];label='s';const g=s=>1/(s-1);graph('F(s)',g);mark(v,g);caption='Ploščina v časovni domeni postane točka ('+fmt(v)+', '+fmt(g(v))+').'}
  else{graph(id==='lap'?'Uteženi signal':k===2?'−∂ₛ integranda':k===0?'Uteženi odvod':'s · uteženi signal',f);area(f,0,5);if(id==='deriv'&&k===1)points=[[0,v,mint]];caption=id==='lap'?'Celotna ploščina pri s = '+fmt(v)+' je '+fmt(1/(v-1))+'.':'Pri s = '+fmt(v)+' ima prvotni signal f(0) = 1.'}
 }else if(id==='system'||id==='inverse'||id==='sys22'||id==='sys23'){
  if(id==='sys22')twoSignals(t=>(2+t)*exp(-t),t=>(1.25+t/2)*exp(-t)-exp(t)/4,2.3,-2.5,2.4);
  else if(id==='sys23')twoSignals(t=>(1-t)*exp(t),t=>(2+t)*exp(t),2,-9,30);
  else if(id==='inverse'){x=[0,2];y=[-.7,4];label='t';let a=t=>exp(t)/2,b=t=>-exp(-t)/2,f=Math.sinh;graph('eᵗ / 2',a,lilac);graph('−e⁻ᵗ / 2',b,gold);graph('Vsota = sinh t',f);mark(v,f);caption='Pri t = '+fmt(v)+' se '+fmt(a(v))+' in '+fmt(b(v))+' seštejeta v '+fmt(f(v))+'.'}
  else{let f=Math.cosh,g=Math.sinh;if(id==='system'&&k===0){x=[0,2];y=[0,4];label='t';points=[[0,1,mint],[0,0,lilac]];graph('y(0) = 1',t=>t===0?1:NaN);graph('z(0) = 0',t=>t===0?0:NaN);caption='Mesto začetnih podatkov je t = 0. Drsnik označuje čas opazovanja.';marks=[v]}else twoSignals(f,g,2,0,4)}
 }else if(id==='devar'){x=[0,4];y=[-.5,.65];label='s';let f=s=>1/sqrt(3*s*s+4),g=s=>-3*s/(3*s*s+4)**1.5;graph('Y',f);graph('Y′',g,lilac);mark(v,f);caption='Pri s = '+fmt(v)+' se prispevka (3s² + 4)Y′ in 3sY izničita.'}
 else if(id==='shift'||id==='force24'||id==='force23'){
  const a=id==='shift'?v:id==='force24'?2:Math.PI/2, trig=id==='force23',u=t=>t-a;
  x=[0,trig?6:5];y=trig?[-4.5,4.5]:[-1,5.5];label='t';
  let before=t=>trig?3*(sin(t)+cos(t)):1,after=t=>trig?3*sin(t):t;
  graph('Pred preklopom',t=>t<a?before(t):NaN,lilac);graph('Po preklopu',t=>t>=a?after(t):NaN);marks=[a];
  if(id==='shift'&&k>0){graph('Dodani popravek',t=>t>=a?t-1:0,gold)}
  if(id!=='shift'){const g=trig?t=>sin(t)+cos(t)+.5*sin(2*t)+(t>=a?sin(u(t))-.5*sin(2*u(t)):0):t=>1+(t>=a?u(t)-1+exp(-u(t)):0);graph('Odziv y',g,gold);mark(v,g);caption='Pri t = '+fmt(v)+' je odziv y = '+fmt(g(v))+'.'}
  else caption='Preklop pri a = '+fmt(a)+'. Lokalni čas u začne na ničli.';
 }else if(id==='conv'||id==='triple'||id==='volterra'){
  x=[0,id==='conv'?4:5];label='u';if(id==='conv'&&k<2){y=[0,4.4];graph('f(u) = u',u=>u);graph('g(t − u)',u=>u<=v?1:0,lilac);area(u=>u,0,v);marks=[v];caption='Prekrivanje ima širino '+fmt(v)+' in ploščino '+fmt(v*v/2)+'.'}
  else {const f=id==='conv'?t=>t*t/2:id==='triple'?t=>(1-cos(2*t)-t*sin(2*t))/4:t=>.5+1.5*cos(2*t);y=id==='conv'?[0,9]:[-2.3,2.4];label='t';graph(id==='conv'?'Ploščina skozi čas':'Rezultat',f);mark(v,f);caption='Pri času '+fmt(v)+' je vrednost '+fmt(f(v))+'.'}
 }else if(id==='impulse'){x=[1.5,3.5];y=[0,1.1/v];label='t';const f=t=>t>=2&&t<=2+v?1/v:0,g=t=>f(t)*exp(-t);graph('Pravokotnik',f);area(f,2,2+v);if(k>0){graph('Uteženi sunek',g,gold);area(g,2,2+v,gold)}caption=k===0?'Širina × višina = '+fmt(v)+' × '+fmt(1/v)+' = 1.':'Pri s = 1 je utežena ploščina '+fmt(exp(-2)*(1-exp(-v))/v)+', limita pa e⁻².'}
 else if(id==='radius'){
  if(k===0){x=[1,20];y=[0,1.3];label='n';graph('Absolutni kvocient',n=>v===0?NaN:abs(v)*n/(n+1));graph('Limita |x|',()=>abs(v),lilac);caption=v===0?'Pri x = 0 so vsi členi nič. Kvocienta 0/0 ni mogoče uporabiti.':'Pri x = '+fmt(v)+' kvocient teži k '+fmt(abs(v))+'.'}
  else if(k===1){x=[1,40];y=[-1.2,4.5];label='N';let p=n=>sum(Math.floor(n),j=>1/j,1),m=n=>sum(Math.floor(n),j=>(-1)**j/j,1);graph('x = 1',p,gold);graph('x = −1',m);mark(v,m);points.push([v,p(v),gold]);caption='Pri N = '+v+' sta delni vsoti '+fmt(p(v))+' in '+fmt(m(v))+'.'}
  else{x=[-1.25,1.25];y=[-.2,1];label='x';graph('Območje [−1, 1)',t=>t>=-1&&t<1?.4:NaN);points=[[-1,.4,mint],[1,.4,'#30253f'],[v,.72,gold]];marks=[v];caption='Pri x = '+fmt(v)+(v>=-1&&v<1?' vrsta konvergira.':' vrsta divergira.')+' Levi rob je vključen, desni je izključen.'}
 }
 else if(id==='series'||id==='uniform'||id==='sum22'||id==='sum24'||id==='mtest'){
  let f,g,title='Delna vsota';x=[-.9,.9];y=[-.9,5];
  if(id==='series'){f=k===2?t=>sum(v,i=>t**i/i,1):t=>sum(v,i=>t**i);g=k===2?t=>-Math.log(1-t):t=>1/(1-t);y=k===2?[-.8,2.6]:[0,10.5]}
  if(id==='uniform'){x=[-.8,.8];y=k===0?[-1,1]:[-.1,4.2];title=k===0?'Velikost člena |xᴺ|':k===1?'Dejanski rep':'Delni rep (5 členov)';f=k===0?t=>abs(t**v):k===1?t=>abs(t**(v+1)/(1-t)):t=>abs(sum(v+5,i=>t**i,v+1));g=k===0?t=>.8**v:k===1?t=>.8**(v+1)/.2:t=>sum(v+5,i=>.8**i,v+1);}
  if(id==='sum22'){x=[-1,1];y=[-.1,.85];f=t=>sum(v,i=>t**i/(i*i-1),2);g=t=>t===1?.75:t===-1?.25:abs(t)<1e-7?0:((1/t-t)*Math.log1p(-t)+1+t/2)/2}
  if(id==='sum24'){x=[-.93,.93];y=[-6,6];f=t=>abs(t)<.03?NaN:sum(v,i=>t**(4*i-1)/(4*i+1));g=t=>abs(t)<.03?NaN:(Math.atan(t)+Math.atanh(t))/(2*t*t)}
  if(id==='mtest'){x=[-Math.PI,Math.PI];y=[-1.5,1.5];f=t=>sum(v,i=>sin(i*t)/(i*i),1);g=t=>sum(120,i=>sin(i*t)/(i*i),1)}
  graph(title,f);graph(id==='uniform'?'Ocena repa':id==='mtest'?'120 členov':'Vsota',g,lilac);caption=id==='uniform'?('Za '+(k===0?'posamezni člen':k===1?'neskončni rep':'vsoto naslednjih petih členov')+' velja meja '+fmt(g(0))+' na vsem intervalu.'):'Z več členi primerjaj krivulji tudi blizu roba intervala.';
 }else if(id==='leg'||id==='ortho'){x=[-1,1];y=[-1,1.2];const f=t=>(3*t*t-1)/2;
  if(id==='leg'){graph(k===0?'Konstantni člen':'P₂',k===0?t=>-.5:f);if(k===1)graph('Kvadratni člen',t=>1.5*t*t,lilac);mark(v,k===0?t=>-.5:f);caption=k===0?'Za normalizirano sodo vejo začni pri a₀ = −½.':'Pri x = '+fmt(v)+' je P₂(x) = '+fmt(f(v))+'.'}
  else if(k===0){graph('P₀',()=>1,lilac);graph('P₂',f);mark(v,f);caption='V izbrani točki je P₀ · P₂ = 1 × '+fmt(f(v))+'.'}
  else if(k===1){graph('P₀ · P₂',f);area(t=>Math.max(0,f(t)),-1,v);area(t=>Math.min(0,f(t)),-1,v,rose);mark(v,f);caption='Predznačena ploščina do b = '+fmt(v)+' je '+fmt((v**3-v)/2)+'.'}
  else{const g=t=>(t**3-t)/2;y=[-.26,.26];label='b';graph('Integral do b',g);mark(v,g);points.push([1,0,lilac]);caption='Tekoča vsota ploščin pri b = '+fmt(v)+' je '+fmt(g(v))+'. Ob desnem robu se vrne na 0.'}
 }else if(id==='bessel'){x=[0,6];y=[-.25,.65];const part=(t,n)=>{let a=(t/2)**5/120,s=a;for(let i=1;i<n;i++){a*=-(t*t/4)/(i*(i+5));s+=a}return s};graph('N členov za J₅',t=>part(t,v));if(k===0){graph('Vodilni člen',t=>part(t,1),gold);caption='Prvi člen je x⁵/(2⁵ · 5!). Drsnik dodaja nadaljnje člene regularne veje.'}else if(k===1){graph('N + 1 členov',t=>part(t,v+1),lilac);caption='Primerjaj dva zaporedna približka pri r = 5. Naslednja neničelna potenca skoči za 2.'}else{graph('J₅ (24 členov)',t=>part(t,24),lilac);caption='Prikazana je regularna veja J₅. Druga neodvisna rešitev Y₅ je pri 0 singularna.'}}
 else if(id==='pde'){x=[-2,2];y=[-8,8];graph('Izbrani prerez',t=>v*Math.cosh(t));if(k>0){graph('y = −1',t=>-Math.cosh(t),lilac);graph('y = 1',Math.cosh,gold)}caption='Prerez pri y = '+fmt(v)+' ima u(0, y) = '+fmt(v)+'.'}
 else if(id==='atan'){x=[0,2.7];y=[-1,1.5];let f=u=>u===0?v-1:(Math.atan(v*u)-Math.atan(u))/u,g=u=>1/(1+v*v*u*u);graph('Integrand',f);graph('Parcialni odvod',g,lilac);area(k?g:f,0,v*v);mark(v*v,f);caption='Zgornja meja je t² = '+fmt(v*v)+', tam se pri odvajanju pojavi robni člen.'}
 else if(id==='root'){x=[0,2];y=[0,3];label='y';let f=t=>1/sqrt(v*v-t*t);graph('Odvod po t',f);graph('Majoranta pri t = 2',t=>1/sqrt(4-t*t),lilac);area(f,0,2);caption='Ploščina = arcsin(2/t) = '+fmt(Math.asin(2/v))+'. Na robu je singularnost integrabilna.'}
 // Some derivations change coordinates or switch from an integrand to its integral.
 function fresh(){curves=[];fills=[];marks=[];points=[];bars=[]}
 if(id==='leib'&&k===2){
  fresh();x=[0,4];y=[-1.2,4];label='del';const u=v/2,b=1+v;bars=[[1,b-u],[2,b+v],[3,-(u+v)/2]];caption='1 · notranjost '+fmt(b-u)+'; 2 · desni rob +'+fmt(b+v)+'; 3 · levi rob −'+fmt((u+v)/2)+'. Skupaj F′ = '+fmt(b-u+b+v-(u+v)/2)+'.';
 }
 if(id==='tail'&&k===2){fresh();x=[0,3];y=[0,.56];label='R';const f=r=>.5*exp(-r*r);graph('Ocena preostalega repa',f);mark(v,f);caption='Za vse parametre a je napaka pri rezu R = '+fmt(v)+' največ '+fmt(f(v))+'.'}
 if(id==='gamma'&&k===2){fresh();const a=t=>t**v*exp(-t),b=t=>v*t**(v-1)*exp(-t);y=[0,1.15*Math.max(1,a(v),b(Math.max(.0001,v-1)))];graph('Jedro Γ(p+1)',a);graph('p × jedro Γ(p)',b,lilac);area(a,0,10);caption='Na [0, ∞) imata obe jedri enako ploščino. Za p = '+fmt(v)+' preverjaš rekurzijo Γ(p+1) = pΓ(p).'}
 if(id==='betasub'&&k===2){fresh();x=[0,2];y=[0,3.5];label='b';const f=t=>{let th=Math.asin(t/2);return 2*th-.5*sin(4*th)};graph('Integral do b',f);mark(v,f);points.push([2,Math.PI,lilac]);caption='Pri b = '+fmt(v)+' je ploščina '+fmt(f(v))+'. Pri b = 2 dobiš π.'}
 if(id==='lap'&&k===0){graph('Jedro exp(−st)',t=>exp(-v*t),lilac);graph('Signal exp(t)',t=>exp(t),gold);caption='Uteženi signal je produkt prikazanega signala in jedra pri s = '+fmt(v)+'.'}
 if(id==='system'&&k===1){fresh();x=[0,2];y=[-.7,4];label='t';const a=t=>exp(t)/2,b=t=>exp(-t)/2;graph('½ exp(t)',a);graph('½ exp(−t)',b,lilac);mark(v,a);points.push([v,b(v),lilac]);caption='Pola s = 1 in s = −1 dasta dve gradbeni funkciji. Nato ju seštej ali odštej.'}
 if(id==='shift'&&k===2){fresh();x=[0,4];y=[0,1.1];label='s';const f=s=>exp(-v*s);graph('Faktor zamika',f);area(f,0,4);caption='Časovni premik a = '+fmt(v)+' pomnoži transformiranko z exp(−as).'}
 if(id==='conv'&&k===0){fills=[];caption='Premakni t. Odsek med 0 in t določi, kateri vrednosti signalov množiš.'}
 if(id==='impulse'&&k===2){fresh();x=[0,1];y=[.05,.155];label='h';const f=h=>h===0?exp(-2):exp(-2)*(-Math.expm1(-h))/h;graph('Transformiranka sunka pri s = 1',f);graph('Limita exp(−2)',()=>exp(-2),lilac);mark(v,f);caption='Ko širino zmanjšaš na '+fmt(v)+', je utežena ploščina '+fmt(f(v))+'.'}
 if(id==='series'&&k===0){fresh();y=[-.05,2.1];const f=x=>sum(v,i=>x**i);graph('Sᴺ',f);graph('x · Sᴺ',x=>x*f(x),lilac);area(f,0,.7,mint,x=>x*f(x));caption='Navpična razlika Sᴺ − xSᴺ je 1 − x⁽ᴺ⁺¹⁾. Z drsnikom izbereš zadnji indeks.';y=[-1.1,Math.min(v+2,10)]}
 if(id==='pde'&&k===2){fresh();x=[-2,2];y=[-8,8];const f=t=>v*Math.cosh(t);graph('uₓ',t=>v*Math.sinh(t),lilac);graph('uₓₓ = u',f);points=[[0,v,mint]];caption='Po drugem odvodu se vrne prvotni prerez z začetno višino '+fmt(v)+'.'}
 const model={x,y,curves,fills,marks,points,bars,label,caption};
 model.keys=graphKeys[id](k,v,model);
 model.markColors=id==='leib'?[mint,lilac,gold,rose]:[gold,rose,lilac,mint];
 model.barColors=[lilac,gold,rose];
 model.showBands=id==='leib'&&k===1;
 return model;
}
function tickValues([a,b],n){
 const rough=(b-a)/n,base=10**Math.floor(Math.log10(rough)),step=base*([1,2,2.5,5,10].find(t=>t>=rough/base)||10),ticks=[];
 for(let i=Math.ceil(a/step);i*step<=b+1e-9;i++)ticks.push(i*step);
 return ticks;
}
function svgChart(m){
 const W=540,H=290,L=42,R=23,T=m.marks.length?58:32,B=47,w=W-L-R,h=H-T-B;
 const X=t=>L+(t-m.x[0])/(m.x[1]-m.x[0])*w,Y=t=>T+(m.y[1]-t)/(m.y[1]-m.y[0])*h;
 const num=t=>Number.isFinite(t)?Math.max(-2000,Math.min(2000,t)).toFixed(2):'0';
 const pt=(t,y)=>num(X(t))+' '+num(Y(y));
 let grid='',art='',axis='';const z=Math.max(T,Math.min(H-B,Y(0)));
 for(const y of tickValues(m.y,4)){grid+='<path d="M'+L+' '+Y(y)+'h'+w+'"/><text x="'+(L-8)+'" y="'+(Y(y)+4)+'" text-anchor="end">'+fmt(y)+'</text>'}
 for(const t of tickValues(m.x,5)){grid+='<path d="M'+X(t)+' '+T+'v'+h+'"/><text x="'+X(t)+'" y="'+(H-27)+'" text-anchor="middle">'+fmt(t)+'</text>'}
 axis='<path d="M'+L+' '+z+'h'+w+' M'+X(Math.max(m.x[0],0))+' '+T+'v'+h+'" stroke="#a79dbd" opacity=".55"/>';
 for(const [fi,f] of m.fills.entries()){let coords=[],bottom=[];for(let i=0;i<=200;i++){let t=f.a+(f.b-f.a)*i/200,v=f.fn(t),u=f.low(t);if(Number.isFinite(v)&&Number.isFinite(u)){coords.push(pt(t,v));bottom.unshift(pt(t,u))}}if(coords.length)art+='<path d="M'+coords.concat(bottom).join(' L')+'Z" fill="'+f.color+'" opacity="'+(m.showBands&&fi>0?.52:.24)+'"/>'}
 // Place close boundaries in separate boxes, with leaders back to the true coordinates.
 const flags=m.marks.map((value,i)=>({actual:X(value),color:m.markColors[i],name:m.keys.marks[i]?.split(' · ')[0]||fmt(value)})).sort((a,b)=>a.actual-b.actual);
 let right=L-7;
 for(const flag of flags){
  flag.width=Math.max(25,flag.name.length*8+12);
  flag.center=Math.max(right+5+flag.width/2,Math.min(W-R-flag.width/2,flag.actual));
  right=flag.center+flag.width/2;
 }
 right=W-R;
 for(const flag of [...flags].reverse()){flag.center=Math.min(flag.center,right-flag.width/2);right=flag.center-flag.width/2-5}
 let labels='';
 for(const f of flags){
  art+='<path d="M'+f.actual+' '+T+'v'+h+'" stroke="'+f.color+'" stroke-width="1.8" stroke-dasharray="5 4"/>';
  labels+='<path d="M'+f.center+' '+(T-11)+' L'+f.actual+' '+T+'" stroke="'+f.color+'"/><rect x="'+(f.center-f.width/2)+'" y="'+(T-32)+'" width="'+f.width+'" height="21" rx="4" fill="'+f.color+'"/><text class="flagText" x="'+f.center+'" y="'+(T-16)+'" text-anchor="middle">'+escapeGraph(f.name)+'</text>';
 }
 for(const c of m.curves){let d='',on=false;for(let i=0;i<=380;i++){let t=m.x[0]+i*(m.x[1]-m.x[0])/380,v=c.fn(t);if(!Number.isFinite(v)){on=false;continue}d+=(on?' L':' M')+pt(t,v);on=true}art+='<path d="'+d+'" fill="none" stroke="'+c.color+'" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>'}
 for(const [i,[t,value]] of m.bars.entries())art+='<path d="M'+pt(t,0)+' L'+pt(t,value)+'" stroke="'+m.barColors[i]+'" stroke-width="8"/>';
 for(const [t,value,col] of m.points)if(Number.isFinite(value))art+='<circle cx="'+X(t)+'" cy="'+Y(value)+'" r="4.5" fill="'+col+'" stroke="'+(col==='#30253f'?mint:'#39304e')+'" stroke-width="2"/>';
 const axisNames='<text class="axisName" x="'+L+'" y="16">'+escapeGraph(m.keys.y)+'</text><text class="axisName" x="'+(W-R)+'" y="'+(H-3)+'" text-anchor="end">'+escapeGraph(m.keys.x)+'</text>';
 return '<svg role="img" aria-label="'+escapeGraph(m.caption)+'" viewBox="0 0 '+W+' '+H+'"><defs><clipPath id="graph-clip"><rect x="'+L+'" y="'+T+'" width="'+w+'" height="'+h+'"/></clipPath></defs><g class="grid">'+grid+'</g>'+axis+'<g clip-path="url(#graph-clip)">'+art+'</g>'+labels+axisNames+'</svg>';
}
