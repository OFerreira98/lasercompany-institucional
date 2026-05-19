/* ============================================================
   PAGE-PROCEDIMENTOS — Lógica da Página Procedimentos
   ============================================================ */

(function() {

  // Detalhes adicionais por procedimento (FAQs, número de sessões, etc.)
  // Em produção, esses dados viriam do CMS junto com a lista de procedimentos.
  const DETALHES_PADRAO = {
    paraQuem: 'Indicado para adultos que buscam um tratamento seguro, eficaz e com resultados visíveis. Na avaliação gratuita, definimos juntos se este é o protocolo ideal para você.',
    sessoes: 'O número de sessões varia conforme o caso. Em média, de 4 a 8 sessões para resultados ótimos. A profissional define o protocolo personalizado na avaliação.',
    resultado: 'Os primeiros resultados aparecem já nas primeiras sessões. O resultado completo é progressivo e duradouro, mantido com cuidados específicos.',
    faq: [
      { q: 'O procedimento dói?', a: 'A sensação varia, mas é leve graças aos sistemas de resfriamento e à tecnologia de última geração. Muitos clientes relatam apenas leves picadas.' },
      { q: 'Quanto tempo dura cada sessão?', a: 'Em média de 20 a 60 minutos, dependendo da região tratada.' },
      { q: 'Há recuperação?', a: 'Não há tempo de inatividade. Você pode retomar as atividades normais logo após a sessão, com os cuidados orientados pela equipe.' },
    ],
  };

  function getActiveTabFromURL() {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    return ['estetica', 'depilacao', 'ultrassom'].includes(t) ? t : 'estetica';
  }

  function activateTab(name) {
    document.querySelectorAll('.tab').forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === `panel-${name}`);
    });
    // Atualiza URL
    const url = new URL(window.location);
    url.searchParams.set('tab', name);
    history.replaceState({}, '', url);
    window.LaserAnalytics.trackEvent('proc_tab_change', { tab: name });
  }

  function renderGrid(cat) {
    const grid = document.getElementById(`grid-${cat}`);
    if (!grid) return;
    const items = window.LaserData.procedimentos[cat];
    grid.innerHTML = items.map(p => `
      <article class="procedimento-card${p.popular ? ' popular' : ''}" data-id="${p.id}" data-cat="${cat}" tabindex="0" role="button" aria-label="Ver detalhes de ${p.nome}">
        <h3 class="procedimento-card-title">${p.nome}</h3>
        <p class="procedimento-card-desc">${p.sub}</p>
        <span class="procedimento-card-link">Ver detalhes →</span>
      </article>
    `).join('');

    grid.querySelectorAll('.procedimento-card').forEach(card => {
      const open = () => openModal(card.dataset.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  function openModal(procId) {
    const proc = window.LaserData.findProcedimento(procId);
    if (!proc) return;

    const modal = document.getElementById('proc-modal');
    const content = document.getElementById('proc-modal-content');
    const catLabel = { estetica: 'Estética a Laser', depilacao: 'Depilação a Laser', ultrassom: 'Ultrassom' };

    content.innerHTML = `
      <div class="proc-detail-eyebrow">${catLabel[proc.categoria]}</div>
      <h2 class="proc-detail-title">${proc.nome}</h2>
      <p style="color: var(--color-text-soft); margin-bottom: var(--sp-5);">${proc.sub}</p>

      <div class="proc-detail-section">
        <h4>Para quem é indicado</h4>
        <p>${DETALHES_PADRAO.paraQuem}</p>
      </div>

      <div class="proc-detail-section">
        <h4>Número de sessões</h4>
        <p>${DETALHES_PADRAO.sessoes}</p>
      </div>

      <div class="proc-detail-section">
        <h4>Resultado esperado</h4>
        <p>${DETALHES_PADRAO.resultado}</p>
      </div>

      <div class="proc-detail-section">
        <h4>Perguntas frequentes</h4>
        <div class="accordion" id="modal-faq">
          ${DETALHES_PADRAO.faq.map((f, i) => `
            <div class="accordion-item" data-i="${i}">
              <button class="accordion-trigger" type="button">
                <span>${f.q}</span>
                <span class="accordion-icon" aria-hidden="true">+</span>
              </button>
              <div class="accordion-content">
                <div class="accordion-content-inner">${f.a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: var(--sp-6); display: flex; gap: var(--sp-3); flex-wrap: wrap;">
        <a href="agendamento.html?procedimento=${proc.id}" class="btn btn-primary btn-lg btn-arrow" style="flex: 1; min-width: 220px;">Agendar este procedimento</a>
        <button type="button" class="btn btn-ghost" id="modal-close-btn" style="flex: 0;">Fechar</button>
      </div>
    `;

    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
    window.LaserAnalytics.trackEvent('proc_detail_view', { procedimentoId: proc.id });

    // FAQ accordion
    modal.querySelectorAll('.accordion-trigger').forEach(t => {
      t.addEventListener('click', () => {
        const item = t.closest('.accordion-item');
        item.classList.toggle('open');
      });
    });

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  }

  function closeModal() {
    const modal = document.getElementById('proc-modal');
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function renderTech() {
    const grid = document.getElementById('tech-grid');
    if (!grid) return;
    grid.innerHTML = window.LaserData.lasers.map(l => `
      <div class="tech-card reveal">
        <div class="tech-sigla">${l.sigla}</div>
        <div class="tech-nome">${l.nome}</div>
        <p class="tech-desc">${l.desc}</p>
      </div>
    `).join('');
  }

  function init() {
    renderGrid('estetica');
    renderGrid('depilacao');
    renderGrid('ultrassom');
    renderTech();

    activateTab(getActiveTabFromURL());

    document.querySelectorAll('.tab').forEach(t => {
      t.addEventListener('click', () => activateTab(t.dataset.tab));
    });

    const modal = document.getElementById('proc-modal');
    document.getElementById('proc-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
