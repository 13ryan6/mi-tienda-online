// @ts-nocheck
// Port fiel de js/script.js (sitio original) a un módulo con limpieza, para usarlo desde Next.js.
// Cambios respecto al original: Firebase -> Supabase (solo reseñas), onclick en línea -> data-click
// (delegación de eventos), y arranque/limpieza compatibles con React. Se reemplazará por componentes
// React en la Etapa 3 (carrito/checkout/reseñas) sin tocar el diseño.
import { WHATSAPP_NUMBER } from '@/lib/site-config';

// Un solo cliente de Supabase para toda la página. Se guarda la PROMESA (no el cliente): en desarrollo
// React monta el efecto dos veces y ambas llamadas ocurren antes de que termine el import dinámico,
// así que guardar solo el cliente creaba dos.
let _sbPromise = null;
function getSupabase() {
  if (!_sbPromise) {
    _sbPromise = (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) return null;
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    })();
  }
  return _sbPromise;
}

export function initSiteBehavior() {
  let alive = true;
  const offs = [];
  const intervals = [];
  const observers = [];
  function on(target, type, handler, opts) {
    target.addEventListener(type, handler, opts);
    offs.push(() => target.removeEventListener(type, handler, opts));
  }
  function every(fn, ms) {
    const id = window.setInterval(fn, ms);
    intervals.push(id);
    return id;
  }


  // ══ LOADER + ARRANQUE ══
  function onReady(){
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if(loader) loader.classList.add('hidden');
    }, 800);
    initCounterObserver();
    initReviews();
  }
  // (el arranque se dispara al final de initSiteBehavior, cuando todo ya está declarado)

  // ══ HERO CANVAS ══
  (function(){
    const cv = document.getElementById('hero-canvas');
    if(!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, stars = [], petals = [], t = 0;

    function resize(){
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
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
      if(!alive) return;
      ctx.clearRect(0,0,W,H);
      const g = ctx.createRadialGradient(W*.4,H*.35,0,W*.5,H*.5,Math.max(W,H)*.9);
      g.addColorStop(0,'#2a0a16'); g.addColorStop(.4,'#18060d'); g.addColorStop(1,'#0c0208');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

      [[W*.15,H*.25,W*.5,'rgba(200,65,90,.08)'],[W*.8,H*.7,W*.5,'rgba(212,168,67,.05)']].forEach(([x,y,r,c])=>{
        const n=ctx.createRadialGradient(x,y,0,x,y,r);
        n.addColorStop(0,c); n.addColorStop(1,c.replace(/[\d.]+\)$/,'0)'));
        ctx.fillStyle=n; ctx.fillRect(0,0,W,H);
      });

      t += .016;
      stars.forEach(s=>{
        const a = .2 + .55*Math.sin(t*s.sp*60+s.ph);
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,240,230,${a*s.a+.1})`; ctx.fill();
      });

      petals.forEach(p=>{
        p.y -= p.speed; p.x += p.drift * .5; p.rot += p.rotSpeed;
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

    on(window, 'resize', ()=>{ resize(); initStars(); initPetals(); });
    // Esperar que el hero tenga altura real antes de inicializar
    if(document.readyState === 'loading'){
      on(document, 'DOMContentLoaded', ()=>{ resize(); initStars(); initPetals(); frame(); });
    } else {
      resize(); initStars(); initPetals(); frame();
    }
  })();

  // ══ NAV SCROLL ══
  const navbar = document.getElementById('navbar');
  on(window, 'scroll', ()=>{
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ══ HAMBURGER ══
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  on(hamburger, 'click', ()=>{
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a=>{
    on(a, 'click',()=>{
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
  observers.push(observer);

  // ══ FILTROS ══
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    on(btn, 'click', ()=>{
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

  function addToCart(btn, price){
    const card = btn.closest('.product-card');
    const name = card.querySelector('.product-info h3')?.textContent.trim() || 'Producto sin nombre';
    const catKey = card.dataset.cat || '';
    const categoria = categoriaLabels[catKey] || catKey;

    const existing = cart.find(i=>i.name===name);
    if(existing){ existing.qty++; } else { cart.push({name, price, qty:1}); }
    updateCart();

    btn.textContent = '✓ Agregado';
    btn.style.background = '#2d6a4f';
    btn.style.color = 'white';
    setTimeout(()=>{ btn.textContent = '+ Consultar'; btn.style.background=''; btn.style.color=''; }, 1200);
  }

  function updateCart(){
    const count = cart.reduce((s,i)=>s+i.qty, 0);
    cartSummary.textContent = `${count} producto${count>1?'s':''}`;
    cartBar.classList.toggle('hidden', cart.length===0);
  }

  on(document.getElementById('cartCheckout'), 'click', ()=>{
    if(!cart.length) return;
    const items = cart.map(i=>`• ${i.name}${i.qty > 1 ? ` x${i.qty}` : ''}`).join('\n');
    const msg = encodeURIComponent(`Hola! 😊 Quiero consultar por los siguientes productos:\n\n${items}\n\n¿Están disponibles? Me gustaría hacer el pedido 🙌`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  });

  on(document.getElementById('cartClear'), 'click', ()=>{
    cart = []; updateCart();
  });

  // Mapa de categorías: data-cat → etiqueta amigable con emoji
  const categoriaLabels = {
    arreglos:  '🌸 Arreglos de Flores',
    munecas:   '🎀 Muñecas Decoradas',
    vinos:     '🍷 Vinos & Licores',
    chocolate: '🍫 Chocolates',
    sorpresa:  '🎁 Cajas Sorpresa',
  };

  function orderProduct(btn) {
    const card = btn.closest('.product-card');
    const nombre = card.querySelector('.product-info h3')?.textContent.trim() || 'Producto sin nombre';
    const catKey = card.dataset.cat || '';
    const categoria = categoriaLabels[catKey] || catKey;

    const msg = encodeURIComponent(
      `Hola 😊, vi su catálogo y me interesa este producto:\n` +
      `✨ ${nombre}\n` +
      `📂 Categoría: ${categoria}\n\n` +
      `¿Está disponible? Me gustaría hacer el pedido 🙌`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  }

  function sendOrder(tipo){
    const msg = encodeURIComponent(`Hola! Estoy interesada/o en ${tipo} 🌸 ¿Me pueden dar más información?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  }

  // ══ CONTADORES ══
  let pedidosValue = null;
  let resenasValue = null;

  function animateCounter(el, target){
    if(el.dataset.running === 'true') return;
    el.dataset.running = 'true';
    const duration = 2000;
    const startTime = performance.now();
    function update(now){
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + '+';
      if(progress < 1) requestAnimationFrame(update);
      else el.textContent = target + '+';
    }
    requestAnimationFrame(update);
  }

  // Observar cuando los contadores entran en pantalla
  function initCounterObserver(){
    const statPedidos = document.getElementById('stat-pedidos');
    const statResenas = document.getElementById('stat-resenas');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(!e.isIntersecting) return;
        e.target.dataset.animated = 'true';
        if(e.target.id === 'stat-pedidos' && pedidosValue !== null){
          animateCounter(e.target, pedidosValue);
        }
        if(e.target.id === 'stat-resenas' && resenasValue !== null){
          animateCounter(e.target, resenasValue);
        }
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });

    observers.push(obs);
    if(statPedidos){ pedidosValue = parseInt(statPedidos.textContent, 10) || 0; statPedidos.textContent = '0+'; obs.observe(statPedidos); }
    if(statResenas){ statResenas.textContent = '0+'; obs.observe(statResenas); }
  }

  // ══ TÍTULO DINÁMICO DE PESTAÑA ══
  (function(){
    const original = document.title;
    const messages = [
      '🌸 ¡Haz tu pedido hoy!',
      '💌 Carta digital personalizada',
      '🎁 Regalos únicos hechos a mano',
      '🌸 Detalles Creativos',
    ];
    let idx = 0;
    let interval = null;

    on(document, 'visibilitychange', () => {
      if(document.hidden){
        // Usuario cambió de tab — llamar su atención
        interval = every(() => {
          document.title = messages[idx % messages.length];
          idx++;
        }, 1500);
      } else {
        // Volvió — restaurar título
        clearInterval(interval);
        document.title = original;
        idx = 0;
      }
    });
  })();

  // ══ RESEÑAS (Supabase) ══

  // Solo se leen reseñas aprobadas (lo impone RLS). Si falla, se dejan las reseñas fijas del HTML.
  async function initReviews(){
    try {
      const sb = await getSupabase();
      if(!sb) return;
      const [list, total] = await Promise.all([
        sb.from('reviews').select('name,stars,message,created_at').order('created_at', { ascending: false }).limit(6),
        sb.from('reviews').select('*', { count: 'exact', head: true }),
      ]);
      if(list.error) throw list.error;
      if(total.error) throw total.error;
      renderReviews(list.data || []);
      updateReviewCount(total.count || 0);
    } catch (e) {
      console.warn('[reseñas] no disponibles', e);
    }
  }

  function starsOf(r){
    const n = Math.round(Number(r.stars));
    return Math.min(5, Math.max(0, isNaN(n) ? 0 : n));
  }

  function renderReviews(reviews){
    const grid = document.getElementById('testimoniosGrid');
    if(!grid) return;

    if(reviews.length === 0){
      grid.innerHTML = `<div class="no-reviews">¡Sé el primero en dejar una reseña! 🌸</div>`;
      return;
    }

    grid.innerHTML = reviews.slice(0, 6).map(r => `
      <div class="testimonio reveal">
        <div class="test-stars">${'★'.repeat(starsOf(r))}${'☆'.repeat(5-starsOf(r))}</div>
        <p>"${escapeHtml(String(r.message || ''))}"</p>
        <div class="test-author">
          <div class="test-avatar">${escapeHtml(String(r.name || '?').charAt(0).toUpperCase())}</div>
          <div>
            <strong>${escapeHtml(String(r.name || ''))}</strong>
            <span class="test-date">${formatDate(r.created_at)}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Re-observar los nuevos elementos
    grid.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }

  function updateReviewCount(count){
    resenasValue = count;
    const el = document.getElementById('stat-resenas');
    if(el && el.dataset.animated === 'true'){
      animateCounter(el, count);
    } else if(el){
      el.textContent = '0+';
    }
  }

  function submitReview(){
    const name    = document.getElementById('reviewName').value.trim();
    const activeBtns = document.querySelectorAll('.star-btn.active');
    const stars = activeBtns.length > 0
      ? Math.max(...[...activeBtns].map(b => parseInt(b.dataset.stars)))
      : 0;
    const message = document.getElementById('reviewMessage').value.trim();
    const btn     = document.getElementById('submitReview');

    if(!name){ showReviewError('Escribe tu nombre 😊'); return; }
    if(!stars){ showReviewError('Selecciona las estrellas ⭐'); return; }
    if(message.length < 10){ showReviewError('Cuéntanos un poco más 🌸'); return; }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    (async () => {
      try {
        const sb = await getSupabase();
        if(!sb) throw new Error('Supabase no configurado');
        const { error } = await sb.from('reviews').insert({ name, stars, message });
        if(error) throw error;
        document.getElementById('reviewName').value = '';
        document.getElementById('reviewMessage').value = '';
        document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
        btn.textContent = '✓ ¡Gracias! La revisaremos pronto';
        btn.style.background = '#2d6a4f';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = 'Publicar reseña';
          btn.style.background = '';
        }, 3000);
      } catch (e) {
        showReviewError('Error al enviar, intenta de nuevo');
        btn.disabled = false;
        btn.textContent = 'Publicar reseña';
      }
    })();
  }

  function showReviewError(msg){
    const err = document.getElementById('reviewError');
    err.textContent = msg;
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 3000);
  }

  // Estrellas interactivas
  function initStarSelector(){
    const btns = document.querySelectorAll('.star-btn');
    if(!btns.length) return;
    btns.forEach(btn => {
      on(btn, 'mouseenter', () => {
        const val = parseInt(btn.dataset.stars);
        btns.forEach(b => b.classList.toggle('hover', parseInt(b.dataset.stars) <= val));
      });
      on(btn, 'mouseleave', () => {
        btns.forEach(b => b.classList.remove('hover'));
      });
      on(btn, 'click', () => {
        const val = parseInt(btn.dataset.stars);
        btns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.stars) <= val));
      });
    });
  }

  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDate(ts){
    const d = new Date(ts);
    return d.toLocaleDateString('es-EC', { day:'numeric', month:'short', year:'numeric' });
  }

  // ══ CARTA DIGITAL — DATOS POR TIPO ══
  const cartasPorTipo = {
    basico: [
      { eyebrow: 'Con todo mi amor', title: 'Para ti, amor mío 🌸', body: 'Porque cada día contigo\nes el más bonito de mi vida.\n<em>Te amo infinito.</em>', sign: 'Tu persona favorita 💕' },
      { eyebrow: 'En este día especial', title: '¡Feliz cumpleaños! 🎂', body: 'Que este día esté lleno\nde todo lo que te hace sonreír.\n<em>Eres increíble.</em>', sign: 'Con mucho cariño 🌸' },
      { eyebrow: 'Siempre en mi corazón', title: 'Te extraño tanto ✨', body: 'La distancia no cambia\nlo mucho que te quiero.\n<em>Siempre contigo.</em>', sign: 'Para siempre tuyo/a 💖' },
      { eyebrow: 'Un pequeño recordatorio', title: 'Eres lo mejor 💌', body: 'Solo quería decirte\nque haces todo más bonito.\n<em>Gracias por existir.</em>', sign: 'Con amor eterno 🌺' },
      { eyebrow: 'Hoy y siempre', title: 'Mi persona favorita 🦋', body: 'No necesito una razón\npara pensar en ti.\n<em>Simplemente te quiero.</em>', sign: 'Tuyo/a para siempre 💫' },
      { eyebrow: 'En este momento especial', title: '¡Lo lograste! 🎓', body: 'Tu esfuerzo y dedicación\ndan frutos increíbles.\n<em>Estoy muy orgulloso/a de ti.</em>', sign: 'Con todo mi orgullo 🌟' },
      { eyebrow: 'Desde el fondo de mi alma', title: 'Gracias por todo 🌹', body: 'Por cada momento,\npor cada abrazo, por cada sonrisa.\n<em>No sé qué haría sin ti.</em>', sign: 'Con amor infinito 💗' },
      { eyebrow: 'Para recordarte', title: 'Eres mi felicidad 🌈', body: 'Cuando estás cerca\nel mundo tiene más color.\n<em>Nunca lo olvides.</em>', sign: 'El/La que más te quiere 🌸' },
    ],
    personalizado: [
      { eyebrow: 'Un mensaje especial', title: 'Para {nombre} 💌', body: '{mensaje}', sign: 'Con todo el corazón 💕' },
      { eyebrow: 'Desde lo más profundo', title: 'Hola, {nombre} 🌸', body: '{mensaje}', sign: 'Con cariño eterno 🌺' },
      { eyebrow: 'Solo para ti', title: '{nombre}, esto es para ti ✨', body: '{mensaje}', sign: 'Siempre tuyo/a 💖' },
      { eyebrow: 'Con todo mi amor', title: 'Mi querido/a {nombre} 🦋', body: '{mensaje}', sign: 'Para siempre 💫' },
      { eyebrow: 'Un momento especial', title: '¡Para ti, {nombre}! 🎁', body: '{mensaje}', sign: 'Con mucho amor 🌹' },
      { eyebrow: 'Palabras del corazón', title: '{nombre}, te dedico esto 🌟', body: '{mensaje}', sign: 'Con amor sincero 💗' },
      { eyebrow: 'Porque te lo mereces', title: 'Esto es para ti, {nombre} 🎂', body: '{mensaje}', sign: 'Tu persona favorita 💕' },
      { eyebrow: 'De corazón a corazón', title: '{nombre}, escucha esto 🌈', body: '{mensaje}', sign: 'Con todo mi ser 🌸' },
    ],
    premium: [
      { eyebrow: 'Un recuerdo que nunca olvidarás', title: 'Para {nombre}, con amor 🌹', body: '{mensaje}\n\n<em>Este arreglo fue creado especialmente para ti.</em>', sign: 'Guardado en mi corazón 💖' },
      { eyebrow: 'Momentos que perduran', title: '{nombre}, esto lo creé para ti ✨', body: '{mensaje}\n\n<em>Cada detalle fue pensado en ti.</em>', sign: 'Con amor eterno 💫' },
      { eyebrow: 'Una imagen vale más que mil palabras', title: 'Mi regalo para ti, {nombre} 🎁', body: '{mensaje}\n\n<em>Espero que este recuerdo te acompañe siempre.</em>', sign: 'Tu admirador/a secreto/a 🌸' },
      { eyebrow: 'Un tesoro especial', title: '{nombre}, guarda este momento 🌷', body: '{mensaje}\n\n<em>Este arreglo es tan único como tú.</em>', sign: 'Con todo mi corazón 💕' },
      { eyebrow: 'Porque mereces lo mejor', title: 'Solo para ti, {nombre} 🌺', body: '{mensaje}\n\n<em>Lo más bello, para la persona más especial.</em>', sign: 'Con amor infinito 💗' },
      { eyebrow: 'Un detalle que habla por mí', title: '{nombre}, mira lo que preparé 🎀', body: '{mensaje}\n\n<em>Creado a mano, desde el alma.</em>', sign: 'Siempre tuyo/a 🌟' },
      { eyebrow: 'Desde lo más profundo', title: 'Mi querido/a {nombre} 💌', body: '{mensaje}\n\n<em>Este arreglo lleva mis mejores deseos para ti.</em>', sign: 'Para siempre contigo 💖' },
      { eyebrow: 'Un regalo hecho con amor', title: '¡Para ti, {nombre}! 🌸', body: '{mensaje}\n\n<em>Cada flor, cada detalle... todo es tuyo.</em>', sign: 'Con el corazón en la mano 🌹' },
    ],
  };

  // ══ CARTA DIGITAL — ESTADO ══
  let demoPlayed = false;
  let tipoActivo = 'basico';

  // ══ CARTA DIGITAL — SELECTOR DE TIPO ══
  function seleccionarTipo(planEl) {
    const tipo = planEl.dataset.tipo;
    tipoActivo = tipo;

    // Highlight activo en planes
    document.querySelectorAll('.carta-plan.selectable').forEach(p => p.classList.remove('tipo-activo'));
    planEl.classList.add('tipo-activo');

    // Mostrar/ocultar grupos de inputs
    ['inputGrupoBasico', 'inputGrupoPersonalizado', 'inputGrupoPremium'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
    const mapaGrupo = { basico: 'inputGrupoBasico', personalizado: 'inputGrupoPersonalizado', premium: 'inputGrupoPremium' };
    document.getElementById(mapaGrupo[tipo]).classList.remove('hidden');

    // Reset demo al cambiar tipo
    if (demoPlayed) resetDemo();
  }

  // ══ CARTA DIGITAL — LEER INPUTS ══
  function leerDatosFormulario() {
    const datos = { nombre: '', mensaje: '', fotoUrl: null };

    if (tipoActivo === 'basico') {
      datos.nombre = document.getElementById('cartaNombreBasico').value.trim();
    } else if (tipoActivo === 'personalizado') {
      datos.nombre  = document.getElementById('cartaNombrePersonalizado').value.trim();
      datos.mensaje = document.getElementById('cartaMensajePersonalizado').value.trim();
    } else if (tipoActivo === 'premium') {
      datos.nombre  = document.getElementById('cartaNombrePremium').value.trim();
      datos.mensaje = document.getElementById('cartaMensajePremium').value.trim();
      const fileInput = document.getElementById('cartaFotoPremium');
      if (fileInput.files && fileInput.files[0]) {
        datos.fotoUrl = URL.createObjectURL(fileInput.files[0]);
      }
    }

    return datos;
  }

  // ══ CARTA DIGITAL — CONSTRUIR CONTENIDO ══
  function construirContenidoCarta(tipo, datos) {
    const pool = cartasPorTipo[tipo];
    const plantilla = pool[Math.floor(Math.random() * pool.length)];
    const nombre = datos.nombre || 'ti';

    const reemplazar = (str) => str
      .replace(/\{nombre\}/g, nombre)
      .replace(/\{mensaje\}/g, datos.mensaje || '');

    let body = reemplazar(plantilla.body);

    // Básico: ignora inputs de mensaje, usa body tal cual
    if (tipo === 'basico') {
      body = plantilla.body;
    }

    // Personalizado: si no hay mensaje, usa body de la plantilla como fallback
    if (tipo === 'personalizado' && !datos.mensaje) {
      const fallback = cartasPorTipo.basico[Math.floor(Math.random() * cartasPorTipo.basico.length)];
      body = fallback.body;
    }

    return {
      eyebrow: reemplazar(plantilla.eyebrow),
      title:   reemplazar(plantilla.title),
      body:    body,
      sign:    reemplazar(plantilla.sign),
      fotoUrl: tipo === 'premium' ? datos.fotoUrl : null,
    };
  }

  // ══ CARTA DIGITAL — RENDERIZAR EN DOM ══
  function renderizarCarta(contenido) {
    const msg = document.getElementById('demoMsg');
    msg.querySelector('.demo-msg-eyebrow').textContent = contenido.eyebrow;
    msg.querySelector('.demo-msg-title').textContent   = contenido.title;
    msg.querySelector('.demo-msg-body').innerHTML      = contenido.body.replace(/\n/g, '<br>');
    msg.querySelector('.demo-msg-sign').textContent    = contenido.sign;

    // Foto para Premium
    const fotoWrapper = document.getElementById('demoMsgFoto');
    const fotoImg     = document.getElementById('demoMsgFotoImg');
    if (contenido.fotoUrl) {
      fotoImg.src = contenido.fotoUrl;
      fotoWrapper.classList.remove('hidden');
    } else {
      fotoWrapper.classList.add('hidden');
      fotoImg.src = '';
    }
  }

  // ══ CARTA DIGITAL — ANIMACIÓN PRINCIPAL ══
  function playDemo() {
    if (demoPlayed) return;
    demoPlayed = true;

    const datos    = leerDatosFormulario();
    const contenido = construirContenidoCarta(tipoActivo, datos);
    renderizarCarta(contenido);

    const flap = document.getElementById('demoFlap');
    const card = document.getElementById('demoCard');
    const seal = document.getElementById('demoSeal');
    const env  = document.getElementById('demoEnv');
    const msg  = document.getElementById('demoMsg');

    setTimeout(() => { flap.classList.add('open'); seal.style.opacity = '0'; }, 200);
    setTimeout(() => { card.classList.add('rising'); }, 800);
    setTimeout(() => {
      const screen = document.querySelector('.demo-screen');
      ['💕', '🌸', '✨', '💖'].forEach((e, i) => {
        const el = document.createElement('div');
        el.textContent = e;
        el.style.cssText = `position:absolute;font-size:1.1rem;pointer-events:none;z-index:10;transition:transform .7s ease,opacity .7s ease;opacity:1;top:50%;left:50%;transform:translate(-50%,-50%)`;
        screen.appendChild(el);
        const angle = (i / 4) * Math.PI * 2;
        setTimeout(() => {
          el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * 55}px),calc(-50% + ${Math.sin(angle) * 55}px))`;
          el.style.opacity = '0';
        }, 30);
        setTimeout(() => el.remove(), 800);
      });
    }, 900);
    setTimeout(() => {
      env.style.display = 'none';
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('show'), 50);
    }, 1600);
  }

  function resetDemo() {
    demoPlayed = false;
    const flap = document.getElementById('demoFlap');
    const card = document.getElementById('demoCard');
    const seal = document.getElementById('demoSeal');
    const env  = document.getElementById('demoEnv');
    const msg  = document.getElementById('demoMsg');
    msg.classList.remove('show');
    setTimeout(() => {
      msg.classList.add('hidden');
      env.style.display = '';
      flap.classList.remove('open');
      card.classList.remove('rising');
      seal.style.opacity = '1';
    }, 400);
  }

  function actualizarLabelFoto(input) {
    const label = document.getElementById('cartaFotoLabel');
    if (input.files && input.files[0]) {
      label.textContent = `✅ ${input.files[0].name}`;
    } else {
      label.textContent = '📷 Subir foto del arreglo (opcional)';
    }
  }

  // ══ ACTIVE NAV ══
  const sections = document.querySelectorAll('section[id]');
  on(window, 'scroll',()=>{
    let current = '';
    sections.forEach(s=>{ if(window.scrollY >= s.offsetTop - 120) current = s.id; });
    document.querySelectorAll('.nav-link').forEach(a=>{
      a.style.color = '';
      if(a.getAttribute('href') === `#${current}`){
        a.style.color = navbar.classList.contains('scrolled') ? 'var(--rose)' : 'white';
      }
    });
  });

  // ══ GALERÍA DE PRODUCTOS ══
  function initGalleries() {
    document.querySelectorAll('.gallery').forEach(gallery => {
      const imgs = gallery.querySelectorAll('.gallery-img');
      const dotsContainer = gallery.querySelector('.gal-dots');
      if (!dotsContainer) return;

      // Crear dots
      imgs.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'gal-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(gallery, i);
        dotsContainer.appendChild(dot);
      });

      // Auto-slide cada 3s si hay más de 1 imagen
      if (imgs.length > 1) {
        every(() => slideGallery(gallery.querySelector('.gal-next'), 1), 3500);
      }
    });
  }

  function slideGallery(btn, dir) {
    const gallery = btn.closest('.gallery');
    const imgs = gallery.querySelectorAll('.gallery-img');
    const dots = gallery.querySelectorAll('.gal-dot');
    let current = [...imgs].findIndex(i => i.classList.contains('active'));
    imgs[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (current + dir + imgs.length) % imgs.length;
    imgs[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function goToSlide(gallery, index) {
    const imgs = gallery.querySelectorAll('.gallery-img');
    const dots = gallery.querySelectorAll('.gal-dot');
    imgs.forEach(i => i.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    imgs[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  // ══ CARTA DIGITAL — INICIALIZAR TIPO POR DEFECTO ══
  function initCartaTipo() {
    const primerPlan = document.querySelector('.carta-plan.selectable');
    if (primerPlan) seleccionarTipo(primerPlan);
  }



  // ══ LIGHTBOX ══
  let lbImages = [];
  let lbIndex  = 0;

  function initLightbox() {
    // Click en cualquier foto abre el lightbox
    document.querySelectorAll('.gallery').forEach(gallery => {
      const imgs = [...gallery.querySelectorAll('.gallery-img')];
      imgs.forEach((img, i) => {
        on(img, 'click', () => {
          lbImages = imgs.map(im => im.src);
          lbIndex  = i;
          lbOpen();
        });
      });
    });

    const lb = document.getElementById('lightbox');
    if(!lb) return;

    on(lb, 'click', e => { if(e.target === lb) lbClose(); });

    on(document, 'keydown', e => {
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape')      lbClose();
      if(e.key === 'ArrowLeft')   lbNav(-1);
      if(e.key === 'ArrowRight')  lbNav(1);
    });

    // Swipe móvil
    let tx = 0;
    on(lb, 'touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
    on(lb, 'touchend',   e => {
      const d = tx - e.changedTouches[0].clientX;
      if(Math.abs(d) > 50) lbNav(d > 0 ? 1 : -1);
    });
  }

  function lbOpen() {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cnt = document.getElementById('lightbox-counter');
    const prev = document.getElementById('lightbox-prev');
    const next = document.getElementById('lightbox-next');
    if(!lb || !img) return;
    img.src = lbImages[lbIndex];
    cnt.textContent = lbImages.length > 1 ? `${lbIndex + 1} / ${lbImages.length}` : '';
    prev.style.display = lbImages.length > 1 ? '' : 'none';
    next.style.display = lbImages.length > 1 ? '' : 'none';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function lbClose() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbNav(dir) {
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    const img = document.getElementById('lightbox-img');
    const cnt = document.getElementById('lightbox-counter');
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = lbImages[lbIndex];
      img.style.opacity = '1';
      cnt.textContent = `${lbIndex + 1} / ${lbImages.length}`;
    }, 150);
  }



  // ══ DELEGACIÓN DE EVENTOS (antes: onclick="..." en el HTML) ══
  const actions = { slideGallery, addToCart, orderProduct, sendOrder, seleccionarTipo, playDemo, resetDemo,
                    actualizarLabelFoto, submitReview, lbClose, lbNav };
  function dispatch(kind, e) {
    const el = e.target.closest ? e.target.closest(`[data-${kind}]`) : null;
    if (!el) return;
    const fn = actions[el.dataset[kind]];
    if (!fn) return;
    const args = JSON.parse(el.dataset.args || '[]').map(a => (a === '$el' ? el : a));
    fn(...args);
  }
  on(document, 'click', e => dispatch('click', e));
  on(document, 'change', e => dispatch('change', e));

  // ══ INICIALIZACIÓN (antes: DOMContentLoaded) ══
  initGalleries();
  initLightbox();
  initStarSelector();
  initCartaTipo();

  // Arranque: el loader nunca depende de servicios externos (se oculta aunque Supabase falle).
  // Con React el efecto puede ejecutarse cuando la página ya cargó, por eso se revisa readyState.
  if (document.readyState === 'complete') onReady(); else on(window, 'load', onReady);

  return () => {
    alive = false;
    offs.forEach(off => off());
    intervals.forEach(id => clearInterval(id));
    observers.forEach(o => o.disconnect());
    document.querySelectorAll('.gal-dots').forEach(d => { d.innerHTML = ''; });
    document.body.style.overflow = '';
  };
}