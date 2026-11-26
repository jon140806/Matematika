// Illustrations for individual steps in the series and differential-equation exercises.
function miniAxes56(x, y, areas = []) {
  return {x, y, marks: [], areas};
}

function signedArea56(fn, a, b) {
  return [fill(x => Math.max(fn(x), 0), a, b, mint),
          fill(x => Math.min(fn(x), 0), a, b, rose)];
}

const mini56 = {
  xlogx56: {
    label: 'Produkt ob desnem robu', x: [0, 1], y: [-0.42, 0.08],
    make() {
      const product = t => t === 0 ? 0 : t * Math.log(t);
      return {curves:[line('t ln(t)', product, mint)], fills:[], marks:[], points:[[0,0,gold]],
        keys:miniAxes56('t = 1 − x','t ln(t)'), caption:'Ko gre x proti 1, se po krivulji približujemo označeni točki pri t = 0.'};
    }
  },
  stairs56: {
    label: 'Od pravokotnikov do ocene repa', x: [1, 5], y: [0, 1.05],
    make() {
      const curve = u => 1/(u*u);
      const rectangles = [2,3,4,5].map(n => fill(() => curve(n),n-1,n,lilac));
      return {curves:[line('1/u²',curve,mint)], fills:rectangles, marks:[], points:[],
        keys:miniAxes56('u','višina', ['1/2²','1/3²','1/4²','1/5²']),
        caption:'Vsak trak je širok 1. Njegova višina je vrednost na desnem robu, zato celoten trak leži pod padajočo krivuljo.'};
    }
  },
  harmonic56: {
    label: 'Zakaj logaritem omejuje vsoto od spodaj?', x:[1,5], y:[0,1.05],
    make() {
      const rectangles=[1,2,3,4].map(n=>fill(()=>1/n,n,n+1,lilac));
      return {curves:[line('1/t',t=>1/t,mint)],fills:rectangles,marks:[],points:[],
        keys:miniAxes56('t','višina',['1','1/2','1/3','1/4']),
        caption:'Tu vzamemo višino na levem robu. Pravokotniki pokrijejo krivuljo, zato je njihova skupna ploščina vsaj tolikšna kot integral.'};
    }
  },
  orthogonal56: {
    label:'Nasprotno predznačeni ploščini',x:[-1,1],y:[-.65,1.1],
    make() {
      const fn=x=>(3*x*x-1)/2;
      return {curves:[line('P₂(x)',fn,mint)],fills:signedArea56(fn,-1,1),marks:[],points:[],
        keys:miniAxes56('x','P₂(x)',['nad osjo','pod osjo']),caption:'Srednji del štejemo z minusom. Račun pokaže, da je po velikosti enak seštevku zunanjih delov.'};
    }
  },
  edge56: {
    label:'Ista napaka pri različnih indeksih',x:[0,1],y:[0,1.05],
    make() {
      const indices=[1,4,12], colors=[mint,lilac,gold];
      return {curves:indices.map((n,i)=>line('N = '+n,x=>x**(n+1),colors[i])),
        fills:[],marks:[],points:indices.map((n,i)=>[0.5**(1/(n+1)),0.5,colors[i]]),
        keys:miniAxes56('x','napaka xᴺ⁺¹'),caption:'Tri označene točke imajo višino 1/2. Pri večjem N se točka z enako napako pomakne bliže desnemu robu.'};
    }
  },
  branches56: {
    label:'Omejena in neomejena potenca',x:[0,1.5],y:[0,6],
    make() {
      return {curves:[line('x²',x=>x*x,mint),line('1/x²',x=>x>0?1/(x*x):NaN,lilac)],
        fills:[],marks:[],points:[],keys:miniAxes56('x','vrednost potence'),
        caption:'Ob približevanju ničli zelena veja pada proti nič, vijolična pa raste prek zgornjega roba grafa. Omejenost zato zahteva B = 0.'};
    }
  },
  weighted56: {
    label:'Izravnava pri izbranem c',x:[0,1],y:[-.3,.72],
    make() {
      const fn=x=>2*x*(x-2/3);
      return {curves:[line('2x(x − 2/3)',fn,mint)],fills:signedArea56(fn,0,1),marks:[],points:[[2/3,0,gold]],
        keys:miniAxes56('x','uteženi produkt',['pozitivni del','negativni del']),
        caption:'Pri c = 2/3 funkcija zamenja predznak v označeni točki. Izračun integrala pokaže, da se ploščini izravnata.'};
    }
  },
  slices56: {
    label:'Ista črta x = 0, različna prereza',x:[-1,1],y:[-3,3],
    make() {
      return {curves:[line('y = 0: u = x',x=>x,mint),line('y = 1: u = x² + 1',x=>x*x+1,lilac)],
        fills:[],marks:[],points:[[0,0,mint],[0,1,lilac]],keys:miniAxes56('x','u(x,y)'),
        caption:'Pri x = 0 sta začetni višini 0 in 1. Konstanta po x je zato lahko odvisna od tega, kateri y izberemo.'};
    }
  }
};
