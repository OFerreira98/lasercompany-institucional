/* ============================================================
   PAGE-AGENDAMENTO, Lógica da Página Agendamento
   ============================================================
   Conforme item 6.3 do roteiro:
   - 3 etapas: Procedimento → Identificação → WhatsApp da unidade
   - Procedimento pode vir pré-selecionado via ?procedimento=id
   - Unidade pode vir pré-selecionada via ?unidade=id
   - Etapa 2 concluída = lead de "agendamento_interesse"
     (mesmo que o usuário não clique no WhatsApp)
   - Etapa 3 clicada = lead de "agendamento"
   ============================================================ */

(function() {
  const state = {
    procedimento: null,
    nome: '',
    whatsapp: '',
    cep: '',
    cepData: null,
    unidade: null,
    interesseTracked: false,
  };

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function setStep(n) {
    document.querySelectorAll('.agendamento-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');

    document.querySelectorAll('.stepper-step').forEach(s => {
      const stepNum = parseInt(s.dataset.step);
      s.classList.toggle('active', stepNum === n);
      s.classList.toggle('done', stepNum < n);
    });

    // Foca na etapa ativa (não joga a página inteira pro topo)
    const stepEl = document.getElementById(`step-${n}`);
    if (stepEl) {
      const y = stepEl.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
    window.LaserAnalytics.trackEvent('agendamento_step', { step: n });
  }

  /* -------- ETAPA 1, Procedimento -------- */
  function renderProcSegment(segment) {
    const list = document.getElementById('proc-options-list');
    const items = window.LaserData.procedimentos[segment];
    list.innerHTML = items.map(p => `
      <button type="button" class="proc-option${state.procedimento && state.procedimento.id === p.id ? ' selected' : ''}"
              data-id="${p.id}" data-cat="${segment}" role="option">
        ${p.nome}
      </button>
    `).join('');

    list.querySelectorAll('.proc-option').forEach(opt => {
      opt.addEventListener('click', () => {
        list.querySelectorAll('.proc-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.procedimento = window.LaserData.findProcedimento(opt.dataset.id);
        document.getElementById('step-1-next').disabled = false;
      });
    });
  }

  function initStep1() {
    const tabs = document.querySelectorAll('#proc-segment-tabs .pill');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(o => o.classList.remove('active'));
        t.classList.add('active');
        renderProcSegment(t.dataset.segment);
      });
    });

    // Verifica se procedimento veio na URL
    const procFromURL = getParam('procedimento');
    let segment = 'estetica';
    if (procFromURL) {
      const proc = window.LaserData.findProcedimento(procFromURL);
      if (proc) {
        state.procedimento = proc;
        segment = proc.categoria;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.segment === segment));
        document.getElementById('step-1-next').disabled = false;
      }
    }
    renderProcSegment(segment);

    document.getElementById('step-1-next').addEventListener('click', () => {
      if (!state.procedimento) return;
      document.getElementById('step-2-proc-name').textContent = state.procedimento.nome;
      setStep(2);
    });
  }

  /* -------- ETAPA 2, Identificação -------- */
  function validateStep2() {
    const form = document.getElementById('step-2-form');
    const fields = form.querySelectorAll('.field');
    let ok = true;
    fields.forEach(f => {
      const input = f.querySelector('.input');
      const v = input.value.trim();
      let valid = true;
      if (input.required && !v) valid = false;
      if (input.name === 'whatsapp' && v.replace(/\D/g, '').length < 10) valid = false;
      if (input.name === 'cep' && v.replace(/\D/g, '').length !== 8) valid = false;
      f.classList.toggle('has-error', !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  function initStep2() {
    const form = document.getElementById('step-2-form');
    const backBtn = document.getElementById('step-2-back');
    const nextBtn = document.getElementById('step-2-next');

    // Limpa erro ao digitar
    form.querySelectorAll('.input').forEach(input => {
      input.addEventListener('input', () => input.closest('.field').classList.remove('has-error'));
    });

    backBtn.addEventListener('click', () => setStep(1));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep2()) return;

      state.nome = form.querySelector('#ag-nome').value.trim();
      state.whatsapp = form.querySelector('#ag-whatsapp').value.trim();
      state.cep = form.querySelector('#ag-cep').value.trim();

      nextBtn.disabled = true;
      nextBtn.innerHTML = '<span>Procurando sua unidade…</span>';

      const r = await window.LaserCEP.resolve(state.cep);
      state.cepData = r.cep;
      state.unidade = r.unidade || null;

      // IMPORTANTE: Etapa 2 concluída conta como "interesse em agendamento"
      // mesmo que o usuário não clique no WhatsApp (item 6.3 do roteiro).
      if (!state.interesseTracked) {
        state.interesseTracked = true;
        window.LaserAnalytics.trackLead('agendamento_interesse', {
          nome: state.nome,
          whatsapp: state.whatsapp,
          cep: state.cep,
          cidade: r.cep && r.cep.cidade,
          uf: r.cep && r.cep.uf,
          procedimentoId: state.procedimento.id,
          procedimentoNome: state.procedimento.nome,
          unidadeId: state.unidade ? state.unidade.id : null,
          unidadeNome: state.unidade ? state.unidade.nome : null,
          hasUnidade: !!state.unidade,
        });
      }

      renderStep3(r);
      setStep(3);

      nextBtn.disabled = false;
      nextBtn.innerHTML = 'Encontrar minha unidade';
    });
  }

  /* -------- ETAPA 3, Roteamento WhatsApp -------- */
  function renderStep3(r) {
    const content = document.getElementById('step-3-content');

    if (r.hasUnidade && r.unidade) {
      const u = r.unidade;
      const msg = `Olá ${u.nome}! Sou ${state.nome} (WhatsApp ${state.whatsapp}, CEP ${state.cep}). Tenho interesse em agendar uma avaliação para ${state.procedimento.nome}.`;
      const waUrl = window.LaserCEP.whatsappUrl(u, msg);

      content.innerHTML = `
        <div class="unidade-found-card">
          <div class="unidade-found-eyebrow">Solicitação enviada para sua unidade</div>
          <h2 class="unidade-found-name">${u.nome}</h2>
          <p class="unidade-found-result">
            Enviamos sua solicitação de avaliação para a unidade <strong>${u.nome}</strong> (${u.cidade}/${u.uf}).
            Para garantir seu horário, <strong>confirme agora</strong> pelo WhatsApp. Um atendente da unidade já está pronto para te responder.
          </p>
          <div class="unidade-found-line">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${u.endereco}</span>
          </div>
          <div class="unidade-found-line">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${u.horario}</span>
          </div>
          <div class="unidade-found-line">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Avaliação gratuita, sem compromisso</span>
          </div>
        </div>

        <div style="background: var(--color-surface); padding: var(--sp-5); border-radius: var(--radius-lg); margin-bottom: var(--sp-5); border: 1px solid var(--color-border);">
          <div style="font-family: var(--font-accent); font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: var(--ls-wider); color: var(--color-text-muted); margin-bottom: var(--sp-2);">Resumo do seu agendamento</div>
          <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem; font-size: var(--fs-sm);">
            <span style="color: var(--color-text-muted);">Procedimento:</span><strong>${state.procedimento.nome}</strong>
            <span style="color: var(--color-text-muted);">Nome:</span><strong>${state.nome}</strong>
            <span style="color: var(--color-text-muted);">WhatsApp:</span><strong>${state.whatsapp}</strong>
            <span style="color: var(--color-text-muted);">CEP:</span><strong>${state.cep}</strong>
          </div>
        </div>

        <div class="agendamento-actions">
          <button type="button" class="btn btn-ghost" id="step-3-back">← Editar dados</button>
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-lg btn-arrow" id="step-3-wa-btn" style="flex: 2;">
            Confirmar agendamento no WhatsApp
          </a>
        </div>
      `;

      document.getElementById('step-3-back').addEventListener('click', () => setStep(2));
      document.getElementById('step-3-wa-btn').addEventListener('click', () => {
        // Conversão B, Lead de agendamento (clicou no WhatsApp)
        window.LaserAnalytics.trackLead('agendamento', {
          nome: state.nome,
          whatsapp: state.whatsapp,
          cep: state.cep,
          cidade: r.cep.cidade,
          uf: r.cep.uf,
          procedimentoId: state.procedimento.id,
          procedimentoNome: state.procedimento.nome,
          unidadeId: u.id,
          unidadeNome: u.nome,
          whatsappClicked: true,
        });
      });
    } else {
      content.innerHTML = `
        <div class="unidade-found-card" style="text-align: center;">
          <div class="unidade-found-eyebrow" style="color: var(--color-warning);">Ainda não chegamos por aí</div>
          <h2 class="unidade-found-name">Estamos chegando à sua região!</h2>
          <p style="color: var(--color-text-soft); line-height: 1.7; margin-bottom: var(--sp-4);">
            Por enquanto, não temos uma unidade Laser &amp; Co próxima do CEP <strong>${state.cep}</strong>.
            Mas registramos seu interesse e te avisamos assim que uma unidade abrir aí!
          </p>
          <p style="font-size: var(--fs-sm); color: var(--color-text-muted);">
            Enquanto isso, você pode falar com nossa equipe pelo WhatsApp central.
          </p>
        </div>

        <div class="agendamento-actions">
          <button type="button" class="btn btn-ghost" id="step-3-back">← Tentar outro CEP</button>
          <a href="https://wa.me/5511999990000?text=${encodeURIComponent('Olá! Sou ' + state.nome + ', meu CEP é ' + state.cep + '. Tenho interesse em ' + state.procedimento.nome + '. Quando vocês chegarão à minha região?')}" target="_blank" rel="noopener" class="btn btn-primary btn-arrow">Falar com a central</a>
        </div>
      `;
      document.getElementById('step-3-back').addEventListener('click', () => setStep(2));
    }
  }

  function init() {
    initStep1();
    initStep2();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
