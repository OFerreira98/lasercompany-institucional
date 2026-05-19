/* ============================================================
   PAGE-UNIDADES — Lógica da Página Unidades
   - Mapa real (Leaflet + OpenStreetMap) com pinos da marca
   - Pino clicado abre popup com nome, endereço, WhatsApp
   - Filtros UF/cidade refletem no mapa e na lista
   ============================================================ */

(function() {

  let map = null;
  const markers = {};

  function brandPinIcon() {
    // SVG inline pin dourado com glow (maior pra ter mais presenca no mapa)
    const html = `
      <span class="laser-pin">
        <svg viewBox="0 0 24 32" width="38" height="50" aria-hidden="true">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.4 18.6 0 12 0z" fill="#C8A064" stroke="#1A0404" stroke-width="1.2"/>
          <circle cx="12" cy="12" r="4.8" fill="#1A0404"/>
          <circle cx="12" cy="12" r="2" fill="#C8A064"/>
        </svg>
      </span>
    `;
    return L.divIcon({
      html,
      className: 'laser-pin-icon',
      iconSize: [38, 50],
      iconAnchor: [19, 50],
      popupAnchor: [0, -46],
    });
  }

  // Bounds aproximados do Brasil (Norte, Oeste, Sul, Leste)
  const BRASIL_BOUNDS = L.latLngBounds(
    [5.3, -74.0],   // canto Noroeste
    [-34.0, -33.5]  // canto Sudeste
  );

  function initMap() {
    const el = document.getElementById('unidades-map');
    if (!el || !window.L) return;

    map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
      maxBounds: BRASIL_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 4,
      maxZoom: 12,
    });

    // Enquadra somente o Brasil
    map.fitBounds(BRASIL_BOUNDS, { padding: [10, 10] });

    // CartoDB Dark Matter para combinar com o tema vinho do site
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
      bounds: BRASIL_BOUNDS,
    }).addTo(map);

    const icon = brandPinIcon();
    const group = L.featureGroup();

    window.LaserData.unidades.forEach(u => {
      const msg = `Olá ${u.nome}! Vim pelo site da Laser & Co e gostaria de mais informações.`;
      const waUrl = window.LaserCEP.whatsappUrl(u, msg);
      const popupHtml = `
        <div class="map-popup">
          <div class="map-popup-uf">${u.cidade}, ${u.uf}</div>
          <div class="map-popup-name">${u.nome}</div>
          <div class="map-popup-meta">${u.endereco}</div>
          <div class="map-popup-meta">${u.horario}</div>
          <div class="map-popup-actions">
            <a href="agendamento.html?unidade=${u.id}" class="map-popup-btn primary">Agendar</a>
            <a href="${waUrl}" target="_blank" rel="noopener" class="map-popup-btn ghost">WhatsApp</a>
          </div>
        </div>
      `;
      const m = L.marker([u.lat, u.lng], { icon, title: `${u.nome} - ${u.cidade}/${u.uf}` })
        .bindPopup(popupHtml, { maxWidth: 280, className: 'laser-leaflet-popup' });
      m.on('click', () => {
        const card = document.querySelector(`.unidade-card[data-id="${u.id}"]`);
        if (card) {
          card.classList.add('highlighted');
          setTimeout(() => card.classList.remove('highlighted'), 2000);
        }
      });
      markers[u.id] = m;
      m.addTo(map);
      group.addLayer(m);
    });

    // Mapa permanece enquadrado no Brasil ate o usuario buscar/filtrar
    document.getElementById('map-counter').textContent = window.LaserData.unidades.length;
  }

  function focusMarker(id) {
    const m = markers[id];
    if (!m || !map) return;
    map.setView(m.getLatLng(), Math.max(map.getZoom(), 11), { animate: true });
    m.openPopup();
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

  /* Placeholder de localizacao no card (gradiente da marca + pin) — ate
     receber as fotos reais de fachada de cada unidade. */
  function unidadeCardStyle(u) {
    let hash = 0;
    for (let i = 0; i < u.id.length; i++) hash = u.id.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 30 + 20;
    const sat = 30 + (Math.abs(hash) % 20);
    return `background:
      radial-gradient(circle at 30% 30%, hsla(${hue}, ${sat}%, 60%, 0.35), transparent 55%),
      radial-gradient(circle at 75% 75%, hsla(${hue + 15}, ${sat + 10}%, 45%, 0.4), transparent 50%),
      linear-gradient(135deg, var(--color-bg-elevated), var(--color-bg-alt));`;
  }

  function renderGrid(unidades) {
    const grid = document.getElementById('unidades-grid');
    if (!grid) return;

    if (unidades.length === 0) {
      grid.innerHTML = `<div class="grid-empty">Nenhuma unidade encontrada com esses filtros.</div>`;
      return;
    }

    grid.innerHTML = unidades.map(u => {
      const msg = `Olá ${u.nome}! Vim pelo site da Laser & Co e gostaria de mais informações.`;
      const waUrl = window.LaserCEP.whatsappUrl(u, msg);
      return `
        <article class="unidade-card" data-id="${u.id}">
          <div class="unidade-card-image" style="${unidadeCardStyle(u)}" aria-hidden="true">
            <span class="unidade-card-uf-badge">${u.uf}</span>
            <button type="button" class="unidade-card-pin" data-focus="${u.id}" aria-label="Ver no mapa">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </button>
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

    grid.querySelectorAll('[data-focus]').forEach(btn => {
      btn.addEventListener('click', () => focusMarker(btn.dataset.focus));
    });
  }

  function applyFilters() {
    const uf = document.getElementById('uf-filter').value;
    const cidade = document.getElementById('cidade-filter').value;
    let result = window.LaserData.unidades;
    if (uf) result = result.filter(u => u.uf === uf);
    if (cidade) result = result.filter(u => u.cidade === cidade);
    renderGrid(result);

    // Reflete no mapa: esconde pinos fora do filtro
    Object.entries(markers).forEach(([id, m]) => {
      const inResult = result.some(u => u.id === id);
      if (inResult) m.addTo(map);
      else map.removeLayer(m);
    });
    if (map) {
      // Se nenhum filtro aplicado, volta a enquadrar o Brasil inteiro
      if (!uf && !cidade) {
        map.fitBounds(BRASIL_BOUNDS, { padding: [10, 10] });
      } else if (result.length > 0) {
        const visible = result.map(u => markers[u.id]).filter(Boolean);
        if (visible.length > 0) {
          const g = L.featureGroup(visible);
          map.fitBounds(g.getBounds().pad(0.2));
        }
      }
    }
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
          focusMarker(u.id);
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
          if (result[0]) focusMarker(result[0].id);
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
    initMap();
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
