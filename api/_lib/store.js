/* ============================================================
   STORE, camada de dados dos LEADS (e candidatos)
   ============================================================

   >>>>>>>>>>  PONTO DE TROCA PARA O BANCO DE PRODUÇÃO  <<<<<<<<<<

   Hoje funciona em DOIS modos, escolhidos automaticamente:

   1) MODO DEMO (padrão, sem configurar nada)
      Guarda os leads em memória, partindo do seed (api/_lib/seed.js).
      ATENÇÃO: não persiste de verdade entre instâncias/deploys.
      Serve só para testar a API e os painéis antes de existir banco.

   2) MODO PRODUÇÃO (quando existe a variável DATABASE_URL)
      Usa Postgres. Para ligar:
        a) Criar um Postgres no Marketplace da Vercel (ex.: Neon).
        b) Colar a connection string na env DATABASE_URL.
        c) Rodar:  npm i pg
        d) Criar a tabela (DDL em BACKEND.md).
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

/* ---------- Adaptador 2: Postgres (produção) ---------- */
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
