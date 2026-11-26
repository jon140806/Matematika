const vajePlots12 = {
  vSin1: {
    slider: ['Frekvenca y', .1, 3, .05, 1],
    make(y) {
      return integralWindow12({x:[0,2.1], y:[-1.1,1.1], fn:x=>Math.cos(x*y), curve:'cos(xy)', area:'notranji odvod', start:1, end:2, marks:[1,2], names:['1','2'], vertical:'odvod integranda',
        caption:'Predznačena ploščina od 1 do 2 je G′(y) = '+fmt((Math.sin(2*y)-Math.sin(y))/y)+'.'});
    }
  },
  vSin2: {
    slider: ['Točka y', .2, 3, .05, 1],
    make(v) {
      const first = y=>(Math.sin(2*y)-Math.sin(y))/y;
      const slope = (v*(2*Math.cos(2*v)-Math.cos(v))-Math.sin(2*v)+Math.sin(v))/(v*v);
      return {x:[.1,3.1], y:[-2.2,2.1], fills:[],curves:[line('G′',first,mint),line('tangenta',y=>first(v)+slope*(y-v),gold)], marks:[v], points:[[v,first(v),gold]], keys:{x:'y',y:'G′(y)',curves:['G′','tangenta'],marks:['y']},caption:'Naklon tangente je drugi odvod G″(y) = '+fmt(slope)+'.'};
    }
  },
  vSin3: {
    slider: ['Parameter y', .4, 2.2, .05, 1.5],
    make(y) {
      const a=2*y,b=y*y;
      return integralWindow12({x:[0,5],y:[-1,2.3],fn:x=>x===0?y:Math.sin(x*y)/x,curve:'sin(xy)/x',area:'integracijski interval',start:Math.min(a,b),end:Math.max(a,b),marks:[a,b],names:['2y · začetek','y² · konec'],caption:'Integriraš od '+fmt(a)+' do '+fmt(b)+'. '+(a>b?'Smer integracije je od desne proti levi.':a===b?'Meji sovpadeta.':'Smer integracije je od leve proti desni.')});
    }
  },
  vRational: {
    slider:['Parameter y',.25,4,.05,1],
    make(y) {
      return integralWindow12({x:[0,2.2],y:[0,4.1],fn:x=>1/(x*x+y),curve:'1/(x² + y)',area:'F(y) pri z = 2',start:0,end:2,marks:[0,2],names:['0','z = 2'],caption:'Pri z = 2 je ploščina '+fmt(Math.atan(2/Math.sqrt(y))/Math.sqrt(y))+'.'});
    }
  },
  vHalf: {
    slider:['Zgornji kot θ',0,Math.PI/2,.01,1],
    make(v) {
      return integralWindow12({x:[0,Math.PI/2],y:[0,2.1],fn:x=>2*Math.cos(x)**2,curve:'2 cos² θ',area:'del beta integrala',axis:'θ (rad)',start:0,end:v,caption:'Po menjavi u = sin² θ je višina 2 cos² θ. Do kota θ je ploščina '+fmt(v+Math.sin(2*v)/2)+'; do π/2 je enaka π/2.'});
    }
  },
  vInt: {
    slider:['Celi argument m',1,7,1,3],
    make(m) {
      return integralWindow12({x:[0,1],y:[0,1.05],fn:u=>u**(m-1)*(1-u),curve:'uᵐ⁻¹(1 − u)',area:'B(m, 2)',axis:'u',start:0,end:1,caption:'Pri n = 2 je ploščina (m − 1)!/(m + 1)! = '+fmt(1/(m*(m+1)))+'.'});
    }
  },
  vTrig: {
    slider:['Eksponent α',0,6,.1,1],
    make(a) {
      return integralWindow12({x:[0,Math.PI/2],y:[0,1.05],fn:x=>Math.sin(x)**a*Math.cos(x),curve:'sinᵅ x · cos x',area:'polovica beta',axis:'x (rad)',start:0,end:Math.PI/2,caption:'Pri β = 1 je ploščina ½ B((α + 1)/2, 1) = '+fmt(1/(1+a))+'.'});
    }
  },
  vCube: {
    slider:['Zgornja meja x',0,1,.01,1],
    make(v) {
      return integralWindow12({x:[0,1],y:[0,.28],fn:x=>x**8*Math.sqrt(Math.max(0,1-x**3)),curve:'x⁸ √(1 − x³)',area:'prvotni integral do x',start:0,end:v,marks:[v],names:['x'],caption:'Pri meji x = '+fmt(v)+' je nova meja u = x³ = '+fmt(v**3)+'. Ko x doseže 1, ima celotna ploščina vrednost 16/315.'});
    }
  }
};
