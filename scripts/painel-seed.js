/* ============================================================
   PAINEL-SEED, leads de exemplo para o MODO DEMO dos painéis
   ============================================================
   Gera um conjunto realista (~110 leads espalhados em 30 dias)
   para dar vida aos KPIs e gráficos. Usado só quando não há
   backend/banco respondendo. Em produção os dados vêm da API.
   ============================================================ */

window.LaserPainelData = (function () {
  let _cache = null;

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const NOMES = ['Marina Souza', 'Carla Mendes', 'Patrícia Lima', 'Juliana Alves', 'Fernanda Rocha',
    'Beatriz Cardoso', 'Renata Dias', 'Aline Castro', 'Larissa Pereira', 'Sandra Nogueira',
    'Camila Ferreira', 'Vanessa Martins', 'Débora Pinto', 'Tatiane Gomes', 'Roberta Nunes',
    'Bruna Carvalho', 'Letícia Ramos', 'Priscila Teixeira', 'Amanda Ribeiro', 'Mariana Costa',
    'Gabriela Moreira', 'Helena Barbosa', 'Isabela Freitas', 'Natália Campos', 'Bianca Lopes',
    'Daniela Araújo', 'Carolina Pires', 'Sabrina Melo', 'Tainá Cunha', 'Vitória Andrade'];
  const SOBREcid = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre',
    'Salvador', 'Recife', 'Fortaleza', 'Florianópolis', 'Goiânia', 'Brasília'];

  // Unidades usadas no demo (id, nome, uf) - inclui vmariana e ipanema para teste de franqueado
  const UNIDADES = [
    { id: 'sp-vmariana', nome: 'Vila Mariana', uf: 'SP', cidade: 'São Paulo', w: 16 },
    { id: 'rj-ipanema', nome: 'Ipanema', uf: 'RJ', cidade: 'Rio de Janeiro', w: 14 },
    { id: 'sp-moema', nome: 'Moema', uf: 'SP', cidade: 'São Paulo', w: 11 },
    { id: 'sp-pinheiros', nome: 'Pinheiros', uf: 'SP', cidade: 'São Paulo', w: 10 },
    { id: 'mg-bh-savassi', nome: 'BH Savassi', uf: 'MG', cidade: 'Belo Horizonte', w: 9 },
    { id: 'pr-curitiba', nome: 'Curitiba Batel', uf: 'PR', cidade: 'Curitiba', w: 8 },
    { id: 'rj-barra', nome: 'Barra da Tijuca', uf: 'RJ', cidade: 'Rio de Janeiro', w: 7 },
    { id: 'rs-poa-moinhos', nome: 'Porto Alegre Moinhos', uf: 'RS', cidade: 'Porto Alegre', w: 6 },
    { id: 'sc-floripa', nome: 'Florianópolis', uf: 'SC', cidade: 'Florianópolis', w: 6 },
    { id: 'ba-salvador', nome: 'Salvador Pituba', uf: 'BA', cidade: 'Salvador', w: 5 },
    { id: 'ce-fortaleza', nome: 'Fortaleza Aldeota', uf: 'CE', cidade: 'Fortaleza', w: 5 },
    { id: 'pe-recife', nome: 'Recife Boa Viagem', uf: 'PE', cidade: 'Recife', w: 4 },
    { id: 'go-goiania', nome: 'Goiânia Setor Bueno', uf: 'GO', cidade: 'Goiânia', w: 4 },
    { id: 'sp-santana', nome: 'Santana', uf: 'SP', cidade: 'São Paulo', w: 4 },
  ];
  const PROCS = ['Rejuvenescimento Facial 4D', 'Full Face', 'Melasma', 'Papada', 'Axila',
    'Virilha Completa', 'Perna Inteira', 'Cicatriz de Acne', 'Bichectomia sem cortes', 'Fox Eyes',
    'Abdômen', 'Depilação a Laser', 'Remoção de Tatuagem'];
  const ORIGENS = [['instagram', 34], ['google', 26], ['direto', 16], ['facebook', 12], ['tiktok', 8], ['youtube', 4]];
  const TIPOS = [['agendamento', 30], ['popup_brinde', 26], ['agendamento_interesse', 18],
    ['recrutamento', 9], ['contato', 7], ['chatbot', 6], ['franquia', 4]];
  const STATUS = [['quente', 26], ['novo', 24], ['morno', 18], ['contatado', 12], ['frio', 9], ['convertido', 8], ['perdido', 3]];

  function weighted(rng, pairs) {
    const total = pairs.reduce((s, p) => s + p[1], 0);
    let r = rng() * total;
    for (let i = 0; i < pairs.length; i++) { r -= pairs[i][1]; if (r <= 0) return pairs[i][0]; }
    return pairs[0][0];
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function phone(rng) {
    const dd = ['11', '21', '31', '41', '51', '71', '81', '85', '48', '62'][Math.floor(rng() * 10)];
    const n = String(90000 + Math.floor(rng() * 9999));
    const m = String(1000 + Math.floor(rng() * 8999));
    return '(' + dd + ') 9' + n.slice(0, 4) + '-' + m;
  }

  function build() {
    const rng = mulberry32(20260521);
    const now = Date.now();
    const D = 86400000, H = 3600000;
    const out = [];
    const N = 112;
    for (let i = 0; i < N; i++) {
      // datas: mais leads recentes (curva). dia 0..29 atras, enviesado pra recente
      const dia = Math.floor(Math.pow(rng(), 1.7) * 30);
      const ts = now - dia * D - Math.floor(rng() * 24) * H - Math.floor(rng() * 60) * 60000;
      const u = weighted(rng, UNIDADES.map(x => [x, x.w]));
      const tipo = weighted(rng, TIPOS);
      const origem = weighted(rng, ORIGENS);
      let status = weighted(rng, STATUS);
      const nome = pick(rng, NOMES);
      const dados = { nome: nome, whatsapp: phone(rng), cidade: u.cidade, uf: u.uf, unidadeId: u.id, unidadeNome: u.nome, hasUnidade: true };
      if (tipo === 'recrutamento') {
        dados.funcao = pick(rng, ['Enfermeira Esteta', 'Recepcionista', 'Esteticista', 'Consultora de Vendas', 'Gerente de Unidade']);
        dados.email = nome.toLowerCase().replace(/[^a-z]/g, '') + '@email.com';
        dados.curriculoNome = 'cv-' + nome.split(' ')[0].toLowerCase() + '.pdf';
        delete dados.unidadeId; delete dados.unidadeNome; delete dados.hasUnidade;
      } else if (tipo === 'franquia') {
        dados.email = nome.toLowerCase().replace(/[^a-z]/g, '') + '@email.com';
        dados.capital = pick(rng, ['R$ 150 a 250 mil', 'Acima de R$ 250 mil', 'Até R$ 150 mil']);
        delete dados.unidadeId; delete dados.unidadeNome; delete dados.hasUnidade;
      } else {
        dados.procedimentoNome = pick(rng, PROCS);
        if (tipo === 'popup_brinde') dados.brinde = 'Sessão de Rejuvenescimento Facial';
      }
      out.push({
        id: 'lead_demo_' + (1000 + i),
        tipo: tipo, status: status, dados: dados,
        origem: origem, url: '/', timestamp: new Date(ts).toISOString(),
      });
    }
    out.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return out;
  }

  return {
    seed: function () { if (!_cache) _cache = build(); return _cache.slice(); },
    unidadesDemo: function () { return UNIDADES.slice(); },
  };
})();
