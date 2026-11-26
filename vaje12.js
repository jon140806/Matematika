const vajePlots12 = {
  vSin1: {
    slider: ['Frekvenca y', .1, 3, .05, 1],
    make(y) {
      return integralWindow12({x:[0,2.1], y:[-1.1,1.1], fn:x=>Math.cos(x*y), curve:'cos(xy)', area:'notranji odvod', start:1, end:2, marks:[1,2], names:['1','2'], vertical:'odvod integranda',
        caption:'Predznačena ploščina od 1 do 2 je G′(y) = '+fmt((Math.sin(2*y)-Math.sin(y))/y)+'.'});
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
  },
  vArcHalf: {
    slider:['Parameter t',.5,3,.05,1],
    make(t) {
      return integralWindow12({x:[0,t/2],y:[0,2.4],fn:x=>1/Math.sqrt(t*t-x*x),curve:'1/√(t²−x²)',area:'F(t)',start:0,end:t/2,caption:'Ko t naraste, postane interval širši, krivulja pa nižja. Ploščina je vedno π/6.'});
    }
  },
  vArcDiff: {
    slider:['Parameter t',.5,3,.05,1],
    make(t) {
      return integralWindow12({x:[0,t/2],y:[0,1.6/(t*t)],fn:x=>t/(t*t-x*x)**1.5,curve:'−∂f/∂t',area:'velikost notranjega prispevka',start:0,end:t/2,caption:'Notranji člen ima minus. Velikost ploščine '+fmt(1/(Math.sqrt(3)*t))+' je enaka pozitivnemu prispevku zgornjega roba.'});
    }
  },
  vRatDiff: {
    slider:['Zgornja meja z',0,4,.05,1],
    make(z) {
      return integralWindow12({x:[0,4],y:[0,1.1],fn:x=>1/(1+x*x)**2,curve:'1/(1+x²)²',area:'iskani integral',start:0,end:z,marks:[z],names:['z'],caption:'Do izbrane meje je ploščina '+fmt((Math.atan(z)+z/(1+z*z))/2)+'.'});
    }
  },
  vHalfN: {
    slider:['Število znižanj n',0,5,1,1],
    make(n) {
      const height=t=>2*t**(2*n)*Math.exp(-t*t);
      const top=n===0?2:height(Math.sqrt(n));
      return integralWindow12({x:[0,5],y:[0,top*1.1],fn:height,curve:'2t²ⁿ exp(−t²)',area:'del integrala gama',axis:'t',start:0,end:5,caption:'Po menjavi x = t² meri Γ(n + ½) celotno ploščino do neskončnosti. Graf kaže del do t = 5.'});
    }
  },
  vCosN: {
    slider:['Potenca n',0,8,1,3],
    make(n) {
      return integralWindow12({x:[0,Math.PI],y:[-1.1,1.1],fn:x=>Math.cos(x)**n,curve:'cosⁿ φ',area:'predznačena ploščina',axis:'φ (rad)',start:0,end:Math.PI,marks:[Math.PI/2],names:['π/2'],caption:n%2?'Lihi n: desna polovica ima nasprotni predznak. Vsota je nič.':'Sodi n: polovici imata enako pozitivno ploščino.'});
    }
  }
};
