/* ============================================================
   PAGE-INDEX — Lógica específica da Página Início
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
      <div class="step-item">
        <div class="step-num">${p.n}</div>
        <h3 class="step-title">${p.titulo}</h3>
        <p class="step-desc">${p.desc}</p>
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

  function init() {
    renderMarqueePopulares();
    renderPassos();
    renderDepoimentos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
