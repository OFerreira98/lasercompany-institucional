/* ============================================================
   POPUP DE CAPTAÇÃO — "GANHE UM BRINDE"
   ============================================================
   - Aparece após 6s OU em exit intent (o que vier primeiro)
   - 1x por visitante via DUPLA persistência:
       cookie (7 dias) + localStorage (permanente até reset)
   - Após preenchimento OU dismiss: NUNCA mais aparece
   - Lead salvo no localStorage para futuro painel
   - Mensagem alternativa se CEP sem unidade próxima
   ============================================================ */

(function() {
  const COOKIE_NAME   = 'laserco_popup_seen';
  const STORAGE_KEY   = 'laserco_popup_state';
  const COOKIE_DAYS   = 7;
  const DELAY_MS      = 6000;

  function setCookie(name, value, days) {
    const exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${exp.toUTCString()}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function hasSeen() {
    if (getCookie(COOKIE_NAME) === '1') return true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.seen) return true;
      }
    } catch (e) {}
    return false;
  }

  function markSeen(status, extra) {
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        seen: true,
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
        Uma sessão de <span class="italic">Rejuvenescimento Facial</span> <strong class="popup-title-strong">grátis</strong> na sua unidade.
      </h2>
      <p class="popup-sub">Resgate em segundos: informe nome, WhatsApp e CEP. A unidade Laser &amp; Co da sua região fala com você.</p>

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
          <span class="btn-text">Quero meu brinde</span>
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
        <a href="#" target="_blank" rel="noopener" class="btn btn-primary btn-block" id="popup-whatsapp-btn">Falar no WhatsApp da unidade</a>
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
    if (source !== 'submit') markSeen('dismissed');
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

    // Renderiza tela de sucesso
    form.parentElement.style.display = 'none';
    const successView = overlay.querySelector('#popup-success-view');
    successView.style.display = 'block';

    const unidadeInfo = overlay.querySelector('#popup-unidade-info');
    const waBtn = overlay.querySelector('#popup-whatsapp-btn');
    const successMsg = overlay.querySelector('#popup-success-msg');

    if (result.hasUnidade && result.unidade) {
      const u = result.unidade;
      successMsg.textContent = `A unidade ${u.nome} (${u.cidade}/${u.uf}) vai te chamar para resgatar seu brinde.`;
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
      successMsg.textContent = 'Ainda estamos chegando à sua cidade — avisamos assim que uma unidade abrir por aí.';
      unidadeInfo.style.display = 'none';
      waBtn.style.display = 'none';
    }

    submitBtn.disabled = false;
    btnText.textContent = orig;
  }

  function init() {
    if (hasSeen()) return;
    if (document.querySelector('[data-no-popup]')) return;

    document.body.insertAdjacentHTML('beforeend', buildPopupHTML());
    const overlay = document.getElementById('popup-captacao');
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

    let triggered = false;
    function trigger() {
      if (triggered || hasSeen()) return;
      triggered = true;
      show(overlay);
    }

    setTimeout(trigger, DELAY_MS);
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) trigger();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
