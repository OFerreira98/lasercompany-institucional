/* ============================================================
   API-CLIENT, ponte entre os painéis e o backend
   ============================================================
   Funciona em dois modos automaticamente:
   - BACKEND: se a API /api responder, usa o servidor (dados reais,
     multiusuário, multi-dispositivo).
   - DEMO: se a API não estiver disponível (ex.: abrindo o arquivo
     local, ou antes de ligar o banco), cai para o localStorage:
     mostra os leads capturados neste navegador + um seed de exemplo.
   Assim o painel é testável HOJE e "só funciona" quando o banco
   de produção for ligado, sem mudar o código do painel.
   ============================================================ */

window.LaserAPI = (function () {
  const BASE = '/api';
  const OVERRIDES_KEY = 'laserco_panel_overrides';

  /* Usuários de teste, espelham api/_lib/auth.js. Trocar em produção. */
  const DEMO_USERS = [
    { email: 'franqueador@laserco.com.br', senha: 'laser2026', nome: 'Matriz Laser & Co', role: 'franqueador', unidadeId: null },
    { email: 'vmariana@laserco.com.br',    senha: 'laser2026', nome: 'Franquia Vila Mariana', role: 'franqueado', unidadeId: 'sp-vmariana' },
    { email: 'ipanema@laserco.com.br',     senha: 'laser2026', nome: 'Franquia Ipanema',      role: 'franqueado', unidadeId: 'rj-ipanema' },
  ];

  async function tryFetch(path, opts) {
    const res = await fetch(BASE + path, opts);
    if (!res.ok) {
      const err = new Error('http_' + res.status);
      err.status = res.status;
      try { err.body = await res.json(); } catch (e) {}
      throw err;
    }
    return res.json();
  }

  /* ---------- overrides locais (status/notas no modo demo) ---------- */
  function getOverrides() {
    try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveOverride(id, patch) {
    try {
      const all = getOverrides();
      all[id] = Object.assign({}, all[id], patch);
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
    } catch (e) {}
  }

  /* ---------- montagem da base demo (localStorage + seed) ---------- */
  function demoLeads(session) {
    const captured = (window.LaserAnalytics && window.LaserAnalytics.getLeads()) || [];
    const seed = (window.LaserPainelData && window.LaserPainelData.seed()) || [];
    // Evita duplicar por id
    const byId = {};
    seed.concat(captured).forEach((l) => { if (l && l.id) byId[l.id] = l; });
    let list = Object.keys(byId).map((k) => byId[k]);

    // aplica overrides locais
    const ov = getOverrides();
    list = list.map((l) => (ov[l.id] ? Object.assign({}, l, ov[l.id]) : l));

    // ordena por data desc
    list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // franqueado só vê a própria unidade
    if (session && session.user && session.user.role === 'franqueado' && session.user.unidadeId) {
      list = list.filter((l) => l && l.dados && l.dados.unidadeId === session.user.unidadeId);
    }
    return list;
  }

  /* ---------- API pública ---------- */
  async function login(email, senha) {
    try {
      const j = await tryFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, senha: senha }),
      });
      return { token: j.token, user: j.user, mode: 'backend' };
    } catch (e) {
      if (e.status === 401) { const err = new Error('credenciais'); err.code = 'credenciais'; throw err; }
      if (e.status === 429) { const err = new Error('muitas_tentativas'); err.code = 'muitas_tentativas'; throw err; }
      // sem backend (offline/local) -> valida contra usuários demo
      const u = DEMO_USERS.find((x) =>
        x.email.toLowerCase() === String(email || '').toLowerCase() && x.senha === senha);
      if (!u) { const err = new Error('credenciais'); err.code = 'credenciais'; throw err; }
      const user = { email: u.email, nome: u.nome, role: u.role, unidadeId: u.unidadeId };
      return { token: 'demo.' + btoa(unescape(encodeURIComponent(JSON.stringify(user)))), user: user, mode: 'demo' };
    }
  }

  async function listLeads(session) {
    try {
      const j = await tryFetch('/leads', { headers: { Authorization: 'Bearer ' + session.token } });
      // storeMode vem do servidor: 'supabase'/'postgres' = banco real; 'demo' = memória.
      // Servidor antigo (sem storeMode) continua contando como backend.
      const mode = j.storeMode === 'demo' ? 'demo' : 'backend';
      return { leads: j.leads || [], mode: mode };
    } catch (e) {
      if (e.status === 401) throw e;
      return { leads: demoLeads(session), mode: 'demo' };
    }
  }

  async function updateLead(session, id, patch) {
    try {
      const j = await tryFetch('/leads/' + encodeURIComponent(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.token },
        body: JSON.stringify(patch),
      });
      return { lead: j.lead, mode: 'backend' };
    } catch (e) {
      if (e.status === 401 || e.status === 403) throw e;
      saveOverride(id, patch);
      return { lead: null, mode: 'demo' };
    }
  }

  /* ---------- promoções (CRUD persistente, Fase 2) ---------- */
  const PROMO_DEMO_KEY = 'laserco_promocoes_demo';
  async function getPromocoes(session) {
    try {
      const j = await tryFetch('/promocoes', { headers: { Authorization: 'Bearer ' + session.token } });
      if (j.promocoes) return { promocoes: j.promocoes, mode: 'backend' };
    } catch (e) { if (e.status === 401) throw e; }
    try {
      const local = JSON.parse(localStorage.getItem(PROMO_DEMO_KEY) || 'null');
      if (local) return { promocoes: local, mode: 'demo' };
    } catch (e) {}
    return { promocoes: null, mode: 'demo' }; // null = usar as do data.js
  }
  async function savePromocoes(session, lista) {
    try {
      const j = await tryFetch('/promocoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.token },
        body: JSON.stringify({ promocoes: lista }),
      });
      return { promocoes: j.promocoes, mode: 'backend' };
    } catch (e) {
      if (e.status === 401 || e.status === 403) throw e;
      try { localStorage.setItem(PROMO_DEMO_KEY, JSON.stringify(lista)); } catch (er) {}
      return { promocoes: lista, mode: 'demo' };
    }
  }

  /* ---------- currículo (upload público + download assinado) ---------- */
  function uploadCurriculo(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve(null);
      reader.onload = async () => {
        try {
          const base64 = String(reader.result).split(',')[1] || '';
          const j = await tryFetch('/curriculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: file.name, mime: file.type, base64: base64 }),
          });
          resolve(j.path || null);
        } catch (e) { resolve(null); }
      };
      reader.readAsDataURL(file);
    });
  }
  async function getCurriculoUrl(session, path) {
    const j = await tryFetch('/curriculos?path=' + encodeURIComponent(path), {
      headers: { Authorization: 'Bearer ' + session.token },
    });
    return j.url;
  }

  return {
    login: login, listLeads: listLeads, updateLead: updateLead,
    getPromocoes: getPromocoes, savePromocoes: savePromocoes,
    uploadCurriculo: uploadCurriculo, getCurriculoUrl: getCurriculoUrl,
    DEMO_USERS: DEMO_USERS,
  };
})();
