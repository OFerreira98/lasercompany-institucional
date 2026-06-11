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

  /* Merge nos DADOS (data.js), independente de DOM: procedimentos
     (descrição/foto/vídeo) e fotos de unidades editados no painel. */
  function aplicarDados() {
    const c = get();
    const pmap = c.procedimentos || {};
    if (window.LaserData && window.LaserData.procedimentos) {
      Object.keys(window.LaserData.procedimentos).forEach(function (cat) {
        (window.LaserData.procedimentos[cat] || []).forEach(function (p) {
          const o = pmap[p.id];
          if (!o) return;
          if (o.sub) p.sub = o.sub;
          if (o.img) p.img = o.img;
          if (o.video) p.video = o.video;
          if (o.video === '') delete p.video; // '' = tirar o vídeo
        });
      });
    }
    const umap = c.unidadesFotos || {};
    if (window.LaserData && Array.isArray(window.LaserData.unidades)) {
      window.LaserData.unidades.forEach(function (u) {
        if (umap[u.id]) u.foto = umap[u.id];
        if (umap[u.id] === '') delete u.foto; // '' = voltar ao placeholder
      });
    }
  }

  /* Aplica os overrides que não dependem de página específica. */
  function aplicarGlobais() {
    const c = get();
    // Vídeo ao lado do "Marque sua Avaliação" (home), autoplay sem som
    if (c.videoAvaliacao) {
      const cardAg = document.querySelector('#agendamento-curto .agendamento-curto-card');
      if (cardAg && !cardAg.querySelector('.ag-video')) {
        const wrap = document.createElement('div');
        wrap.className = 'ag-conteudo';
        while (cardAg.firstChild) wrap.appendChild(cardAg.firstChild);
        const vid = document.createElement('div');
        vid.className = 'ag-video';
        vid.innerHTML = '<video src="' + c.videoAvaliacao + '" autoplay muted loop playsinline preload="metadata"></video>';
        cardAg.appendChild(vid);
        cardAg.appendChild(wrap);
        cardAg.classList.add('com-video');
      }
    }
    // Cor da faixa do menu (presets seguros pela regra 10)
    if (c.menuCor === 'branco' || c.menuCor === 'vinho') {
      const aplica = () => {
        const h = document.getElementById('site-header');
        if (h) h.setAttribute('data-menu-cor', c.menuCor);
        else setTimeout(aplica, 150);
      };
      aplica();
    }
    // Foto da fachada no "Posicionamento único" (página franqueado)
    if (c.franqueadoFachada) {
      const fimg = document.getElementById('frlp-fachada-img');
      if (fimg) fimg.src = c.franqueadoFachada;
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
    aplicarDados();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', aplicarGlobais);
    } else {
      aplicarGlobais();
    }
  });

  return { ready: ready, get: get };
})();
