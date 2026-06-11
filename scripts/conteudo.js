/* ============================================================
   CONTEÚDO EDITÁVEL (CMS), reunião Will 09/06/2026
   ============================================================
   Busca os overrides editados no painel (/api/conteudo) e expõe
   em window.LaserConteudo. Nunca bloqueia a página: quem precisa
   do conteúdo espera LaserConteudo.ready, que resolve no máximo
   em ~1.2s (com ou sem resposta da API).

   Chaves usadas hoje:
   - popupProcedimento: 'Rejuvenescimento Facial'
   - heroBanners: [{ img: url }]  (banner = arte inteira do Will)
   - menuCor: '' | 'branco' | 'vinho'
   - sobre: { titulo, lead, texto, imagem, esconderNumeros }
   ============================================================ */
window.LaserConteudo = (function () {
  let _data = null;

  const fetchPromise = (typeof fetch === 'function'
    ? fetch('/api/conteudo')
        .then((r) => (r.ok ? r.json() : {}))
        .then((j) => { _data = (j && j.conteudo) || {}; return _data; })
        .catch(() => { _data = {}; return _data; })
    : Promise.resolve((_data = {})));

  const ready = Promise.race([
    fetchPromise,
    new Promise((res) => setTimeout(() => res(_data || {}), 1200)),
  ]);

  function get() { return _data || {}; }

  /* Aplica os overrides que não dependem de página específica. */
  function aplicarGlobais() {
    const c = get();
    // Cor da faixa do menu (presets seguros pela regra 10)
    if (c.menuCor === 'branco' || c.menuCor === 'vinho') {
      const aplica = () => {
        const h = document.getElementById('site-header');
        if (h) h.setAttribute('data-menu-cor', c.menuCor);
        else setTimeout(aplica, 150);
      };
      aplica();
    }
    // Bloco Sobre da home
    const sobre = c.sobre || {};
    const sec = document.getElementById('sobre');
    if (sec && (sobre.lead || sobre.texto || sobre.titulo || sobre.imagem || sobre.esconderNumeros)) {
      if (sobre.titulo) {
        const t = sec.querySelector('.section-title');
        if (t) t.textContent = sobre.titulo;
      }
      if (sobre.lead) {
        const l = sec.querySelector('.sobre-lead');
        if (l) l.textContent = sobre.lead;
      }
      if (sobre.texto) {
        const x = sec.querySelector('.sobre-text');
        if (x) x.textContent = sobre.texto;
      }
      const stats = sec.querySelector('.sobre-stats');
      if (stats && (sobre.imagem || sobre.esconderNumeros)) {
        if (sobre.imagem) {
          stats.innerHTML = '<figure class="sobre-figura"><img src="' + sobre.imagem + '" alt="Unidade Laser & Co" loading="lazy"></figure>';
          stats.classList.add('sobre-stats-imagem');
        } else {
          stats.style.display = 'none';
        }
      }
    }
  }

  ready.then(() => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', aplicarGlobais);
    } else {
      aplicarGlobais();
    }
  });

  return { ready: ready, get: get };
})();
