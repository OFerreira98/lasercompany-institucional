/* ============================================================
   SELETOR DE TEMAS (Item 3.6 e 7.1 do roteiro)
   ============================================================
   Permite ao administrador trocar o tema do site sem
   tocar no código. A troca é imediata e global.

   No site público, o switcher só aparece quando
   ?admin=1 está na URL OU localStorage.admin === '1'
   (em produção, isto vem do painel do franqueador).
   ============================================================ */

window.LaserTheme = (function() {
  const STORAGE_KEY = 'laserco_theme';

  const themes = {
    base: [
      { id: 'default',       label: 'Design System',    swatch: '#C8A064', desc: 'Vinho profundo + Dourado quente (padrão)' },
      { id: 'roteiro-dark',  label: 'Roteiro Dark',     swatch: '#9A6B1E', desc: 'Identidade do roteiro — versão escura' },
      { id: 'roteiro-light', label: 'Roteiro Light',    swatch: '#F4ECDF', desc: 'Identidade do roteiro — versão clara' },
    ],
    sazonais: [
      { id: 'outubro-rosa',     label: 'Outubro Rosa',      swatch: '#E08CB4' },
      { id: 'novembro-azul',    label: 'Novembro Azul',     swatch: '#5B9BD5' },
      { id: 'setembro-amarelo', label: 'Setembro Amarelo',  swatch: '#F5C342' },
      { id: 'dia-das-maes',     label: 'Dia das Mães',      swatch: '#D88FA5' },
      { id: 'dia-dos-namorados',label: 'Dia dos Namorados', swatch: '#C84B5A' },
      { id: 'dia-dos-pais',     label: 'Dia dos Pais',      swatch: '#5C7F9C' },
    ],
  };

  function getCurrent() {
    return localStorage.getItem(STORAGE_KEY) || 'default';
  }

  function apply(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    try { localStorage.setItem(STORAGE_KEY, themeId); } catch(e) {}
    window.dispatchEvent(new CustomEvent('laser:theme-changed', { detail: themeId }));
  }

  function isAdminMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
      try { localStorage.setItem('laserco_admin', '1'); } catch(e) {}
      return true;
    }
    if (params.get('admin') === '0') {
      try { localStorage.removeItem('laserco_admin'); } catch(e) {}
      return false;
    }
    try { return localStorage.getItem('laserco_admin') === '1'; } catch(e) { return false; }
  }

  function buildHTML() {
    const baseOpts = themes.base.map(t => `
      <button type="button" class="theme-option" data-theme="${t.id}" title="${t.desc || t.label}">
        <span class="theme-swatch" style="background: ${t.swatch};"></span>
        <span>${t.label}</span>
      </button>`).join('');

    const sazOpts = themes.sazonais.map(t => `
      <button type="button" class="theme-option" data-theme="${t.id}">
        <span class="theme-swatch" style="background: ${t.swatch};"></span>
        <span>${t.label}</span>
      </button>`).join('');

    return `
<div class="theme-switcher" id="theme-switcher" role="region" aria-label="Seletor de temas (admin)">
  <button type="button" class="theme-switcher-toggle" id="theme-toggle" aria-label="Abrir seletor de temas" title="Seletor de temas (admin)">🎨</button>
  <div class="theme-switcher-panel">
    <div class="theme-switcher-title">Seletor de Temas — Admin</div>
    <div class="theme-switcher-section">
      <div class="theme-switcher-label">Tema base</div>
      <div class="theme-options">${baseOpts}</div>
    </div>
    <div class="theme-switcher-section">
      <div class="theme-switcher-label">Temas sazonais</div>
      <div class="theme-options">${sazOpts}</div>
    </div>
  </div>
</div>`;
  }

  function init() {
    // Sempre aplica o tema salvo, mesmo sem ser admin
    const saved = getCurrent();
    apply(saved);

    if (!isAdminMode()) return;

    document.body.insertAdjacentHTML('beforeend', buildHTML());
    const wrapper = document.getElementById('theme-switcher');
    wrapper.classList.add('visible');

    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => wrapper.classList.toggle('open'));

    const options = wrapper.querySelectorAll('.theme-option');
    const updateActive = () => {
      const current = getCurrent();
      options.forEach(o => o.classList.toggle('active', o.dataset.theme === current));
    };
    updateActive();

    options.forEach(o => {
      o.addEventListener('click', () => {
        apply(o.dataset.theme);
        updateActive();
        window.LaserAnalytics && window.LaserAnalytics.trackEvent('theme_changed', { theme: o.dataset.theme });
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
    });
  }

  // O tema precisa ser aplicado o mais cedo possível para evitar flash
  (function early() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || 'default';
      document.documentElement.setAttribute('data-theme', saved);
    } catch(e) {}
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { apply, getCurrent, themes };
})();
