function seriesPracticeGraph(x,y,xName,yName,curves,caption,extra={}) {
  const {marks=[],markNames=[],points=[],fills=[],areas=[]}=extra;
  return {x,y,curves,caption,marks,points,fills,
    keys:{x:xName,y:yName,curves:curves.map(curve=>curve.name),marks:markNames,areas}};
}

const practicePlots56={
  legHomework:{
    slider:['Koeficient B',-2,2,.1,1],
    make(b) {
      const shape=x=>.5*b*Math.log((1+x)/(1-x));
      return seriesPracticeGraph([-.94,.94],[-4,4],'x','y(x)',
        [line('Logaritemska veja · A = 0',shape,mint)],
        'B = '+fmt(b)+' določa naklon pri ničli. Pri B = 0 ostane konstantna rešitev y = A.');
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
  odeRec:{
    slider:['Stopnja polinoma',0,8,2,4],
    make(degree) {
      const polynomial=x=>{
        let term=1,total=1;
        for(let k=2;k<=degree;k+=2){term*=-x*x/(k*(k-1));total+=term;}
        return total;
      };
      return seriesPracticeGraph([-1.2,1.2],[-2.1,1.25],'x','y · odmik',
        [line('cos x · soda veja',Math.cos,gold),line('Taylorjev polinom',polynomial,mint)],
        'Polinom stopnje '+degree+' ima pri x = 1 vrednost '+fmt(polynomial(1))+'. Vsak naslednji sodi člen popravi približek.',
        {points:[[0,1,mint]]});
    }
  }
};
