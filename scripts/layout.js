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
<header class="site-header" id="site-header">
  <div class="header-row">
    <a href="index.html" class="header-brand" aria-label="Laser & Co">
      <img src="assets/logos/logo-bold-dourado.png" alt="Laser & Co">
    </a>
    <nav class="header-nav header-capsule" aria-label="Menu principal">
      <div class="nav-item"><a href="index.html" class="nav-link" data-page="index">Início</a></div>
      <div class="nav-item">
        <a href="procedimentos.html" class="nav-link" data-page="procedimentos">Procedimentos <span class="caret">▾</span></a>
        <div class="nav-submenu">
          <div class="nav-submenu-label">Nossas três frentes</div>
          <a href="procedimentos.html?tab=estetica" class="nav-submenu-link">Estética a Laser</a>
          <a href="procedimentos.html?tab=depilacao" class="nav-submenu-link">Depilação a Laser</a>
          <a href="procedimentos.html?tab=ultrassom" class="nav-submenu-link">Ultrassom</a>
        </div>
      </div>
      <div class="nav-item"><a href="agendamento.html" class="nav-link" data-page="agendamento">Agendamento</a></div>
      <div class="nav-item"><a href="unidades.html" class="nav-link" data-page="unidades">Unidades</a></div>
      <div class="nav-item"><a href="vagas.html" class="nav-link" data-page="vagas">Vagas</a></div>
    </nav>
    <div class="header-cta">
      <a href="agendamento.html" class="btn btn-primary btn-sm">Agendar avaliação grátis</a>
    </div>
    <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menu">
      <span class="bars"><span></span><span></span><span></span></span>
    </button>
  </div>
</header>`;

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
    <div class="footer-bottom">
      <div>© 2026 Laser &amp; Co Brasil. Todos os direitos reservados.</div>
      <div class="footer-legal">
        <span>CNPJ 53.078.691/0001-07</span>
        <a href="#">Política de Privacidade</a>
        <a href="#">Termos de Uso</a>
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
