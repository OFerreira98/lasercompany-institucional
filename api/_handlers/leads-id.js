/* ============================================================
   PATCH /api/leads/:id   (Bearer)
   Atualiza status / notas de um lead.
   Franqueado só pode alterar leads da própria unidade.
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('../_lib/http');
const { getStore } = require('../_lib/store');

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  }

  const id = (req.query && req.query.id) || String(req.url || '').split('?')[0].split('/').pop();
  const body = await readBody(req);
  const patch = {};
  if (body.status !== undefined) patch.status = body.status;
  if (body.notas !== undefined) patch.notas = body.notas;
  if (!Object.keys(patch).length) return sendJson(res, 400, { error: 'nada_para_atualizar' });

  const store = getStore();
  let updated;
  try {
    updated = await store.update(id, patch);
  } catch (e) {
    console.error('[leads/:id] erro ao atualizar:', e && e.message);
    return sendJson(res, 500, { error: 'erro_ao_atualizar' });
  }
  if (!updated) return sendJson(res, 404, { error: 'nao_encontrado' });

  if (auth.role === 'franqueado' && auth.unidadeId &&
      updated.dados && updated.dados.unidadeId !== auth.unidadeId) {
    return sendJson(res, 403, { error: 'sem_permissao' });
  }

  return sendJson(res, 200, { ok: true, lead: updated });
};
