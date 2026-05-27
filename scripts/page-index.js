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
