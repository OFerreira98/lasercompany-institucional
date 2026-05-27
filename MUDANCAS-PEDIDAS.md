# Considerações Site Laser Company (22.05.2026), mapa de status

Cada ponto do docx do novo responsável → estado hoje → o que vai acontecer → em qual onda.

**Legenda das ondas**
- **Onda 1:** aplicar agora, baixo risco, alto impacto visual.
- **Onda 2:** novos blocos e refinamentos, depende de conteúdo/decisão.
- **Onda 3:** reformas grandes (quiz, chatbot novo, página de procedimento, FAQ por procedimento).

---

## POP-UP

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Form com Nome, WhatsApp, UF, Cidade (filtra por UF), Unidade (filtra por Cidade) + geolocalização opcional | Form simples só com email | Reescrever pop-up: 1ª tela com Nome + WhatsApp + UF + Cidade + Unidade, com filtros dependentes a partir do `data.js` | **1** |
| Quando a pessoa fecha uma vez, NÃO ficar abrindo a todo momento | Hoje insiste a cada 7s e em toda visita (regra antiga do cliente) | Mudar regra: depois do primeiro fechamento, não reaparece na mesma sessão. Volta só na próxima visita (1 vez por visita). | **1** |

---

## HOME

### Bloco 1, Cabeçalho

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Logo maior | Logo médio | Aumentar altura | **1** |
| Botão "Seja um franqueado" | Já tem (dourado, ao lado de Agendar) | Mantém | ✓ |
| Botão SAC com mini-form (Nome/Whats/Email/Área Ouvidoria-Elogio-Outros/Mensagem) + Contato Direto ao lado | Não existe | Adicionar botão SAC no header + abrir modal com form + bloco lateral "Contato Direto" (tel/email/whats) | **1** |
| Cabeçalho branco pra contrastar com banner | Hoje é translúcido sobre o banner | Header sólido branco com sombra suave | **1** |
| Cabeçalho fixo (sticky) | Não fixo | Fixar no topo com `position: sticky` | **1** |
| Lupa de busca rápida | Não existe | Adicionar ícone de lupa que expande um campo de busca | **2** |
| Submenu Procedimentos com categorias + subcategorias | Tem categorias (Estética / Depilação / Ultrassom) | Adicionar 2º nível com os procedimentos de cada categoria | **2** |

### Bloco 2, Banner

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Carrossel de 3 a 5 banners, aleatórios, clicáveis com CTA | Hero estático com foto + texto | Reformular o hero pra carrossel com 3-5 slides, cada um com CTA | **2** |

### Bloco 3, Sobre

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| BG cinza claro/gelo | Cinza escuro padrão | Aplicar fundo neutro `#F3EEE5` | **1** |
| Texto humanizado e mais fluído | Texto direto | Reescrever copy mais natural, conversacional | **1** |
| Usar foto do site | Usa stats numéricos | Adicionar foto + manter os stats menores ao lado | **2** |

### Bloco 4, Tecnologia (Três Frentes)

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Manter vinho | Tema escuro | Mantém | ✓ |
| Mais dinamismo/movimento | Estático | Adicionar parallax/hover nos cards + animação de entrada | **2** |

### Bloco 5, Os Queridinhos

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| BG cinza claro | Cinza escuro | Aplicar fundo neutro | **1** |
| Mais dinamismo | Já tem carrossel infinito | Acelerar/melhorar transições | **2** |

### Bloco 6, Premium para Todo Mundo

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| RETIRAR (vira banner) | Existe | Remover do HTML | **1** |

### Bloco 7, Como Funciona (4 passos)

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Bloco cinza | Tema escuro | Aplicar fundo neutro | **1** |
| Retirar "grátis" do passo 4, substituir por botão CTA | Passo 4 é "Avaliação grátis" | Reescrever passo 4 com botão "Agendar agora" | **1** |

### Bloco 8, Descubra o Tratamento Ideal (NOVO)

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Quiz 5-7 perguntas que recomenda 2-3 protocolos | Não existe | Construir o quiz com captura de leads antes do resultado + mapeamento (sexo, idade, área, queixa) → 2-3 protocolos | **3** |
| Popup de saída com oferta no quiz | Não existe | Adicionar exit-intent só no quiz | **3** |

### Bloco 9, Redes Sociais (NOVO)

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Bloco estilo Guday/RennovaBe com vídeos | Não existe | Criar grid de cards de vídeo (Instagram/TikTok embed) | **2** |

### Bloco 10, Depoimentos

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Bloco cinza | Tema escuro | Aplicar fundo neutro | **1** |
| Foto da cliente | Sem foto | Adicionar avatar/foto por depoimento (com placeholder até cliente enviar) | **2** |

### Bloco "Sua vez agora"

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| RETIRAR | Existe (cta-final-card) | Remover do HTML | **1** |

### Bloco 11, Agendamento Estético Gratuito (NOVO)

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Form na home: Nome/Whats/UF/Cidade/Unidade/Data | Form completo só em /agendamento.html | Adicionar form curto na home, mesma lógica dos filtros do popup, redireciona pra confirmação | **2** |

### Bloco 12, Blog (NOVO)

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| 3+ caixas de conteúdo, bloco cinza | Não existe | Criar bloco "Conteúdo & Cuidados" com 3 cards placeholder | **2** |

