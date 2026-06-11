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
  const DET_SKIP = { hasUnidade: 1, whatsappClicked: 1, unidadeId: 1, procedimentoId: 1, curriculoPath: 1 };

  /* ---------------- MENUS ---------------- */
  /* Ícones SVG do menu (stroke currentColor, herdam a cor do link).
     Chaves usadas no campo ico dos itens; emoji não entra no painel. */
  const NAV_ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>',
    leads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6l3.5-7z"/></svg>',
    unidades: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M10 21v-3h4v3"/></svg>',
    trafego: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
    demografico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c.7-3.2 3.2-5 6.2-5s5.5 1.8 6.2 5"/><circle cx="17" cy="9.5" r="2.4"/><path d="M16 15.2c2.6.2 4.6 1.8 5.2 4.3"/></svg>',
    promocoes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>',
    recrutamento: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M3 12.5h18"/></svg>',
    aparencia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 100 18c1.2 0 2-.9 2-2 0-.6-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.4 0-1.1.9-2 2-2h2.3A4.7 4.7 0 0021 9.8C20 5.9 16.3 3 12 3z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1" fill="currentColor"/><circle cx="15" cy="7.5" r="1" fill="currentColor"/></svg>',
    config: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2.2"/><circle cx="8" cy="16" r="2.2"/></svg>',
    edicao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
    ajuda: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.6"/><path d="M5.7 5.7l3.2 3.2M15.1 15.1l3.2 3.2M18.3 5.7l-3.2 3.2M8.9 15.1l-3.2 3.2"/></svg>',
  };
  const MENU_FRANQUEADOR = [
    { id: 'visao-geral', ico: 'home', label: 'Visão Geral' },
    { ico: 'leads', label: 'Leads', children: [
      { id: 'leads-todos', label: 'Todos os leads' },
      { id: 'leads-popup', label: 'Leads do pop-up' },
      { id: 'leads-agendamento', label: 'Leads de agendamento' },
      { id: 'leads-recrutamento', label: 'Leads de recrutamento' },
    ] },
    { ico: 'unidades', label: 'Unidades', children: [
      { id: 'unidades-ranking', label: 'Ranking de unidades' },
      { id: 'unidades-mapa', label: 'Mapa da rede' },
      { id: 'unidades-cadastro', label: 'Cadastro de unidades' },
    ] },
    { ico: 'trafego', label: 'Tráfego e Origem', children: [
      { id: 'trafego-tempo-real', label: 'Tempo real' },
      { id: 'trafego-origem', label: 'Origem dos visitantes' },
      { id: 'trafego-paginas', label: 'Páginas mais visitadas' },
      { id: 'trafego-dispositivos', label: 'Dispositivos' },
    ] },
    { id: 'demo', ico: 'demografico', label: 'Demográfico' },
    { ico: 'promocoes', label: 'Promoções', children: [
      { id: 'promo-ativas', label: 'Promoções ativas' },
      { id: 'promo-cadastrar', label: 'Cadastrar promoção' },
      { id: 'promo-desempenho', label: 'Desempenho por promoção' },
    ] },
    { ico: 'recrutamento', label: 'Recrutamento', children: [
      { id: 'recrut-vagas', label: 'Vagas abertas' },
      { id: 'recrut-candidatos', label: 'Candidatos' },
    ] },
    { ico: 'edicao', label: 'Edição do site', children: [
      { id: 'edicao-banners', label: 'Banners da home' },
      { id: 'edicao-popup', label: 'Pop-up do brinde' },
      { id: 'edicao-sobre', label: 'Bloco Sobre' },
      { id: 'edicao-menu', label: 'Faixa do menu' },
      { id: 'edicao-video', label: 'Vídeo da avaliação' },
      { id: 'edicao-procedimentos', label: 'Procedimentos' },
      { id: 'edicao-unidades', label: 'Fotos das unidades' },
      { id: 'edicao-franqueado', label: 'Página do franqueado' },
    ] },
    { ico: 'aparencia', label: 'Aparência do site', children: [
      { id: 'aparencia-tema', label: 'Tema do site' },
      { id: 'aparencia-sazonais', label: 'Temas sazonais' },
    ] },
    { ico: 'config', label: 'Configurações', children: [
      { id: 'config-usuarios', label: 'Usuários e permissões' },
      { id: 'config-conta', label: 'Conta' },
    ] },
    { id: 'ajuda', ico: 'ajuda', label: 'Ajuda e Suporte' },
  ];
  const MENU_FRANQUEADO = [
    { id: 'visao-geral', ico: 'home', label: 'Visão Geral' },
    { ico: 'leads', label: 'Meus Leads', children: [
      { id: 'leads-todos', label: 'Todos' },
      { id: 'leads-popup', label: 'Pop-up' },
      { id: 'leads-agendamento', label: 'Agendamento' },
    ] },
    { ico: 'trafego', label: 'Desempenho', children: [
      { id: 'desemp-procedimento', label: 'Por procedimento' },
      { id: 'desemp-periodo', label: 'Por período' },
      { id: 'desemp-rede', label: 'Comparação com a rede' },
    ] },
    { ico: 'recrutamento', label: 'Vagas', children: [
      { id: 'recrut-candidatos', label: 'Candidatos da minha unidade' },
    ] },
    { ico: 'demografico', label: 'Equipe', children: [
      { id: 'equipe-logins', label: 'Logins de funcionário' },
    ] },
    { id: 'config-conta', ico: 'config', label: 'Minha conta' },
    { id: 'ajuda', ico: 'ajuda', label: 'Ajuda e Suporte' },
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
    'edicao-banners': 'Banners da home', 'edicao-popup': 'Pop-up do brinde',
    'edicao-sobre': 'Bloco Sobre', 'edicao-menu': 'Faixa do menu',
    'edicao-video': 'Vídeo da avaliação', 'edicao-procedimentos': 'Procedimentos (conteúdo)',
    'edicao-unidades': 'Fotos das unidades', 'edicao-franqueado': 'Página do franqueado',
    'config-conta': 'Minha conta', 'desemp-procedimento': 'Desempenho por procedimento',
    'desemp-periodo': 'Desempenho por período', 'desemp-rede': 'Comparação com a rede',
    'equipe-logins': 'Logins de funcionário', 'ajuda': 'Ajuda e Suporte',
  };
  const VIEW_SUB = {
    'visao-geral': 'Panorama da captação de leads.',
    'leads-todos': 'Todos os contatos capturados pelo site.',
    'leads-popup': 'Contatos que resgataram o brinde no pop-up.',
    'leads-agendamento': 'Solicitações de avaliação pelo agendamento.',
    'leads-recrutamento': 'Candidaturas recebidas pelas vagas.',
    'recrut-candidatos': 'Candidaturas recebidas pelas vagas.',
    'demo': 'Perfil do público, calculado dos leads reais.',
    'config-usuarios': 'Acessos do painel, salvos no banco e válidos no login.',
    'config-conta': 'Seus dados de acesso e perfil.',
    'ajuda': 'Abra chamados de suporte direto para a nossa equipe.',
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
    const temCv = Boolean(d.curriculoPath);
    content.innerHTML =
      '<div class="det-eyebrow">' + esc(TIPO_LABEL[lead.tipo] || lead.tipo) + ' · ' + fmtData(lead.createdAt) + '</div>' +
      '<h3 class="det-title">' + esc(lead.nome) + '</h3>' +
      '<div class="det-grid">' + linhas + '</div>' +
      '<div class="det-field"><label>Status</label><select id="det-status" class="painel-select">' +
        STATUS.map((s) => '<option value="' + s.key + '"' + (s.key === lead.status ? ' selected' : '') + '>' + s.label + '</option>').join('') + '</select></div>' +
      '<div class="det-field"><label>Anotações internas</label><textarea id="det-notas" class="painel-textarea" rows="3" placeholder="Ex.: ligou, pediu retorno amanhã...">' + esc(lead.raw.notas || '') + '</textarea></div>' +
      '<div class="det-actions">' + (wa ? '<a class="btn btn-primary" href="' + wa + '" target="_blank" rel="noopener">Chamar no WhatsApp</a>' : '') +
        (temCv ? '<button class="btn btn-outline" id="det-cv" type="button">Baixar currículo</button>' : '') +
        '<button class="btn btn-outline" id="det-save" type="button">Salvar alterações</button></div>';
    modal.classList.add('visible'); document.body.style.overflow = 'hidden';
    if (temCv) {
      document.getElementById('det-cv').addEventListener('click', async () => {
        const b = document.getElementById('det-cv'); b.disabled = true; b.textContent = 'Gerando link...';
        try {
          const url = await window.LaserAPI.getCurriculoUrl(state.session, d.curriculoPath);
          window.open(url, '_blank', 'noopener');
          b.textContent = 'Baixar currículo'; b.disabled = false;
        } catch (e) {
          b.textContent = 'Currículo indisponível';
          setTimeout(() => { b.textContent = 'Baixar currículo'; b.disabled = false; }, 2500);
        }
      });
    }
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
      '<div class="painel-stub"><div class="painel-stub-ico"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 005 5L22 14l-8 8-2.7-2.7a4 4 0 00-5-5L2 10l8-8 4.7 4.3z" transform="rotate(45 12 12)"/></svg></div>' +
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
  /* Carrega o Leaflet sob demanda (CDN), só quando a tela do mapa abre. */
  var _leafletPromise = null;
  function loadLeaflet() {
    if (window.L) return Promise.resolve();
    if (_leafletPromise) return _leafletPromise;
    _leafletPromise = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      var js = document.createElement('script');
      js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      js.onload = resolve;
      js.onerror = reject;
      document.head.appendChild(js);
    });
    return _leafletPromise;
  }
  function viewUnidadesMapa() {
    var p = topPairs(countBy(state.all.filter(function (l) { return l.uf; }), function (l) { return l.uf; }), 16);
    var us = (window.LaserData && window.LaserData.unidades) || [];
    var totalU = us.length || 70;
    var leadsPorUnidade = countBy(state.all.filter(function (l) { return l.unidadeId; }), function (l) { return l.unidadeId; });
    setView('<div class="painel-kpis">' + kpiCard(p.length, 'Estados com presença', true) + kpiCard(totalU, 'Unidades na rede') + kpiCard(p[0] ? p[0][0] : '-', 'Estado líder') + '</div>' +
      card('Mapa da rede', 'pinos das unidades, com leads por unidade', '<div id="painel-mapa" style="height:460px;border-radius:var(--radius-md);overflow:hidden"></div>', true) +
      '<div class="painel-grid-2" style="margin-top:var(--sp-4)">' + card('Leads por estado', 'distribuição da rede', cv('uf-bar'), true) + card('Concentração por estado', '', rankList(p), true) + '</div>');
    vgChart('uf-bar', barCfg(col0(p), col1(p), false));
    loadLeaflet().then(function () {
      var el = document.getElementById('painel-mapa');
      if (!el || !window.L) return;
      var map = L.map(el, { scrollWheelZoom: false }).setView([-15.6, -50.0], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap', maxZoom: 18,
      }).addTo(map);
      us.forEach(function (u) {
        if (typeof u.lat !== 'number' || typeof u.lng !== 'number') return;
        var n = leadsPorUnidade[u.id] || 0;
        L.circleMarker([u.lat, u.lng], {
          radius: 7 + Math.min(n, 30) / 4,
          color: '#9A6B1E', weight: 2, fillColor: '#C8A064', fillOpacity: 0.85,
        }).addTo(map).bindPopup('<strong>' + esc(u.nome) + '</strong><br>' + esc(u.cidade) + '/' + esc(u.uf) + '<br>' + n + ' lead(s) no período');
      });
    }).catch(function () {
      var el = document.getElementById('painel-mapa');
      if (el) el.innerHTML = '<div class="painel-empty">Não foi possível carregar o mapa (sem internet?).</div>';
    });
  }
  function viewUnidadesCadastro() {
    var us = (window.LaserData && window.LaserData.unidades) || [];
    setView(card('Unidades cadastradas', us.length + ' unidades na rede', tableHTML(['Unidade', 'Cidade', 'Endereço', 'Contato'], us.map(function (u) { return [esc(u.nome), esc(u.cidade) + '/' + esc(u.uf), esc(u.endereco), esc(u.telefone || u.whatsapp || '-')]; })), true));
  }
  /* ---- TRÁFEGO REAL: pageviews coletados pelo site (analytics.js ->
     /api/track -> site_pageviews) e agregados no banco (/api/trafego). ---- */
  function omitKey(obj, key) { var o = {}; Object.keys(obj || {}).forEach(function (k) { if (k !== key) o[k] = obj[k]; }); return o; }
  function pgLabel(p) {
    var MAP = { '/': 'Início', '/index': 'Início', '/procedimentos': 'Procedimentos', '/unidades': 'Unidades', '/agendamento': 'Agendamento', '/vagas': 'Vagas', '/contato': 'Contato', '/franqueado': 'Seja um franqueado', '/blog': 'Blog' };
    var k = String(p).replace(/\.html$/, '').replace(/\/+$/, '') || '/';
    return MAP[k] || k;
  }
  function trafegoVazio() { return '<div class="painel-empty">Coleta de tráfego ativa. Os números aparecem conforme o site recebe visitas (tudo vem do banco; nada de demonstração).</div>'; }
  function loadTrafego() {
    return window.LaserAPI.getTrafego(state.session, 30).catch(function (e) { if (e.status === 401) logout(); return null; });
  }
  function viewTrafegoTempoReal() {
    setView('<div class="painel-empty">Carregando tráfego...</div>');
    loadTrafego().then(function (t) {
      var now = Date.now();
      var horaLeads = state.all.filter(function (l) { return now - new Date(l.createdAt) <= 3600000; }).length;
      if (!t || !t.views) { setView('<div class="painel-kpis">' + kpiCard(horaLeads, 'Leads na última hora', true) + '</div>' + trafegoVazio()); return; }
      setView('<div class="painel-kpis">' + kpiCard(t.online + '<span class="kpi-live"></span>', 'Online agora (5 min)', true) + kpiCard(nf(t.ultimos30min), 'Visitantes (30 min)') + kpiCard(nf(t.visitantesHoje), 'Visitantes hoje') + kpiCard(nf(t.visitantes), 'Visitantes (30 dias)') + kpiCard(horaLeads, 'Leads na última hora') + '</div><div class="painel-grid-2">' + card('Origem dos visitantes', '30 dias, sem navegação interna', cv('tr-orig', true), true) + card('Dispositivos', '30 dias', cv('tr-disp', true), true) + '</div>');
      var op = topPairs(omitKey(t.origens, 'interno'), 8);
      var dp = topPairs(t.dispositivos || {}, 5);
      if (op.length) vgChart('tr-orig', donutCfg(col0(op), col1(op)));
      if (dp.length) vgChart('tr-disp', donutCfg(col0(dp), col1(dp)));
    });
  }
  function viewTrafegoOrigem() {
    setView('<div class="painel-empty">Carregando origem dos visitantes...</div>');
    loadTrafego().then(function (t) {
      var lop = origemPairs(); // origem dos LEADS (registrada no lead, banco)
      var vop = t && t.views ? topPairs(omitKey(t.origens, 'interno'), 10) : [];
      setView('<div class="painel-grid-2">' +
        card('Origem dos visitantes', vop.length ? 'pageviews, 30 dias' : '', vop.length ? cv('o-don', true) : trafegoVazio(), true) +
        card('Ranking de origem (visitantes)', '', rankList(vop), true) + '</div>' +
        '<div class="painel-grid-2" style="margin-top:var(--sp-4)">' + card('Origem dos leads', 'de onde veio quem converteu', rankList(lop), true) + '</div>');
      if (vop.length) vgChart('o-don', donutCfg(col0(vop), col1(vop)));
    });
  }
  function viewTrafegoPaginas() {
    setView('<div class="painel-empty">Carregando páginas...</div>');
    loadTrafego().then(function (t) {
      if (!t || !t.views) { setView(trafegoVazio()); return; }
      var pg = topPairs(t.paginas || {}, 12).map(function (p) { return [pgLabel(p[0]), p[1]]; });
      var rows = pg.map(function (p) { return [p[0], nf(p[1]), Math.round(p[1] / t.views * 100) + '%']; });
      setView('<div class="painel-kpis">' + kpiCard(nf(t.views), 'Visualizações (30 dias)', true) + kpiCard(nf(t.visitantes), 'Visitantes únicos') + kpiCard(nf(t.viewsHoje), 'Visualizações hoje') + '</div>' +
        '<div class="painel-grid-2">' + card('Páginas mais visitadas', 'últimos 30 dias', cv('pg-bar'), true) + card('Detalhe por página', '', tableHTML(['Página', 'Views', '% do total'], rows), true) + '</div>');
      if (pg.length) vgChart('pg-bar', barCfg(col0(pg), col1(pg), true));
    });
  }
  function viewTrafegoDispositivos() {
    setView('<div class="painel-empty">Carregando dispositivos...</div>');
    loadTrafego().then(function (t) {
      if (!t || !t.views) { setView(trafegoVazio()); return; }
      var dp = topPairs(t.dispositivos || {}, 5);
      var total = dp.reduce(function (s, x) { return s + x[1]; }, 0) || 1;
      var pct = function (nome) { var hit = dp.filter(function (x) { return x[0] === nome; })[0]; return Math.round((hit ? hit[1] : 0) / total * 100) + '%'; };
      setView('<div class="painel-kpis">' + kpiCard(pct('Celular'), 'Celular', true) + kpiCard(pct('Desktop'), 'Desktop') + kpiCard(pct('Tablet'), 'Tablet') + '</div>' +
        '<div class="painel-grid-2">' + card('Dispositivos', 'distribuição, 30 dias', cv('d-don', true), true) + card('Navegadores', '30 dias', rankList(topPairs(t.navegadores || {}, 8)), true) + '</div>');
      if (dp.length) vgChart('d-don', donutCfg(col0(dp), col1(dp)));
    });
  }
  /* DEMOGRÁFICO REAL: derivado dos leads do banco. O site não pergunta
     idade/gênero, então: gênero é ESTIMADO pelo primeiro nome (heurística
     pt-BR, rotulada como estimativa) e os demais cortes são horário de
     contato e dia da semana, calculados dos timestamps reais. */
  var FEM_SEM_A = { isabel: 1, raquel: 1, ester: 1, esther: 1, ruth: 1, carmen: 1, ines: 1, beatriz: 1, lais: 1, tais: 1, thais: 1, iris: 1, miriam: 1, mirian: 1, suelen: 1, ellen: 1, helen: 1, nicole: 1, michele: 1, michelle: 1, daniele: 1, danielle: 1, gabrielle: 1, isabelle: 1, joyce: 1, ingrid: 1, kelly: 1, evelyn: 1, yasmin: 1, jasmin: 1, elisabete: 1, rute: 1, edith: 1, liz: 1, denise: 1, simone: 1, viviane: 1, eliane: 1, rosangela: 1, solange: 1, alice: 1, clarice: 1 };
  var MASC_COM_A = { luca: 1, lucca: 1, joshua: 1, nikita: 1, jona: 1, elia: 1, josue: 1 };
  function generoPorNome(nome) {
    var n = String(nome || '').trim().toLowerCase().split(/\s+/)[0]
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!n) return 'Não identificado';
    if (MASC_COM_A[n]) return 'Masculino';
    if (FEM_SEM_A[n]) return 'Feminino';
    if (/a$/.test(n)) return 'Feminino';
    if (/(o|r|s|l|n|m|d|u|i|e)$/.test(n)) return 'Masculino';
    return 'Não identificado';
  }
  function viewDemografico() {
    var leads = state.all;
    if (!leads.length) { setView('<div class="painel-empty">Sem leads ainda. O demográfico é calculado dos leads reais do banco.</div>'); return; }
    var gen = countBy(leads, function (l) { return generoPorNome(l.nome); });
    var gp = topPairs(gen, 3);
    var fem = gen['Feminino'] || 0;
    var HORAS = [['Manhã (6h-12h)', 6, 12], ['Tarde (12h-18h)', 12, 18], ['Noite (18h-24h)', 18, 24], ['Madrugada (0h-6h)', 0, 6]];
    var hor = HORAS.map(function (h) { return [h[0], leads.filter(function (l) { var x = new Date(l.createdAt).getHours(); return x >= h[1] && x < h[2]; }).length]; });
    var DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    var sem = DIAS.map(function (d, i) { return [d, leads.filter(function (l) { return new Date(l.createdAt).getDay() === i; }).length]; });
    var horTop = hor.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
    setView('<div class="painel-kpis">' + kpiCard(Math.round(fem / leads.length * 100) + '%', 'Público feminino (estimado)', true) + kpiCard(horTop[0].split(' ')[0], 'Horário de pico') + kpiCard(nf(leads.length), 'Leads analisados') + '</div>' +
      '<div class="painel-grid-2">' + card('Gênero', 'estimado pelo primeiro nome do lead', cv('demo-gen-don', true), true) + card('Horário de contato', 'quando os leads chegam', cv('demo-hor-bar'), true) + '</div>' +
      card('Dia da semana', 'leads por dia da semana', cv('demo-sem-bar'), true) +
      '<p class="painel-sub" style="margin-top:var(--sp-2)">O site não pergunta idade nem gênero; o gênero acima é estimativa pelo primeiro nome. Idade real entra quando houver coleta (integração com o sistema).</p>');
    vgChart('demo-gen-don', donutCfg(col0(gp), col1(gp)));
    vgChart('demo-hor-bar', barCfg(col0(hor), col1(hor), false));
    vgChart('demo-sem-bar', barCfg(col0(sem), col1(sem), false));
  }
  /* Promoções persistentes (Fase 2): lista salva via /api/promocoes;
     se nunca foi salva, parte das do data.js. */
  async function loadPromos() {
    try {
      var r = await window.LaserAPI.getPromocoes(state.session);
      if (r.promocoes) return r.promocoes;
    } catch (e) { if (e.status === 401) logout(); }
    return ((window.LaserData && window.LaserData.promocoes) || []).slice();
  }
  function viewPromoAtivas() {
    setView('<div class="painel-empty">Carregando promoções...</div>');
    loadPromos().then(function (ps) {
      var podeExcluir = state.session && state.session.user && state.session.user.role === 'franqueador';
      var html = ps.map(function (p, i) { return '<div class="painel-chart-card flush"><div style="font-family:var(--font-accent);font-weight:600">' + esc(p.titulo) + '</div><div style="color:var(--color-accent-pale);font-size:var(--fs-xl);font-family:var(--font-accent);margin:6px 0">' + esc(p.preco || '') + ' <small style="color:var(--color-text-muted);text-decoration:line-through;font-size:0.55em">' + esc(p.precoOriginal || '') + '</small></div><div style="font-size:var(--fs-xs);color:var(--color-text-muted)">Válida até ' + esc(p.valida || '-') + ' · ' + esc(p.desconto || '') + '</div>' + (podeExcluir ? '<button class="painel-act" type="button" data-promo-del="' + i + '" style="margin-top:8px">Encerrar</button>' : '') + '</div>'; }).join('');
      setView('<div class="painel-grid-3">' + (html || '<div class="painel-empty">Sem promoções ativas.</div>') + '</div>');
      document.querySelectorAll('[data-promo-del]').forEach(function (b) {
        b.addEventListener('click', async function () {
          if (!confirm('Encerrar a promoção "' + (ps[Number(b.dataset.promoDel)] || {}).titulo + '"?')) return;
          ps.splice(Number(b.dataset.promoDel), 1);
          try { await window.LaserAPI.savePromocoes(state.session, ps); } catch (e) { if (e.status === 401) return logout(); }
          viewPromoAtivas();
        });
      });
    });
  }
  function viewPromoCadastrar() {
    setView(card('Cadastrar promoção', 'a promoção salva fica disponível para toda a rede', '<div style="display:grid;gap:var(--sp-4);max-width:520px"><div class="det-field"><label>Título</label><input id="promo-titulo" class="painel-input" style="width:100%" placeholder="Ex.: Rejuvenescimento Facial 4D"></div><div class="det-field"><label>Preço promocional</label><input id="promo-preco" class="painel-input" style="width:100%" placeholder="R$ 397"></div><div class="det-field"><label>Preço original (opcional)</label><input id="promo-preco-orig" class="painel-input" style="width:100%" placeholder="R$ 597"></div><div class="det-field"><label>Válida até</label><input id="promo-valida" class="painel-input" type="date" style="width:100%"></div><button class="btn btn-primary" id="promo-salvar" type="button">Salvar promoção</button><div id="promo-msg" style="font-size:var(--fs-sm)"></div></div>', true));
    document.getElementById('promo-salvar').addEventListener('click', async function () {
      var titulo = document.getElementById('promo-titulo').value.trim();
      var msg = document.getElementById('promo-msg');
      if (!titulo) { msg.textContent = 'Informe o título da promoção.'; return; }
      var btn = document.getElementById('promo-salvar');
      btn.disabled = true; btn.textContent = 'Salvando...';
      var ps = await loadPromos();
      ps.unshift({
        titulo: titulo,
        preco: document.getElementById('promo-preco').value.trim(),
        precoOriginal: document.getElementById('promo-preco-orig').value.trim(),
        desconto: '',
        valida: document.getElementById('promo-valida').value,
      });
      try {
        var r = await window.LaserAPI.savePromocoes(state.session, ps);
        msg.textContent = r.mode === 'backend' ? 'Promoção salva. Já aparece em "Promoções ativas".' : 'Salva neste navegador (modo demonstração).';
        document.getElementById('promo-titulo').value = '';
        document.getElementById('promo-preco').value = '';
        document.getElementById('promo-preco-orig').value = '';
        document.getElementById('promo-valida').value = '';
      } catch (e) {
        if (e.status === 401) return logout();
        msg.textContent = e.status === 403 ? 'Só o franqueador pode salvar promoções.' : 'Não foi possível salvar. Tente de novo.';
      }
      btn.disabled = false; btn.textContent = 'Salvar promoção';
    });
  }
  function viewPromoDesempenho() {
    // REAL: leads de promoção (popup do brinde / chatbot) agrupados pelo brinde
    var promoLeads = state.all.filter(function (l) { return (l.raw.dados && l.raw.dados.brinde) || String(l.tipo).indexOf('popup') === 0; });
    if (!promoLeads.length) {
      setView(card('Desempenho por promoção', 'leads gerados pelas promoções (banco)', '<div class="painel-empty">Nenhum lead de promoção ainda. Quando alguém resgatar um brinde no site, aparece aqui.</div>'));
      return;
    }
    var t = topPairs(countBy(promoLeads, function (l) { return (l.raw.dados && l.raw.dados.brinde) || 'Brinde padrão'; }), 8);
    setView('<div class="painel-kpis">' + kpiCard(nf(promoLeads.length), 'Leads de promoção', true) + kpiCard(t[0] ? esc(t[0][0]) : '-', 'Brinde campeão') + '</div>' +
      card('Desempenho por promoção', 'leads gerados, dados reais', cv('pr-bar')));
    vgChart('pr-bar', barCfg(col0(t), col1(t), true));
  }
  /* Vagas com CRUD persistente (reunião Will): criar/apagar pelo painel.
     Lista salva em conteudo.vagas; sem edição salva, vale a do data.js. */
  function viewRecrutVagas() {
    var soLeitura = !(state.session && state.session.user && state.session.user.role === 'franqueador');
    setView('<div class="painel-empty">Carregando vagas...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      var vs = Array.isArray(c.vagas) ? c.vagas.slice() : ((window.LaserData && window.LaserData.vagas) || []).slice();
      function render() {
        var rows = vs.map(function (v, i) {
          return [esc(v.funcao), esc(v.cidade), esc(v.tipo) + ' · ' + esc(v.nivel), v.destaque ? 'Em destaque' : '-',
            soLeitura ? '' : '<button class="painel-act" type="button" data-vg-del="' + i + '">Apagar</button>'];
        });
        setView(card('Vagas abertas', vs.length + ' vaga(s) no site' + (Array.isArray(c.vagas) ? ' (lista editada, salva no banco)' : ''),
          tableHTML(['Função', 'Cidade', 'Regime', 'Status', ''], rows) +
          (soLeitura ? '' :
          '<div class="painel-form" style="margin-top:var(--sp-5)">' +
          '<div class="det-field"><label>Função</label><input id="vg-n-funcao" class="painel-input" style="width:100%" placeholder="Ex.: Esteticista"></div>' +
          '<div class="det-field"><label>Cidade</label><input id="vg-n-cidade" class="painel-input" style="width:100%" placeholder="Ex.: São Paulo, SP"></div>' +
          '<div class="det-field"><label>Regime</label><select id="vg-n-tipo" class="painel-select"><option>CLT</option><option>PJ</option><option>Estágio</option></select></div>' +
          '<div class="det-field"><label>Nível</label><select id="vg-n-nivel" class="painel-select"><option>Júnior</option><option>Pleno</option><option>Sênior</option></select></div>' +
          '<div class="det-field" style="grid-column:1/-1"><label>Descrição</label><textarea id="vg-n-desc" class="painel-textarea" rows="2" style="width:100%"></textarea></div>' +
          '<label class="perm-item" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="vg-n-destaque"> Vaga em destaque</label></div>' +
          '<div class="det-actions"><button class="btn btn-primary" id="vg-n-add" type="button">Adicionar vaga</button>' +
          '<button class="btn btn-outline" id="vg-n-reset" type="button">Voltar às vagas padrão</button>' +
          '<span id="vg-n-msg" style="font-size:var(--fs-sm)"></span></div>'), true));
        if (soLeitura) return;
        document.querySelectorAll('[data-vg-del]').forEach(function (b) {
          b.addEventListener('click', async function () {
            if (!confirm('Apagar a vaga "' + vs[Number(b.dataset.vgDel)].funcao + '"?')) return;
            vs.splice(Number(b.dataset.vgDel), 1);
            await cmsSalvar({ vagas: vs }, document.getElementById('vg-n-msg'));
            c.vagas = vs.slice();
            render();
          });
        });
        document.getElementById('vg-n-add').addEventListener('click', async function () {
          var funcao = document.getElementById('vg-n-funcao').value.trim();
          var cidade = document.getElementById('vg-n-cidade').value.trim();
          var msg = document.getElementById('vg-n-msg');
          if (!funcao || !cidade) { msg.textContent = 'Informe função e cidade.'; return; }
          vs.push({
            id: 'v_' + Date.now().toString(36),
            funcao: funcao,
            cidade: cidade,
            tipo: document.getElementById('vg-n-tipo').value,
            nivel: document.getElementById('vg-n-nivel').value,
            desc: document.getElementById('vg-n-desc').value.trim() || 'Vaga na rede Laser & Co.',
            destaque: document.getElementById('vg-n-destaque').checked,
          });
          await cmsSalvar({ vagas: vs }, msg, this);
          c.vagas = vs.slice();
          render();
        });
        document.getElementById('vg-n-reset').addEventListener('click', async function () {
          await cmsSalvar({ vagas: null }, document.getElementById('vg-n-msg'), this);
          delete c.vagas;
          vs = ((window.LaserData && window.LaserData.vagas) || []).slice();
          render();
        });
      }
      render();
    });
  }
  function roleLabel(r) { return r === 'franqueador' ? 'Franqueador' : 'Franqueado'; }
  function unidadeNomePorId(id) { var u = (window.LaserData && window.LaserData.unidades || []).filter(function (x) { return x.id === id; })[0]; return u ? u.nome + '/' + u.uf : (id ? id : 'Rede toda'); }
  /* USUÁRIOS REAIS: CRUD persistido no banco via /api/usuarios.
     Quem entra aqui consegue logar de verdade no painel. */
  function viewConfigUsuarios() {
    setView('<div class="painel-empty">Carregando usuários...</div>');
    window.LaserAPI.getUsuarios(state.session).then(function (us) {
      var rows = us.map(function (u, i) {
        return [esc(u.nome), esc(u.email), roleLabel(u.role), esc(unidadeNomePorId(u.unidadeId)),
          '<button class="painel-act det" type="button" data-edit="' + i + '">Editar</button> ' +
          '<button class="painel-act" type="button" data-del="' + i + '">Remover</button>'];
      });
      setView('<div class="painel-toolbar" style="justify-content:flex-end"><button class="btn btn-primary" type="button" id="u-novo">+ Convidar usuário</button></div>' +
        '<div id="u-form-box"></div>' +
        card('Usuários do painel', us.length + ' acessos ativos (salvos no banco, valem no login)', tableHTML(['Nome', 'E-mail', 'Perfil', 'Unidade', ''], rows), true));
      var box = document.getElementById('u-form-box');
      function unidadeOptions(sel) { var opt = '<option value="">Rede toda (franqueador)</option>'; (window.LaserData && window.LaserData.unidades || []).slice().sort(function (a, b) { return a.nome.localeCompare(b.nome); }).forEach(function (u) { opt += '<option value="' + u.id + '"' + (u.id === sel ? ' selected' : '') + '>' + esc(u.nome) + ' (' + u.uf + ')</option>'; }); return opt; }
      function openForm(idx) {
        var u = idx == null ? { nome: '', email: '', role: 'franqueado', unidadeId: '' } : us[idx];
        box.innerHTML = card(idx == null ? 'Convidar usuário' : 'Editar usuário', idx == null ? 'a senha definida aqui vale no login' : 'deixe a senha em branco para não trocar',
          '<div class="painel-form"><div class="det-field"><label>Nome</label><input id="uf-nome" class="painel-input" style="width:100%" value="' + esc(u.nome) + '"></div>' +
          '<div class="det-field"><label>E-mail</label><input id="uf-email" class="painel-input" type="email" style="width:100%" value="' + esc(u.email) + '"' + (idx != null ? ' disabled' : '') + '></div>' +
          '<div class="det-field"><label>Perfil</label><select id="uf-role" class="painel-select"><option value="franqueado"' + (u.role === 'franqueado' ? ' selected' : '') + '>Franqueado</option><option value="franqueador"' + (u.role === 'franqueador' ? ' selected' : '') + '>Franqueador</option></select></div>' +
          '<div class="det-field"><label>Unidade</label><select id="uf-uni" class="painel-select">' + unidadeOptions(u.unidadeId) + '</select></div>' +
          '<div class="det-field"><label>Senha (mín. 8 caracteres)</label><input id="uf-senha" class="painel-input" type="text" style="width:100%" placeholder="' + (idx == null ? 'Defina a senha do acesso' : 'Em branco = não trocar') + '"></div></div>' +
          '<div class="det-actions"><button class="btn btn-primary" type="button" id="uf-save">Salvar</button><button class="btn btn-outline" type="button" id="uf-cancel">Cancelar</button><span id="uf-msg" style="font-size:var(--fs-sm)"></span></div>', true);
        document.getElementById('uf-cancel').addEventListener('click', function () { box.innerHTML = ''; });
        document.getElementById('uf-save').addEventListener('click', async function () {
          var msg = document.getElementById('uf-msg');
          var data = {
            nome: document.getElementById('uf-nome').value.trim(),
            email: (idx == null ? document.getElementById('uf-email').value.trim() : u.email),
            role: document.getElementById('uf-role').value,
            unidadeId: document.getElementById('uf-uni').value || null,
          };
          var senha = document.getElementById('uf-senha').value;
          if (senha) data.senha = senha;
          if (idx == null && !senha) { msg.textContent = 'Defina a senha do novo acesso.'; return; }
          var b = document.getElementById('uf-save'); b.disabled = true; b.textContent = 'Salvando...';
          try {
            if (idx == null) await window.LaserAPI.createUsuario(state.session, data);
            else await window.LaserAPI.updateUsuario(state.session, data);
            router();
          } catch (e) {
            if (e.status === 401) return logout();
            var ERROS = { email_ja_existe: 'Já existe acesso com esse e-mail.', senha_curta: 'A senha precisa de pelo menos 8 caracteres.', unidade_obrigatoria: 'Escolha a unidade do franqueado.', ultimo_franqueador: 'É o último franqueador, não dá pra rebaixar.', email_invalido: 'E-mail inválido.', nome_obrigatorio: 'Informe o nome.', sem_banco: 'Banco indisponível no momento.' };
            msg.textContent = ERROS[(e.body || {}).error] || 'Não foi possível salvar. Tente de novo.';
            b.disabled = false; b.textContent = 'Salvar';
          }
        });
      }
      var novo = document.getElementById('u-novo'); if (novo) novo.addEventListener('click', function () { openForm(null); });
      document.querySelectorAll('#painel-view [data-edit]').forEach(function (b) { b.addEventListener('click', function () { openForm(parseInt(b.dataset.edit, 10)); }); });
      document.querySelectorAll('#painel-view [data-del]').forEach(function (b) {
        b.addEventListener('click', async function () {
          var u = us[parseInt(b.dataset.del, 10)];
          if (!confirm('Remover o acesso de ' + u.email + '?')) return;
          try { await window.LaserAPI.deleteUsuario(state.session, u.email); router(); }
          catch (e) {
            if (e.status === 401) return logout();
            alert((e.body || {}).error === 'ultimo_franqueador' ? 'É o último franqueador, não dá pra remover.' : 'Não foi possível remover.');
          }
        });
      });
    }).catch(function (e) {
      if (e.status === 401) return logout();
      setView('<div class="painel-empty">' + (e.status === 403 ? 'Só o franqueador gerencia usuários.' : 'Não foi possível carregar os usuários.') + '</div>');
    });
  }
  /* MINHA CONTA REAL: perfil salvo no banco (/api/conta), inclusive a
     foto (miniatura) e a TROCA DE SENHA (valida a senha atual). */
  function viewConfigConta() {
    var u = state.session.user;
    setView('<div class="painel-empty">Carregando sua conta...</div>');
    window.LaserAPI.getConta(state.session).then(function (conta) {
      var inicial = String(conta.nome || u.nome || u.email || '?').trim().charAt(0).toUpperCase();
      var fotoNova = undefined; // só envia se trocar
      setView(card('Minha conta', 'seus dados, salvos no banco',
        '<div class="acct-head"><div class="acct-avatar" id="acct-avatar">' + (conta.foto ? '' : esc(inicial)) + '</div>' +
          '<div><div class="acct-name">' + esc(conta.nome || u.nome || '-') + '</div><div class="muted">' + roleLabel(u.role) + (u.unidadeId ? ' · ' + esc(unidadeNomePorId(u.unidadeId)) : ' · rede toda') + '</div>' +
          '<label class="btn btn-outline acct-photo-btn" style="margin-top:var(--sp-3)">Alterar foto<input type="file" id="acct-photo" accept="image/jpeg,image/png,image/webp" hidden></label></div></div>' +
        '<div class="painel-form" style="margin-top:var(--sp-5)">' +
          '<div class="det-field"><label>Nome</label><input id="ac-nome" class="painel-input" style="width:100%" value="' + esc(conta.nome || u.nome || '') + '"></div>' +
          '<div class="det-field"><label>E-mail (login)</label><input id="ac-email" class="painel-input" type="email" style="width:100%" value="' + esc(u.email || '') + '" disabled></div>' +
          '<div class="det-field"><label>Telefone</label><input id="ac-fone" class="painel-input" style="width:100%" placeholder="(00) 00000-0000" value="' + esc(conta.telefone || '') + '"></div>' +
          '<div class="det-field"><label>Cargo</label><input id="ac-cargo" class="painel-input" style="width:100%" placeholder="Ex.: Proprietário" value="' + esc(conta.cargo || '') + '"></div>' +
          '<div class="det-field" style="grid-column:1/-1"><label>Observações</label><textarea id="ac-obs" class="painel-textarea" rows="3" style="width:100%" placeholder="Notas internas (opcional)">' + esc(conta.obs || '') + '</textarea></div>' +
        '</div>' +
        '<div class="det-actions"><button class="btn btn-primary" type="button" id="ac-save">Salvar alterações</button><span class="muted" id="ac-msg"></span></div>', true) +
        card('Alterar senha', 'vale no próximo login',
          '<div class="painel-form"><div class="det-field"><label>Senha atual</label><input id="ac-s-atual" class="painel-input" type="password" style="width:100%"></div>' +
          '<div class="det-field"><label>Nova senha (mín. 8)</label><input id="ac-s-nova" class="painel-input" type="password" style="width:100%"></div></div>' +
          '<div class="det-actions"><button class="btn btn-outline" type="button" id="ac-s-save">Trocar senha</button><span class="muted" id="ac-s-msg"></span></div>', true));
      var av = document.getElementById('acct-avatar');
      function pintaFoto(src) { if (av && src) { av.textContent = ''; av.style.backgroundImage = 'url(' + src + ')'; av.style.backgroundSize = 'cover'; av.style.backgroundPosition = 'center'; } }
      pintaFoto(conta.foto);
      var photo = document.getElementById('acct-photo');
      if (photo) photo.addEventListener('change', function () {
        var f = photo.files && photo.files[0]; if (!f) return;
        // reduz para miniatura 96px antes de salvar (cabe no banco)
        var rd = new FileReader();
        rd.onload = function (e) {
          var img = new Image();
          img.onload = function () {
            var c = document.createElement('canvas'); c.width = 96; c.height = 96;
            var ctx = c.getContext('2d');
            var s = Math.min(img.width, img.height);
            ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 96, 96);
            fotoNova = c.toDataURL('image/jpeg', 0.82);
            pintaFoto(fotoNova);
          };
          img.src = e.target.result;
        };
        rd.readAsDataURL(f);
      });
      document.getElementById('ac-save').addEventListener('click', async function () {
        var m = document.getElementById('ac-msg');
        var b = document.getElementById('ac-save'); b.disabled = true; b.textContent = 'Salvando...';
        var payload = {
          nome: document.getElementById('ac-nome').value,
          telefone: document.getElementById('ac-fone').value,
          cargo: document.getElementById('ac-cargo').value,
          obs: document.getElementById('ac-obs').value,
        };
        if (fotoNova !== undefined) payload.foto = fotoNova;
        try { await window.LaserAPI.saveConta(state.session, payload); m.textContent = 'Salvo.'; }
        catch (e) { if (e.status === 401) return logout(); m.textContent = 'Não foi possível salvar.'; }
        b.disabled = false; b.textContent = 'Salvar alterações';
      });
      document.getElementById('ac-s-save').addEventListener('click', async function () {
        var m = document.getElementById('ac-s-msg');
        var atual = document.getElementById('ac-s-atual').value;
        var nova = document.getElementById('ac-s-nova').value;
        if (nova.length < 8) { m.textContent = 'A nova senha precisa de pelo menos 8 caracteres.'; return; }
        var b = document.getElementById('ac-s-save'); b.disabled = true; b.textContent = 'Trocando...';
        try {
          await window.LaserAPI.saveConta(state.session, { senhaAtual: atual, senhaNova: nova });
          m.textContent = 'Senha trocada. Use a nova no próximo login.';
          document.getElementById('ac-s-atual').value = ''; document.getElementById('ac-s-nova').value = '';
        } catch (e) {
          if (e.status === 401) return logout();
          m.textContent = (e.body || {}).error === 'senha_atual_incorreta' ? 'Senha atual incorreta.' : 'Não foi possível trocar a senha.';
        }
        b.disabled = false; b.textContent = 'Trocar senha';
      });
    }).catch(function (e) { if (e.status === 401) return logout(); setView('<div class="painel-empty">Não foi possível carregar a conta.</div>'); });
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
    // REAL: a contagem da rede vem de /api/stats (redePorDia, só números)
    setView('<div class="painel-empty">Carregando comparação com a rede...</div>');
    window.LaserAPI.getStats(state.session).then(function (st) {
      var meus = leadsPorDia(state.all, 14);
      var redeMap = (st && st.redePorDia) || {};
      var unidadesAtivas = Math.max(1, Object.keys((st && st.porUnidade) || {}).length, 1);
      var totalU = (window.LaserData && window.LaserData.unidades || []).length || 70;
      var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
      var redeDias = [];
      for (var i = 13; i >= 0; i--) {
        var d = new Date(hoje.getTime() - i * 86400000);
        var iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        redeDias.push(redeMap[iso] || 0);
      }
      setView(card('Comparação com a rede', 'seus leads/dia vs média por unidade da rede (14 dias, dados reais do banco)', cv('cr-line')) +
        '<p class="painel-sub" style="margin-top:var(--sp-2)">Média = leads de toda a rede divididos pelas ' + totalU + ' unidades.</p>');
      if (document.getElementById('cr-line') && window.Chart) {
        vgChart('cr-line', { type: 'line', data: { labels: meus.map(function (d) { return d.key; }), datasets: [{ label: 'Sua unidade', data: meus.map(function (d) { return d.count; }), borderColor: '#C8A064', borderWidth: 2, tension: 0.35, pointRadius: 0 }, { label: 'Média da rede', data: redeDias.map(function (n) { return Math.round(n / totalU * 100) / 100; }), borderColor: '#9A6B3A', borderWidth: 2, borderDash: [5, 4], tension: 0.35, pointRadius: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#4E1A15', font: { size: 11 }, boxWidth: 12 } } }, scales: { x: { grid: { display: false }, ticks: { color: '#6E4A3A', font: { size: 10 } } }, y: { beginAtZero: true, grid: { color: 'rgba(70,25,20,0.06)' }, ticks: { color: '#6E4A3A', font: { size: 10 } } } } } });
      }
    }).catch(function (e) { if (e.status === 401) logout(); });
  }
  /* EQUIPE REAL: registro da equipe da unidade, persistido no banco
     (/api/equipe). Adição e remoção salvam de verdade. */
  function viewEquipeLogins() {
    setView('<div class="painel-empty">Carregando equipe...</div>');
    window.LaserAPI.getEquipe(state.session).then(function (eq) {
      var rows = eq.map(function (m, i) { return [esc(m.nome), esc(m.email || '-'), esc(m.funcao || '-'), '<button class="painel-act" type="button" data-eq-del="' + i + '">Remover</button>']; });
      setView(card('Equipe da unidade', eq.length + ' pessoa(s) registradas (salvo no banco)',
        (rows.length ? tableHTML(['Nome', 'E-mail', 'Função', ''], rows) : '<div class="painel-empty">Ninguém registrado ainda.</div>') +
        '<div class="painel-form" style="margin-top:var(--sp-4)">' +
        '<div class="det-field"><label>Nome</label><input id="eq-nome" class="painel-input" style="width:100%"></div>' +
        '<div class="det-field"><label>E-mail (opcional)</label><input id="eq-email" class="painel-input" type="email" style="width:100%"></div>' +
        '<div class="det-field"><label>Função</label><input id="eq-funcao" class="painel-input" style="width:100%" placeholder="Ex.: Recepção"></div></div>' +
        '<div class="det-actions"><button class="btn btn-primary" type="button" id="eq-add">Adicionar</button><span id="eq-msg" style="font-size:var(--fs-sm)"></span></div>', true));
      document.getElementById('eq-add').addEventListener('click', async function () {
        var nome = document.getElementById('eq-nome').value.trim();
        var msg = document.getElementById('eq-msg');
        if (!nome) { msg.textContent = 'Informe o nome.'; return; }
        eq.push({ nome: nome, email: document.getElementById('eq-email').value.trim(), funcao: document.getElementById('eq-funcao').value.trim() });
        try { await window.LaserAPI.saveEquipe(state.session, eq); router(); }
        catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Não foi possível salvar.'; }
      });
      document.querySelectorAll('#painel-view [data-eq-del]').forEach(function (b) {
        b.addEventListener('click', async function () {
          if (!confirm('Remover ' + eq[parseInt(b.dataset.eqDel, 10)].nome + ' da equipe?')) return;
          eq.splice(parseInt(b.dataset.eqDel, 10), 1);
          try { await window.LaserAPI.saveEquipe(state.session, eq); router(); }
          catch (e) { if (e.status === 401) return logout(); alert('Não foi possível salvar.'); }
        });
      });
    }).catch(function (e) {
      if (e.status === 401) return logout();
      setView('<div class="painel-empty">Não foi possível carregar a equipe.</div>');
    });
  }
  const THEMES_BASE = [{ id: 'clean', label: 'Cinza & Dourado', desc: 'Padrão (reunião 09/06)', bg: 'linear-gradient(135deg,#FAFAFA,#B08A4F)' }, { id: 'default', label: 'Vinho & Dourado', desc: 'Versão anterior', bg: 'linear-gradient(135deg,#5E211B,#481712)' }];
  const THEMES_SAZ = [{ id: 'dia-das-maes', label: 'Dia das Mães', bg: '#E08CB4' }, { id: 'dia-dos-namorados', label: 'Dia dos Namorados', bg: '#C84B5A' }, { id: 'dia-dos-pais', label: 'Dia dos Pais', bg: '#5B9BD5' }, { id: 'outubro-rosa', label: 'Outubro Rosa', bg: '#D88FA5' }, { id: 'novembro-azul', label: 'Novembro Azul', bg: '#2E6FA8' }, { id: 'setembro-amarelo', label: 'Setembro Amarelo', bg: '#F5C342' }];
  const THEME_BASE_IDS = ['clean', 'default', 'roteiro-dark', 'roteiro-light'];
  function thGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function thSet(k, v) { try { if (v == null || v === '') localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function siteBase() { var b = thGet('laserco_base'); if (b && THEME_BASE_IDS.indexOf(b) >= 0) return b; var o = thGet('laserco_theme'); if (o && THEME_BASE_IDS.indexOf(o) >= 0) return o; return 'clean'; }
  function siteAccent() { var a = thGet('laserco_accent'); if (a) return a; var o = thGet('laserco_theme'); if (o && THEME_BASE_IDS.indexOf(o) < 0) return o; return ''; }
  function persistTheme(base, accent) { thSet('laserco_base', base || 'default'); thSet('laserco_accent', accent || ''); thSet('laserco_theme', accent || base || 'default'); }
  function themeOpt(t, kind) { var cur = kind === 'accent' ? siteAccent() : siteBase(); var a = cur === t.id; return '<button type="button" class="theme-opt' + (a ? ' active' : '') + '" data-kind="' + (kind || 'base') + '" data-theme="' + t.id + '"><span class="theme-sw" style="background:' + t.bg + '"></span><span class="theme-opt-l">' + t.label + (t.desc ? '<small>' + t.desc + '</small>' : '') + '</span>' + (a ? '<span class="theme-tag">Ativo</span>' : '') + '</button>'; }
  function bindThemes() { document.querySelectorAll('#painel-view .theme-opt').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.kind === 'accent') { persistTheme(siteBase(), siteAccent() === b.dataset.theme ? '' : b.dataset.theme); } else { persistTheme(b.dataset.theme, siteAccent()); } router(); }); }); }
  function viewAparenciaTema() { setView(card('Tema base do site', 'aparência do site público', '<div class="theme-grid big">' + THEMES_BASE.map(function (t) { return themeOpt(t, 'base'); }).join('') + '</div>', true) + '<p class="painel-sub" style="margin-top:var(--sp-4)">A troca afeta só o site público. Os painéis seguem sempre vinho/dourado. O acento sazonal se mantém sobre a base escolhida.</p>'); bindThemes(); }
  function viewAparenciaSazonais() { setView(card('Acento sazonal', 'combina com a base atual (clara ou escura)', '<div class="theme-grid">' + THEMES_SAZ.map(function (t) { return themeOpt(t, 'accent'); }).join('') + '</div>', true) + '<div style="margin-top:var(--sp-4)"><button type="button" class="painel-export" id="t-reset">Remover acento sazonal</button></div>'); bindThemes(); var r = document.getElementById('t-reset'); if (r) r.addEventListener('click', function () { persistTheme(siteBase(), ''); router(); }); }

  /* ---------------- EDIÇÃO DO SITE (CMS, reunião Will 09/06) ----------------
     Salva em /api/conteudo (site_config 'conteudo'); o site público aplica
     os overrides via scripts/conteudo.js. Mandar null = voltar ao padrão. */
  function cmsGuard() {
    if (state.session && state.session.user && state.session.user.role === 'franqueador') return true;
    setView('<div class="painel-empty">Só o franqueador edita o conteúdo do site.</div>');
    return false;
  }
  async function cmsSalvar(patch, msgEl, btn) {
    if (btn) { btn.disabled = true; }
    try {
      const r = await window.LaserAPI.saveConteudo(state.session, patch);
      if (msgEl) msgEl.textContent = 'Salvo. O site já reflete a mudança (até 1 min de cache).';
      return r;
    } catch (e) {
      if (e.status === 401) { logout(); return null; }
      if (msgEl) msgEl.textContent = e.status === 403 ? 'Só o franqueador pode salvar.' : 'Não foi possível salvar. Tente de novo.';
      return null;
    } finally { if (btn) btn.disabled = false; }
  }
  function cmsDica(texto) { return '<p class="painel-sub" style="margin:var(--sp-2) 0 0">' + texto + '</p>'; }

  function viewEdicaoPopup() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      setView(card('Pop-up do brinde', 'edita o procedimento do trecho dourado do pop-up',
        '<div style="display:grid;gap:var(--sp-4);max-width:560px">' +
        '<div class="det-field"><label>Procedimento do brinde</label><input id="cms-popup-proc" class="painel-input" style="width:100%" maxlength="60" value="' + esc(c.popupProcedimento || '') + '" placeholder="Rejuvenescimento Facial (padrão)"></div>' +
        '<div>O pop-up mostra: "Uma sessão de <strong style="color:var(--color-accent-pale)">SEU TEXTO</strong> GRÁTIS." O mesmo texto vai no lead e na mensagem de WhatsApp.</div>' +
        '<div class="det-actions"><button class="btn btn-primary" id="cms-popup-save" type="button">Salvar</button>' +
        '<button class="btn btn-outline" id="cms-popup-reset" type="button">Voltar ao padrão</button>' +
        '<span id="cms-popup-msg" style="font-size:var(--fs-sm)"></span></div></div>', true));
      document.getElementById('cms-popup-save').addEventListener('click', function () {
        var v = document.getElementById('cms-popup-proc').value.trim();
        cmsSalvar({ popupProcedimento: v || null }, document.getElementById('cms-popup-msg'), this);
      });
      document.getElementById('cms-popup-reset').addEventListener('click', function () {
        document.getElementById('cms-popup-proc').value = '';
        cmsSalvar({ popupProcedimento: null }, document.getElementById('cms-popup-msg'), this);
      });
    });
  }

  function viewEdicaoBanners() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando banners...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      var banners = Array.isArray(c.heroBanners) ? c.heroBanners.slice() : [];
      function render() {
        var lista = banners.map(function (b, i) {
          return '<div class="painel-chart-card flush" style="display:flex;gap:var(--sp-4);align-items:center">' +
            '<img src="' + esc(b.img) + '" alt="banner ' + (i + 1) + '" style="width:180px;height:84px;object-fit:cover;border-radius:8px;flex-shrink:0">' +
            '<div style="flex:1">Banner ' + (i + 1) + '</div>' +
            '<div style="display:flex;gap:6px">' +
            (i > 0 ? '<button class="painel-act" type="button" data-b-up="' + i + '">▲ subir</button>' : '') +
            '<button class="painel-act" type="button" data-b-del="' + i + '">Remover</button></div></div>';
        }).join('');
        setView(card('Banners da home', banners.length ? banners.length + ' banner(s) enviados, substituem os slides padrão' : 'sem banners enviados, o site mostra os slides padrão',
          (lista || '<div class="painel-empty">Nenhum banner enviado.</div>') +
          '<div style="margin-top:var(--sp-4);display:grid;gap:var(--sp-3);max-width:560px">' +
          '<label class="btn btn-outline" style="justify-content:center">+ Enviar banner<input type="file" id="cms-banner-file" accept="image/jpeg,image/png,image/webp" hidden></label>' +
          cmsDica('A arte é o banner INTEIRO (com seu texto e marcação); por cima só ficam os 2 botões fixos do site. <strong>Tamanho ideal: 1920 x 1080px (paisagem), JPG ou PNG, até 4MB.</strong> Vários banners giram em carrossel.') +
          '<div class="det-actions"><button class="btn btn-outline" id="cms-banner-reset" type="button">Voltar aos slides padrão</button>' +
          '<span id="cms-banner-msg" style="font-size:var(--fs-sm)"></span></div></div>', true));
        document.getElementById('cms-banner-file').addEventListener('change', async function () {
          var f = this.files && this.files[0]; if (!f) return;
          var msg = document.getElementById('cms-banner-msg');
          if (f.size > 4 * 1024 * 1024) { msg.textContent = 'Arquivo acima de 4MB.'; return; }
          msg.textContent = 'Enviando imagem...';
          try {
            var url = await window.LaserAPI.uploadMidia(state.session, f);
            banners.push({ img: url });
            await cmsSalvar({ heroBanners: banners }, msg);
            render();
          } catch (e) {
            if (e.status === 401) return logout();
            msg.textContent = 'Falha no envio. Tente de novo.';
          }
        });
        document.querySelectorAll('[data-b-del]').forEach(function (b) {
          b.addEventListener('click', async function () {
            banners.splice(Number(b.dataset.bDel), 1);
            await cmsSalvar({ heroBanners: banners.length ? banners : null }, document.getElementById('cms-banner-msg'));
            render();
          });
        });
        document.querySelectorAll('[data-b-up]').forEach(function (b) {
          b.addEventListener('click', async function () {
            var i = Number(b.dataset.bUp);
            var tmp = banners[i - 1]; banners[i - 1] = banners[i]; banners[i] = tmp;
            await cmsSalvar({ heroBanners: banners }, document.getElementById('cms-banner-msg'));
            render();
          });
        });
        document.getElementById('cms-banner-reset').addEventListener('click', async function () {
          banners = [];
          await cmsSalvar({ heroBanners: null }, document.getElementById('cms-banner-msg'), this);
          render();
        });
      }
      render();
    });
  }

  function viewEdicaoSobre() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      var s = c.sobre || {};
      setView(card('Bloco "Sobre a Laser & Co" (home)', 'texto oficial + imagem no lugar dos números',
        '<div style="display:grid;gap:var(--sp-4);max-width:640px">' +
        '<div class="det-field"><label>Título</label><input id="cms-sobre-titulo" class="painel-input" style="width:100%" maxlength="80" value="' + esc(s.titulo || '') + '" placeholder="Uma nova era da beleza. (padrão)"></div>' +
        '<div class="det-field"><label>Parágrafo principal</label><textarea id="cms-sobre-lead" class="painel-textarea" rows="3" style="width:100%">' + esc(s.lead || '') + '</textarea></div>' +
        '<div class="det-field"><label>Parágrafo complementar</label><textarea id="cms-sobre-texto" class="painel-textarea" rows="3" style="width:100%">' + esc(s.texto || '') + '</textarea></div>' +
        '<div class="det-field"><label>Imagem ao lado do texto (substitui os cards de números)</label>' +
        (s.imagem ? '<img src="' + esc(s.imagem) + '" style="width:100%;max-width:320px;border-radius:8px;margin-bottom:8px">' : '') +
        '<label class="btn btn-outline" style="justify-content:center;max-width:280px">' + (s.imagem ? 'Trocar imagem' : '+ Enviar imagem') + '<input type="file" id="cms-sobre-img" accept="image/jpeg,image/png,image/webp" hidden></label>' +
        cmsDica('<strong>Tamanho ideal: 900 x 700px, JPG, até 4MB.</strong> Ex.: foto da fachada ou da equipe.') + '</div>' +
        '<label class="perm-item" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="cms-sobre-esconder"' + (s.esconderNumeros ? ' checked' : '') + '> Esconder os cards de números (70 unidades / 15 estados...)</label>' +
        '<div class="det-actions"><button class="btn btn-primary" id="cms-sobre-save" type="button">Salvar</button>' +
        '<button class="btn btn-outline" id="cms-sobre-reset" type="button">Voltar ao padrão</button>' +
        '<span id="cms-sobre-msg" style="font-size:var(--fs-sm)"></span></div></div>', true));
      var imgNova = undefined;
      document.getElementById('cms-sobre-img').addEventListener('change', async function () {
        var f = this.files && this.files[0]; if (!f) return;
        var msg = document.getElementById('cms-sobre-msg');
        if (f.size > 4 * 1024 * 1024) { msg.textContent = 'Arquivo acima de 4MB.'; return; }
        msg.textContent = 'Enviando imagem...';
        try { imgNova = await window.LaserAPI.uploadMidia(state.session, f); msg.textContent = 'Imagem pronta. Clique em Salvar.'; }
        catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Falha no envio.'; }
      });
      document.getElementById('cms-sobre-save').addEventListener('click', function () {
        var novo = {
          titulo: document.getElementById('cms-sobre-titulo').value.trim(),
          lead: document.getElementById('cms-sobre-lead').value.trim(),
          texto: document.getElementById('cms-sobre-texto').value.trim(),
          imagem: imgNova !== undefined ? imgNova : (s.imagem || ''),
          esconderNumeros: document.getElementById('cms-sobre-esconder').checked,
        };
        cmsSalvar({ sobre: novo }, document.getElementById('cms-sobre-msg'), this);
      });
      document.getElementById('cms-sobre-reset').addEventListener('click', function () {
        cmsSalvar({ sobre: null }, document.getElementById('cms-sobre-msg'), this).then(function () { router(); });
      });
    });
  }

  function viewEdicaoMenu() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      var atual = c.menuCor || '';
      var OPCOES = [
        { v: '', label: 'Padrão', desc: 'transparente sobre as fotos, branco ao rolar' },
        { v: 'branco', label: 'Branco fixo', desc: 'faixa branca sempre' },
        { v: 'vinho', label: 'Vinho fixo', desc: 'faixa vinho sempre' },
      ];
      setView(card('Faixa do menu (cabeçalho)', 'cor de fundo do menu em todas as páginas',
        '<div style="display:grid;gap:var(--sp-3);max-width:520px">' +
        OPCOES.map(function (o) {
          return '<label class="perm-item" style="display:flex;gap:10px;align-items:center"><input type="radio" name="cms-menu" value="' + o.v + '"' + (atual === o.v ? ' checked' : '') + '> <strong>' + o.label + '</strong>&nbsp;· ' + o.desc + '</label>';
        }).join('') +
        '<div class="det-actions"><button class="btn btn-primary" id="cms-menu-save" type="button">Salvar</button>' +
        '<span id="cms-menu-msg" style="font-size:var(--fs-sm)"></span></div></div>', true));
      document.getElementById('cms-menu-save').addEventListener('click', function () {
        var sel = document.querySelector('input[name="cms-menu"]:checked');
        cmsSalvar({ menuCor: sel && sel.value ? sel.value : null }, document.getElementById('cms-menu-msg'), this);
      });
    });
  }

  function viewEdicaoVideo() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      setView(card('Vídeo da avaliação (home)', 'aparece ao lado do bloco "Marque sua avaliação", com play automático sem som',
        (c.videoAvaliacao ? '<video src="' + esc(c.videoAvaliacao) + '" controls muted style="width:100%;max-width:420px;border-radius:8px;margin-bottom:var(--sp-4)"></video>' : '<div class="painel-empty">Nenhum vídeo enviado. O bloco fica só com o formulário, como hoje.</div>') +
        '<div style="display:grid;gap:var(--sp-3);max-width:560px;margin-top:var(--sp-3)">' +
        '<label class="btn btn-outline" style="justify-content:center">' + (c.videoAvaliacao ? 'Trocar vídeo' : '+ Enviar vídeo') + '<input type="file" id="cms-video-file" accept="video/mp4,video/webm" hidden></label>' +
        cmsDica('<strong>MP4, vertical ou horizontal, até 50MB.</strong> Ideal: vídeo curto de experiência real de cliente (15 a 60s). Ele roda sem som no site, então precisa funcionar visualmente.') +
        '<div class="det-actions">' + (c.videoAvaliacao ? '<button class="btn btn-outline" id="cms-video-rm" type="button">Remover vídeo</button>' : '') +
        '<span id="cms-video-msg" style="font-size:var(--fs-sm)"></span></div></div>', true));
      document.getElementById('cms-video-file').addEventListener('change', async function () {
        var f = this.files && this.files[0]; if (!f) return;
        var msg = document.getElementById('cms-video-msg');
        if (f.size > 50 * 1024 * 1024) { msg.textContent = 'Vídeo acima de 50MB. Comprima antes de enviar.'; return; }
        msg.textContent = 'Enviando vídeo (' + Math.round(f.size / 1024 / 1024) + 'MB)... não feche a página.';
        try {
          var url = await window.LaserAPI.uploadMidia(state.session, f);
          await cmsSalvar({ videoAvaliacao: url }, msg);
          router();
        } catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Falha no envio. Tente de novo.'; }
      });
      var rm = document.getElementById('cms-video-rm');
      if (rm) rm.addEventListener('click', async function () {
        await cmsSalvar({ videoAvaliacao: null }, document.getElementById('cms-video-msg'), this);
        router();
      });
    });
  }

  function viewEdicaoProcedimentos() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando procedimentos...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      var overrides = c.procedimentos || {};
      var CATS = { estetica: 'Estética a Laser', depilacao: 'Depilação a Laser', ultrassom: 'Ultrassom' };
      var todos = [];
      Object.keys(CATS).forEach(function (cat) {
        ((window.LaserData && window.LaserData.procedimentos && window.LaserData.procedimentos[cat]) || []).forEach(function (p) {
          todos.push({ cat: cat, catLabel: CATS[cat], p: p });
        });
      });
      function listaHTML(filtro) {
        var f = (filtro || '').toLowerCase();
        return todos.filter(function (x) { return !f || x.p.nome.toLowerCase().indexOf(f) >= 0; }).map(function (x) {
          var ov = overrides[x.p.id];
          return '<div class="painel-chart-card flush" style="display:flex;gap:var(--sp-3);align-items:center">' +
            '<div style="flex:1"><strong>' + esc(x.p.nome) + '</strong><br><small class="muted">' + x.catLabel + (ov ? ' · editado' : '') + '</small></div>' +
            '<button class="painel-act det" type="button" data-pe="' + esc(x.p.id) + '">Editar</button></div>';
        }).join('') || '<div class="painel-empty">Nenhum procedimento com esse nome.</div>';
      }
      function tela() {
        setView('<div class="painel-toolbar"><input id="pe-busca" class="painel-input" style="flex:1;max-width:380px" placeholder="Buscar procedimento..."></div>' +
          '<div id="pe-form"></div><div id="pe-lista">' + listaHTML('') + '</div>');
        document.getElementById('pe-busca').addEventListener('input', function () {
          document.getElementById('pe-lista').innerHTML = listaHTML(this.value);
          bindEditar();
        });
        bindEditar();
      }
      function bindEditar() {
        document.querySelectorAll('[data-pe]').forEach(function (b) {
          b.addEventListener('click', function () { abrirForm(b.dataset.pe); });
        });
      }
      function abrirForm(id) {
        var item = todos.filter(function (x) { return x.p.id === id; })[0];
        if (!item) return;
        var ov = overrides[id] || {};
        var box = document.getElementById('pe-form');
        box.innerHTML = card('Editar: ' + esc(item.p.nome), item.catLabel,
          '<div style="display:grid;gap:var(--sp-4);max-width:640px">' +
          '<div class="det-field"><label>Descrição curta (card)</label><textarea id="pe-sub" class="painel-textarea" rows="2" style="width:100%" placeholder="' + esc(item.p.sub || '') + '">' + esc(ov.sub || '') + '</textarea></div>' +
          '<div class="det-field"><label>Foto</label>' + (ov.img || item.p.img ? '<img src="' + esc(ov.img || item.p.img) + '" style="width:200px;border-radius:8px;margin-bottom:6px">' : '') +
          '<label class="btn btn-outline" style="justify-content:center;max-width:240px">Trocar foto<input type="file" id="pe-img" accept="image/jpeg,image/png,image/webp" hidden></label>' +
          cmsDica('<strong>Ideal: 800 x 600px, JPG.</strong>') + '</div>' +
          '<div class="det-field"><label>Vídeo do card (autoplay sem som)</label>' +
          '<label class="btn btn-outline" style="justify-content:center;max-width:240px">' + (ov.video || item.p.video ? 'Trocar vídeo' : '+ Enviar vídeo') + '<input type="file" id="pe-video" accept="video/mp4,video/webm" hidden></label>' +
          '<label class="perm-item" style="display:flex;gap:8px;align-items:center;margin-top:6px"><input type="checkbox" id="pe-sem-video"' + (ov.video === '' ? ' checked' : '') + '> Tirar o vídeo deste procedimento</label>' +
          cmsDica('<strong>MP4 até 50MB.</strong> Curto (10 a 30s).') + '</div>' +
          '<div class="det-actions"><button class="btn btn-primary" id="pe-save" type="button">Salvar</button>' +
          '<button class="btn btn-outline" id="pe-reset" type="button">Voltar ao padrão</button>' +
          '<button class="btn btn-outline" id="pe-cancel" type="button">Fechar</button>' +
          '<span id="pe-msg" style="font-size:var(--fs-sm)"></span></div></div>', true);
        box.scrollIntoView({ behavior: 'smooth' });
        var imgNova, videoNovo;
        document.getElementById('pe-img').addEventListener('change', async function () {
          var f = this.files && this.files[0]; if (!f) return;
          var msg = document.getElementById('pe-msg'); msg.textContent = 'Enviando foto...';
          try { imgNova = await window.LaserAPI.uploadMidia(state.session, f); msg.textContent = 'Foto pronta. Clique em Salvar.'; }
          catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Falha no envio da foto.'; }
        });
        document.getElementById('pe-video').addEventListener('change', async function () {
          var f = this.files && this.files[0]; if (!f) return;
          var msg = document.getElementById('pe-msg');
          if (f.size > 50 * 1024 * 1024) { msg.textContent = 'Vídeo acima de 50MB.'; return; }
          msg.textContent = 'Enviando vídeo (' + Math.round(f.size / 1024 / 1024) + 'MB)...';
          try { videoNovo = await window.LaserAPI.uploadMidia(state.session, f); msg.textContent = 'Vídeo pronto. Clique em Salvar.'; }
          catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Falha no envio do vídeo.'; }
        });
        document.getElementById('pe-cancel').addEventListener('click', function () { box.innerHTML = ''; });
        document.getElementById('pe-reset').addEventListener('click', async function () {
          delete overrides[id];
          await cmsSalvar({ procedimentos: overrides }, document.getElementById('pe-msg'), this);
          tela();
        });
        document.getElementById('pe-save').addEventListener('click', async function () {
          var novo = {};
          var sub = document.getElementById('pe-sub').value.trim();
          if (sub) novo.sub = sub;
          if (imgNova) novo.img = imgNova; else if (ov.img) novo.img = ov.img;
          if (document.getElementById('pe-sem-video').checked) novo.video = '';
          else if (videoNovo) novo.video = videoNovo; else if (ov.video) novo.video = ov.video;
          if (Object.keys(novo).length) overrides[id] = novo; else delete overrides[id];
          await cmsSalvar({ procedimentos: overrides }, document.getElementById('pe-msg'), this);
          tela();
        });
      }
      tela();
    });
  }

  function viewEdicaoUnidades() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando unidades...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      var fotos = c.unidadesFotos || {};
      var us = ((window.LaserData && window.LaserData.unidades) || []).slice().sort(function (a, b) { return a.nome.localeCompare(b.nome); });
      function listaHTML(filtro) {
        var f = (filtro || '').toLowerCase();
        return us.filter(function (u) { return !f || (u.nome + ' ' + u.cidade + ' ' + u.uf).toLowerCase().indexOf(f) >= 0; }).map(function (u) {
          var foto = fotos[u.id] !== undefined ? fotos[u.id] : (u.foto || '');
          return '<div class="painel-chart-card flush" style="display:flex;gap:var(--sp-3);align-items:center">' +
            (foto ? '<img src="' + esc(foto) + '" style="width:110px;height:62px;object-fit:cover;border-radius:6px;flex-shrink:0">' : '<div style="width:110px;height:62px;border-radius:6px;background:var(--color-surface);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0">sem foto</div>') +
            '<div style="flex:1"><strong>' + esc(u.nome) + '</strong><br><small class="muted">' + esc(u.cidade) + '/' + esc(u.uf) + (fotos[u.id] !== undefined ? ' · editada' : '') + '</small></div>' +
            '<label class="painel-act det" style="cursor:pointer">Trocar foto<input type="file" data-uf="' + esc(u.id) + '" accept="image/jpeg,image/png,image/webp" hidden></label>' +
            (fotos[u.id] !== undefined ? '<button class="painel-act" type="button" data-uf-reset="' + esc(u.id) + '">Padrão</button>' : '') +
            '</div>';
        }).join('');
      }
      function tela() {
        setView('<div class="painel-toolbar"><input id="uf-busca" class="painel-input" style="flex:1;max-width:380px" placeholder="Buscar unidade..."><span id="uf-msg" style="font-size:var(--fs-sm)"></span></div>' +
          cmsDica('<strong>Foto da fachada REAL da unidade (regra da marca: nunca imagem genérica). Ideal: 1200 x 800px, JPG, até 4MB.</strong>') +
          '<div id="uf-lista" style="margin-top:var(--sp-3)">' + listaHTML('') + '</div>');
        document.getElementById('uf-busca').addEventListener('input', function () {
          document.getElementById('uf-lista').innerHTML = listaHTML(this.value);
          bind();
        });
        bind();
      }
      function bind() {
        document.querySelectorAll('input[data-uf]').forEach(function (inp) {
          inp.addEventListener('change', async function () {
            var f = inp.files && inp.files[0]; if (!f) return;
            var msg = document.getElementById('uf-msg'); msg.textContent = 'Enviando foto...';
            try {
              var url = await window.LaserAPI.uploadMidia(state.session, f);
              fotos[inp.dataset.uf] = url;
              await cmsSalvar({ unidadesFotos: fotos }, msg);
              tela();
            } catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Falha no envio.'; }
          });
        });
        document.querySelectorAll('[data-uf-reset]').forEach(function (b) {
          b.addEventListener('click', async function () {
            delete fotos[b.dataset.ufReset];
            await cmsSalvar({ unidadesFotos: fotos }, document.getElementById('uf-msg'), this);
            tela();
          });
        });
      }
      tela();
    });
  }

  /* ---------------- AJUDA E SUPORTE ----------------
     Embute o widget de chamados do nosso sistema de suporte (SupraDesk).
     O cliente abre ticket sem sair do painel. */
  var SUPORTE_EMBED = 'https://supradesk.vercel.app/embed/support/751b2d91-d709-452c-a5cc-31c4e59a10c5';
  function viewAjuda() {
    state.presetTipos = null;
    setView(card('Ajuda e suporte', 'abra um chamado direto para a nossa equipe',
      '<p class="painel-sub" style="margin:0 0 var(--sp-4)">Precisa de ajuda, encontrou um problema ou quer sugerir algo? Use o formulário abaixo para abrir um chamado. Nossa equipe recebe na hora e responde por aqui.</p>' +
      '<iframe src="' + SUPORTE_EMBED + '" title="Suporte" loading="lazy" style="width:100%;height:72vh;min-height:640px;border:0;border-radius:12px;background:#FFFFFF"></iframe>', true));
  }

  function viewEdicaoFranqueado() {
    if (!cmsGuard()) return;
    setView('<div class="painel-empty">Carregando...</div>');
    window.LaserAPI.getConteudo().then(function (c) {
      setView(card('Banner do topo (hero)', 'arte inteira de fundo do topo da página de franquia',
        (c.franqueadoBanner ? '<img src="' + esc(c.franqueadoBanner) + '" style="width:100%;max-width:420px;border-radius:8px;margin-bottom:var(--sp-3)">' : '<div class="painel-empty">Sem banner enviado; o site usa a foto padrão da recepção.</div>') +
        '<div style="display:grid;gap:var(--sp-3);max-width:560px;margin-bottom:var(--sp-5)">' +
        '<label class="btn btn-outline" style="justify-content:center;max-width:280px">' + (c.franqueadoBanner ? 'Trocar banner' : '+ Enviar banner') + '<input type="file" id="cms-fr-banner" accept="image/jpeg,image/png,image/webp" hidden></label>' +
        cmsDica('<strong>Tamanho ideal: 1920 x 1080px (paisagem), JPG ou PNG, até 4MB.</strong>') +
        '<div class="det-actions">' + (c.franqueadoBanner ? '<button class="btn btn-outline" id="cms-fr-banner-rm" type="button">Voltar ao padrão</button>' : '') + '</div></div>', true) +
        card('Foto da fachada (Posicionamento único)', 'imagem à direita do bloco "A única rede com 3 frentes"',
        '<img src="' + esc(c.franqueadoFachada || 'assets/img/unidades/botafogo-praia-shopping-rio-de-janeiro-rj.jpg') + '" style="width:100%;max-width:380px;border-radius:8px;margin-bottom:var(--sp-3)">' +
        '<div style="display:grid;gap:var(--sp-3);max-width:560px">' +
        '<label class="btn btn-outline" style="justify-content:center;max-width:280px">Trocar foto<input type="file" id="cms-fr-fachada" accept="image/jpeg,image/png,image/webp" hidden></label>' +
        cmsDica('<strong>Foto REAL de fachada (regra da marca). Ideal: 1200 x 900px, JPG, até 4MB.</strong>') +
        '<div class="det-actions">' + (c.franqueadoFachada ? '<button class="btn btn-outline" id="cms-fr-reset" type="button">Voltar ao padrão</button>' : '') +
        '<span id="cms-fr-msg" style="font-size:var(--fs-sm)"></span></div></div>', true));
      document.getElementById('cms-fr-fachada').addEventListener('change', async function () {
        var f = this.files && this.files[0]; if (!f) return;
        var msg = document.getElementById('cms-fr-msg'); msg.textContent = 'Enviando foto...';
        try {
          var url = await window.LaserAPI.uploadMidia(state.session, f);
          await cmsSalvar({ franqueadoFachada: url }, msg);
          router();
        } catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Falha no envio.'; }
      });
      var rs = document.getElementById('cms-fr-reset');
      if (rs) rs.addEventListener('click', async function () {
        await cmsSalvar({ franqueadoFachada: null }, document.getElementById('cms-fr-msg'), this);
        router();
      });
      document.getElementById('cms-fr-banner').addEventListener('change', async function () {
        var f = this.files && this.files[0]; if (!f) return;
        var msg = document.getElementById('cms-fr-msg'); msg.textContent = 'Enviando banner...';
        try {
          var url = await window.LaserAPI.uploadMidia(state.session, f);
          await cmsSalvar({ franqueadoBanner: url }, msg);
          router();
        } catch (e) { if (e.status === 401) return logout(); msg.textContent = 'Falha no envio.'; }
      });
      var rb = document.getElementById('cms-fr-banner-rm');
      if (rb) rb.addEventListener('click', async function () {
        await cmsSalvar({ franqueadoBanner: null }, document.getElementById('cms-fr-msg'), this);
        router();
      });
    });
  }

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
    'edicao-banners': viewEdicaoBanners,
    'edicao-popup': viewEdicaoPopup,
    'edicao-sobre': viewEdicaoSobre,
    'edicao-menu': viewEdicaoMenu,
    'edicao-video': viewEdicaoVideo,
    'edicao-procedimentos': viewEdicaoProcedimentos,
    'edicao-unidades': viewEdicaoUnidades,
    'edicao-franqueado': viewEdicaoFranqueado,
    'ajuda': viewAjuda,
  };

  /* ---------------- sidebar + roteador ---------------- */
  function renderSidebar() {
    const nav = document.getElementById('painel-nav'); if (!nav) return;
    const menu = state.mode === 'franqueado' ? MENU_FRANQUEADO : MENU_FRANQUEADOR;
    nav.innerHTML = menu.map((g) => {
      if (g.children) {
        return '<div class="painel-nav-group" data-group>' +
          '<button class="painel-nav-head" type="button"><span class="painel-nav-ico">' + (NAV_ICONS[g.ico] || '') + '</span><span class="painel-nav-label">' + g.label + '</span><span class="painel-nav-caret">▸</span></button>' +
          '<div class="painel-nav-sub">' + g.children.map((c) => '<a class="painel-nav-link" href="#' + c.id + '" data-view="' + c.id + '">' + c.label + '</a>').join('') + '</div></div>';
      }
      return '<div class="painel-nav-group"><a class="painel-nav-link" href="#' + g.id + '" data-view="' + g.id + '"><span class="painel-nav-ico">' + (NAV_ICONS[g.ico] || '') + '</span><span class="painel-nav-label">' + g.label + '</span></a></div>';
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
