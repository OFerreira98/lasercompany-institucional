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
    { id: 'jatiuca-maceio-al', nome: 'Jatiúca', cidade: 'Maceió', uf: 'AL', endereco: 'Avenida Doutor Antônio Gomes de Barros, 637, LJ 04 - Jatiúca - Maceió/AL, 57036-001', horario: 'Segunda: 08h às 19h e Sábado: 08h às 16h. Domingo: Fechado', whatsapp: '5582991509502', whatsappFmt: '(82) 99150-9502', instagram: 'laserco.jatiuca', email: 'jatiuca@lasercompany.com', foto: 'assets/img/unidades/jatiuca-maceio-al.jpeg', lat: -9.6476843, lng: -35.7339264, cepPrefixos: ['570'] },
    { id: 'shopping-ponta-negra-manaus-am', nome: 'Shopping Ponta Negra', cidade: 'Manaus', uf: 'AM', endereco: 'Avenida Coronel Teixeira, 5705, Loja 31B e 32.2 - Ponta Negra - Manaus/AM, 69037-000', horario: 'Segunda/ Sábado: 10h às 22h Domingo: 14h às 21h', whatsapp: '5592981111170', whatsappFmt: '(92) 98111-1170', instagram: 'laserco.pontanegra', email: 'pontanegra@lasercompany.com', foto: 'assets/img/unidades/shopping-ponta-negra-manaus-am.jpeg', lat: -3.1316333, lng: -59.9825041, cepPrefixos: ['690'] },
    { id: 'jua-garden-shopping-juazeiro-ba', nome: 'Juá Garden Shopping', cidade: 'Juazeiro', uf: 'BA', endereco: 'Rodovia BR-407, 5318 - Distrito Industrial - Juazeiro/BA, 48909-901', horario: 'Segunda a Sábado: 10h às 22h / Domingo: 14h às 20h', whatsapp: '557499396474', whatsappFmt: '(74) 99396-474', instagram: 'laserco.juagardenshopping', email: 'juagarden@lasercompany.com', foto: 'assets/img/unidades/jua-garden-shopping-juazeiro-ba.png', lat: -9.5137512, lng: -40.3078985, cepPrefixos: ['489'] },
    { id: 'fortaleza-aldeota-ce', nome: 'Fortaleza', cidade: 'Aldeota', uf: 'CE', endereco: 'Rua Desembargador Leite Albuquerque, 1057 , Loja 03 - Aldeota - Fortaleza/CE, 60150-150', horario: 'Segunda a sábado: 09h às 20h', whatsapp: '5585981171464', whatsappFmt: '(85) 98117-1464', instagram: 'laserco.aldeota', email: 'aldeota@lasercompany.com', foto: 'assets/img/unidades/fortaleza-aldeota-ce.jpg', lat: -3.7341528, lng: -38.5096997, cepPrefixos: ['601'] },
    { id: 'alto-da-gloria-goiania-go', nome: 'Alto da Glória', cidade: 'Goiânia', uf: 'GO', endereco: 'Avenida Engenheiro Eurico Viana, 114, Quadra 03 Lote 08 - Alto da Glória - Goiânia/GO, 74815-725', horario: 'Segunda/Sexta: 8h às 19h. Sábado: 8h às 13h.', whatsapp: '556296335583', whatsappFmt: '(62) 96335-583', instagram: 'laserco.altodagloria.go', email: 'altodagloria@lasercompany.com', foto: 'assets/img/unidades/alto-da-gloria-goiania-go.jpg', lat: -16.680882, lng: -49.2532691, cepPrefixos: ['748'] },
    { id: 'setor-marista-goiania-go', nome: 'Setor Marista', cidade: 'Goiânia', uf: 'GO', endereco: 'Alameda Ricardo Paranhos, 140 , Quadra 225, Lote 03 - Setor Marista - Goiânia/GO, 74175-020', horario: 'Segunda a sexta-feira: das 09h às 18h / Sábado: das 08h às 12h', whatsapp: '556298107205', whatsappFmt: '(62) 98107-205', instagram: 'laserco.setormarista', email: 'setormarista@lasercompany.com', foto: 'assets/img/unidades/setor-marista-goiania-go.jpg', lat: -16.680882, lng: -49.2532691, cepPrefixos: ['741'] },
    { id: 'lourdes-belo-horizonte-mg', nome: 'Lourdes', cidade: 'Belo Horizonte', uf: 'MG', endereco: 'Rua Alvarenga Peixoto, 974 - Santo Agostinho - Belo Horizonte/MG, 30180-121', horario: 'Segunda à Sexta: 09h às 20h. Sábado: 09h às 16h30.', whatsapp: '5531996010070', whatsappFmt: '(31) 99601-0070', instagram: 'laserco.lourdesbh', email: 'lourdesbh@lasercompany.com', foto: 'assets/img/unidades/lourdes-belo-horizonte-mg.jpeg', lat: -19.9295897, lng: -43.9494303, cepPrefixos: ['301'] },
    { id: 'goiabeiras-shopping-cuiaba-mt', nome: 'Goiabeiras Shopping', cidade: 'Cuiabá', uf: 'MT', endereco: 'Avenida José Monteiro de Figueiredo, 500, Loja 12 - Duque de Caxias - Cuiabá/MT, 78043-300', horario: 'Segunda/ Sábado: 8h às 22h.', whatsapp: '5565992751675', whatsappFmt: '(65) 99275-1675', instagram: 'laserco.goiabeiras', email: 'goiabeiras@lasercompany.com', foto: 'assets/img/unidades/goiabeiras-shopping-cuiaba-mt.jpeg', lat: -15.5986686, lng: -56.0991301, cepPrefixos: ['780'] },
    { id: 'shopping-sinop-sinop-mt', nome: 'Shopping Sinop', cidade: 'Sinop', uf: 'MT', endereco: 'Avenida Alexandre Ferronato, 800, Loja 05 - Setor Industrial - Sinop/MT, 78557-247', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5566992343991', whatsappFmt: '(66) 99234-3991', instagram: 'laserco.sinopshopping', email: 'sinopshopping@lasercompany.com', foto: 'assets/img/unidades/shopping-sinop-sinop-mt.jpeg', lat: -11.857701, lng: -55.4967824, cepPrefixos: ['785'] },
    { id: 'pantanal-shopping-cuiaba-mt', nome: 'Pantanal Shopping', cidade: 'Cuiabá', uf: 'MT', endereco: 'Avenida Historiador Rubens de Mendonça, 3300, Loja 04 - Bosque da Saúde - Cuiabá/MT, 78050-973', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5565993541156', whatsappFmt: '(65) 99354-1156', instagram: 'laserco.pantanalshopping', email: 'pantanalshopping@lasercompany.com', foto: 'assets/img/unidades/pantanal-shopping-cuiaba-mt.jpeg', lat: -15.5986686, lng: -56.0991301, cepPrefixos: ['780'] },
    { id: 'jardim-das-americas-cuiaba-mt', nome: 'Jardim das Américas', cidade: 'Cuiabá', uf: 'MT', endereco: 'Rua Montevidéu, 352 - Jardim das Américas - Cuiabá/MT, 78060-589', horario: 'Segunda - Sexta 08h - 18h / Sábado 08h - 17h/ Domingo fechado.', whatsapp: '5565996770836', whatsappFmt: '(65) 99677-0836', instagram: 'laserco.jardimdasamericas', email: 'jardimdasamericas@lasercompany.com', foto: 'assets/img/unidades/jardim-das-americas-cuiaba-mt.jpeg', lat: -15.5986686, lng: -56.0991301, cepPrefixos: ['780'] },
    { id: 'para-parauapebas-pa', nome: 'Pará', cidade: 'Parauapebas', uf: 'PA', endereco: 'Partage Parauapebas - Rodovia Dr. Faisal Salmen, 7380, KM 61,6 - Loja 208 - Alvorá - Parauapebas/PA, 68515-000', horario: 'Segunda a sábado: das 10h às 22h Domingo: das 14h às 20h', whatsapp: '5594991964455', whatsappFmt: '(94) 99196-4455', instagram: 'laserco.parauapebas', email: 'paraupebas@lasercompany.com', foto: 'assets/img/unidades/para-parauapebas-pa.jpg', lat: -6.0696846, lng: -49.8903283, cepPrefixos: ['685'] },
    { id: 'caruaru-pe-pe', nome: 'Caruaru', cidade: 'PE', uf: 'PE', endereco: 'Avenida Professor José Leão, 448, Loja 1 - Maurício de Nassau - Caruaru/PE, 55012-070', horario: 'Segunda/ Sexta: 09h às 20h Sábado: 09h às 18h', whatsapp: '5587999058127', whatsappFmt: '(87) 99905-8127', instagram: '', email: 'caruaru@lasercompany.com', foto: 'assets/img/unidades/caruaru-pe-pe.jpg', lat: -7.5617238, lng: -34.9952357, cepPrefixos: ['550'] },
    { id: 'petrolina-pe-pe', nome: 'Petrolina', cidade: 'PE', uf: 'PE', endereco: 'Avenida da Integração, 210 - Vila Eduardo - Petrolina/PE, 56328-010', horario: 'Segunda a sábado: das 8h às 18h', whatsapp: '5587988395454', whatsappFmt: '(87) 98839-5454', instagram: 'laserco.petrolina', email: 'petrolina@lasercompany.com', foto: 'assets/img/unidades/petrolina-pe-pe.jpg', lat: -9.3932831, lng: -40.4841279, cepPrefixos: ['563'] },
    { id: 'maringa-pr-pr', nome: 'Maringá', cidade: 'PR', uf: 'PR', endereco: 'Avenida Carlos Gomes, 75 , Zona 5 - Zona 05 - Maringá/PR, 87015-200', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5544991529397', whatsappFmt: '(44) 99152-9397', instagram: 'laserco.catuaimaringa', email: 'catuaimaringa@lasercompany.com', foto: 'assets/img/unidades/maringa-pr-pr.jpeg', lat: -23.3522969, lng: -51.1605812, cepPrefixos: ['870'] },
    { id: 'shopping-sao-jose-sao-jose-dos-pinhais-pr', nome: 'Shopping São José', cidade: 'São José dos Pinhais', uf: 'PR', endereco: 'Rua Izabel a Redentora, 1434, Loja 276 - Centro - São José dos Pinhais/PR, 83005-010', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 11h às 20h.', whatsapp: '5541992235566', whatsappFmt: '(41) 99223-5566', instagram: 'laserco.saojoseshopping', email: 'saojoseshopping@lasercompany.com', foto: 'assets/img/unidades/shopping-sao-jose-sao-jose-dos-pinhais-pr.jpeg', lat: -25.533816, lng: -49.2072163, cepPrefixos: ['830'] },
    { id: 'shopping-metropolitano-barra-rio-de-janeiro-rj', nome: 'Shopping Metropolitano Barra', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Avenida Embaixador Abelardo Bueno, 1300 , Piso L2 - Barra Olímpica - Rio de Janeiro/RJ, 22775-040', horario: 'Segunda a sábado: 10h às 22h | Domingos e feriados: 11h às 22h', whatsapp: '5521995316966', whatsappFmt: '(21) 99531-6966', instagram: 'laserco.metropolitanobarra', email: 'metropolitanobarra@lasercompany.com', foto: 'assets/img/unidades/shopping-metropolitano-barra-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['227'] },
    { id: 'park-campo-grande-rio-de-janeiro-rj', nome: 'Park Campo Grande', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Estrada do Monteiro, 1.200 , LUC Nº 206-E - Campo Grande - Rio de Janeiro/RJ, 23045-830', horario: '"Segunda a Sábado: 10h às 22h Domingo e Feriados: 12h às 21h"', whatsapp: '5521997972834', whatsappFmt: '(21) 99797-2834', instagram: 'laserco.parkcampogrande', email: 'parkcampogrande@lasercompany.com', foto: 'assets/img/unidades/park-campo-grande-rio-de-janeiro-rj.jpeg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['230'] },
    { id: 'park-jacarepagua-rio-de-janeiro-rj', nome: 'Park Jacarepaguá', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Estrada de Jacarepaguá, 6069 , LUC 212-B - Anil - Rio de Janeiro/RJ, 22753-033', horario: 'Segunda a Sábado: 10h às 22h / Domingo e Feriados: 13h às 21h', whatsapp: '5521967811472', whatsappFmt: '(21) 96781-1472', instagram: 'laserco.parkjacarepagua', email: 'parkjacarepagua@lasercompany.com', foto: 'assets/img/unidades/park-jacarepagua-rio-de-janeiro-rj.jpeg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['227'] },
    { id: 'botafogo-praia-shopping-rio-de-janeiro-rj', nome: 'Botafogo Praia Shopping', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Praia Botafogo, 400, Loja 235 - Botafogo - Rio de Janeiro/RJ, 22250-040', horario: 'Segunda a Sábado: 10h às 22h Domingo e Feriados: 13h às 21h', whatsapp: '5521997972167', whatsappFmt: '(21) 99797-2167', instagram: 'laserco.botafogo', email: 'botafogo@lasercompany.com', foto: 'assets/img/unidades/botafogo-praia-shopping-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['222'] },
    { id: 'shopping-nova-america-rio-de-janeiro-rj', nome: 'Shopping Nova América', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Avenida Pastor Martin Luther King Jr, 126 , Loja 1559 - Del Castilho - Rio de Janeiro/RJ, 20765-000', horario: 'Segunda a Sábado: 10h às 22h Domingo e Feriados: 13h às 21h', whatsapp: '5521966133726', whatsappFmt: '(21) 96613-3726', instagram: 'laserco.novaamerica', email: 'novaamerica@lasercompany.com', foto: 'assets/img/unidades/shopping-nova-america-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['207'] },
    { id: 'carioca-shopping-rio-de-janeiro-rj', nome: 'Carioca Shopping', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Avenida Vicente de Carvalho, 909, LUC 135 - Vicente de Carvalho - Rio de Janeiro/RJ, 21210-000', horario: 'Segunda a sábado: 10h às 22h Domingos e feriados: 13h às 21h', whatsapp: '5521997972936', whatsappFmt: '(21) 99797-2936', instagram: 'laserco.cariocashopping', email: 'cariocashopping@lasercompany.com', foto: 'assets/img/unidades/carioca-shopping-rio-de-janeiro-rj.png', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['212'] },
    { id: 'americas-shopping-rio-de-janeiro-rj', nome: 'Américas Shopping', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Avenida das Américas, 15500, Loja 0147, Piso 1 - Recreio dos Bandeirantes - Rio de Janeiro/RJ, 22790-702', horario: 'Seg a Sáb: 10h às 22h | Dom e Feriados: 13h às 21h', whatsapp: '5521997972190', whatsappFmt: '(21) 99797-2190', instagram: 'laserco.americasshopping', email: 'americas@lasercompany.com', foto: 'assets/img/unidades/americas-shopping-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['227'] },
    { id: 'shopping-nova-iguacu-nova-iguacu-rj', nome: 'Shopping Nova Iguaçu', cidade: 'Nova Iguaçu', uf: 'RJ', endereco: 'Av. Abílio Augusto Távora, 1.111 , Loja 4057 - Bairro da Luz - Nova Iguaçu/RJ, 26260-04', horario: '"Segunda a Sábado: 10h às 22h Domingo e Feriados: 13h às 21h"', whatsapp: '5521997971652', whatsappFmt: '(21) 99797-1652', instagram: 'laserco.novaiguacu', email: 'novaiguacu@lasercompany.com', foto: 'assets/img/unidades/shopping-nova-iguacu-nova-iguacu-rj.jpg', lat: -22.7592175, lng: -43.4508728, cepPrefixos: [] },
    { id: 'boulevard-vila-isabel-rio-de-janeiro-rj', nome: 'Boulevard Vila Isabel', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'R. Barão de São Francisco, 236 , Loja 2-276 - Vila Isabel - Rio de Janeiro/RJ, 20560-030', horario: '"Segunda a Sábado: 10h às 22h Domingo e Feriados: 13h às 21h"', whatsapp: '5521997516742', whatsappFmt: '(21) 99751-6742', instagram: 'laserco.boulevardrj', email: 'boulevardrj@lasercompany.com', foto: 'assets/img/unidades/boulevard-vila-isabel-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['205'] },
    { id: 'caxias-shopping-rio-de-janeiro-rj', nome: 'Caxias Shopping', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Rodovia Washington Luiz, 2895, Andar 2, Letra 201 N - Parque Duque - Duque de Caxias/RJ, 25085-008', horario: 'Seg a Sáb: 10h às 22h | Dom e Feriados: 13h às 21h', whatsapp: '5521996792180', whatsappFmt: '(21) 99679-2180', instagram: 'laserco.caxiasshopping', email: 'caxias@lasercompany.com', foto: 'assets/img/unidades/caxias-shopping-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['250'] },
    { id: 'shopping-tijuca-rio-de-janeiro-rj', nome: 'Shopping Tijuca', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Avenida Maracanã, 987, LUC: STJ02066 - Tijuca - Rio de Janeiro/RJ, 20511-000', horario: 'Segunda a Sábado 10 às 22h • Domingos e Feriados 13h às 20h', whatsapp: '5521997972504', whatsappFmt: '(21) 99797-2504', instagram: 'laserco.tijucashopping', email: 'tijucashopping@lasercompany.com', foto: 'assets/img/unidades/shopping-tijuca-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['205'] },
    { id: 'partage-sao-goncalo-rio-de-janeiro-rj', nome: 'Partage São Gonçalo', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Avenida Presidente Kennedy, 425 - Centro - São Gonçalo/RJ, 24445-000', horario: 'Seg a Sáb: 10h às 22h | Dom e Feriados: 13h às 21h', whatsapp: '5521997972123', whatsappFmt: '(21) 99797-2123', instagram: 'laserco.partagesg', email: 'partagesg@lasercompany.com', foto: 'assets/img/unidades/partage-sao-goncalo-rio-de-janeiro-rj.jpg', lat: -22.8215546, lng: -43.0426517, cepPrefixos: ['244'] },
    { id: 'shopping-da-gavea-rio-de-janeiro-rj', nome: 'Shopping da Gávea', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Rua Marquês de São Vicente, 52 , Loja 115, 1º Piso - Gávea - Rio de Janeiro/RJ, 22451-040', horario: 'Segunda a Sábado: 10h às 22h Domingos e Feriados: 14h às 21h', whatsapp: '5521996792608', whatsappFmt: '(21) 99679-2608', instagram: 'laserco.rj', email: 'gaveashopping@lasercompany.com', foto: 'assets/img/unidades/shopping-da-gavea-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['224'] },
    { id: 'plaza-niteroi-rio-de-janeiro-rj', nome: 'Plaza Niterói', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Rua Quinze de Novembro, 4 , - Loja SPN0259B 2º Piso - Centro - Niterói/RJ, 24020-125', horario: 'Segunda a Sábado 10h às 22h | Domingos e Feriados: 13h às 21h', whatsapp: '5521999384515', whatsappFmt: '(21) 99938-4515', instagram: 'laserco.rj', email: 'niteroiplaza@lasercompany.com', foto: 'assets/img/unidades/plaza-niteroi-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['240'] },
    { id: 'park-lagos-shopping-cabo-frio-rj', nome: 'Park Lagos Shopping', cidade: 'Cabo Frio', uf: 'RJ', endereco: 'Rua Henrique Terra, 1700, Loja: 139 - Parque Burle - Cabo Frio/RJ, 28911-320', horario: 'seg a sáb das 10hs às 22hs e domingo das 13hs às 21hs', whatsapp: '5522999277997', whatsappFmt: '(22) 99927-7997', instagram: 'laserco.parklagos', email: 'parklagosshopping@lasercompany.com', foto: 'assets/img/unidades/park-lagos-shopping-cabo-frio-rj.jpg', lat: -22.8804369, lng: -42.0189227, cepPrefixos: ['289'] },
    { id: 'shopping-grande-rio-rio-de-janeiro-rj', nome: 'Shopping Grande Rio', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'R. Maria Soares Sendas , 111 , LUC 305 - Parque Barreto - São João de Meriti/RJ, 25575-825', horario: 'Segunda a sábado: 10h às 22h Domingos e feriados: 13h às 21h', whatsapp: '5521995962097', whatsappFmt: '(21) 99596-2097', instagram: 'laserco.rj', email: 'granderio@lasercompany.com', foto: 'assets/img/unidades/shopping-grande-rio-rio-de-janeiro-rj.jpg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['255'] },
    { id: 'shopping-downtown-rio-de-janeiro-rj', nome: 'Shopping Downtown', cidade: 'Rio de Janeiro', uf: 'RJ', endereco: 'Avenida das Américas, 500, Bloco 4 Loja 121 - Barra da Tijuca - Rio de Janeiro/RJ, 22640-904', horario: 'Segunda a sábado: das 10h às 22h Domingo: das 12h às 18h', whatsapp: '5521973955050', whatsappFmt: '(21) 97395-5050', instagram: 'laserco.downtownshopping', email: 'downtownshopping@lasercompany.com', foto: 'assets/img/unidades/shopping-downtown-rio-de-janeiro-rj.jpeg', lat: -22.9110137, lng: -43.2093727, cepPrefixos: ['226'] },
    { id: 'garden-shopping-boa-vista-rr', nome: 'Garden Shopping', cidade: 'Boa Vista', uf: 'RR', endereco: 'Avenida Ville Roy, 1544 - Caçari - Boa Vista/RR, 69307-725', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14 às 20h.', whatsapp: '559581179595', whatsappFmt: '(95) 81179-595', instagram: 'laserco.gardenboavista', email: 'boavista@lasercompany.com', foto: 'assets/img/unidades/garden-shopping-boa-vista-rr.jpeg', lat: 2.8457865, lng: -60.6509931, cepPrefixos: ['693'] },
    { id: 'patio-24-porto-alegre-rs', nome: 'Pátio 24', cidade: 'Porto Alegre', uf: 'RS', endereco: 'Rua Vinte e Quatro de Outubro, 1454 - Auxiliadora - Porto Alegre/RS, 90510-001', horario: 'Segunda/ Sábado: 9h às 20h.', whatsapp: '555191721529', whatsappFmt: '(51) 91721-529', instagram: 'laserco.patio24', email: 'patio24@lasercompany.com', foto: 'assets/img/unidades/patio-24-porto-alegre-rs.jpeg', lat: -30.0220601, lng: -51.1948305, cepPrefixos: ['905'] },
    { id: 'gramado-gramado-rs', nome: 'Gramado', cidade: 'Gramado', uf: 'RS', endereco: 'Avenida Borges de Medeiros, 3285, lj 03 box 12 - Centro - Gramado/RS, 95670-092', horario: 'Segunda 09h às 20h/ Sábado 09 ás 17h', whatsapp: '5554992305950', whatsappFmt: '(54) 99230-5950', instagram: 'laserco.gramado', email: 'gramado@lasercompany.com', foto: 'assets/img/unidades/gramado-gramado-rs.jpeg', lat: -29.3792858, lng: -50.8737019, cepPrefixos: ['956'] },
    { id: 'parkshopping-canoas-canoas-rs', nome: 'ParkShopping Canoas', cidade: 'Canoas', uf: 'RS', endereco: 'Avenida Farroupilha, 4545 , Loja 3095 - Marechal Rondon - Canoas/RS, 92020-475', horario: 'Segunda a sábado: das 10h às 22h Domingos e feriados: das 14h às 20h', whatsapp: '5551992032202', whatsappFmt: '(51) 99203-2202', instagram: 'laserco.parkshoppingcanoas', email: 'parkshoppingcanoas@lasercompany.com', foto: 'assets/img/unidades/parkshopping-canoas-canoas-rs.jpg', lat: -29.9216045, lng: -51.1799525, cepPrefixos: ['920'] },
    { id: 'praia-de-belas-porto-alegre-rs', nome: 'Praia de Belas', cidade: 'Porto Alegre', uf: 'RS', endereco: 'Avenida Praia de Belas, 1181 - Praia de Belas - Porto Alegre/RS, 90110-001', horario: 'Segunda a Sábado 10h às 22h/ Domingos e Feriados 14h às 20h', whatsapp: '555198012721', whatsappFmt: '(51) 98012-721', instagram: 'laserco.praiadebelas', email: 'praiadebelas@lasercompany.com', foto: 'assets/img/unidades/praia-de-belas-porto-alegre-rs.png', lat: -30.0496165, lng: -51.2287325, cepPrefixos: ['901'] },
    { id: 'iguatemi-poa-porto-alegre-rs', nome: 'Iguatemi Poa', cidade: 'Porto Alegre', uf: 'RS', endereco: 'Avenida João Wallig, 1800 , Loja 1236 - Jardim Europa - Porto Alegre/RS, 91349-900', horario: 'Segunda a sábado: das 10h às 22h Domingos e feriados: das 14h às 20h', whatsapp: '555121032816', whatsappFmt: '(51) 21032-816', instagram: 'laserco.iguatemipoa', email: 'iguatemipoa@lasercompany.com', foto: 'assets/img/unidades/iguatemi-poa-porto-alegre-rs.jpeg', lat: -30.0324999, lng: -51.2303767, cepPrefixos: ['913'] },
    { id: 'florianopolis-centro-florianopolis-sc', nome: 'Florianópolis Centro', cidade: 'Florianópolis', uf: 'SC', endereco: 'Rua Dom Jaime Câmara, 245 , Loja 01 - Centro - Florianópolis/SC, 88015-120', horario: '"Segunda a Sexta: 08h às 20h Sábado: 08h às 18h"', whatsapp: '5548988037845', whatsappFmt: '(48) 98803-7845', instagram: 'laserco.florianopoliscentro', email: 'floripacentro@lasercompany.com', foto: 'assets/img/unidades/florianopolis-centro-florianopolis-sc.jpg', lat: -27.5973002, lng: -48.5496098, cepPrefixos: ['880'] },
    { id: 'mogi-shopping-mogi-das-cruzes-sp', nome: 'Mogi Shopping', cidade: 'Mogi das Cruzes', uf: 'SP', endereco: 'Avenida Vereador Narciso Yague Guimarães, 1001, Loja 1218 - Centro Cívico - Mogi das Cruzes/SP, 08780-000', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511947767478', whatsappFmt: '(11) 94776-7478', instagram: 'laserco.mogishopping', email: 'mogidascruzes@lasercompany.com', foto: 'assets/img/unidades/mogi-shopping-mogi-das-cruzes-sp.jpg', lat: -23.5234284, lng: -46.1926671, cepPrefixos: ['087'] },
    { id: 'shopping-uniao-osasco-sp', nome: 'Shopping União', cidade: 'Osasco', uf: 'SP', endereco: 'Avenida dos Autonomistas, 1400, Loja 345 - Vila Yara - Osasco/SP, 06020-010', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511966200522', whatsappFmt: '(11) 96620-0522', instagram: 'laserco.uniaodeosasco', email: 'uniao.osasco@lasercompany.com', foto: 'assets/img/unidades/shopping-uniao-osasco-sp.jpg', lat: -23.5324859, lng: -46.7916801, cepPrefixos: ['060'] },
    { id: 'butanta-shopping-sao-paulo-sp', nome: 'Butantã Shopping', cidade: 'São Paulo', uf: 'SP', endereco: 'Avenida Professor Francisco Morato, 2718, Loja 132 - Térreo - Butantã - São Paulo/SP, 05512-300', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511974264868', whatsappFmt: '(11) 97426-4868', instagram: 'laserco.butanta', email: 'butanta@lasercompany.com', foto: 'assets/img/unidades/butanta-shopping-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['055'] },
    { id: 'shopping-campo-limpo-sao-paulo-sp', nome: 'Shopping Campo Limpo', cidade: 'São Paulo', uf: 'SP', endereco: 'Estrada do Campo Limpo, 459, Loja 266 - Vila Prel - São Paulo/SP, 05777-001', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511969198504', whatsappFmt: '(11) 96919-8504', instagram: 'laserco.campolimpo', email: 'campolimpo@lasercompany.com', foto: 'assets/img/unidades/shopping-campo-limpo-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['057'] },
    { id: 'shopping-frei-caneca-sao-paulo-sp', nome: 'Shopping Frei Caneca', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Frei Caneca, 569, Loja 236B/237 - Consolação - São Paulo/SP, 01307-001', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511994835527', whatsappFmt: '(11) 99483-5527', instagram: 'laserco.freicaneca', email: 'freicaneca@lasercompany.com', foto: 'assets/img/unidades/shopping-frei-caneca-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['013'] },
    { id: 'moema-passaros-sao-paulo-sp', nome: 'Moema Pássaros', cidade: 'São Paulo', uf: 'SP', endereco: 'Avenida Bem-te-vi, 112 - Moema - São Paulo/SP, 04524-030', horario: 'Segunda/ Sexta: 09h às 20h. Sábado: 09h às 18h.', whatsapp: '5511969143704', whatsappFmt: '(11) 96914-3704', instagram: 'laserco.moemapassaros', email: 'moemapassaros@lasercompany.com', foto: 'assets/img/unidades/moema-passaros-sao-paulo-sp.jpg', lat: -23.6069583, lng: -46.6694224, cepPrefixos: ['045'] },
    { id: 'mooca-plaza-shopping-sao-paulo-sp', nome: 'Mooca Plaza Shopping', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Capitão Pacheco e Chaves, 313, Loja 2062 - L2 - Vila Prudente - São Paulo/SP, 03126-000', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511935368800', whatsappFmt: '(11) 93536-8800', instagram: 'laserco.moocaplazashopping', email: 'moocaplazashopping@lasercompany.com', foto: 'assets/img/unidades/mooca-plaza-shopping-sao-paulo-sp.jpeg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['031'] },
    { id: 'shopping-sp-market-sao-paulo-sp', nome: 'Shopping SP Market', cidade: 'São Paulo', uf: 'SP', endereco: 'Avenida das Nações Unidas, 22540, Loja A3 - 28 - Vila Almeida - São Paulo/SP, 04795-000', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511963020845', whatsappFmt: '(11) 96302-0845', instagram: 'laserco.spmarket', email: 'spmarket@lasercompany.com', foto: 'assets/img/unidades/shopping-sp-market-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['047'] },
    { id: 'shopping-metro-tatuape-sao-paulo-sp', nome: 'Shopping Metrô Tatuapé', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Domingos Agostim, 91, Loja 13 T - Cidade Mãe do Céu - São Paulo/SP, 03306-010', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511913208502', whatsappFmt: '(11) 91320-8502', instagram: 'laserco.tatuape', email: 'tatuape@lasercompany.com', foto: 'assets/img/unidades/shopping-metro-tatuape-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['033'] },
    { id: 'shopping-metro-tucuruvi-sao-paulo-sp', nome: 'Shopping Metrô Tucuruvi', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Paranabi, 133, Loja 29 - Piso L4 - Tucuruvi - São Paulo/SP, 02307-120', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511913208711', whatsappFmt: '(11) 91320-8711', instagram: 'laserco.tucuruvi', email: 'tucuruvi@lasercompany.com', foto: 'assets/img/unidades/shopping-metro-tucuruvi-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['023'] },
    { id: 'loja-conceito-sao-paulo-sp', nome: 'Loja Conceito', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Alvorada, 1047 - Vila Olímpia - São Paulo/SP, 04550-004', horario: 'Segunda a Sexta: 09h às 20h. Sábado: 09h às 18h', whatsapp: '5511945744562', whatsappFmt: '(11) 94574-4562', instagram: 'laserco.lojaconceito', email: 'loja.conceito@lasercompany.com', foto: 'assets/img/unidades/loja-conceito-sao-paulo-sp.jpeg', lat: -23.5986837, lng: -46.6828843, cepPrefixos: ['045'] },
    { id: 'shopping-taboao-taboao-da-serra-sp', nome: 'Shopping Taboão', cidade: 'Taboão da Serra', uf: 'SP', endereco: 'Rodovia Regis Bittencourt, 2643 - Cidade Intercap - Taboão da Serra/SP, 06768-200', horario: 'Segunda/ Sábado: 10h às 22h. Domingo: 14h às 20h.', whatsapp: '5511966026555', whatsappFmt: '(11) 96602-6555', instagram: 'laserco.shoppingtaboao', email: 'taboaoshopping@lasercompany.com', foto: 'assets/img/unidades/shopping-taboao-taboao-da-serra-sp.jpeg', lat: -23.6121912, lng: -46.7790539, cepPrefixos: ['067'] },
    { id: 'vila-clementino-sao-paulo-sp', nome: 'Vila Clementino', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Luís Góis, 1240 - Mirandópolis - São Paulo/SP, 04043-100', horario: 'Segunda-sexta 09h às 21h/ Sábado 09 ás 18h', whatsapp: '5511942903040', whatsappFmt: '(11) 94290-3040', instagram: '', email: 'vilaclementino@lasercompany.com', foto: 'assets/img/unidades/vila-clementino-sao-paulo-sp.jpg', lat: -23.6039235, lng: -46.6397429, cepPrefixos: ['040'] },
    { id: 'santana-sao-paulo-sp', nome: 'Santana', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Alfredo Pujol, 159 , Loja 06 - Santana - São Paulo/SP, 02017-010', horario: 'Segunda 09h às 20h/ Sábado 09 ás 17h', whatsapp: '5511976989365', whatsappFmt: '(11) 97698-9365', instagram: 'laserco.santana', email: 'santana@lasercompany.com', foto: 'assets/img/unidades/santana-sao-paulo-sp.jpeg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['020'] },
    { id: 'shopping-west-plaza-sao-paulo-sp', nome: 'Shopping West Plaza', cidade: 'São Paulo', uf: 'SP', endereco: 'Av. Francisco Matarazzo, s/n - Água Branca, São Paulo - SP, 1º Piso , Bloco B - Água Branca - São Paulo/SP, 05003-020', horario: 'Seg / Sábado: 10h às 22h. Domingo: 14h às 20h', whatsapp: '5511988522398', whatsappFmt: '(11) 98852-2398', instagram: '', email: 'westplaza@lasercompany.com', foto: 'assets/img/unidades/shopping-west-plaza-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['050'] },
    { id: 'shopping-suzano-sao-paulo-sp', nome: 'Shopping Suzano', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Sete de Setembro, 555, Sala D16 - Parque Suzano - Suzano/SP, 08673-020', horario: 'Seg./ Sábado.: das 10h às 22 Domingos e feriados: 14h às 20h.', whatsapp: '5511910661200', whatsappFmt: '(11) 91066-1200', instagram: '', email: 'suzano@lasercompany.com', foto: 'assets/img/unidades/shopping-suzano-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['086'] },
    { id: 'tiete-plaza-shopping-sao-paulo-sp', nome: 'Tietê Plaza Shopping', cidade: 'São Paulo', uf: 'SP', endereco: 'Avenida Raimundo Pereira de Magalhães, 1465 , Loja 1007 - Jardim Íris - São Paulo/SP, 05145-000', horario: 'Segunda a sexta: 10h às 22h Domingos e feriados: 14h às 20h', whatsapp: '5511999615300', whatsappFmt: '(11) 99961-5300', instagram: 'laserco.tieteplaza', email: 'tieteplaza@lasercompany.com', foto: 'assets/img/unidades/tiete-plaza-shopping-sao-paulo-sp.jpg', lat: -23.5506507, lng: -46.6333824, cepPrefixos: ['051'] },
    { id: 'teodoro-sampaio-sao-paulo-sp', nome: 'Teodoro Sampaio', cidade: 'São Paulo', uf: 'SP', endereco: 'Rua Teodoro Sampaio, 2061 - Pinheiros - São Paulo/SP, 05405-200', horario: 'Segunda a sexta: das 09h às 19h Sábado: das 09h às 18h', whatsapp: '5511988220753', whatsappFmt: '(11) 98822-0753', instagram: 'laserco.teodorosampaio', email: 'teodorosampaio@lasercompany.com', foto: 'assets/img/unidades/teodoro-sampaio-sao-paulo-sp.png', lat: -23.5641241, lng: -46.688327, cepPrefixos: ['054'] },
    { id: 'jardim-das-colinas-sao-jose-dos-campos-sp', nome: 'Jardim das Colinas', cidade: 'São José dos Campos', uf: 'SP', endereco: 'Avenida Barão do Rio Branco, 1100 - Jardim Esplanada II - São José dos Campos/SP, 12242-800', horario: 'Horário de funcionamento: Seg a sábado das 8:00 às 20:00', whatsapp: '5512996681330', whatsappFmt: '(12) 99668-1330', instagram: 'laserco.jardimdascolinas', email: 'jardimdascolinas@lasercompany.com', foto: 'assets/img/unidades/jardim-das-colinas-sao-jose-dos-campos-sp.jpg', lat: -23.1867782, lng: -45.8854538, cepPrefixos: ['122'] },
  ],

  /* --------- PROCEDIMENTOS ---------
     Categorizado por segmento. Em produção, vir da API.
  */
  procedimentos: {
    estetica: [
      { id: 'rejuv-facial-4d', nome: 'Rejuvenescimento Facial 4D', sub: 'Tecnologia premium para resultados visíveis em poucas sessões.', popular: true, img: 'assets/img/procedimentos/rejuv-facial-4d-img.jpg', video: 'assets/img/procedimentos/rejuv-facial-4d-video.mp4' },
      { id: 'full-face', nome: 'Full Face', sub: 'Tratamento completo de rejuvenescimento da face.', popular: true, img: 'assets/img/procedimentos/full-face-img.jpg', video: 'assets/img/procedimentos/full-face-video.mp4' },
      { id: 'melasma', nome: 'Melasma', sub: 'Clareamento de manchas profundas e persistentes.', popular: true, video: 'assets/img/procedimentos/melasma-video.mp4' },
      { id: 'cicatriz-acne', nome: 'Cicatriz de Acne', sub: 'Suavização e remodelamento de cicatrizes.', video: 'assets/img/procedimentos/cicatriz-acne-video.mp4' },
      { id: 'acne-ativa', nome: 'Acne Ativa', sub: 'Controle de acne em atividade com laser.', video: 'assets/img/procedimentos/acne-ativa-video.mp4' },
      { id: 'bb-glow', nome: 'BB Glow', sub: 'Pele uniforme com efeito de base natural.', img: 'assets/img/procedimentos/bb-glow-img.jpg', video: 'assets/img/procedimentos/bb-glow-video.mp4' },
      { id: 'cicatriz-corporal', nome: 'Cicatriz Corporal', sub: 'Tratamento de cicatrizes em qualquer parte do corpo.', img: 'assets/img/procedimentos/cicatriz-corporal-img.jfif', video: 'assets/img/procedimentos/cicatriz-corporal-video.mp4' },
      { id: 'clareamento-virilha', nome: 'Clareamento de Virilha, Axila e Coxa', sub: 'Uniformização de áreas íntimas e sensíveis.', img: 'assets/img/procedimentos/clareamento-virilha-img.jfif', video: 'assets/img/procedimentos/clareamento-virilha-video.mp4' },
      { id: 'reducao-foliculite', nome: 'Redução de Foliculite', sub: 'Eliminação de pelos encravados e foliculite.', img: 'assets/img/procedimentos/reducao-foliculite-img.png', video: 'assets/img/procedimentos/reducao-foliculite-video.mp4' },
      { id: 'black-peel', nome: 'Black Peel', sub: 'Peeling profundo para renovação completa.', img: 'assets/img/procedimentos/black-peel-img.jpg', video: 'assets/img/procedimentos/black-peel-video.mp4' },
      { id: 'lip-glow', nome: 'Lip Glow', sub: 'Lábios mais coradinhos e uniformes.', img: 'assets/img/procedimentos/lip-glow-img.jfif', video: 'assets/img/procedimentos/lip-glow-video.mp4' },
      { id: 'manchas-corporais', nome: 'Manchas Corporais', sub: 'Remoção de manchas em qualquer parte do corpo.' },
      { id: 'micose-unha', nome: 'Micose de Unha', sub: 'Tratamento eficaz com laser para micose ungueal.', video: 'assets/img/procedimentos/micose-unha-video.mp4' },
      { id: 'remocao-micropigmentacao', nome: 'Remoção de Micropigmentação', sub: 'Remoção precisa de pigmentos antigos.', img: 'assets/img/procedimentos/remocao-micropigmentacao-img.jfif', video: 'assets/img/procedimentos/remocao-micropigmentacao-video.mp4' },
      { id: 'remocao-tatuagem', nome: 'Remoção de Tatuagem', sub: 'Laser Q-Switch para remoção segura de tatuagens.', img: 'assets/img/procedimentos/remocao-tatuagem-img.jpg', video: 'assets/img/procedimentos/remocao-tatuagem-video.mp4' },
      { id: 'rejuv-colo-pescoco', nome: 'Rejuvenescimento de Colo e Pescoço', sub: 'Suavização de linhas e textura no colo.', img: 'assets/img/procedimentos/rejuv-colo-pescoco-img.jfif', video: 'assets/img/procedimentos/rejuv-colo-pescoco-video.mp4' },
      { id: 'rejuv-maos', nome: 'Rejuvenescimento das Mãos', sub: 'Mãos com aparência mais jovem e uniforme.', img: 'assets/img/procedimentos/rejuv-maos-img.jpg', video: 'assets/img/procedimentos/rejuv-maos-video.mp4' },
      { id: 'renew-seven-7d', nome: 'Renew Seven 7D', sub: 'Protocolo de sete frentes em uma única sessão.', img: 'assets/img/procedimentos/renew-seven-7d-img.jpg', video: 'assets/img/procedimentos/renew-seven-7d-video.mp4' },
      { id: 'rosaceas', nome: 'Rosáceas', sub: 'Controle de vermelhidão e capilares dilatados.', video: 'assets/img/procedimentos/rosaceas-video.mp4' },
      { id: 'pdrn', nome: 'PDRN', sub: 'Bioestimulação celular com PDRN.', img: 'assets/img/procedimentos/pdrn-img.jpg' },
      { id: 'renew-seven-exossomos', nome: 'Renew Seven com PDRN e Exossomos', sub: 'Protocolo premium com tecnologia regenerativa.', img: 'assets/img/procedimentos/renew-seven-exossomos-img.jpg' },
    ],
    depilacao: [
      { id: 'dep-axila', nome: 'Axila', sub: 'Depilação a laser na axila.', popular: true, img: 'assets/img/procedimentos/dep-axila-img.jfif', antesDepois: 'assets/img/procedimentos/dep-axila-antes-depois.jpg' },
      { id: 'dep-virilha', nome: 'Virilha Completa', sub: 'Virilha total com tecnologia segura.' },
      { id: 'dep-perna', nome: 'Perna Inteira', sub: 'Depilação completa das pernas.', popular: true, img: 'assets/img/procedimentos/dep-perna-img.jfif' },
      { id: 'dep-meia-perna', nome: 'Meia Perna', sub: 'Depilação da metade inferior das pernas.' },
      { id: 'dep-costas', nome: 'Costas', sub: 'Costas inteiras com laser.', img: 'assets/img/procedimentos/dep-costas-img.jfif', antesDepois: 'assets/img/procedimentos/dep-costas-antes-depois.jpg' },
      { id: 'dep-barba', nome: 'Faixa de Barba', sub: 'Definição e redução da barba.', img: 'assets/img/procedimentos/dep-barba-img.jfif', video: 'assets/img/procedimentos/dep-barba-video.mp4' },
      { id: 'dep-rosto', nome: 'Rosto', sub: 'Pelos faciais com precisão.' },
      { id: 'dep-buco', nome: 'Buço', sub: 'Pelos do buço removidos com cuidado.' },
      { id: 'dep-torax', nome: 'Tórax', sub: 'Tórax inteiro a laser.' },
      { id: 'dep-perianal', nome: 'Perianal', sub: 'Área perianal com tecnologia premium.' },
      { id: 'dep-gluteos', nome: 'Glúteos Completos', sub: 'Depilação completa dos glúteos.', video: 'assets/img/procedimentos/dep-gluteos-video.mp4' },
      { id: 'dep-coxas', nome: 'Coxas', sub: 'Coxas inteiras com laser.', video: 'assets/img/procedimentos/dep-coxas-video.mp4' },
      { id: 'dep-cabeca', nome: 'Cabeça', sub: 'Couro cabeludo depilação personalizada.' },
      { id: 'dep-bracos', nome: 'Braços Inteiros', sub: 'Braços completos com tecnologia premium.', video: 'assets/img/procedimentos/dep-bracos-video.mp4' },
    ],
    ultrassom: [
      { id: 'us-papada', nome: 'Papada', sub: 'Redução de papada com ultrassom Ultracel.', popular: true, img: 'assets/img/procedimentos/us-papada-img.jpg', video: 'assets/img/procedimentos/us-papada-video.mp4' },
      { id: 'us-abdomen', nome: 'Abdômen', sub: 'Redefinição abdominal sem cortes.', img: 'assets/img/procedimentos/us-abdomen-img.jpg', video: 'assets/img/procedimentos/us-abdomen-video.mp4' },
      { id: 'us-bichectomia', nome: 'Bichectomia sem cortes', sub: 'Redução de bochechas com ultrassom.' },
      { id: 'us-bigode-chines', nome: 'Bigode Chinês', sub: 'Suavização dos sulcos nasolabiais.', video: 'assets/img/procedimentos/us-bigode-chines-video.mp4' },
      { id: 'us-bracos', nome: 'Braços', sub: 'Firmeza e contorno dos braços.', video: 'assets/img/procedimentos/us-bracos-video.mp4' },
      { id: 'us-colo', nome: 'Colo', sub: 'Rejuvenescimento do colo com ultrassom.', video: 'assets/img/procedimentos/us-colo-video.mp4' },
      { id: 'us-culote', nome: 'Externo de Coxa (Culote)', sub: 'Redução de culote sem cortes.', video: 'assets/img/procedimentos/us-culote-video.mp4' },
      { id: 'us-flancos', nome: 'Flancos', sub: 'Modelagem de flancos com ultrassom.', video: 'assets/img/procedimentos/us-flancos-video.mp4' },
      { id: 'us-fox-eyes', nome: 'Fox Eyes', sub: 'Levantamento de canto dos olhos.', img: 'assets/img/procedimentos/us-fox-eyes-img.jpg', video: 'assets/img/procedimentos/us-fox-eyes-video.mp4' },
      { id: 'us-full-face', nome: 'Full Face', sub: 'Lifting completo da face com ultrassom.', img: 'assets/img/procedimentos/us-full-face-img.jpg', video: 'assets/img/procedimentos/us-full-face-video.mp4' },
      { id: 'us-gluteos', nome: 'Glúteos', sub: 'Levantamento de glúteos sem cortes.', video: 'assets/img/procedimentos/us-gluteos-video.mp4' },
      { id: 'us-intimo', nome: 'Rejuvenescimento Íntimo', sub: 'Rejuvenescimento da região íntima.', video: 'assets/img/procedimentos/us-intimo-video.mp4' },
      { id: 'us-lifting', nome: 'Terço Inferior (Lifting)', sub: 'Lifting do terço inferior do rosto.' },
      { id: 'us-palpebras', nome: 'Pálpebras Completas', sub: 'Levantamento de pálpebras.', img: 'assets/img/procedimentos/us-palpebras-img.jpg', video: 'assets/img/procedimentos/us-palpebras-video.mp4' },
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
    { nome: 'Gabi S.',     cidade: 'São Paulo, SP',      texto: 'Fiz 6 sessões de rejuvenescimento facial 4D na unidade Vila Mariana e o resultado foi acima da expectativa. Pele uniforme, mais firme e com brilho saudável.', foto: 'assets/img/depoimentos/cliente-1-gabi.jpg',     fotoPos: 'center 28%', exemplo: true },
    { nome: 'Thaina B.',   cidade: 'Cabo Frio, RJ',      texto: 'Atendimento impecável na unidade Park Lagos. Depilação a laser sem dor, super rápido. Já recomendei para todas as amigas.',                                  foto: 'assets/img/depoimentos/cliente-2-thaina.jpg',   fotoPos: '40% 30%',    exemplo: true },
    { nome: 'Patrícia M.', cidade: 'Belo Horizonte, MG', texto: 'O tratamento de melasma mudou minha vida. Anos tentando outras técnicas, em poucos meses na Laser & Co o resultado apareceu.',                                foto: 'assets/img/depoimentos/cliente-3-patricia.jpg', fotoPos: 'center 30%', exemplo: true },
    { nome: 'Hanna F.',    cidade: 'São Paulo, SP',      texto: 'Fiz Erbium + PDRN e o resultado depois de 4 dias já estava visível. Pele macia, uniforme e com brilho. Recomendo de olhos fechados.',                         foto: 'assets/img/depoimentos/cliente-4-hanna.jpg',    fotoPos: 'center 28%', exemplo: true },
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
      eyebrow: 'Ultrassom',
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
