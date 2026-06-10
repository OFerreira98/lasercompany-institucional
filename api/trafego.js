/* ============================================================
   GET /api/trafego?dias=30  (Bearer)
   Métricas REAIS de tráfego do site, agregadas no banco pela
   função site_trafego_stats (tabela site_pageviews).
   Sem Supabase: { trafego: null } e o painel mostra estado vazio.
   ============================================================ */
const { sendJson, requireAuth } = require('./_lib/http');
const { hasSupabase } = require('./_lib/config');

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  if (!hasSupabase()) return sendJson(res, 200, { trafego: null });
  let dias = parseInt((req.query && req.query.dias) || new URL(req.url, 'http://x').searchParams.get('dias') || '30', 10);
  if (!(dias > 0 && dias <= 365)) dias = 30;
  try {
    const base = String(process.env.SUPABASE_URL).replace(/\/+$/, '');
    const key = process.env.SUPABASE_SERVICE_KEY;
    const r = await fetch(base + '/rest/v1/rpc/site_trafego_stats', {
      method: 'POST',
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ dias: dias }),
    });
    if (!r.ok) throw new Error('rpc_http_' + r.status);
    const trafego = await r.json();
    return sendJson(res, 200, { trafego: trafego });
  } catch (e) {
    console.error('[trafego] erro:', e && e.message);
    return sendJson(res, 500, { error: 'erro_ao_agregar' });
  }
};
