/* ============================================================
   AUTH, autenticação dos painéis (sem dependências externas)
   ============================================================
   - Token assinado com HMAC-SHA256 (módulo crypto nativo).
   - Usuários de DEMO embutidos (franqueador + franqueados).
   >>> PONTO DE TROCA PARA PRODUÇÃO <<<
     1) Trocar a lista USERS por uma tabela no banco.
     2) Definir as variáveis de ambiente:
        - AUTH_SECRET  (segredo forte para assinar os tokens)
        - senhas reais (gerar hash com gerarHash() abaixo).
   A senha padrão de teste de TODOS os usuários demo é: laser2026
   ============================================================ */

const crypto = require('crypto');

const AUTH_SECRET = process.env.AUTH_SECRET || 'laserco-dev-secret-trocar-em-producao';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

function sha256(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex');
}

/* Helper para gerar o hash de uma senha nova (uso manual ao cadastrar). */
function gerarHash(senha) {
  return sha256(senha);
}

/* Usuários de DEMO. senha de teste: laser2026 */
const USERS = [
  { email: 'franqueador@laserco.com.br', nome: 'Matriz Laser & Co', role: 'franqueador', unidadeId: null, senhaHash: sha256('laser2026') },
  { email: 'vmariana@laserco.com.br',    nome: 'Franquia Vila Mariana', role: 'franqueado', unidadeId: 'sp-vmariana', senhaHash: sha256('laser2026') },
  { email: 'ipanema@laserco.com.br',     nome: 'Franquia Ipanema',      role: 'franqueado', unidadeId: 'rj-ipanema',  senhaHash: sha256('laser2026') },
];

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(str) {
  return Buffer.from(String(str).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
}
function sign(payloadStr) {
  return b64url(crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest());
}

function createToken(user) {
  const payload = {
    sub: user.email,
    role: user.role,
    unidadeId: user.unidadeId || null,
    nome: user.nome,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const p = b64url(JSON.stringify(payload));
  return p + '.' + sign(p);
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || token.indexOf('.') < 0) return null;
  const idx = token.lastIndexOf('.');
  const p = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  if (sign(p) !== sig) return null;
  let payload;
  try { payload = JSON.parse(fromB64url(p)); } catch (e) { return null; }
  if (!payload || !payload.exp || Date.now() > payload.exp) return null;
  return payload;
}

function authenticate(email, senha) {
  const u = USERS.find(x => x.email.toLowerCase() === String(email || '').toLowerCase());
  if (!u) return null;
  const given = sha256(senha || '');
  const a = Buffer.from(given);
  const b = Buffer.from(u.senhaHash);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  return { email: u.email, nome: u.nome, role: u.role, unidadeId: u.unidadeId };
}

module.exports = { createToken, verifyToken, authenticate, gerarHash, USERS };
