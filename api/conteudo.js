/* ============================================================
   /api/conteudo  (CMS do site, reunião Will 09/06/2026)
   - GET (público): { conteudo } com os overrides editados no
     painel (popup, banners da home, faixa do menu, sobre, ...).
     O site aplica por cima dos padrões do data.js.
   - PUT (Bearer, SÓ franqueador): merge raso { chave: valor }.
     Mandar uma chave com null remove o override (volta ao padrão).
   Persistência: site_config, chave 'conteudo'.
   ============================================================ */
const { readBody, sendJson, requireAuth, getToken } = require('./_lib/http');
const { verifyToken } = require('./_lib/auth');
const { getConfig, setConfig } = require('./_lib/config');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const conteudo = (await getConfig('conteudo')) || {};
      // cache curtinho: o conteúdo muda pouco, mas edição precisa refletir rápido
      res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.end(JSON.stringify({ conteudo: conteudo }));
    } catch (e) {
      console.error('[conteudo] erro ao ler:', e && e.message);
      return sendJson(res, 200, { conteudo: {} }); // site nunca quebra por causa do CMS
    }
  }

  if (req.method === 'PUT') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    if (auth.role !== 'franqueador') return sendJson(res, 403, { error: 'sem_permissao' });
    const body = await readBody(req);
    const patch = body && body.conteudo;
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
      return sendJson(res, 400, { error: 'payload_invalido' });
    }
    try {
      const atual = (await getConfig('conteudo')) || {};
      Object.keys(patch).forEach((k) => {
        if (patch[k] === null) delete atual[k];
        else atual[k] = patch[k];
      });
      await setConfig('conteudo', atual);
      return sendJson(res, 200, { ok: true, conteudo: atual });
    } catch (e) {
      console.error('[conteudo] erro ao salvar:', e && e.message);
      return sendJson(res, 500, { error: 'erro_ao_salvar' });
    }
  }

  return sendJson(res, 405, { error: 'metodo_nao_permitido' });
};
