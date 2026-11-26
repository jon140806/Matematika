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
const vajePlots56={
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
  v56odd:{slider:['Točka x',-.95,.95,.05,.4],make(x){
    return seriesPracticeGraph([-1,1],[-1.2,1.2],'x','y(x)',[line('Liha veja y = x',t=>t,mint)],
      'Pri x = '+fmt(x)+' je odmik '+fmt(x)+' in naklon 1.',{points:[[x,x,gold]]});
  }},
  v56rod:{slider:['Točka x',-1,1,.05,.5],make(x){
    const p=t=>(3*t*t-1)/2;
    return seriesPracticeGraph([-1,1],[-.7,1.2],'x','P₂(x)',[line('Drugi Legendrov polinom',p,mint)],
      'Pri x = '+fmt(x)+' je drugi odvod '+fmt(12*x*x-4)+'. Po deljenju z 8 dobiš '+fmt(p(x))+'.',
      {points:[[x,p(x),gold]]});
  }},
  v56norm:{slider:['Zgornja meja b',-1,1,.05,1],make(b){
    const f=x=>x*x;
    return seriesPracticeGraph([-1,1],[0,1.15],'x','kvadrat P₁(x)',[line('x²',f,mint)],
      'Integral od −1 do '+fmt(b)+' je '+fmt((b**3+1)/3)+'. Pri b = 1 dobiš kvadrat norme.',
      {fills:[fill(f,-1,b,lilac)],areas:['Prispevek do b']});
  }}
};
