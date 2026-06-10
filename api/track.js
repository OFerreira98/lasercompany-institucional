/* ============================================================
   POST /api/track  (público)
   Beacon de pageview do site. Sem dado pessoal: página, origem
   do tráfego, dispositivo/navegador (derivados do user-agent no
   servidor) e um id de sessão aleatório do navegador.
   Grava em public.site_pageviews; o painel agrega via RPC
   site_trafego_stats. Sem Supabase configurado: no-op (204).
   ============================================================ */
const { readBody, sendJson } = require('./_lib/http');
const { hasSupabase } = require('./_lib/config');

function device(ua) {
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return 'Tablet';
  if (/Mobi|iPhone|Android/i.test(ua)) return 'Celular';
  return 'Desktop';
}
function browser(ua) {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/SamsungBrowser\//.test(ua)) return 'Samsung Internet';
  if (/OPR\/|Opera/.test(ua)) return 'Opera';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Chrome\/|CriOS\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Outro';
}
function origem(ref, utm) {
  if (utm) return String(utm).slice(0, 40).toLowerCase();
  if (!ref) return 'direto';
  try {
    const h = new URL(ref).hostname;
    if (h.indexOf('google') >= 0) return 'google';
    if (h.indexOf('instagram') >= 0) return 'instagram';
    if (h.indexOf('facebook') >= 0 || h.indexOf('fb.') >= 0) return 'facebook';
    if (h.indexOf('tiktok') >= 0) return 'tiktok';
    if (h.indexOf('youtube') >= 0) return 'youtube';
    if (h.indexOf('whatsapp') >= 0 || h.indexOf('wa.me') >= 0) return 'whatsapp';
    // navegação interna: a view conta, mas não entra no gráfico de origens
    if (h.indexOf('lasercompany') >= 0 || h.indexOf('localhost') >= 0 || h.indexOf('vercel.app') >= 0) return 'interno';
    return h.slice(0, 60);
  } catch (e) { return 'direto'; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  // grava ANTES de responder: em serverless, responder primeiro pode
  // congelar a função antes do INSERT terminar.
  try {
    if (hasSupabase()) {
      const body = await readBody(req);
      const page = String(body.p || '/').split('?')[0].slice(0, 120);
      if (page.indexOf('/painel') !== 0) { // painel não conta como tráfego do site
        const o = origem(body.r, body.utm);
        const ua = String(req.headers['user-agent'] || '');
        const row = {
          p: page,
          d: device(ua),
          b: browser(ua),
          o: o || 'direto',
          s: String(body.s || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'anon',
        };
        const base = String(process.env.SUPABASE_URL).replace(/\/+$/, '');
        const key = process.env.SUPABASE_SERVICE_KEY;
        await fetch(base + '/rest/v1/site_pageviews', {
          method: 'POST',
          headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: row }),
        });
      }
    }
  } catch (e) { /* beacon nunca propaga erro */ }
  res.statusCode = 204;
  res.end();
};
