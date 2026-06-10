/* ============================================================
   /api/promocoes  (CRUD persistente das promoções do painel)
   - GET (Bearer): { promocoes } — lista salva no banco, ou null
     quando nunca foi salva (o painel então usa as do data.js).
   - PUT (Bearer, SÓ franqueador): substitui a lista completa.
     Itens: { titulo, preco, precoOriginal, desconto, valida }.
   Persistência: tabela site_config (key 'promocoes'); em demo
   (sem Supabase) vale só durante a instância.
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('./_lib/http');
const { getConfig, setConfig } = require('./_lib/config');

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;

  if (req.method === 'GET') {
    try {
      const promocoes = await getConfig('promocoes');
      return sendJson(res, 200, { promocoes: promocoes });
    } catch (e) {
      console.error('[promocoes] erro ao ler:', e && e.message);
      return sendJson(res, 500, { error: 'erro_ao_ler' });
    }
  }

  if (req.method === 'PUT') {
    if (auth.role !== 'franqueador') return sendJson(res, 403, { error: 'sem_permissao' });
    const body = await readBody(req);
    const lista = body && body.promocoes;
    if (!Array.isArray(lista)) return sendJson(res, 400, { error: 'payload_invalido' });
    const limpa = lista.slice(0, 50).map((p) => ({
      titulo: String((p && p.titulo) || '').slice(0, 120),
      preco: String((p && p.preco) || '').slice(0, 40),
      precoOriginal: String((p && p.precoOriginal) || '').slice(0, 40),
      desconto: String((p && p.desconto) || '').slice(0, 40),
      valida: String((p && p.valida) || '').slice(0, 40),
    })).filter((p) => p.titulo);
    try {
      await setConfig('promocoes', limpa);
      return sendJson(res, 200, { ok: true, promocoes: limpa });
    } catch (e) {
      console.error('[promocoes] erro ao salvar:', e && e.message);
      return sendJson(res, 500, { error: 'erro_ao_salvar' });
    }
  }

  return sendJson(res, 405, { error: 'metodo_nao_permitido' });
};
