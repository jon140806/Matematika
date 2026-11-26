function practiceSeries56(term, limit, start) {
  return {
    slider:['Argument x',-.75,.75,.05,.4],
    make(x) {
      const partial=n=>{let s=0;for(let j=start;j<start+Math.floor(n);j++)s+=term(j,x);return s};
      const target=limit(x);
      const values=[0,target,...Array.from({length:20},(_,i)=>partial(i+1))];
      return seriesPracticeGraph([1,20],[Math.min(...values)-.2,Math.max(...values)+.2],'N · število členov','vsota',
        [line('Delna vsota',partial,mint),line('Vsota vrste',()=>target,gold)],
        'Pri x = '+fmt(x)+' je vsota '+fmt(target)+'.');
    }
  };
}
function radiusGraph56(term,ratio,bound,start){
  return {slider:['Razmerje x/R',-1.25,1.25,.05,.9],make(scale){
    const x=scale*bound;
    const a=n=>Math.abs(term(Math.floor(n),x));
    const ymax=Math.max(.05,...Array.from({length:15},(_,i)=>a(i+start)))*1.1;
    return seriesPracticeGraph([start,start+14],[0,ymax],'n · indeks','|aₙ|',
      [line('Velikost člena',a,mint)],'Pri x = '+fmt(x)+' je limita količnika '+fmt(ratio(x))+'. '+(Math.abs(scale)===1?'Na robu preveri vrsto posebej.':(Math.abs(scale)<1?'Vrsta konvergira absolutno.':'Vrsta divergira.')));
  }};
}
function numericGraph56(term,start,limit){
  return {slider:['Število členov N',1,24,1,4],make(n){
    const partial=t=>{let s=0;for(let j=start;j<start+Math.floor(t);j++)s+=term(j);return s};
    const ys=Array.from({length:24},(_,j)=>partial(j+1));
    return seriesPracticeGraph([1,24],[Math.min(limit,...ys)-.1,Math.max(limit,...ys)+.1],'N · število členov','vsota',
      [line('Delna vsota',partial,mint),line('Vsota vrste',()=>limit,gold)],'Po '+n+' členih je delna vsota '+fmt(partial(n))+'.',{points:[[n,partial(n),rose]]});
  }};
}
const vajePlots56={
  v56radA:radiusGraph56((n,x)=>(-x)**n/(3**n+n),x=>Math.abs(x)/3,3,1),
  v56radB:radiusGraph56((n,x)=>2**(n-1)*x**n/(n*n-1),x=>2*Math.abs(x),.5,2),
  v56radC:radiusGraph56((n,x)=>(2*x*x)**n/(n*n+1),x=>2*x*x,1/Math.sqrt(2),2),
  v56numC:numericGraph56(n=>n*2**(1-n),1,4),
  v56numD:numericGraph56(n=>(2*n-1)/2**n,1,3),
  v56numB:numericGraph56(n=>(-1)**n/((2*n+1)*3**n),0,Math.sqrt(3)*Math.PI/6),
  v56plus:practiceSeries56((n,x)=>(n+1)*x**n,x=>1/(1-x)**2,0),
  v56square:practiceSeries56((n,x)=>n*n*x**n,x=>x*(1+x)/(1-x)**3,1),
  v56log:practiceSeries56((n,x)=>x**n/n,x=>-Math.log(1-x),1),
  v56tel:{slider:['Število členov N',1,20,1,4],make(n){
    const s=t=>1-1/(Math.floor(t)+1);
    return seriesPracticeGraph([1,20],[0,1.12],'N · število členov','vsota',
      [line('Delna vsota',s,mint),line('Limita',()=>1,gold)],
      'Po '+n+' členih manjka do 1 še '+fmt(1/(n+1))+'.',{points:[[n,s(n),rose]]});
  }},
  v56exp:{slider:['Število členov',1,7,1,2],make(n){
    const p=x=>{let s=1,t=1;for(let j=1;j<n;j++){t*=x*x/j;s+=t}return s};
    return seriesPracticeGraph([-1.4,1.4],[0,7.5],'x','y(x)',
      [line('Rešitev pri C = 1',x=>Math.exp(x*x),gold),line('Delna vsota',p,mint)],
      'Pri x = 1 ima približek vrednost '+fmt(p(1))+', rešitev pa '+fmt(Math.E)+'.');
  }},
  v56odd:{slider:['Koeficient B',-2,2,.1,1],make(b){
    const even=x=>1-x/2*Math.log((1+x)/(1-x));
    return seriesPracticeGraph([-.95,.95],[-3,3],'x','y(x)',
      [line('Soda veja · A = 1',even,lilac),line('Liha veja · Bx',x=>b*x,gold),line('Vsota obeh vej',x=>even(x)+b*x,mint)],
      'Višina pri x = 0 je A = 1, naklon tam pa B = '+fmt(b)+'.');
  }}
};
