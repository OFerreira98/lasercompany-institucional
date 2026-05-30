/* ============================================================
   PAGE-INDEX, Lógica específica da Página Início
   ============================================================ */

(function() {

  function renderMarqueePopulares() {
    const track = document.getElementById('populares-marquee');
    if (!track) return;
    // 28/mai (cliente): nos "queridinhos" só entram procedimentos COM foto.
    // Sem foto, o card branco fica visualmente quebrado.
    const populares = window.LaserData.getPopulares().filter(p => !!p.img);
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

  /* ---------- ÍCONES DOS 4 PASSOS ----------
     SVG inline pra cada chave usada em window.LaserData.passos[i].icone.
     Stroke aceita 'currentColor' (herda do card). */
  const ICONES_PASSOS = {
    'spark': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>`,
    'map-pin': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    'whatsapp': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.4L4 21l2.2-4A8.5 8.5 0 1 1 20.5 11.5z"/><path d="M9.3 9.7c0 .8.4 1.8 1.2 2.8.8 1 1.7 1.7 2.6 2 .6.2 1.2.2 1.7-.1l.7-.5c.2-.1.5-.1.7.1l1 .8c.2.2.3.4.2.7-.3.6-.8 1-1.5 1.2-.7.2-1.6.1-2.6-.3-1.4-.5-2.7-1.4-3.8-2.5-1.1-1.1-1.9-2.4-2.4-3.7-.3-.9-.4-1.7-.2-2.4.2-.7.6-1.2 1.1-1.5.3-.1.6 0 .7.2l.8 1c.2.2.2.5.1.7l-.5.7c-.2.2-.3.4-.2.6z"/></svg>`,
    'calendar-check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M9 15l2 2 4-4"/></svg>`,
  };

  function renderPassos() {
    const grid = document.getElementById('steps-grid');
    if (!grid) return;
    const passos = window.LaserData.passos;

    // Quando o GSAP estiver carregado, motion.js dispara o stagger.
    grid.setAttribute('data-motion-stagger', '.step-item');

    grid.innerHTML = `
      <div class="steps-line" aria-hidden="true">
        <svg class="steps-wave motion-draw-line" preserveAspectRatio="none" viewBox="0 0 1000 14" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="stepsWaveGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%"  stop-color="#C8A064" stop-opacity="0"/>
              <stop offset="14%" stop-color="#C8A064" stop-opacity="0.85"/>
              <stop offset="50%" stop-color="#E8C088" stop-opacity="1"/>
              <stop offset="86%" stop-color="#C8A064" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#C8A064" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 0 7 C 62 1, 124 13, 187 7 S 312 1, 375 7 S 500 13, 562 7 S 687 1, 750 7 S 875 13, 937 7 S 1000 7, 1000 7"
                stroke="url(#stepsWaveGrad)" fill="none" stroke-width="1" stroke-linecap="round"/>
        </svg>
      </div>
      ${passos.map((p, i) => `
        <div class="step-item${p.cta ? ' step-item-cta' : ''}" data-step="${i + 1}">
          <div class="step-icon" aria-hidden="true">${ICONES_PASSOS[p.icone] || ''}</div>
          <div class="step-num">${p.n}</div>
          <h3 class="step-title">${p.titulo}</h3>
          <p class="step-desc">${p.desc}</p>
          ${p.cta ? `<a class="btn btn-primary btn-arrow step-cta" href="${p.cta.href}">${p.cta.label}</a>` : ''}
        </div>
      `).join('')}
    `;

    // CTA abaixo do grid: aparece SO no mobile (CSS controla via .steps-cta-row).
    // No desktop o botao continua dentro do passo 4 (intacto).
    const passoCta = passos.find(p => p.cta);
    if (passoCta) {
      grid.insertAdjacentHTML('afterend',
        `<div class="steps-cta-row"><a class="btn btn-primary btn-arrow step-cta" href="${passoCta.cta.href}">${passoCta.cta.label}</a></div>`
      );
    }

    // re-registra novos elementos com classes/data-attrs no motion
    if (window.LaserMotion) {
      window.LaserMotion.setupStagger(grid);
      window.LaserMotion.setupDrawLine(grid);
    }
  }

  function renderDepoimentos() {
    const grid = document.getElementById('depoimentos-grid');
    if (!grid) return;
    grid.innerHTML = window.LaserData.depoimentos.map(d => {
      const initials = d.nome.split(' ').map(w => w[0]).slice(0, 2).join('');
      const avatar = d.foto
        ? `<div class="depoimento-avatar depoimento-avatar-photo" style="background-image:url('${d.foto}'); background-position:${d.fotoPos || 'center 30%'};" aria-hidden="true"></div>`
        : `<div class="depoimento-avatar" aria-hidden="true">${initials}</div>`;
      return `
        <article class="depoimento-card">
          <p class="depoimento-texto">${d.texto}</p>
          <div class="depoimento-autor">
            ${avatar}
            <div>
              <div class="depoimento-info-nome">${d.nome}</div>
              <div class="depoimento-info-cidade">${d.cidade}</div>
            </div>
          </div>
        </article>
      `;
    }).join('');
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
        <div class="hero-slide-bg" style="background-image:url('${s.img}');${s.pos ? `background-position:${s.pos};` : ''}"></div>
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
      auto = setInterval(next, 4500);
    }

    document.getElementById('hero-next').addEventListener('click', () => go((current + 1) % total, true));
    document.getElementById('hero-prev').addEventListener('click', () => go((current - 1 + total) % total, true));
    dotsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.hero-dot');
      if (b) go(Number(b.dataset.i), true);
    });

    // suporte a teclado (← →) quando o carrossel está em foco
    const hero = document.getElementById('hero-carousel');
    hero.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); restartAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); restartAuto(); }
    });

    // Pausa o autoplay quando a aba sai de foco (Page Visibility) pra economizar
    // recursos, e retoma quando volta. NÃO pausa no hover, porque o cliente
    // quer ver o carrossel passando sempre.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(auto);
      else restartAuto();
    });

    restartAuto();
  }

  /* ---------- Count-up dos stats do Sobre ----------
     Função agora gerenciada pelo motion.js via GSAP/ScrollTrigger
     (usa data-counter, data-prefix, data-suffix, data-duration nos
     <span class="stat-num">). Mantido aqui só como no-op pra não
     quebrar o init que chamava animateCountUp(). */
  function animateCountUp() {
    // intencionalmente vazio: ver scripts/motion.js -> setupCounters()
  }

  function renderSocial() {
    const grid = document.getElementById('social-grid');
    if (!grid || !window.LaserData.social) return;
    const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="8 5 19 12 8 19 8 5"/></svg>';
    const igIcon   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';
    grid.innerHTML = window.LaserData.social.map(s => `
      <a class="social-card" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.titulo}">
        <div class="social-card-img" style="background-image:url('${s.img}')"></div>
        <div class="social-card-overlay">
          <span class="social-card-ico">${s.tipo === 'video' ? playIcon : igIcon}</span>
          <span class="social-card-cap">${s.titulo}</span>
        </div>
      </a>
    `).join('');
  }

  /* ---------- BLOG (4 cards rotativos, embaralhados a cada load) ----------
     A home tem 40 matérias importadas do site oficial. Mostra 4 por vez,
     embaralhadas a cada carga da página. A cada ~9s troca pra outras 4
     (visibility-aware: pausa quando a aba não está visível). */
  const BLOG_VISIBLE = 4;
  const BLOG_ROTATE_MS = 9000;
  let _blogPool = [];
  let _blogTimer = null;

  function shuffleBlog(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Fallback bonito pros 2 posts que vieram sem imagem
  // (gradiente vinho/dourado da marca, com a logo aparecendo discreta).
  function blogCover(p) {
    if (p.img) {
      return `<div class="blog-card-img" style="background-image:url('${p.img}')"></div>`;
    }
    return `<div class="blog-card-img blog-card-img-placeholder"></div>`;
  }

  function blogCardHTML(p) {
    const safe = p.titulo.replace(/"/g, '&quot;');
    return `
      <article class="blog-card reveal">
        <a class="blog-card-cover" href="${p.url}" target="_blank" rel="noopener" aria-label="${safe}">
          ${blogCover(p)}
        </a>
        <div class="blog-card-body">
          <h3 class="blog-card-title">
            <a href="${p.url}" target="_blank" rel="noopener">${p.titulo}</a>
          </h3>
          <p class="blog-card-preview">${p.preview}</p>
          <a class="blog-card-cta" href="${p.url}" target="_blank" rel="noopener">
            Continue lendo &rarr;
          </a>
        </div>
      </article>
    `;
  }

  function renderBlogSet(grid) {
    if (!_blogPool.length) return;
    // pega os próximos N e remove-os do pool. quando esvazia, reshuffle.
    if (_blogPool.length < BLOG_VISIBLE) {
      _blogPool = shuffleBlog(window.LaserData.blog);
    }
    const visible = _blogPool.splice(0, BLOG_VISIBLE);
    // fade-out + replace + fade-in
    grid.style.opacity = '0';
    setTimeout(() => {
      grid.innerHTML = visible.map(blogCardHTML).join('');
      grid.style.opacity = '1';
      // observa os novos cards pro IntersectionObserver de .reveal
      if (window._revealObs) {
        grid.querySelectorAll('.reveal').forEach(el => window._revealObs.observe(el));
      } else {
        // se ainda não tem observer global, deixa visíveis direto
        grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      }
    }, 250);
  }

  function renderBlog() {
    const grid = document.getElementById('blog-grid');
    if (!grid || !window.LaserData.blog) return;
    grid.style.transition = 'opacity 0.35s ease';
    _blogPool = shuffleBlog(window.LaserData.blog);
    renderBlogSet(grid);

    // limpa qualquer rotação anterior
    if (_blogTimer) { clearInterval(_blogTimer); _blogTimer = null; }
    // só auto-roda se houver mais matérias além das visíveis
    if (window.LaserData.blog.length > BLOG_VISIBLE) {
      _blogTimer = setInterval(() => renderBlogSet(grid), BLOG_ROTATE_MS);
    }

    // pausa quando a aba sai de foco, retoma quando volta
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && _blogTimer) {
        clearInterval(_blogTimer); _blogTimer = null;
      } else if (!document.hidden && !_blogTimer && window.LaserData.blog.length > BLOG_VISIBLE) {
        _blogTimer = setInterval(() => renderBlogSet(grid), BLOG_ROTATE_MS);
      }
    });
  }

  /* ---------- AGENDAMENTO CURTO (form no fim da home) ---------- */
  function bindAgendamentoCurto() {
    const form = document.getElementById('ag-curto-form');
    if (!form || !window.LaserData) return;
    const unidades = window.LaserData.unidades || [];
    const selUF  = form.querySelector('[name="uf"]');
    const selCid = form.querySelector('[name="cidade"]');
    const selUni = form.querySelector('[name="unidade"]');
    const whats  = form.querySelector('[name="whatsapp"]');
    const dataIn = form.querySelector('[name="data"]');

    // popula UFs
    const ufs = Array.from(new Set(unidades.map(u => u.uf))).sort();
    selUF.innerHTML = '<option value="">UF</option>' + ufs.map(uf => `<option value="${uf}">${uf}</option>`).join('');

    selUF.addEventListener('change', () => {
      const uf = selUF.value;
      const cidades = uf
        ? Array.from(new Set(unidades.filter(u => u.uf === uf).map(u => u.cidade))).sort((a, b) => a.localeCompare(b, 'pt-BR'))
        : [];
      selCid.innerHTML = '<option value="">Cidade</option>' + cidades.map(c => `<option value="${c}">${c}</option>`).join('');
      selCid.disabled = !cidades.length;
      selUni.innerHTML = '<option value="">Unidade</option>';
      selUni.disabled = true;
    });

    selCid.addEventListener('change', () => {
      const list = unidades.filter(u => u.uf === selUF.value && u.cidade === selCid.value);
      selUni.innerHTML = '<option value="">Unidade</option>' + list.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
      selUni.disabled = !list.length;
      if (list.length === 1) selUni.value = list[0].id;
    });

    // máscara de whatsapp
    whats.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });

    // data mínima = hoje
    const today = new Date().toISOString().split('T')[0];
    dataIn.setAttribute('min', today);

    function validate(field) {
      const el = field.querySelector('.input');
      const v = (el.value || '').trim();
      let ok = true;
      if (el.required && !v) ok = false;
      if (el.name === 'whatsapp' && v.replace(/\D/g, '').length < 10) ok = false;
      field.classList.toggle('has-error', !ok);
      return ok;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('.field:not(.ag-cta-field)');
      let ok = true;
      fields.forEach(f => { if (!validate(f)) ok = false; });
      if (!ok) return;

      const unidade = unidades.find(u => u.id === selUni.value);
      const payload = {
        nome: form.querySelector('[name="nome"]').value.trim(),
        whatsapp: whats.value.trim(),
        uf: selUF.value,
        cidade: selCid.value,
        unidadeId: selUni.value,
        unidadeNome: unidade ? unidade.nome : null,
        data: dataIn.value,
      };

      window.LaserAnalytics && window.LaserAnalytics.trackLead && window.LaserAnalytics.trackLead('agendamento_home', payload);

      // mostra sucesso
      Array.from(form.children).forEach(c => { if (!c.classList.contains('ag-success')) c.style.display = 'none'; });
      const ok2 = document.getElementById('ag-success');
      ok2.hidden = false;
      if (unidade) {
        const dataBR = payload.data ? payload.data.split('-').reverse().join('/') : '';
        document.getElementById('ag-success-title').textContent = 'Recebemos sua solicitação';
        document.getElementById('ag-success-msg').textContent = `A unidade ${unidade.nome} (${unidade.cidade}/${unidade.uf}) vai te chamar pra confirmar o horário do dia ${dataBR}.`;
        const num = (unidade.whatsapp || '').replace(/\D/g, '');
        const msg = `Olá ${unidade.nome}! Sou ${payload.nome}, preenchi o agendamento no site da Laser & Co para o dia ${dataBR}.`;
        const wa = document.getElementById('ag-success-wa');
        wa.href = num ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : '#';
      }
    });
  }

  function init() {
    renderHero();
    renderMarqueePopulares();
    renderPassos();
    renderSocial();
    renderDepoimentos();
    renderBlog();
    bindAgendamentoCurto();
    animateCountUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
