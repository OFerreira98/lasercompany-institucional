/* ============================================================
   HTTP, utilitários compartilhados das funções da API
   ============================================================ */

const { verifyToken } = require('./auth');

/* Lê o corpo da requisição como JSON (cobre o caso de o Vercel
   já ter parseado em req.body e o caso de stream cru). */
function readBody(req) {
  return new Promise((resolve) => {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'string') {
        try { resolve(JSON.parse(req.body)); } catch (e) { resolve({}); }
      } else {
        resolve(req.body);
      }
      return;
    }
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

function getToken(req) {
  const h = req.headers['authorization'] || req.headers['Authorization'] || '';
  if (typeof h === 'string' && h.indexOf('Bearer ') === 0) return h.slice(7);
  return null;
}

/* Garante que há um token válido. Responde 401 e retorna null se não. */
function requireAuth(req, res) {
  const payload = verifyToken(getToken(req));
  if (!payload) { sendJson(res, 401, { error: 'nao_autorizado' }); return null; }
  return payload;
}

module.exports = { readBody, sendJson, getToken, requireAuth };
