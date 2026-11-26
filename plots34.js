function markedPracticeCurve34(x, y, xName, yName, curves, at, caption) {
  return {
    x, y, curves, fills: [], marks: [at],
    points: [[at, curves[0].fn(at), mint]],
    keys: {x: xName, y: yName, curves: curves.map(c => c.name), areas: [], marks: [xName.split(' · ')[0]]},
    caption
  };
}

const practicePlots34 = {
  izvirniInverz34: {
    slider: ['Čas t', 0, 4, 0.05, 0.8],
    make(t) {
      const cosine = u => 3*Math.exp(-u)*Math.cos(u);
      const sine = u => -3*Math.exp(-u)*Math.sin(u);
      const total = u => cosine(u)+sine(u);
      return markedPracticeCurve34([0,4], [-1.4,3.3], 't · čas', 'h · signal',
        [line('h · vsota',total,mint), line('kosinusni člen',cosine,lilac), line('sinusni člen',sine,gold)], t,
        'Pri t = '+fmt(t)+' seštej oba prispevka: '+fmt(cosine(t))+' + ('+fmt(sine(t))+') = '+fmt(total(t))+'.');
    }
  },
  izvirnaVolterra34: {
    slider: ['Frekvenca jedra a', 0.5, 2.5, 0.05, 1],
    make(a) {
      const b = 2;
      const base = a*a/b;
      const amplitude = b-base;
      const input = t => base+amplitude*Math.cos(b*t);
      return {
        x:[0,5], y:[-2,4.7], fills:[], marks:[], points:[],
        curves:[line('y(t) · vhod',input,mint),line('a²/b · stalni člen',()=>base,lilac)],
        keys:{x:'t · čas',y:'y · vhod',curves:['y(t) · vhod','a²/b · sredina'],areas:[],marks:[]},
        caption:'Na grafu je b = 2. Pri a = '+fmt(a)+' je koeficient kosinusa '+fmt(amplitude)+'. '+
          (Math.abs(amplitude)<1e-9?'Ob enakih frekvencah je vhod povsod 2.':'Nastavi a na 2 in opazuj, kdaj nihanje izgine.')
      };
    }
  }
};
