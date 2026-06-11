/* ============================================================
   /api/equipe  (Bearer)
   Registro da equipe da unidade (nome, e-mail, função), persistido
   em site_config na chave 'equipe:<unidadeId>'.
   - Franqueado: lê/grava a própria unidade.
   - Franqueador: pode passar ?unidadeId= para qualquer unidade.
   - GET  => { equipe: [...] }
   - PUT  => substitui a lista { equipe: [{nome, email, funcao}] }
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('../_lib/http');
const { getConfig, setConfig } = require('../_lib/config');

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;

  let unidadeId = auth.unidadeId;
  if (auth.role === 'franqueador') {
    unidadeId = (req.query && req.query.unidadeId) ||
      new URL(req.url, 'http://x').searchParams.get('unidadeId') || unidadeId;
  }
  if (!unidadeId) return sendJson(res, 400, { error: 'unidade_obrigatoria' });
  const key = 'equipe:' + String(unidadeId).slice(0, 80);

  try {
    if (req.method === 'GET') {
      const equipe = await getConfig(key);
      return sendJson(res, 200, { equipe: Array.isArray(equipe) ? equipe : [] });
    }
    if (req.method === 'PUT') {
      const b = await readBody(req);
      if (!Array.isArray(b.equipe)) return sendJson(res, 400, { error: 'payload_invalido' });
      const limpa = b.equipe.slice(0, 40).map((m) => ({
        nome: String((m && m.nome) || '').trim().slice(0, 80),
        email: String((m && m.email) || '').trim().slice(0, 120),
        funcao: String((m && m.funcao) || '').trim().slice(0, 60),
      })).filter((m) => m.nome);
      await setConfig(key, limpa);
      return sendJson(res, 200, { ok: true, equipe: limpa });
    }
    return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  } catch (e) {
    console.error('[equipe] erro:', e && e.message);
    return sendJson(res, 500, { error: 'erro_interno' });
  }
};
