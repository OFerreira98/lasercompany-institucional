/* ============================================================
   /api/usuarios  (Bearer, SÓ franqueador)
   CRUD dos usuários do painel, persistido no banco (site_config,
   chave 'usuarios'). O login (auth.js) consulta o banco primeiro;
   se a lista nunca foi salva, valem os usuários da env/demo.
   - GET            => { usuarios } (sem senhaHash)
   - POST           => cria { email, nome, role, unidadeId, senha }
   - PATCH          => edita por email ({ nome?, role?, unidadeId?, senha? })
   - DELETE ?email= => remove (nunca o último franqueador)
   Na PRIMEIRA escrita, a lista atual (env/demo) vira a base, para
   os logins existentes continuarem funcionando.
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('../_lib/http');
const { getConfig, setConfig, hasSupabase } = require('../_lib/config');
const { gerarHash, USERS } = require('../_lib/auth');

function publicos(list) {
  return (list || []).map((u) => ({ email: u.email, nome: u.nome, role: u.role, unidadeId: u.unidadeId || null }));
}
async function carregar() {
  const salvos = await getConfig('usuarios');
  if (Array.isArray(salvos) && salvos.length) return salvos;
  // base inicial: usuários atuais (env PAINEL_USERS ou demo)
  return USERS.map((u) => ({ email: u.email, nome: u.nome, role: u.role, unidadeId: u.unidadeId || null, senhaHash: u.senhaHash }));
}
function validar(u) {
  if (!u.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(u.email)) return 'email_invalido';
  if (!u.nome) return 'nome_obrigatorio';
  if (u.role !== 'franqueador' && u.role !== 'franqueado') return 'role_invalido';
  if (u.role === 'franqueado' && !u.unidadeId) return 'unidade_obrigatoria';
  return null;
}

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;
  if (auth.role !== 'franqueador') return sendJson(res, 403, { error: 'sem_permissao' });
  if (!hasSupabase() && req.method !== 'GET') return sendJson(res, 503, { error: 'sem_banco' });

  try {
    const lista = await carregar();

    if (req.method === 'GET') {
      return sendJson(res, 200, { usuarios: publicos(lista) });
    }

    if (req.method === 'POST') {
      const b = await readBody(req);
      const novo = {
        email: String(b.email || '').toLowerCase().trim().slice(0, 120),
        nome: String(b.nome || '').trim().slice(0, 80),
        role: b.role === 'franqueador' ? 'franqueador' : 'franqueado',
        unidadeId: b.unidadeId ? String(b.unidadeId).slice(0, 80) : null,
      };
      const erro = validar(novo);
      if (erro) return sendJson(res, 400, { error: erro });
      if (lista.some((u) => u.email.toLowerCase() === novo.email)) return sendJson(res, 409, { error: 'email_ja_existe' });
      const senha = String(b.senha || '').slice(0, 80);
      if (senha.length < 8) return sendJson(res, 400, { error: 'senha_curta' });
      novo.senhaHash = gerarHash(senha);
      lista.push(novo);
      await setConfig('usuarios', lista);
      return sendJson(res, 201, { ok: true, usuario: publicos([novo])[0] });
    }

    if (req.method === 'PATCH') {
      const b = await readBody(req);
      const email = String(b.email || '').toLowerCase().trim();
      const i = lista.findIndex((u) => u.email.toLowerCase() === email);
      if (i < 0) return sendJson(res, 404, { error: 'nao_encontrado' });
      const u = lista[i];
      if (b.nome !== undefined) u.nome = String(b.nome).trim().slice(0, 80);
      if (b.role !== undefined) u.role = b.role === 'franqueador' ? 'franqueador' : 'franqueado';
      if (b.unidadeId !== undefined) u.unidadeId = b.unidadeId ? String(b.unidadeId).slice(0, 80) : null;
      if (b.senha !== undefined) {
        if (String(b.senha).length < 8) return sendJson(res, 400, { error: 'senha_curta' });
        u.senhaHash = gerarHash(String(b.senha).slice(0, 80));
      }
      const erro = validar(u);
      if (erro) return sendJson(res, 400, { error: erro });
      if (u.role !== 'franqueador' && !lista.some((x, j) => j !== i && x.role === 'franqueador')) {
        return sendJson(res, 400, { error: 'ultimo_franqueador' });
      }
      await setConfig('usuarios', lista);
      return sendJson(res, 200, { ok: true, usuario: publicos([u])[0] });
    }

    if (req.method === 'DELETE') {
      const email = String((req.query && req.query.email) || new URL(req.url, 'http://x').searchParams.get('email') || '').toLowerCase().trim();
      const i = lista.findIndex((u) => u.email.toLowerCase() === email);
      if (i < 0) return sendJson(res, 404, { error: 'nao_encontrado' });
      if (lista[i].role === 'franqueador' && !lista.some((x, j) => j !== i && x.role === 'franqueador')) {
        return sendJson(res, 400, { error: 'ultimo_franqueador' });
      }
      lista.splice(i, 1);
      await setConfig('usuarios', lista);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  } catch (e) {
    console.error('[usuarios] erro:', e && e.message);
    return sendJson(res, 500, { error: 'erro_interno' });
  }
};
