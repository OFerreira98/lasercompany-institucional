/* ============================================================
   POST /api/sac  (público)
   Formulário "Fale conosco" do site cria um TICKET DE VERDADE no
   sistema de gestão de SAC (mesmo Supabase, tabela sac_tickets),
   seguindo o padrão do bot de WhatsApp do próprio sistema:
   canal 'formulario', fase 'Novo', status_multi ['em_andamento'],
   historico com a ação de criação. Devolve o NÚMERO DO PROTOCOLO.
   Sem Supabase configurado: { ok, numero: null } (modo demo, o
   lead segue indo pro painel via trackLead, como antes).
   ============================================================ */
const { readBody, sendJson } = require('./_lib/http');
const { hasSupabase } = require('./_lib/config');

const AREAS = { ouvidoria: 'Ouvidoria', elogio: 'Elogio', duvida: 'Dúvida', outros: 'Outros' };

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'metodo_nao_permitido' });
  const b = await readBody(req);

  const nome = String(b.nome || '').trim().slice(0, 120);
  const mensagem = String(b.mensagem || '').trim().slice(0, 4000);
  const email = String(b.email || '').trim().slice(0, 160);
  const telefone = String(b.whatsapp || '').replace(/\D/g, '').slice(0, 15);
  const area = AREAS[String(b.area || '').toLowerCase()] || 'Outros';

  if (!nome || !mensagem) return sendJson(res, 400, { error: 'campos_obrigatorios' });
  if (!email && !telefone) return sendJson(res, 400, { error: 'contato_obrigatorio' });

  if (!hasSupabase()) return sendJson(res, 200, { ok: true, numero: null, demo: true });

  const hoje = new Date().toISOString();
  const ticket = {
    nome_cliente: nome,
    telefone_cliente: telefone || null,
    email_cliente: email || null,
    assunto: (area + ': ' + mensagem).slice(0, 200),
    observacoes: mensagem,
    canal: 'formulario',
    motivo_label: area,
    prioridade: 'media',
    fase: 'Novo',
    status_multi: ['em_andamento'],
    data_reclamacao: hoje.slice(0, 10),
    historico: [{
      data: hoje,
      usuario: 'Site institucional',
      acao: 'Ticket criado pelo formulário Fale Conosco do site.',
    }],
  };

  try {
    const base = String(process.env.SUPABASE_URL).replace(/\/+$/, '');
    const key = process.env.SUPABASE_SERVICE_KEY;
    const r = await fetch(base + '/rest/v1/sac_tickets?select=id,numero', {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(ticket),
    });
    if (!r.ok) {
      console.error('[sac] insert falhou:', r.status, await r.text().catch(() => ''));
      return sendJson(res, 500, { error: 'erro_ao_abrir_ticket' });
    }
    const rows = await r.json();
    const numero = rows && rows[0] ? rows[0].numero : null;
    return sendJson(res, 201, { ok: true, numero: numero });
  } catch (e) {
    console.error('[sac] erro:', e && e.message);
    return sendJson(res, 500, { error: 'erro_ao_abrir_ticket' });
  }
};
