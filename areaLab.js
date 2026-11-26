// All selectable arguments are positive integers or half-integers.
function halfIntegerGamma(p){
 let value=1;
 while(p>1){p-=1;value*=p}
 return p===.5?value*Math.sqrt(Math.PI):value;
}

function areaLab(id){
 const gamma=id==='gamma';
 const control=(key,label,min,max,step,value)=>'<div class="sliderbox"><label for="lab-'+key+'">'+label+'<output for="lab-'+key+'"></output></label><input id="lab-'+key+'" data-key="'+key+'" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'"></div>';
 return '<div class="areaLab plot" data-lab="'+id+'"><div class="plotHead">'+(gamma?'Gama · ploščina na poltraku':'Beta · ploščina med dvema robovoma')+'</div><div class="drawing"></div><div class="legend"></div>'+
  control('p',gamma?'p · oblika krivulje':'p · potenca pri levem robu',1,4,.5,gamma?3:2)+
  (gamma?'':control('q','q · potenca pri desnem robu',1,4,.5,3))+
  control('cut',gamma?'R · do kod seštevaš':'z · do kod seštevaš',0,gamma?10:1,gamma?.1:.01,gamma?3:.5)+
  '<p class="labResult"></p></div>';
}

function drawAreaLab(panel){
 const values={};
 for(const input of panel.querySelectorAll('input')){
  const value=Number(input.value);
  values[input.dataset.key]=value;
  input.previousElementSibling.querySelector('output').textContent=fmt(value);
 }
 const {p,q,cut}=values,gamma=panel.dataset.lab==='gamma',end=gamma?10:1;
 const kernel=gamma?x=>x**(p-1)*Math.exp(-x):x=>x**(p-1)*(1-x)**(q-1);
 const total=gamma?halfIntegerGamma(p):halfIntegerGamma(p)*halfIntegerGamma(q)/halfIntegerGamma(p+q);
 // A sine-squared substitution smooths half-integer powers at both endpoints.
 const n=100,angle=Math.PI/(2*n);
 let quadrature=0;
 for(let i=1;i<n;i++){
  const t=i*angle,x=cut*Math.sin(t)**2;
  quadrature+=(i%2?4:2)*kernel(x)*cut*Math.sin(2*t);
 }
 const partial=angle*quadrature/3;
 const peak=gamma?kernel(p-1):kernel(p+q===2?.5:(p-1)/(p+q-2));
 const symbol=gamma?'Γ('+fmt(p)+')':'B('+fmt(p)+', '+fmt(q)+')';
 const format=n=>n.toLocaleString('sl-SI',{maximumFractionDigits:4});
 const result='Do oznake: '+format(partial)+' od '+format(total)+' ('+fmt(100*partial/total)+' %).';
 const model={x:[0,end],y:[0,peak*1.15],curves:[line('višina',kernel)],fills:[fill(kernel,0,cut,mint),fill(kernel,cut,end,lilac)],marks:[cut],points:[[cut,kernel(cut),gold]],bars:[],markColors:[gold],keys:{x:gamma?'x · položaj na poltraku':'u · lega med robovoma',y:'višina podintegralske funkcije',marks:[gamma?'R':'z']},caption:result};
 panel.querySelector('.drawing').innerHTML=svgChart(model).replaceAll('graph-clip','area-lab-clip');
 panel.querySelector('.legend').innerHTML='<span class="graphKey areaKey" style="--key:'+mint+'"><i></i>sešteta ploščina</span><span class="graphKey areaKey" style="--key:'+lilac+'"><i></i>'+(gamma?'vidni del preostanka':'preostanek do 1')+'</span>';
 panel.querySelector('.labResult').textContent=result+(gamma?' Krivulja se nadaljuje čez x = 10.':'');
 const kernelText=gamma?'xᵖ⁻¹ · e⁻ˣ':'uᵖ⁻¹ · (1−u)ᑫ⁻¹';
 const pow=(base,power)=>power===0?'1':power===1?base:base+'<sup>'+fmt(power)+'</sup>';
 const formula=panel.closest('.intuitionLab').querySelector('.labCalculation');
 const read=gamma?'Pri '+pow('x',p-1)+' · e<sup>−x</sup> je eksponent pri x enak '+fmt(p-1)+'. Prištej 1 in dobiš p = '+fmt(p)+'.':
  'Pri '+pow('u',p-1)+' · '+pow('(1 − u)',q-1)+' sta eksponenta '+fmt(p-1)+' in '+fmt(q-1)+'. Vsakemu prištej 1: p = '+fmt(p)+', q = '+fmt(q)+'.';
 const chain=[];
 if(gamma){
  const factors=[];
  for(let a=p;a>1;a--){factors.push(fmt(a-1));chain.push(factors.join(' · ')+' · Γ('+fmt(a-1)+')')}
 }
 const calculation=gamma?symbol+(chain.length?' = '+chain.join(' = '):'')+(p%1?' = '+(p>1?format(halfIntegerGamma(p)/Math.sqrt(Math.PI))+' · ':'')+'√π':'') :
  symbol+' = Γ('+fmt(p)+') · Γ('+fmt(q)+') / Γ('+fmt(p+q)+')'+(Number.isInteger(p)&&Number.isInteger(q)?' = ':' ≈ ')+format(halfIntegerGamma(p))+' · '+format(halfIntegerGamma(q))+' / '+format(halfIntegerGamma(p+q));
 formula.innerHTML='<p class="kernelLabel">Višina traku: '+kernelText+'</p><p>'+read+'</p><div class="labEquation">'+calculation+(gamma&&p%1===0?' = ':' ≈ ') +format(total)+'</div><p>'+(gamma?'Začni pri Γ(1) = 1 ali Γ(½) = √π. Dobljeno število meri celotno ploščino od 0 do ∞.':'Vstavi vrednosti gama v števec in imenovalec. Dobljeno število meri celotno ploščino od 0 do 1.')+'</p>';
}
