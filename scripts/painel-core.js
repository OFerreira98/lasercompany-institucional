/* ============================================================
   PAINEL-CORE, motor compartilhado dos painéis
   ============================================================
   Etapa 1 (Tarefa 2): shell com MENU LATERAL + roteador por hash.
   Cada item do menu abre uma view. As views de leads já são
   funcionais (KPIs, filtros, tabela, status, detalhe, CSV).
   As demais telas (gráficos, mapa, temas, etc.) entram nas
   próximas etapas e por enquanto mostram um placeholder.
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
    popup_brinde: 'Brinde (popup)', agendamento: 'Agendamento',
    agendamento_interesse: 'Interesse', recrutamento: 'Candidatura',
    contato: 'Contato', franquia: 'Franquia', chatbot: 'Chatbot', desconhecido: 'Outro',
  };
  const DET_LABEL = {
    nome: 'Nome', whatsapp: 'WhatsApp', email: 'E-mail', cep: 'CEP', cidade: 'Cidade', uf: 'UF',
    bairro: 'Bairro', procedimentoNome: 'Procedimento', unidadeNome: 'Unidade',
    funcao: 'Vaga / função', cidadeVaga: 'Cidade da vaga', cidadeCandidato: 'Cidade do candidato',
    curriculoNome: 'Currículo', mensagem: 'Mensagem', brinde: 'Brinde',
    capital: 'Capital para investir', linkedin: 'LinkedIn',
  };
  const DET_SKIP = { hasUnidade: 1, whatsappClicked: 1, unidadeId: 1, procedimentoId: 1 };

  /* ---------------- MENUS ---------------- */
  const MENU_FRANQUEADOR = [
    { id: 'visao-geral', ico: '🏠', label: 'Visão Geral' },
    { ico: '📊', label: 'Leads', children: [
      { id: 'leads-todos', label: 'Todos os leads' },
      { id: 'leads-popup', label: 'Leads do pop-up' },
      { id: 'leads-agendamento', label: 'Leads de agendamento' },
      { id: 'leads-recrutamento', label: 'Leads de recrutamento' },
    ] },
    { ico: '🏢', label: 'Unidades', children: [
      { id: 'unidades-ranking', label: 'Ranking de unidades' },
      { id: 'unidades-mapa', label: 'Mapa da rede' },
      { id: 'unidades-cadastro', label: 'Cadastro de unidades' },
    ] },
    { ico: '📈', label: 'Tráfego e Origem', children: [
      { id: 'trafego-tempo-real', label: 'Tempo real' },
      { id: 'trafego-origem', label: 'Origem dos visitantes' },
      { id: 'trafego-paginas', label: 'Páginas mais visitadas' },
      { id: 'trafego-dispositivos', label: 'Dispositivos' },
    ] },
    { ico: '👥', label: 'Demográfico', children: [
      { id: 'demo-idade', label: 'Faixa etária' },
      { id: 'demo-genero', label: 'Distribuição por gênero' },
    ] },
    { ico: '🎯', label: 'Promoções', children: [
      { id: 'promo-ativas', label: 'Promoções ativas' },
      { id: 'promo-cadastrar', label: 'Cadastrar promoção' },
      { id: 'promo-desempenho', label: 'Desempenho por promoção' },
    ] },
    { ico: '💼', label: 'Recrutamento', children: [
      { id: 'recrut-vagas', label: 'Vagas abertas' },
      { id: 'recrut-candidatos', label: 'Candidatos' },
    ] },
    { ico: '🎨', label: 'Aparência do site', children: [
      { id: 'aparencia-tema', label: 'Tema do site' },
      { id: 'aparencia-sazonais', label: 'Temas sazonais' },
    ] },
    { ico: '⚙️', label: 'Configurações', children: [
      { id: 'config-usuarios', label: 'Usuários e permissões' },
      { id: 'config-conta', label: 'Conta' },
    ] },
  ];
  const MENU_FRANQUEADO = [
    { id: 'visao-geral', ico: '🏠', label: 'Visão Geral' },
    { ico: '📊', label: 'Meus Leads', children: [
      { id: 'leads-todos', label: 'Todos' },
      { id: 'leads-popup', label: 'Pop-up' },
      { id: 'leads-agendamento', label: 'Agendamento' },
    ] },
    { ico: '📈', label: 'Desempenho', children: [
      { id: 'desemp-procedimento', label: 'Por procedimento' },
      { id: 'desemp-periodo', label: 'Por período' },
      { id: 'desemp-rede', label: 'Comparação com a rede' },
    ] },
    { ico: '💼', label: 'Vagas', children: [
      { id: 'recrut-candidatos', label: 'Candidatos da minha unidade' },
    ] },
    { ico: '👥', label: 'Equipe', children: [
      { id: 'equipe-logins', label: 'Logins de funcionário' },
    ] },
    { id: 'config-conta', ico: '⚙️', label: 'Minha conta' },
  ];

  const VIEW_TITLE = {
    'visao-geral': 'Visão Geral', 'leads-todos': 'Todos os leads',
    'leads-popup': 'Leads do pop-up', 'leads-agendamento': 'Leads de agendamento',
    'leads-recrutamento': 'Leads de recrutamento', 'unidades-ranking': 'Ranking de unidades',
    'unidades-mapa': 'Mapa da rede', 'unidades-cadastro': 'Cadastro de unidades',
    'trafego-tempo-real': 'Tráfego em tempo real', 'trafego-origem': 'Origem dos visitantes',
    'trafego-paginas': 'Páginas mais visitadas', 'trafego-dispositivos': 'Dispositivos',
    'demo-idade': 'Faixa etária', 'demo-genero': 'Distribuição por gênero',
    'promo-ativas': 'Promoções ativas', 'promo-cadastrar': 'Cadastrar promoção',
    'promo-desempenho': 'Desempenho por promoção', 'recrut-vagas': 'Vagas abertas',
    'recrut-candidatos': 'Candidatos', 'aparencia-tema': 'Tema do site',
    'aparencia-sazonais': 'Temas sazonais', 'config-usuarios': 'Usuários e permissões',
    'config-conta': 'Minha conta', 'desemp-procedimento': 'Desempenho por procedimento',
    'desemp-periodo': 'Desempenho por período', 'desemp-rede': 'Comparação com a rede',
    'equipe-logins': 'Logins de funcionário',
  };
  const VIEW_SUB = {
    'visao-geral': 'Panorama da captação de leads.',
    'leads-todos': 'Todos os contatos capturados pelo site.',
    'leads-popup': 'Contatos que resgataram o brinde no pop-up.',
    'leads-agendamento': 'Solicitações de avaliação pelo agendamento.',
    'leads-recrutamento': 'Candidaturas recebidas pelas vagas.',
    'recrut-candidatos': 'Candidaturas recebidas pelas vagas.',
  };

  let state = { session: null, mode: 'franqueador', all: [], filtered: [], dataMode: 'demo', presetTipos: null, currentView: 'visao-geral' };

  /* ---------------- sessão ---------------- */
  function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; } }
  function setSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {} }
  function logout() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} location.href = 'painel.html'; }

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmtData(iso) {
    const d = new Date(iso); if (isNaN(d)) return '-';
    const p = (n) => String(n).padStart(2, '0');
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function initialStatus(raw) {
    if (raw.status) return raw.status;
    const t = raw.tipo; const d = raw.dados || {};
    if (t === 'agendamento') return 'quente';
    if (t === 'franquia') return 'quente';
    if (t === 'agendamento_interesse') return 'morno';
    if (t === 'popup_brinde') return d.hasUnidade ? 'quente' : 'morno';
    return 'novo';
  }
  function normalize(raw) {
    const d = raw.dados || {};
    return {
      id: raw.id, tipo: raw.tipo || 'desconhecido', createdAt: raw.timestamp,
      nome: d.nome || '-', whatsapp: d.whatsapp || '', email: d.email || '',
      cidade: d.cidade || '', uf: d.uf || '', procedimento: d.procedimentoNome || '',
      funcao: d.funcao || '', unidadeId: d.unidadeId || null,
      unidadeNome: d.unidadeNome || (d.unidadeId || ''), origem: raw.origem || '',
      curriculoNome: d.curriculoNome || '', status: initialStatus(raw), raw: raw,
    };
  }
  function interesseDe(l) { return l.tipo === 'recrutamento' ? (l.funcao || 'Vaga') : (l.procedimento || '-'); }
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

  /* ---------------- KPIs ---------------- */
  function renderKpis() {
    const box = document.getElementById('painel-kpis'); if (!box) return;
    let list = state.all;
    if (state.presetTipos && state.presetTipos.length) list = list.filter((l) => state.presetTipos.indexOf(l.tipo) >= 0);
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
      const u = {}; list.forEach((l) => { if (l.unidadeId) u[l.unidadeId] = 1; });
      cards.splice(5, 0, { label: 'Unidades com leads', value: Object.keys(u).length });
    }
    box.innerHTML = cards.map((c) => (
      '<div class="kpi-card' + (c.accent ? ' kpi-accent' : '') + '">' +
        '<div class="kpi-value">' + c.value + '</div>' +
        '<div class="kpi-label">' + esc(c.label) + '</div></div>')).join('');
  }

  /* ---------------- filtros ---------------- */
  function buildFiltros() {
    const box = document.getElementById('painel-filtros'); if (!box) return;
    const tipoSel = (state.presetTipos) ? '' :
      '<select id="f-tipo" class="painel-select"><option value="">Todos os tipos</option>' +
      Object.keys(TIPO_LABEL).map((k) => '<option value="' + k + '">' + TIPO_LABEL[k] + '</option>').join('') + '</select>';
    const statusOpts = ['<option value="">Todos os status</option>']
      .concat(STATUS.map((s) => '<option value="' + s.key + '">' + s.label + '</option>')).join('');
    let unidadeFiltro = '';
    if (state.mode === 'franqueador') {
      const us = ((window.LaserData && window.LaserData.unidades) || []).slice().sort((a, b) => a.nome.localeCompare(b.nome));
      unidadeFiltro = '<select id="f-unidade" class="painel-select"><option value="">Todas as unidades</option>' +
        us.map((u) => '<option value="' + u.id + '">' + esc(u.nome) + ' (' + u.uf + ')</option>').join('') + '</select>';
    }
    box.innerHTML =
      '<input id="f-busca" class="painel-input" type="search" placeholder="Buscar nome, WhatsApp ou cidade">' +
      tipoSel +
      '<select id="f-status" class="painel-select">' + statusOpts + '</select>' +
      unidadeFiltro +
      '<select id="f-periodo" class="painel-select"><option value="">Qualquer data</option><option value="1">Hoje</option><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option></select>';
    ['f-busca', 'f-tipo', 'f-status', 'f-unidade', 'f-periodo'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', applyFiltros);
    });
  }
  function applyFiltros() {
    const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const busca = v('f-busca').toLowerCase();
    let list = state.all.slice();
    if (state.presetTipos && state.presetTipos.length) list = list.filter((l) => state.presetTipos.indexOf(l.tipo) >= 0);
    if (busca) list = list.filter((l) => (l.nome + ' ' + l.whatsapp + ' ' + l.cidade + ' ' + l.email).toLowerCase().indexOf(busca) >= 0);
    const tipo = v('f-tipo'); if (tipo) list = list.filter((l) => l.tipo === tipo);
    const status = v('f-status'); if (status) list = list.filter((l) => l.status === status);
    const unidade = v('f-unidade'); if (unidade) list = list.filter((l) => l.unidadeId === unidade);
    const periodo = v('f-periodo');
    if (periodo) {
      const dias = parseInt(periodo, 10); const lim = new Date();
      if (dias === 1) lim.setHours(0, 0, 0, 0); else lim.setTime(Date.now() - dias * 86400000);
      list = list.filter((l) => new Date(l.createdAt) >= lim);
    }
    state.filtered = list;
    renderTabela();
  }

  /* ---------------- tabela ---------------- */
  function renderTabela() {
    const box = document.getElementById('painel-tabela'); if (!box) return;
    const count = document.getElementById('painel-count');
    const list = state.filtered;
    if (count) count.textContent = list.length + (list.length === 1 ? ' lead' : ' leads');
    if (!list.length) { box.innerHTML = '<div class="painel-empty">Nenhum lead encontrado com esses filtros.</div>'; return; }
    const colUni = state.mode === 'franqueador';
    const rows = list.map((l) => {
      const wa = waLink(l);
      const sel = '<select class="status-select st-' + l.status + '" data-id="' + esc(l.id) + '">' +
        STATUS.map((s) => '<option value="' + s.key + '"' + (s.key === l.status ? ' selected' : '') + '>' + s.label + '</option>').join('') + '</select>';
      return '<tr>' +
        '<td class="col-data">' + fmtData(l.createdAt) + '</td>' +
        '<td><strong>' + esc(l.nome) + '</strong>' + (l.cidade ? '<br><span class="muted">' + esc(l.cidade) + (l.uf ? '/' + esc(l.uf) : '') + '</span>' : '') + '</td>' +
        '<td>' + (l.whatsapp ? esc(l.whatsapp) : (l.email ? esc(l.email) : '-')) + '</td>' +
        '<td>' + esc(TIPO_LABEL[l.tipo] || l.tipo) + '<br><span class="muted">' + esc(l.origem) + '</span></td>' +
        '<td>' + esc(interesseDe(l)) + '</td>' +
        (colUni ? '<td>' + esc(l.unidadeNome || 'Sem unidade') + '</td>' : '') +
        '<td>' + sel + '</td>' +
        '<td class="col-acoes">' +
          (wa ? '<a class="painel-act wa" href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
          '<button class="painel-act det" data-id="' + esc(l.id) + '" type="button">Detalhes</button>' +
        '</td></tr>';
    }).join('');
    box.innerHTML = '<div class="painel-table-wrap"><table class="painel-table"><thead><tr>' +
      '<th>Data</th><th>Nome</th><th>Contato</th><th>Tipo / origem</th><th>Interesse</th>' +
      (colUni ? '<th>Unidade</th>' : '') + '<th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    box.querySelectorAll('.status-select').forEach((s) => s.addEventListener('change', () => changeStatus(s.dataset.id, s.value, s)));
    box.querySelectorAll('.painel-act.det').forEach((b) => b.addEventListener('click', () => openDetail(b.dataset.id)));
  }
  function findLead(id) { return state.all.find((l) => l.id === id); }
  async function changeStatus(id, status, sel) {
    const lead = findLead(id); if (!lead) return;
    lead.status = status; if (sel) sel.className = 'status-select st-' + status;
    renderKpis();
    try { await window.LaserAPI.updateLead(state.session, id, { status: status }); } catch (e) { if (e.status === 401) logout(); }
  }

  /* ---------------- detalhe ---------------- */
  function openDetail(id) {
    const lead = findLead(id); if (!lead) return;
    const modal = document.getElementById('painel-detail-modal');
    const content = document.getElementById('painel-detail-content');
    if (!modal || !content) return;
    const d = lead.raw.dados || {};
    const linhas = Object.keys(d).map((k) => {
      if (DET_SKIP[k] || d[k] === null || d[k] === '' || typeof d[k] === 'boolean') return '';
      const label = DET_LABEL[k] || (k.charAt(0).toUpperCase() + k.slice(1));
      return '<div class="det-row"><span class="det-k">' + esc(label) + '</span><span class="det-v">' + esc(d[k]) + '</span></div>';
    }).join('');
    const wa = waLink(lead);
    content.innerHTML =
      '<div class="det-eyebrow">' + esc(TIPO_LABEL[lead.tipo] || lead.tipo) + ' · ' + fmtData(lead.createdAt) + '</div>' +
      '<h3 class="det-title">' + esc(lead.nome) + '</h3>' +
      '<div class="det-grid">' + linhas + '</div>' +
      '<div class="det-field"><label>Status</label><select id="det-status" class="painel-select">' +
        STATUS.map((s) => '<option value="' + s.key + '"' + (s.key === lead.status ? ' selected' : '') + '>' + s.label + '</option>').join('') + '</select></div>' +
      '<div class="det-field"><label>Anotações internas</label><textarea id="det-notas" class="painel-textarea" rows="3" placeholder="Ex.: ligou, pediu retorno amanhã...">' + esc(lead.raw.notas || '') + '</textarea></div>' +
      '<div class="det-actions">' + (wa ? '<a class="btn btn-primary" href="' + wa + '" target="_blank" rel="noopener">Chamar no WhatsApp</a>' : '') +
        '<button class="btn btn-outline" id="det-save" type="button">Salvar alterações</button></div>';
    modal.classList.add('visible'); document.body.style.overflow = 'hidden';
    document.getElementById('det-save').addEventListener('click', async () => {
      const ns = document.getElementById('det-status').value;
      const notas = document.getElementById('det-notas').value;
      lead.status = ns; lead.raw.notas = notas; renderKpis(); applyFiltros();
      const b = document.getElementById('det-save'); b.disabled = true; b.textContent = 'Salvando...';
      try { await window.LaserAPI.updateLead(state.session, lead.id, { status: ns, notas: notas }); } catch (e) { if (e.status === 401) return logout(); }
      closeDetail();
    });
  }
  function closeDetail() { const m = document.getElementById('painel-detail-modal'); if (m) m.classList.remove('visible'); document.body.style.overflow = ''; }

  /* ---------------- export CSV ---------------- */
  function exportCsv() {
    const list = state.filtered;
    const head = ['Data', 'Nome', 'WhatsApp', 'Email', 'Cidade', 'UF', 'Tipo', 'Interesse', 'Unidade', 'Origem', 'Status'];
    const q = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
    const linhas = list.map((l) => [fmtData(l.createdAt), l.nome, l.whatsapp, l.email, l.cidade, l.uf,
      TIPO_LABEL[l.tipo] || l.tipo, interesseDe(l), l.unidadeNome, l.origem, STATUS_LABEL[l.status] || l.status].map(q).join(';')).join('\n');
    const csv = '﻿' + head.map(q).join(';') + '\n' + linhas;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'leads-laserco-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function showBanner() {
    const b = document.getElementById('painel-mode-banner'); if (!b) return;
    if (state.dataMode === 'demo') {
      b.hidden = false;
      b.innerHTML = 'Modo demonstração: mostrando leads de teste e os capturados neste navegador. ' +
        'Conecte o banco de produção (veja BACKEND.md) para ver os leads reais de todas as unidades.';
    } else b.hidden = true;
  }

  /* ---------------- VIEWS ---------------- */
  function viewLeads(opts) {
    opts = opts || {};
    state.presetTipos = opts.presetTipos || null;
    document.getElementById('painel-view').innerHTML =
      '<div class="painel-mode-banner" id="painel-mode-banner" hidden></div>' +
      '<div class="painel-kpis" id="painel-kpis"></div>' +
      '<div class="painel-toolbar"><div class="painel-filtros" id="painel-filtros"></div>' +
      '<span class="painel-count" id="painel-count"></span>' +
      '<button class="painel-export" id="painel-export" type="button">Exportar CSV</button></div>' +
      '<div id="painel-tabela"></div>';
    showBanner(); renderKpis(); buildFiltros();
    const ex = document.getElementById('painel-export'); if (ex) ex.addEventListener('click', exportCsv);
    applyFiltros();
  }
  /* ---- Visao Geral: agregacoes + graficos (Chart.js) ---- */
  let _charts = [];
  function destroyCharts() { _charts.forEach(function (c) { try { c.destroy(); } catch (e) {} }); _charts = []; }
  const VG_PALETTE = ['#C8A064', '#9A6B1E', '#E8C088', '#8a3b3b', '#B7AD9D', '#5e1a16', '#d89b45'];

  function leadsPorDia(list, dias) {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const buckets = [];
    for (let i = dias - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      buckets.push({ key: d.getDate() + '/' + (d.getMonth() + 1), ts: d.getTime(), count: 0 });
    }
    list.forEach(function (l) {
      const t = new Date(l.createdAt); t.setHours(0, 0, 0, 0);
      const b = buckets.find(function (x) { return x.ts === t.getTime(); });
      if (b) b.count++;
    });
    return buckets;
  }
  function countBy(list, fn) { const o = {}; list.forEach(function (l) { const k = fn(l) || '-'; o[k] = (o[k] || 0) + 1; }); return o; }
  function topPairs(obj, n) { return Object.keys(obj).map(function (k) { return [k, obj[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, n); }
  function vgChart(id, config) {
    const el = document.getElementById(id);
    if (!el || !window.Chart) return;
    try { _charts.push(new window.Chart(el.getContext('2d'), config)); } catch (e) {}
  }
  function donutCfg(labels, data) {
    return {
      type: 'doughnut',
      data: { labels: labels, datasets: [{ data: data, backgroundColor: VG_PALETTE, borderColor: 'rgba(20,6,6,0.5)', borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#B9AF9C', font: { size: 10 }, boxWidth: 10, padding: 8 } } } },
    };
  }

  function renderVgKpis(list) {
    const box = document.getElementById('painel-kpis'); if (!box) return;
    const now = Date.now(), D = 86400000;
    const in30 = list.filter(function (l) { return now - new Date(l.createdAt) <= 30 * D; });
    const prev30 = list.filter(function (l) { const a = now - new Date(l.createdAt); return a > 30 * D && a <= 60 * D; });
    const hoje0 = new Date(); hoje0.setHours(0, 0, 0, 0);
    const hoje = list.filter(function (l) { return new Date(l.createdAt) >= hoje0; }).length;
    const live = list.some(function (l) { return now - new Date(l.createdAt) <= 3600000; });
    const ag = in30.filter(function (l) { return l.tipo === 'agendamento' || l.tipo === 'agendamento_interesse'; }).length;
    const conv = in30.filter(function (l) { return l.status === 'convertido'; }).length;
    const taxa = in30.length ? Math.round(conv / in30.length * 100) : 0;
    const delta = prev30.length ? Math.round((in30.length - prev30.length) / prev30.length * 100) : 0;
    const deltaHtml = '<div class="kpi-delta ' + (delta >= 0 ? 'up' : 'down') + '">' + (delta >= 0 ? '+' : '') + delta + '% vs mês anterior</div>';
    let cards = [
      { v: in30.length, l: 'Leads no mês', extra: deltaHtml },
      { v: hoje + (live ? '<span class="kpi-live"></span>' : ''), l: 'Recebidos hoje' + (live ? ' (ao vivo)' : '') },
      { v: ag, l: 'Agendamentos no mês' },
      { v: taxa + '%', l: 'Taxa de conversão' },
    ];
    if (state.mode === 'franqueador') {
      const uni24 = {}; list.filter(function (l) { return now - new Date(l.createdAt) <= D; }).forEach(function (l) { if (l.unidadeId) uni24[l.unidadeId] = 1; });
      const totalU = (window.LaserData && window.LaserData.unidades) ? window.LaserData.unidades.length : 70;
      cards.push({ v: Object.keys(uni24).length + ' <small style="font-size:0.5em;color:var(--color-text-muted)">de ' + totalU + '</small>', l: 'Unidades ativas (24h)', accent: true });
    } else {
      cards.push({ v: list.filter(function (l) { return l.status === 'quente'; }).length, l: 'Leads quentes', accent: true });
    }
    box.innerHTML = cards.map(function (c) {
      return '<div class="kpi-card' + (c.accent ? ' kpi-accent' : '') + '"><div class="kpi-value">' + c.v + '</div><div class="kpi-label">' + c.l + '</div>' + (c.extra || '') + '</div>';
    }).join('');
  }
  function renderVgRanking(list) {
    const box = document.getElementById('vg-ranking'); if (!box) return;
    const by = countBy(list.filter(function (l) { return l.unidadeId; }), function (l) { return l.unidadeNome || l.unidadeId; });
    const top = topPairs(by, 8);
    if (!top.length) { box.innerHTML = '<li class="vg-rank-item"><span class="vg-rank-pos"></span><span class="vg-rank-nome muted">Sem dados ainda</span><span></span></li>'; return; }
    const max = top[0][1];
    box.innerHTML = top.map(function (p, i) {
      return '<li class="vg-rank-item"><span class="vg-rank-pos">' + (i + 1) + '</span>' +
        '<span class="vg-rank-nome">' + esc(p[0]) + '<div class="vg-rank-bar"><span style="width:' + Math.round(p[1] / max * 100) + '%"></span></div></span>' +
        '<span class="vg-rank-val">' + p[1] + '</span></li>';
    }).join('');
  }
  function renderVgActivity(list) {
    const box = document.getElementById('vg-activity'); if (!box) return;
    box.innerHTML = list.slice(0, 14).map(function (l) {
      return '<li class="vg-act-item"><span class="vg-act-time">' + fmtData(l.createdAt) + '</span>' +
        '<span class="vg-act-main"><strong>' + esc(l.nome) + '</strong><small>' + esc(l.cidade || '-') + ' · ' + esc(TIPO_LABEL[l.tipo] || l.tipo) + '</small></span>' +
        '<span class="vg-tag st-' + l.status + '">' + (STATUS_LABEL[l.status] || l.status) + '</span></li>';
    }).join('');
  }
  function renderVgCharts(list) {
    if (!window.Chart) return;
    const dias = leadsPorDia(list, 30);
    const lineEl = document.getElementById('vg-line');
    if (lineEl) {
      const ctx = lineEl.getContext('2d');
      const g = ctx.createLinearGradient(0, 0, 0, 240);
      g.addColorStop(0, 'rgba(200,160,100,0.35)'); g.addColorStop(1, 'rgba(200,160,100,0)');
      vgChart('vg-line', {
        type: 'line',
        data: { labels: dias.map(function (d) { return d.key; }), datasets: [{ data: dias.map(function (d) { return d.count; }), borderColor: '#C8A064', borderWidth: 2, fill: true, backgroundColor: g, tension: 0.35, pointRadius: 0, pointHoverRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#B9AF9C', maxTicksLimit: 8, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(245,240,230,0.06)' }, ticks: { color: '#B9AF9C', precision: 0, font: { size: 10 } } } } },
      });
    }
    const byTipo = countBy(list, function (l) { return TIPO_LABEL[l.tipo] || l.tipo; });
    vgChart('vg-tipo', donutCfg(Object.keys(byTipo), Object.keys(byTipo).map(function (k) { return byTipo[k]; })));
    const byProc = countBy(list.filter(function (l) { return l.procedimento; }), function (l) { return l.procedimento; });
    const tp = topPairs(byProc, 5);
    vgChart('vg-proc', {
      type: 'bar',
      data: { labels: tp.map(function (x) { return x[0]; }), datasets: [{ data: tp.map(function (x) { return x[1]; }), backgroundColor: '#C8A064', borderRadius: 4 }] },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#B9AF9C', precision: 0, font: { size: 10 } } }, y: { grid: { display: false }, ticks: { color: '#DDD3C0', font: { size: 10 } } } } },
    });
    const byOrig = countBy(list, function (l) { return l.origem || 'direto'; });
    vgChart('vg-origem', donutCfg(Object.keys(byOrig), Object.keys(byOrig).map(function (k) { return byOrig[k]; })));
  }

  function viewVisaoGeral() {
    state.presetTipos = null;
    document.getElementById('painel-view').innerHTML =
      '<div class="painel-mode-banner" id="painel-mode-banner" hidden></div>' +
      '<div class="painel-kpis" id="painel-kpis"></div>' +
      '<div class="painel-chart-card"><div class="painel-chart-title">Leads por dia <small>últimos 30 dias</small></div><div class="painel-chart-wrap"><canvas id="vg-line"></canvas></div></div>' +
      '<div class="painel-grid-2">' +
        '<div class="painel-chart-card flush"><div class="painel-chart-title">Ranking de unidades <small>leads no período</small></div><ul class="vg-ranking" id="vg-ranking"></ul></div>' +
        '<div class="painel-chart-card flush"><div class="painel-chart-title">Atividade recente</div><ul class="vg-activity" id="vg-activity"></ul></div>' +
      '</div>' +
      '<div class="painel-grid-3">' +
        '<div class="painel-chart-card flush"><div class="painel-chart-title">Leads por tipo</div><div class="painel-chart-wrap sm"><canvas id="vg-tipo"></canvas></div></div>' +
        '<div class="painel-chart-card flush"><div class="painel-chart-title">Top procedimentos</div><div class="painel-chart-wrap sm"><canvas id="vg-proc"></canvas></div></div>' +
        '<div class="painel-chart-card flush"><div class="painel-chart-title">Origem do tráfego</div><div class="painel-chart-wrap sm"><canvas id="vg-origem"></canvas></div></div>' +
      '</div>';
    showBanner();
    renderVgKpis(state.all);
    renderVgRanking(state.all);
    renderVgActivity(state.all);
    renderVgCharts(state.all);
  }
  function viewStub(id) {
    state.presetTipos = null;
    document.getElementById('painel-view').innerHTML =
      '<div class="painel-stub"><div class="painel-stub-ico">🛠️</div>' +
      '<h3>' + esc(VIEW_TITLE[id] || id) + '</h3>' +
      '<p>A navegação e a estrutura desta tela já estão prontas. O conteúdo detalhado (gráficos, tabelas e gestão) entra nas próximas etapas do painel, conforme combinado.</p>' +
      '<span class="painel-stub-tag">Em construção</span></div>';
  }
  /* ===================== telas internas dos menus ===================== */
  function setView(h) { state.presetTipos = null; document.getElementById('painel-view').innerHTML = h; }
  function kpiCard(v, l, accent) { return '<div class="kpi-card' + (accent ? ' kpi-accent' : '') + '"><div class="kpi-value">' + v + '</div><div class="kpi-label">' + l + '</div></div>'; }
  function card(t, sub, inner, flush) { return '<div class="painel-chart-card' + (flush ? ' flush' : '') + '"><div class="painel-chart-title">' + t + (sub ? ' <small>' + sub + '</small>' : '') + '</div>' + inner + '</div>'; }
  function cv(id, sm) { return '<div class="painel-chart-wrap' + (sm ? ' sm' : '') + '"><canvas id="' + id + '"></canvas></div>'; }
  function barCfg(labels, data, horiz) { return { type: 'bar', data: { labels: labels, datasets: [{ data: data, backgroundColor: '#C8A064', borderRadius: 4 }] }, options: { indexAxis: horiz ? 'y' : 'x', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#B9AF9C', precision: 0, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(245,240,230,0.05)' }, ticks: { color: '#DDD3C0', font: { size: 10 } } } } } }; }
  function rankList(pairs) { if (!pairs.length) return '<div class="painel-empty">Sem dados ainda.</div>'; var max = pairs[0][1]; return '<ul class="vg-ranking">' + pairs.map(function (p, i) { return '<li class="vg-rank-item"><span class="vg-rank-pos">' + (i + 1) + '</span><span class="vg-rank-nome">' + esc(p[0]) + '<div class="vg-rank-bar"><span style="width:' + Math.round(p[1] / max * 100) + '%"></span></div></span><span class="vg-rank-val">' + p[1] + '</span></li>'; }).join('') + '</ul>'; }
  function tableHTML(headers, rows) { return '<div class="painel-table-wrap"><table class="painel-table"><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  function origemPairs() { return topPairs(countBy(state.all, function (l) { return l.origem || 'direto'; }), 10); }
  const MOCK_PAGINAS = [['Início', 4230], ['Procedimentos', 2680], ['Agendamento', 1940], ['Unidades', 1510], ['Vagas', 720], ['Seja um franqueado', 430]];
  const MOCK_DISP = [['Celular', 68], ['Desktop', 26], ['Tablet', 6]];
  const MOCK_IDADE = [['18-24', 14], ['25-34', 38], ['35-44', 27], ['45-54', 14], ['55+', 7]];
  const MOCK_GEN = [['Feminino', 82], ['Masculino', 16], ['Outro', 2]];

  function viewUnidadesRanking() {
    var by = countBy(state.all.filter(function (l) { return l.unidadeId; }), function (l) { return l.unidadeNome || l.unidadeId; });
    setView(card('Top 10 unidades', 'leads no período', cv('u-bar')) + card('Ranking completo', '', rankList(topPairs(by, 40)), true));
    var t = topPairs(by, 10); vgChart('u-bar', barCfg(t.map(function (x) { return x[0]; }), t.map(function (x) { return x[1]; }), false));
  }
  function viewUnidadesMapa() {
    var p = topPairs(countBy(state.all.filter(function (l) { return l.uf; }), function (l) { return l.uf; }), 14);
    setView('<div class="painel-grid-2">' + card('Leads por estado', 'distribuição da rede', cv('uf-bar'), true) + card('Concentração por estado', '', rankList(p), true) + '</div>');
    vgChart('uf-bar', barCfg(p.map(function (x) { return x[0]; }), p.map(function (x) { return x[1]; }), false));
  }
  function viewUnidadesCadastro() {
    var us = (window.LaserData && window.LaserData.unidades) || [];
    setView(card('Unidades cadastradas', us.length + ' unidades na rede', tableHTML(['Unidade', 'Cidade', 'Endereço', 'Contato'], us.map(function (u) { return [esc(u.nome), esc(u.cidade) + '/' + esc(u.uf), esc(u.endereco), esc(u.telefone || u.whatsapp || '-')]; })), true));
  }
  function viewTrafegoTempoReal() {
    var now = Date.now();
    var horaLeads = state.all.filter(function (l) { return now - new Date(l.createdAt) <= 3600000; }).length;
    setView('<div class="painel-kpis">' + kpiCard((34 + state.all.length % 17) + '<span class="kpi-live"></span>', 'Visitantes (30 min)', true) + kpiCard(horaLeads, 'Leads na última hora') + kpiCard(6 + state.all.length % 5, 'Online agora') + '</div><div class="painel-grid-2">' + card('Origem do tráfego', 'agora', cv('tr-orig', true), true) + card('Dispositivos', '', cv('tr-disp', true), true) + '</div>');
    var op = origemPairs(); vgChart('tr-orig', donutCfg(op.map(function (x) { return x[0]; }), op.map(function (x) { return x[1]; })));
    vgChart('tr-disp', donutCfg(MOCK_DISP.map(function (x) { return x[0]; }), MOCK_DISP.map(function (x) { return x[1]; })));
  }
  function viewTrafegoOrigem() {
    var op = origemPairs();
    setView('<div class="painel-grid-2">' + card('Origem dos visitantes', 'distribuição', cv('o-don', true), true) + card('Ranking de origem', '', rankList(op), true) + '</div>');
    vgChart('o-don', donutCfg(op.map(function (x) { return x[0]; }), op.map(function (x) { return x[1]; })));
  }
  function viewTrafegoPaginas() { setView(card('Páginas mais visitadas', 'últimos 30 dias (demonstração)', cv('pg-bar'))); vgChart('pg-bar', barCfg(MOCK_PAGINAS.map(function (x) { return x[0]; }), MOCK_PAGINAS.map(function (x) { return x[1]; }), true)); }
  function viewTrafegoDispositivos() { setView('<div class="painel-grid-2">' + card('Dispositivos', 'demonstração', cv('d-don', true), true) + card('Resumo', '', rankList(MOCK_DISP), true) + '</div>'); vgChart('d-don', donutCfg(MOCK_DISP.map(function (x) { return x[0]; }), MOCK_DISP.map(function (x) { return x[1]; }))); }
  function viewDemoIdade() { setView(card('Faixa etária dos leads', 'demonstração', cv('id-bar'))); vgChart('id-bar', barCfg(MOCK_IDADE.map(function (x) { return x[0]; }), MOCK_IDADE.map(function (x) { return x[1]; }), false)); }
  function viewDemoGenero() { setView('<div class="painel-grid-2">' + card('Distribuição por gênero', 'demonstração', cv('g-don', true), true) + card('Resumo', '', rankList(MOCK_GEN), true) + '</div>'); vgChart('g-don', donutCfg(MOCK_GEN.map(function (x) { return x[0]; }), MOCK_GEN.map(function (x) { return x[1]; }))); }
  function viewPromoAtivas() {
    var ps = (window.LaserData && window.LaserData.promocoes) || [];
    var html = ps.map(function (p) { return '<div class="painel-chart-card flush"><div style="font-family:var(--font-accent);font-weight:600">' + esc(p.titulo) + '</div><div style="color:var(--color-accent-pale);font-size:var(--fs-xl);font-family:var(--font-accent);margin:6px 0">' + esc(p.preco || '') + ' <small style="color:var(--color-text-muted);text-decoration:line-through;font-size:0.55em">' + esc(p.precoOriginal || '') + '</small></div><div style="font-size:var(--fs-xs);color:var(--color-text-muted)">Válida até ' + esc(p.valida || '-') + ' · ' + esc(p.desconto || '') + '</div></div>'; }).join('');
    setView('<div class="painel-grid-3">' + (html || '<div class="painel-empty">Sem promoções ativas.</div>') + '</div>');
  }
  function viewPromoCadastrar() {
    setView(card('Cadastrar promoção', 'demonstração (salvar entra na integração com o sistema)', '<div style="display:grid;gap:var(--sp-4);max-width:520px"><div class="det-field"><label>Título</label><input class="painel-input" style="width:100%" placeholder="Ex.: Rejuvenescimento Facial 4D"></div><div class="det-field"><label>Preço promocional</label><input class="painel-input" style="width:100%" placeholder="R$ 397"></div><div class="det-field"><label>Válida até</label><input class="painel-input" type="date" style="width:100%"></div><button class="btn btn-primary" type="button" onclick="return false">Salvar promoção</button></div>', true));
  }
  function viewPromoDesempenho() {
    var ps = (window.LaserData && window.LaserData.promocoes) || [];
    setView(card('Desempenho por promoção', 'leads gerados (demonstração)', cv('pr-bar')));
    vgChart('pr-bar', barCfg(ps.map(function (p) { return p.titulo; }), ps.map(function (p, i) { return 40 + (i * 17 + state.all.length) % 90; }), true));
  }
  function viewRecrutVagas() {
    var vs = (window.LaserData && window.LaserData.vagas) || [];
    setView(card('Vagas abertas', vs.length + ' vagas', tableHTML(['Função', 'Cidade', 'Regime', 'Status'], vs.map(function (v) { return [esc(v.funcao), esc(v.cidade), esc(v.tipo) + ' · ' + esc(v.nivel), v.destaque ? 'Em destaque' : '-']; })), true));
  }
  function viewConfigUsuarios() {
    var us = (window.LaserAPI && window.LaserAPI.DEMO_USERS) || [];
    setView(card('Usuários e permissões', 'acessos do painel (demonstração)', tableHTML(['Nome', 'E-mail', 'Perfil', 'Unidade'], us.map(function (u) { return [esc(u.nome), esc(u.email), u.role === 'franqueador' ? 'Franqueador' : 'Franqueado', esc(u.unidadeId || 'rede toda')]; })), true));
  }
  function viewConfigConta() {
    var u = state.session.user;
    setView(card('Minha conta', '', '<div style="display:grid;gap:var(--sp-3);max-width:480px;font-size:var(--fs-sm)"><div class="det-row"><span class="det-k">Nome</span><span class="det-v">' + esc(u.nome) + '</span></div><div class="det-row"><span class="det-k">E-mail</span><span class="det-v">' + esc(u.email) + '</span></div><div class="det-row"><span class="det-k">Perfil</span><span class="det-v">' + (u.role === 'franqueador' ? 'Franqueador' : 'Franqueado') + '</span></div></div><div style="margin-top:var(--sp-5)"><button class="btn btn-outline" type="button" onclick="return false">Alterar senha</button></div>', true));
  }
  function viewDesempProcedimento() {
    var t = topPairs(countBy(state.all.filter(function (l) { return l.procedimento; }), function (l) { return l.procedimento; }), 8);
    setView(card('Seus leads por procedimento', 'top da sua unidade', cv('dp-bar')));
    vgChart('dp-bar', barCfg(t.map(function (x) { return x[0]; }), t.map(function (x) { return x[1]; }), true));
  }
  function viewDesempPeriodo() {
    var dias = leadsPorDia(state.all, 30);
    setView(card('Seus leads por dia', 'últimos 30 dias', cv('dpd-line')));
    var el = document.getElementById('dpd-line'); if (el && window.Chart) { var ctx = el.getContext('2d'); var g = ctx.createLinearGradient(0, 0, 0, 240); g.addColorStop(0, 'rgba(200,160,100,0.35)'); g.addColorStop(1, 'rgba(200,160,100,0)'); vgChart('dpd-line', { type: 'line', data: { labels: dias.map(function (d) { return d.key; }), datasets: [{ data: dias.map(function (d) { return d.count; }), borderColor: '#C8A064', borderWidth: 2, fill: true, backgroundColor: g, tension: 0.35, pointRadius: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#B9AF9C', maxTicksLimit: 8, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(245,240,230,0.06)' }, ticks: { color: '#B9AF9C', precision: 0, font: { size: 10 } } } } } }); }
  }
  function viewDesempRede() {
    var rede = (window.LaserPainelData ? window.LaserPainelData.seed() : []).map(normalize);
    var meus = leadsPorDia(state.all, 14), redeDias = leadsPorDia(rede, 14), nU = 14;
    setView(card('Comparação com a rede', 'seus leads/dia vs média da rede (14 dias)', cv('cr-line')));
    if (document.getElementById('cr-line') && window.Chart) {
      vgChart('cr-line', { type: 'line', data: { labels: meus.map(function (d) { return d.key; }), datasets: [{ label: 'Sua unidade', data: meus.map(function (d) { return d.count; }), borderColor: '#C8A064', borderWidth: 2, tension: 0.35, pointRadius: 0 }, { label: 'Média da rede', data: redeDias.map(function (d) { return Math.round(d.count / nU * 10) / 10; }), borderColor: '#B7AD9D', borderWidth: 2, borderDash: [5, 4], tension: 0.35, pointRadius: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#DDD3C0', font: { size: 11 }, boxWidth: 12 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#B9AF9C', font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(245,240,230,0.06)' }, ticks: { color: '#B9AF9C', font: { size: 10 } } } } } });
    }
  }
  function viewEquipeLogins() {
    setView(card('Logins da equipe', 'acessos com permissão reduzida (só visualização)', tableHTML(['Nome', 'E-mail', 'Permissão'], [['Recepção', 'recepcao@unidade.com.br', 'Visualização'], ['Atendimento', 'atendimento@unidade.com.br', 'Visualização']]) + '<div style="margin-top:var(--sp-4)"><button class="btn btn-outline" type="button" onclick="return false">Adicionar acesso</button></div>', true));
  }
  const THEMES_BASE = [{ id: 'default', label: 'Vinho & Dourado', desc: 'Padrão', bg: 'linear-gradient(135deg,#3B0E0B,#1F0706)' }, { id: 'roteiro-light', label: 'Versão Clara', desc: 'Fundo claro', bg: 'linear-gradient(135deg,#F4ECDF,#D5CCBE)' }];
  const THEMES_SAZ = [{ id: 'dia-das-maes', label: 'Dia das Mães', bg: '#E08CB4' }, { id: 'dia-dos-namorados', label: 'Dia dos Namorados', bg: '#C84B5A' }, { id: 'dia-dos-pais', label: 'Dia dos Pais', bg: '#5B9BD5' }, { id: 'outubro-rosa', label: 'Outubro Rosa', bg: '#D88FA5' }, { id: 'novembro-azul', label: 'Novembro Azul', bg: '#2E6FA8' }, { id: 'setembro-amarelo', label: 'Setembro Amarelo', bg: '#F5C342' }];
  function siteTheme() { try { return localStorage.getItem('laserco_theme') || 'default'; } catch (e) { return 'default'; } }
  function themeOpt(t) { var a = siteTheme() === t.id; return '<button type="button" class="theme-opt' + (a ? ' active' : '') + '" data-theme="' + t.id + '"><span class="theme-sw" style="background:' + t.bg + '"></span><span class="theme-opt-l">' + t.label + (t.desc ? '<small>' + t.desc + '</small>' : '') + '</span>' + (a ? '<span class="theme-tag">Ativo</span>' : '') + '</button>'; }
  function bindThemes() { document.querySelectorAll('#painel-view .theme-opt').forEach(function (b) { b.addEventListener('click', function () { try { localStorage.setItem('laserco_theme', b.dataset.theme); } catch (e) {} router(); }); }); }
  function viewAparenciaTema() { setView(card('Tema base do site', 'aparência do site público', '<div class="theme-grid big">' + THEMES_BASE.map(themeOpt).join('') + '</div>', true) + '<p class="painel-sub" style="margin-top:var(--sp-4)">A troca afeta só o site público. Os painéis seguem sempre vinho/dourado.</p>'); bindThemes(); }
  function viewAparenciaSazonais() { setView(card('Temas sazonais', 'ative uma campanha por vez no site público', '<div class="theme-grid">' + THEMES_SAZ.map(themeOpt).join('') + '</div>', true) + '<div style="margin-top:var(--sp-4)"><button type="button" class="painel-export" id="t-reset">Voltar ao tema base</button></div>'); bindThemes(); var r = document.getElementById('t-reset'); if (r) r.addEventListener('click', function () { try { localStorage.setItem('laserco_theme', 'default'); } catch (e) {} router(); }); }

  const VIEWS = {
    'visao-geral': viewVisaoGeral,
    'leads-todos': function () { viewLeads({}); },
    'leads-popup': function () { viewLeads({ presetTipos: ['popup_brinde'] }); },
    'leads-agendamento': function () { viewLeads({ presetTipos: ['agendamento', 'agendamento_interesse'] }); },
    'leads-recrutamento': function () { viewLeads({ presetTipos: ['recrutamento'] }); },
    'recrut-candidatos': function () { viewLeads({ presetTipos: ['recrutamento'] }); },
    'unidades-ranking': viewUnidadesRanking,
    'unidades-mapa': viewUnidadesMapa,
    'unidades-cadastro': viewUnidadesCadastro,
    'trafego-tempo-real': viewTrafegoTempoReal,
    'trafego-origem': viewTrafegoOrigem,
    'trafego-paginas': viewTrafegoPaginas,
    'trafego-dispositivos': viewTrafegoDispositivos,
    'demo-idade': viewDemoIdade,
    'demo-genero': viewDemoGenero,
    'promo-ativas': viewPromoAtivas,
    'promo-cadastrar': viewPromoCadastrar,
    'promo-desempenho': viewPromoDesempenho,
    'recrut-vagas': viewRecrutVagas,
    'config-usuarios': viewConfigUsuarios,
    'config-conta': viewConfigConta,
    'desemp-procedimento': viewDesempProcedimento,
    'desemp-periodo': viewDesempPeriodo,
    'desemp-rede': viewDesempRede,
    'equipe-logins': viewEquipeLogins,
    'aparencia-tema': viewAparenciaTema,
    'aparencia-sazonais': viewAparenciaSazonais,
  };

  /* ---------------- sidebar + roteador ---------------- */
  function renderSidebar() {
    const nav = document.getElementById('painel-nav'); if (!nav) return;
    const menu = state.mode === 'franqueado' ? MENU_FRANQUEADO : MENU_FRANQUEADOR;
    nav.innerHTML = menu.map((g) => {
      if (g.children) {
        return '<div class="painel-nav-group" data-group>' +
          '<button class="painel-nav-head" type="button"><span class="painel-nav-ico">' + g.ico + '</span><span class="painel-nav-label">' + g.label + '</span><span class="painel-nav-caret">▸</span></button>' +
          '<div class="painel-nav-sub">' + g.children.map((c) => '<a class="painel-nav-link" href="#' + c.id + '" data-view="' + c.id + '">' + c.label + '</a>').join('') + '</div></div>';
      }
      return '<div class="painel-nav-group"><a class="painel-nav-link" href="#' + g.id + '" data-view="' + g.id + '"><span class="painel-nav-ico">' + g.ico + '</span><span class="painel-nav-label">' + g.label + '</span></a></div>';
    }).join('');
    nav.querySelectorAll('.painel-nav-head').forEach((h) => h.addEventListener('click', () => h.closest('.painel-nav-group').classList.toggle('open')));
    nav.querySelectorAll('.painel-nav-link').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('sidebar-open')));
  }
  function setActive(id) {
    document.querySelectorAll('.painel-nav-link').forEach((a) => {
      const on = a.dataset.view === id;
      a.classList.toggle('active', on);
      if (on) { const g = a.closest('.painel-nav-group'); if (g) g.classList.add('open'); }
    });
  }
  function router() {
    let id = (location.hash || '').replace(/^#/, '') || 'visao-geral';
    if (!VIEW_TITLE[id]) id = 'visao-geral';
    destroyCharts();
    state.currentView = id;
    setActive(id);
    const t = document.getElementById('painel-view-title'); if (t) t.textContent = VIEW_TITLE[id] || id;
    const s = document.getElementById('painel-view-sub'); if (s) s.textContent = VIEW_SUB[id] || '';
    (VIEWS[id] || function () { viewStub(id); })();
  }

  /* ---------------- carregamento + init ---------------- */
  async function carregar() {
    let res;
    try { res = await window.LaserAPI.listLeads(state.session); }
    catch (e) { if (e.status === 401) return logout(); res = { leads: [], mode: 'demo' }; }
    state.dataMode = res.mode;
    state.all = (res.leads || []).map(normalize);
  }
  function fillUser() {
    const session = state.session;
    const nomeEl = document.getElementById('painel-user-nome');
    const roleEl = document.getElementById('painel-user-role');
    if (nomeEl) nomeEl.textContent = session.user.nome || session.user.email;
    if (roleEl) {
      if (session.user.role === 'franqueado') {
        const u = (window.LaserData && window.LaserData.unidades || []).find((x) => x.id === session.user.unidadeId);
        roleEl.textContent = u ? u.nome + '/' + u.uf : (session.user.unidadeId || 'Franqueado');
      } else roleEl.textContent = 'Acesso total à rede';
    }
  }
  function bindShell() {
    const lo = document.getElementById('painel-logout'); if (lo) lo.addEventListener('click', logout);
    const burger = document.getElementById('painel-burger');
    const backdrop = document.getElementById('painel-backdrop');
    if (burger) burger.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
    if (backdrop) backdrop.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    const closeBtn = document.getElementById('painel-detail-close');
    const modal = document.getElementById('painel-detail-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeDetail(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });
  }

  async function init(opts) {
    opts = opts || {};
    state.mode = opts.mode || 'franqueador';
    const session = getSession();
    if (!session || !session.user) { location.replace('painel.html'); return; }
    if (state.mode === 'franqueador' && session.user.role !== 'franqueador') { location.replace('painel-franqueado.html'); return; }
    if (state.mode === 'franqueado' && session.user.role !== 'franqueado') { location.replace('painel-franqueador.html'); return; }
    state.session = session;
    fillUser();
    bindShell();
    renderSidebar();
    await carregar();
    window.addEventListener('hashchange', router);
    router();
  }

  return { init: init, getSession: getSession, setSession: setSession, logout: logout };
})();
