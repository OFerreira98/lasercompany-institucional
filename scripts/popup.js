/* ============================================================
   POPUP DE CAPTAÇÃO, "GANHE UM BRINDE"
   ============================================================
   Regra (revisada em 27/05/2026 a pedido do novo responsável):
   - Aparece após 6s OU em exit intent (o que vier primeiro).
   - Se o visitante FECHA sem preencher, NÃO insiste mais na mesma
     visita. Pode voltar a aparecer em uma nova visita (sessão nova).
   - Se PREENCHE, fica em silêncio por 2h (cooldown).
   - Form em uma etapa: Nome + WhatsApp + UF + Cidade + Unidade,
     com filtros dependentes (a cidade depende da UF, a unidade
     depende da cidade), tudo a partir de window.LaserData.unidades.
   - Lead vai pro painel via window.LaserAnalytics.trackLead.
   ============================================================ */

(function() {
  const STORAGE_KEY        = 'laserco_popup_state';     // localStorage: cooldown pós-envio
  const SESSION_KEY        = 'laserco_popup_session';   // sessionStorage: dispensado na visita
  const FIRST_DELAY_MS     = 6000;
  const SUBMIT_COOLDOWN_MS = 2 * 60 * 60 * 1000;        // 2h

  let overlayEl = null;
  let firstShowTimer = null;

  /* ---------- regra de exibição ---------- */
  function shouldShow() {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'dismissed') return false;
    } catch (e) {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.status === 'submitted') {
          const at = s.seenAt ? new Date(s.seenAt).getTime() : 0;
          if ((Date.now() - at) < SUBMIT_COOLDOWN_MS) return false;
        }
      }
    } catch (e) {}
    return true;
  }

  function markDismissed() {
    try { sessionStorage.setItem(SESSION_KEY, 'dismissed'); } catch (e) {}
  }
  function markSubmitted(extra) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        status: 'submitted',
        seenAt: new Date().toISOString(),
        ...extra,
      }));
    } catch (e) {}
  }

  /* ---------- HTML ---------- */
  function buildPopupHTML() {
    return `
<div class="popup-overlay" id="popup-captacao" role="dialog" aria-modal="true" aria-labelledby="popup-title">
  <div class="popup popup-brinde">
    <button class="popup-close" aria-label="Fechar" id="popup-close">&times;</button>

    <div class="popup-form-view" id="popup-form-view">
      <div class="popup-gift-badge" aria-hidden="true">
        <span class="popup-gift-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"/>
            <rect x="2" y="7" width="20" height="5"/>
            <line x1="12" y1="22" x2="12" y2="7"/>
            <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
            <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
          </svg>
        </span>
        <span class="popup-gift-text">Você ganhou um brinde</span>
      </div>

      <h2 class="popup-title" id="popup-title">
        Uma sessão de <span class="italic">Rejuvenescimento Facial</span> <strong class="popup-title-strong">GRÁTIS</strong>.
      </h2>
      <p class="popup-sub">Selecione sua unidade e resgate em poucos segundos.</p>

      <form class="popup-form" id="popup-form" novalidate>
        <div class="popup-fields-row">
          <div class="field">
            <input type="text" id="popup-nome" name="nome" class="input" placeholder="Seu nome" required autocomplete="name">
            <div class="field-error">Informe seu nome.</div>
          </div>
          <div class="field">
            <input type="tel" id="popup-whatsapp" name="whatsapp" class="input" placeholder="WhatsApp" inputmode="tel" required autocomplete="tel-national">
            <div class="field-error">WhatsApp inválido.</div>
          </div>
        </div>

        <div class="popup-fields-row popup-row-uf-cidade">
          <div class="field">
            <select id="popup-uf" name="uf" class="input" required aria-label="Estado">
              <option value="">UF</option>
            </select>
            <div class="field-error">Selecione o estado.</div>
          </div>
          <div class="field popup-field-grow">
            <select id="popup-cidade" name="cidade" class="input" required aria-label="Cidade" disabled>
              <option value="">Cidade</option>
            </select>
            <div class="field-error">Selecione a cidade.</div>
          </div>
        </div>

        <div class="field">
          <select id="popup-unidade" name="unidade" class="input" required aria-label="Unidade" disabled>
            <option value="">Unidade Laser &amp; Co</option>
          </select>
          <div class="field-error">Selecione a unidade.</div>
        </div>

        <button type="button" class="popup-geo" id="popup-geo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          Encontrar a unidade mais perto de mim
        </button>

        <button type="submit" class="btn btn-primary btn-block" id="popup-submit">
          <span class="btn-text">Resgatar meu brinde</span>
        </button>
        <p class="popup-disclaimer">Validade restrita à campanha vigente. Sem compromisso de compra.</p>
      </form>
    </div>

    <div class="popup-success-view" id="popup-success-view" style="display:none;">
      <div class="popup-success">
        <div class="popup-success-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="popup-title">Brinde reservado!</h2>
        <p class="popup-sub" id="popup-success-msg">A unidade Laser &amp; Co da sua região vai te chamar.</p>
        <div id="popup-unidade-info"></div>
        <a href="#" target="_blank" rel="noopener" class="btn btn-primary btn-block" id="popup-whatsapp-btn">Resgatar meu brinde agora</a>
      </div>
    </div>
  </div>
</div>`;
  }

  /* ---------- máscaras e validação ---------- */
  function applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });
  }

  function validateField(field) {
    const el = field.querySelector('.input');
    const v = (el.value || '').trim();
    let ok = true;
    if (el.required && !v) ok = false;
    if (el.name === 'whatsapp' && v.replace(/\D/g, '').length < 10) ok = false;
    field.classList.toggle('has-error', !ok);
    return ok;
  }

  /* ---------- filtros UF / Cidade / Unidade ---------- */
  function getUnidades() {
    return (window.LaserData && window.LaserData.unidades) || [];
  }

  function populateUFs(selectUF) {
    const ufs = Array.from(new Set(getUnidades().map(u => u.uf))).sort();
    selectUF.innerHTML = '<option value="">UF</option>' +
      ufs.map(uf => `<option value="${uf}">${uf}</option>`).join('');
  }

  function populateCidades(selectCidade, uf) {
    if (!uf) {
      selectCidade.innerHTML = '<option value="">Cidade</option>';
      selectCidade.disabled = true;
      return;
    }
    const cidades = Array.from(new Set(
      getUnidades().filter(u => u.uf === uf).map(u => u.cidade)
    )).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    selectCidade.innerHTML = '<option value="">Cidade</option>' +
      cidades.map(c => `<option value="${c}">${c}</option>`).join('');
    selectCidade.disabled = false;
  }

  function populateUnidades(selectUnidade, uf, cidade) {
    if (!uf || !cidade) {
      selectUnidade.innerHTML = '<option value="">Unidade Laser &amp; Co</option>';
      selectUnidade.disabled = true;
      return;
    }
    const unidades = getUnidades()
      .filter(u => u.uf === uf && u.cidade === cidade)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    selectUnidade.innerHTML = '<option value="">Unidade Laser &amp; Co</option>' +
      unidades.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
    selectUnidade.disabled = unidades.length === 0;
    if (unidades.length === 1) selectUnidade.value = unidades[0].id;
  }

  function findUnidadeById(id) {
    return getUnidades().find(u => u.id === id) || null;
  }

  /* ---------- geolocalização (best-effort) ---------- */
  function tryGeolocate(selUF, selCidade, selUnidade) {
    if (!navigator.geolocation) {
      window.LaserToast && window.LaserToast.warn('Seu navegador não compartilha localização.');
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      // mais próxima por distância euclidiana de lat/lng (suficiente)
      let melhor = null, melhorD = Infinity;
      getUnidades().forEach(u => {
        if (typeof u.lat !== 'number' || typeof u.lng !== 'number') return;
        const d = Math.pow(u.lat - lat, 2) + Math.pow(u.lng - lng, 2);
        if (d < melhorD) { melhorD = d; melhor = u; }
      });
      if (melhor) {
        selUF.value = melhor.uf;
        populateCidades(selCidade, melhor.uf);
        selCidade.value = melhor.cidade;
        populateUnidades(selUnidade, melhor.uf, melhor.cidade);
        selUnidade.value = melhor.id;
        window.LaserToast && window.LaserToast.info(`Selecionei a unidade ${melhor.nome}, mais próxima de você.`);
      }
    }, () => {
      window.LaserToast && window.LaserToast.warn('Não consegui pegar sua localização. Selecione manualmente.');
    }, { timeout: 6000, maximumAge: 60000 });
  }

  /* ---------- abrir / fechar ---------- */
  function show(overlay) {
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    window.LaserAnalytics && window.LaserAnalytics.trackEvent('popup_shown');
    setTimeout(() => {
      const firstInput = overlay.querySelector('input[name="nome"]');
      if (firstInput) firstInput.focus();
    }, 400);
  }

  function close(overlay, source) {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    if (source !== 'submit') {
      // Fechou sem preencher: marca como dispensado nessa visita e PARA de insistir.
      markDismissed();
    }
    clearTimeout(firstShowTimer);
  }

  function triggerPopup() {
    if (!overlayEl) return;
    if (overlayEl.classList.contains('visible')) return;
    if (!shouldShow()) return;
    show(overlayEl);
  }

  /* ---------- envio ---------- */
  async function handleSubmit(form, overlay) {
    const fields = form.querySelectorAll('.field');
    let ok = true;
    fields.forEach(f => { if (!validateField(f)) ok = false; });
    if (!ok) return;

    const submitBtn = form.querySelector('#popup-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const orig = btnText.textContent;
    submitBtn.disabled = true;
    btnText.textContent = 'Reservando…';

    const nome     = form.querySelector('#popup-nome').value.trim();
    const whatsapp = form.querySelector('#popup-whatsapp').value.trim();
    const uf       = form.querySelector('#popup-uf').value;
    const cidade   = form.querySelector('#popup-cidade').value;
    const unidadeId= form.querySelector('#popup-unidade').value;
    const unidade  = findUnidadeById(unidadeId);

    window.LaserAnalytics && window.LaserAnalytics.trackLead('popup_brinde', {
      nome, whatsapp, uf, cidade,
      unidadeId: unidade ? unidade.id : null,
      unidadeNome: unidade ? unidade.nome : null,
      hasUnidade: !!unidade,
      brinde: 'Sessão de Rejuvenescimento Facial',
    });

    markSubmitted({ nome, whatsapp, uf, cidade, unidadeId: unidade ? unidade.id : null });

    // Renderiza tela de sucesso
    form.parentElement.style.display = 'none';
    const successView = overlay.querySelector('#popup-success-view');
    successView.style.display = 'block';

    const unidadeInfo = overlay.querySelector('#popup-unidade-info');
    const waBtn = overlay.querySelector('#popup-whatsapp-btn');
    const successMsg = overlay.querySelector('#popup-success-msg');

    if (unidade) {
      successMsg.textContent = `A unidade ${unidade.nome} (${unidade.cidade}/${unidade.uf}) vai entrar em contato pra resgatar seu brinde.`;
      unidadeInfo.innerHTML = `
        <div class="popup-unit-card">
          <div class="popup-unit-eyebrow">Sua unidade</div>
          <div class="popup-unit-name">${unidade.nome}</div>
          <div class="popup-unit-meta">${unidade.endereco}</div>
          <div class="popup-unit-meta">${unidade.horario || ''}</div>
        </div>
      `;
      const msg = `Olá ${unidade.nome}! Sou ${nome}, vim pelo site da Laser & Co e quero resgatar meu brinde de uma sessão de Rejuvenescimento Facial.`;
      const num = (unidade.whatsapp || '').replace(/\D/g, '');
      waBtn.href = num ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : '#';
    } else {
      successMsg.textContent = 'Recebemos seu cadastro. Em breve, um consultor da Laser & Co entra em contato.';
      unidadeInfo.style.display = 'none';
      waBtn.style.display = 'none';
    }

    submitBtn.disabled = false;
    btnText.textContent = orig;
  }

  /* ---------- init ---------- */
  function init() {
    if (document.querySelector('[data-no-popup]')) return;
    if (!shouldShow()) return; // já dispensado nessa visita ou em cooldown

    document.body.insertAdjacentHTML('beforeend', buildPopupHTML());
    const overlay = document.getElementById('popup-captacao');
    overlayEl = overlay;
    const form     = overlay.querySelector('#popup-form');
    const closeBtn = overlay.querySelector('#popup-close');
    const selUF    = overlay.querySelector('#popup-uf');
    const selCid   = overlay.querySelector('#popup-cidade');
    const selUni   = overlay.querySelector('#popup-unidade');
    const geoBtn   = overlay.querySelector('#popup-geo');

    populateUFs(selUF);
    applyPhoneMask(overlay.querySelector('#popup-whatsapp'));

    selUF.addEventListener('change', () => {
      populateCidades(selCid, selUF.value);
      populateUnidades(selUni, selUF.value, '');
      selCid.closest('.field').classList.remove('has-error');
      selUni.closest('.field').classList.remove('has-error');
    });
    selCid.addEventListener('change', () => {
      populateUnidades(selUni, selUF.value, selCid.value);
      selUni.closest('.field').classList.remove('has-error');
    });
    geoBtn.addEventListener('click', () => tryGeolocate(selUF, selCid, selUni));

    closeBtn.addEventListener('click', () => close(overlay, 'close'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(overlay, 'overlay');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('visible')) close(overlay, 'esc');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(form, overlay);
    });
    form.querySelectorAll('.input').forEach(el => {
      el.addEventListener('blur',  () => validateField(el.closest('.field')));
      el.addEventListener('change',() => el.closest('.field').classList.remove('has-error'));
      el.addEventListener('input', () => el.closest('.field').classList.remove('has-error'));
    });

    firstShowTimer = setTimeout(triggerPopup, FIRST_DELAY_MS);
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) triggerPopup();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
