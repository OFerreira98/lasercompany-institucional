/* ============================================================
   ROTEADOR ÚNICO DA API  (1 serverless function pra tudo)
   ============================================================
   O plano Hobby da Vercel limita a 12 functions por deploy e a
   API passou de 16 endpoints. Este catch-all é a ÚNICA function:
   despacha cada rota pro handler correspondente em api/_handlers/
   (pastas com _ não viram function). Endpoint novo = adicionar o
   módulo em _handlers e UMA linha no mapa abaixo.

   Detalhe importante: o Vercel injeta os segmentos da rota em
   req.query.path, o que COLIDIRIA com query params chamados
   "path" (ex.: GET /api/curriculos?path=...). Por isso o roteador
   captura os segmentos e REMOVE req.query.path antes de despachar;
   os handlers que precisam releem o próprio query do req.url.
   ============================================================ */

const ROTAS = {
  'auth/login': require('./_handlers/auth-login'),
  'auth/me': require('./_handlers/auth-me'),
  'leads': require('./_handlers/leads'),
  'stats': require('./_handlers/stats'),
  'health': require('./_handlers/health'),
  'curriculos': require('./_handlers/curriculos'),
  'promocoes': require('./_handlers/promocoes'),
  'track': require('./_handlers/track'),
  'trafego': require('./_handlers/trafego'),
  'usuarios': require('./_handlers/usuarios'),
  'equipe': require('./_handlers/equipe'),
  'conta': require('./_handlers/conta'),
  'sac': require('./_handlers/sac'),
  'conteudo': require('./_handlers/conteudo'),
  'midia': require('./_handlers/midia'),
};
const leadsId = require('./_handlers/leads-id');

module.exports = async (req, res) => {
  // Os segmentos podem vir em req.query.path (array OU string "a/b").
  // Fallback robusto: extrai do próprio req.url.
  let segs = (req.query && req.query.path) || [];
  if (typeof segs === 'string') segs = segs.split('/').filter(Boolean);
  if (!segs.length) {
    const pathname = String(req.url || '').split('?')[0];
    segs = pathname.replace(/^\/?api\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  }
  if (req.query) delete req.query.path; // não colidir com ?path= dos handlers
  const rota = segs.join('/');

  try {
    // /api/leads/:id  (PATCH de status/notas)
    if (segs[0] === 'leads' && segs.length === 2) {
      req.query = req.query || {};
      req.query.id = decodeURIComponent(segs[1]);
      return await leadsId(req, res);
    }
    const handler = ROTAS[rota];
    if (handler) return await handler(req, res);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ error: 'rota_nao_encontrada' }));
  } catch (e) {
    console.error('[api] erro na rota', rota, ':', e && e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ error: 'erro_interno' }));
  }
};
