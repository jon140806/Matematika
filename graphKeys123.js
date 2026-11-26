const graphKeys123 = {
  gaussTheory: k => [
    {x:'r · polmer',y:'prispevek na enoto polmera',curves:['(π/2) r exp(−r²)'],areas:['del I(0)² do R'],marks:['R']},
    {x:'x · položaj',y:'odvod in ovojnici',curves:['−x exp(−x²) sin(ax)','+x exp(−x²)','−x exp(−x²)'],areas:['prispevek k I′(a)'],marks:[]},
    {x:'a · parameter',y:'I(a) · predznačena ploščina',curves:['I(a) = C exp(−a²/4)'],areas:[],marks:['a']}
  ][k],
  area: k => ({
    x: 'x · razdalja (m)', y: k === 2 ? 'Δf/h · sprememba višine na enoto a' : 'f · višina plošče (m)',
    curves: [['f(x,a) · izbrani rob', 'f(x,0) = 1'], ['f(x,a) · stari rob', 'f(x,a+h) · novi rob'], ['Δf/h = x²']][k],
    marks: k === 2 ? [] : ['x = 2'], areas: [['C = F(0) · začetna ploščina', '8a/3 · dodana ploščina'], ['F(a) · stara površina', 'ΔF · dodani pas'], ['F′(a) · občutljivost površine']][k]
  }),
  leib: k => ({
    x: k === 2 ? 'i · številka prispevka' : 'x · položaj reza', y: k === 2 ? 'prispevek k F′(a)' : 'f · višina pri x',
    curves: [['f(x,a) · stara višina'], ['f(x,a) · stara višina', 'f(x,a+h) · nova višina'], []][k],
    marks: [['u', 'v'], ['u', 'v', 'v₊', 'u₊'], []][k],
    areas: [['F(a) · izrez med u in v'], ['F(a) · stari izrez', '∫ Δf dx · dvig višine', 'v do v₊ · dodani desni pas', 'u do u₊ · odvzeti levi pas'], []][k],
    bars: k === 2 ? ['∫ ∂ₐf dx · notranjost', 'f(v,a)v′ · desni rob', '−f(u,a)u′ · levi rob'] : []
  }),
  tail: k => ({
    x: k === 2 ? 'R · mesto reza' : 'x · položaj pod integralom', y: ['f · višina integranda', '∂ₐf in meji · velikost odvoda s predznakom', '½ exp(−R²) · meja napake'][k],
    curves: [['f = exp(−x²) cos(ax)'], ['∂ₐf · odvod integranda', '+x exp(−x²) · zgornja meja', '−x exp(−x²) · spodnja meja'], ['½ exp(−R²) · ocena repa']][k],
    marks: ['R'], areas: [['I_R(a) · integral do R'], ['rep majorante · prikazani del od R dalje'], []][k]
  }),
  gauss: k => [
    {x:'x · položaj',y:'višina pri a = 0',curves:['exp(−x²)'],marks:['R'],areas:['ploščina do R','vidni del repa']},
    {x:'x · položaj',y:'odvod in meji',curves:['∂ₐf · odvod integranda','+x exp(−x²) · zgornja meja','−x exp(−x²) · spodnja meja'],marks:['R'],areas:['rep majorante · prikazani del od R dalje']},
    {x:'x · položaj',y:'f · višina integranda',curves:['exp(−x²) cos(ax)'],marks:[],areas:['I(a) · prikazani del integrala']}
  ][k],
  atan: k => ({
    x: 'x · položaj pod integralom', y: 'f in ∂ₜf · višina',
    curves: ['f(x,t) · integrand', '∂ₜf · odvod po parametru'], marks: ['t²'],
    areas: [k === 0 ? 'I(t) · predznačena ploščina' : '∫ ∂ₜf dx · notranji prispevek k I′']
  }),
  root: () => ({
    x: 'y · položaj pod integralom', y: '∂ₜf in meja · višina',
    curves: ['∂ₜf = 1/√(t²−y²)', '1/√(4−y²) · majoranta'], marks: [], areas: ['F′ · ploščina pod odvodom']
  }),
  gamma: k => ({
    x: 'x · položaj pod integralom', y: 'višina jedra gama',
    curves: [['xᵖ⁻¹ exp(−x)'], ['xᵖ⁻¹ exp(−x)', 'xᵖ exp(−x)'], ['xᵖ exp(−x)', 'p xᵖ⁻¹ exp(−x)']][k],
    marks: [], areas: [k === 2 ? 'Γ(p+1) · prikazani del integrala' : 'Γ(p) · prikazani del integrala']
  }),
  beta: k => ({
    x: k === 1 ? 'x · prva koordinata' : 'u · delež med 0 in 1',
    y: ['višina jedra beta', 'y · druga koordinata', 'gostota · normirana višina'][k],
    curves: [['uᵖ⁻¹(1−u) · jedro pri q = 2'], ['y = r−x · daljica pri stalnem r'], ['g(u) · gostota za (p,2)', 'g(1−u) · gostota za (2,p)']][k],
    marks: k === 1 ? ['r/2'] : [], areas: k === 0 ? ['B(p,2) · integral jedra'] : []
  }),
  betasub: k => ({
    x: ['x · prvotna koordinata', 'u = x²/4 · nova koordinata', 'b · zgornja meja'][k],
    y: ['f(x) · prvotna višina', 'g(u) · preračunana višina', 'I(b) · ploščina do b'][k],
    curves: [['f = x²√(4−x²)'], ['g = 8√(u(1−u))'], ['I(b) · integral od 0 do b']][k],
    marks: [['b'], ['b²/4'], ['b']][k], areas: [['I(b) · prvotna ploščina'], ['I(b) · ista ploščina po menjavi'], []][k]
  }),
  cubeta: k => ({
    x: k === 0 ? 'x · prvotna koordinata' : 'u = 4x² · nova koordinata',
    y: k === 0 ? 'f(x) · prvotna višina' : 'g(u) · preračunana višina',
    curves: [k === 0 ? 'f = √(x−4x³)' : 'g = √(1−u)/(4√2 · u¹⁄⁴)'],
    marks: [k === 0 ? 'b' : '4b²'], areas: [k === 0 ? 'I(b) · ploščina do izbrane meje b' : 'I(b) · ista ploščina po menjavi']
  }),
  loggamma: k => ({
    x: k === 0 ? 'x · prvotna koordinata' : 'u = ln x · nova koordinata',
    y: k === 0 ? 'f(x) · višina integranda' : 'g(u) · višina jedra gama',
    curves: [k === 0 ? 'f = √(ln x)/x²' : 'g = √u exp(−u)'],
    marks: k === 0 ? ['b'] : [], areas: [k === 0 ? 'integral od 1 do izbrane meje b' : 'isti integral od 0 do ln b']
  }),
  betarec: () => ({
    x: 'u · položaj na enotskem intervalu', y: 'višina jedra beta',
    curves: ['uᵖ⁻¹(1−u)ᵠ', 'uᵖ(1−u)ᵠ⁻¹'], marks: [], areas: ['B(p,q+1) · prvi integral', 'B(p+1,q) · drugi integral']
  }),
  lap: k => ({
    x: k === 2 ? 's · jakost dušenja' : 't · čas', y: k === 2 ? 'F(s) · vrednost transformiranke' : 'višina signala',
    curves: [['exp(−st)f(t) · uteženi signal', 'exp(−st) · utež', 'f(t) = exp(t) · vhod'], ['exp(−(s−1)t) · uteženi vhod'], ['F(s) = 1/(s−1)']][k],
    marks: k === 2 ? ['s'] : [], areas: k === 2 ? [] : ['F(s) · prikazani del integrala']
  }),
  deriv: k => ({
    x: 't · čas', y: 'višina uteženega signala',
    curves: [['exp(−st)f′(t)'], ['s exp(−st)f(t)'], ['t exp(−st)f(t)']][k],
    marks: [], areas: [['ℒ(f′) · prikazani del integrala'], ['sF(s) · prikazani del integrala'], ['−F′(s) · prikazani del integrala']][k]
  }),
  system: k => ({
    x: 't · čas', y: ['začetni vrednosti y in z', 'vrednost eksponentnega člena', 'y, z · vrednosti signalov'][k],
    curves: [['y(0) = 1 · lega', 'z(0) = 0 · hitrost'], ['exp(t)/2 · rastoči člen', 'exp(−t)/2 · padajoči člen'], ['y(t) · lega', 'z(t) · hitrost']][k],
    marks: ['t'], areas: []
  }),
  inverse: () => ({
    x: 't · čas', y: 'vrednost časovnega signala',
    curves: ['exp(t)/2 · prvi člen', '−exp(−t)/2 · drugi člen', 'f(t) = sinh t · vsota'], marks: ['t'], areas: []
  }),
  sys22: () => ({
    x: 't · čas', y: 'y, z · vrednosti signalov',
    curves: ['y(t) · prvi signal', 'z(t) · drugi signal'], marks: ['t'], areas: []
  }),
  sys23: () => ({
    x: 't · čas', y: 'y, z · vrednosti signalov',
    curves: ['y(t) · prvi signal', 'z(t) · drugi signal'], marks: ['t'], areas: []
  }),
  devar: () => ({
    x: 's · spremenljivka transformacije', y: 'Y, Y′ · vrednost in odvod',
    curves: ['Y(s) · transformiranka', 'Y′(s) · odvod po s'], marks: ['s'], areas: []
  })
};
