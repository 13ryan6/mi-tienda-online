// ══ LOADER ══
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 800);
});

// ══ HERO CANVAS ══
(function(){
  const cv = document.getElementById('hero-canvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, stars = [], petals = [], t = 0;

  function resize(){
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  }

  function initStars(){
    stars = [];
    for(let i=0;i<160;i++){
      stars.push({
        x:Math.random()*W, y:Math.random()*H,
        r:Math.random()*1.2+.2,
        a:Math.random(), sp:Math.random()*.006+.002,
        ph:Math.random()*Math.PI*2
      });
    }
  }

  function initPetals(){
    petals = [];
    for(let i=0;i<18;i++){
      petals.push({
        x:Math.random()*W, y:Math.random()*H+H,
        size:5+Math.random()*8,
        speed:0.4+Math.random()*0.6,
        drift:Math.random()*1-0.5,
        rot:Math.random()*360,
        rotSpeed:Math.random()*2-1,
        color:`hsl(${340+Math.random()*30},${60+Math.random()*20}%,${70+Math.random()*15}%)`,
        opacity:0.4+Math.random()*0.4
      });
    }
  }

  function frame(){
    ctx.clearRect(0,0,W,H);

    // Background
    const g = ctx.createRadialGradient(W*.4,H*.35,0,W*.5,H*.5,Math.max(W,H)*.9);
    g.addColorStop(0,'#2a0a16'); g.addColorStop(.4,'#18060d'); g.addColorStop(1,'#0c0208');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    // Nebulas
    [[W*.15,H*.25,W*.5,'rgba(200,65,90,.08)'],[W*.8,H*.7,W*.5,'rgba(212,168,67,.05)']].forEach(([x,y,r,c])=>{
      const n=ctx.createRadialGradient(x,y,0,x,y,r);
      n.addColorStop(0,c); n.addColorStop(1,c.replace(/[\d.]+\)$/,'0)'));
      ctx.fillStyle=n; ctx.fillRect(0,0,W,H);
    });

    t += .016;

    // Stars
    stars.forEach(s=>{
      const a = .2 + .55*Math.sin(t*s.sp*60+s.ph);
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,240,230,${a*s.a+.1})`; ctx.fill();
    });

    // Petals
    petals.forEach(p=>{
      p.y -= p.speed;
      p.x += p.drift * .5;
      p.rot += p.rotSpeed;
      if(p.y < -20){ p.y = H+20; p.x = Math.random()*W; }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.ellipse(0,0,p.size,p.size*1.4,0,0,Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(()=>{ resize(); initStars(); });
  ro.observe(cv);
  resize(); initStars(); initPetals(); frame();
})();

// ══ NAV SCROLL ══
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', ()=>{
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ══ HAMBURGER ══
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', ()=>{
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ══ REVEAL ON SCROLL ══
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'), i*80);
      observer.unobserve(e.target);
    }
  });
}, { threshold:.12 });
reveals.forEach(r=>observer.observe(r));

// ══ FILTROS ══
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card=>{
      if(filter === 'all' || card.dataset.cat === filter){
        card.classList.remove('hidden-filter');
      } else {
        card.classList.add('hidden-filter');
      }
    });
  });
});

// ══ CARRITO ══
let cart = [];
const cartBar = document.getElementById('cartBar');
const cartSummary = document.getElementById('cartSummary');

function addToCart(name, price){
  const existing = cart.find(i=>i.name===name);
  if(existing){ existing.qty++; }
  else { cart.push({name, price, qty:1}); }
  updateCart();

  // Feedback visual
  const btn = event.target;
  btn.textContent = '✓ Agregado';
  btn.style.background = '#2d6a4f';
  btn.style.color = 'white';
  setTimeout(()=>{ btn.textContent = '+ Agregar'; btn.style.background=''; btn.style.color=''; }, 1200);
}

function updateCart(){
  const total = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const count = cart.reduce((s,i)=>s+i.qty, 0);
  cartSummary.textContent = `${count} producto${count>1?'s':''} · $${total.toFixed(2)}`;
  cartBar.classList.toggle('hidden', cart.length===0);
}

document.getElementById('cartCheckout').addEventListener('click', ()=>{
  if(!cart.length) return;
  const items = cart.map(i=>`• ${i.name} x${i.qty} = $${(i.price*i.qty).toFixed(2)}`).join('\n');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
  const msg = encodeURIComponent(`Hola! Quiero hacer el siguiente pedido 🌸\n\n${items}\n\nTotal: $${total}\n\n¿Pueden confirmarme disponibilidad?`);
  window.open(`https://wa.me/593999999999?text=${msg}`, '_blank');
});

document.getElementById('cartClear').addEventListener('click', ()=>{
  cart = [];
  updateCart();
});

// Pedir producto individual
function orderProduct(name){
  const msg = encodeURIComponent(`Hola! Me interesa pedir: ${name} 🌸 ¿Pueden darme más información y disponibilidad?`);
  window.open(`https://wa.me/593999999999?text=${msg}`, '_blank');
}

// Contacto rápido
function sendOrder(tipo){
  const msg = encodeURIComponent(`Hola! Estoy interesada/o en ${tipo} 🌸 ¿Me pueden dar más información?`);
  window.open(`https://wa.me/593999999999?text=${msg}`, '_blank');
}

// ══ DEMO CARTA DIGITAL ══
let demoPlayed = false;

function playDemo(){
  if(demoPlayed) return;
  demoPlayed = true;

  const flap = document.getElementById('demoFlap');
  const card = document.getElementById('demoCard');
  const seal = document.getElementById('demoSeal');
  const env  = document.getElementById('demoEnv');
  const msg  = document.getElementById('demoMsg');

  setTimeout(()=>{ flap.classList.add('open'); seal.style.opacity='0'; }, 200);
  setTimeout(()=>{ card.classList.add('rising'); }, 800);

  // Burst
  setTimeout(()=>{
    const screen = document.querySelector('.demo-screen');
    const rect = env.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();
    ['💕','🌸','✨','💖'].forEach((e,i)=>{
      const el = document.createElement('div');
      el.textContent = e;
      el.style.cssText=`position:absolute;font-size:1.1rem;pointer-events:none;z-index:10;transition:transform .7s ease,opacity .7s ease;opacity:1;top:50%;left:50%;transform:translate(-50%,-50%)`;
      screen.appendChild(el);
      const angle = (i/4)*Math.PI*2;
      setTimeout(()=>{
        el.style.transform=`translate(calc(-50% + ${Math.cos(angle)*55}px),calc(-50% + ${Math.sin(angle)*55}px))`;
        el.style.opacity='0';
      },30);
      setTimeout(()=>el.remove(),800);
    });
  },900);

  setTimeout(()=>{
    env.style.display='none';
    msg.classList.remove('hidden');
    setTimeout(()=>msg.classList.add('show'),50);
  },1600);
}

function resetDemo(){
  demoPlayed = false;
  const flap = document.getElementById('demoFlap');
  const card = document.getElementById('demoCard');
  const seal = document.getElementById('demoSeal');
  const env  = document.getElementById('demoEnv');
  const msg  = document.getElementById('demoMsg');

  msg.classList.remove('show');
  setTimeout(()=>{
    msg.classList.add('hidden');
    env.style.display='';
    flap.classList.remove('open');
    card.classList.remove('rising');
    seal.style.opacity='1';
  },400);
}

// ══ ACTIVE NAV LINK ══
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
  let current = '';
  sections.forEach(s=>{
    if(window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.style.color = '';
    if(a.getAttribute('href') === `#${current}`){
      a.style.color = navbar.classList.contains('scrolled') ? 'var(--rose)' : 'white';
    }
  });
});
