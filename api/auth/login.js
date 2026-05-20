/* POST /api/auth/login  ->  { email, senha }  =>  { token, user } */
const { readBody, sendJson } = require('../_lib/http');
const { authenticate, createToken } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  const body = await readBody(req);
  const user = authenticate(body.email, body.senha);
  if (!user) return sendJson(res, 401, { error: 'credenciais_invalidas' });
  const token = createToken(user);
  return sendJson(res, 200, { token, user });
};
