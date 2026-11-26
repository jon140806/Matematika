const mini34 = {
  switch34: {
    label: 'Sila pred preklopom in po njem', x: [0, 4], y: [-0.2, 4.3],
    make() {
      const old = () => 1;
      const next = t => t >= 2 ? t : NaN;
      return {
        curves: [line('prvotna sila 1', old, lilac), line('nova sila t', next, mint)],
        fills: [fill(next, 2, 4, gold, old)], marks: [2], points: [],
        keys: {x: 't · čas', y: 'sila', marks: ['t = 2'], areas: ['razlika višin t − 1']},
        caption: 'Pri t = 3 je nova višina 3, stara 1. Popravek znaša 3 − 1 = 2.'
      };
    }
  },
  damping34: {
    label: 'Skupni eksponent duši nihanje', x: [0, 3], y: [-2.2, 2.2],
    make() {
      const envelope = t => Math.sqrt(37) / 3 * Math.exp(-2*t);
      const signal = t => Math.exp(-2*t) * (2*Math.cos(3*t) + Math.sin(3*t)/3);
      return {
        curves: [line('f(t)', signal, mint), line('zgornja ovojnica', envelope, gold), line('spodnja ovojnica', t => -envelope(t), gold)],
        fills: [], marks: [], points: [[0,2,mint]],
        keys: {x: 't · čas', y: 'odmik', marks: [], areas: []},
        caption: 'Oba nihajna člena imata isti faktor exp(−2t). Zato se razdalja med ovojnicama manjša.'
      };
    }
  },
  window34: {
    label: 'Dve stopnici tvorita pulz', x: [0, 5], y: [-0.3, 3.6],
    make() {
      return {
        curves: [line('f(t)', t => t >= 1 && t < 4 ? 3 : 0, mint)],
        fills: [fill(() => 3, 1, 4, lilac)], marks: [1,4], points: [],
        keys: {x: 't · čas', y: 'višina', marks: ['+3','−3'], areas: ['čas delovanja']},
        caption: 'Pri času 1 se višina dvigne z 0 na 3. Pri času 4 se vrne na 0.'
      };
    }
  },
  rampStart34: {
    label: 'Lokalna ura rampe', x: [0, 5], y: [-0.3, 4.3],
    make() {
      return {
        curves: [line('rampa', t => 2*Math.max(0,t-3), mint)],
        fills: [], marks: [3,4], points: [[3,0,gold],[4,2,rose]],
        keys: {x: 't · čas', y: 'višina', marks: ['u = 0','u = 1'], areas: []},
        caption: 'Ob t = 4 je od vklopa minila ena enota. Višina je 2 · 1 = 2.'
      };
    }
  },
  velocityJump34: {
    label: 'Hitrost ob udarcu', x: [0, 2.4], y: [-3.4, 3.5],
    make() {
      return {
        curves: [line('pred sunkom', t => t < 1 ? 0 : NaN, lilac), line('po sunku', t => t >= 1 ? 3*Math.cos(2*(t-1)) : NaN, mint)],
        fills: [], marks: [1], points: [[1,0,lilac],[1,3,mint]],
        keys: {x: 't · čas', y: 'hitrost', marks: ['sunek'], areas: []},
        caption: 'Točki pri t = 1 označujeta levo in desno limito hitrosti. Navpična razlika je 3.'
      };
    }
  },
  productArea34: {
    label: 'Prekrivanje pri t = 1', x: [0, 2], y: [-0.03, 0.42],
    make() {
      const product = u => Math.exp(-1-u);
      return {
        curves: [line('produkt na [0, 1]', u => u<=1 ? product(u) : NaN, mint)],
        fills: [fill(product, 0, 1, lilac)], marks: [1], points: [],
        keys: {x: 'u · čas pod integralom', y: 'produkt signalov', marks: ['u = t'], areas: ['vrednost konvolucije']},
        caption: 'Desno od 1 bi bil čas drugega signala 1 − u negativen. Vzročni signal je tam nič.'
      };
    }
  }
};
