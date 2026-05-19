/* ============================================================
   PAGE-UNIDADES — Lógica da Página Unidades
   ============================================================ */

(function() {

  let unidadesFiltered = [];

  function getMapBounds() {
    const lats = window.LaserData.unidades.map(u => u.lat);
    const lngs = window.LaserData.unidades.map(u => u.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }

  function renderMap() {
    const map = document.getElementById('unidades-map');
    if (!map) return;
    const bounds = getMapBounds();
    const padding = 0.08;

    map.querySelectorAll('.map-pin').forEach(p => p.remove());

    window.LaserData.unidades.forEach(u => {
      const x = (u.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
      const y = 1 - (u.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);
      const left = padding * 100 + x * (1 - padding * 2) * 100;
      const top  = padding * 100 + y * (1 - padding * 2) * 100;

      const pin = document.createElement('button');
      pin.type = 'button';
      pin.className = 'map-pin';
      pin.style.left = `${left}%`;
      pin.style.top = `${top}%`;
      pin.title = `${u.nome} — ${u.cidade}/${u.uf}`;
      pin.setAttribute('aria-label', `${u.nome}, ${u.cidade}, ${u.uf}`);
      pin.addEventListener('click', () => {
        const card = document.querySelector(`.unidade-card[data-id="${u.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('highlighted');
          setTimeout(() => card.classList.remove('highlighted'), 2000);
        }
      });
      map.appendChild(pin);
    });
  }

  function populateFilters() {
    const ufs = [...new Set(window.LaserData.unidades.map(u => u.uf))].sort();
    const ufSelect = document.getElementById('uf-filter');
    ufs.forEach(uf => {
      const opt = document.createElement('option');
      opt.value = uf;
      opt.textContent = uf;
      ufSelect.appendChild(opt);
    });

    refreshCidadeFilter('');
  }

  function refreshCidadeFilter(uf) {
    const cidades = [...new Set(
      window.LaserData.unidades
        .filter(u => !uf || u.uf === uf)
        .map(u => u.cidade)
    )].sort();
    const cidadeSelect = document.getElementById('cidade-filter');
    cidadeSelect.innerHTML = '<option value="">Todas as cidades</option>' +
      cidades.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  /* Imagem decorativa por unidade — gradiente único derivado do id */
  function imageStyle(u) {
    // Hash simples do id para gerar tom único
    let hash = 0;
    for (let i = 0; i < u.id.length; i++) hash = u.id.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 30 + 20;  // tons quentes (20-50, dourado/wine)
    const sat = 30 + (Math.abs(hash) % 20);
    return `background:
      radial-gradient(circle at 25% 30%, hsla(${hue}, ${sat}%, 60%, 0.35), transparent 55%),
      radial-gradient(circle at 75% 75%, hsla(${hue + 15}, ${sat + 10}%, 45%, 0.4), transparent 50%),
      linear-gradient(135deg, var(--color-bg-elevated), var(--color-bg-alt));`;
  }

  function renderGrid(unidades) {
    const grid = document.getElementById('unidades-grid');
    if (!grid) return;
    unidadesFiltered = unidades;
    document.getElementById('total-shown').textContent = unidades.length;

    if (unidades.length === 0) {
      grid.innerHTML = `<div class="grid-empty">Nenhuma unidade encontrada com esses filtros.</div>`;
      return;
    }

    grid.innerHTML = unidades.map(u => {
      const msg = `Olá ${u.nome}! Vim pelo site da Laser & Co e gostaria de mais informações.`;
      const waUrl = window.LaserCEP.whatsappUrl(u, msg);
      return `
        <article class="unidade-card" data-id="${u.id}">
          <div class="unidade-card-image" style="${imageStyle(u)}" aria-hidden="true">
            <span class="unidade-card-uf-badge">${u.uf}</span>
            <span class="unidade-card-pin">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
          </div>
          <div class="unidade-card-body">
            <div class="unidade-card-cidade">${u.cidade}, ${u.uf}</div>
            <h3 class="unidade-card-nome">${u.nome}</h3>
            <ul class="unidade-card-info">
              <li>${u.endereco}</li>
              <li>${u.telefone}</li>
              <li>${u.horario}</li>
            </ul>
            <div class="unidade-card-actions">
              <a href="agendamento.html?unidade=${u.id}" class="btn btn-primary btn-sm">Agendar</a>
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">WhatsApp</a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function applyFilters() {
    const uf = document.getElementById('uf-filter').value;
    const cidade = document.getElementById('cidade-filter').value;
    let result = window.LaserData.unidades;
    if (uf) result = result.filter(u => u.uf === uf);
    if (cidade) result = result.filter(u => u.cidade === cidade);
    renderGrid(result);
  }

  function initSearch() {
    const form = document.getElementById('unidades-search');
    const input = document.getElementById('unidade-input');
    const resultBox = document.getElementById('search-result');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;

      const onlyDigits = value.replace(/\D/g, '');
      if (onlyDigits.length === 8) {
        const r = await window.LaserCEP.resolve(onlyDigits);
        if (r.hasUnidade && r.unidade) {
          const u = r.unidade;
          resultBox.hidden = false;
          resultBox.innerHTML = `
            <div class="search-result-eyebrow">Sua unidade mais próxima</div>
            <div class="search-result-name">${u.nome}</div>
            <div class="search-result-meta">${u.endereco}</div>
            <a href="agendamento.html?unidade=${u.id}" class="btn btn-primary btn-sm" style="margin-top: var(--sp-3);">Agendar nesta unidade</a>
          `;
          renderGrid([u, ...window.LaserData.unidades.filter(x => x.id !== u.id)]);
          window.LaserAnalytics.trackEvent('unidades_search_cep', { cep: onlyDigits, unidadeId: u.id });
        } else {
          resultBox.hidden = false;
          resultBox.innerHTML = `<strong>Ainda não temos unidade próxima ao CEP ${value}.</strong> Mas estamos crescendo!`;
          window.LaserAnalytics.trackLead('expansao_unidades', { cep: onlyDigits });
        }
      } else {
        const term = value.toLowerCase();
        const result = window.LaserData.unidades.filter(u =>
          u.cidade.toLowerCase().includes(term) ||
          u.uf.toLowerCase().includes(term) ||
          u.nome.toLowerCase().includes(term)
        );
        if (result.length > 0) {
          resultBox.hidden = false;
          resultBox.innerHTML = `<strong>${result.length}</strong> unidade(s) encontrada(s) com "${value}".`;
          renderGrid(result);
          window.LaserAnalytics.trackEvent('unidades_search_text', { term: value, results: result.length });
        } else {
          resultBox.hidden = false;
          resultBox.innerHTML = `<strong>Nenhuma unidade encontrada com "${value}".</strong> Tente outro termo.`;
        }
      }
    });
  }

  function init() {
    populateFilters();
    renderMap();
    renderGrid(window.LaserData.unidades);
    initSearch();

    document.getElementById('uf-filter').addEventListener('change', (e) => {
      refreshCidadeFilter(e.target.value);
      applyFilters();
    });
    document.getElementById('cidade-filter').addEventListener('change', applyFilters);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
