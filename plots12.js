// Each model shows the interval and parameters used in its own exercise.
function integralWindow12({x,y,fn,curve,area,start,end,marks=[],names=[],caption,axis='x',vertical='višina integranda'}) {
  return {
    x, y, label:axis, curves:[line(curve,fn,mint)], fills:[fill(fn,start,end,lilac)],
    marks, points:marks.map((value,i)=>[value,fn(value),i===0?gold:rose]), bars:[], markColors:[gold,rose],
    barColors:[], caption, keys:{x:axis,y:vertical,curves:[curve],areas:[area],marks:names,bars:[]}
  };
}
const practicePlots12={
  lowerGaussian:{
    slider:['Parameter a',.05,.95,.05,.5],
    make(a){
      const left=a*a;
      return integralWindow12({x:[0,2.15],y:[0,1.1],fn:x=>Math.exp(-x*x),curve:'zvon exp(−x²)',area:'F(a) · preostala ploščina',
        start:left,end:2,marks:[left,2],names:['a²','2'],caption:'Levi rob je pri '+fmt(left)+'. Višina na njem je '+fmt(Math.exp(-left*left))+', hitrost roba pa '+fmt(2*a)+'.'});
    }
  },
  twoCosEdges:{
    slider:['Parameter a',.05,.95,.05,.5],
    make(a){
      const f=x=>Math.cos(x*x);
      return integralWindow12({x:[0,2],y:[-1.1,1.1],fn:f,curve:'cos(x²)',area:'G(a) · predznačena ploščina',
        start:a,end:2*a,marks:[a,2*a],names:['a','2a'],caption:'Desni rob prispeva '+fmt(2*f(2*a))+', levi '+fmt(-f(a))+'. Skupaj G′(a) ≈ '+fmt(2*f(2*a)-f(a))+'.'});
    }
  },
  edgeDensity:{
    slider:['Parameter a',.2,1.5,.05,.8],
    make(a){
      return integralWindow12({x:[0,3.1],y:[0,6],fn:x=>1+a*x,curve:'f(x,a) = 1+ax',area:'M(a) · ploščina pod premico',
        start:a,end:2*a,marks:[a,2*a],names:['a','2a'],caption:'Notranjost +'+fmt(1.5*a*a)+', desni rob +'+fmt(2+4*a*a)+', levi rob −'+fmt(1+a*a)+'.'});
    }
  },
  narrowGaussian:{
    slider:['Frekvenca b',0,8,.1,3],
    make(b){
      const envelope=x=>Math.exp(-4*x*x);
      const m=integralWindow12({x:[0,2],y:[-1.08,1.08],fn:x=>envelope(x)*Math.cos(b*x),curve:'exp(−4x²) cos(bx)',
        area:'del J(b) do x = 2',start:0,end:2,caption:'Pri b = '+fmt(b)+' je celoten integral J(b) ≈ '+fmt(Math.sqrt(Math.PI)/4*Math.exp(-b*b/16))+'.'});
      m.curves.push(line('zgornja ovojnica',envelope,gold),line('spodnja ovojnica',x=>-envelope(x),rose));
      m.keys.curves.push('+exp(−4x²)','−exp(−4x²)');
      return m;
    }
  },
  scaledGamma:{
    slider:['Dušenje λ',1,2.5,.1,2],
    make(lambda){
      return integralWindow12({x:[0,10],y:[0,1.5],fn:x=>x**3*Math.exp(-lambda*x),curve:'x³ exp(−λx)',area:'del integrala do x = 10',
        start:0,end:10,caption:'Pri λ = '+fmt(lambda)+' je celotna ploščina 6/λ⁴ ≈ '+fmt(6/lambda**4)+'.'});
    }
  },
  trigBeta:{
    slider:['Kot θ v stopinjah',0,90,1,60],
    make(degrees){
      const t=degrees*Math.PI/180;
      return integralWindow12({x:[0,Math.PI/2],y:[0,.16],fn:x=>Math.sin(x)**4*Math.cos(x)**2,curve:'sin⁴(t) cos²(t)',area:'ploščina do izbranega kota',
        start:0,end:t,marks:[t],names:['θ'],axis:'t (rad)',caption:'θ = '+fmt(degrees)+'° = '+fmt(t)+' rad. Pri zamenjavi je nova meja u = sin²(θ) ≈ '+fmt(Math.sin(t)**2)+'.'});
    }
  },
  rationalBeta:{
    slider:['Rez poltraka R',.5,12,.5,3],
    make(r){
      const u=r/(1+r);
      return integralWindow12({x:[0,1],y:[0,.16],fn:x=>x*x*(1-x),curve:'u²(1−u)',area:'prenesena ploščina do u(R)',
        start:0,end:u,marks:[u],names:['u(R)'],axis:'u · nova spremenljivka',caption:'Rezu R = '+fmt(r)+' ustreza u = R/(1+R) ≈ '+fmt(u)+'. Z večjim R se meja bliža 1.'});
    }
  },
  betaRange:{
    slider:['Eksponent p',-.5,4,.1,2],
    make(p){
      const f=x=>Math.pow(x,p-1)/Math.pow(1+x,3);
      const detail=p<=0?'Pri 0 integral divergira.':p>=3?'Pri ∞ integral divergira.':'Oba konca sta integrabilna.';
      return integralWindow12({x:[.1,8],y:[0,Math.max(.5,1.04*f(.1),1.04*f(8))],fn:f,curve:'x^(p−1)/(1+x)³',area:'ploščina le od 0,1 do 8',
        start:.1,end:8,caption:'Pri 0 je eksponent '+fmt(p-1)+', pri ∞ pa '+fmt(p-4)+'. '+detail});
    }
  }
};
