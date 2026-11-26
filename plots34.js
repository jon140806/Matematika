function markedPracticeCurve34(x, y, xName, yName, curves, at, caption) {
  return {
    x, y, curves, fills: [], marks: [at],
    points: [[at, curves[0].fn(at), mint]],
    keys: {x: xName, y: yName, curves: curves.map(c => c.name), areas: [], marks: [xName.split(' · ')[0]]},
    caption
  };
}

const practicePlots34 = {
  damped34: {
    slider: ['Čas t', 0, 3, 0.05, 0.6],
    make(t) {
      const signal = u => Math.exp(-2*u)*(2*Math.cos(3*u) + Math.sin(3*u)/3);
      const envelope = u => Math.sqrt(37)/3 * Math.exp(-2*u);
      return markedPracticeCurve34([0,3], [-2.15,2.15], 't · čas', 'f · višina',
        [line('f(t) · dušeno nihanje', signal, mint), line('zgornja ovojnica', envelope, gold),
         line('spodnja ovojnica', u => -envelope(u), lilac)], t,
        'Pri t = '+fmt(t)+' je f(t) = '+fmt(signal(t))+'. Eksponent oži ovojnici, med katerima niha signal.');
    }
  },
  doublePole34: {
    slider: ['Čas t', 0, 6, 0.05, 1.5],
    make(t) {
      const double = u => 0.5*u*Math.exp(-u);
      const simple = u => (Math.exp(-3*u)-Math.exp(-u))/4;
      const total = u => double(u)+simple(u);
      return markedPracticeCurve34([0,6], [-0.12,0.21], 't · čas', 'f · višina',
        [line('f · vsota', total, mint), line('½t exp(−t) · dvojni pol', double, lilac),
         line('prispevek enostavnih ulomkov', simple, gold)], t,
        'Pri t = '+fmt(t)+' dvojni pol prispeva '+fmt(double(t))+', oba preostala ulomka skupaj '+fmt(simple(t))+'.');
    }
  },
  initial34: {
    slider: ['Čas t', 0, 4, 0.05, 0.8],
    make(t) {
      const free = u => 2*Math.exp(-3*u);
      const forced = u => Math.exp(-u)-Math.exp(-3*u);
      const total = u => free(u)+forced(u);
      return markedPracticeCurve34([0,4], [-0.08,2.15], 't · čas', 'y · odziv',
        [line('y · celoten odziv',total,mint), line('2 exp(−3t) · začetno stanje',free,lilac),
         line('odziv na zunanji vhod',forced,gold)], t,
        'Začetno stanje in zunanji vhod skupaj dasta y('+fmt(t)+') = '+fmt(total(t))+'.');
    }
  },
  timeWeight34: {
    slider: ['Parameter s', 0.1, 8, 0.1, 3],
    make(s) {
      const transform = u => (u*u-9)/(u*u+9)**2;
      return markedPracticeCurve34([0.1,8], [-0.12,0.027], 's · parameter', '−F′ · transformiranka',
        [line('−F′(s) · transformiranka t cos(3t)', transform, mint)], s,
        'Pri s = '+fmt(s)+' je −F′(s) = '+fmt(transform(s))+'. Krivulja seka os pri s = 3, kjer je števec nič.');
    }
  },
  pulse34: {
    slider: ['Čas t', 0, 6, 0.05, 2.5],
    make(t) {
      const pulse = u => u >= 1 && u < 4 ? 3 : 0;
      return {
        x: [0,6], y: [-0.25,3.55],
        curves: [line('f(t) · višina pulza', pulse, mint)],
        fills: [fill(() => 3,1,4,mint)], marks: [1,4], points: [[t,pulse(t),gold]],
        keys: {x:'t · čas',y:'f · višina',curves:['f · signal'],areas:['interval delovanja'],marks:['1 · vklop','4 · izklop']},
        caption:'Pri t = '+fmt(t)+' je prva stopnica '+(t>=1?'1':'0')+', druga '+(t>=4?'1':'0')+'. Višina signala je '+pulse(t)+'.'
      };
    }
  },
  ramp34: {
    slider: ['Čas t', 0, 5, 0.05, 4],
    make(t) {
      const ramp = u => 2*Math.max(u-3,0);
      const chart = markedPracticeCurve34([0,5], [-0.3,4.4], 't · čas', 'f · višina',
        [line('f(t) · zakasnjena rampa',ramp,mint)], t,
        t<3 ? 'Ob izbranem času je vklop še pred nami. Signal je nič.' :
          'Od vklopa je minilo '+fmt(t-3)+'. Višina rampe je 2 × '+fmt(t-3)+' = '+fmt(ramp(t))+'.');
      chart.marks = [3]; chart.keys.marks = ['3 · vklop'];
      return chart;
    }
  },
  impact34: {
    slider: ['Čas t', 0, 5, 0.05, 1.5],
    make(t) {
      const displacement = u => u<1 ? 0 : 1.5*Math.sin(2*(u-1));
      const chart = markedPracticeCurve34([0,5], [-1.65,1.65], 't · čas', 'y · odmik',
        [line('y(t) · odmik po sunku',displacement,mint)], t,
        t < 1 ? 'Pred sunkom nihalo miruje.' :
          'Odmik pri t = '+fmt(t)+' je '+fmt(displacement(t))+'. Tik po udarcu ima krivulja naklon 3.');
      chart.marks = [1]; chart.keys.marks = ['1 · sunek'];
      return chart;
    }
  },
  overlap34: {
    slider: ['Čas opazovanja t', 0, 4, 0.05, 1],
    make(t) {
      const integrand = u => Math.exp(-t-u);
      return {
        x:[0,4], y:[0,1.05], curves:[line('produkt v prekrivanju', u=>u<=t?integrand(u):NaN, mint)],
        fills:[fill(integrand,0,t,mint)], marks:[t], points:[[t,integrand(t),mint]],
        keys:{x:'u · čas pod integralom',y:'f(u)g(t−u) · višina',curves:['exp(−t−u)'],areas:['(f ∗ g)(t) · ploščina'],marks:['t · meja prekrivanja']},
        caption:'Za t = '+fmt(t)+' integral sega od 0 do '+fmt(t)+'. Ploščina je '+fmt(Math.exp(-t)-Math.exp(-2*t))+'.'
      };
    }
  }
};
