/* ============================================================
   POST /api/midia  (Bearer, SÓ franqueador)
   Upload de mídia do CMS (banners, fotos do site) para o bucket
   PÚBLICO site-conteudo do Supabase Storage. Body JSON:
   { nome, mime, base64 }. Retorna { url } público.
   Limite ~4MB (payload das functions). Vídeos maiores: fase 3,
   com URL assinada de upload direto do navegador.
   ============================================================ */
const { readBody, sendJson, requireAuth } = require('./_lib/http');
const { hasSupabase } = require('./_lib/config');

const MAX_BYTES = 4 * 1024 * 1024;
const MIMES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

module.exports = async (req, res) => {
  const auth = requireAuth(req, res);
  if (!auth) return;
  if (auth.role !== 'franqueador') return sendJson(res, 403, { error: 'sem_permissao' });
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  if (!hasSupabase()) return sendJson(res, 503, { error: 'sem_banco' });

  const body = await readBody(req);
  const mime = String(body.mime || '');
  const ext = MIMES[mime];
  if (!ext) return sendJson(res, 400, { error: 'tipo_invalido' });
  let buf;
  try { buf = Buffer.from(String(body.base64 || ''), 'base64'); } catch (e) { return sendJson(res, 400, { error: 'base64_invalido' }); }
  if (!buf.length) return sendJson(res, 400, { error: 'arquivo_vazio' });
  if (buf.length > MAX_BYTES) return sendJson(res, 413, { error: 'arquivo_grande_demais' });

  const safeName = String(body.nome || 'midia')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60)
    .replace(/\.[a-zA-Z0-9]+$/, '');
  const path = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '_' + safeName + ext;

  const base = String(process.env.SUPABASE_URL).replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_KEY;
  const up = await fetch(base + '/storage/v1/object/site-conteudo/' + encodeURIComponent(path), {
    method: 'POST',
    headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': mime, 'Cache-Control': 'public, max-age=31536000' },
    body: buf,
  });
  if (!up.ok) {
    console.error('[midia] upload falhou:', up.status, await up.text().catch(() => ''));
    return sendJson(res, 500, { error: 'erro_no_upload' });
  }
  const url = base + '/storage/v1/object/public/site-conteudo/' + encodeURIComponent(path);
  return sendJson(res, 201, { ok: true, url: url, path: path });
};
