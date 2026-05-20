/* ============================================================
   PAINEL-SEED, leads de exemplo para o MODO DEMO dos painéis
   ============================================================
   Usado só quando não há backend/banco respondendo. Junto com os
   leads reais capturados neste navegador (laserco_leads), dá vida
   ao painel para teste. Em produção, os dados vêm da API.
   ============================================================ */

window.LaserPainelData = (function () {
  let _cache = null;

  function build() {
    const now = Date.now();
    const H = 3600 * 1000;
    const D = 24 * H;
    const iso = (ms) => new Date(ms).toISOString();
    const L = (id, tipo, status, ago, dados, origem, url) => ({
      id: id, tipo: tipo, status: status, dados: dados,
      origem: origem || 'site', url: url || '/', timestamp: iso(now - ago),
    });

    return [
      L('lead_demo_01', 'agendamento', 'quente', 2 * H,
        { nome: 'Marina Souza', whatsapp: '(11) 98877-1122', cep: '04101-000', cidade: 'São Paulo', uf: 'SP', procedimentoNome: 'Rejuvenescimento Facial 4D', unidadeId: 'sp-vmariana', unidadeNome: 'Vila Mariana', hasUnidade: true, whatsappClicked: true }, 'instagram', '/agendamento.html'),
      L('lead_demo_02', 'popup_brinde', 'quente', 5 * H,
        { nome: 'Carla Mendes', whatsapp: '(11) 99654-3210', cep: '04015-000', cidade: 'São Paulo', uf: 'SP', unidadeId: 'sp-vmariana', unidadeNome: 'Vila Mariana', hasUnidade: true, brinde: 'Sessão de Rejuvenescimento Facial' }, 'google', '/index.html'),
      L('lead_demo_03', 'agendamento_interesse', 'morno', 9 * H,
        { nome: 'Patrícia Lima', whatsapp: '(21) 98123-4567', cep: '22410-000', cidade: 'Rio de Janeiro', uf: 'RJ', procedimentoNome: 'Melasma', unidadeId: 'rj-ipanema', unidadeNome: 'Ipanema', hasUnidade: true }, 'instagram', '/agendamento.html'),
      L('lead_demo_04', 'agendamento', 'convertido', 1 * D + 3 * H,
        { nome: 'Juliana Alves', whatsapp: '(21) 99988-7766', cep: '22640-100', cidade: 'Rio de Janeiro', uf: 'RJ', procedimentoNome: 'Papada', unidadeId: 'rj-ipanema', unidadeNome: 'Ipanema', hasUnidade: true, whatsappClicked: true }, 'direto', '/agendamento.html'),
      L('lead_demo_05', 'popup_brinde', 'novo', 1 * D + 6 * H,
        { nome: 'Fernanda Rocha', whatsapp: '(11) 98765-1234', cep: '04077-000', cidade: 'São Paulo', uf: 'SP', unidadeId: 'sp-moema', unidadeNome: 'Moema', hasUnidade: true, brinde: 'Sessão de Rejuvenescimento Facial' }, 'facebook', '/index.html'),
      L('lead_demo_06', 'agendamento', 'morno', 2 * D,
        { nome: 'Beatriz Cardoso', whatsapp: '(31) 99876-5432', cep: '30130-000', cidade: 'Belo Horizonte', uf: 'MG', procedimentoNome: 'Full Face', unidadeId: 'mg-bh-savassi', unidadeNome: 'BH Savassi', hasUnidade: true, whatsappClicked: true }, 'google', '/agendamento.html'),
      L('lead_demo_07', 'chatbot', 'novo', 2 * D + 4 * H,
        { nome: 'Renata Dias', whatsapp: '(11) 97777-8888', cep: '05422-000', cidade: 'São Paulo', uf: 'SP', procedimentoNome: 'Depilação a Laser', unidadeId: 'sp-pinheiros', unidadeNome: 'Pinheiros', hasUnidade: true }, 'instagram', '/index.html'),
      L('lead_demo_08', 'agendamento_interesse', 'frio', 3 * D,
        { nome: 'Aline Castro', whatsapp: '(41) 98555-2211', cep: '80420-000', cidade: 'Curitiba', uf: 'PR', procedimentoNome: 'Axila', unidadeId: 'pr-curitiba', unidadeNome: 'Curitiba Batel', hasUnidade: true }, 'tiktok', '/agendamento.html'),
      L('lead_demo_09', 'agendamento', 'quente', 3 * D + 2 * H,
        { nome: 'Larissa Pereira', whatsapp: '(11) 96543-2109', cep: '04101-300', cidade: 'São Paulo', uf: 'SP', procedimentoNome: 'Full Face', unidadeId: 'sp-vmariana', unidadeNome: 'Vila Mariana', hasUnidade: true, whatsappClicked: true }, 'instagram', '/agendamento.html'),
      L('lead_demo_10', 'contato', 'contatado', 4 * D,
        { nome: 'Sandra Nogueira', whatsapp: '(21) 98444-1199', email: 'sandra@email.com', cidade: 'Rio de Janeiro', uf: 'RJ', unidadeId: 'rj-ipanema', unidadeNome: 'Ipanema', mensagem: 'Gostaria de saber valores de pacotes.' }, 'direto', '/contato.html'),
      L('lead_demo_11', 'recrutamento', 'novo', 1 * D + 1 * H,
        { nome: 'Camila Ferreira', email: 'camila.rh@email.com', whatsapp: '(11) 98222-3344', funcao: 'Enfermeira Esteta', cidadeVaga: 'São Paulo, SP', cidadeCandidato: 'São Paulo', curriculoNome: 'cv-camila-ferreira.pdf' }, 'linkedin', '/vagas.html'),
      L('lead_demo_12', 'recrutamento', 'contatado', 5 * D,
        { nome: 'Bruno Teixeira', email: 'bruno.t@email.com', whatsapp: '(21) 97111-2233', funcao: 'Recepcionista', cidadeVaga: 'Rio de Janeiro, RJ', cidadeCandidato: 'Niterói', curriculoNome: 'curriculo-bruno.docx' }, 'instagram', '/vagas.html'),
      L('lead_demo_13', 'franquia', 'quente', 6 * H,
        { nome: 'Roberto Antunes', whatsapp: '(47) 99333-4455', email: 'roberto.invest@email.com', cidade: 'Joinville', uf: 'SC', capital: 'Acima de R$ 250 mil', mensagem: 'Tenho ponto comercial e quero abrir uma unidade.' }, 'google', '/franqueado.html'),
      L('lead_demo_14', 'popup_brinde', 'novo', 7 * H,
        { nome: 'Tatiane Gomes', whatsapp: '(85) 98666-7788', cep: '60160-230', cidade: 'Fortaleza', uf: 'CE', unidadeId: 'ce-fortaleza', unidadeNome: 'Fortaleza Aldeota', hasUnidade: true, brinde: 'Sessão de Rejuvenescimento Facial' }, 'facebook', '/index.html'),
      L('lead_demo_15', 'agendamento_interesse', 'novo', 11 * H,
        { nome: 'Vanessa Martins', whatsapp: '(11) 98000-1212', cep: '04094-050', cidade: 'São Paulo', uf: 'SP', procedimentoNome: 'Melasma', unidadeId: 'sp-vmariana', unidadeNome: 'Vila Mariana', hasUnidade: true }, 'google', '/agendamento.html'),
      L('lead_demo_16', 'agendamento', 'quente', 14 * H,
        { nome: 'Débora Pinto', whatsapp: '(21) 97654-3322', cep: '22420-000', cidade: 'Rio de Janeiro', uf: 'RJ', procedimentoNome: 'Rejuvenescimento Facial 4D', unidadeId: 'rj-ipanema', unidadeNome: 'Ipanema', hasUnidade: true, whatsappClicked: true }, 'instagram', '/agendamento.html'),
    ];
  }

  return {
    seed: function () { if (!_cache) _cache = build(); return _cache.slice(); },
  };
})();
