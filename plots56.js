function seriesPracticeGraph(x,y,xName,yName,curves,caption,extra={}) {
  const {marks=[],markNames=[],points=[],fills=[],areas=[]}=extra;
  return {x,y,curves,caption,marks,points,fills,
    keys:{x:xName,y:yName,curves:curves.map(curve=>curve.name),marks:markNames,areas}};
}

const practicePlots56={
  shiftRadius:{
    slider:['Zadnji indeks N',1,24,1,8],
    make(n) {
      const left=k=>sum(Math.floor(k),j=>(-1)**j/j,1);
      const right=k=>sum(Math.floor(k),j=>1/j,1);
      return seriesPracticeGraph([1,24],[-1.15,4],'N · zadnji indeks','Sᴺ · delna vsota',
        [line('x = −1 · izmenična',left,mint),line('x = 5 · harmonična',right,lilac)],
        'Pri N = '+n+' je leva vsota '+fmt(left(n))+', desna pa '+fmt(right(n))+'.',
        {marks:[n],markNames:['N'],points:[[n,left(n),mint],[n,right(n),lilac]]});
    }
  },
  diffGeom:{
    slider:['Vrednost x',0,.75,.05,.25],
    make(v) {
      const partial=n=>sum(Math.floor(n),j=>j*v**j,1);
      const limit=v/(1-v)**2;
      return seriesPracticeGraph([1,20],[-.04,Math.max(.2,limit*1.1)],'N · število členov','vsota',
        [line('Sᴺ · delna vsota',partial,mint),line('x/(1−x)² · limita',()=>limit,gold)],
        'Pri x = '+fmt(v)+' se delne vsote približujejo '+fmt(limit)+'.');
    }
  },
  atanSeries:{
    slider:['Število členov N',1,6,1,2],
    make(n) {
      const approx=x=>sum(n-1,k=>(-1)**k*x**(2*k+1)/(2*k+1));
      return seriesPracticeGraph([0,.9],[0,.95],'x · zgornja meja','vrednost',
        [line('arctan x',Math.atan,gold),line('Sᴺ · približek',approx,mint)],
        'Pri x = 0,5 in '+n+' členih je absolutna napaka '+Math.abs(approx(.5)-Math.atan(.5)).toExponential(2).replace('.',',')+'.',
        {marks:[.5],markNames:['x = ½'],points:[[.5,approx(.5),mint]]});
    }
  },
  uniformEdge:{
    slider:['Zadnji indeks N',0,30,1,5],
    make(n) {
      const edge=.5**(1/(n+1));
      const tail=x=>x<1?x**(n+1):NaN;
      return seriesPracticeGraph([0,1],[0,1.06],'x · točka intervala','Rᴺ · napaka',
        [line('Rᴺ(x) = xᴺ⁺¹',tail,mint),line('Napaka ½',()=>.5,gold)],
        'Pri xₙ ≈ '+fmt(edge)+' je napaka vedno ½. Točka 1 je izključena.',
        {marks:[edge],markNames:['xₙ'],points:[[edge,.5,mint]]});
    }
  },
  geomError:{
    slider:['Zadnji indeks N',1,8,1,4],
    make(n) {
      const tail=x=>x**(n+1)/(1-x);
      return seriesPracticeGraph([0,.5],[0,Math.max(.05,1.08*tail(.5))],'x','Rᴺ · napaka',
        [line('Rep geometrijske vrste',tail,mint),line('1/32 · dovoljena napaka',()=>1/32,gold)],
        'Pri x = ½ je rep 1/'+2**n+'. '+(n>=5?'Ves interval je znotraj dovoljene napake.':'Na desnem robu je napaka še prevelika.'),
        {points:[[.5,tail(.5),mint]]});
    }
  },
  odeRec:{
    slider:['Stopnja polinoma',0,8,2,4],
    make(degree) {
      const polynomial=x=>{
        let term=1,total=1;
        for(let k=2;k<=degree;k+=2){term*=-4*x*x/(k*(k-1));total+=term;}
        return total;
      };
      return seriesPracticeGraph([-1.2,1.2],[-2.1,1.25],'x','y · odmik',
        [line('cos(2x) · rešitev',x=>Math.cos(2*x),gold),line('Taylorjev polinom',polynomial,mint)],
        'Polinom stopnje '+degree+' ima pri x = 1 vrednost '+fmt(polynomial(1))+'. Vsak naslednji sodi člen popravi približek.',
        {points:[[0,1,mint]]});
    }
  },
  eulerRoots:{
    slider:['Spodnja meja prikaza',.1,.8,.05,.4],
    make(a) {
      const grow=x=>1/(x*x);
      return seriesPracticeGraph([a,1],[0,1.08*Math.max(3,grow(a))],'x > 0','vrednost',
        [line('3x² · izbrana rešitev',x=>3*x*x,mint),line('x⁻² · singularna veja',grow,lilac)],
        'Pri x = '+fmt(a)+' je x⁻² = '+fmt(grow(a))+'. S premikom leve meje proti 0 vidiš rast singularne veje.',
        {points:[[a,grow(a),lilac],[1,3,mint]]});
    }
  },
  legOdd:{
    slider:['Položaj x',-1,1,.05,.5],
    make(v) {
      const polynomial=x=>(5*x**3-3*x)/2;
      return seriesPracticeGraph([-1,1],[-1.2,1.2],'x','P₃ · vrednost',
        [line('P₃(x)',polynomial,mint)],
        'Pri x = '+fmt(v)+' je P₃(x) = '+fmt(polynomial(v))+'. V zrcalni točki ima nasprotno vrednost.',
        {points:[[v,polynomial(v),mint],[-v,polynomial(-v),lilac]]});
    }
  },
  weightZero:{
    slider:['Števec k pri c = k/12',0,12,1,6],
    make(k) {
      const c=k/12,product=x=>2*x*(x-c);
      return seriesPracticeGraph([0,1],[-.6,2.1],'x','2x(x−c) · uteženi produkt',
        [line('2x(x−c)',product,mint)],
        'Pri c = '+k+'/12 je skalarni produkt '+(8-k)+'/12.'+(k===8?' Ploščini sta enako veliki.':''),
        {fills:[fill(product,0,c,lilac),fill(product,c,1,gold)],areas:['Negativni prispevek','Pozitivni prispevek']});
    }
  },
  sliceData:{
    slider:['Prerez pri y',-1,1,.1,.5],
    make(v) {
      const field=x=>v*x*x+(1-v)*x+v*v;
      const tangent=x=>(1-v)*x+v*v;
      return seriesPracticeGraph([-1,1],[-2.2,3.4],'x · položaj v prerezu','u · višina',
        [line('u(x,y) · prerez',field,mint),line('Tangenta pri x = 0',tangent,lilac)],
        'Pri y = '+fmt(v)+' je začetna višina '+fmt(v*v)+' in naklon '+fmt(1-v)+'.',
        {marks:[0],markNames:['x = 0'],points:[[0,v*v,mint]]});
    }
  }
};