### Bloco 13, Rodapé

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| OK | Funcional | Mantém + adicionar "Saiu na mídia" | **1** |

---

## PÁGINA AGENDAR

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Bloco cinza | Tema escuro | Aplicar fundo neutro | **1** |
| Destaque pra "Agendar Avaliação Estética Gratuita" | Já é o título | Reforçar visualmente | **1** |
| Mesma estrutura do popup (UF/Cidade/Unidade) | Stepper de 3 passos diferente | Refatorar pra reaproveitar componente de filtro do popup | **2** |
| Pra onde vão os dados? (dúvida do cliente) | Hoje cai no painel via `/api/leads` | Documentar no rodapé do form + responder no relatório | **1** |

---

## PÁGINA PROCEDIMENTOS

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Duas cores: clara + nossa cor | Tudo escuro | Aplicar listras alternadas claro/vinho | **1** |
| Submenu por categoria | Tem tabs (Estética/Depilação/Ultrassom) | Manter tabs + abrir página individual ao clicar no procedimento | **3** |
| Página individual com texto + vídeo + mais procurados + passo a passo + mais vendidos + formulário | Modal | Construir páginas separadas `/procedimento/<slug>.html` ou expandir o modal | **3** |
| Form "Avaliação Personalizada Gratuita" em cada procedimento, já com o tratamento pré-selecionado | Sem form em procedimento | Adicionar form contextual | **3** |

---

## PÁGINA UNIDADES

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Cinza claro + lojas em vinho | Tema escuro | Aplicar fundo neutro + cards de unidade em vinho | **1** |
| Mapa mais fluido (pins menos apertados) | Pins próximos em SP | Aplicar cluster do Leaflet (já tem suporte) ou aumentar zoom inicial | **2** |
| Pra onde vai o cadastro? (dúvida) | Cai no painel | Documentar + responder | **1** |

---

## PÁGINA VAGAS

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Mesma estrutura de Unidades | Tema escuro | Aplicar fundo neutro mantendo a regra "não mexer na estrutura" | **1** |

---

## CHATBOT

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Fluxo: saudação → área → queixa → 2 protocolos → "agendar" ou "preço" → captura → transfere | Saudação → nome → CEP → unidade + Q&A | Reescrever fluxo focado em diagnóstico/protocolo | **3** |
| Widget abre auto após 15s | Hoje só ao clicar | Adicionar timer | **2** |
| Captura nome + WhatsApp + **email** mesmo se a pessoa abandonar | Hoje só nome e WhatsApp | Adicionar campo email no fluxo | **3** |

---

## CONSIDERAÇÕES GERAIS

| Pedido | Hoje | Vou fazer | Onda |
|---|---|---|---|
| Aumentar contraste de texto | Tons mutede em muitos lugares | Refinar tokens: texto principal mais escuro | **1** |
| FAQ por procedimento ("dói?", "quantas sessões?", "funciona em pele negra?") | FAQ só no chatbot | Adicionar accordion de FAQ em cada procedimento | **3** |
| Indicar perfil (fototipos, acne ativa, etc.) | Não tem | Adicionar campo "indicado para" no data dos procedimentos | **3** |
| Número de sessões e resultado esperado | Não tem | Idem | **3** |
| Mobile first | Já é responsivo, mas pode melhorar | Audit mobile + ajustes pontuais | **2** |
| "Saiu na mídia" no rodapé | Não tem | Adicionar bloco | **1** |
| Mais movimento/dinamismo geral | Animações sutis | Adicionar mais reveal-on-scroll, hover states, parallax | **2** |
| Brandbook tipografia | Tokens existem em `tokens.css` | Revisar e documentar | **2** |

---

## RESUMO POR ONDA

**Onda 1 (entrego agora):**
- Popup: nova regra (parar de insistir após fechar) + multi-step com UF/Cidade/Unidade
- Header: fixo, branco, logo maior, botão SAC + modal SAC
- Home: backgrounds neutros (Sobre, Queridinhos, Como Funciona, Depoimentos), tecnologia mantém vinho
- Remoção dos blocos "Premium para Todo Mundo" e "Sua vez agora"
- Como Funciona: passo 4 vira CTA
- Páginas Agendar, Procedimentos, Unidades, Vagas: aplicar fundo neutro + onde for "loja/unidade/tecnologia" mantém vinho
- Aumentar contraste de texto
- Rodapé: bloco "Saiu na mídia" (placeholders)

**Onda 2 (próxima passada):**
- Lupa de busca, submenu de procedimentos com subcategorias
- Carrossel de banners (3-5)
- Bloco redes sociais (vídeos)
- Bloco blog (3 cards)
- Bloco agendamento curto na home
- Depoimentos com foto, cards de unidade refinados, cluster no mapa
- Widget de chatbot abre auto após 15s
- Mais movimento/animações
- Refinos mobile

**Onda 3 (precisa de mais decisão):**
- Quiz "Descubra seu Protocolo" + popup de saída
- Página individual de procedimento (vídeo, passo a passo, mais vendidos, form contextual, FAQ)
- Chatbot reformulado (área → queixa → protocolo, captura email)
- Campo "indicado para" e "número de sessões" no `data.js` dos procedimentos
- Página de Agendar reaproveitando o componente de filtro do popup
