/* ============================================================
   GET /api/health  (público)
   Diz em que modo o backend está, SEM expor nada sensível.
   - store: 'supabase' | 'postgres' | 'demo'
   - usuariosReais: true quando PAINEL_USERS está configurado
   O painel usa isso para esconder o selo "Demonstração" e o
   bloco de acessos de teste quando a produção está ligada.
   ============================================================ */
const { sendJson } = require('../_lib/http');
const { getStore } = require('../_lib/store');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  let mode = 'demo';
  try { mode = getStore().mode || 'demo'; } catch (e) {}
  return sendJson(res, 200, {
    ok: true,
    store: mode,
    usuariosReais: Boolean(process.env.PAINEL_USERS),
  });
};
