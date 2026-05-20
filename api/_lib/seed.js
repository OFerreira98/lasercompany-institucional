/* ============================================================
   SEED, dados de exemplo do MODO DEMO do backend
   ============================================================
   Estes leads aparecem na API somente quando NÃO há banco de
   produção configurado (sem DATABASE_URL). Quando o Postgres
   for ligado, estes dados são ignorados e tudo vem do banco.
   Servem apenas para o franqueador/franqueado conseguirem
   testar os painéis com a API antes de existir banco real.
   ============================================================ */

const now = Date.now();
const H = 3600 * 1000;
const D = 24 * H;
const iso = (ms) => new Date(ms).toISOString();

const leads = [
  { id: 'lead_seed_01', tipo: 'agendamento', status: 'quente',
    dados: { nome: 'Marina Souza', whatsapp: '(11) 98877-1122', cep: '04101-000', cidade: 'São Paulo', uf: 'SP', procedimentoNome: 'Rejuvenescimento Facial 4D', unidadeId: 'sp-vmariana', unidadeNome: 'Vila Mariana', hasUnidade: true, whatsappClicked: true },
    origem: 'instagram', url: '/agendamento.html', timestamp: iso(now - 2 * H) },

  { id: 'lead_seed_02', tipo: 'popup_brinde', status: 'quente',
    dados: { nome: 'Carla Mendes', whatsapp: '(11) 99654-3210', cep: '04015-000', cidade: 'São Paulo', uf: 'SP', unidadeId: 'sp-vmariana', unidadeNome: 'Vila Mariana', hasUnidade: true, brinde: 'Sessão de Rejuvenescimento Facial' },
    origem: 'google', url: '/index.html', timestamp: iso(now - 5 * H) },

  { id: 'lead_seed_03', tipo: 'agendamento_interesse', status: 'morno',
    dados: { nome: 'Patrícia Lima', whatsapp: '(21) 98123-4567', cep: '22410-000', cidade: 'Rio de Janeiro', uf: 'RJ', procedimentoNome: 'Melasma', unidadeId: 'rj-ipanema', unidadeNome: 'Ipanema', hasUnidade: true },
    origem: 'instagram', url: '/agendamento.html', timestamp: iso(now - 9 * H) },

  { id: 'lead_seed_04', tipo: 'agendamento', status: 'convertido',
    dados: { nome: 'Juliana Alves', whatsapp: '(21) 99988-7766', cep: '22640-100', cidade: 'Rio de Janeiro', uf: 'RJ', procedimentoNome: 'Papada', unidadeId: 'rj-ipanema', unidadeNome: 'Ipanema', hasUnidade: true, whatsappClicked: true },
    origem: 'direto', url: '/agendamento.html', timestamp: iso(now - 1 * D - 3 * H) },

  { id: 'lead_seed_05', tipo: 'popup_brinde', status: 'novo',
    dados: { nome: 'Fernanda Rocha', whatsapp: '(11) 98765-1234', cep: '04077-000', cidade: 'São Paulo', uf: 'SP', unidadeId: 'sp-moema', unidadeNome: 'Moema', hasUnidade: true, brinde: 'Sessão de Rejuvenescimento Facial' },
    origem: 'facebook', url: '/index.html', timestamp: iso(now - 1 * D - 6 * H) },

  { id: 'lead_seed_06', tipo: 'agendamento', status: 'morno',
    dados: { nome: 'Beatriz Cardoso', whatsapp: '(31) 99876-5432', cep: '30130-000', cidade: 'Belo Horizonte', uf: 'MG', procedimentoNome: 'Full Face', unidadeId: 'mg-bh-savassi', unidadeNome: 'BH Savassi', hasUnidade: true, whatsappClicked: true },
    origem: 'google', url: '/agendamento.html', timestamp: iso(now - 2 * D) },

  { id: 'lead_seed_07', tipo: 'chatbot', status: 'novo',
    dados: { nome: 'Renata Dias', whatsapp: '(11) 97777-8888', cep: '05422-000', cidade: 'São Paulo', uf: 'SP', procedimentoNome: 'Depilação a Laser', unidadeId: 'sp-pinheiros', unidadeNome: 'Pinheiros', hasUnidade: true },
    origem: 'instagram', url: '/index.html', timestamp: iso(now - 2 * D - 4 * H) },

  { id: 'lead_seed_08', tipo: 'agendamento_interesse', status: 'frio',
    dados: { nome: 'Aline Castro', whatsapp: '(41) 98555-2211', cep: '80420-000', cidade: 'Curitiba', uf: 'PR', procedimentoNome: 'Axila', unidadeId: 'pr-curitiba', unidadeNome: 'Curitiba Batel', hasUnidade: true },
    origem: 'tiktok', url: '/agendamento.html', timestamp: iso(now - 3 * D) },

  { id: 'lead_seed_09', tipo: 'agendamento', status: 'quente',
    dados: { nome: 'Larissa Pereira', whatsapp: '(11) 96543-2109', cep: '04101-300', cidade: 'São Paulo', uf: 'SP', procedimentoNome: 'Full Face', unidadeId: 'sp-vmariana', unidadeNome: 'Vila Mariana', hasUnidade: true, whatsappClicked: true },
    origem: 'instagram', url: '/agendamento.html', timestamp: iso(now - 3 * D - 2 * H) },

  { id: 'lead_seed_10', tipo: 'contato', status: 'contatado',
    dados: { nome: 'Sandra Nogueira', whatsapp: '(21) 98444-1199', email: 'sandra@email.com', cidade: 'Rio de Janeiro', uf: 'RJ', unidadeId: 'rj-ipanema', unidadeNome: 'Ipanema', mensagem: 'Gostaria de saber valores de pacotes.' },
    origem: 'direto', url: '/contato.html', timestamp: iso(now - 4 * D) },

  { id: 'lead_seed_11', tipo: 'recrutamento', status: 'novo',
    dados: { nome: 'Camila Ferreira', email: 'camila.rh@email.com', whatsapp: '(11) 98222-3344', funcao: 'Enfermeira Esteta', cidadeVaga: 'São Paulo, SP', cidadeCandidato: 'São Paulo', curriculoNome: 'cv-camila-ferreira.pdf' },
    origem: 'linkedin', url: '/vagas.html', timestamp: iso(now - 1 * D - 1 * H) },

  { id: 'lead_seed_12', tipo: 'recrutamento', status: 'contatado',
    dados: { nome: 'Bruno Teixeira', email: 'bruno.t@email.com', whatsapp: '(21) 97111-2233', funcao: 'Recepcionista', cidadeVaga: 'Rio de Janeiro, RJ', cidadeCandidato: 'Niterói', curriculoNome: 'curriculo-bruno.docx' },
    origem: 'instagram', url: '/vagas.html', timestamp: iso(now - 5 * D) },

  { id: 'lead_seed_13', tipo: 'franquia', status: 'quente',
    dados: { nome: 'Roberto Antunes', whatsapp: '(47) 99333-4455', email: 'roberto.invest@email.com', cidade: 'Joinville', uf: 'SC', capital: 'Acima de R$ 250 mil', mensagem: 'Tenho ponto comercial e quero abrir uma unidade.' },
    origem: 'google', url: '/franqueado.html', timestamp: iso(now - 6 * H) },

  { id: 'lead_seed_14', tipo: 'popup_brinde', status: 'novo',
    dados: { nome: 'Tatiane Gomes', whatsapp: '(85) 98666-7788', cep: '60160-230', cidade: 'Fortaleza', uf: 'CE', unidadeId: 'ce-fortaleza', unidadeNome: 'Fortaleza Aldeota', hasUnidade: true, brinde: 'Sessão de Rejuvenescimento Facial' },
    origem: 'facebook', url: '/index.html', timestamp: iso(now - 7 * H) },
];

module.exports = { leads };
