/* ============================================================
   PAGE-VAGAS, Lógica da Página Vagas
   ============================================================
   Conforme item 6.5 do roteiro:
   - Lista de vagas com cidade, função, descrição
   - Botão "Quero me candidatar" abre form
   - Form: dados + upload de currículo
   - Lead vai para banco de RH organizado
   - Alimenta relatório de vagas e candidatos
   ============================================================ */

(function() {

  function renderVagas() {
    const grid = document.getElementById('vagas-grid');
    if (!grid) return;
    grid.innerHTML = window.LaserData.vagas.map(v => `
      <article class="vaga-card${v.destaque ? ' destaque' : ''}" data-id="${v.id}">
        <div class="vaga-card-meta">
          <span class="badge">${v.tipo}</span>
          <span class="badge">${v.nivel}</span>
          ${v.destaque ? '<span class="badge badge-accent">Em destaque</span>' : ''}
        </div>
        <div class="vaga-card-cidade">
          <svg class="ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${v.cidade}
        </div>
        <h3 class="vaga-card-funcao">${v.funcao}</h3>
        <p class="vaga-card-desc">${v.desc}</p>
        <ul class="vaga-card-info">
          <li><strong>Regime:</strong> ${v.tipo}</li>
          <li><strong>Nível:</strong> ${v.nivel}</li>
          <li><strong>Local:</strong> ${v.cidade}</li>
        </ul>
        <button type="button" class="btn btn-primary btn-arrow" data-vaga="${v.id}">Quero me candidatar</button>
      </article>
    `).join('');

    grid.querySelectorAll('[data-vaga]').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.vaga));
    });
  }

  function openModal(vagaId) {
    const vaga = window.LaserData.vagas.find(v => v.id === vagaId);
    if (!vaga) return;

    const modal = document.getElementById('vaga-modal');
    const content = document.getElementById('vaga-modal-content');

    content.innerHTML = `
      <div class="proc-detail-eyebrow">Candidatura para</div>
      <h2 class="proc-detail-title">${vaga.funcao}</h2>
      <p style="color: var(--color-text-soft); margin-bottom: var(--sp-5); font-size: var(--fs-sm);">📍 ${vaga.cidade} · ${vaga.tipo} · ${vaga.nivel}</p>

      <form id="vaga-form" novalidate>
        <div class="field">
          <label class="field-label" for="vg-nome">Nome completo <span class="required">*</span></label>
          <input type="text" id="vg-nome" name="nome" class="input" required>
          <div class="field-error">Informe seu nome completo.</div>
        </div>
        <div class="grid grid-2">
          <div class="field">
            <label class="field-label" for="vg-email">E-mail <span class="required">*</span></label>
            <input type="email" id="vg-email" name="email" class="input" required>
            <div class="field-error">Informe um e-mail válido.</div>
          </div>
          <div class="field">
            <label class="field-label" for="vg-tel">WhatsApp <span class="required">*</span></label>
            <input type="tel" id="vg-tel" name="whatsapp" class="input" placeholder="(11) 99999-9999" data-mask="phone" required>
            <div class="field-error">Informe um WhatsApp válido.</div>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="field">
            <label class="field-label" for="vg-cidade">Cidade onde mora</label>
            <input type="text" id="vg-cidade" name="cidade_candidato" class="input">
          </div>
          <div class="field">
            <label class="field-label" for="vg-linkedin">LinkedIn (opcional)</label>
            <input type="url" id="vg-linkedin" name="linkedin" class="input" placeholder="linkedin.com/in/...">
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="vg-msg">Por que você quer essa vaga? (opcional)</label>
          <textarea id="vg-msg" name="mensagem" class="textarea" rows="4" maxlength="500"></textarea>
        </div>
        <div class="field">
          <label class="field-label">Currículo (PDF, DOC) <span class="required">*</span></label>
          <div class="file-field">
            <input type="file" id="vg-cv" name="curriculo" accept=".pdf,.doc,.docx" required>
            <div class="file-label"><span class="file-link">Clique para enviar</span> ou arraste o arquivo aqui</div>
          </div>
          <div class="field-error">Anexe seu currículo (PDF ou DOC).</div>
        </div>
        <label class="checkbox-field">
          <input type="checkbox" id="vg-consent" required>
          <span>Autorizo o uso dos meus dados para esta candidatura e processos futuros, conforme a LGPD.</span>
        </label>

        <div class="agendamento-actions" style="margin-top: var(--sp-5);">
          <button type="button" class="btn btn-ghost" id="vaga-cancel">Cancelar</button>
          <button type="submit" class="btn btn-primary btn-arrow" id="vaga-submit">Enviar candidatura</button>
        </div>
      </form>
    `;

    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';

    window.LaserAnalytics.trackEvent('vaga_modal_open', { vagaId, funcao: vaga.funcao });

    // Atualiza nome do arquivo no label
    const fileInput = content.querySelector('#vg-cv');
    const fileLabel = content.querySelector('.file-label');
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        fileLabel.innerHTML = `<strong style="color: var(--color-accent);">✓ ${fileInput.files[0].name}</strong>`;
      }
    });

    // Drag and drop visual
    const fileField = content.querySelector('.file-field');
    fileField.addEventListener('dragover', (e) => { e.preventDefault(); fileField.style.borderColor = 'var(--color-accent)'; });
    fileField.addEventListener('dragleave', () => { fileField.style.borderColor = ''; });
    fileField.addEventListener('drop', (e) => {
      e.preventDefault();
      fileField.style.borderColor = '';
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    });

    // Limpa erros ao digitar
    content.querySelectorAll('.input, .textarea').forEach(input => {
      input.addEventListener('input', () => input.closest('.field').classList.remove('has-error'));
    });

    content.querySelector('#vaga-cancel').addEventListener('click', closeModal);

    const form = content.querySelector('#vaga-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(form, vaga);
    });
  }

  function handleSubmit(form, vaga) {
    const fields = form.querySelectorAll('.field');
    let ok = true;
    fields.forEach(f => {
      const input = f.querySelector('.input, .textarea, input[type="file"]');
      if (!input) return;
      let valid = true;
      if (input.required) {
        if (input.type === 'file') valid = input.files.length > 0;
        else if (input.type === 'email') valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim());
        else if (input.name === 'whatsapp') valid = input.value.replace(/\D/g, '').length >= 10;
        else valid = !!input.value.trim();
      }
      f.classList.toggle('has-error', !valid);
      if (!valid) ok = false;
    });

    const consent = form.querySelector('#vg-consent');
    if (!consent.checked) {
      window.LaserUI.toast('É preciso autorizar o uso dos dados para enviar.', 'danger');
      return;
    }
    if (!ok) return;

    const submitBtn = form.querySelector('#vaga-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    const data = {
      vagaId: vaga.id,
      funcao: vaga.funcao,
      cidadeVaga: vaga.cidade,
      nome: form.querySelector('#vg-nome').value.trim(),
      email: form.querySelector('#vg-email').value.trim(),
      whatsapp: form.querySelector('#vg-tel').value.trim(),
      cidadeCandidato: form.querySelector('#vg-cidade').value.trim(),
      linkedin: form.querySelector('#vg-linkedin').value.trim(),
      mensagem: form.querySelector('#vg-msg').value.trim(),
      curriculoNome: form.querySelector('#vg-cv').files[0]?.name || null,
    };

    // Em produção: POST /api/candidaturas + upload do arquivo para o RH
    setTimeout(() => {
      window.LaserAnalytics.trackLead('recrutamento', data);

      // Tela de sucesso
      document.getElementById('vaga-modal-content').innerHTML = `
        <div style="text-align: center; padding: var(--sp-5);">
          <div class="popup-success-icon">✓</div>
          <h2 class="popup-title">Candidatura enviada!</h2>
          <p style="color: var(--color-text-soft); line-height: 1.7; margin: var(--sp-3) 0 var(--sp-5);">
            Recebemos sua candidatura para a vaga de <strong style="color: var(--color-accent);">${vaga.funcao}</strong>.
            Em breve, nossa equipe de RH entra em contato.
          </p>
          <p style="font-size: var(--fs-sm); color: var(--color-text-muted); margin-bottom: var(--sp-5);">
            Fique de olho no seu e-mail e WhatsApp.
          </p>
          <button type="button" class="btn btn-primary" id="vaga-success-close">Voltar às vagas</button>
        </div>
      `;
      document.getElementById('vaga-success-close').addEventListener('click', closeModal);
    }, 800);
  }

  function closeModal() {
    const modal = document.getElementById('vaga-modal');
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function init() {
    renderVagas();

    const modal = document.getElementById('vaga-modal');
    document.getElementById('vaga-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
    });

    const bancoBtn = document.getElementById('banco-talentos-btn');
    if (bancoBtn) {
      bancoBtn.addEventListener('click', () => {
        openModal('banco-talentos');
      });
    }

    // Banco de talentos é uma vaga "virtual"
    if (!window.LaserData.vagas.find(v => v.id === 'banco-talentos')) {
      window.LaserData.vagas.push({
        id: 'banco-talentos',
        cidade: 'Qualquer cidade',
        funcao: 'Banco de Talentos',
        desc: 'Envie seu currículo. Quando abrirmos uma vaga compatível com seu perfil, entramos em contato.',
        tipo: 'Geral',
        nivel: 'Todos os níveis',
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
