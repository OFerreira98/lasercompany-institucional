/* ============================================================
   CHATBOT DE TRIAGEM
   ============================================================
   Fluxo guiado:
   1. Saudação + pede NOME
   2. Cumprimenta + pede CEP
   3. Mostra unidade + 2 caminhos:
      a) Falar no WhatsApp da unidade (lead → agendamento_chatbot)
      b) Tirar uma dúvida (abre Q&A contextual)
   4. Q&A: cada pergunta vista é REMOVIDA das opções
   5. Sempre que possível, oferece o WhatsApp como saída
   ============================================================ */

(function() {
  function buildHTML() {
    return `
<button class="chatbot-trigger" id="chatbot-trigger" aria-label="Abrir atendimento Laser & Co">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
  </svg>
</button>

<div class="chatbot-window" id="chatbot-window" role="dialog" aria-modal="false" aria-labelledby="chatbot-name">
  <div class="chatbot-header">
    <div class="chatbot-avatar" aria-hidden="true">L&amp;C</div>
    <div class="chatbot-info">
      <div class="chatbot-info-name" id="chatbot-name">Atendimento Laser &amp; Co</div>
      <div class="chatbot-info-status">Online agora</div>
    </div>
    <button class="chatbot-close" id="chatbot-close" aria-label="Fechar chat">&times;</button>
  </div>
  <div class="chatbot-body" id="chatbot-body" aria-live="polite"></div>
  <form class="chatbot-footer" id="chatbot-footer">
    <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Digite sua mensagem…" autocomplete="off">
    <button type="submit" class="chatbot-send" aria-label="Enviar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </button>
  </form>
</div>`;
  }

  const state = {
    step: 'idle',
    nome: null,
    cep: null,
    cepData: null,
    unidade: null,
    procedimentoInteresse: null,
    askedQuestions: new Set(),
  };

  const FAQ_LIST = [
    { id: 'doi',       label: 'O procedimento dói?',           answer: 'Tranquila! A maioria dos nossos procedimentos a laser causa apenas uma leve sensação de aquecimento ou pequenas picadinhas. Nossos equipamentos têm sistema de resfriamento que torna a sessão confortável.' },
    { id: 'sessoes',   label: 'Quantas sessões são?',           answer: 'Depende do procedimento. Para depilação a laser, em média 6 a 10 sessões. Para rejuvenescimento facial, 3 a 5 sessões. A profissional define o protocolo ideal na sua avaliação gratuita.' },
    { id: 'preco',     label: 'Quanto custa?',                  answer: 'Trabalhamos com preços acessíveis e parcelamento em até 12x no cartão. Os valores variam por procedimento, a unidade da sua região passa a tabela atualizada com as condições especiais.' },
    { id: 'pagamento', label: 'Quais formas de pagamento?',     answer: 'Aceitamos todos os cartões de crédito (parcelamento em até 12x), débito, PIX e boleto (em até 24x). A condição exata é tratada diretamente com a unidade.' },
    { id: 'horario',   label: 'Qual o horário de funcionamento?', answer: 'A maioria das nossas unidades atende de segunda a sábado, das 9h às 20h. A unidade da sua região tem o horário exato (já enviei no card acima).' },
    { id: 'avaliacao', label: 'Como funciona a avaliação?',      answer: 'A avaliação é gratuita e sem compromisso. Você agenda um horário, nossa equipe avalia sua pele/região e define o melhor protocolo, junto com as condições e parcelamento.' },
    { id: 'gestante',  label: 'Posso fazer grávida ou amamentando?', answer: 'Alguns procedimentos não são indicados para gestantes ou lactantes. Na avaliação gratuita, a profissional indica o que é seguro pra você nesse momento.' },
    { id: 'recuperacao', label: 'Tem recuperação ou afasta do trabalho?', answer: 'Não há tempo de inatividade. Você retoma as atividades normais logo após a sessão, seguindo os cuidados orientados pela equipe.' },
  ];

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  function addMessage(who, html, options) {
    const body = document.getElementById('chatbot-body');
    const div = document.createElement('div');
    div.className = `chatbot-msg ${who}`;
    div.innerHTML = html;
    body.appendChild(div);

    if (options && options.length) {
      const qr = document.createElement('div');
      qr.className = 'chatbot-quick-replies';
      qr.dataset.role = 'options';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chatbot-quick-reply';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          // Remove TODAS as quick-replies anteriores ao clicar (uma escolha por turno)
          body.querySelectorAll('.chatbot-quick-replies').forEach(b => b.remove());
          handleOption(opt);
        });
        qr.appendChild(btn);
      });
      body.appendChild(qr);
    }
    body.scrollTop = body.scrollHeight;
  }

  async function botSay(html, options) {
    await delay(650);
    addMessage('bot', html, options);
  }

  /* ---------- Início ---------- */
  async function greeting() {
    state.step = 'awaiting_name';
    await botSay('Oi! Sou o atendimento da Laser &amp; Co. <br>Como posso te chamar?');
  }

  /* ---------- Após receber o nome ---------- */
  async function afterName() {
    state.step = 'awaiting_cep';
    await botSay(`Prazer, <strong>${state.nome}</strong>! Para te conectar com a unidade certa, me passa seu <strong>CEP</strong>?`);
  }

  /* ---------- Após receber o CEP ---------- */
  async function afterCEP() {
    if (!state.unidade) {
      await botSay(`Hmm, ainda não temos uma unidade próxima ao CEP ${state.cep}. Mas registramos seu interesse e avisamos quando uma unidade abrir na sua região!`);
      window.LaserAnalytics.trackLead('chatbot_expansao', {
        nome: state.nome, cep: state.cep,
        cidade: state.cepData && state.cepData.cidade,
        uf: state.cepData && state.cepData.uf,
      });
      state.step = 'done';
      return;
    }

    const u = state.unidade;
    const msg = `Olá ${u.nome}! Sou ${state.nome}, vim pelo chat do site (CEP ${state.cep}) e gostaria de mais informações.`;
    const waUrl = window.LaserCEP.whatsappUrl(u, msg);

    await botSay(`Encontrei! A unidade <strong>${u.nome}</strong> atende sua região.`);
    await botSay(`
      <div class="chatbot-unit">
        <div class="chatbot-unit-name">${u.nome}</div>
        <div class="chatbot-unit-line">${u.endereco}</div>
        <div class="chatbot-unit-line">${u.horario}</div>
        <a href="${waUrl}" target="_blank" rel="noopener" class="chatbot-unit-wa">
          Falar no WhatsApp da unidade
        </a>
      </div>
    `);

    // Registra lead
    window.LaserAnalytics.trackLead('chatbot', {
      nome: state.nome,
      cep: state.cep,
      cidade: state.cepData.cidade,
      uf: state.cepData.uf,
      unidadeId: u.id,
      unidadeNome: u.nome,
    });

    state.step = 'menu';
    await offerMenu();
  }

  async function offerMenu() {
    const availableFaqs = FAQ_LIST.filter(f => !state.askedQuestions.has(f.id));

    if (availableFaqs.length === 0) {
      await botSay(`Já respondi todas as dúvidas frequentes. Para mais detalhes, fale direto com a unidade no WhatsApp acima 🙂`);
      state.step = 'done';
      return;
    }

    // Mostra até 4 perguntas disponíveis, mais a opção "Outra dúvida"
    const options = availableFaqs.slice(0, 4).map(f => ({ type: 'faq', id: f.id, label: f.label }));
    if (availableFaqs.length > 4) {
      options.push({ type: 'more', label: 'Ver mais perguntas' });
    }
    options.push({ type: 'end', label: 'Já está ótimo, obrigado!' });

    await botSay('Posso esclarecer alguma dúvida antes?', options);
  }

  async function handleOption(opt) {
    if (opt.type === 'faq') {
      state.askedQuestions.add(opt.id);
      addMessage('user', opt.label);
      const faq = FAQ_LIST.find(f => f.id === opt.id);
      await botSay(faq.answer);
      await offerMenu();
      return;
    }
    if (opt.type === 'more') {
      addMessage('user', opt.label);
      await offerMenu();
      return;
    }
    if (opt.type === 'end') {
      addMessage('user', opt.label);
      await botSay(`De nada, ${state.nome}! Quando quiser agendar, é só falar com a unidade no WhatsApp acima. Até logo!`);
      state.step = 'done';
      return;
    }
  }

  /* ---------- Captura do input livre ---------- */
  function extractCEP(text) {
    const match = text.match(/\d{5}-?\d{3}/);
    return match ? match[0] : null;
  }

  function isProbableName(text) {
    const t = text.trim();
    if (t.length < 2 || t.length > 60 || /\d/.test(t)) return false;
    return /^[a-záàâãéèêíïóôõöúüçñ\s\-']+$/i.test(t);
  }

  async function handleUserInput(text) {
    text = text.trim();
    if (!text) return;
    addMessage('user', text);

    // Sempre permite reset detectando "agendar"
    const lower = text.toLowerCase();

    if (state.step === 'awaiting_name') {
      if (isProbableName(text)) {
        state.nome = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        await afterName();
      } else {
        await botSay('Por favor, me diga só seu nome (sem números, por favor).');
      }
      return;
    }

    if (state.step === 'awaiting_cep') {
      const cepInText = extractCEP(text) || (text.replace(/\D/g, '').length === 8 ? text.replace(/\D/g, '') : null);
      if (cepInText) {
        state.cep = cepInText;
        await botSay('Buscando a unidade Laser &amp; Co da sua região…');
        const r = await window.LaserCEP.resolve(cepInText);
        state.cepData = r.cep;
        state.unidade = r.unidade || null;
        await afterCEP();
      } else {
        await botSay('Não consegui ler o CEP. Tente no formato 00000-000 (8 dígitos).');
      }
      return;
    }

    if (state.step === 'menu' || state.step === 'done') {
      // Tenta achar uma pergunta FAQ pelo texto
      const matched = FAQ_LIST.find(f =>
        !state.askedQuestions.has(f.id) &&
        (lower.includes(f.id) || f.label.toLowerCase().split(' ').some(w => w.length > 4 && lower.includes(w)))
      );
      if (matched) {
        state.askedQuestions.add(matched.id);
        await botSay(matched.answer);
        await offerMenu();
        return;
      }
      // Fallback
      await botSay('Pra essa pergunta, prefiro te conectar direto com a unidade no WhatsApp acima, assim você fala com quem atende você na ponta.');
      return;
    }
  }

  function init() {
    document.body.insertAdjacentHTML('beforeend', buildHTML());

    const trigger = document.getElementById('chatbot-trigger');
    const win = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-footer');
    const input = document.getElementById('chatbot-input');
    const badge = trigger.querySelector('.chatbot-trigger-badge');

    let opened = false;
    trigger.addEventListener('click', () => {
      const visible = win.classList.toggle('visible');
      if (visible && !opened) {
        opened = true;
        greeting();
        if (badge) badge.remove();
      }
      window.LaserAnalytics && window.LaserAnalytics.trackEvent(visible ? 'chatbot_open' : 'chatbot_close');
    });

    closeBtn.addEventListener('click', () => win.classList.remove('visible'));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      handleUserInput(val);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
