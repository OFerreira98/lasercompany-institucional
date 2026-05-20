/* ============================================================
   POPUP DE CAPTAÇÃO, "GANHE UM BRINDE"
   ============================================================
   - Aparece após 6s OU em exit intent (o que vier primeiro)
   - PERSISTENTE: se o visitante NÃO preencher, reabre a cada
     7s e volta a aparecer em toda nova visita (promoção relâmpago)
   - Após PREENCHER: para de insistir e só reaparece depois de
     um tempo (cooldown de 2h)
   - Lead salvo no localStorage para futuro painel
   - Mensagem alternativa se CEP sem unidade próxima
   ============================================================ */

(function() {
  const STORAGE_KEY        = 'laserco_popup_state';
  const FIRST_DELAY_MS     = 6000;            // primeira aparição
  const NAG_INTERVAL_MS    = 7000;            // reabre a cada 7s se não preencher
  const SUBMIT_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2h após preencher

  let overlayEl = null;
  let nagTimer  = null;

  // Mostra o popup, a menos que o visitante tenha preenchido há menos de 2h.
  function shouldShow() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return true;
      const s = JSON.parse(raw);
      if (!s) return true;
      if (s.status === 'submitted') {
        const at = s.seenAt ? new Date(s.seenAt).getTime() : 0;
        return (Date.now() - at) > SUBMIT_COOLDOWN_MS;
      }
      return true; // só fechou (dismiss): segue insistindo
    } catch (e) { return true; }
  }

  function markSeen(status, extra) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        status: status || 'dismissed',
        seenAt: new Date().toISOString(),
        ...extra,
      }));
    } catch (e) {}
  }

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
      <p class="popup-sub">Resgate seu brinde em segundos. Informe nome, WhatsApp e CEP.</p>

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
        <div class="field">
          <input type="text" id="popup-cep" name="cep" class="input" placeholder="CEP (00000-000)" inputmode="numeric" maxlength="9" required autocomplete="postal-code">
          <div class="field-error">CEP inválido.</div>
        </div>

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

  function applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });
  }

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
    if (source === 'submit') { clearTimeout(nagTimer); return; }
    // Fechou sem preencher: NÃO marca como visto, reabre em 7s (insistente)
    scheduleNag();
  }

  function triggerPopup() {
    if (!overlayEl) return;
    if (overlayEl.classList.contains('visible')) return;
    if (!shouldShow()) return;
    show(overlayEl);
  }

  function scheduleNag() {
    clearTimeout(nagTimer);
    nagTimer = setTimeout(triggerPopup, NAG_INTERVAL_MS);
  }

  function validateField(field) {
    const input = field.querySelector('.input');
    const v = input.value.trim();
    let ok = true;
    if (input.required && !v) ok = false;
    if (input.name === 'whatsapp' && v.replace(/\D/g, '').length < 10) ok = false;
    if (input.name === 'cep' && v.replace(/\D/g, '').length !== 8) ok = false;
    field.classList.toggle('has-error', !ok);
    return ok;
  }

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
    const cep      = form.querySelector('#popup-cep').value.trim();

    const result = await window.LaserCEP.resolve(cep);

    // Lead é registrado em qualquer caso (mesmo sem unidade)
    window.LaserAnalytics.trackLead('popup_brinde', {
      nome, whatsapp, cep,
      cidade: result.cep && result.cep.cidade,
      uf: result.cep && result.cep.uf,
      unidadeId: result.unidade ? result.unidade.id : null,
      unidadeNome: result.unidade ? result.unidade.nome : null,
      hasUnidade: result.hasUnidade,
      brinde: 'Sessão de Rejuvenescimento Facial',
    });

    markSeen('submitted', { nome, whatsapp, cep, unidadeId: result.unidade ? result.unidade.id : null });
    clearTimeout(nagTimer);

    // Renderiza tela de sucesso
    form.parentElement.style.display = 'none';
    const successView = overlay.querySelector('#popup-success-view');
    successView.style.display = 'block';

    const unidadeInfo = overlay.querySelector('#popup-unidade-info');
    const waBtn = overlay.querySelector('#popup-whatsapp-btn');
    const successMsg = overlay.querySelector('#popup-success-msg');

    if (result.hasUnidade && result.unidade) {
      const u = result.unidade;
      successMsg.textContent = `A unidade ${u.nome} (${u.cidade}/${u.uf}) vai entrar em contato com você para resgatar seu brinde.`;
      unidadeInfo.innerHTML = `
        <div class="popup-unit-card">
          <div class="popup-unit-eyebrow">Sua unidade</div>
          <div class="popup-unit-name">${u.nome}</div>
          <div class="popup-unit-meta">${u.endereco}</div>
          <div class="popup-unit-meta">${u.horario}</div>
        </div>
      `;
      const msg = `Olá ${u.nome}! Sou ${nome}, vim pelo site da Laser & Co (CEP ${cep}) e quero resgatar meu brinde de uma sessão de Rejuvenescimento Facial.`;
      waBtn.href = window.LaserCEP.whatsappUrl(u, msg);
    } else {
      successMsg.textContent = 'Ainda estamos chegando à sua cidade, avisamos assim que uma unidade abrir por aí.';
      unidadeInfo.style.display = 'none';
      waBtn.style.display = 'none';
    }

    submitBtn.disabled = false;
    btnText.textContent = orig;
  }

  function init() {
    if (document.querySelector('[data-no-popup]')) return;

    document.body.insertAdjacentHTML('beforeend', buildPopupHTML());
    const overlay = document.getElementById('popup-captacao');
    overlayEl = overlay;
    const form = overlay.querySelector('#popup-form');
    const closeBtn = overlay.querySelector('#popup-close');

    applyPhoneMask(overlay.querySelector('#popup-whatsapp'));
    window.LaserCEP.applyMask(overlay.querySelector('#popup-cep'));

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
    form.querySelectorAll('.input').forEach(input => {
      input.addEventListener('blur', () => validateField(input.closest('.field')));
      input.addEventListener('input', () => input.closest('.field').classList.remove('has-error'));
    });

    setTimeout(triggerPopup, FIRST_DELAY_MS);
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
