/* ============================================================
   DATA, Mock de dados da rede
   ============================================================
   Em produção, este arquivo deve ser substituído por chamadas
   à API real do sistema da rede. As estruturas devem ser
   preservadas.
   ============================================================ */

window.LaserData = {

  /* --------- UNIDADES DA REDE ---------
     Em produção: GET /api/unidades
     Estrutura mínima: cada unidade precisa de id, nome, cidade,
     UF, endereço, whatsapp (com DDI), horário e um array de
     prefixos de CEP que ela atende (ou centro+raio).
  */
  unidades: [
    { id: 'sp-vmariana', nome: 'Vila Mariana', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Vergueiro, 1500, Vila Mariana, São Paulo/SP', whatsapp: '5511999990001', telefone: '(11) 3456-7890', horario: 'Seg a Sáb, 9h às 20h', lat: -23.5910, lng: -46.6347, cepPrefixos: ['041','042','043','044','045','046','047','048','050'] },
    { id: 'sp-pinheiros', nome: 'Pinheiros', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua dos Pinheiros, 980, Pinheiros, São Paulo/SP', whatsapp: '5511999990002', telefone: '(11) 3456-7891', horario: 'Seg a Sáb, 9h às 20h', lat: -23.5612, lng: -46.6822, cepPrefixos: ['054','055','056','057','058','053'] },
    { id: 'sp-moema', nome: 'Moema', cidade: 'São Paulo', uf: 'SP', endereco: 'Av. Ibirapuera, 2330, Moema, São Paulo/SP', whatsapp: '5511999990003', telefone: '(11) 3456-7892', horario: 'Seg a Sáb, 9h às 20h', lat: -23.6037, lng: -46.6597, cepPrefixos: ['040','049','045','046','047'] },
    { id: 'sp-tatuape', nome: 'Tatuapé', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Tuiuti, 2100, Tatuapé, São Paulo/SP', whatsapp: '5511999990004', telefone: '(11) 3456-7893', horario: 'Seg a Sáb, 9h às 20h', lat: -23.5377, lng: -46.5760, cepPrefixos: ['030','031','032','033','034','035','036','037','038','039'] },
    { id: 'sp-santana', nome: 'Santana', cidade: 'São Paulo', uf: 'SP', endereco: 'Av. Cruzeiro do Sul, 1800, Santana, São Paulo/SP', whatsapp: '5511999990005', telefone: '(11) 3456-7894', horario: 'Seg a Sáb, 9h às 20h', lat: -23.5045, lng: -46.6244, cepPrefixos: ['020','021','022','023','024','025','026','027','028','029'] },
    { id: 'sp-campinas', nome: 'Campinas Cambuí', cidade: 'Campinas', uf: 'SP', endereco: 'Rua Coronel Quirino, 1830, Cambuí, Campinas/SP', whatsapp: '5519999990006', telefone: '(19) 3456-7895', horario: 'Seg a Sáb, 9h às 20h', lat: -22.8920, lng: -47.0510, cepPrefixos: ['130','131','132','133','134'] },
    { id: 'sp-santos', nome: 'Santos Gonzaga', cidade: 'Santos', uf: 'SP', endereco: 'Av. Ana Costa, 480, Gonzaga, Santos/SP', whatsapp: '5513999990007', telefone: '(13) 3456-7896', horario: 'Seg a Sáb, 9h às 19h', lat: -23.9618, lng: -46.3322, cepPrefixos: ['110','111'] },
    { id: 'sp-ribeirao', nome: 'Ribeirão Preto', cidade: 'Ribeirão Preto', uf: 'SP', endereco: 'Av. Presidente Vargas, 2121, Jardim Santa Ângela, Ribeirão Preto/SP', whatsapp: '5516999990008', telefone: '(16) 3456-7897', horario: 'Seg a Sáb, 9h às 19h', lat: -21.1775, lng: -47.8208, cepPrefixos: ['140','141','142'] },
    { id: 'rj-ipanema', nome: 'Ipanema', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Rua Visconde de Pirajá, 595, Ipanema, Rio de Janeiro/RJ', whatsapp: '5521999990009', telefone: '(21) 3456-7898', horario: 'Seg a Sáb, 9h às 20h', lat: -22.9844, lng: -43.2018, cepPrefixos: ['224','225','226'] },
    { id: 'rj-barra', nome: 'Barra da Tijuca', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Av. das Américas, 4666, Barra da Tijuca, Rio de Janeiro/RJ', whatsapp: '5521999990010', telefone: '(21) 3456-7899', horario: 'Seg a Sáb, 9h às 20h', lat: -22.9989, lng: -43.3651, cepPrefixos: ['227','228','229'] },
    { id: 'rj-tijuca', nome: 'Tijuca', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Rua Conde de Bonfim, 700, Tijuca, Rio de Janeiro/RJ', whatsapp: '5521999990011', telefone: '(21) 3456-7800', horario: 'Seg a Sáb, 9h às 20h', lat: -22.9272, lng: -43.2300, cepPrefixos: ['205','206','207','208','209','220','221','222','223'] },
    { id: 'rj-niteroi', nome: 'Niterói', cidade: 'Niterói', uf: 'RJ', endereco: 'Rua Moreira César, 121, Icaraí, Niterói/RJ', whatsapp: '5521999990012', telefone: '(21) 3456-7801', horario: 'Seg a Sáb, 9h às 20h', lat: -22.9009, lng: -43.1031, cepPrefixos: ['240','241','242'] },
    { id: 'mg-bh-savassi', nome: 'BH Savassi', cidade: 'Belo Horizonte', uf: 'MG', endereco: 'Rua Pernambuco, 1212, Savassi, Belo Horizonte/MG', whatsapp: '5531999990013', telefone: '(31) 3456-7802', horario: 'Seg a Sáb, 9h às 20h', lat: -19.9382, lng: -43.9355, cepPrefixos: ['301','302','303','304'] },
    { id: 'mg-bh-buritis', nome: 'BH Buritis', cidade: 'Belo Horizonte', uf: 'MG', endereco: 'Av. Mário Werneck, 2900, Buritis, Belo Horizonte/MG', whatsapp: '5531999990014', telefone: '(31) 3456-7803', horario: 'Seg a Sáb, 9h às 20h', lat: -19.9651, lng: -43.9701, cepPrefixos: ['305','306','307','308','309','310','311','312'] },
    { id: 'mg-uberlandia', nome: 'Uberlândia', cidade: 'Uberlândia', uf: 'MG', endereco: 'Av. Rondon Pacheco, 4600, Tibery, Uberlândia/MG', whatsapp: '5534999990015', telefone: '(34) 3456-7804', horario: 'Seg a Sáb, 9h às 19h', lat: -18.9113, lng: -48.2622, cepPrefixos: ['384'] },
    { id: 'rs-poa-moinhos', nome: 'Porto Alegre Moinhos', cidade: 'Porto Alegre', uf: 'RS', endereco: 'Rua Padre Chagas, 350, Moinhos de Vento, Porto Alegre/RS', whatsapp: '5551999990016', telefone: '(51) 3456-7805', horario: 'Seg a Sáb, 9h às 20h', lat: -30.0214, lng: -51.2058, cepPrefixos: ['904','905','906','907','908','909','910'] },
    { id: 'rs-caxias', nome: 'Caxias do Sul', cidade: 'Caxias do Sul', uf: 'RS', endereco: 'Rua Sinimbu, 1755, Centro, Caxias do Sul/RS', whatsapp: '5554999990017', telefone: '(54) 3456-7806', horario: 'Seg a Sáb, 9h às 19h', lat: -29.1689, lng: -51.1789, cepPrefixos: ['950','951','952'] },
    { id: 'pr-curitiba', nome: 'Curitiba Batel', cidade: 'Curitiba', uf: 'PR', endereco: 'Av. do Batel, 1750, Batel, Curitiba/PR', whatsapp: '5541999990018', telefone: '(41) 3456-7807', horario: 'Seg a Sáb, 9h às 20h', lat: -25.4407, lng: -49.2872, cepPrefixos: ['800','801','802','803','804','805','806','807','808','809','810','811','812','813','814','815','816','817','818','819','820','821','822','823','824','825','826','827','828','829','830','831','832'] },
    { id: 'pr-londrina', nome: 'Londrina', cidade: 'Londrina', uf: 'PR', endereco: 'Av. Higienópolis, 1100, Centro, Londrina/PR', whatsapp: '5543999990019', telefone: '(43) 3456-7808', horario: 'Seg a Sáb, 9h às 19h', lat: -23.3115, lng: -51.1633, cepPrefixos: ['860','861','862','863','864','865','866','867','868','869','870'] },
    { id: 'sc-floripa', nome: 'Florianópolis', cidade: 'Florianópolis', uf: 'SC', endereco: 'Rua Bocaiúva, 2160, Centro, Florianópolis/SC', whatsapp: '5548999990020', telefone: '(48) 3456-7809', horario: 'Seg a Sáb, 9h às 20h', lat: -27.5912, lng: -48.5495, cepPrefixos: ['880','881','882','883','884','885','886','887','888'] },
    { id: 'sc-joinville', nome: 'Joinville', cidade: 'Joinville', uf: 'SC', endereco: 'Rua Visconde de Taunay, 380, Centro, Joinville/SC', whatsapp: '5547999990021', telefone: '(47) 3456-7810', horario: 'Seg a Sáb, 9h às 19h', lat: -26.3045, lng: -48.8487, cepPrefixos: ['892','893','894','895'] },
    { id: 'ba-salvador', nome: 'Salvador Pituba', cidade: 'Salvador', uf: 'BA', endereco: 'Av. Manoel Dias da Silva, 1500, Pituba, Salvador/BA', whatsapp: '5571999990022', telefone: '(71) 3456-7811', horario: 'Seg a Sáb, 9h às 20h', lat: -12.9941, lng: -38.4525, cepPrefixos: ['400','401','402','403','404','405','406','407','408','409','410','411','412','413','414','415','416','417','418','419'] },
    { id: 'pe-recife', nome: 'Recife Boa Viagem', cidade: 'Recife', uf: 'PE', endereco: 'Av. Conselheiro Aguiar, 3380, Boa Viagem, Recife/PE', whatsapp: '5581999990023', telefone: '(81) 3456-7812', horario: 'Seg a Sáb, 9h às 20h', lat: -8.1185, lng: -34.8956, cepPrefixos: ['500','501','502','503','504','505','506','507','508','509','510','511','512','513','514','515','516','517','518','519','520','521','522','523','524','525','526','527','528','529','530','531','532','533','534','535'] },
    { id: 'ce-fortaleza', nome: 'Fortaleza Aldeota', cidade: 'Fortaleza', uf: 'CE', endereco: 'Av. Santos Dumont, 2828, Aldeota, Fortaleza/CE', whatsapp: '5585999990024', telefone: '(85) 3456-7813', horario: 'Seg a Sáb, 9h às 20h', lat: -3.7350, lng: -38.4956, cepPrefixos: ['600','601','602','603','604','605','606','607','608','609','610','611','612','613'] },
    { id: 'go-goiania', nome: 'Goiânia Setor Bueno', cidade: 'Goiânia', uf: 'GO', endereco: 'Av. T-7, 1300, Setor Bueno, Goiânia/GO', whatsapp: '5562999990025', telefone: '(62) 3456-7814', horario: 'Seg a Sáb, 9h às 20h', lat: -16.7058, lng: -49.2773, cepPrefixos: ['740','741','742','743','744','745','746','747','748','749'] },
    { id: 'df-brasilia', nome: 'Brasília Asa Sul', cidade: 'Brasília', uf: 'DF', endereco: 'CLS 405, Bloco B, Loja 18, Asa Sul, Brasília/DF', whatsapp: '5561999990026', telefone: '(61) 3456-7815', horario: 'Seg a Sáb, 9h às 20h', lat: -15.8089, lng: -47.8857, cepPrefixos: ['700','701','702','703','704','705','706','707','708','709','710','711','712','713','714','715','716','717','718','719','720','721','722','723','724','725','726','727','728','729','730','731','732','733','734','735','736','737','738','739'] },
    { id: 'es-vitoria', nome: 'Vitória Praia do Canto', cidade: 'Vitória', uf: 'ES', endereco: 'Av. Nossa Sra. dos Navegantes, 675, Praia do Canto, Vitória/ES', whatsapp: '5527999990027', telefone: '(27) 3456-7816', horario: 'Seg a Sáb, 9h às 20h', lat: -20.3015, lng: -40.2902, cepPrefixos: ['290','291','292','293','294','295','296'] },
    { id: 'ma-saoluis', nome: 'São Luís', cidade: 'São Luís', uf: 'MA', endereco: 'Av. Daniel de La Touche, 1700, Cohama, São Luís/MA', whatsapp: '5598999990028', telefone: '(98) 3456-7817', horario: 'Seg a Sáb, 9h às 19h', lat: -2.5290, lng: -44.3068, cepPrefixos: ['650','651','652','653','654','655','656','657'] },
    { id: 'pa-belem', nome: 'Belém', cidade: 'Belém', uf: 'PA', endereco: 'Av. Visconde de Souza Franco, 765, Reduto, Belém/PA', whatsapp: '5591999990029', telefone: '(91) 3456-7818', horario: 'Seg a Sáb, 9h às 19h', lat: -1.4502, lng: -48.4799, cepPrefixos: ['660','661','662','663','664','665','666','667','668'] },
    { id: 'am-manaus', nome: 'Manaus', cidade: 'Manaus', uf: 'AM', endereco: 'Av. Djalma Batista, 1830, Adrianópolis, Manaus/AM', whatsapp: '5592999990030', telefone: '(92) 3456-7819', horario: 'Seg a Sáb, 9h às 19h', lat: -3.0962, lng: -60.0107, cepPrefixos: ['690','691','692','693','694','695','696','697','698','699'] },

    /* --- SP interior e zona leste --- */
    { id: 'sp-sorocaba', nome: 'Sorocaba', cidade: 'Sorocaba', uf: 'SP', endereco: 'Av. General Carneiro, 1240, Centro, Sorocaba/SP', whatsapp: '5515999990031', telefone: '(15) 3456-7820', horario: 'Seg a Sáb, 9h às 19h', lat: -23.5015, lng: -47.4526, cepPrefixos: ['180','181','182'] },
    { id: 'sp-jundiai', nome: 'Jundiaí', cidade: 'Jundiaí', uf: 'SP', endereco: 'Av. Nove de Julho, 1200, Centro, Jundiaí/SP', whatsapp: '5511999990032', telefone: '(11) 3456-7821', horario: 'Seg a Sáb, 9h às 19h', lat: -23.1850, lng: -46.8843, cepPrefixos: ['132','133'] },
    { id: 'sp-sjcampos', nome: 'São José dos Campos', cidade: 'São José dos Campos', uf: 'SP', endereco: 'Av. São João, 2200, Jardim Esplanada, São José dos Campos/SP', whatsapp: '5512999990033', telefone: '(12) 3456-7822', horario: 'Seg a Sáb, 9h às 19h', lat: -23.1791, lng: -45.8872, cepPrefixos: ['122','123','124'] },
    { id: 'sp-osasco', nome: 'Osasco', cidade: 'Osasco', uf: 'SP', endereco: 'Av. dos Autonomistas, 1810, Centro, Osasco/SP', whatsapp: '5511999990034', telefone: '(11) 3456-7823', horario: 'Seg a Sáb, 9h às 20h', lat: -23.5325, lng: -46.7916, cepPrefixos: ['060','061','062','063','064','065','066','067','068','069','070','071','072','073','074','075','076','077','078','079','080','081','082','083','084','085','086','087','088','089','090','091','092','093','094','095','096','097','098','099'] },
    { id: 'sp-guarulhos', nome: 'Guarulhos', cidade: 'Guarulhos', uf: 'SP', endereco: 'Av. Tiradentes, 4500, Vila Augusta, Guarulhos/SP', whatsapp: '5511999990035', telefone: '(11) 3456-7824', horario: 'Seg a Sáb, 9h às 20h', lat: -23.4633, lng: -46.5333, cepPrefixos: ['070','071','072','073','074','075','076','077','078','079'] },
    { id: 'sp-itaim', nome: 'Itaim Bibi', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua João Cachoeira, 1080, Itaim Bibi, São Paulo/SP', whatsapp: '5511999990036', telefone: '(11) 3456-7825', horario: 'Seg a Sáb, 9h às 20h', lat: -23.5870, lng: -46.6786, cepPrefixos: ['014','015','044'] },
    { id: 'sp-morumbi', nome: 'Morumbi', cidade: 'São Paulo', uf: 'SP', endereco: 'Av. Giovanni Gronchi, 5930, Morumbi, São Paulo/SP', whatsapp: '5511999990037', telefone: '(11) 3456-7826', horario: 'Seg a Sáb, 9h às 20h', lat: -23.6086, lng: -46.7244, cepPrefixos: ['056','057','058','059'] },
    { id: 'sp-saobernardo', nome: 'São Bernardo', cidade: 'São Bernardo do Campo', uf: 'SP', endereco: 'Av. Kennedy, 800, Centro, São Bernardo do Campo/SP', whatsapp: '5511999990038', telefone: '(11) 3456-7827', horario: 'Seg a Sáb, 9h às 20h', lat: -23.6914, lng: -46.5646, cepPrefixos: ['098','099'] },
    { id: 'sp-santoandre', nome: 'Santo André', cidade: 'Santo André', uf: 'SP', endereco: 'Av. Industrial, 1450, Jardim, Santo André/SP', whatsapp: '5511999990039', telefone: '(11) 3456-7828', horario: 'Seg a Sáb, 9h às 20h', lat: -23.6663, lng: -46.5306, cepPrefixos: ['090','091','092','093','094','095','096','097'] },
    { id: 'sp-sjriopreto', nome: 'São José do Rio Preto', cidade: 'São José do Rio Preto', uf: 'SP', endereco: 'Av. Bady Bassitt, 4100, Centro, São José do Rio Preto/SP', whatsapp: '5517999990040', telefone: '(17) 3456-7829', horario: 'Seg a Sáb, 9h às 19h', lat: -20.8197, lng: -49.3794, cepPrefixos: ['150','151','152']  },
    { id: 'sp-baurú', nome: 'Bauru', cidade: 'Bauru', uf: 'SP', endereco: 'Rua Gustavo Maciel, 4000, Centro, Bauru/SP', whatsapp: '5514999990041', telefone: '(14) 3456-7830', horario: 'Seg a Sáb, 9h às 19h', lat: -22.3145, lng: -49.0610, cepPrefixos: ['170','171','172']  },
    { id: 'sp-piracicaba', nome: 'Piracicaba', cidade: 'Piracicaba', uf: 'SP', endereco: 'Av. Independência, 1500, Centro, Piracicaba/SP', whatsapp: '5519999990042', telefone: '(19) 3456-7831', horario: 'Seg a Sáb, 9h às 19h', lat: -22.7253, lng: -47.6492, cepPrefixos: ['134','135','136']  },

    /* --- RJ --- */
    { id: 'rj-copacabana', nome: 'Copacabana', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Av. Nossa Sra. de Copacabana, 1200, Rio de Janeiro/RJ', whatsapp: '5521999990043', telefone: '(21) 3456-7832', horario: 'Seg a Sáb, 9h às 20h', lat: -22.9710, lng: -43.1820, cepPrefixos: ['220','221'] },
    { id: 'rj-recreio', nome: 'Recreio dos Bandeirantes', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Av. das Américas, 15500, Recreio, Rio de Janeiro/RJ', whatsapp: '5521999990044', telefone: '(21) 3456-7833', horario: 'Seg a Sáb, 9h às 20h', lat: -23.0245, lng: -43.4651, cepPrefixos: ['229'] },
    { id: 'rj-petropolis', nome: 'Petrópolis', cidade: 'Petrópolis', uf: 'RJ', endereco: 'Rua do Imperador, 800, Centro, Petrópolis/RJ', whatsapp: '5524999990045', telefone: '(24) 3456-7834', horario: 'Seg a Sáb, 9h às 19h', lat: -22.5119, lng: -43.1828, cepPrefixos: ['256','257'] },
    { id: 'rj-novaiguacu', nome: 'Nova Iguaçu', cidade: 'Nova Iguaçu', uf: 'RJ', endereco: 'Av. Governador Roberto Silveira, 600, Centro, Nova Iguaçu/RJ', whatsapp: '5521999990046', telefone: '(21) 3456-7835', horario: 'Seg a Sáb, 9h às 20h', lat: -22.7595, lng: -43.4503, cepPrefixos: ['262','263','264'] },
    { id: 'rj-saogoncalo', nome: 'São Gonçalo', cidade: 'São Gonçalo', uf: 'RJ', endereco: 'Av. Pres. Kennedy, 1700, Estrela do Norte, São Gonçalo/RJ', whatsapp: '5521999990047', telefone: '(21) 3456-7836', horario: 'Seg a Sáb, 9h às 20h', lat: -22.8278, lng: -43.0537, cepPrefixos: ['244','245','246'] },

    /* --- MG --- */
    { id: 'mg-juizdefora', nome: 'Juiz de Fora', cidade: 'Juiz de Fora', uf: 'MG', endereco: 'Av. Rio Branco, 3500, Centro, Juiz de Fora/MG', whatsapp: '5532999990048', telefone: '(32) 3456-7837', horario: 'Seg a Sáb, 9h às 19h', lat: -21.7587, lng: -43.3441, cepPrefixos: ['360','361','362'] },
    { id: 'mg-contagem', nome: 'Contagem', cidade: 'Contagem', uf: 'MG', endereco: 'Av. João César de Oliveira, 2200, Eldorado, Contagem/MG', whatsapp: '5531999990049', telefone: '(31) 3456-7838', horario: 'Seg a Sáb, 9h às 20h', lat: -19.9314, lng: -44.0537, cepPrefixos: ['320','321','322'] },
    { id: 'mg-betim', nome: 'Betim', cidade: 'Betim', uf: 'MG', endereco: 'Av. Edméia Mattos Lazzarotti, 1200, Centro, Betim/MG', whatsapp: '5531999990050', telefone: '(31) 3456-7839', horario: 'Seg a Sáb, 9h às 19h', lat: -19.9686, lng: -44.1985, cepPrefixos: ['325','326'] },
    { id: 'mg-montesclaros', nome: 'Montes Claros', cidade: 'Montes Claros', uf: 'MG', endereco: 'Av. Cula Mangabeira, 1300, Centro, Montes Claros/MG', whatsapp: '5538999990051', telefone: '(38) 3456-7840', horario: 'Seg a Sáb, 9h às 19h', lat: -16.7355, lng: -43.8654, cepPrefixos: ['394'] },

    /* --- RS --- */
    { id: 'rs-canoas', nome: 'Canoas', cidade: 'Canoas', uf: 'RS', endereco: 'Av. Guilherme Schell, 5000, Centro, Canoas/RS', whatsapp: '5551999990052', telefone: '(51) 3456-7841', horario: 'Seg a Sáb, 9h às 19h', lat: -29.9189, lng: -51.1841, cepPrefixos: ['921','922'] },
    { id: 'rs-pelotas', nome: 'Pelotas', cidade: 'Pelotas', uf: 'RS', endereco: 'Rua Marechal Floriano, 800, Centro, Pelotas/RS', whatsapp: '5553999990053', telefone: '(53) 3456-7842', horario: 'Seg a Sáb, 9h às 19h', lat: -31.7654, lng: -52.3370, cepPrefixos: ['960','961','962'] },
    { id: 'rs-santamaria', nome: 'Santa Maria', cidade: 'Santa Maria', uf: 'RS', endereco: 'Rua do Acampamento, 350, Centro, Santa Maria/RS', whatsapp: '5555999990054', telefone: '(55) 3456-7843', horario: 'Seg a Sáb, 9h às 19h', lat: -29.6842, lng: -53.8069, cepPrefixos: ['971'] },

    /* --- PR --- */
    { id: 'pr-maringa', nome: 'Maringá', cidade: 'Maringá', uf: 'PR', endereco: 'Av. Brasil, 4500, Centro, Maringá/PR', whatsapp: '5544999990055', telefone: '(44) 3456-7844', horario: 'Seg a Sáb, 9h às 19h', lat: -23.4253, lng: -51.9385, cepPrefixos: ['870','871'] },
    { id: 'pr-cascavel', nome: 'Cascavel', cidade: 'Cascavel', uf: 'PR', endereco: 'Av. Brasil, 6800, Centro, Cascavel/PR', whatsapp: '5545999990056', telefone: '(45) 3456-7845', horario: 'Seg a Sáb, 9h às 19h', lat: -24.9555, lng: -53.4555, cepPrefixos: ['858'] },
    { id: 'pr-pontagrossa', nome: 'Ponta Grossa', cidade: 'Ponta Grossa', uf: 'PR', endereco: 'Av. Vicente Machado, 600, Centro, Ponta Grossa/PR', whatsapp: '5542999990057', telefone: '(42) 3456-7846', horario: 'Seg a Sáb, 9h às 19h', lat: -25.0945, lng: -50.1633, cepPrefixos: ['840','841'] },

    /* --- SC --- */
    { id: 'sc-blumenau', nome: 'Blumenau', cidade: 'Blumenau', uf: 'SC', endereco: 'Rua XV de Novembro, 1500, Centro, Blumenau/SC', whatsapp: '5547999990058', telefone: '(47) 3456-7847', horario: 'Seg a Sáb, 9h às 19h', lat: -26.9194, lng: -49.0660, cepPrefixos: ['890','891'] },
    { id: 'sc-chapeco', nome: 'Chapecó', cidade: 'Chapecó', uf: 'SC', endereco: 'Av. Getúlio Vargas, 2200, Centro, Chapecó/SC', whatsapp: '5549999990059', telefone: '(49) 3456-7848', horario: 'Seg a Sáb, 9h às 19h', lat: -27.0962, lng: -52.6184, cepPrefixos: ['898'] },
    { id: 'sc-criciuma', nome: 'Criciúma', cidade: 'Criciúma', uf: 'SC', endereco: 'Av. Centenário, 1700, Centro, Criciúma/SC', whatsapp: '5548999990060', telefone: '(48) 3456-7849', horario: 'Seg a Sáb, 9h às 19h', lat: -28.6783, lng: -49.3699, cepPrefixos: ['888','889'] },

    /* --- BA --- */
    { id: 'ba-feiradesantana', nome: 'Feira de Santana', cidade: 'Feira de Santana', uf: 'BA', endereco: 'Av. Getúlio Vargas, 1900, Centro, Feira de Santana/BA', whatsapp: '5575999990061', telefone: '(75) 3456-7850', horario: 'Seg a Sáb, 9h às 19h', lat: -12.2664, lng: -38.9663, cepPrefixos: ['440'] },
    { id: 'ba-itabuna', nome: 'Itabuna', cidade: 'Itabuna', uf: 'BA', endereco: 'Av. Cinquentenário, 750, Centro, Itabuna/BA', whatsapp: '5573999990062', telefone: '(73) 3456-7851', horario: 'Seg a Sáb, 9h às 19h', lat: -14.7858, lng: -39.2803, cepPrefixos: ['456'] },
    { id: 'ba-salvador-barra', nome: 'Salvador Barra', cidade: 'Salvador', uf: 'BA', endereco: 'Av. Sete de Setembro, 3000, Barra, Salvador/BA', whatsapp: '5571999990063', telefone: '(71) 3456-7852', horario: 'Seg a Sáb, 9h às 20h', lat: -13.0019, lng: -38.5286, cepPrefixos: ['401','402'] },

    /* --- PE --- */
    { id: 'pe-caruaru', nome: 'Caruaru', cidade: 'Caruaru', uf: 'PE', endereco: 'Av. Agamenon Magalhães, 500, Maurício de Nassau, Caruaru/PE', whatsapp: '5581999990064', telefone: '(81) 3456-7853', horario: 'Seg a Sáb, 9h às 19h', lat: -8.2828, lng: -35.9760, cepPrefixos: ['550'] },
    { id: 'pe-olinda', nome: 'Olinda', cidade: 'Olinda', uf: 'PE', endereco: 'Av. Getúlio Vargas, 800, Casa Caiada, Olinda/PE', whatsapp: '5581999990065', telefone: '(81) 3456-7854', horario: 'Seg a Sáb, 9h às 20h', lat: -8.0089, lng: -34.8553, cepPrefixos: ['530','531','532','533','534','535','536','537','538','539','540','541','542','543','544','545','546','547','548','549'] },

    /* --- CE --- */
    { id: 'ce-juazeiro', nome: 'Juazeiro do Norte', cidade: 'Juazeiro do Norte', uf: 'CE', endereco: 'Av. Padre Cícero, 2200, Centro, Juazeiro do Norte/CE', whatsapp: '5588999990066', telefone: '(88) 3456-7855', horario: 'Seg a Sáb, 9h às 19h', lat: -7.2156, lng: -39.3157, cepPrefixos: ['630'] },
    { id: 'ce-fortaleza-meireles', nome: 'Fortaleza Meireles', cidade: 'Fortaleza', uf: 'CE', endereco: 'Av. Beira Mar, 3500, Meireles, Fortaleza/CE', whatsapp: '5585999990067', telefone: '(85) 3456-7856', horario: 'Seg a Sáb, 9h às 20h', lat: -3.7281, lng: -38.5044, cepPrefixos: ['605','606'] },

    /* --- GO --- */
    { id: 'go-aparecida', nome: 'Aparecida de Goiânia', cidade: 'Aparecida de Goiânia', uf: 'GO', endereco: 'Av. Independência, 1200, Centro, Aparecida de Goiânia/GO', whatsapp: '5562999990068', telefone: '(62) 3456-7857', horario: 'Seg a Sáb, 9h às 19h', lat: -16.8214, lng: -49.2461, cepPrefixos: ['748','749'] },
    { id: 'go-anapolis', nome: 'Anápolis', cidade: 'Anápolis', uf: 'GO', endereco: 'Av. Brasil Sul, 1500, Centro, Anápolis/GO', whatsapp: '5562999990069', telefone: '(62) 3456-7858', horario: 'Seg a Sáb, 9h às 19h', lat: -16.3281, lng: -48.9533, cepPrefixos: ['750'] },

    /* --- DF --- */
    { id: 'df-taguatinga', nome: 'Brasília Taguatinga', cidade: 'Brasília', uf: 'DF', endereco: 'QNL 12, Conjunto F, Taguatinga, Brasília/DF', whatsapp: '5561999990070', telefone: '(61) 3456-7859', horario: 'Seg a Sáb, 9h às 20h', lat: -15.8328, lng: -48.0428, cepPrefixos: ['720','721'] },
  ],

  /* --------- PROCEDIMENTOS ---------
     Categorizado por segmento. Em produção, vir da API.
  */
  procedimentos: {
    estetica: [
      { id: 'rejuv-facial-4d', nome: 'Rejuvenescimento Facial 4D', sub: 'Tecnologia premium para resultados visíveis em poucas sessões.', popular: true, img: 'assets/img/proc-rejuv-facial.jpg' },
      { id: 'full-face', nome: 'Full Face', sub: 'Tratamento completo de rejuvenescimento da face.', popular: true, img: 'assets/img/proc-full-face.jpg' },
      { id: 'melasma', nome: 'Melasma', sub: 'Clareamento de manchas profundas e persistentes.', popular: true },
      { id: 'cicatriz-acne', nome: 'Cicatriz de Acne', sub: 'Suavização e remodelamento de cicatrizes.' },
      { id: 'acne-ativa', nome: 'Acne Ativa', sub: 'Controle de acne em atividade com laser.' },
      { id: 'bb-glow', nome: 'BB Glow', sub: 'Pele uniforme com efeito de base natural.' },
      { id: 'cicatriz-corporal', nome: 'Cicatriz Corporal', sub: 'Tratamento de cicatrizes em qualquer parte do corpo.' },
      { id: 'clareamento-virilha', nome: 'Clareamento de Virilha, Axila e Coxa', sub: 'Uniformização de áreas íntimas e sensíveis.' },
      { id: 'reducao-foliculite', nome: 'Redução de Foliculite', sub: 'Eliminação de pelos encravados e foliculite.' },
      { id: 'black-peel', nome: 'Black Peel', sub: 'Peeling profundo para renovação completa.' },
      { id: 'lip-glow', nome: 'Lip Glow', sub: 'Lábios mais coradinhos e uniformes.' },
      { id: 'manchas-corporais', nome: 'Manchas Corporais', sub: 'Remoção de manchas em qualquer parte do corpo.' },
      { id: 'micose-unha', nome: 'Micose de Unha', sub: 'Tratamento eficaz com laser para micose ungueal.' },
      { id: 'remocao-micropigmentacao', nome: 'Remoção de Micropigmentação', sub: 'Remoção precisa de pigmentos antigos.' },
      { id: 'remocao-tatuagem', nome: 'Remoção de Tatuagem', sub: 'Laser Q-Switch para remoção segura de tatuagens.' },
      { id: 'rejuv-colo-pescoco', nome: 'Rejuvenescimento de Colo e Pescoço', sub: 'Suavização de linhas e textura no colo.' },
      { id: 'rejuv-maos', nome: 'Rejuvenescimento das Mãos', sub: 'Mãos com aparência mais jovem e uniforme.' },
      { id: 'renew-seven-7d', nome: 'Renew Seven 7D', sub: 'Protocolo de sete frentes em uma única sessão.' },
      { id: 'rosaceas', nome: 'Rosáceas', sub: 'Controle de vermelhidão e capilares dilatados.' },
      { id: 'pdrn', nome: 'PDRN', sub: 'Bioestimulação celular com PDRN.' },
      { id: 'renew-seven-exossomos', nome: 'Renew Seven com PDRN e Exossomos', sub: 'Protocolo premium com tecnologia regenerativa.' },
    ],
    depilacao: [
      { id: 'dep-axila', nome: 'Axila', sub: 'Depilação a laser na axila.', popular: true, img: 'assets/img/proc-axila.jpg' },
      { id: 'dep-virilha', nome: 'Virilha Completa', sub: 'Virilha total com tecnologia segura.', popular: true },
      { id: 'dep-perna', nome: 'Perna Inteira', sub: 'Depilação completa das pernas.', popular: true, img: 'assets/img/proc-costas.jpg' },
      { id: 'dep-meia-perna', nome: 'Meia Perna', sub: 'Depilação da metade inferior das pernas.' },
      { id: 'dep-costas', nome: 'Costas', sub: 'Costas inteiras com laser.' },
      { id: 'dep-barba', nome: 'Faixa de Barba', sub: 'Definição e redução da barba.' },
      { id: 'dep-rosto', nome: 'Rosto', sub: 'Pelos faciais com precisão.' },
      { id: 'dep-buco', nome: 'Buço', sub: 'Pelos do buço removidos com cuidado.' },
      { id: 'dep-torax', nome: 'Tórax', sub: 'Tórax inteiro a laser.' },
      { id: 'dep-perianal', nome: 'Perianal', sub: 'Área perianal com tecnologia premium.' },
      { id: 'dep-gluteos', nome: 'Glúteos Completos', sub: 'Depilação completa dos glúteos.' },
      { id: 'dep-coxas', nome: 'Coxas', sub: 'Coxas inteiras com laser.' },
      { id: 'dep-cabeca', nome: 'Cabeça', sub: 'Couro cabeludo depilação personalizada.' },
      { id: 'dep-bracos', nome: 'Braços Inteiros', sub: 'Braços completos com tecnologia premium.' },
    ],
    ultrassom: [
      { id: 'us-papada', nome: 'Papada', sub: 'Redução de papada com ultrassom Ultracel.', popular: true, img: 'assets/img/proc-papada.jpg' },
      { id: 'us-abdomen', nome: 'Abdômen', sub: 'Redefinição abdominal sem cortes.', img: 'assets/img/proc-abdomen.jpg' },
      { id: 'us-bichectomia', nome: 'Bichectomia sem cortes', sub: 'Redução de bochechas com ultrassom.' },
      { id: 'us-bigode-chines', nome: 'Bigode Chinês', sub: 'Suavização dos sulcos nasolabiais.' },
      { id: 'us-bracos', nome: 'Braços', sub: 'Firmeza e contorno dos braços.' },
      { id: 'us-colo', nome: 'Colo', sub: 'Rejuvenescimento do colo com ultrassom.' },
      { id: 'us-culote', nome: 'Externo de Coxa (Culote)', sub: 'Redução de culote sem cortes.' },
      { id: 'us-flancos', nome: 'Flancos', sub: 'Modelagem de flancos com ultrassom.' },
      { id: 'us-fox-eyes', nome: 'Fox Eyes', sub: 'Levantamento de canto dos olhos.' },
      { id: 'us-full-face', nome: 'Full Face', sub: 'Lifting completo da face com ultrassom.' },
      { id: 'us-gluteos', nome: 'Glúteos', sub: 'Levantamento de glúteos sem cortes.' },
      { id: 'us-intimo', nome: 'Rejuvenescimento Íntimo', sub: 'Rejuvenescimento da região íntima.' },
      { id: 'us-lifting', nome: 'Terço Inferior (Lifting)', sub: 'Lifting do terço inferior do rosto.' },
      { id: 'us-palpebras', nome: 'Pálpebras Completas', sub: 'Levantamento de pálpebras.' },
    ],
  },

  /* --------- TECNOLOGIAS / LASERS ---------
     Bloco "Tecnologia" da página de procedimentos
     Tecnologias oficiais conforme materiais da rede
  */
  lasers: [
    { sigla: 'Alexandrite', nome: 'Laser Alexandrite', desc: 'Padrão-ouro em depilação a laser. Resfriamento contínuo durante toda a sessão, velocidade superior e resultados duradouros.', img: 'assets/img/maquinas/alexandrite.jpg' },
    { sigla: 'ND-YAG', nome: 'Laser ND-YAG', desc: 'Comprimento de onda de 1064nm. Seguro para todos os fototipos da pele, da branca à negra, inclusive bronzeada.', img: 'assets/img/maquinas/nd-yag.jpg' },
    { sigla: 'Erbium', nome: 'Laser Erbium', desc: 'A mesma família do Fotona. Renovação profunda da pele, indicado para rejuvenescimento, cicatrizes e textura.', img: 'assets/img/maquinas/erbium.jpg' },
    { sigla: 'Q-Switched', nome: 'Laser Q-Switched', desc: 'Tecnologia premium para remoção de tatuagens, melasma, manchas profundas e micropigmentação.', img: 'assets/img/maquinas/q-switched.jpg' },
    { sigla: 'Ultracel', nome: 'Ultrassom Ultracel', desc: 'Lifting não-invasivo. Estimula colágeno em camadas profundas, bichectomia sem cortes, full face, papada e fox eyes.', img: 'assets/img/maquinas/ultracel.jpg' },
  ],

  /* --------- PROMOÇÕES DO MÊS ---------
     Em produção: GET /api/promocoes
  */
  promocoes: [
    { id: 'p1', titulo: 'Rejuvenescimento Facial 4D', desconto: '-40%', preco: 'R$ 397', precoOriginal: 'R$ 660', valida: '31 de Maio', procedimentoId: 'rejuv-facial-4d', destaque: true },
    { id: 'p2', titulo: 'Pacote Axila + Virilha + Meia Perna', desconto: '-50%', preco: 'R$ 249', precoOriginal: 'R$ 498', valida: '31 de Maio', procedimentoId: 'dep-axila' },
    { id: 'p3', titulo: 'Papada com Ultrassom', desconto: '-35%', preco: 'R$ 580', precoOriginal: 'R$ 890', valida: '31 de Maio', procedimentoId: 'us-papada' },
    { id: 'p4', titulo: 'Renew Seven com PDRN e Exossomos', desconto: '-25%', preco: 'R$ 1.490', precoOriginal: 'R$ 1.990', valida: '31 de Maio', procedimentoId: 'renew-seven-exossomos' },
  ],

  /* --------- VAGAS ---------
     Em produção: GET /api/vagas
  */
  vagas: [
    { id: 'v1', cidade: 'São Paulo, SP', funcao: 'Enfermeira Esteta', desc: 'Atendimento em clínica premium na zona oeste. Necessário COREN ativo e experiência mínima de 1 ano.', tipo: 'CLT', nivel: 'Pleno', destaque: true },
    { id: 'v2', cidade: 'Rio de Janeiro, RJ', funcao: 'Recepcionista', desc: 'Atendimento ao cliente, agendamento e suporte administrativo. Boa comunicação é essencial.', tipo: 'CLT', nivel: 'Júnior' },
    { id: 'v3', cidade: 'Belo Horizonte, MG', funcao: 'Esteticista', desc: 'Realização de procedimentos a laser e ultrassom. Curso técnico ou superior em estética.', tipo: 'CLT', nivel: 'Pleno' },
    { id: 'v4', cidade: 'Curitiba, PR', funcao: 'Gerente de Unidade', desc: 'Liderança de equipe, gestão de metas e operação da clínica. Experiência em gestão obrigatória.', tipo: 'CLT', nivel: 'Sênior', destaque: true },
    { id: 'v5', cidade: 'Porto Alegre, RS', funcao: 'Biomédica Esteta', desc: 'Aplicação de procedimentos avançados. CRBM ativo com habilitação em estética.', tipo: 'CLT', nivel: 'Pleno' },
    { id: 'v6', cidade: 'Salvador, BA', funcao: 'Consultora de Vendas', desc: 'Atendimento consultivo a clientes em clínica de alto padrão. Experiência em vendas premium.', tipo: 'CLT', nivel: 'Pleno' },
  ],

  /* --------- DEPOIMENTOS (CONTEÚDO DE EXEMPLO) ---------
     ⚠️ Estes são exemplos. Substituir por depoimentos reais
     com foto, nome e cidade antes da publicação definitiva,
     conforme exigido pelo roteiro.
  */
  depoimentos: [
    { nome: 'Marina S.', cidade: 'São Paulo, SP', texto: 'Fiz 6 sessões de rejuvenescimento facial 4D na unidade Vila Mariana e o resultado foi acima da expectativa. Pele uniforme, mais firme e com brilho saudável.', avatar: null, exemplo: true },
    { nome: 'Camila R.', cidade: 'Rio de Janeiro, RJ', texto: 'Atendimento impecável na unidade de Ipanema. Depilação a laser sem dor, super rápido. Já recomendei para todas as amigas.', avatar: null, exemplo: true },
    { nome: 'Patrícia M.', cidade: 'Belo Horizonte, MG', texto: 'O tratamento de melasma mudou minha vida. Anos tentando outras técnicas, em poucos meses na Laser & Co o resultado apareceu.', avatar: null, exemplo: true },
    { nome: 'Juliana A.', cidade: 'Curitiba, PR', texto: 'A papada com ultrassom microfocado foi um divisor de águas. Sem cortes, sem recuperação. O contorno do meu rosto ficou definido.', avatar: null, exemplo: true },
  ],

  /* --------- HERO CARROSSEL (3 a 5 banners, ordem aleatoria) ---------- */
  hero: [
    {
      id: 'premium',
      img: 'assets/img/hero.jpg',
      eyebrow: 'Estética & Depilação a Laser e Ultrassom',
      title: 'Estética premium,',
      titleItalic: 'acessível a todos.',
      sub: 'Laser, depilação e ultrassom em uma só rede. Procedimentos premium com parcelamento em até 12x sem juros.',
      ctaPrimary: { label: 'Agendar avaliação grátis', href: 'agendamento.html' },
      ctaGhost:   { label: 'Conhecer a rede',          href: '#sobre' },
    },
    {
      id: 'estetica',
      img: 'assets/img/estetica.jpg',
      eyebrow: 'Estética a Laser',
      title: '21 protocolos',
      titleItalic: 'para a sua pele.',
      sub: 'Rejuvenescimento 4D, melasma, manchas, cicatrizes e remoção de tatuagens. Tecnologia premium para resultados visíveis.',
      ctaPrimary: { label: 'Ver protocolos de estética', href: 'procedimentos.html?tab=estetica' },
      ctaGhost:   { label: 'Agendar avaliação',         href: 'agendamento.html' },
    },
    {
      id: 'depilacao',
      img: 'assets/img/depilacao.jpg',
      eyebrow: 'Depilação a Laser',
      title: 'Pele lisa,',
      titleItalic: 'sem dor e segura.',
      sub: 'Alexandrite e ND-YAG. Seguro para todos os fototipos da pele, do mais claro ao mais escuro. 14+ áreas tratadas.',
      ctaPrimary: { label: 'Ver áreas de depilação',  href: 'procedimentos.html?tab=depilacao' },
      ctaGhost:   { label: 'Agendar avaliação',       href: 'agendamento.html' },
    },
    {
      id: 'ultrassom',
      img: 'assets/img/ultrassom.jpg',
      eyebrow: 'Ultrassom Ultracel',
      title: 'Lifting',
      titleItalic: 'sem cortes.',
      sub: 'Papada, bichectomia, fox eyes e levantamento facial. 14 tratamentos com tecnologia microfocada.',
      ctaPrimary: { label: 'Ver tratamentos de ultrassom', href: 'procedimentos.html?tab=ultrassom' },
      ctaGhost:   { label: 'Agendar avaliação',            href: 'agendamento.html' },
    },
    {
      id: 'avaliacao',
      img: 'assets/img/hero.jpg',
      eyebrow: 'Sem compromisso',
      title: 'Avaliação gratuita',
      titleItalic: 'na unidade mais perto de você.',
      sub: 'Mais de 70 unidades em 15 estados. A franquia da sua região avalia sua pele e desenha o protocolo ideal.',
      ctaPrimary: { label: 'Agendar minha avaliação grátis', href: 'agendamento.html' },
      ctaGhost:   { label: 'Encontrar unidade',              href: 'unidades.html' },
    },
  ],

  /* --------- COMO FUNCIONA, 4 passos ----------
     icone: chave SVG (gerada inline pelo page-index.js a partir do
     dicionário ICONES_PASSOS) pra dar identidade visual a cada passo. */
  passos: [
    { n: '01', icone: 'spark',     titulo: 'Escolha o procedimento', desc: 'Navegue pelas nossas três frentes (estética, depilação ou ultrassom) e encontre o tratamento ideal.' },
    { n: '02', icone: 'map-pin',   titulo: 'Informe sua região',     desc: 'Selecione estado, cidade e a unidade Laser & Co mais próxima de você.' },
    { n: '03', icone: 'whatsapp',  titulo: 'Fale com a sua unidade', desc: 'A franquia da sua região recebe seu pedido e entra em contato direto pelo WhatsApp.' },
    { n: '04', icone: 'calendar-check', titulo: 'Comece agora',      desc: 'Avaliação rápida, sem compromisso. Você escolhe o melhor horário.', cta: { label: 'Agendar minha avaliação', href: 'agendamento.html' } },
  ],

  /* --------- REDES SOCIAIS (grid de 6 posts placeholder) ----------
     Quando o cliente liberar, substituir por embed real ou puxada
     via Instagram Graph API. Hoje cada card aponta pro perfil. */
  social: [
    { tipo: 'foto',  img: 'assets/img/proc-rejuv-facial.jpg', titulo: 'Rejuvenescimento 4D, antes e depois real',  href: 'https://instagram.com/lasercompanybrasil' },
    { tipo: 'video', img: 'assets/img/proc-papada.jpg',       titulo: 'Ultrassom de papada, em 60 segundos',         href: 'https://instagram.com/lasercompanybrasil' },
    { tipo: 'foto',  img: 'assets/img/proc-axila.jpg',        titulo: 'Depilação a laser, dúvidas frequentes',       href: 'https://instagram.com/lasercompanybrasil' },
    { tipo: 'video', img: 'assets/img/proc-full-face.jpg',    titulo: 'Full Face, protocolo completo passo a passo', href: 'https://instagram.com/lasercompanybrasil' },
    { tipo: 'foto',  img: 'assets/img/estetica.jpg',          titulo: 'Bastidores: nossa unidade Vila Mariana',      href: 'https://instagram.com/lasercompanybrasil' },
    { tipo: 'video', img: 'assets/img/proc-abdomen.jpg',      titulo: 'Ultrassom no abdômen, resultado em 3 sessões', href: 'https://instagram.com/lasercompanybrasil' },
  ],

  /* --------- BLOG (40 matérias reais importadas do site oficial) ----------
     Cada matéria linka para o post completo em lasercompany.com/blog/<slug>.
     A home embaralha o array e mostra 4 cards rotativos. */
  blog: [
    {
      id: 'o-pdrn-e-feito-mesmo-com-esperma-de-salmao',
      titulo: 'O PDRN é feito mesmo com esperma de Salmão?',
      preview: 'O PDRN (Polydeoxyribonucleotide) é uma molécula de origem natural que vem ganhando destaque na estética pelo seu alto poder de rejuvenescimento. Recentemente, seu uso combinado com tecnologias como',
      img: 'assets/img/blog/o-pdrn-e-feito-mesmo-com-esperma-de-salmao.jpg',
      url: 'https://www.lasercompany.com/blog/o-pdrn-e-feito-mesmo-com-esperma-de-salmao',
    },
    {
      id: 'quais-os-beneficios-do-pdrn-associado-ao-laser',
      titulo: 'Quais os benefícios do PDRN associado ao laser?',
      preview: 'O PDRN (Polydeoxyribonucleotide) é um ativo biotecnológico revolucionário extraído do DNA de peixes, como o salmão, e vem ganhando destaque em protocolos estéticos. Quando associado ao tratamento c',
      img: 'assets/img/blog/quais-os-beneficios-do-pdrn-associado-ao-laser.jpg',
      url: 'https://www.lasercompany.com/blog/quais-os-beneficios-do-pdrn-associado-ao-laser',
    },
    {
      id: 'exossomos-e-laser-beneficios-e-vantagens',
      titulo: 'Exossomos e laser: benefícios e vantagens',
      preview: 'Os exossomos são pequenas vesículas liberadas por células-tronco que carregam proteínas, lipídios e material genético essenciais para a comunicação celular e regeneração dos tecidos. Quando aplicad',
      img: null,
      url: 'https://www.lasercompany.com/blog/exossomos-e-laser-beneficios-e-vantagens',
    },
    {
      id: 'quais-as-vantagens-e-beneficios-do-rejuvenescimento-facial-a-laser',
      titulo: 'Quais as vantagens e benefícios do rejuvenescimento Facial à Laser?',
      preview: 'O rejuvenescimento facial a laser é uma das técnicas mais modernas e eficazes para quem busca recuperar a jovialidade da pele. Utilizando feixes de luz controlados, o laser estimula a produção de c',
      img: null,
      url: 'https://www.lasercompany.com/blog/quais-as-vantagens-e-beneficios-do-rejuvenescimento-facial-a-laser',
    },
    {
      id: 'aplicacao-do-pdrn-esperma-de-salmao-com-laser',
      titulo: 'Aplicação do PDRN (esperma de Salmão) com Laser',
      preview: 'O uso combinado de PDRN (polidesoxirribonucleotídeo), exossomos e laser tem revolucionado os tratamentos estéticos, promovendo regeneração celular profunda e resultados visivelmente mais eficazes.',
      img: 'assets/img/blog/aplicacao-do-pdrn-esperma-de-salmao-com-laser.jpg',
      url: 'https://www.lasercompany.com/blog/aplicacao-do-pdrn-esperma-de-salmao-com-laser',
    },
    {
      id: 'laser-para-todos-os-tons-de-pele-a-revolucao-da-laser-co',
      titulo: 'Laser para Todos os Tons de Pele: A Revolução da Laser&Co',
      preview: 'Na Laser&Co, temos orgulho de ser a primeira empresa a oferecer não apenas depilação, mas também uma gama completa de tratamentos estéticos a laser, como melasma, rejuvenescimento e ultrassom.',
      img: 'assets/img/blog/laser-para-todos-os-tons-de-pele-a-revolucao-da-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/laser-para-todos-os-tons-de-pele-a-revolucao-da-laser-co',
    },
    {
      id: 'ultrassom-revolucao-em-estetica-e-saude',
      titulo: 'Ultrassom: Revolução em Estética e Saúde',
      preview: 'Nos últimos anos, a tecnologia tem avançado de forma surpreendente, e uma das inovações que vem ganhando destaque é o ultrassom, especialmente o Ultrassom que utilizamos aqui na Anitta. Este tratam',
      img: 'assets/img/blog/ultrassom-revolucao-em-estetica-e-saude.jpg',
      url: 'https://www.lasercompany.com/blog/ultrassom-revolucao-em-estetica-e-saude',
    },
    {
      id: 'servicos-a-laser-ou-harmonizacao-facial-entenda-as-diferencas-e-por-que-escolher-os-tratamentos-a-laser-na-laser-co',
      titulo: 'Serviços a Laser ou Harmonização Facial: Entenda as Diferenças e Por Que Escolher os Tratamentos a Laser na Laser&Co',
      preview: 'Na Laser&Co, pioneira em estética a laser e ultrassom com mais de 40 unidades em 14 estados brasileiros, oferecemos um portfólio diversificado de tratamentos para atender a todas as suas ne',
      img: 'assets/img/blog/servicos-a-laser-ou-harmonizacao-facial-entenda-as-diferencas-e-por-que-escolher-os-tratamentos-a-laser-na-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/servicos-a-laser-ou-harmonizacao-facial-entenda-as-diferencas-e-por-que-escolher-os-tratamentos-a-laser-na-laser-co',
    },
    {
      id: 'alem-de-depilar-descubra-os-tratamentos-exclusivos-para-a-regiao-intima-na-laser-co',
      titulo: 'Além de Depilar: Descubra os Tratamentos Exclusivos para a Região Íntima na Laser&Co',
      preview: 'Na Laser&Co, a inovação e a tecnologia de ponta são nossas marcas registradas. Como pioneiros no Brasil no uso de laser e ultrassom em estética, estamos constantemente em expansão para levar o',
      img: 'assets/img/blog/alem-de-depilar-descubra-os-tratamentos-exclusivos-para-a-regiao-intima-na-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/alem-de-depilar-descubra-os-tratamentos-exclusivos-para-a-regiao-intima-na-laser-co',
    },
    {
      id: 'quais-os-beneficios-de-realizar-anualmente-o-seu-pacote-de-rejuvenescimento-facial',
      titulo: 'Quais os Benefícios de Realizar Anualmente o Seu Pacote de Rejuvenescimento Facial?',
      preview: 'Você já se perguntou como manter sua pele sempre jovem e radiante? Na Laser&Co, entendemos que a busca por uma pele rejuvenescida e saudável é uma prioridade para muitos de nossos clientes. É p',
      img: 'assets/img/blog/quais-os-beneficios-de-realizar-anualmente-o-seu-pacote-de-rejuvenescimento-facial.jpg',
      url: 'https://www.lasercompany.com/blog/quais-os-beneficios-de-realizar-anualmente-o-seu-pacote-de-rejuvenescimento-facial',
    },
    {
      id: 'ja-pensou-em-ser-um-franqueado-laser-co',
      titulo: 'Já pensou em ser um franqueado Laser&Co?',
      preview: 'Você já imaginou fazer parte de um projeto que está transformando o setor de estética e bem-estar no Brasil? A Laser&Co, pioneira em clínicas de estética e depilação a laser e ultrassom, está e',
      img: 'assets/img/blog/ja-pensou-em-ser-um-franqueado-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/ja-pensou-em-ser-um-franqueado-laser-co',
    },
    {
      id: 'rejuvenescimento-facial-descubra-os-melhores-tratamentos-esteticos',
      titulo: 'Rejuvenescimento facial: descubra os melhores tratamentos estéticos!',
      preview: 'O avançar da idade pode trazer novas emoções e desafios para as pessoas, principalmente para lidar com as mudanças do corpo e da pele. Como forma de estimular a autoestima e o envelhecimento saudáv',
      img: 'assets/img/blog/rejuvenescimento-facial-descubra-os-melhores-tratamentos-esteticos.jpg',
      url: 'https://www.lasercompany.com/blog/rejuvenescimento-facial-descubra-os-melhores-tratamentos-esteticos',
    },
    {
      id: 'homens-podem-fazer-procedimento-estetico-na-laser-co',
      titulo: 'Homens Podem Fazer Procedimento Estético na Laser&Co?',
      preview: 'Na Laser&Co, a primeira e mais abrangente rede de serviços estéticos a laser e ultrassom do Brasil, estamos comprometidos em oferecer cuidados de qualidade para todos, incluindo os homens. Cada',
      img: 'assets/img/blog/homens-podem-fazer-procedimento-estetico-na-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/homens-podem-fazer-procedimento-estetico-na-laser-co',
    },
    {
      id: 'qual-a-importancia-das-marcacoes-para-o-ultrassom-micro-e-macrofocado-na-laser-co',
      titulo: 'Qual a importância das marcações para o Ultrassom Micro e Macrofocado na Laser&Co',
      preview: 'Na Laser&Co, pioneira e líder em serviços estéticos a laser e ultrassom no Brasil, entendemos que a precisão é fundamental para garantir resultados eficazes e seguros em tratamentos como o ultr',
      img: 'assets/img/blog/qual-a-importancia-das-marcacoes-para-o-ultrassom-micro-e-macrofocado-na-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/qual-a-importancia-das-marcacoes-para-o-ultrassom-micro-e-macrofocado-na-laser-co',
    },
    {
      id: 'como-eliminar-a-flacidez-na-laser-co-tecnologia-avancada-para-resultados-visiveis',
      titulo: 'Como Eliminar a Flacidez na Laser&Co: Tecnologia Avançada para Resultados Visíveis',
      preview: 'A flacidez é uma preocupação comum entre homens e mulheres de todas as idades, resultante da perda de elasticidade da pele e do enfraquecimento das fibras de colágeno e elastina. Na Laser & Com',
      img: 'assets/img/blog/como-eliminar-a-flacidez-na-laser-co-tecnologia-avancada-para-resultados-visiveis.jpg',
      url: 'https://www.lasercompany.com/blog/como-eliminar-a-flacidez-na-laser-co-tecnologia-avancada-para-resultados-visiveis',
    },
    {
      id: 'descubra-o-ultracel-na-laser-co-avanco-revolucionario-em-rejuvenescimento-estetico',
      titulo: 'Descubra o Ultracel na Laser&Co: Avanço Revolucionário em Rejuvenescimento Estético',
      preview: 'Na Laser & Company, líder em serviços estéticos a laser e ultrassom, com mais de 40 unidades espalhadas por 14 estados brasileiros, estamos entusiasmados em apresentar o Ultracel, o ultrassom m',
      img: 'assets/img/blog/descubra-o-ultracel-na-laser-co-avanco-revolucionario-em-rejuvenescimento-estetico.jpg',
      url: 'https://www.lasercompany.com/blog/descubra-o-ultracel-na-laser-co-avanco-revolucionario-em-rejuvenescimento-estetico',
    },
    {
      id: 'beneficios-dos-procedimentos-esteticos-a-laser-na-laser-co',
      titulo: 'Benefícios dos Procedimentos Estéticos a Laser na Laser&Co',
      preview: 'Os avanços na tecnologia a laser revolucionaram o campo da estética, oferecendo uma gama de tratamentos eficazes para melhorar a saúde e a aparência da pele. Na Laser&Co, como a primeira rede d',
      img: 'assets/img/blog/beneficios-dos-procedimentos-esteticos-a-laser-na-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/beneficios-dos-procedimentos-esteticos-a-laser-na-laser-co',
    },
    {
      id: 'cuidados-pos-cicatriz-cirurgica-como-a-laser-co-pode-ajudar-na-recuperacao',
      titulo: 'Cuidados Pós Cicatriz Cirúrgica: Como a Laser&Co pode ajudar na recuperação?',
      preview: 'Após qualquer procedimento cirúrgico, cuidar adequadamente das cicatrizes é essencial, para promover uma recuperação rápida e minimizar qualquer desconforto ou complicações. Na Laser&Co, como l',
      img: 'assets/img/blog/cuidados-pos-cicatriz-cirurgica-como-a-laser-co-pode-ajudar-na-recuperacao.jpg',
      url: 'https://www.lasercompany.com/blog/cuidados-pos-cicatriz-cirurgica-como-a-laser-co-pode-ajudar-na-recuperacao',
    },
    {
      id: 'foliculite-o-que-e-como-funciona-e-tem-tratamento',
      titulo: 'Foliculite: O que é, como funciona e tem tratamento?',
      preview: 'A foliculite é uma condição de pele que afeta pessoas de todas as idades, causando desconforto e irritação. Entender o que é a foliculite, como ela ocorre e quais são os tratamentos disponíveis pod',
      img: 'assets/img/blog/foliculite-o-que-e-como-funciona-e-tem-tratamento.jpg',
      url: 'https://www.lasercompany.com/blog/foliculite-o-que-e-como-funciona-e-tem-tratamento',
    },
    {
      id: 'por-que-algumas-peles-sao-mais-propensas-a-terem-estrias-do-que-outras-2',
      titulo: 'Por que algumas peles são mais propensas a terem estrias do que outras?',
      preview: 'As estrias são um problema comum da pele, afetando homens e mulheres de todas as idades. Elas geralmente aparecem como linhas finas e descoloridas na superfície da pele, e podem ser causadas por um',
      img: 'assets/img/blog/por-que-algumas-peles-sao-mais-propensas-a-terem-estrias-do-que-outras-2.jpg',
      url: 'https://www.lasercompany.com/blog/por-que-algumas-peles-sao-mais-propensas-a-terem-estrias-do-que-outras-2',
    },
    {
      id: 'deixando-sua-regiao-intima-mais-jovem-e-bonita-com-a-laser-co',
      titulo: 'Deixando sua região íntima mais jovem e bonita com a Laser&Co',
      preview: 'Se há algo que todos valorizam é a confiança e o conforto em nosso próprio corpo. E, é claro, nossa região íntima não é exceção. Afinal, a autoestima e o bem-estar vêm de sentir-se bem consigo mesm',
      img: 'assets/img/blog/deixando-sua-regiao-intima-mais-jovem-e-bonita-com-a-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/deixando-sua-regiao-intima-mais-jovem-e-bonita-com-a-laser-co',
    },
    {
      id: 'acne-na-adolescencia-causas-tratamentos-e-dicas-de-prevencao',
      titulo: 'Acne na Adolescência: Causas, Tratamentos e Dicas de Prevenção',
      preview: 'A adolescência é uma fase de muitas mudanças, tanto físicas quanto emocionais. Entre essas mudanças, a acne é uma das mais comuns e, muitas vezes, uma das mais incômodas. Entender as causas, os tra',
      img: 'assets/img/blog/acne-na-adolescencia-causas-tratamentos-e-dicas-de-prevencao.jpg',
      url: 'https://www.lasercompany.com/blog/acne-na-adolescencia-causas-tratamentos-e-dicas-de-prevencao',
    },
    {
      id: 'quais-cuidados-ter-com-a-pele-para-mante-la-saudavel',
      titulo: 'Quais cuidados ter com a pele para mantê-la saudável?',
      preview: 'A saúde da nossa pele é fundamental para o nosso bem-estar e autoconfiança. Afinal, a pele é o maior órgão do nosso corpo e desempenha um papel crucial na proteção contra agentes externos, regulaçã',
      img: 'assets/img/blog/quais-cuidados-ter-com-a-pele-para-mante-la-saudavel.jpg',
      url: 'https://www.lasercompany.com/blog/quais-cuidados-ter-com-a-pele-para-mante-la-saudavel',
    },
    {
      id: 'por-que-e-importante-repor-o-colageno-apos-os-30-anos',
      titulo: 'Por que é importante repor o colágeno após os 30 anos?',
      preview: 'Ao alcançarmos os 30 anos, muitas mudanças começam a ocorrer em nosso corpo, e uma delas é a diminuição na produção de colágeno. O colágeno é uma proteína essencial que mantém a elasticidade e a fi',
      img: 'assets/img/blog/por-que-e-importante-repor-o-colageno-apos-os-30-anos.webp',
      url: 'https://www.lasercompany.com/blog/por-que-e-importante-repor-o-colageno-apos-os-30-anos',
    },
    {
      id: 'a-laser-co-completa-2-anos',
      titulo: 'A Laser&Co completa 2 anos!',
      preview: 'Estamos comemorando 2 anos de dedicação à estética a laser! Celebrar marcos como esse é sempre gratificante e demonstra o comprometimento da empresa com seus clientes. Agradecemos a todos que fizer',
      img: 'assets/img/blog/a-laser-co-completa-2-anos.webp',
      url: 'https://www.lasercompany.com/blog/a-laser-co-completa-2-anos',
    },
    {
      id: 'o-laser-como-solucao-para-diminuicao-das-manchas-de-melasma',
      titulo: 'O laser como solução para diminuição das manchas de Melasma.',
      preview: 'O Melasma é caracterizado por manchas que aparecem no rosto do cliente, geralmente ligado a fatores hormonais, como a gravidez em mulheres, ou, ainda, pela excessiva exposição solar.',
      img: 'assets/img/blog/o-laser-como-solucao-para-diminuicao-das-manchas-de-melasma.webp',
      url: 'https://www.lasercompany.com/blog/o-laser-como-solucao-para-diminuicao-das-manchas-de-melasma',
    },
    {
      id: 'porque-na-laser-co-a-depilacao-tem-apenas-5-sessoes',
      titulo: 'Porque na Laser&Co a depilação tem apenas 5 sessões?',
      preview: 'Quando falamos em depilação, é comum vermos as redes comercializando pacotes de 10 sessões, sendo que, em muitos casos, nem as 10 sessões são suficientes para auferir o resultado de depilação desej',
      img: 'assets/img/blog/porque-na-laser-co-a-depilacao-tem-apenas-5-sessoes.webp',
      url: 'https://www.lasercompany.com/blog/porque-na-laser-co-a-depilacao-tem-apenas-5-sessoes',
    },
    {
      id: 'por-que-so-depilar-se-voce-pode-ainda-clarear-e-rejuvenescer',
      titulo: 'Por que só depilar se você pode ainda clarear e rejuvenescer?',
      preview: 'A depilação a laser é o tratamento de depilação mais difundido no Brasil e no mundo, sendo que 80% destes procedimentos são para depilação da região da virilha e perianal. Ocorre que, grande',
      img: 'assets/img/blog/por-que-so-depilar-se-voce-pode-ainda-clarear-e-rejuvenescer.webp',
      url: 'https://www.lasercompany.com/blog/por-que-so-depilar-se-voce-pode-ainda-clarear-e-rejuvenescer',
    },
    {
      id: 'ultraformer-iii-x-ultracel',
      titulo: 'Ultraformer III x UltraCel',
      preview: 'Quando falamos em procedimentos estéticos, não podemos deixar de lado os tratamentos com Ultrassom, uma vez que, ao contrário dos lasers, que atuam normalmente nas camadas mais',
      img: 'assets/img/blog/ultraformer-iii-x-ultracel.webp',
      url: 'https://www.lasercompany.com/blog/ultraformer-iii-x-ultracel',
    },
    {
      id: 'fazer-tratamentos-a-laser-e-caro',
      titulo: 'Fazer tratamentos a Laser é caro?',
      preview: 'Quando falamos de tratamentos a laser, tratamos do que há de mais moderno em tratamentos estéticos, normalmente resguardado para poucas pessoas que podem pagar caros tratamentos em médicos e dermat',
      img: 'assets/img/blog/fazer-tratamentos-a-laser-e-caro.jpg',
      url: 'https://www.lasercompany.com/blog/fazer-tratamentos-a-laser-e-caro',
    },
    {
      id: 'conhece-o-exclusivo-clube-de-fidelidade-da-laser-co',
      titulo: 'Conhece o exclusivo Clube de Fidelidade da Laser&Co?',
      preview: 'Você é cliente da Laser&Co, contratou serviços a Laser mas tem curiosidade para saber como funcionam outros tratamentos a Laser? Então nosso clube de fidelidade é perfeito para você.',
      img: 'assets/img/blog/conhece-o-exclusivo-clube-de-fidelidade-da-laser-co.webp',
      url: 'https://www.lasercompany.com/blog/conhece-o-exclusivo-clube-de-fidelidade-da-laser-co',
    },
    {
      id: 'como-funciona-o-rejuvenescimento-facial-a-laser',
      titulo: 'Como funciona o Rejuvenescimento Facial a Laser?',
      preview: 'O Rejuvenescimento Facial a Laser é o tratamento a laser mais buscado na Laser&Co, mas muita gente tem uma série de dúvidas de como é esse tratamento, quais os benef',
      img: 'assets/img/blog/como-funciona-o-rejuvenescimento-facial-a-laser.webp',
      url: 'https://www.lasercompany.com/blog/como-funciona-o-rejuvenescimento-facial-a-laser',
    },
    {
      id: 'como-reduzir-minha-papada-sem-cirurgia',
      titulo: 'Como reduzir minha papada sem cirurgia?',
      preview: 'A gordura na região do pescoço, a famosa "papada", sem dúvidas, é grande causa de incômodo para quem a possui, que fazem tudo que é tipo de proc',
      img: 'assets/img/blog/como-reduzir-minha-papada-sem-cirurgia.webp',
      url: 'https://www.lasercompany.com/blog/como-reduzir-minha-papada-sem-cirurgia',
    },
    {
      id: 'porque-ser-cliente-da-laser-co',
      titulo: 'Porque ser cliente da Laser&Co?',
      preview: 'Quando falamos de futuro e modernidade em tratamentos estéticos, lembramos de tratamentos a laser, sem dúvida, a última palavra em termos de resultado, praticidade e segurança',
      img: 'assets/img/blog/porque-ser-cliente-da-laser-co.webp',
      url: 'https://www.lasercompany.com/blog/porque-ser-cliente-da-laser-co',
    },
    {
      id: 'doi-aplicar-laser',
      titulo: 'Dói aplicar laser?',
      preview: 'O laser nada mais é do que uma concentração de "luz" em diversas frequências, onde cada frequência dá nome a cada tipo de laser, que tem sua finalidade específica.',
      img: 'assets/img/blog/doi-aplicar-laser.webp',
      url: 'https://www.lasercompany.com/blog/doi-aplicar-laser',
    },
    {
      id: 'pele-10-anos-mais-nova-combinacao-do-laser-e-do-ultrassom',
      titulo: 'Pele 10 anos mais nova: combinação do laser e do Ultrassom',
      preview: 'O sonho de qualquer um é ter a pele 10 anos mais jovem, sendo a busca pela juventude "eterna", e de forma natural, um dos pilares do segmento da estética, não sendo diferente da estética a laser.',
      img: 'assets/img/blog/pele-10-anos-mais-nova-combinacao-do-laser-e-do-ultrassom.webp',
      url: 'https://www.lasercompany.com/blog/pele-10-anos-mais-nova-combinacao-do-laser-e-do-ultrassom',
    },
    {
      id: 'flacidez-e-estrias-podem-ser-tratadas-com-tecnologia-a-laser-e-ultrassom',
      titulo: 'Flacidez e estrias podem ser tratadas com tecnologia a laser e Ultrassom',
      preview: 'Uma das coisas que mais incomodam os brasileiros são a flacidez e as estrias, que aparecem especialmente quando há um processo de emagrecimento muito grande, ou durante a gravidez, podendo aparecer',
      img: 'assets/img/blog/flacidez-e-estrias-podem-ser-tratadas-com-tecnologia-a-laser-e-ultrassom.webp',
      url: 'https://www.lasercompany.com/blog/flacidez-e-estrias-podem-ser-tratadas-com-tecnologia-a-laser-e-ultrassom',
    },
    {
      id: 'ultrassom-com-os-melhores-resultados-do-mercado-conheca-o-ultracel',
      titulo: 'Ultrassom com os melhores resultados do mercado: Conheça o UltraCel',
      preview: 'O Ultrassom é o complemento perfeito para todos os tratamentos a laser, pois atua em outras camadas do corpo, como músculo, flacidez e gordura localizada, enquanto os lasers atuam nas c',
      img: 'assets/img/blog/ultrassom-com-os-melhores-resultados-do-mercado-conheca-o-ultracel.webp',
      url: 'https://www.lasercompany.com/blog/ultrassom-com-os-melhores-resultados-do-mercado-conheca-o-ultracel',
    },
    {
      id: 'por-que-renew-seven-e-um-dos-procedimentos-mais-procurados-na-laser-co',
      titulo: 'Por que RENEW SEVEN é um dos procedimentos mais procurados na Laser&Co?',
      preview: 'Já pensou poder usufruir dos benefícios de SETE PROCEDIMENTOS em APENAS UM? ISTO É INCRÍVEL! Com o RENEW SEVEN é assim. Nosso SERVIÇO OURO te proporciona 7 etapas profundas em um procedimento, que',
      img: 'assets/img/blog/por-que-renew-seven-e-um-dos-procedimentos-mais-procurados-na-laser-co.jpg',
      url: 'https://www.lasercompany.com/blog/por-que-renew-seven-e-um-dos-procedimentos-mais-procurados-na-laser-co',
    },
    {
      id: 'black-peel-2',
      titulo: 'Black Peel',
      preview: 'Conhece o tratamento de pele das ESTRELAS, o Black Peel da Laser & Co?',
      img: 'assets/img/blog/black-peel-2.webp',
      url: 'https://www.lasercompany.com/blog/black-peel-2',
    },
  ],

  /* --------- ESTATÍSTICAS DA REDE ---------- */
  stats: {
    unidades: 70,
    estados: 15,
    visitasMes: 60000,
    expansaoEuropa: true,
  },

  /* --------- INSTITUCIONAL ---------- */
  marca: {
    nome: 'Laser & Co',
    razaoSocial: 'Laser Company Brasil',
    cnpj: '53.078.691/0001-07',
    conceito: 'Estética premium acessível a todos',
    socia: 'Anitta',
    fundador: 'Rafael Estevez',
    centroTreinamento: 'Laser Academy',
  },

  contato: {
    whatsapp: '5511947764057',
    whatsappFmt: '(11) 94776-4057',
    sac: 'sac@lasercompany.com',
    expansao: 'expansao@lasercompany.com',
    enderecoSede: 'Rua Alvorada, 1047, Vila Olímpia, São Paulo/SP, CEP 04550-004',
    instagram: 'lasercompanybrasil',
    facebook: 'laserecoficial',
  },

  pagamento: {
    cartao: 'Aceitamos todos os cartões, parcelamento em até 12x sem juros',
    boleto: 'Boleto em até 24x (consulte condições)',
    pix: 'Pix com desconto à vista',
    avaliacao: 'Avaliação gratuita em todas as unidades',
  },

};

/* Função utilitária, buscar procedimento por id */
window.LaserData.findProcedimento = function(id) {
  const cats = ['estetica', 'depilacao', 'ultrassom'];
  for (const c of cats) {
    const found = this.procedimentos[c].find(p => p.id === id);
    if (found) return { ...found, categoria: c };
  }
  return null;
};

/* Função utilitária, todos os procedimentos populares */
window.LaserData.getPopulares = function() {
  const result = [];
  ['estetica', 'depilacao', 'ultrassom'].forEach(cat => {
    this.procedimentos[cat].forEach(p => {
      if (p.popular) result.push({ ...p, categoria: cat });
    });
  });
  return result;
};
