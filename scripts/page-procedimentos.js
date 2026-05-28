/* ============================================================
   PAGE-PROCEDIMENTOS, Lógica da Página Procedimentos
   ============================================================ */

(function() {

  /* Placeholder "imagem em produção" (trocar por foto real depois) */
  const PH_HTML = '<div class="laser-img-ph" data-placeholder="trocar-por-foto-real"><span class="laser-img-ph-mono">Laser <em>&amp;</em> Co</span></div>';

  // Detalhes adicionais por procedimento (FAQs, número de sessões, etc.)
  // Em produção, esses dados viriam do CMS junto com a lista de procedimentos.
  // Cada categoria tem seu próprio padrão; cada procedimento pode sobrescrever pontos via data.js.
  const DETALHES_POR_CATEGORIA = {
    estetica: {
      paraQuem: 'Indicado para adultos que querem tratar a pele com tecnologia segura: rejuvenescer, clarear manchas, suavizar cicatrizes ou tratar acne. Funciona em todos os fototipos (do I ao VI), com protocolo ajustado pra cada caso.',
      sessoes: 'Em média de 3 a 6 sessões, com intervalos de 30 a 45 dias. O número exato depende da queixa e da resposta da sua pele, definido na avaliação gratuita.',
      resultado: 'Já dá pra perceber melhora a partir da 2ª sessão. O resultado completo aparece após o protocolo, com cuidados pós (filtro solar, hidratação) que prolongam por meses.',
      faq: [
        { q: 'O procedimento dói?', a: 'A sensação é leve, com uma leve picada ou aquecimento. Nossos aparelhos têm sistema de resfriamento que torna a sessão confortável.' },
        { q: 'Quantas sessões são?', a: 'De 3 a 6, dependendo da queixa. A profissional confirma na avaliação.' },
        { q: 'Funciona em pele negra?', a: 'Sim. Trabalhamos com Alexandrite e ND-YAG, indicados pra todos os fototipos (do mais claro ao mais escuro), com parâmetros ajustados.' },
        { q: 'Tem recuperação?', a: 'Não. Você volta às atividades normais logo após a sessão, com filtro solar e hidratação reforçados.' },
        { q: 'Posso fazer no verão?', a: 'Pode, com filtro solar e evitando exposição direta nas primeiras 48h. A profissional orienta caso a caso.' },
      ],
    },
    depilacao: {
      paraQuem: 'Indicado pra quem quer reduzir e clarear os pelos de forma duradoura. Seguro pra todos os fototipos (I ao VI), pra homens e mulheres, e pra pelos claros, escuros ou grossos.',
      sessoes: 'Em média de 6 a 10 sessões, com intervalo de 30 a 45 dias. A taxa de redução fica entre 70% e 90% após o protocolo completo. Sessões de manutenção 1 a 2x ao ano.',
      resultado: 'A redução do pelo já é visível na 3ª sessão. Ao fim do protocolo, os pelos remanescentes ficam mais finos e claros.',
      faq: [
        { q: 'O procedimento dói?', a: 'Pouco. O aparelho tem ponteira refrigerada que diminui muito a sensação. Quem fez cera ou lâmina não vai sentir diferença pra pior.' },
        { q: 'Quantas sessões são?', a: 'Em média de 6 a 10 sessões pra eliminar a maior parte do pelo. Manutenção anual ajuda a manter o resultado.' },
        { q: 'Funciona em pele negra?', a: 'Sim. ND-YAG é o laser específico pra fototipos mais escuros, com segurança comprovada. Avaliação gratuita confirma o protocolo certo.' },
        { q: 'Pode fazer no verão?', a: 'Pode. O cuidado é com filtro solar e evitar bronzeamento intenso 15 dias antes e depois.' },
        { q: 'Como me preparo?', a: 'Lâmina 24h antes (sem cera, pinça ou cremes depilatórios por 30 dias). Pele limpa, sem creme, sem perfume.' },
      ],
    },
    ultrassom: {
      paraQuem: 'Indicado pra quem quer firmar a pele, reduzir gordura localizada e definir contornos sem cortes, sem agulhas e sem afastar do trabalho. Funciona melhor em peles com flacidez leve a moderada.',
      sessoes: 'Em média de 1 a 3 sessões, com intervalo de 60 a 90 dias. Algumas áreas precisam de uma única sessão. A profissional define na avaliação.',
      resultado: 'O resultado é progressivo, aparece em 30 a 90 dias após a sessão, conforme o corpo produz colágeno novo. Dura de 12 a 24 meses.',
      faq: [
        { q: 'O procedimento dói?', a: 'Sente um leve calor pontual durante a aplicação. Não é doloroso e não exige anestesia.' },
        { q: 'Quantas sessões são?', a: 'Em média de 1 a 3, dependendo da área e do grau de flacidez.' },
        { q: 'Tem recuperação?', a: 'Não. Você sai da sessão e volta às atividades normais. Pode haver leve sensibilidade nas primeiras horas.' },
        { q: 'Quando aparece o resultado?', a: 'Em 30 a 90 dias, conforme o organismo produz colágeno novo. É um efeito progressivo e duradouro.' },
        { q: 'Substitui a cirurgia?', a: 'Substitui em casos de flacidez leve a moderada. Pra casos avançados, a profissional indica avaliação com médico.' },
      ],
    },
  };
  function detalhesPara(proc) {
    return DETALHES_POR_CATEGORIA[proc.categoria] || DETALHES_POR_CATEGORIA.estetica;
  }

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

  /* Placeholder da marca quando o procedimento ainda não tem foto */
  function procMediaStyle(p) {
    if (p.img) return `background-image:url('${encodeURI(p.img)}')`;
    let hash = 0;
    for (let i = 0; i < p.id.length; i++) hash = p.id.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 30 + 20;
    return `background:
      radial-gradient(circle at 30% 30%, hsla(${hue}, 40%, 55%, 0.30), transparent 55%),
      radial-gradient(circle at 75% 75%, hsla(${hue + 15}, 45%, 40%, 0.35), transparent 50%),
      linear-gradient(135deg, var(--color-bg-elevated), var(--color-bg-alt))`;
  }

  /* Mídia do card: vídeo autoplay quando p.video existe (autoplay+muted+loop,
     pausado fora do viewport via motion.js), imagem quando p.img, placeholder
     da marca caso contrário. */
  function procMediaHTML(p) {
    if (p.video) {
      const poster = p.img ? ` poster="${encodeURI(p.img)}"` : '';
      return `
        <div class="procedimento-card-media procedimento-card-media-video" aria-hidden="true">
          <video data-motion-autoplay muted loop playsinline preload="metadata"${poster}>
            <source src="${encodeURI(p.video)}" type="video/${p.video.endsWith('.mov') ? 'quicktime' : 'mp4'}">
          </video>
        </div>
      `;
    }
    return `<div class="procedimento-card-media" style="${procMediaStyle(p)}" aria-hidden="true">${p.img ? '' : PH_HTML}</div>`;
  }

  function renderGrid(cat) {
    const grid = document.getElementById(`grid-${cat}`);
    if (!grid) return;
    const items = window.LaserData.procedimentos[cat];
    grid.innerHTML = items.map(p => `
      <article class="procedimento-card${p.popular ? ' popular' : ''}" data-id="${p.id}" data-cat="${cat}" tabindex="0" role="button" aria-label="Ver detalhes de ${p.nome}">
        ${procMediaHTML(p)}
        <div class="procedimento-card-body">
          <h3 class="procedimento-card-title">${p.nome}</h3>
          <p class="procedimento-card-desc">${p.sub}</p>
          <span class="procedimento-card-link">Ver detalhes →</span>
        </div>
      </article>
    `).join('');

    // re-registra videos no observer de autoplay
    if (window.LaserMotion) window.LaserMotion.setupAutoVideos(grid);

    grid.querySelectorAll('.procedimento-card').forEach(card => {
      const open = () => openModal(card.dataset.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  /* Bloco antes/depois (prova social).
     - Se proc.antesDepois existir, mostra a foto combo (antes|depois em
       uma única imagem) ocupando a largura toda.
     - Senão, se proc.antes/depois existirem, monta o split clássico.
     - Senão, se proc.video existir, usa o vídeo como destaque (mostra o
       resultado em movimento, melhor que placeholder).
     - Último caso: placeholder da marca. */
  function antesDepoisHTML(proc) {
    if (proc.antesDepois) {
      return `
        <div class="proc-antes-depois proc-antes-depois-combo">
          <img src="${encodeURI(proc.antesDepois)}" alt="Antes e depois de ${proc.nome}" loading="lazy">
          <span class="proc-ad-tag proc-ad-tag-l">Antes</span>
          <span class="proc-ad-tag proc-ad-tag-r">Depois</span>
        </div>
        <p class="proc-ad-caption">Resultado real de cliente Laser & Co. Cada caso é avaliado individualmente na avaliação grátis.</p>
      `;
    }
    if (proc.video && !proc.antes && !proc.depois) {
      // sem foto antes/depois mas tem vídeo: usa vídeo como hero
      return `
        <div class="proc-antes-depois proc-antes-depois-video">
          <video src="${encodeURI(proc.video)}" autoplay muted loop playsinline aria-label="Vídeo de ${proc.nome}"></video>
        </div>
        <p class="proc-ad-caption">Procedimento em demonstração. Resultado individual avaliado na consulta grátis.</p>
      `;
    }
    const antesStyle  = proc.antes  ? ` style="background-image:url('${proc.antes}')"`  : '';
    const depoisStyle = proc.depois ? ` style="background-image:url('${proc.depois}')"` : '';
    const antesEmpty  = proc.antes  ? '' : PH_HTML;
    const depoisEmpty = proc.depois ? '' : PH_HTML;
    return `
      <div class="proc-antes-depois">
        <div class="proc-ad-cell antes"${antesStyle}><span class="proc-ad-label">Antes</span>${antesEmpty}</div>
        <div class="proc-ad-cell depois"${depoisStyle}><span class="proc-ad-label">Depois</span>${depoisEmpty}</div>
      </div>
      <p class="proc-ad-caption">Resultado ilustrativo. Cada caso é avaliado individualmente na avaliação grátis.</p>
    `;
  }

  function openModal(procId) {
    const proc = window.LaserData.findProcedimento(procId);
    if (!proc) return;

    const modal = document.getElementById('proc-modal');
    const content = document.getElementById('proc-modal-content');
    const catLabel = { estetica: 'Estética a Laser', depilacao: 'Depilação a Laser', ultrassom: 'Ultrassom' };

    const det = detalhesPara(proc);
    content.innerHTML = `
      <div class="proc-detail-eyebrow">${catLabel[proc.categoria]}</div>
      <h2 class="proc-detail-title">${proc.nome}</h2>
      ${antesDepoisHTML(proc)}
      <p style="color: var(--color-text-soft); margin-bottom: var(--sp-5);">${proc.sub}</p>

      <div class="proc-detail-section">
        <h4>Indicado para</h4>
        <p>${proc.indicado || det.paraQuem}</p>
      </div>

      <div class="proc-detail-section">
        <h4>Número de sessões</h4>
        <p>${proc.sessoes || det.sessoes}</p>
      </div>

      <div class="proc-detail-section">
        <h4>Resultado esperado</h4>
        <p>${proc.resultado || det.resultado}</p>
      </div>

      <div class="proc-detail-section">
        <h4>Perguntas frequentes</h4>
        <div class="accordion" id="modal-faq">
          ${(proc.faq || det.faq).map((f, i) => `
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
        ${l.img ? `<div class="tech-card-media" style="background-image:url('${l.img}')" aria-hidden="true"></div>` : `<div class="tech-card-media" style="position:relative" aria-hidden="true">${PH_HTML}</div>`}
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

    // Se a URL traz ?proc=<id>, abre o procedimento direto (vindo do mega-menu do header)
    const procParam = new URLSearchParams(window.location.search).get('proc');
    if (procParam && window.LaserData.findProcedimento(procParam)) {
      // pequeno delay pra deixar o tab ativar e a página estabilizar
      setTimeout(() => openModal(procParam), 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
