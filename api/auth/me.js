/* GET /api/auth/me  (Bearer token)  =>  { user } */
const { sendJson, requireAuth } = require('../_lib/http');

module.exports = async (req, res) => {
  const p = requireAuth(req, res);
  if (!p) return;
  return sendJson(res, 200, {
    user: { email: p.sub, role: p.role, unidadeId: p.unidadeId, nome: p.nome },
  });
};
