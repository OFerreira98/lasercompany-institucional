/* ============================================================
   SELETOR DE TEMAS (Item 3.6 e 7.1 do roteiro)
   ============================================================
   Permite ao administrador trocar o tema do site sem
   tocar no código. A troca é imediata e global.

   Modelo: BASE (claro/escuro) + ACENTO sazonal, separados.
   - data-theme  = base (default | roteiro-dark | roteiro-light)
   - data-accent = sazonal (vazio = sem campanha)
   Assim "Versão Clara" + "Dia dos Namorados" = fundo claro com
   acento dos namorados (não volta pro vinho).

   No site público, o switcher só aparece quando
   ?admin=1 está na URL OU localStorage.admin === '1'
   (em produção, isto vem do painel do franqueador).
   ============================================================ */

window.LaserTheme = (function() {
  const BASE_KEY = 'laserco_base';
  const ACCENT_KEY = 'laserco_accent';
  const LEGACY_KEY = 'laserco_theme'; // modelo antigo (valor único)

  const themes = {
    base: [
      { id: 'default',       label: 'Design System',    swatch: '#C8A064', desc: 'Vinho profundo + Dourado quente (padrão)' },
      { id: 'roteiro-dark',  label: 'Roteiro Dark',     swatch: '#9A6B1E', desc: 'Identidade do roteiro, versão escura' },
      { id: 'roteiro-light', label: 'Roteiro Light',    swatch: '#F3E4DC', desc: 'Versão clara, creme + vinho' },
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

  const BASE_IDS = themes.base.map(function(t){ return t.id; });

  function read(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function write(k, v){ try { if (v == null || v === '') localStorage.removeItem(k); else localStorage.setItem(k, v); } catch(e){} }

  // Migra o modelo antigo (laserco_theme único) para base+acento
  function migrate(){
    if (read(BASE_KEY) !== null || read(ACCENT_KEY) !== null) return;
    var old = read(LEGACY_KEY);
    if (!old) return;
    if (BASE_IDS.indexOf(old) >= 0) write(BASE_KEY, old);
    else { write(BASE_KEY, 'default'); write(ACCENT_KEY, old); }
  }

  function getBase(){
    var b = read(BASE_KEY);
    if (b && BASE_IDS.indexOf(b) >= 0) return b;
    var old = read(LEGACY_KEY);
    if (old && BASE_IDS.indexOf(old) >= 0) return old;
    return 'default';
  }
  function getAccent(){
    var a = read(ACCENT_KEY);
    if (a) return a;
    var old = read(LEGACY_KEY);
    if (old && BASE_IDS.indexOf(old) < 0) return old;
    return '';
  }

  function applyDom(base, accent){
    var r = document.documentElement;
    r.setAttribute('data-theme', base || 'default');
    if (accent) r.setAttribute('data-accent', accent); else r.removeAttribute('data-accent');
  }

  // Mantém também o valor único antigo (accent tem prioridade) para qualquer leitor legado
  function persist(base, accent){
    write(BASE_KEY, base || 'default');
    write(ACCENT_KEY, accent || '');
    write(LEGACY_KEY, accent || base || 'default');
  }

  function dispatch(){
    window.dispatchEvent(new CustomEvent('laser:theme-changed', { detail: { base: getBase(), accent: getAccent() } }));
  }

  function setBase(base){ var a = getAccent(); persist(base, a); applyDom(base, a); dispatch(); }
  function setAccent(accent){ var b = getBase(); persist(b, accent); applyDom(b, accent); dispatch(); }
  function toggleAccent(accent){ setAccent(getAccent() === accent ? '' : accent); }

  // Retrocompatível: apply(id) decide sozinho se é base ou acento
  function apply(themeId){ if (BASE_IDS.indexOf(themeId) >= 0) setBase(themeId); else toggleAccent(themeId); }

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
      <button type="button" class="theme-option" data-kind="base" data-theme="${t.id}" title="${t.desc || t.label}">
        <span class="theme-swatch" style="background: ${t.swatch};"></span>
        <span>${t.label}</span>
      </button>`).join('');

    const sazOpts = themes.sazonais.map(t => `
      <button type="button" class="theme-option" data-kind="accent" data-accent="${t.id}">
        <span class="theme-swatch" style="background: ${t.swatch};"></span>
        <span>${t.label}</span>
      </button>`).join('');

    return `
<div class="theme-switcher" id="theme-switcher" role="region" aria-label="Seletor de temas (admin)">
  <button type="button" class="theme-switcher-toggle" id="theme-toggle" aria-label="Abrir seletor de temas" title="Seletor de temas (admin)">🎨</button>
  <div class="theme-switcher-panel">
    <div class="theme-switcher-title">Seletor de Temas, Admin</div>
    <div class="theme-switcher-section">
      <div class="theme-switcher-label">Tema base</div>
      <div class="theme-options">${baseOpts}</div>
    </div>
    <div class="theme-switcher-section">
      <div class="theme-switcher-label">Acento sazonal (combina com a base)</div>
      <div class="theme-options">${sazOpts}</div>
    </div>
  </div>
</div>`;
  }

  function init() {
    migrate();
    applyDom(getBase(), getAccent());

    if (!isAdminMode()) return;

    document.body.insertAdjacentHTML('beforeend', buildHTML());
    const wrapper = document.getElementById('theme-switcher');
    wrapper.classList.add('visible');

    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => wrapper.classList.toggle('open'));

    const options = wrapper.querySelectorAll('.theme-option');
    const updateActive = () => {
      const base = getBase();
      const accent = getAccent();
      options.forEach(o => {
        const isBase = o.dataset.kind === 'base';
        const id = isBase ? o.dataset.theme : o.dataset.accent;
        o.classList.toggle('active', isBase ? id === base : id === accent);
      });
    };
    updateActive();

    options.forEach(o => {
      o.addEventListener('click', () => {
        if (o.dataset.kind === 'base') setBase(o.dataset.theme);
        else toggleAccent(o.dataset.accent);
        updateActive();
        window.LaserAnalytics && window.LaserAnalytics.trackEvent('theme_changed', { base: getBase(), accent: getAccent() });
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
    });
  }

  // O tema precisa ser aplicado o mais cedo possível para evitar flash
  (function early() {
    try {
      migrate();
      applyDom(getBase(), getAccent());
    } catch(e) {}
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { apply, setBase, setAccent, toggleAccent, getBase, getAccent, themes };
})();
