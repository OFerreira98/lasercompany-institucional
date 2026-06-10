/* ============================================================
   CONFIG-STORE, pequenos documentos de configuração do painel
   (ex.: lista de promoções). Tabela: public.site_config
   (key text PK, data jsonb, updated_at). Mesma lógica do store
   de leads: com SUPABASE_URL+SUPABASE_SERVICE_KEY usa o banco;
   sem, cai para memória (modo demo, não persiste).
   ============================================================ */

let _memory = {};

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_KEY;
  return {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
  };
}
function restUrl() {
  return String(process.env.SUPABASE_URL).replace(/\/+$/, '') + '/rest/v1/site_config';
}
function hasSupabase() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

async function getConfig(key) {
  if (!hasSupabase()) return _memory[key] !== undefined ? _memory[key] : null;
  const r = await fetch(restUrl() + '?select=data&key=eq.' + encodeURIComponent(key), {
    headers: supabaseHeaders(),
  });
  if (!r.ok) throw new Error('config_get_http_' + r.status);
  const rows = await r.json();
  return rows.length ? rows[0].data : null;
}

async function setConfig(key, value) {
  if (!hasSupabase()) { _memory[key] = value; return value; }
  const r = await fetch(restUrl() + '?on_conflict=key', {
    method: 'POST',
    headers: Object.assign({ Prefer: 'resolution=merge-duplicates' }, supabaseHeaders()),
    body: JSON.stringify({ key: key, data: value, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error('config_set_http_' + r.status);
  return value;
}

module.exports = { getConfig, setConfig, hasSupabase };
