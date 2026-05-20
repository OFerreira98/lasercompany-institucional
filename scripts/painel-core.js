/* ============================================================
   PAINEL-CORE, motor compartilhado dos painéis
   ============================================================
   Usado por painel-franqueador.html e painel-franqueado.html.
   Cuida de: sessão/login guard, KPIs, filtros, tabela de leads,
   pipeline de status (quente/morno/frio...), detalhe e export CSV.
   ============================================================ */

window.LaserPainel = (function () {
  const SESSION_KEY = 'laserco_session';

  const STATUS = [
    { key: 'novo', label: 'Novo' },
    { key: 'quente', label: 'Quente' },
    { key: 'morno', label: 'Morno' },
    { key: 'frio', label: 'Frio' },
    { key: 'contatado', label: 'Contatado' },
    { key: 'convertido', label: 'Convertido' },
    { key: 'perdido', label: 'Perdido' },
  ];
  const STATUS_LABEL = {};
  STATUS.forEach((s) => { STATUS_LABEL[s.key] = s.label; });

  const TIPO_LABEL = {
    popup_brinde: 'Brinde (popup)',
    agendamento: 'Agendamento',
    agendamento_interesse: 'Interesse',
    recrutamento: 'Candidatura',
    contato: 'Contato',
    franquia: 'Franquia',
    chatbot: 'Chatbot',
    desconhecido: 'Outro',
  };

  /* rótulos amigáveis para os campos no detalhe do lead */
  const DET_LABEL = {
    nome: 'Nome', whatsapp: 'WhatsApp', email: 'E-mail', cep: 'CEP', cidade: 'Cidade', uf: 'UF',
    bairro: 'Bairro', procedimentoNome: 'Procedimento', unidadeNome: 'Unidade',
    funcao: 'Vaga / função', cidadeVaga: 'Cidade da vaga', cidadeCandidato: 'Cidade do candidato',
    curriculoNome: 'Currículo', mensagem: 'Mensagem', brinde: 'Brinde',
    capital: 'Capital para investir', linkedin: 'LinkedIn',
  };
  const DET_SKIP = { hasUnidade: 1, whatsappClicked: 1, unidadeId: 1, procedimentoId: 1 };

  let state = { session: null, mode: 'franqueador', all: [], filtered: [], dataMode: 'demo' };

  /* ---------------- sessão ---------------- */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function setSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {} }
  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    location.href = 'painel.html';
  }

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }
  function fmtData(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '-';
    const p = (n) => String(n).padStart(2, '0');
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function initialStatus(raw) {
    if (raw.status) return raw.status;
    const t = raw.tipo;
    const d = raw.dados || {};
    if (t === 'agendamento') return 'quente';
    if (t === 'franquia') return 'quente';
    if (t === 'agendamento_interesse') return 'morno';
    if (t === 'popup_brinde') return d.hasUnidade ? 'quente' : 'morno';
    return 'novo';
  }
  function normalize(raw) {
    const d = raw.dados || {};
    return {
      id: raw.id,
      tipo: raw.tipo || 'desconhecido',
      createdAt: raw.timestamp,
      nome: d.nome || '-',
      whatsapp: d.whatsapp || '',
      email: d.email || '',
      cidade: d.cidade || '',
      uf: d.uf || '',
      procedimento: d.procedimentoNome || '',
      funcao: d.funcao || '',
      unidadeId: d.unidadeId || null,
      unidadeNome: d.unidadeNome || (d.unidadeId ? d.unidadeId : ''),
      origem: raw.origem || '',
      curriculoNome: d.curriculoNome || '',
      status: initialStatus(raw),
      raw: raw,
    };
  }
  function interesseDe(l) {
    if (l.tipo === 'recrutamento') return l.funcao || 'Vaga';
    return l.procedimento || '-';
  }
  function waLink(l) {
    const digits = String(l.whatsapp).replace(/\D/g, '');
    if (digits.length < 10) return null;
    const phone = digits.length <= 11 ? '55' + digits : digits;
    const msg = 'Olá ' + l.nome + '! Aqui é da Laser & Co.' +
      (l.unidadeNome ? ' Unidade ' + l.unidadeNome + '.' : '') +
      ' Vi seu interesse em ' + (interesseDe(l) !== '-' ? interesseDe(l) : 'nossos tratamentos') +
      ' e quero te ajudar a agendar sua avaliação gratuita.';
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }

  /* ---------------- render: KPIs ---------------- */
  function renderKpis() {
    const box = document.getElementById('painel-kpis');
    if (!box) return;
    const list = state.all;
    const hoje0 = new Date(); hoje0.setHours(0, 0, 0, 0);
    const total = list.length;
    const hoje = list.filter((l) => new Date(l.createdAt) >= hoje0).length;
    const quentes = list.filter((l) => l.status === 'quente').length;
    const agendamentos = list.filter((l) => l.tipo === 'agendamento' || l.tipo === 'agendamento_interesse').length;
    const candidatos = list.filter((l) => l.tipo === 'recrutamento').length;
    const convertidos = list.filter((l) => l.status === 'convertido').length;

    let cards = [
      { label: 'Leads no total', value: total },
      { label: 'Recebidos hoje', value: hoje },
      { label: 'Leads quentes', value: quentes, accent: true },
      { label: 'Agendamentos', value: agendamentos },
      { label: 'Candidaturas', value: candidatos },
      { label: 'Convertidos', value: convertidos },
    ];
    if (state.mode === 'franqueador') {
      const unidades = {};
      list.forEach((l) => { if (l.unidadeId) unidades[l.unidadeId] = 1; });
      cards.splice(5, 0, { label: 'Unidades com leads', value: Object.keys(unidades).length });
    }

    box.innerHTML = cards.map((c) => (
      '<div class="kpi-card' + (c.accent ? ' kpi-accent' : '') + '">' +
        '<div class="kpi-value">' + c.value + '</div>' +
        '<div class="kpi-label">' + esc(c.label) + '</div>' +
      '</div>'
    )).join('');
  }

  /* ---------------- render: filtros ---------------- */
  function buildFiltros() {
    const box = document.getElementById('painel-filtros');
    if (!box) return;
    const tipoOpts = ['<option value="">Todos os tipos</option>']
      .concat(Object.keys(TIPO_LABEL).map((k) => '<option value="' + k + '">' + TIPO_LABEL[k] + '</option>')).join('');
    const statusOpts = ['<option value="">Todos os status</option>']
      .concat(STATUS.map((s) => '<option value="' + s.key + '">' + s.label + '</option>')).join('');

    let unidadeFiltro = '';
    if (state.mode === 'franqueador') {
      const us = ((window.LaserData && window.LaserData.unidades) || []).slice()
        .sort((a, b) => a.nome.localeCompare(b.nome));
      const opts = ['<option value="">Todas as unidades</option>']
        .concat(us.map((u) => '<option value="' + u.id + '">' + esc(u.nome) + ' (' + u.uf + ')</option>')).join('');
      unidadeFiltro = '<select id="f-unidade" class="painel-select">' + opts + '</select>';
    }

    box.innerHTML =
      '<input id="f-busca" class="painel-input" type="search" placeholder="Buscar nome, WhatsApp ou cidade">' +
      '<select id="f-tipo" class="painel-select">' + tipoOpts + '</select>' +
      '<select id="f-status" class="painel-select">' + statusOpts + '</select>' +
      unidadeFiltro +
      '<select id="f-periodo" class="painel-select">' +
        '<option value="">Qualquer data</option>' +
        '<option value="1">Hoje</option>' +
        '<option value="7">Últimos 7 dias</option>' +
        '<option value="30">Últimos 30 dias</option>' +
      '</select>';

    ['f-busca', 'f-tipo', 'f-status', 'f-unidade', 'f-periodo'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const ev = el.tagName === 'INPUT' ? 'input' : 'change';
        el.addEventListener(ev, applyFiltros);
      }
    });
  }

  function applyFiltros() {
    const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const busca = v('f-busca').toLowerCase();
    const tipo = v('f-tipo');
    const status = v('f-status');
    const unidade = v('f-unidade');
    const periodo = v('f-periodo');

    let list = state.all.slice();
    if (busca) {
      list = list.filter((l) =>
        (l.nome + ' ' + l.whatsapp + ' ' + l.cidade + ' ' + l.email).toLowerCase().indexOf(busca) >= 0);
    }
    if (tipo) list = list.filter((l) => l.tipo === tipo);
    if (status) list = list.filter((l) => l.status === status);
    if (unidade) list = list.filter((l) => l.unidadeId === unidade);
    if (periodo) {
      const dias = parseInt(periodo, 10);
      const limite = new Date();
      if (dias === 1) limite.setHours(0, 0, 0, 0);
      else limite.setTime(Date.now() - dias * 86400000);
      list = list.filter((l) => new Date(l.createdAt) >= limite);
    }
    state.filtered = list;
    renderTabela();
  }

  /* ---------------- render: tabela ---------------- */
  function renderTabela() {
    const box = document.getElementById('painel-tabela');
    const count = document.getElementById('painel-count');
    if (!box) return;
    const list = state.filtered;
    if (count) count.textContent = list.length + (list.length === 1 ? ' lead' : ' leads');

    if (!list.length) {
      box.innerHTML = '<div class="painel-empty">Nenhum lead encontrado com esses filtros.</div>';
      return;
    }

    const colUnidade = state.mode === 'franqueador';
    const rows = list.map((l) => {
      const wa = waLink(l);
      const statusSel = '<select class="status-select st-' + l.status + '" data-id="' + esc(l.id) + '">' +
        STATUS.map((s) => '<option value="' + s.key + '"' + (s.key === l.status ? ' selected' : '') + '>' + s.label + '</option>').join('') +
        '</select>';
      return '<tr>' +
        '<td class="col-data">' + fmtData(l.createdAt) + '</td>' +
        '<td><strong>' + esc(l.nome) + '</strong>' + (l.cidade ? '<br><span class="muted">' + esc(l.cidade) + (l.uf ? '/' + esc(l.uf) : '') + '</span>' : '') + '</td>' +
        '<td>' + (l.whatsapp ? esc(l.whatsapp) : (l.email ? esc(l.email) : '-')) + '</td>' +
        '<td>' + esc(TIPO_LABEL[l.tipo] || l.tipo) + '<br><span class="muted">' + esc(l.origem) + '</span></td>' +
        '<td>' + esc(interesseDe(l)) + '</td>' +
        (colUnidade ? '<td>' + esc(l.unidadeNome || 'Sem unidade') + '</td>' : '') +
        '<td>' + statusSel + '</td>' +
        '<td class="col-acoes">' +
          (wa ? '<a class="painel-act wa" href="' + wa + '" target="_blank" rel="noopener" title="Chamar no WhatsApp">WhatsApp</a>' : '') +
          '<button class="painel-act det" data-id="' + esc(l.id) + '" type="button">Detalhes</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    box.innerHTML =
      '<div class="painel-table-wrap"><table class="painel-table"><thead><tr>' +
        '<th>Data</th><th>Nome</th><th>Contato</th><th>Tipo / origem</th><th>Interesse</th>' +
        (colUnidade ? '<th>Unidade</th>' : '') +
        '<th>Status</th><th></th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';

    box.querySelectorAll('.status-select').forEach((sel) => {
      sel.addEventListener('change', () => changeStatus(sel.dataset.id, sel.value, sel));
    });
    box.querySelectorAll('.painel-act.det').forEach((btn) => {
      btn.addEventListener('click', () => openDetail(btn.dataset.id));
    });
  }

  function findLead(id) { return state.all.find((l) => l.id === id); }

  async function changeStatus(id, status, selEl) {
    const lead = findLead(id);
    if (!lead) return;
    lead.status = status;
    if (selEl) selEl.className = 'status-select st-' + status;
    renderKpis();
    try { await window.LaserAPI.updateLead(state.session, id, { status: status }); }
    catch (e) { if (e.status === 401) logout(); }
  }

  /* ---------------- detalhe ---------------- */
  function openDetail(id) {
    const lead = findLead(id);
    if (!lead) return;
    const modal = document.getElementById('painel-detail-modal');
    const content = document.getElementById('painel-detail-content');
    if (!modal || !content) return;
    const d = lead.raw.dados || {};
    const linhas = Object.keys(d).map((k) => {
      if (DET_SKIP[k]) return '';
      if (d[k] === null || d[k] === '' || typeof d[k] === 'boolean') return '';
      const label = DET_LABEL[k] || (k.charAt(0).toUpperCase() + k.slice(1));
      return '<div class="det-row"><span class="det-k">' + esc(label) + '</span><span class="det-v">' + esc(d[k]) + '</span></div>';
    }).join('');
    const wa = waLink(lead);

    content.innerHTML =
      '<div class="det-eyebrow">' + esc(TIPO_LABEL[lead.tipo] || lead.tipo) + ' · ' + fmtData(lead.createdAt) + '</div>' +
      '<h3 class="det-title">' + esc(lead.nome) + '</h3>' +
      '<div class="det-grid">' + linhas + '</div>' +
      '<div class="det-field"><label>Status</label>' +
        '<select id="det-status" class="painel-select">' +
          STATUS.map((s) => '<option value="' + s.key + '"' + (s.key === lead.status ? ' selected' : '') + '>' + s.label + '</option>').join('') +
        '</select></div>' +
      '<div class="det-field"><label>Anotações internas</label>' +
        '<textarea id="det-notas" class="painel-textarea" rows="3" placeholder="Ex.: ligou, pediu retorno amanhã...">' + esc(lead.raw.notas || '') + '</textarea></div>' +
      '<div class="det-actions">' +
        (wa ? '<a class="btn btn-primary" href="' + wa + '" target="_blank" rel="noopener">Chamar no WhatsApp</a>' : '') +
        '<button class="btn btn-outline" id="det-save" type="button">Salvar alterações</button>' +
      '</div>';

    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';

    document.getElementById('det-save').addEventListener('click', async () => {
      const novoStatus = document.getElementById('det-status').value;
      const notas = document.getElementById('det-notas').value;
      lead.status = novoStatus;
      lead.raw.notas = notas;
      renderKpis();
      applyFiltros();
      const btn = document.getElementById('det-save');
      btn.disabled = true; btn.textContent = 'Salvando...';
      try { await window.LaserAPI.updateLead(state.session, lead.id, { status: novoStatus, notas: notas }); }
      catch (e) { if (e.status === 401) return logout(); }
      closeDetail();
    });
  }
  function closeDetail() {
    const modal = document.getElementById('painel-detail-modal');
    if (modal) modal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  /* ---------------- export CSV ---------------- */
  function exportCsv() {
    const list = state.filtered;
    const head = ['Data', 'Nome', 'WhatsApp', 'Email', 'Cidade', 'UF', 'Tipo', 'Interesse', 'Unidade', 'Origem', 'Status'];
    const q = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
    const linhas = list.map((l) => [
      fmtData(l.createdAt), l.nome, l.whatsapp, l.email, l.cidade, l.uf,
      TIPO_LABEL[l.tipo] || l.tipo, interesseDe(l), l.unidadeNome, l.origem, STATUS_LABEL[l.status] || l.status,
    ].map(q).join(';')).join('\n');
    const csv = '﻿' + head.map(q).join(';') + '\n' + linhas;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-laserco-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  /* ---------------- carregamento ---------------- */
  async function carregar() {
    let res;
    try { res = await window.LaserAPI.listLeads(state.session); }
    catch (e) { if (e.status === 401) return logout(); res = { leads: [], mode: 'demo' }; }
    state.dataMode = res.mode;
    state.all = (res.leads || []).map(normalize);
    state.filtered = state.all.slice();

    const banner = document.getElementById('painel-mode-banner');
    if (banner) {
      if (res.mode === 'demo') {
        banner.hidden = false;
        banner.innerHTML = 'Modo demonstração: mostrando leads de teste e os capturados neste navegador. ' +
          'Conecte o banco de produção (veja BACKEND.md) para ver os leads reais de todas as unidades, em qualquer dispositivo.';
      } else {
        banner.hidden = true;
      }
    }
    renderKpis();
    applyFiltros();
  }

  /* ---------------- init ---------------- */
  function init(opts) {
    opts = opts || {};
    state.mode = opts.mode || 'franqueador';
    const session = getSession();

    // guarda de acesso
    if (!session || !session.user) { location.replace('painel.html'); return; }
    if (state.mode === 'franqueador' && session.user.role !== 'franqueador') { location.replace('painel-franqueado.html'); return; }
    if (state.mode === 'franqueado' && session.user.role !== 'franqueado') { location.replace('painel-franqueador.html'); return; }
    state.session = session;

    // cabeçalho
    const nomeEl = document.getElementById('painel-user-nome');
    const roleEl = document.getElementById('painel-user-role');
    if (nomeEl) nomeEl.textContent = session.user.nome || session.user.email;
    if (roleEl) {
      if (session.user.role === 'franqueado') {
        const u = (window.LaserData && window.LaserData.unidades || []).find((x) => x.id === session.user.unidadeId);
        roleEl.textContent = 'Franqueado · ' + (u ? u.nome + '/' + u.uf : (session.user.unidadeId || ''));
      } else {
        roleEl.textContent = 'Franqueador · rede completa';
      }
    }
    const logoutBtn = document.getElementById('painel-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    const exportBtn = document.getElementById('painel-export');
    if (exportBtn) exportBtn.addEventListener('click', exportCsv);

    // modal detalhe
    const modal = document.getElementById('painel-detail-modal');
    const closeBtn = document.getElementById('painel-detail-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeDetail(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });

    buildFiltros();
    carregar();
  }

  return { init: init, getSession: getSession, setSession: setSession, logout: logout };
})();
