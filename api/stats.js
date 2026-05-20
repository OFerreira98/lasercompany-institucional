/* GET /api/stats  (Bearer)  =>  métricas agregadas dos leads */
const { sendJson, requireAuth } = require('./_lib/http');
const { getStore } = require('./_lib/store');

function count(arr, fn) {
  const o = {};
  arr.forEach((x) => { const k = fn(x) || '-'; o[k] = (o[k] || 0) + 1; });
  return o;
}

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;

  let all;
  try { all = await getStore().list(); }
  catch (e) { return sendJson(res, 500, { error: 'erro_ao_listar' }); }

  if (auth.role === 'franqueado' && auth.unidadeId) {
    all = all.filter((l) => l && l.dados && l.dados.unidadeId === auth.unidadeId);
  }

  const inicioHoje = new Date(); inicioHoje.setHours(0, 0, 0, 0);
  const stats = {
    total: all.length,
    hoje: all.filter((l) => new Date(l.timestamp) >= inicioHoje).length,
    porTipo: count(all, (l) => l.tipo),
    porStatus: count(all, (l) => l.status || 'novo'),
    porUnidade: count(all, (l) => (l.dados && l.dados.unidadeNome) || 'Sem unidade'),
  };
  return sendJson(res, 200, { stats });
};
