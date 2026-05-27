/* ============================================================
   PAGE-INDEX, Lógica específica da Página Início
   ============================================================ */

(function() {

  function renderMarqueePopulares() {
    const track = document.getElementById('populares-marquee');
    if (!track) return;
    const populares = window.LaserData.getPopulares();
    const catLabel = { estetica: 'Estética', depilacao: 'Depilação', ultrassom: 'Ultrassom' };

    // Para um loop infinito perfeito, duplicamos o conteúdo
    const allItems = [...populares, ...populares];

    track.innerHTML = allItems.map(p => `
      <a href="agendamento.html?procedimento=${p.id}" class="marquee-card">
        <div class="marquee-card-image" style="${p.img ? `background-image: url('${p.img}')` : ''}"></div>
        <div class="marquee-card-body">
          <span class="marquee-card-cat">${catLabel[p.categoria]}</span>
          <h3 class="marquee-card-title">${p.nome}</h3>
          <span class="marquee-card-cta">Agendar →</span>
        </div>
      </a>
    `).join('');
  }

  function renderPassos() {
    const grid = document.getElementById('steps-grid');
    if (!grid) return;
    grid.innerHTML = window.LaserData.passos.map(p => `
      <div class="step-item${p.cta ? ' step-item-cta' : ''}">
        <div class="step-num">${p.n}</div>
        <h3 class="step-title">${p.titulo}</h3>
        <p class="step-desc">${p.desc}</p>
        ${p.cta ? `<a class="btn btn-primary btn-arrow step-cta" href="${p.cta.href}">${p.cta.label}</a>` : ''}
      </div>
    `).join('');
  }

  function renderDepoimentos() {
    const grid = document.getElementById('depoimentos-grid');
    if (!grid) return;
    grid.innerHTML = window.LaserData.depoimentos.map(d => `
      <article class="depoimento-card">
        <p class="depoimento-texto">${d.texto}</p>
        <div class="depoimento-autor">
          <div class="depoimento-avatar" aria-hidden="true">${d.nome.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
          <div>
            <div class="depoimento-info-nome">${d.nome}</div>
            <div class="depoimento-info-cidade">${d.cidade}</div>
          </div>
        </div>
      </article>
    `).join('');
  }

  /* ---------- HERO CARROSSEL ---------- */
  function shuffleSlides(arr) {
    // mantém o "premium" como primeiro slide e embaralha os outros (randômico, mas estável dentro da sessão)
    const first = arr.find(s => s.id === 'premium');
    const rest  = arr.filter(s => s.id !== 'premium');
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return first ? [first, ...rest] : rest;
  }

  function renderHero() {
    const slidesEl = document.getElementById('hero-slides');
    const dotsEl   = document.getElementById('hero-dots');
    if (!slidesEl || !window.LaserData.hero) return;

    const slides = shuffleSlides(window.LaserData.hero);

    slidesEl.innerHTML = slides.map((s, i) => `
      <article class="hero-slide${i === 0 ? ' is-active' : ''}" data-slide="${s.id}" aria-roledescription="slide" aria-hidden="${i === 0 ? 'false' : 'true'}">
        <div class="hero-slide-bg" style="background-image:url('${s.img}')"></div>
        <div class="hero-slide-overlay" aria-hidden="true"></div>
        <div class="container hero-slide-content">
          <div class="hero-grid">
            <div class="hero-text">
              <div class="glass-pill"><span class="dot"></span>${s.eyebrow}</div>
              <h1 class="hero-title">${s.title} <br><span class="italic">${s.titleItalic}</span></h1>
              <p class="hero-sub">${s.sub}</p>
              <div class="hero-actions">
                <a href="${s.ctaPrimary.href}" class="btn btn-primary btn-lg btn-arrow">${s.ctaPrimary.label}</a>
                ${s.ctaGhost ? `<a href="${s.ctaGhost.href}" class="btn btn-ghost btn-lg">${s.ctaGhost.label}</a>` : ''}
              </div>
            </div>
            <div class="hero-logo-floating" aria-hidden="true">
              <img src="assets/logos/avatar-andco-transparente.png" alt="">
            </div>
          </div>
        </div>
      </article>
    `).join('');

    dotsEl.innerHTML = slides.map((s, i) => `
      <button class="hero-dot${i === 0 ? ' is-active' : ''}" data-i="${i}" role="tab" aria-label="Ir para banner ${i + 1}" aria-selected="${i === 0}"></button>
    `).join('');

    let current = 0;
    const total = slides.length;
    let auto = null;

    function go(to, manual) {
      const slideEls = slidesEl.querySelectorAll('.hero-slide');
      const dotEls   = dotsEl.querySelectorAll('.hero-dot');
      slideEls.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === to);
        el.setAttribute('aria-hidden', idx === to ? 'false' : 'true');
      });
      dotEls.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === to);
        el.setAttribute('aria-selected', idx === to);
      });
      current = to;
      if (manual) restartAuto();
    }
    function next() { go((current + 1) % total); }
    function prev() { go((current - 1 + total) % total); }
    function restartAuto() {
      clearInterval(auto);
      auto = setInterval(next, 7000);
    }

    document.getElementById('hero-next').addEventListener('click', () => go((current + 1) % total, true));
    document.getElementById('hero-prev').addEventListener('click', () => go((current - 1 + total) % total, true));
    dotsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.hero-dot');
      if (b) go(Number(b.dataset.i), true);
    });

    // pausa ao passar o mouse, retoma ao sair
    const hero = document.getElementById('hero-carousel');
    hero.addEventListener('mouseenter', () => clearInterval(auto));
    hero.addEventListener('mouseleave', restartAuto);

    // suporte a teclado (← →) quando o carrossel está em foco
    hero.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); restartAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); restartAuto(); }
    });

    restartAuto();
  }

  /* ---------- Count-up dos stats do Sobre ---------- */
  function animateCountUp() {
    const targets = document.querySelectorAll('.sobre-stats .stat-num');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = '1';
        const el = entry.target;
        const original = el.textContent.trim();
        // extrai número e sufixo/prefixo (ex: "+70", "12x", "15", "5")
        const match = original.match(/^([^\d]*)(\d+)(.*)$/);
        if (!match) return;
        const prefix = match[1], target = parseInt(match[2], 10), suffix = match[3];
        let cur = 0;
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          cur = Math.round(target * eased);
          el.textContent = `${prefix}${cur}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });

    targets.forEach(el => io.observe(el));
  }

  function renderBlog() {
    const grid = document.getElementById('blog-grid');
    if (!grid || !window.LaserData.blog) return;
    grid.innerHTML = window.LaserData.blog.map(p => `
      <article class="blog-card">
        <a class="blog-card-cover" href="#" aria-label="${p.titulo}">
          <div class="blog-card-img" style="background-image:url('${p.img}')"></div>
        </a>
        <div class="blog-card-body">
          <span class="blog-card-cat">${p.categoria}</span>
          <h3 class="blog-card-title"><a href="#">${p.titulo}</a></h3>
          <p class="blog-card-preview">${p.preview}</p>
          <div class="blog-card-meta">
            <span>${p.data}</span>
            <span aria-hidden="true">•</span>
            <span>${p.tempoLeitura}</span>
          </div>
          <a class="blog-card-cta" href="#">Ler artigo &rarr;</a>
        </div>
      </article>
    `).join('');
  }

  function init() {
    renderHero();
    renderMarqueePopulares();
    renderPassos();
    renderDepoimentos();
    renderBlog();
    animateCountUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
