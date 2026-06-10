/* ============================================================
   STORE, camada de dados dos LEADS (e candidatos)
   ============================================================

   >>>>>>>>>>  PONTO DE TROCA PARA O BANCO DE PRODUÇÃO  <<<<<<<<<<

   Hoje funciona em TRÊS modos, escolhidos automaticamente:

   1) MODO SUPABASE (produção atual; envs SUPABASE_URL + SUPABASE_SERVICE_KEY)
      Usa a API REST do Supabase (PostgREST) com a service key.
      Tabela: site_leads (id text PK, data jsonb, created_at).
      Sem dependência npm (fetch nativo do Node 18+) e sem precisar
      da senha do Postgres (o banco é compartilhado com o sistema
      unificado; NÃO resetar a senha dele).
      Env opcional: SUPABASE_LEADS_TABLE (padrão 'site_leads').

   2) MODO POSTGRES (alternativa; env DATABASE_URL)
      Driver pg via connection string. Para ligar:
        a) Colar a connection string na env DATABASE_URL.
        b) Rodar:  npm i pg
        c) Criar a tabela (DDL em BACKEND.md).

   3) MODO DEMO (padrão, sem env nenhuma)
      Guarda os leads em memória, partindo do seed (api/_lib/seed.js).
      ATENÇÃO: não persiste de verdade entre instâncias/deploys.
      Serve só para testar a API e os painéis antes de existir banco.

   Toda a aplicação fala apenas com getStore(); para trocar de
   banco no futuro, basta escrever outro adaptador aqui.
   ============================================================ */

const seed = require('./seed');

/* ---------- Adaptador 1: memória (modo demo) ---------- */
let _memory = null;
function memoryStore() {
  if (!_memory) _memory = seed.leads.slice();
  return {
    mode: 'demo',
    async list() { return _memory.slice(); },
    async create(lead) { _memory.unshift(lead); return lead; },
    async update(id, patch) {
      const i = _memory.findIndex((l) => l.id === id);
      if (i < 0) return null;
      _memory[i] = Object.assign({}, _memory[i], patch);
      return _memory[i];
    },
  };
}

/* ---------- Adaptador 2: Supabase REST (produção) ---------- */
function supabaseStore() {
  const base = String(process.env.SUPABASE_URL).replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_KEY;
  const table = process.env.SUPABASE_LEADS_TABLE || 'site_leads';
  const rest = base + '/rest/v1/' + table;
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
  };
  return {
    mode: 'supabase',
    async list() {
      const r = await fetch(rest + '?select=data&order=created_at.desc&limit=1000', { headers });
      if (!r.ok) throw new Error('supabase_list_http_' + r.status);
      const rows = await r.json();
      return rows.map((row) => row.data);
    },
    async create(lead) {
      const r = await fetch(rest + '?on_conflict=id', {
        method: 'POST',
        headers: Object.assign({ Prefer: 'resolution=ignore-duplicates' }, headers),
        body: JSON.stringify({ id: lead.id, data: lead }),
      });
      if (!r.ok) throw new Error('supabase_create_http_' + r.status);
      return lead;
    },
    async update(id, patch) {
      const g = await fetch(rest + '?select=data&id=eq.' + encodeURIComponent(id), { headers });
      if (!g.ok) throw new Error('supabase_get_http_' + g.status);
      const rows = await g.json();
      if (!rows.length) return null;
      const merged = Object.assign({}, rows[0].data, patch);
      const u = await fetch(rest + '?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ data: merged }),
      });
      if (!u.ok) throw new Error('supabase_update_http_' + u.status);
      return merged;
    },
  };
}

/* ---------- Adaptador 3: Postgres via driver pg (alternativa) ---------- */
let _pool = null;
function postgresStore() {
  // require tardio: o pacote 'pg' só é necessário em produção.
  const { Pool } = require('pg');
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  const pool = _pool;
  return {
    mode: 'postgres',
    async list() {
      const r = await pool.query('SELECT data FROM leads ORDER BY created_at DESC LIMIT 1000');
      return r.rows.map((row) => row.data);
    },
    async create(lead) {
      await pool.query(
        'INSERT INTO leads (id, data, created_at) VALUES ($1, $2, now()) ON CONFLICT (id) DO NOTHING',
        [lead.id, lead]
      );
      return lead;
    },
    async update(id, patch) {
      const r = await pool.query('SELECT data FROM leads WHERE id = $1', [id]);
      if (!r.rows.length) return null;
      const merged = Object.assign({}, r.rows[0].data, patch);
      await pool.query('UPDATE leads SET data = $2 WHERE id = $1', [id, merged]);
      return merged;
    },
  };
}

function getStore() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      return supabaseStore();
    } catch (e) {
      console.error('[store] Supabase indisponível, caindo para memória:', e && e.message);
      return memoryStore();
    }
  }
  if (process.env.DATABASE_URL) {
    try {
      return postgresStore();
    } catch (e) {
      console.error('[store] Postgres indisponível, caindo para memória:', e && e.message);
      return memoryStore();
    }
  }
  return memoryStore();
}

module.exports = { getStore };
