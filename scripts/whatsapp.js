/* ============================================================
   WHATSAPP FLUTUANTE (Item 5.3 do roteiro)
   ============================================================
   - Fixo no canto inferior direito
   - Aparece após 25% de rolagem
   - Se CEP já conhecido → abre WhatsApp da unidade
   - Se CEP desconhecido → solicita CEP em um passo único
   ============================================================ */

(function() {
  function buildHTML() {
    return `
<a href="#" class="whatsapp-float" id="whatsapp-float" aria-label="Falar com a Laser & Co no WhatsApp">
  <span class="icon" aria-hidden="true">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor"><path d="M16.1 5.3c-6 0-10.9 4.9-10.9 10.9 0 1.9.5 3.7 1.4 5.3l-1.5 5.5 5.6-1.5c1.5.8 3.2 1.3 5 1.3 6 0 10.9-4.9 10.9-10.9 0-2.9-1.1-5.6-3.2-7.7-2-2-4.7-3.1-7.6-3.1zm0 19.8c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.3.9.9-3.2-.2-.3c-.9-1.4-1.3-3-1.3-4.7 0-5 4.1-9 9-9 2.4 0 4.7.9 6.4 2.6 1.7 1.7 2.6 4 2.6 6.4 0 5-4.1 9-9.1 9zm5-6.8c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6 0 1.5 1.1 3 1.2 3.2.2.2 2.2 3.4 5.3 4.7 2.5 1.1 3.1 1 3.7.9.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.2-.3-.2-.6-.4z"/></svg>
  </span>
</a>`;
  }

  function buildCEPModalHTML() {
    return `
<div class="modal-overlay" id="cep-modal" role="dialog" aria-modal="true">
  <div class="modal" style="max-width: 480px;">
    <button class="popup-close" aria-label="Fechar" id="cep-modal-close" style="position: absolute; top: 1rem; right: 1rem;">×</button>
    <div class="popup-eyebrow" style="margin-top: 0.5rem;">Para conectar você à unidade certa</div>
    <h3 class="popup-title">Qual é o seu <span class="italic">CEP</span>?</h3>
    <p class="popup-sub">Em segundos, abrimos o WhatsApp da unidade Laser & Co da sua região.</p>
    <form id="cep-modal-form">
      <div class="field">
        <label for="cep-modal-input" class="field-label">CEP</label>
        <input type="text" id="cep-modal-input" class="input" placeholder="00000-000" inputmode="numeric" maxlength="9" required>
        <div class="field-error">Informe um CEP válido (8 dígitos).</div>
      </div>
      <button type="submit" class="btn btn-primary btn-block" id="cep-modal-submit">
        <span>Abrir WhatsApp da minha unidade</span>
      </button>
    </form>
  </div>
</div>`;
  }

  function init() {
    document.body.insertAdjacentHTML('beforeend', buildHTML());
    document.body.insertAdjacentHTML('beforeend', buildCEPModalHTML());

    const floatBtn = document.getElementById('whatsapp-float');
    const modal = document.getElementById('cep-modal');
    const modalForm = document.getElementById('cep-modal-form');
    const modalInput = document.getElementById('cep-modal-input');
    const modalClose = document.getElementById('cep-modal-close');
    const modalSubmit = document.getElementById('cep-modal-submit');

    window.LaserCEP.applyMask(modalInput);

    function showFloat() {
      floatBtn.classList.add('visible');
    }

    // Mostrar após 25% de scroll
    function onScroll() {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct >= 0.25) {
        showFloat();
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // Também mostra após 8s mesmo sem scroll (página curta)
    setTimeout(showFloat, 8000);

    function openModal() {
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalInput.focus(), 300);
    }

    function closeModal() {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    }

    floatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const saved = window.LaserCEP.getSaved();
      if (saved && saved.unidadeId) {
        const unidade = window.LaserData.unidades.find(u => u.id === saved.unidadeId);
        if (unidade) {
          window.LaserAnalytics.trackEvent('whatsapp_float_click', { unidadeId: unidade.id });
          const msg = `Olá ${unidade.nome}! Vim pelo site da Laser & Co e gostaria de mais informações.`;
          window.open(window.LaserCEP.whatsappUrl(unidade, msg), '_blank');
          return;
        }
      }
      openModal();
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
    });

    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cep = modalInput.value.trim();
      if (!window.LaserCEP.isValid(cep)) {
        modalInput.closest('.field').classList.add('has-error');
        return;
      }
      modalSubmit.disabled = true;
      modalSubmit.querySelector('span').textContent = 'Procurando…';

      const result = await window.LaserCEP.resolve(cep);

      window.LaserAnalytics.trackEvent('whatsapp_float_cep_submit', {
        cep,
        hasUnidade: result.hasUnidade,
        unidadeId: result.unidade ? result.unidade.id : null,
        isDistant: !!result.isDistant,
      });

      if (result.hasUnidade && result.unidade && !result.isDistant) {
        // Unidade da regiao do cliente -> abre WhatsApp direto
        const msg = `Olá ${result.unidade.nome}! Vim pelo site da Laser & Co (CEP ${cep}) e gostaria de mais informações.`;
        window.open(window.LaserCEP.whatsappUrl(result.unidade, msg), '_blank');
        closeModal();
      } else if (result.hasUnidade && result.unidade && result.isDistant) {
        // Unidade mais proxima esta em outra cidade -> avisa transparente
        // e oferece a opcao de falar com ela mesmo assim.
        const u = result.unidade;
        const userCity = (result.cep && result.cep.cidade) || 'sua cidade';
        const uCity = result.unidadeCity || u.nome;
        const fld = modalInput.closest('.field');
        const errEl = fld.querySelector('.field-error');
        errEl.innerHTML = `Ainda não temos unidade em <strong>${userCity}</strong>. A mais próxima é a <strong>${u.nome}</strong>, em ${uCity}/${u.uf}.`;
        fld.classList.add('has-error');
        // Reaproveita o botao do form pra abrir a unidade distante
        modalSubmit.querySelector('span').textContent = `Falar com a unidade ${u.nome} mesmo assim`;
        modalSubmit.disabled = false;
        modalSubmit.onclick = (ev) => {
          ev.preventDefault();
          const msg = `Olá ${u.nome}! Vim pelo site da Laser & Co (CEP ${cep}, ${userCity}/${u.uf}) e gostaria de mais informações.`;
          window.open(window.LaserCEP.whatsappUrl(u, msg), '_blank');
          closeModal();
        };
        window.LaserAnalytics.trackLead('expansao_cep', { cep, cidade: userCity, uf: u.uf, distante: true, sugerida: u.id });
        return;
      } else {
        const fld = modalInput.closest('.field');
        const errEl = fld.querySelector('.field-error');
        errEl.textContent = 'Ainda não temos unidade na sua região. Avisaremos quando chegarmos!';
        fld.classList.add('has-error');
        // Salva como lead de expansão
        window.LaserAnalytics.trackLead('expansao_cep', { cep });
      }

      modalSubmit.disabled = false;
      modalSubmit.querySelector('span').textContent = 'Abrir WhatsApp da minha unidade';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
