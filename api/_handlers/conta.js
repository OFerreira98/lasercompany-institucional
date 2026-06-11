/* ============================================================
   /api/conta  (Bearer)
   Perfil do PRÓPRIO usuário logado, salvo no banco (site_config,
   chave 'conta:<email>'): nome, telefone, cargo, observações e
   foto (data URL pequena). Também troca a própria senha (valida a
   senha atual e grava o novo hash na lista de usuários do banco).
   - GET => { conta }
   - PUT => { nome?, telefone?, cargo?, obs?, foto?,
              senhaAtual?, senhaNova? }
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('../_lib/http');
const { getConfig, setConfig, hasSupabase } = require('../_lib/config');
const { authenticate, gerarHash, USERS } = require('../_lib/auth');

const FOTO_MAX = 200 * 1024; // ~200KB em data URL

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;
  const email = String(auth.sub || '').toLowerCase();
  const key = 'conta:' + email;

  try {
    if (req.method === 'GET') {
      const conta = (await getConfig(key)) || {};
      return sendJson(res, 200, { conta: conta });
    }

    if (req.method === 'PUT') {
      if (!hasSupabase()) return sendJson(res, 503, { error: 'sem_banco' });
      const b = await readBody(req);

      // troca de senha (opcional): exige a senha atual correta
      if (b.senhaNova !== undefined) {
        if (String(b.senhaNova).length < 8) return sendJson(res, 400, { error: 'senha_curta' });
        const ok = await authenticate(email, b.senhaAtual || '');
        if (!ok) return sendJson(res, 400, { error: 'senha_atual_incorreta' });
        let lista = await getConfig('usuarios');
        if (!Array.isArray(lista) || !lista.length) {
          lista = USERS.map((u) => ({ email: u.email, nome: u.nome, role: u.role, unidadeId: u.unidadeId || null, senhaHash: u.senhaHash }));
        }
        const i = lista.findIndex((u) => u.email.toLowerCase() === email);
        if (i < 0) return sendJson(res, 404, { error: 'usuario_nao_encontrado' });
        lista[i].senhaHash = gerarHash(String(b.senhaNova).slice(0, 80));
        await setConfig('usuarios', lista);
      }

      const atual = (await getConfig(key)) || {};
      const conta = {
        nome: b.nome !== undefined ? String(b.nome).trim().slice(0, 80) : (atual.nome || ''),
        telefone: b.telefone !== undefined ? String(b.telefone).trim().slice(0, 30) : (atual.telefone || ''),
        cargo: b.cargo !== undefined ? String(b.cargo).trim().slice(0, 60) : (atual.cargo || ''),
        obs: b.obs !== undefined ? String(b.obs).slice(0, 600) : (atual.obs || ''),
        foto: atual.foto || '',
      };
      if (b.foto !== undefined) {
        const f = String(b.foto || '');
        if (f && (!/^data:image\/(jpeg|png|webp);base64,/.test(f) || f.length > FOTO_MAX)) {
          return sendJson(res, 400, { error: 'foto_invalida' });
        }
        conta.foto = f;
      }
      await setConfig(key, conta);
      return sendJson(res, 200, { ok: true, conta: conta });
    }

    return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  } catch (e) {
    console.error('[conta] erro:', e && e.message);
    return sendJson(res, 500, { error: 'erro_interno' });
  }
};
