function vaja34Curve({variable, name, domain, range, value, fn, at}) {
  return {
    slider:[variable, domain[0], domain[1], .05, value],
    make(v) {
      return markedPracticeCurve34(domain, range, variable, name, [line(name,fn,mint)], v,
        at+' = '+fmt(v)+' · '+name+' = '+fmt(fn(v))+'.');
    }
  };
}

const vajePlots34={
  v34exp:vaja34Curve({variable:'s · parameter',name:'G(s)',domain:[2.2,6],range:[0,17],value:3,
    fn:s=>3/(s-2)+4/(s+3),at:'s'}),
  v34cos:vaja34Curve({variable:'t · čas',name:'m(t)',domain:[0,5],range:[-.65,1.1],value:1,
    fn:t=>Math.exp(-t)*Math.cos(4*t),at:'t'}),
  v34inv:vaja34Curve({variable:'t · čas',name:'g(t)',domain:[0,5],range:[-4,4],value:1,
    fn:t=>3*Math.cos(2*t)+2*Math.sin(2*t),at:'t'}),
  v34tcos:{
    slider:['Frekvenca a',0,4,.05,1],
    make(a){
      const fn=t=>t*Math.cos(a*t);
      return {x:[0,4],y:[-4.3,4.3],fills:[],marks:[],points:[],curves:[line('t cos(at)',fn,mint),line('t',t=>t,lilac),line('−t',t=>-t,gold)],
        keys:{x:'t · čas',y:'t cos(at)',curves:['t cos(at)','t','−t'],marks:[],areas:[]},caption:a===0?'Pri a = 0 je kosinus enak 1, zato signal sovpada s premico t.':'Pri a = '+fmt(a)+' je signal omejen s premicama −t in t.'};
    }
  },
  v34sinconv:vaja34Curve({variable:'t · čas',name:'(f ∗ g)(t)',domain:[0,6],range:[-1.1,1.1],value:1,
    fn:t=>.6*Math.sin(2*t)-.4*Math.sin(3*t),at:'t'}),
  v34three:vaja34Curve({variable:'x · čas',name:'konvolucija',domain:[0,3],range:[-.3,7.4],value:1,
    fn:x=>Math.sinh(x)-x,at:'x'}),
  v34steps:vaja34Curve({variable:'t · čas',name:'f(t)',domain:[0,10],range:[0,11],value:5,
    fn:t=>t<4?2:t<6?10:t<8?5:1,at:'t'}),
  v34sineon:vaja34Curve({variable:'t · čas',name:'h(t) − t³',domain:[0,40],range:[-2,4.4],value:10,
    fn:t=>t<5?0:4*Math.sin((t-5)/10),at:'t'})
};
