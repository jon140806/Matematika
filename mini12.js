const mini12 = {
  atanParts12: {
    label: 'Dva prispevka k odvodu', x: [0, 1.2], y: [-0.6, 1.1],
    make() {
      const inside = t => t === 0 ? 0 : Math.atan(t ** 3) / t;
      const edge = t => t === 0 ? 0 : 2 * (Math.atan(t ** 3) - Math.atan(t ** 2)) / t;
      return {
        curves: [line('H · notranjost', inside, mint), line('D · desni rob', edge, gold)],
        fills: [], marks: [0.5], points: [[0.5, inside(0.5), mint], [0.5, edge(0.5), gold]],
        keys: {x: 'parameter t', y: 'prispevek k odvodu', marks: ['t = 0,5'], areas: []},
        caption: 'Pri t = 0,5 notranjost prispeva približno +0,249, desni rob −0,482. Čeprav se rob pomika desno, je višina tam negativna.'
      };
    }
  },
  gaussDisks12: {
    label: 'Kvadrat med dvema četrtinama kroga', x: [0, 1.48], y: [0, 1.48],
    make() {
      const arc = r => x => x <= r ? Math.sqrt(Math.max(0,r*r-x*x)) : NaN;
      const top = x => x <= 1 ? 1 : NaN;
      return {
        curves: [line('notranji lok', arc(1), mint), line('zgornji rob kvadrata', top, gold), line('zunanji lok', arc(Math.SQRT2), lilac)],
        fills: [fill(top,0,1,gold)], marks: [1], points: [[1,1,gold]],
        keys: {x:'x/R', y:'y/R', marks:['1'], areas:['kvadrat']},
        caption: 'Dolžini osi sta izraženi v enotah R. Manjši lok se dotakne stranic kvadrata, večji lok gre skozi oglišče (1,1).'
      };
    }
  },
  gaussBound12: {
    label: 'Odvod ostane med ovojnicama', x: [0, 3], y: [-0.5, 0.5],
    make() {
      const bound = x => x * Math.exp(-x*x);
      const derivative = x => -bound(x) * Math.sin(2*x);
      return {
        curves: [line('odvod pri a = 2', derivative, mint), line('+g', bound, gold), line('−g', x => -bound(x), lilac)],
        fills: [], marks: [], points: [],
        keys: {x: 'položaj x', y: 'višina', marks: [], areas: []},
        caption: 'Sinus spreminja odvod med −g in +g. Ista ovojnica g(x) = x exp(−x²) zato zadošča pri vseh frekvencah.'
      };
    }
  },
  mapSquare12: {
    label: 'Kako se preslikajo meje', x: [0, 2.1], y: [0, 1.1],
    make() {
      const transform = x => x*x/4;
      return {
        curves: [line('u = x²/4', transform, mint)], fills: [], marks: [1, 2],
        points: [[0, 0, mint], [1, 0.25, mint], [2, 1, gold]],
        keys: {x: 'stari x', y: 'novi u', marks: ['x = 1', 'x = 2'], areas: []},
        caption: 'Pri x = 0, 1 in 2 dobiš u = 0, ¼ in 1. Enako široka dela starega intervala dobita različni novi širini.'
      };
    }
  }
};
