const graphKeys456 = {
  shift(k) {
    if (k === 2) return {
      x: 's · dušenje', y: 'e⁻ᵃˢ · faktor zamika',
      curves: ['e⁻ᵃˢ'], marks: [], areas: ['∫ e⁻ᵃˢ ds · prikazani del']
    };
    return {
      x: 't · čas', y: 'f · sila',
      curves: k === 0 ? ['1 · stara sila', 't · nova sila'] : ['1 · stara sila', 't · nova sila', 'H(t−a)(t−1) · popravek'],
      marks: ['a · preklop'], areas: []
    };
  },
  conv(k) {
    if (k === 2) return {
      x: 't · čas opazovanja', y: '(f∗g)(t) · zbrana količina',
      curves: ['t²/2 · količina'], marks: ['t · izbrani čas'], areas: []
    };
    return {
      x: 'u · pretekli čas', y: 'vrednost signala',
      curves: ['f(u) = u · dotok', 'g(t−u) · odziv'], marks: ['t · konec prekrivanja'],
      areas: k === 0 ? [] : ['t²/2 · količina do t']
    };
  },
  impulse(k) {
    if (k === 2) return {
      x: 'h · trajanje sunka', y: 'L(pₕ)(1) · utežena ploščina',
      curves: ['L(pₕ)(1) · približek', 'e⁻² · limita'], marks: ['h · izbrano trajanje'], areas: []
    };
    return {
      x: 't · čas', y: 'višina sunka',
      curves: k === 0 ? ['pₕ · sunek'] : ['pₕ · sunek', 'e⁻ᵗpₕ · uteženi sunek'], marks: [],
      areas: k === 0 ? ['1 · impulz sile'] : ['1 · impulz sile', 'L(pₕ)(1) · utežena ploščina']
    };
  },
  radius(k) {
    if (k === 0) return {
      x: 'n · indeks člena', y: 'qₙ · absolutni kvocient',
      curves: ['qₙ = |aₙ₊₁/aₙ|', '|x| · limita'], marks: [], areas: []
    };
    if (k === 1) return {
      x: 'N · zadnji indeks', y: 'S_N · delna vsota',
      curves: ['S_N(1) · desni rob', 'S_N(−1) · levi rob'], marks: ['N · izbrani indeks'], areas: []
    };
    return {
      x: 'x · vhod', y: 'oznaki intervala in izbire',
      curves: ['[−1, 1) · konvergenca'], marks: ['x · izbrani vhod'], areas: []
    };
  },
  series(k) {
    return {
      x: 'x · vhod', y: 'vrednost vsote',
      curves: k === 0 ? ['S_N(x) · delna vsota', 'xS_N(x) · zamaknjena vsota']
        : ['S_N(x) · delna vsota', k === 1 ? '1/(1−x) · vsota' : '−ln(1−x) · vsota'],
      marks: [], areas: k === 0 ? ['S_N−xS_N · pas med vsotama'] : []
    };
  },
  uniform(k) {
    const curves = [
      ['|xᴺ| · velikost člena', 'rᴺ · meja člena'],
      ['|S−S_N| · napaka', 'rᴺ⁺¹/(1−r) · meja repa'],
      ['|S_(N+5)−S_N| · delni rep', 'vsota petih majorant']
    ];
    return {x: 'x · vhod', y: k === 0 ? 'velikost člena' : 'velikost repa', curves: curves[k], marks: [], areas: []};
  },
  leg(k) {
    return {
      x: 'x · položaj', y: 'vrednost polinoma',
      curves: k === 0 ? ['a₀ = −½'] : k === 1 ? ['P₂ · polinom', '3x²/2 · kvadratni člen'] : ['P₂ · polinom'],
      marks: ['x · izbrani položaj'], areas: []
    };
  },
  bessel(k, v) {
    return {
      x: 'x · razdalja od središča', y: 'približek J₅(x)',
      curves: ['J₅ · '+v+' čl.', k === 0 ? 'x⁵/3840 · prvi člen' : k === 1 ? 'J₅ · '+(v+1)+' čl.' : 'J₅ · 24 čl.'],
      marks: [], areas: []
    };
  },
  ortho(k) {
    if (k === 2) return {
      x: 'b · zgornja meja', y: 'I(b) · tekoči integral',
      curves: ['I(b) = (b³−b)/2'], marks: ['b · meja'], areas: []
    };
    return {
      x: 'x · položaj', y: k === 0 ? 'vrednost funkcije' : 'P₀P₂ · produkt',
      curves: k === 0 ? ['P₀ = 1', 'P₂ = (3x²−1)/2'] : ['P₀P₂ · produkt'],
      marks: [k === 0 ? 'x = b · izbrani položaj' : 'b · meja integrala'],
      areas: k === 0 ? [] : ['I₊ · pozitivni prispevek', 'I₋ · negativni prispevek']
    };
  },
  pde(k, v) {
    const slice = 'u(x, '+fmt(v)+') · prerez';
    return {
      x: 'x · položaj v prerezu', y: k === 2 ? 'vrednost odvoda' : 'u · višina',
      curves: k === 0 ? [slice] : k === 1 ? [slice, 'u(x, −1)', 'u(x, 1)'] : ['uₓ · naklon', 'uₓₓ = u'],
      marks: [], areas: []
    };
  },
  triple() {
    return {
      x: 'x · čas opazovanja', y: 'K(x) · izhod',
      curves: ['K · trojna konvolucija'], marks: ['x · izbrani čas'], areas: []
    };
  },
  force24() {
    return {
      x: 't · čas', y: 'f · sila / y · odmik',
      curves: ['f = 1', 'f = t', 'y(t) · odmik'], marks: ['a = 2 · preklop', 't · izbrani čas'], areas: []
    };
  },
  force23() {
    return {
      x: 't · čas', y: 'f · sila / y · odmik',
      curves: ['3sin t + 3cos t · sila', '3sin t · sila', 'y(t) · odmik'], marks: ['a = π/2 · preklop', 't · izbrani čas'], areas: []
    };
  },
  volterra() {
    return {
      x: 't · čas', y: 'y(t) · iskani vhod',
      curves: ['y(t) · vhodni signal'], marks: ['t · izbrani čas'], areas: []
    };
  },
  sum22() {
    return {
      x: 'x · vhod', y: 'vrednost vsote',
      curves: ['S_N(x) · delna vsota', 'S(x) · celotna vsota'], marks: [], areas: []
    };
  },
  sum24() {
    return {
      x: 'x · vhod', y: 'vrednost vsote',
      curves: ['S_N(x) · delna vsota', 'S(x) · celotna vsota'], marks: [], areas: []
    };
  },
  mtest() {
    return {
      x: 'x · vhod', y: 'vrednost vsote',
      curves: ['S_N(x) · delna vsota', 'S₁₂₀(x) · 120 členov'], marks: [], areas: []
    };
  }
};
