/* ============================================================
   /api/leads
   - POST  (público): cria um lead vindo do site. Sem auth.
   - GET   (Bearer):  lista leads. Franqueador vê tudo;
                      franqueado vê só os da própria unidade.
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('./_lib/http');
const { getStore } = require('./_lib/store');

function normalizeIncoming(body) {
  return {
    id: body.id || ('lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)),
    tipo: body.tipo || 'desconhecido',
    dados: body.dados || {},
    status: body.status || null,
    origem: body.origem || 'site',
    url: body.url || '',
    timestamp: body.timestamp || new Date().toISOString(),
  };
}

module.exports = async (req, res) => {
  const store = getStore();

  if (req.method === 'POST') {
    const body = await readBody(req);
    if (!body || (!body.tipo && !body.dados)) return sendJson(res, 400, { error: 'payload_invalido' });
    const lead = normalizeIncoming(body);
    try {
      await store.create(lead);
    } catch (e) {
      console.error('[leads] erro ao criar:', e && e.message);
      return sendJson(res, 500, { error: 'erro_ao_salvar' });
    }
    return sendJson(res, 201, { ok: true, id: lead.id });
  }

  if (req.method === 'GET') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    let all;
    try {
      all = await store.list();
    } catch (e) {
      console.error('[leads] erro ao listar:', e && e.message);
      return sendJson(res, 500, { error: 'erro_ao_listar' });
    }
    if (auth.role === 'franqueado' && auth.unidadeId) {
      all = all.filter((l) => l && l.dados && l.dados.unidadeId === auth.unidadeId);
    }
    return sendJson(res, 200, { leads: all });
  }

  return sendJson(res, 405, { error: 'metodo_nao_permitido' });
};
