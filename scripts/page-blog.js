/* ============================================================
   PAGE BLOG (blog.html), lista completa de 40 matérias
   importadas do site oficial. Tem busca por palavra-chave.
   Cada card linka pro post completo em lasercompany.com/blog/<slug>.
   ============================================================ */
(function() {
  'use strict';

  function blogCover(p) {
    if (p.img) {
      return `<div class="blog-card-img" style="background-image:url('${p.img}')"></div>`;
    }
    return `<div class="blog-card-img blog-card-img-placeholder"></div>`;
  }

  function cardHTML(p) {
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

  function normalize(s) {
    return (s || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function render(list) {
    const grid = document.getElementById('blog-grid-all');
    const empty = document.getElementById('blog-empty');
    const count = document.getElementById('blog-count');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
    } else {
      if (empty) empty.hidden = true;
      grid.innerHTML = list.map(cardHTML).join('');
    }
    if (count) count.textContent = list.length;
    // reattach reveal
    if (window._revealObs) {
      grid.querySelectorAll('.reveal').forEach(el => window._revealObs.observe(el));
    } else {
      grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  }

  function init() {
    if (!window.LaserData || !window.LaserData.blog) return;
    const all = window.LaserData.blog.slice();
    render(all);

    const search = document.getElementById('blog-search');
    if (search) {
      let timer;
      search.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const q = normalize(search.value.trim());
          if (!q) {
            render(all);
            return;
          }
          const filtered = all.filter(p => {
            const hay = normalize(p.titulo) + ' ' + normalize(p.preview);
            return hay.includes(q);
          });
          render(filtered);
        }, 150);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
