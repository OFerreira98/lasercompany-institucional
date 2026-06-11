/* POST /api/auth/login  ->  { email, senha }  =>  { token, user }
   Proteção contra força bruta: máx. 5 falhas por e-mail+IP a cada
   10 minutos (contador em memória, por instância; melhor esforço
   no serverless, suficiente para desencorajar tentativa manual). */
const { readBody, sendJson } = require('../_lib/http');
const { authenticate, createToken } = require('../_lib/auth');

const MAX_FALHAS = 5;
const JANELA_MS = 10 * 60 * 1000;
const _tentativas = new Map(); // chave email|ip -> { count, first }

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'sem-ip';
}
function bloqueado(chave) {
  const t = _tentativas.get(chave);
  if (!t) return false;
  if (Date.now() - t.first > JANELA_MS) { _tentativas.delete(chave); return false; }
  return t.count >= MAX_FALHAS;
}
function registraFalha(chave) {
  const t = _tentativas.get(chave);
  if (!t || Date.now() - t.first > JANELA_MS) {
    _tentativas.set(chave, { count: 1, first: Date.now() });
  } else {
    t.count += 1;
  }
  if (_tentativas.size > 5000) _tentativas.clear(); // não crescer sem limite
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  const body = await readBody(req);
  const chave = String(body.email || '').toLowerCase().slice(0, 120) + '|' + clientIp(req);
  if (bloqueado(chave)) return sendJson(res, 429, { error: 'muitas_tentativas' });
  const user = await authenticate(body.email, body.senha);
  if (!user) {
    registraFalha(chave);
    return sendJson(res, 401, { error: 'credenciais_invalidas' });
  }
  _tentativas.delete(chave);
  const token = createToken(user);
  return sendJson(res, 200, { token, user });
};
