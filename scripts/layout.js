/* ============================================================
   LAYOUT, Injeção do header e footer compartilhados
   ============================================================
   Cada página inclui:
     <div data-include="header"></div>
     <div data-include="footer"></div>
   E este script substitui esses divs pelo HTML correspondente.
   ============================================================ */

(function() {
  const HEADER = `
<header class="site-header site-header-clean" id="site-header">
  <div class="header-row">
    <a href="index.html" class="header-brand" aria-label="Laser & Co">
      <img src="assets/logos/logo-bold-dourado.png" alt="Laser & Co">
    </a>
    <nav class="header-nav header-capsule" aria-label="Menu principal">
      <div class="nav-item"><a href="index.html" class="nav-link" data-page="index">Início</a></div>
      <div class="nav-item nav-item-mega">
        <a href="procedimentos.html" class="nav-link" data-page="procedimentos">Procedimentos <span class="caret">▾</span></a>
        <div class="nav-submenu nav-mega" role="menu">
          <div class="nav-mega-col" data-mega-cat="estetica">
            <a href="procedimentos.html?tab=estetica" class="nav-mega-title">Estética a Laser</a>
            <ul class="nav-mega-list" aria-label="Procedimentos de estética"></ul>
            <a href="procedimentos.html?tab=estetica" class="nav-mega-all">Ver todos os tratamentos &rarr;</a>
          </div>
          <div class="nav-mega-col" data-mega-cat="depilacao">
            <a href="procedimentos.html?tab=depilacao" class="nav-mega-title">Depilação a Laser</a>
            <ul class="nav-mega-list" aria-label="Áreas de depilação"></ul>
            <a href="procedimentos.html?tab=depilacao" class="nav-mega-all">Ver todas as áreas &rarr;</a>
          </div>
          <div class="nav-mega-col" data-mega-cat="ultrassom">
            <a href="procedimentos.html?tab=ultrassom" class="nav-mega-title">Ultrassom</a>
            <ul class="nav-mega-list" aria-label="Tratamentos de ultrassom"></ul>
            <a href="procedimentos.html?tab=ultrassom" class="nav-mega-all">Ver todos os tratamentos &rarr;</a>
          </div>
        </div>
      </div>
      <div class="nav-item"><a href="agendamento.html" class="nav-link" data-page="agendamento">Agendamento</a></div>
      <div class="nav-item"><a href="unidades.html" class="nav-link" data-page="unidades">Unidades</a></div>
      <div class="nav-item"><a href="vagas.html" class="nav-link" data-page="vagas">Vagas</a></div>
      <div class="nav-item nav-item-franqueado-mobile"><a href="franqueado.html" class="nav-link" data-page="franqueado">Seja um franqueado</a></div>
      <div class="nav-item nav-item-sac-mobile"><button type="button" class="nav-link nav-link-as-btn" data-sac-open>SAC</button></div>
    </nav>
    <div class="header-cta">
      <button type="button" class="btn btn-ghost-light btn-sm" data-sac-open aria-label="SAC">SAC</button>
      <a href="franqueado.html" class="btn btn-franqueado btn-sm" data-page="franqueado">Seja um franqueado</a>
      <a href="agendamento.html" class="btn btn-primary btn-sm">Agendar avaliação grátis</a>
    </div>
    <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menu">
      <span class="bars"><span></span><span></span><span></span></span>
    </button>
  </div>
</header>`;

  const SAC_MODAL = `
<div class="sac-overlay" id="sac-overlay" role="dialog" aria-modal="true" aria-labelledby="sac-title" hidden>
  <div class="sac-modal">
    <button type="button" class="sac-close" aria-label="Fechar" data-sac-close>&times;</button>

    <div class="sac-grid">
      <div class="sac-form-col">
        <span class="sac-eyebrow">Fale conosco</span>
        <h2 id="sac-title" class="sac-title">SAC Laser &amp; Co</h2>
        <p class="sac-sub">Conta pra gente o que está acontecendo. A gente responde rápido.</p>

        <form class="sac-form" id="sac-form" novalidate>
          <div class="popup-fields-row">
            <div class="field">
              <input type="text" id="sac-nome" name="nome" class="input" placeholder="Seu nome" required autocomplete="name">
              <div class="field-error">Informe seu nome.</div>
            </div>
            <div class="field">
              <input type="tel" id="sac-whatsapp" name="whatsapp" class="input" placeholder="WhatsApp" inputmode="tel" required autocomplete="tel-national">
              <div class="field-error">WhatsApp inválido.</div>
            </div>
          </div>
          <div class="field">
            <input type="email" id="sac-email" name="email" class="input" placeholder="E-mail" required autocomplete="email">
            <div class="field-error">E-mail inválido.</div>
          </div>
          <div class="field">
            <select id="sac-area" name="area" class="input" required>
              <option value="">Área que gostaria de conversar</option>
              <option value="ouvidoria">Ouvidoria</option>
              <option value="elogio">Elogio</option>
              <option value="duvida">Dúvida</option>
              <option value="outros">Outros</option>
            </select>
            <div class="field-error">Selecione uma área.</div>
          </div>
          <div class="field">
            <textarea id="sac-mensagem" name="mensagem" class="input sac-textarea" placeholder="Escreva sua mensagem" rows="4" required></textarea>
            <div class="field-error">Escreva sua mensagem.</div>
          </div>
          <button type="submit" class="btn btn-primary btn-block" id="sac-submit">
            <span class="btn-text">Enviar mensagem</span>
          </button>
        </form>

        <div class="sac-success" id="sac-success" hidden>
          <div class="sac-success-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Recebemos sua mensagem.</h3>
          <p>Em breve, nosso SAC entra em contato.</p>
        </div>
      </div>

      <aside class="sac-contact-col">
        <span class="sac-eyebrow">Contato direto</span>
        <h3 class="sac-contact-title">Prefere falar agora?</h3>
        <p class="sac-contact-sub">Entre em contato por um dos nossos canais.</p>

        <a class="sac-contact-link" href="tel:+551147764057">
          <span class="sac-contact-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
          </span>
          <span>
            <strong>Telefone do SAC</strong>
            <small>(11) 4776-4057</small>
          </span>
        </a>

        <a class="sac-contact-link" href="https://wa.me/5511947764057" target="_blank" rel="noopener">
          <span class="sac-contact-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
          </span>
          <span>
            <strong>WhatsApp do SAC</strong>
            <small>(11) 94776-4057</small>
          </span>
        </a>

        <a class="sac-contact-link" href="mailto:sac@lasercompany.com">
          <span class="sac-contact-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </span>
          <span>
            <strong>E-mail do SAC</strong>
            <small>sac@lasercompany.com</small>
          </span>
        </a>
      </aside>
    </div>
  </div>
</div>`;

  const FOOTER = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-brand">
          <img src="assets/logos/logo-bold-dourado.png" alt="Laser & Co">
        </div>
        <p class="footer-text">A primeira rede do Brasil a unir laser e ultrassom, democratizando o acesso à estética premium. Mais de 70 unidades em 15 estados.</p>
        <div class="footer-contact">
          <a href="https://wa.me/5511947764057" target="_blank" rel="noopener">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            (11) 94776-4057
          </a>
          <a href="mailto:sac@lasercompany.com">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            sac@lasercompany.com
          </a>
          <a href="#" style="cursor: default;">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Rua Alvorada, 1047, Vila Olímpia, São Paulo/SP
          </a>
        </div>
        <div class="footer-social">
          <a href="https://instagram.com/lasercompanybrasil" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://facebook.com/laserecoficial" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="#" aria-label="TikTok">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V7.79a8.16 8.16 0 004.77 1.52V5.92a4.85 4.85 0 01-1.84-.23z"/></svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Mapa do site</div>
        <nav class="footer-links" aria-label="Mapa do site">
          <a href="index.html">Início</a>
          <a href="procedimentos.html">Procedimentos</a>
          <a href="agendamento.html">Agendamento</a>
          <a href="unidades.html">Unidades</a>
          <a href="blog.html">Blog</a>
          <a href="vagas.html">Vagas / Trabalhe Conosco</a>
          <a href="franqueado.html">Seja um Franqueado</a>
        </nav>
      </div>
      <div class="footer-col">
        <div class="footer-franchise-card">
          <span class="footer-franchise-eyebrow">Seja um franqueado</span>
          <h4 class="footer-franchise-title">Invista no <span class="italic">setor que mais cresce</span> no Brasil.</h4>
          <p class="footer-franchise-text">A maior rede de laser estético do Brasil. Solicite uma apresentação completa agora mesmo.</p>
          <a href="franqueado.html" class="btn btn-primary btn-lg btn-arrow">Quero ser um franqueado</a>
        </div>
      </div>
    </div>
    <div class="footer-media">
      <span class="footer-media-eyebrow">Saiu na mídia</span>
      <p class="footer-media-sub">A Laser &amp; Co é destaque em veículos especializados em franquia e estética.</p>
      <div class="footer-media-strip" id="footer-media-strip">
        <a class="footer-media-slot" href="https://vejario.abril.com.br/coluna/otavio-furtado/rede-de-tratamentos-esteticos-anitta-como-socia/" target="_blank" rel="noopener"><span>Veja</span></a>
        <a class="footer-media-slot" href="https://www.abfexpo.com.br/imprensa/novas-marcas-ampliam-diversidade-e-indicam-tendencias-na-abf-fra/" target="_blank" rel="noopener"><span>ABF</span></a>
        <a class="footer-media-slot" href="https://acirpriopreto.com.br/servicos-para-saude-e-beleza-viram-os-novos-queridinhos-dos-shoppings/" target="_blank" rel="noopener"><span>Varejo</span></a>
        <a class="footer-media-slot" href="https://agendacarioca.com.br/laser-co-acelera-expansao-no-rio-e-projeto-de-clinica-boutique/" target="_blank" rel="noopener"><span>Agenda Carioca</span></a>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© 2026 Laser &amp; Co Brasil. Todos os direitos reservados.</div>
      <div class="footer-legal">
        <span>CNPJ 53.078.691/0001-07</span>
        <a href="#">Política de Privacidade</a>
        <a href="#">Termos de Uso</a>
        <a href="painel.html" class="footer-painel-link">Acesso Franqueados</a>
      </div>
    </div>
  </div>
</footer>`;

  const PARTIALS = { header: HEADER, footer: FOOTER };

  function inject() {
    document.querySelectorAll('[data-include]').forEach(el => {
      const name = el.dataset.include;
      if (PARTIALS[name]) {
        el.outerHTML = PARTIALS[name];
      }
    });
    // injeta o modal do SAC uma vez por página
    if (!document.getElementById('sac-overlay')) {
      document.body.insertAdjacentHTML('beforeend', SAC_MODAL);
      bindSAC();
    }
    // marca o header como "rolado" depois de uns px (sombra mais forte, logo menor)
    bindHeaderScroll();
    // popula o mega-menu de procedimentos a partir de window.LaserData
    populateMegaMenu();
    // carrega GSAP + ScrollTrigger + Lenis + motion.js (em ordem)
    injectMotionScripts();
  }

  /* ---------- MOTION (GSAP + ScrollTrigger + Lenis) ----------
     Carrega via CDN em sequência. Não roda no painel (data-body do
     dashboard). Cada página automaticamente ganha as animações sem
     precisar adicionar <script> no HTML. */
  function injectMotionScripts() {
    if (window._motionInjected) return;
    if (document.body.classList.contains('painel-body')) return;
    window._motionInjected = true;

    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
      'https://unpkg.com/lenis@1.0.42/dist/lenis.min.js',
      'scripts/motion.js',
    ];

    let i = 0;
    function next() {
      if (i >= scripts.length) return;
      const url = scripts[i++];
      const s = document.createElement('script');
      s.src = url;
      s.async = false;
      s.onload = next;
      s.onerror = () => {
        console.warn('motion: falha ao carregar', url);
        next();
      };
      document.body.appendChild(s);
    }
    next();
  }

  /* ---------- mega-menu de procedimentos ---------- */
  function populateMegaMenu(retries) {
    if (!window.LaserData || !window.LaserData.procedimentos) {
      // o data.js ainda não carregou, tenta de novo em 100ms (até 30x)
      if ((retries || 0) < 30) setTimeout(() => populateMegaMenu((retries || 0) + 1), 100);
      return;
    }
    const procs = window.LaserData.procedimentos;
    document.querySelectorAll('[data-mega-cat]').forEach(col => {
      const cat = col.dataset.megaCat;
      const list = col.querySelector('.nav-mega-list');
      if (!list) return;
      const items = (procs[cat] || []).slice(0, 6);
      list.innerHTML = items.map(p => {
        const id = p.id || (p.nome || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const label = p.nome || p.titulo || id;
        return `<li><a class="nav-mega-link" href="procedimentos.html?tab=${cat}&proc=${id}">${label}</a></li>`;
      }).join('');
    });
  }

  /* ---------- SAC modal ---------- */
  function bindSAC() {
    const overlay = document.getElementById('sac-overlay');
    if (!overlay) return;
    const form    = overlay.querySelector('#sac-form');
    const success = overlay.querySelector('#sac-success');
    const waEl    = overlay.querySelector('#sac-whatsapp');

    // máscara WhatsApp simples
    waEl.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
      else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
      else if (v.length > 0) v = '(' + v + ')';
      e.target.value = v;
    });

    function openSAC() {
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add('visible'));
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const f = overlay.querySelector('input[name="nome"]');
        if (f) f.focus();
      }, 200);
    }
    function closeSAC() {
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      setTimeout(() => { overlay.hidden = true; }, 220);
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-sac-open]')) { e.preventDefault(); openSAC(); }
      if (e.target.closest('[data-sac-close]')) { e.preventDefault(); closeSAC(); }
      if (e.target === overlay) closeSAC();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('visible')) closeSAC();
    });

    function validate(field) {
      const el = field.querySelector('.input');
      const v = (el.value || '').trim();
      let ok = true;
      if (el.required && !v) ok = false;
      if (el.name === 'whatsapp' && v.replace(/\D/g, '').length < 10) ok = false;
      if (el.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ok = false;
      field.classList.toggle('has-error', !ok);
      return ok;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('.field');
      let ok = true;
      fields.forEach(f => { if (!validate(f)) ok = false; });
      if (!ok) return;

      const payload = {
        nome: form.querySelector('#sac-nome').value.trim(),
        whatsapp: form.querySelector('#sac-whatsapp').value.trim(),
        email: form.querySelector('#sac-email').value.trim(),
        area: form.querySelector('#sac-area').value,
        mensagem: form.querySelector('#sac-mensagem').value.trim(),
      };

      window.LaserAnalytics && window.LaserAnalytics.trackLead && window.LaserAnalytics.trackLead('sac', payload);
      form.hidden = true;
      success.hidden = false;
    });

    form.querySelectorAll('.input').forEach(el => {
      el.addEventListener('blur',  () => validate(el.closest('.field')));
      el.addEventListener('change',() => el.closest('.field').classList.remove('has-error'));
      el.addEventListener('input', () => el.closest('.field').classList.remove('has-error'));
    });
  }

  /* ---------- header scroll behavior ---------- */
  // Esconde quando o usuário rola pra baixo, mostra quando volta a rolar
  // pra cima ou está no topo da página.
  // Na home: header começa transparente sobre o hero e ganha .scrolled
  // (fundo branco) assim que o usuário passa do hero.
  function bindHeaderScroll() {
    const h = document.getElementById('site-header');
    if (!h) return;
    // Qualquer página com hero escuro (home, unidades, procedimentos,
    // franqueado) usa o mesmo padrão: header transparente sobre a foto e
    // fica branco depois que o usuário rola pra fora do hero.
    const darkHero = document.querySelector('.hero, .page-hero-photo-bg, .franqueado-hero');
    const isOverlayMode = !!darkHero;
    if (isOverlayMode) document.body.classList.add('page-has-dark-hero');

    let lastY = window.scrollY;
    const threshold = 8; // px mínimos pra contar como rolagem
    const topZone   = 80; // dentro dessa faixa do topo o header sempre aparece

    const heroBreakpoint = () => {
      if (!darkHero) return 0;
      // ~85% da altura real do hero (não do viewport) — deixa um respiro
      // pra evitar flicker bem na borda do slide / da foto.
      const r = darkHero.getBoundingClientRect();
      const heroBottom = r.top + window.scrollY + r.height;
      return Math.max(heroBottom * 0.85, 240);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY;

      if (y <= topZone) {
        h.classList.remove('is-hidden');
      } else if (diff > threshold) {
        h.classList.add('is-hidden');
      } else if (diff < -threshold) {
        h.classList.remove('is-hidden');
      }

      if (isOverlayMode) {
        if (y > heroBreakpoint()) {
          h.classList.add('scrolled');
        } else {
          h.classList.remove('scrolled');
        }
      } else {
        // páginas sem hero escuro (contato/blog/agendamento/vagas): branco sempre
        h.classList.add('scrolled');
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
