// Each model shows the interval and parameters used in its own exercise.
function integralWindow12({x,y,fn,curve,area,start,end,marks=[],names=[],caption,axis='x',vertical='višina integranda'}) {
  return {
    x, y, label:axis, curves:[line(curve,fn,mint)], fills:[fill(fn,start,end,lilac)],
    marks, points:marks.map((value,i)=>[value,fn(value),i===0?gold:rose]), bars:[], markColors:[gold,rose],
    barColors:[], caption, keys:{x:axis,y:vertical,curves:[curve],areas:[area],marks:names,bars:[]}
  };
}
const practicePlots12={
  polyTwoDerivatives:{
    slider:['Parameter y',-1,1,.05,.25],
    make(y){
      return integralWindow12({x:[0,2],y:[0,50],fn:x=>(x*x+3*y)**2,curve:'(x² + 3y)²',
        area:'F(y) · ploščina na [0, 2]',start:0,end:2,marks:[0,2],names:['0','2'],
        caption:'Pri y = '+fmt(y)+' se ploščina spreminja s hitrostjo F′(y) = '+fmt(16+36*y)+'.'});
    }
  },
  betaHalfArgument:{
    slider:['Celo število n',1,6,1,2],
    make(n){
      return integralWindow12({x:[0,1],y:[0,.42],fn:u=>u*(1-u)**(n-.5),curve:'u (1 − u)ⁿ⁻½',
        area:'B(2, n + ½) · celotna ploščina',start:0,end:1,axis:'u',
        caption:'Pri n = '+fmt(n)+' je ploščina 4 / ('+fmt(2*n+1)+' · '+fmt(2*n+3)+') ≈ '+fmt(4/((2*n+1)*(2*n+3)))+'.'});
    }
  }
};
