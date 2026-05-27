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
    { id: 'demo', ico: '👥', label: 'Demográfico' },
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
    'demo': 'Demográfico',
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
    'demo': 'Idade e gênero do público (demonstração).',
    'config-usuarios': 'Gerencie acessos e permissões do painel.',
    'config-conta': 'Seus dados de acesso e perfil.',
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
  const VG_PALETTE = ['#9A6B1E', '#481712', '#C8A064', '#8E3B36', '#D88F3F', '#74302A', '#B57C0C'];

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
      data: { labels: labels, datasets: [{ data: data, backgroundColor: VG_PALETTE, borderColor: '#FFFFFF', borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: '#6E4A3A', font: { size: 10 }, boxWidth: 10, padding: 8 } } } },
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
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#6E4A3A', maxTicksLimit: 8, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(70,25,20,0.06)' }, ticks: { color: '#6E4A3A', precision: 0, font: { size: 10 } } } } },
      });
    }
    const byTipo = countBy(list, function (l) { return TIPO_LABEL[l.tipo] || l.tipo; });
    vgChart('vg-tipo', donutCfg(Object.keys(byTipo), Object.keys(byTipo).map(function (k) { return byTipo[k]; })));
    const byProc = countBy(list.filter(function (l) { return l.procedimento; }), function (l) { return l.procedimento; });
    const tp = topPairs(byProc, 5);
    vgChart('vg-proc', {
      type: 'bar',
      data: { labels: tp.map(function (x) { return x[0]; }), datasets: [{ data: tp.map(function (x) { return x[1]; }), backgroundColor: '#C8A064', borderRadius: 4 }] },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#6E4A3A', precision: 0, font: { size: 10 } } }, y: { grid: { display: false }, ticks: { color: '#4E1A15', font: { size: 10 } } } } },
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
  function barCfg(labels, data, horiz) { return { type: 'bar', data: { labels: labels, datasets: [{ data: data, backgroundColor: '#C8A064', borderRadius: 4 }] }, options: { indexAxis: horiz ? 'y' : 'x', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#6E4A3A', precision: 0, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(70,25,20,0.06)' }, ticks: { color: '#4E1A15', font: { size: 10 } } } } } }; }
  function rankList(pairs) { if (!pairs.length) return '<div class="painel-empty">Sem dados ainda.</div>'; var max = pairs[0][1]; return '<ul class="vg-ranking">' + pairs.map(function (p, i) { return '<li class="vg-rank-item"><span class="vg-rank-pos">' + (i + 1) + '</span><span class="vg-rank-nome">' + esc(p[0]) + '<div class="vg-rank-bar"><span style="width:' + Math.round(p[1] / max * 100) + '%"></span></div></span><span class="vg-rank-val">' + p[1] + '</span></li>'; }).join('') + '</ul>'; }
  function tableHTML(headers, rows) { return '<div class="painel-table-wrap"><table class="painel-table"><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  function origemPairs() { return topPairs(countBy(state.all, function (l) { return l.origem || 'direto'; }), 10); }
  function col0(a) { return a.map(function (x) { return x[0]; }); }
  function col1(a) { return a.map(function (x) { return x[1]; }); }
  function nf(n) { return Number(n).toLocaleString('pt-BR'); }
  const MOCK_PAGINAS = [['Início', 58240], ['Procedimentos', 41360], ['Agendamento', 23110], ['Unidades', 18470], ['Seja um franqueado', 9320], ['Vagas', 6240]];
  const MOCK_PG_TIME = ['1m12s', '2m48s', '3m21s', '1m54s', '2m37s', '1m08s'];
  const MOCK_PG_EXIT = [32, 21, 44, 28, 26, 51];
  const MOCK_DISP = [['Celular', 68], ['Desktop', 26], ['Tablet', 6]];
  const MOCK_BROWSER = [['Chrome', 58], ['Safari', 27], ['Edge', 8], ['Samsung Internet', 4], ['Outros', 3]];
  const MOCK_IDADE = [['18-24', 14], ['25-34', 38], ['35-44', 27], ['45-54', 14], ['55+', 7]];
  const MOCK_GEN = [['Feminino', 82], ['Masculino', 16], ['Outro', 2]];

  function viewUnidadesRanking() {
    var by = countBy(state.all.filter(function (l) { return l.unidadeId; }), function (l) { return l.unidadeNome || l.unidadeId; });
    var pairs = topPairs(by, 40), top = pairs.slice(0, 10);
    var totalLeads = pairs.reduce(function (s, p) { return s + p[1]; }, 0);
    var nUni = Object.keys(by).length;
    var totalU = (window.LaserData && window.LaserData.unidades) ? window.LaserData.unidades.length : 70;
    var media = nUni ? Math.round(totalLeads / nUni) : 0;
    setView('<div class="painel-kpis">' + kpiCard(nf(totalLeads), 'Leads na rede', true) + kpiCard(nUni + ' <small style="font-size:0.5em;color:var(--color-text-muted)">de ' + totalU + '</small>', 'Unidades com leads') + kpiCard(media, 'Média por unidade') + kpiCard(Math.round(nUni / totalU * 100) + '%', 'Cobertura da rede') + '</div>' +
      '<div class="painel-grid-2">' + card('Top 10 unidades', 'leads no período', cv('u-bar'), true) + card('Ranking completo', nf(nUni) + ' unidades', rankList(pairs), true) + '</div>');
    vgChart('u-bar', barCfg(col0(top), col1(top), false));
  }
  function viewUnidadesMapa() {
    var p = topPairs(countBy(state.all.filter(function (l) { return l.uf; }), function (l) { return l.uf; }), 16);
    var totalU = (window.LaserData && window.LaserData.unidades) ? window.LaserData.unidades.length : 70;
    setView('<div class="painel-kpis">' + kpiCard(p.length, 'Estados com presença', true) + kpiCard(totalU, 'Unidades na rede') + kpiCard(p[0] ? p[0][0] : '-', 'Estado líder') + '</div>' +
      '<div class="painel-grid-2">' + card('Leads por estado', 'distribuição da rede', cv('uf-bar'), true) + card('Concentração por estado', '', rankList(p), true) + '</div>' +
      '<p class="painel-sub" style="margin-top:var(--sp-2)">O mapa geográfico interativo entra na fase de integração com o sistema unificado.</p>');
    vgChart('uf-bar', barCfg(col0(p), col1(p), false));
  }
  function viewUnidadesCadastro() {
    var us = (window.LaserData && window.LaserData.unidades) || [];
    setView(card('Unidades cadastradas', us.length + ' unidades na rede', tableHTML(['Unidade', 'Cidade', 'Endereço', 'Contato'], us.map(function (u) { return [esc(u.nome), esc(u.cidade) + '/' + esc(u.uf), esc(u.endereco), esc(u.telefone || u.whatsapp || '-')]; })), true));
  }
  function viewTrafegoTempoReal() {
    var now = Date.now();
    var horaLeads = state.all.filter(function (l) { return now - new Date(l.createdAt) <= 3600000; }).length;
    var online = 28 + state.all.length % 22;
    var v30 = 64 + state.all.length % 40;
    setView('<div class="painel-kpis">' + kpiCard(online + '<span class="kpi-live"></span>', 'Online agora', true) + kpiCard(nf(v30), 'Visitantes (30 min)') + kpiCard('2.040', 'Visitantes hoje') + kpiCard('61.380', 'Visitantes no mês') + kpiCard(horaLeads, 'Leads na última hora') + '</div><div class="painel-grid-2">' + card('Origem do tráfego', 'agora', cv('tr-orig', true), true) + card('Dispositivos', '', cv('tr-disp', true), true) + '</div>');
    var op = origemPairs(); vgChart('tr-orig', donutCfg(col0(op), col1(op)));
    vgChart('tr-disp', donutCfg(col0(MOCK_DISP), col1(MOCK_DISP)));
  }
  function viewTrafegoOrigem() {
    var op = origemPairs();
    setView('<div class="painel-grid-2">' + card('Origem dos visitantes', 'distribuição', cv('o-don', true), true) + card('Ranking de origem', '', rankList(op), true) + '</div>');
    vgChart('o-don', donutCfg(op.map(function (x) { return x[0]; }), op.map(function (x) { return x[1]; })));
  }
  function viewTrafegoPaginas() {
    var totalViews = MOCK_PAGINAS.reduce(function (s, p) { return s + p[1]; }, 0);
    var rows = MOCK_PAGINAS.map(function (p, i) { return [p[0], nf(p[1]), MOCK_PG_TIME[i], MOCK_PG_EXIT[i] + '%']; });
    setView('<div class="painel-kpis">' + kpiCard(nf(totalViews), 'Visualizações (30 dias)', true) + kpiCard('2m31s', 'Tempo médio na página') + kpiCard('33%', 'Taxa de saída média') + '</div>' +
      '<div class="painel-grid-2">' + card('Páginas mais visitadas', 'últimos 30 dias (demonstração)', cv('pg-bar'), true) + card('Detalhe por página', '', tableHTML(['Página', 'Views', 'Tempo médio', 'Saída'], rows), true) + '</div>');
    vgChart('pg-bar', barCfg(col0(MOCK_PAGINAS), col1(MOCK_PAGINAS), true));
  }
  function viewTrafegoDispositivos() {
    setView('<div class="painel-kpis">' + kpiCard('68%', 'Celular', true) + kpiCard('26%', 'Desktop') + kpiCard('6%', 'Tablet') + '</div>' +
      '<div class="painel-grid-2">' + card('Dispositivos', 'distribuição (demonstração)', cv('d-don', true), true) + card('Navegadores', 'demonstração', rankList(MOCK_BROWSER), true) + '</div>');
    vgChart('d-don', donutCfg(col0(MOCK_DISP), col1(MOCK_DISP)));
  }
  function viewDemografico() {
    var faixaTop = MOCK_IDADE.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
    var totalG = MOCK_GEN.reduce(function (s, x) { return s + x[1]; }, 0);
    var fem = (MOCK_GEN.filter(function (x) { return x[0] === 'Feminino'; })[0] || ['', 0])[1];
    setView('<div class="painel-kpis">' + kpiCard(faixaTop[0] + ' anos', 'Faixa predominante', true) + kpiCard(Math.round(fem / totalG * 100) + '%', 'Público feminino') + kpiCard(MOCK_IDADE.length, 'Faixas monitoradas') + '</div>' +
      '<div class="painel-grid-2">' + card('Faixa etária (idade)', 'distribuição dos leads por idade (demonstração)', cv('demo-id-bar'), true) + card('Distribuição por gênero', 'demonstração', cv('demo-gen-don', true), true) + '</div>' +
      card('Resumo demográfico', 'idade e gênero (demonstração)', '<div class="painel-grid-2" style="margin-bottom:0">' + tableHTML(['Faixa etária (idade)', 'Participação'], MOCK_IDADE.map(function (x) { return [x[0] + ' anos', x[1] + '%']; })) + tableHTML(['Gênero', 'Participação'], MOCK_GEN.map(function (x) { return [x[0], x[1] + '%']; })) + '</div>', true));
    vgChart('demo-id-bar', barCfg(col0(MOCK_IDADE), col1(MOCK_IDADE), false));
    vgChart('demo-gen-don', donutCfg(col0(MOCK_GEN), col1(MOCK_GEN)));
  }
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
  const PERMS = [
    { key: 'ver', label: 'Ver leads' },
    { key: 'editar', label: 'Editar leads' },
    { key: 'exportar', label: 'Exportar CSV' },
    { key: 'promos', label: 'Gerenciar promoções' },
    { key: 'usuarios', label: 'Gerenciar usuários' },
  ];
  var _usuarios = null;
  function roleLabel(r) { return r === 'franqueador' ? 'Franqueador' : (r === 'recepcao' ? 'Recepção' : 'Franqueado'); }
  function unidadeNomePorId(id) { var u = (window.LaserData && window.LaserData.unidades || []).filter(function (x) { return x.id === id; })[0]; return u ? u.nome + '/' + u.uf : (id ? id : 'Rede toda'); }
  function ensureUsuarios() {
    if (_usuarios) return _usuarios;
    var us = (window.LaserAPI && window.LaserAPI.DEMO_USERS) || [];
    _usuarios = us.map(function (u) { return { nome: u.nome, email: u.email, role: u.role, unidadeId: u.unidadeId || '', perms: u.role === 'franqueador' ? PERMS.map(function (p) { return p.key; }) : ['ver', 'editar', 'exportar'] }; });
    if (!_usuarios.length) _usuarios.push({ nome: 'Franqueador', email: 'franqueador@laserco.com.br', role: 'franqueador', unidadeId: '', perms: PERMS.map(function (p) { return p.key; }) });
    _usuarios.push({ nome: 'Recepção, V. Mariana', email: 'recepcao.vmariana@laserco.com.br', role: 'recepcao', unidadeId: 'vmariana', perms: ['ver'] });
    return _usuarios;
  }
  function permChips(perms) { return PERMS.filter(function (p) { return perms.indexOf(p.key) >= 0; }).map(function (p) { return '<span class="perm-chip">' + p.label + '</span>'; }).join('') || '<span class="muted">Sem permissões</span>'; }
  function viewConfigUsuarios() {
    var us = ensureUsuarios();
    var rows = us.map(function (u, i) { return [esc(u.nome), esc(u.email), roleLabel(u.role), esc(unidadeNomePorId(u.unidadeId)), '<div class="perm-chips">' + permChips(u.perms) + '</div>', '<button class="painel-act det" type="button" data-edit="' + i + '">Editar</button>']; });
    setView('<div class="painel-toolbar" style="justify-content:flex-end"><button class="btn btn-primary" type="button" id="u-novo">+ Convidar usuário</button></div>' +
      '<div id="u-form-box"></div>' +
      card('Usuários e permissões', us.length + ' acessos (demonstração, salvar conecta na integração)', tableHTML(['Nome', 'E-mail', 'Perfil', 'Unidade', 'Permissões', ''], rows), true));
    var box = document.getElementById('u-form-box');
    function unidadeOptions(sel) { var opt = '<option value="">Rede toda</option>'; (window.LaserData && window.LaserData.unidades || []).slice().sort(function (a, b) { return a.nome.localeCompare(b.nome); }).forEach(function (u) { opt += '<option value="' + u.id + '"' + (u.id === sel ? ' selected' : '') + '>' + esc(u.nome) + ' (' + u.uf + ')</option>'; }); return opt; }
    function openForm(idx) {
      var u = idx == null ? { nome: '', email: '', role: 'franqueado', unidadeId: '', perms: ['ver', 'editar'] } : us[idx];
      box.innerHTML = card(idx == null ? 'Convidar usuário' : 'Editar usuário', '', '<div class="painel-form"><div class="det-field"><label>Nome</label><input id="uf-nome" class="painel-input" style="width:100%" value="' + esc(u.nome) + '"></div>' +
        '<div class="det-field"><label>E-mail</label><input id="uf-email" class="painel-input" type="email" style="width:100%" value="' + esc(u.email) + '"></div>' +
        '<div class="det-field"><label>Perfil</label><select id="uf-role" class="painel-select"><option value="franqueado"' + (u.role === 'franqueado' ? ' selected' : '') + '>Franqueado</option><option value="recepcao"' + (u.role === 'recepcao' ? ' selected' : '') + '>Recepção</option><option value="franqueador"' + (u.role === 'franqueador' ? ' selected' : '') + '>Franqueador</option></select></div>' +
        '<div class="det-field"><label>Unidade</label><select id="uf-uni" class="painel-select">' + unidadeOptions(u.unidadeId) + '</select></div>' +
        '<div class="det-field" style="grid-column:1/-1"><label>Permissões</label><div class="perm-list">' + PERMS.map(function (p) { return '<label class="perm-item"><input type="checkbox" value="' + p.key + '"' + (u.perms.indexOf(p.key) >= 0 ? ' checked' : '') + '> ' + p.label + '</label>'; }).join('') + '</div></div></div>' +
        '<div class="det-actions"><button class="btn btn-primary" type="button" id="uf-save">Salvar</button><button class="btn btn-outline" type="button" id="uf-cancel">Cancelar</button></div>', true);
      document.getElementById('uf-cancel').addEventListener('click', function () { box.innerHTML = ''; });
      document.getElementById('uf-save').addEventListener('click', function () {
        var perms = Array.prototype.slice.call(box.querySelectorAll('.perm-item input:checked')).map(function (c) { return c.value; });
        var data = { nome: document.getElementById('uf-nome').value || 'Sem nome', email: document.getElementById('uf-email').value, role: document.getElementById('uf-role').value, unidadeId: document.getElementById('uf-uni').value, perms: perms };
        if (idx == null) us.push(data); else us[idx] = data;
        router();
      });
    }
    var novo = document.getElementById('u-novo'); if (novo) novo.addEventListener('click', function () { openForm(null); });
    document.querySelectorAll('#painel-view [data-edit]').forEach(function (b) { b.addEventListener('click', function () { openForm(parseInt(b.dataset.edit, 10)); }); });
  }
  function viewConfigConta() {
    var u = state.session.user;
    var inicial = String(u.nome || u.email || '?').trim().charAt(0).toUpperCase();
    setView(card('Minha conta', 'seus dados de acesso (demonstração)',
      '<div class="acct-head"><div class="acct-avatar" id="acct-avatar">' + esc(inicial) + '</div>' +
        '<div><div class="acct-name">' + esc(u.nome || '-') + '</div><div class="muted">' + roleLabel(u.role) + (u.unidadeId ? ' · ' + esc(unidadeNomePorId(u.unidadeId)) : ' · rede toda') + '</div>' +
        '<label class="btn btn-outline acct-photo-btn" style="margin-top:var(--sp-3)">Alterar foto<input type="file" id="acct-photo" accept="image/*" hidden></label></div></div>' +
      '<div class="painel-form" style="margin-top:var(--sp-5)">' +
        '<div class="det-field"><label>Nome</label><input id="ac-nome" class="painel-input" style="width:100%" value="' + esc(u.nome || '') + '"></div>' +
        '<div class="det-field"><label>E-mail</label><input id="ac-email" class="painel-input" type="email" style="width:100%" value="' + esc(u.email || '') + '"></div>' +
        '<div class="det-field"><label>Telefone</label><input id="ac-fone" class="painel-input" style="width:100%" placeholder="(00) 00000-0000"></div>' +
        '<div class="det-field"><label>Cargo</label><input id="ac-cargo" class="painel-input" style="width:100%" placeholder="Ex.: Proprietário"></div>' +
        '<div class="det-field" style="grid-column:1/-1"><label>Observações</label><textarea id="ac-obs" class="painel-textarea" rows="3" style="width:100%" placeholder="Notas internas (opcional)"></textarea></div>' +
      '</div>' +
      '<div class="det-actions"><button class="btn btn-primary" type="button" id="ac-save">Salvar alterações</button><button class="btn btn-outline" type="button" onclick="return false">Alterar senha</button><span class="muted" id="ac-msg"></span></div>', true));
    var photo = document.getElementById('acct-photo');
    if (photo) photo.addEventListener('change', function () {
      var f = photo.files && photo.files[0]; if (!f) return;
      var rd = new FileReader(); rd.onload = function (e) { var av = document.getElementById('acct-avatar'); if (av) { av.textContent = ''; av.style.backgroundImage = 'url(' + e.target.result + ')'; av.style.backgroundSize = 'cover'; av.style.backgroundPosition = 'center'; } }; rd.readAsDataURL(f);
    });
    var save = document.getElementById('ac-save'); if (save) save.addEventListener('click', function () { var m = document.getElementById('ac-msg'); if (m) m.textContent = 'Salvo nesta sessão. A gravação real entra na integração.'; });
  }
  function viewDesempProcedimento() {
    var t = topPairs(countBy(state.all.filter(function (l) { return l.procedimento; }), function (l) { return l.procedimento; }), 8);
    setView(card('Seus leads por procedimento', 'top da sua unidade', cv('dp-bar')));
    vgChart('dp-bar', barCfg(t.map(function (x) { return x[0]; }), t.map(function (x) { return x[1]; }), true));
  }
  function viewDesempPeriodo() {
    var dias = leadsPorDia(state.all, 30);
    setView(card('Seus leads por dia', 'últimos 30 dias', cv('dpd-line')));
    var el = document.getElementById('dpd-line'); if (el && window.Chart) { var ctx = el.getContext('2d'); var g = ctx.createLinearGradient(0, 0, 0, 240); g.addColorStop(0, 'rgba(200,160,100,0.35)'); g.addColorStop(1, 'rgba(200,160,100,0)'); vgChart('dpd-line', { type: 'line', data: { labels: dias.map(function (d) { return d.key; }), datasets: [{ data: dias.map(function (d) { return d.count; }), borderColor: '#C8A064', borderWidth: 2, fill: true, backgroundColor: g, tension: 0.35, pointRadius: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#6E4A3A', maxTicksLimit: 8, font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(70,25,20,0.06)' }, ticks: { color: '#6E4A3A', precision: 0, font: { size: 10 } } } } } }); }
  }
  function viewDesempRede() {
    var rede = (window.LaserPainelData ? window.LaserPainelData.seed() : []).map(normalize);
    var meus = leadsPorDia(state.all, 14), redeDias = leadsPorDia(rede, 14), nU = 14;
    setView(card('Comparação com a rede', 'seus leads/dia vs média da rede (14 dias)', cv('cr-line')));
    if (document.getElementById('cr-line') && window.Chart) {
      vgChart('cr-line', { type: 'line', data: { labels: meus.map(function (d) { return d.key; }), datasets: [{ label: 'Sua unidade', data: meus.map(function (d) { return d.count; }), borderColor: '#C8A064', borderWidth: 2, tension: 0.35, pointRadius: 0 }, { label: 'Média da rede', data: redeDias.map(function (d) { return Math.round(d.count / nU * 10) / 10; }), borderColor: '#9A6B3A', borderWidth: 2, borderDash: [5, 4], tension: 0.35, pointRadius: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#4E1A15', font: { size: 11 }, boxWidth: 12 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#6E4A3A', font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(70,25,20,0.06)' }, ticks: { color: '#6E4A3A', font: { size: 10 } } } } } });
    }
  }
  function viewEquipeLogins() {
    setView(card('Logins da equipe', 'acessos com permissão reduzida (só visualização)', tableHTML(['Nome', 'E-mail', 'Permissão'], [['Recepção', 'recepcao@unidade.com.br', 'Visualização'], ['Atendimento', 'atendimento@unidade.com.br', 'Visualização']]) + '<div style="margin-top:var(--sp-4)"><button class="btn btn-outline" type="button" onclick="return false">Adicionar acesso</button></div>', true));
  }
  const THEMES_BASE = [{ id: 'default', label: 'Vinho & Dourado', desc: 'Padrão', bg: 'linear-gradient(135deg,#5E211B,#481712)' }, { id: 'roteiro-light', label: 'Versão Clara', desc: 'Creme + vinho', bg: 'linear-gradient(135deg,#F3E4DC,#9E2E22)' }];
  const THEMES_SAZ = [{ id: 'dia-das-maes', label: 'Dia das Mães', bg: '#E08CB4' }, { id: 'dia-dos-namorados', label: 'Dia dos Namorados', bg: '#C84B5A' }, { id: 'dia-dos-pais', label: 'Dia dos Pais', bg: '#5B9BD5' }, { id: 'outubro-rosa', label: 'Outubro Rosa', bg: '#D88FA5' }, { id: 'novembro-azul', label: 'Novembro Azul', bg: '#2E6FA8' }, { id: 'setembro-amarelo', label: 'Setembro Amarelo', bg: '#F5C342' }];
  const THEME_BASE_IDS = ['default', 'roteiro-dark', 'roteiro-light'];
  function thGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function thSet(k, v) { try { if (v == null || v === '') localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function siteBase() { var b = thGet('laserco_base'); if (b && THEME_BASE_IDS.indexOf(b) >= 0) return b; var o = thGet('laserco_theme'); if (o && THEME_BASE_IDS.indexOf(o) >= 0) return o; return 'default'; }
  function siteAccent() { var a = thGet('laserco_accent'); if (a) return a; var o = thGet('laserco_theme'); if (o && THEME_BASE_IDS.indexOf(o) < 0) return o; return ''; }
  function persistTheme(base, accent) { thSet('laserco_base', base || 'default'); thSet('laserco_accent', accent || ''); thSet('laserco_theme', accent || base || 'default'); }
  function themeOpt(t, kind) { var cur = kind === 'accent' ? siteAccent() : siteBase(); var a = cur === t.id; return '<button type="button" class="theme-opt' + (a ? ' active' : '') + '" data-kind="' + (kind || 'base') + '" data-theme="' + t.id + '"><span class="theme-sw" style="background:' + t.bg + '"></span><span class="theme-opt-l">' + t.label + (t.desc ? '<small>' + t.desc + '</small>' : '') + '</span>' + (a ? '<span class="theme-tag">Ativo</span>' : '') + '</button>'; }
  function bindThemes() { document.querySelectorAll('#painel-view .theme-opt').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.kind === 'accent') { persistTheme(siteBase(), siteAccent() === b.dataset.theme ? '' : b.dataset.theme); } else { persistTheme(b.dataset.theme, siteAccent()); } router(); }); }); }
  function viewAparenciaTema() { setView(card('Tema base do site', 'aparência do site público', '<div class="theme-grid big">' + THEMES_BASE.map(function (t) { return themeOpt(t, 'base'); }).join('') + '</div>', true) + '<p class="painel-sub" style="margin-top:var(--sp-4)">A troca afeta só o site público. Os painéis seguem sempre vinho/dourado. O acento sazonal se mantém sobre a base escolhida.</p>'); bindThemes(); }
  function viewAparenciaSazonais() { setView(card('Acento sazonal', 'combina com a base atual (clara ou escura)', '<div class="theme-grid">' + THEMES_SAZ.map(function (t) { return themeOpt(t, 'accent'); }).join('') + '</div>', true) + '<div style="margin-top:var(--sp-4)"><button type="button" class="painel-export" id="t-reset">Remover acento sazonal</button></div>'); bindThemes(); var r = document.getElementById('t-reset'); if (r) r.addEventListener('click', function () { persistTheme(siteBase(), ''); router(); }); }

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
    'demo': viewDemografico,
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
