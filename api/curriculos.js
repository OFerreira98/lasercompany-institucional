/* ============================================================
   /api/curriculos  (upload e download de currículo das vagas)
   - POST (público, como /api/leads): { nome, mime, base64 }
     Valida tipo (PDF/DOC/DOCX) e tamanho (até 4MB), sobe para o
     Supabase Storage (bucket PRIVADO site-curriculos) e devolve
     { ok, path }. O path vai dentro do lead de recrutamento.
     Sem Supabase configurado (demo) devolve { ok, path: null },
     o site segue guardando só o nome do arquivo, como antes.
   - GET (Bearer): ?path=...  =>  { url } (URL assinada, 1h).
     Currículo é dado pessoal (LGPD): só o painel logado baixa.
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('./_lib/http');
const { hasSupabase } = require('./_lib/config');

const MAX_BYTES = 4 * 1024 * 1024; // 4MB (limite de payload das functions)
const MIMES = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

function storageBase() {
  return String(process.env.SUPABASE_URL).replace(/\/+$/, '') + '/storage/v1';
}
function authHeaders() {
  const key = process.env.SUPABASE_SERVICE_KEY;
  return { apikey: key, Authorization: 'Bearer ' + key };
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const body = await readBody(req);
    const mime = String(body.mime || '');
    const ext = MIMES[mime];
    if (!ext) return sendJson(res, 400, { error: 'tipo_invalido' });
    if (!body.base64) return sendJson(res, 400, { error: 'arquivo_vazio' });

    if (!hasSupabase()) return sendJson(res, 200, { ok: true, path: null, demo: true });

    let buf;
    try { buf = Buffer.from(String(body.base64), 'base64'); } catch (e) { return sendJson(res, 400, { error: 'base64_invalido' }); }
    if (!buf.length) return sendJson(res, 400, { error: 'arquivo_vazio' });
    if (buf.length > MAX_BYTES) return sendJson(res, 413, { error: 'arquivo_grande_demais' });

    const safeName = String(body.nome || 'curriculo')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    const path = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '_' + safeName +
      (safeName.toLowerCase().endsWith(ext) ? '' : ext);

    const up = await fetch(storageBase() + '/object/site-curriculos/' + encodeURIComponent(path), {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': mime }, authHeaders()),
      body: buf,
    });
    if (!up.ok) {
      console.error('[curriculos] upload falhou:', up.status, await up.text().catch(() => ''));
      return sendJson(res, 500, { error: 'erro_no_upload' });
    }
    return sendJson(res, 201, { ok: true, path: path });
  }

  if (req.method === 'GET') {
    const auth = requireAuth(req, res);
    if (!auth) return;
    if (!hasSupabase()) return sendJson(res, 404, { error: 'sem_storage' });
    const q = (req.query && req.query.path) ||
      new URL(req.url, 'http://x').searchParams.get('path');
    if (!q || q.indexOf('..') >= 0) return sendJson(res, 400, { error: 'path_invalido' });
    const r = await fetch(storageBase() + '/object/sign/site-curriculos/' + encodeURIComponent(q), {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify({ expiresIn: 3600 }),
    });
    if (!r.ok) return sendJson(res, 404, { error: 'nao_encontrado' });
    const j = await r.json();
    return sendJson(res, 200, { url: storageBase() + j.signedURL });
  }

  return sendJson(res, 405, { error: 'metodo_nao_permitido' });
};
