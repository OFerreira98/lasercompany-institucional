# Memória do projeto, Laser & Co. (atualizado 2026-06-01)

Memória completa do projeto para retomar do zero (sobrevive a `/clear`). Espelha o
`CLAUDE.md`. Site institucional estático (HTML/CSS/JS, sem framework de build) da
**Laser & Company Brasil**, rede de franquias de estética a laser.

- **Repositório:** `lasercompany-institucional` (conta `OFerreira98`)
- **Produção:** https://lasercompany-institucional.vercel.app
- **Deploy (PADRÃO desde 06/2026):** ao concluir mudança aprovada, COMMITAR no git (main) E
  `vercel --prod` (SEM `--yes`), sem precisar pedir toda vez. (Antes: só commitar quando pedir.)
- **Verificar deploy:** `vercel ls lasercompany-institucional --prod`

---

## ⟶ PROSSEGUIR / CONTINUAR (LER PRIMEIRO AO RETOMAR)

Quando o usuário disser **"prosseguir"** ou **"continuar"**, é daqui que retomamos.
Estado MAIS RECENTE embaixo (sessão 2026-06-10); o histórico anterior segue logo na sequência.

### ÚLTIMA SESSÃO (2026-06-10, com o jvneto, dev do Olimpo): BACKEND FASE 2 LIGADO

Contexto: novo responsável (jvneto, máquina Linux, e-mail neto-vera@hotmail.com) assumiu a
Fase 2 do backend (spec no PDF `1780540080493_Laser-Co-Backend-Fase2-DEV.pdf`, não versionado).
**Itens 1-4 do PDF (prioridade ALTA) CONCLUÍDOS e VALIDADOS:**

1. **Banco = Supabase COMPARTILHADO com o sistema unificado Olimpo** (projeto `lasercompany rh`,
   ref `lkiihnxznphxqekrgsgi`, sa-east-1, 140+ tabelas de RH/CRM/SAC). Em vez de Neon+pg:
   tabela dedicada **`public.site_leads`** (id/data jsonb/created_at, RLS ON, índice) criada
   via Management API. **REGRAS DE OURO: não tocar nas outras tabelas; NUNCA resetar a senha
   do Postgres** (derrubaria o Olimpo). Por isso o acesso é via **REST do Supabase (service
   key)**, sem driver pg, mantendo zero-dependência (sem package.json).
2. **Código (commit `8b3d037`):** `store.js` com 3 modos (Supabase → pg → demo); `auth.js`
   com env `PAINEL_USERS` (JSON com senhaHash) substituindo os acessos de teste; novo
   `GET /api/health` ({ok, store, usuariosReais}); `GET /api/leads` retorna `storeMode`;
   `api-client.js` usa storeMode pro selo demo; login esconde acessos de teste quando real.
   `.gitignore`: exceção `!api/_lib` (o padrão `_*` engolia a lib da API no add).
3. **Deploy OPERACIONAL na conta Vercel do jvneto** (`lasercompanyia-web`):
   **https://lasercompany-institucional-six.vercel.app** com envs SUPABASE_URL,
   SUPABASE_SERVICE_KEY, AUTH_SECRET, PAINEL_USERS (Production). A produção ANTIGA
   (OFerreira98, lasercompany-institucional.vercel.app) segue intacta em modo demo;
   sem acesso à conta dele desta máquina (a env lá teria que ser setada pelo dono).
4. **Credenciais reais** (franqueador + vmariana + ipanema, senhas fortes geradas):
   **`_CREDENCIAIS-PAINEL.txt`** na raiz (NÃO versionado, chmod 600). laser2026 morreu na
   produção nova (validado 401).
5. **Validação ponta a ponta (tudo verde):** /api/health=supabase; POST lead público;
   login real; GET autenticado vê o lead; PATCH persiste; linha confirmada no Supabase.

6. **Itens 5-7 e 9 do PDF TAMBÉM CONCLUÍDOS (commit `b260c60`, validados em produção):**
   - **Currículo (item 6):** `api/curriculos.js`, POST público (PDF/DOC até 4MB base64) pro
     bucket PRIVADO `site-curriculos` do Supabase Storage; GET logado gera URL assinada 1h.
     `page-vagas.js` sobe o arquivo de verdade; painel tem botão "Baixar currículo" no
     detalhe (LGPD: 401 sem login, validado).
   - **Promoções (item 5 parcial):** `api/promocoes.js` (GET logado / PUT só franqueador) +
     tabela `site_config` (RLS ON) + `api/_lib/config.js`. Telas Promoções salvam/encerram
     de verdade; fallback data.js quando nunca salvo. CRUD de USUÁRIOS/equipe ficou de fora
     DE PROPÓSITO: o banco compartilhado já tem usuários/colaboradores do Olimpo, CRUD
     paralelo geraria conflito (é da fase de integração).
   - **Mapa (item 7):** `viewUnidadesMapa` com Leaflet sob demanda (CDN), pinos das 70
     unidades (lat/lng já existiam no data.js) com leads por unidade no popup.
   - **Rate limit (item 9):** login com 5 falhas por e-mail+IP / 10 min → 429 (validado:
     sexta tentativa leva 429; mensagem própria na tela de login).

7. **Refinos pós-validação (commit `da600b9`):**
   - **SAC (regra 10):** placeholders do modal eram creme-sobre-branco, INVISÍVEIS (campos
     pareciam vazios/quebrados; cliente reclamou "os campos estão bem errados"). Fix em
     `layouts.css`: `.sac-modal .input::placeholder { color:#8A6850 }` + select `:invalid`
     em tom muted + `option` branco/vinho. Conferido com screenshot (playwright-core +
     chromium do cache `~/.cache/ms-playwright`, headless funciona nesta máquina).
   - **Painel sem emojis:** menu lateral agora usa `NAV_ICONS` (SVGs inline stroke
     currentColor) no `painel-core.js`; CSS `.painel-nav-ico svg` no `painel.css`.
     O usuário NÃO quer emoji no admin, usar sempre ícone SVG.
   - **Auditoria "vem tudo do banco?":** LEADS e tudo derivado deles (Visão Geral, listas,
     status/notas, ranking, mapa, promoções) = banco REAL. Ainda DEMONSTRAÇÃO (mock):
     Tráfego (páginas/dispositivos/navegadores, "online agora"), Demográfico (idade/gênero),
     Promo desempenho, Config>Usuários (lista) e "comparação com a rede" do franqueado
     (seed). Motivo: site não coleta analytics de tráfego nem idade/gênero; entra na
     integração (Vercel/GA + dados do Olimpo).

8. **PAINEL 100% BANCO (commit `a9a7213`, pedido "precisa todos vir do banco"):**
   - **Tráfego REAL:** `analytics.js` manda beacon de pageview (página, referrer, sessão
     aleatória; sem dado pessoal) pra `/api/track` → tabela `site_pageviews`; agregação no
     banco via RPC `site_trafego_stats` → `/api/trafego`. As 4 telas de Tráfego mostram
     online/visitantes/páginas/dispositivos/navegadores/origens REAIS (estado vazio
     explicativo enquanto não há visitas).
   - **Usuários do painel no banco:** `/api/usuarios` (CRUD, só franqueador) grava em
     `site_config['usuarios']`; `auth.js` ficou ASSÍNCRONO e consulta o banco PRIMEIRO
     (fallback env/demo). Usuário criado no painel LOGA de verdade (validado). Proteção:
     não remove/rebaixa o último franqueador. Bootstrap: primeira escrita copia os usuários
     da env (senhas atuais preservadas, validado).
   - **/api/equipe** (registro por unidade) e **/api/conta** (perfil próprio + foto
     miniatura 96px + TROCA DE SENHA validando a atual, validado e2e: senha nova loga,
     velha falha, atual errada recusa).
   - **Demográfico real:** gênero ESTIMADO pelo primeiro nome (rotulado) + horário de
     contato + dia da semana, tudo dos leads do banco. Idade: site não coleta (nota na tela).
   - **Promo desempenho real** (leads por brinde) e **comparação com a rede real**
     (`redePorDia` no /api/stats). MOCK_* todos removidos do `painel-core.js`.
   - Validação e2e completa em produção (10 checks) + screenshots (tráfego/demográfico/
     usuários renderizando dado real, zero erro JS). Dados sintéticos de teste APAGADOS.

9. **SAC DO SITE INTEGRADO AO SISTEMA DE GESTÃO DE SAC (commit `a3c76bc`):** o formulário
   "Fale conosco" do site agora ABRE TICKET DE VERDADE no sistema de gestão de SAC do
   jvneto (`/home/jvneto/ProjetosLMK/Laser/SAC`, Next.js, projeto Vercel `sac`,
   sac-henna.vercel.app, MESMO Supabase compartilhado, tabela `sac_tickets`).
   - **`api/sac.js`** (POST público): valida nome/mensagem/contato e insere em
     `sac_tickets` seguindo o padrão do webhook de WhatsApp do próprio sistema:
     `canal: 'formulario'`, `fase: 'Novo'` (coluna do Kanban), `status_multi:
     ['em_andamento']`, `motivo_label` = área do form (Ouvidoria/Elogio/Dúvida/Outros),
     `historico` com a ação. Retorna o `numero` (protocolo, sequence real do sistema).
   - **`layout.js`**: o submit chama `/api/sac` e mostra "Seu protocolo é o número N."
     na tela de sucesso (`#sac-protocolo`, dourado profundo `#7A5418`, regra 10). O
     `trackLead('sac')` continua como registro no painel.
   - Validado e2e: API direto (ticket 1022) e formulário REAL no navegador (ticket 1023,
     protocolo exibido na tela). Ambos apareceram em `sac_tickets` com fase Novo e foram
     APAGADOS depois do teste. (O ticket 1012 "Teste" é do próprio time, não tocar.)
   - Referências do sistema SAC: criação em `src/app/actions/tickets.ts` (criarTicket),
     webhook em `src/app/api/webhooks/uazapi/route.ts`, migrações em
     `/home/jvneto/ProjetosLMK/Laser/RH/supabase/migrations/` (012, 036, 039, 041).

10. **REUNIÕES COM O WILL (09/06) = NOVO ESCOPO GRANDE.** Demandas completas em
   **`MUDANCAS-REUNIAO-WILL.md`** (li as 2 transcrições inteiras; o arquivo é o checklist).
   Tema: tornar o site EDITÁVEL pelo painel (CMS) + repaginação visual.
   - **FASE 1 FEITA (commit local `e0b51c5` aprox., NÃO PUSHADO):** tema **clean
     (Cinza & Dourado) como padrão** (#FAFAFA+bege, dourado leve, vinho SÓ em títulos/
     rodapé/CTA final da home #agendamento-curto), tipografia **Didot Bold (fallback
     Playfair Display) em h2/h3/h6 + Montserrat corpo/h5**, **header sempre fixo**,
     rodapé vinho com tokens re-mapeados, títulos sobre foto continuam creme.
     Token novo: `--color-heading`. Tema antigo vira opção "Vinho & Dourado".
   - **IMPORTANTE: cores PENDEM DE APROVAÇÃO do Will antes de ir pra produção**
     (combinado na reunião). Preview público pra ele:
     **https://lasercompany-preview.vercel.app** (projeto Vercel `lasercompany-preview`
     na conta lasercompanyia-web; o preview normal da Vercel exige login, por isso o
     projeto separado). NÃO dar push na main até aprovar (push redeploya a prod antiga).
   - **FASE 2 FEITA (commit local, validada e2e no preview):** CMS no painel, menu
     **"Edição do site"** (só franqueador) com 4 telas: Banners da home (upload da arte
     INTEIRA, dica 1920x1080, reordenar/remover/voltar padrão; hero vira banner-only com
     só os 2 botões fixos), Pop-up do brinde (procedimento editável: título+lead+msg
     WhatsApp), Bloco Sobre (título/parágrafos/imagem no lugar dos cards de números),
     Faixa do menu (padrão/branco/vinho). Infra: `/api/conteudo` (GET público cache 60s,
     PUT franqueador, site_config 'conteudo', null=volta padrão), `/api/midia` (upload
     p/ bucket PÚBLICO site-conteudo), `scripts/conteudo.js` (aplica overrides, race
     1.2s, nunca bloqueia a página; popup atualiza via ready.then porque monta antes).
     Projeto Vercel `lasercompany-preview` agora tem as MESMAS envs da produção
     (env add precisa de `--value`, stdin não funciona no CLI 54). Dados de teste do
     CMS APAGADOS depois da validação (site_config 'conteudo' + banner no Storage).
   - **FASES 3 e 4 TAMBÉM FEITAS (entraram no commit 925602d, junto com o trabalho
     paralelo do Mateus de Ajuda/SupraDesk):**
     FASE 3: lupa de busca em Procedimentos (filtra as 3 frentes, validada por DOM:
     melasma → 1 card, inexistente → vazio, limpar → 49); depoimentos em CARROSSEL
     (4/2/1 por viewport) com ESTRELAS douradas estilo Google + setas + auto 5s;
     vídeo da avaliação editável (autoplay sem som ao lado do CTA, tela no painel);
     UPLOAD POR URL ASSINADA (até 50MB direto do navegador; bucket site-conteudo
     subiu pra 50MB; api/midia modo sign); procedimentos editáveis (sub/foto/vídeo
     por id em conteudo.procedimentos, telas com busca no painel); fotos de unidades
     editáveis (conteudo.unidadesFotos; Will troca as que têm Anitta).
     FASE 4: vagas com currículo OPCIONAL; franqueado com header BRANCO (frlp-header,
     que é header próprio da LP, não o site-header!), posicionamento único = texto +
     cards em escada à esquerda e foto REAL de fachada à direita (editável,
     conteudo.franqueadoFachada, tela "Página do franqueado"), caixas de números do
     hero clean no tema novo, história de sucesso com foto SOLO do Rafael
     (rafael-estevez.jpg no lugar do casal).
     OBS: sessão paralela do Mateus adicionou painel "Ajuda e Suporte" (SupraDesk,
     viewAjuda) e _manual-admin.html (dev-only, gitignored). Preview ATUALIZADO com
     tudo: https://lasercompany-preview.vercel.app

**RESTA da Fase 2 (backend):** item 8 (domínio definitivo: decisão do cliente + acesso ao
DNS). **Telas que leem do data.js do site (não é mock):** cadastro de unidades e vagas
abertas (são o conteúdo real do site). **Segurança:** token do Supabase usado na sessão
deve ser ROTACIONADO (foi colado em chat 3x); o remote do git tem um token do GitHub
embutido na URL (avisar o dono).

### ÚLTIMA SESSÃO (2026-06-01, com o Ferreira): agendamento, avatar do chat, rodapé 6 matérias

**NOVO FLUXO PADRÃO (o cliente pediu explicitamente):** ao concluir CADA mudança aprovada,
COMMITAR no git (direto na `main`) E publicar na Vercel (`vercel --prod`), sem precisar pedir
toda vez. Antes a regra era "só commitar quando pedir". Registrado também no topo do CLAUDE.md.

1. **Página Agendamento** (`agendamento.html`, `styles/pages.css`, `scripts/page-agendamento.js`):
   - Título trocado de "Agende em três passos." para **"Agendar avaliação gratuita"**, maior
     (`clamp(2.2rem, 4.4vw, 3.6rem)`), com "gratuita" no dourado itálico (mesmo gradiente).
     Removido o eyebrow redundante "AVALIAÇÃO GRÁTIS".
   - Subtítulo SEM "Laser & Co": "Escolha o procedimento, deixe seus dados e fale com a
     unidade da sua região no WhatsApp." (a `<meta description>` ainda cita a marca, ok, é SEO.)
   - Removidos os selos "100% grátis" e "Menos de 1 minuto" (`<ul class="ag-trust">`).
   - **BUG corrigido (regra 10, contexto creme):** o painel 50/50 tem fundo creme (#F5EFE2), mas
     stepper, abas (pills), lista de procedimentos, formulário do passo 2, botões-fantasma e o
     resumo do passo 3 usavam tokens do tema vinho (texto `--color-text` CREME + surface
     translúcido) → ficavam **creme-sobre-creme, invisíveis**. O cliente reclamou "os
     procedimentos não aparecem" (só a aba ativa dourada e o "tem interesse?" dourado apareciam).
     Reescrevi as cores pro contexto claro: bloco **"Contexto CREME do painel"** logo após as
     regras `.agendamento-split` em `pages.css` (texto vinho `#1F0B0A`/`#2A0F0D`, cards brancos,
     bordas `rgba(120,24,18,.x)`, acentos dourados PROFUNDOS `#9A6B1E`/`#B57C0C`/`#7A5418`; o
     `#C8A064` do tema é claro demais pra texto sobre creme). Resumo do passo 3 (inline no
     `page-agendamento.js`) também recolorido. Voltaram os 21 estética / 14 depilação / 14 ultrassom.

2. **Avatar do chat (chatbot):**
   - Cliente mandou `ChatGPT Image 30 de mai... .png` (recepcionista 3D no balcão "LASER &
     COMPANY", 1254x1254, 1,83 MB). Otimizei via System.Drawing → **`assets/img/agente-chat.jpg`**
     (320x320, 23 KB).
   - Usada SÓ no **avatar do header do chat** (`.chatbot-avatar`, antes era o monograma "L&C";
     virou 44px, `overflow:hidden` + `<img class="chatbot-avatar-photo">`).
   - **ATENÇÃO p/ não repetir:** cheguei a colocar a foto TAMBÉM na bolinha flutuante, mas o
     cliente pediu **só no chat** → revertido. A bolinha (`.chatbot-trigger`) mantém o ícone
     SVG de balãozinho original (regra 13: bolinha vinho).
   - O PNG bruto do ChatGPT é fonte local: ignorado no git+vercel (`assets/img/ChatGPT Image*`
     adicionado ao `.gitignore` e `.vercelignore`).

3. **Rodapé "Saiu na mídia" — 6 matérias no desktop** (`scripts/layout.js`, `styles/layouts.css`):
   - Cliente: "deixa as 6 matérias no navegador, tem muito espaço embaixo." Antes sorteava só 3
     (faixa 520px centralizada, sobrava espaço no rodapé largo).
   - Agora `renderFooterMedia` rende as **6** (`shuffle(...).slice(0, 6)`). CSS: desktop =
     `repeat(6, 1fr)` max-width **1080px** (6 em 1 linha); tablet `<=960px` = `repeat(3,1fr)`
     max-width 560px (6 em 2 linhas de 3); mobile `<=700px` = 3 em 1 linha
     (`.footer-media-card:nth-child(n+4){display:none}`, mantém compacto).
   - Pool atual (`data.js > naMidia`) = 6 mini-cards COM imagem da matéria: 1 O Globo,
     1 Agenda Carioca, **4 Veja Rio** (cada um artigo distinto). Este é o estado da Leva
     jun/2026 e SUBSTITUI a descrição antiga "4 matérias só texto" mais abaixo nesta memória.

**Commits desta sessão:** `4728436` (agendamento + avatar do chat), `428c8c3` (rodapé 6 matérias).
Ambos em produção (`vercel --prod`), aliados a https://lasercompany-institucional.vercel.app.

---

### STATUS anterior: ajustes de cores + tema + painel CONCLUÍDOS e COMMITADOS (2026-05-21)
Feito, testado no preview e commitado (rodada com o Ferreira):

1. **Cores (aprovadas):** vinho default mais leve/quente, `--laser-wine-deep: #481712` (era
   `#1A0404`), ramp `#5E211B` / `#74302A` / `#1F0B0A`. Afeta site + painéis. `<meta
   theme-color>` dos 11 arquivos e a `design-system.html` atualizadas pra nova cor.
2. **Versão Clara (`roteiro-light`) refeita:** creme quente (bg `#EFE0CB`, cards `#F7EEDD`, sem
   branco puro), texto vinho nítido (`#361410` / `#4E1A15`, muted `#6E4A3A`), dourado bronze
   pontual. Resolveu o "muito branco / letras apagadas".
3. **Tema BASE + ACENTO separados:** `data-theme` (base) + `data-accent` (sazonal). Storage
   `laserco_base` + `laserco_accent` (mantém `laserco_theme` legado = accent||base p/ migração).
   Corrigiu o bug "Versão Clara + sazonal voltava pro vinho". Sazonais agora são
   `:root[data-accent="..."]` no `tokens.css`. `theme.js` reescrito; 8 HTMLs públicos com script
   anti-flash novo; `painel.html` virou fixo `default`. Aparência do painel grava base+acento.
4. **Painel:** Demográfico = tela única (`#demo` → `viewDemografico`, idade rotulada como idade +
   gênero). Telas vazias preenchidas (tráfego páginas/dispositivos, ranking 2-col sem vácuo,
   mapa com KPIs + nota de que o mapa geográfico real é da integração). Config > Usuários:
   convidar/editar usuário com permissões (checkbox). Minha conta: foto (upload preview),
   telefone, cargo, observações (vale nos 2 painéis). CSS novo no fim de `painel.css`.
5. **Volume ~60k/mês:** `painel-seed.js` N=900 leads, nomes primeiro+sobrenome. Tempo real mostra
   "Visitantes no mês 61.380 / hoje 2.040"; mocks de tráfego escalados.

### "Saiu na mídia" (REGRA, salvar pra não repetir, 2026-05-30)
> **ATUALIZAÇÃO jun/2026:** hoje são MINI-CARDS COM IMAGEM da matéria (pool de 6 em
> `data.js > naMidia`), e o desktop mostra as 6 (ver sessão 2026-06-01 no topo). A descrição
> "só texto / 4 matérias" abaixo é HISTÓRICA. O que CONTINUA valendo: mídia mora SÓ no rodapé
> e NUNCA inventar veículo.
- **MORA NO RODAPÉ (`scripts/layout.js`), nunca em seção de página.** Já levei bronca por
  criar uma seção "Na mídia" no meio da `franqueado.html`. NÃO FAZER.
- **É só texto** (nome do veículo em itálico), sem logo/imagem. O slot é clicável (`<a>` com
  `target="_blank"`).
- **São 4 matérias reais** (cliente confirmou "só essas quatro"):
  - **Veja** (NÃO "Veja Rio"): https://vejario.abril.com.br/coluna/otavio-furtado/rede-de-tratamentos-esteticos-anitta-como-socia/
  - **ABF**: https://www.abfexpo.com.br/imprensa/novas-marcas-ampliam-diversidade-e-indicam-tendencias-na-abf-fra/
  - **Varejo** (= ACIRP): https://acirpriopreto.com.br/servicos-para-saude-e-beleza-viram-os-novos-queridinhos-dos-shoppings/
  - **Agenda Carioca**: https://agendacarioca.com.br/laser-co-acelera-expansao-no-rio-e-projeto-de-clinica-boutique/
- Antes tinha 6 fake (Exame, PEGN, Estadão, Folha de S.Paulo, ABF, Forbes) que eu inventei.
  Apagados em 30/mai. Não inventar veículo de mídia, NUNCA.

### Mobile da home, ajustes (jun/2026)
Revisão do cliente no celular. Tudo em `@media` (desktop intacto):
- **Menu mobile** (`layouts.css` bloco "MENU MOBILE, correções"): bug era os
  nav-links herdarem cor escura (#1F0B0A) e sumirem no fundo escuro, OU
  misturarem dourado (Início/Procedimentos). Fix: `body .site-header-clean
  .header-nav.header-capsule .nav-item > .nav-link { color:#F5EFE2 !important }`
  (creme uniforme), franqueado vira BOTÃO dourado, fundo `rgba(31,11,10,.98)`.
  Submenu Procedimentos estava abrindo sozinho (regra desktop `.nav-mega{display:grid}`
  vencia o `display:none`) → forçado fechado com `.nav-item.open` no mobile.
- **Hero**: setas escondidas em `<=768px` (`.hero-arrow{display:none}`), só autoplay+dots.
- **Seções menores**: segments 2col→1col com alturas menores; marquee card 210px;
  Como Funciona 2x2 (mantido até telas pequenas) + botão "Agendar" em `.steps-cta-row`
  abaixo (render duplicado no `page-index.js`, escondido no desktop via CSS);
  depoimentos menores; blog 2 colunas no mobile (1col <380px); popup e ficha
  agendamento-curto compactados. Bloco "HOME MOBILE, compactação" no fim do `pages.css`.
- **Rodapé**: removido o card grande `.footer-franchise-card` (redundante: já tem
  botão no header + item no menu + link no mapa). `footer-grid` 3→2 colunas (1.6fr 1fr).

### Instagram / Behold (autoplay, jun/2026)
- Feed do Instagram na home usa **widget Behold** (`<behold-widget feed-id="4STJ1LI7bMsbBpcQIQxL">`
  + script `w.behold.so/widget.js`). Código intacto, ambos respondem 200.
- Cliente: vídeos não dão autoplay (funcionava antes). **Não é o código do site** —
  autoplay é config do PAINEL Behold (não atributo HTML), e vídeo do Instagram só
  autoplay se MUTED (política do browser). "Funcionava e parou" cheira a **estouro da
  cota do plano free (1.200 views/mês)** → widget degrada. Ação do cliente no painel
  Behold: conferir autoplay ON + muted + cota do mês (se estourou, upgrade de plano).

### Performance, otimização de imagens (30/mai)
- Imagens >600KB redimensionadas pra max 1600px + JPEG q82 via **System.Drawing**
  (PowerShell, nativo Windows, NÃO precisa instalar nada). Função no histórico do chat.
  Ganho: imagens usadas ~101MB → ~13MB. Ex: dep-costas 3.8MB→107KB.
- PNGs de FOTO (sem transparência) convertidos pra JPEG real (.jpg) + refs atualizadas:
  equipe/recepcao, franqueado-recepcao, rafael-estevez, rafael-casal, unidades-hero,
  e 4 fachadas em unidades/. As .png viraram .jpg em vagas.html, unidades.html,
  franqueado.html, pages.css, data.js.
- Apagados não-usados: `hero 1.png` (12MB), `Ultrassom.png`. Imagens soltas na raiz de
  assets/img são ORIGINAIS do cliente (duplicatas das de procedimentos/ e 3 frentes/),
  não-usadas mas versionadas leves.
- **Vídeos .mp4 (PENDENTE):** 34 em procedimentos/ (~270MB, 7-23MB cada) vão pro deploy e
  tocam autoplay nos cards. Já com `preload="metadata"` + autoplay só quando visível (não
  pesam no load inicial). Recompressão precisa de **ffmpeg** (não instalado). Os 33 vídeos
  na RAIZ de assets/img são backup e estão no .gitignore + .vercelignore (não sobem).
- **rembg/ffmpeg/pip bloqueados** pelo classificador de auto-mode. Pra remover fundo de
  imagem, cliente usa remove.bg. System.Drawing resolve resize/recompress sem instalar.
- `.gitignore` alinhado ao `.vercelignore`: ignora `_*` (dev tools/mockups), `assets/img/*.mp4`,
  pastas de referência, RELATORIO-CLIENTE.pdf, test_*, download.js, generate_images*.

### Máquinas premium (procedimentos > Tecnologia, 30/mai)
- 3 máquinas em `assets/img/maquinas/` PNG sem fundo: `vydence-alex-one.png`,
  `quanta-q-plus.png`, `ultracel-q-plus.png` (cliente removeu fundo no remove.bg).
- `data.js lasers`: `{ nome, tipo, img, beneficios:[] }`. renderTech mostra NOME grande
  (serif dourado) + tipo pequeno + lista de benefícios com check dourado. CSS `.tech-nome`
  (grande), `.tech-tipo`, `.tech-benefits` em pages.css.

### Agendamento 50/50 (30/mai)
- Reestruturado pra split: foto `hero.jpg` (duas mulheres) à ESQUERDA com mask radial
  (funde no creme, sem caixa), formulário 3 passos à DIREITA. Fundo creme único `#F5EFE2`,
  sem faixa branca. `.agendamento-split-section` tem margin-top -144px + padding-top 144px
  pra section creme subir atrás do header (página não é dark-hero). TODOS os IDs do form
  preservados (page-agendamento.js intacto). CSS `.agendamento-split/-photo/-main/-head`.
- Variante A (mask) escolhida pelo cliente. Variante B (PNG sem fundo) descartada.

### Chats flutuantes (30/mai)
- **Ambos no canto inferior direito, lado a lado.** WhatsApp em `right: 1.5rem`,
  chat do agente em `right: calc(1.5rem + 56 + 12)` (à esquerda do WhatsApp). Janela do
  chat ancora no `right: 1.5rem; bottom: 5.5rem`.
- **WhatsApp = bolinha redonda 56x56 verde** (#25D366), só ícone, SEM texto "Falar com
  Laser & Co". A label-text fica `display: none`. Visual igual ao do agente (mesmo
  formato, só muda a cor).
- **Agente se apresenta como bot:** "Olá! Sou o Agente de Atendimento da Laser & Co.
  Como posso te chamar?". Header do chat: "Agente de Atendimento". NÃO finge ser
  representante humano da marca.

### CEP / unidade mais próxima, regra de honestidade (30/mai)
- Antes: qualquer fallback por UF afirmava "sua unidade é X". Resultado: CEP de
  Cascavel (PR) abria WhatsApp da unidade de Maringá como se fosse "a sua". O cliente
  reportou que isso é desonesto, são 280km, ninguém vai de Cascavel a Maringá.
- Agora 3 níveis em `cep.js findUnidade`:
  1. Prefixo exato dos 3 dígitos do CEP → confiável.
  2. Mesma cidade (UF + nome de cidade igual via `unidadeCity(u)` que parseia
     `endereco` no padrão `cidade/UF`) → confiável, ex.: Saúde SP → Butantã SP.
  3. Mesma UF, cidade diferente → marca `_isDistant: true`, NÃO salva a unidade
     no localStorage (só o CEP), pra o botão flutuante não abrir a unidade errada.
- Consumidores:
  - `chatbot.afterCEP`: se `_isDistant`, fala "Ainda não temos unidade em <cidade>,
    a mais próxima é <X> em <cidade2>" e ainda oferece o WhatsApp dessa unidade.
    Lead vai como `chatbot_expansao`.
  - `whatsapp.js` modal: se `isDistant`, mostra inline a mesma mensagem honesta e
    troca o submit pra "Falar com a unidade <X> mesmo assim" (não abre automático).

### FEITO: hero da home com fotos reais (30/mai)
- 4 banners de IA (`hero.jpg`, `estetica.jpg`, `depilacao.jpg`, `ultrassom.jpg`) trocados por
  fotos reais de procedimento (`assets/img/procedimentos/`):
  - `premium` → `black-peel-img.jpg`
  - `estetica` → `remocao-micropigmentacao-img.jfif`
  - `depilacao` → `dep-barba-img.jfif`
  - `ultrassom` → `us-palpebras-img.jpg`
  - `avaliacao` → `black-peel-img.jpg` (reusada)
- Adicionado campo `pos` no `data.hero[*]` (`center 30%` etc.) e o render em `page-index.js`
  usa `background-position` por slide.
- `reducao-foliculite-img.png` é 294×266 (baixíssima res), NÃO usar em hero. Usei `dep-barba`.

### FEITO: página "Seja um franqueado" (`franqueado.html`) enriquecida
- Texto da XP deixado DISCRETO ("atraiu o investimento do fundo de Private Equity da XP"), sem o
  "R$ 100 milhões / 65%" (cliente pediu pra tirar da página pública).
- Foto real do Rafael no bloco "O Fundador" (`assets/img/equipe/rafael-estevez.jpg`).
- Faixa "Liderança" (`#lideranca`) com a foto do Rafael e a ESPOSA (`assets/img/equipe/rafael-casal.jpg`)
  + Franchising Factory (+150 marcas, +1000 clientes) + chips (70+ unidades, +150 marcas, Botoclinic +
  Laser&Co, revista MENSCH). CSS `.cred-*` e `.fundador-foto.has-photo` no `pages.css`.
- **CORREÇÃO IMPORTANTE:** a foto `ea38f0_032f5ebc...~mv2.jpg` é Rafael + a ESPOSA (provável Cristina
  Bohrer), NÃO a Anitta (eu tinha errado). "Anitta sócia/embaixadora" é frase do material, mas NÃO foi
  pra página (sem foto real dela; confirmar com o cliente se quiser usar).
- "5 empresas no Shopping Garden": não existe, ignorado (veio de transcrição de vídeo).
- As 18 fotos antes/depois que estavam soltas em `assets/img/antes-depois/` o cliente apagou (eram lixo).

### ⟶ PRÓXIMA TAREFA: DOIS relatórios
1. **CLIENTE:** linguagem simples, o que o site/painel já faz, sem jargão.
2. **DESENVOLVEDORES:** tudo p/ continuarem sem o Ferreira (logins de teste + onde trocar,
   stack/arquitetura, o que foi feito, o que falta, testes, ponto de troca do banco
   `api/_lib/store.js`, passo a passo do `BACKEND.md`).

### DÉBITOS restantes (pendências)
1. ~43 imagens de procedimento por IA (`_gen.cjs` flux, sem texto), depois `--wire`.
2. Banco + senhas reais (Postgres no Marketplace, `DATABASE_URL`, `npm i pg`, tabela,
   `AUTH_SECRET`), ver `BACKEND.md`.
3. Integração real do painel (dados ao vivo, CRUD que salva, mapa geográfico).
4. Fotos reais das fachadas das unidades e dos antes/depois (cliente fornece).

---

## REGRAS PERMANENTES (não violar)

1. **ZERO traços longos.** Nunca em-dash nem en-dash em texto visível ao usuário (endereços,
   footer, copy, popup, chatbot) nem nas respostas do chat com o cliente. Usar vírgula/ponto.
2. **Sem "#SemTabus".** Usar "Estética premium acessível a todos".
3. **Sem escrita "cara de IA"** (travessões, tom robótico). Texto natural e direto.
4. **Unidades = SÓ foto REAL da franquia.** NUNCA imagem de IA/inventada de fachada (o cliente
   recusou; cada unidade precisa da foto verdadeira). Sem foto, usar o placeholder do
   monograma "Laser & Co". Antes/depois também só foto real com autorização, nunca par de IA.
5. **Imagem de IA só para genéricos** (máquinas, procedimentos, texturas, fundos). Gerar via
   `_gen.cjs` (Pollinations modelo flux) e CONFERIR cada uma. NUNCA escrever texto/aviso em
   cima da imagem ("imagem em produção", "gerado por IA"). O cliente sabe que é provisório.
6. **Página Vagas: NÃO mexer na estrutura** (o cliente ama). Só o hero com foto de fundo
   (`assets/img/equipe/recepcao.png`) que se auto-remove se o arquivo não existir.
7. **Comunicação concisa** com o cliente, resumir o resultado.
8. **Cache:** em `vercel.json`, CSS/JS/assets NUNCA `immutable`. Usar `max-age=0,
   must-revalidate` (CSS/JS) e curto nas imagens. Senão o cliente fica preso na versão velha
   (já pareceu "bug"; resolve com Ctrl+Shift+R + headers revalidando).
9. **Painéis sempre vinho/dourado** (`data-theme="default"` fixo), não trocam com o tema do site.
10. **TODA correção/novo elemento segue o padrão de cores da marca.** Nada de cinza/branco
    aleatório do navegador (problema clássico: `<option>` nativo saindo ilegível). Cada
    componente novo ou ajuste é conferido no contexto onde aparece. Paleta:

    **Vinho:** `#1A0404`, `#1F0B0A`, `#2A0F0D`, `#481712`, `#5E211B`, `#74302A`, `#8E3B36`
    **Dourado:** `#7A5418`, `#9A6B1E`, `#B57C0C`, `#C8A064`, `#D88F3F`, `#E8C088`
    **Creme:** `#F5EFE2`, `#FAF6EE`, `#F7EEDD`, `#F6F2EA`, `#FFFFFF`
    **Muted warm:** `#4E1A15`, `#6E4A3A`, `#8A6850`

    Fundo vinho → texto creme + acentos dourados. Fundo claro → texto vinho escuro +
    acentos dourados. Nunca deixar elemento com default do navegador (option, scrollbar,
    focus ring). Local físico do rule global: `styles/base.css` no fim do arquivo.

---

## Estrutura

- Páginas públicas: `index.html`, `procedimentos.html`, `unidades.html`, `agendamento.html`,
  `vagas.html`, `contato.html`, `franqueado.html`.
- Painéis: `painel.html` (login), `painel-franqueador.html`, `painel-franqueado.html`.
- `styles/`: `tokens.css`, `base.css`, `components.css`, `layouts.css`, `pages.css`, `painel.css`.
- `scripts/`: `data.js` (fonte de dados), `layout.js`, `main.js`, `theme.js`, `popup.js`,
  `cep.js`, `analytics.js`, `chatbot.js`, `whatsapp.js`, `page-*.js`, `api-client.js`,
  `painel-core.js`, `painel-seed.js`, `page-painel-login.js`.
- `api/`: `auth/login.js`, `auth/me.js`, `leads.js`, `leads/[id].js`, `stats.js`,
  libs em `api/_lib/` (`auth.js`, `http.js`, `store.js`, `seed.js`).
- `assets/img/`: `unidades/`, `antes-depois/`, `maquinas/`, `equipe/`.
- Docs: `CLAUDE.md`, `memoria.md` (este), `BACKEND.md`, `assets/img/COMO-ADICIONAR-FOTOS.md`.
- Ferramentas dev (NÃO versionadas, ficam na raiz): `_gen.cjs` (gera imagens),
  `_serve.cjs` (servidor estático de teste). Permissão de `node _gen.cjs` em
  `.claude/settings.local.json`.

---

## Etapa 1, site público (concluído, em produção)

- **Popup (`scripts/popup.js`):** persistente, reabre a cada 7s se não preencher, reaparece a
  cada visita; após enviar para de insistir (cooldown 2h). Copy: "GRÁTIS" em caixa alta, botão
  "Resgatar meu brinde".
- **Agendamento:** passo 3 = "Agendamento"; tela final entrega resultado ("Enviamos sua
  solicitação para a unidade <nome>...") + botão "Confirmar agendamento no WhatsApp". Lead
  salvo em `localStorage` (`laserco_leads`). Scroll foca no step ativo.
- **Procedimentos:** cards com `procMediaStyle` (imagem ou placeholder), badge "Popular" não
  corta o nome, modal com bloco antes/depois no topo, prova social acima das tabs, tecnologias
  (4 lasers + ultrassom) com `renderTech`.
- **Unidades:** 70 unidades no `data.js`, mapa real (Leaflet + CartoDB dark), busca por CEP,
  filtros UF/cidade. `unidadeCardStyle` usa `u.foto` se existir, senão placeholder.
- **Header:** botão "Seja um franqueado" (`.btn-franqueado`, dourado) ao lado do "Agendar";
  no mobile entra no menu (`.nav-item-franqueado-mobile`).
- **Traços:** todos removidos (PowerShell .NET regex UTF-8 sem BOM).

---

## Etapa 2/3, backend + painéis (modo demo funcional; aguarda banco)

Detalhes em `BACKEND.md`.

- **API (Vercel Functions, zero-dependência):** `api/auth/login.js`, `api/auth/me.js`,
  `api/leads.js` (GET lista + POST cria), `api/leads/[id].js` (PATCH), `api/stats.js`.
  Auth por token HMAC. **Ponto de troca do banco:** `api/_lib/store.js` (sem `DATABASE_URL`
  → memória/demo; com `DATABASE_URL` → Postgres via `pg`).
- **Integração com o site:** `analytics.js` `trackLead()` faz POST fire-and-forget para
  `/api/leads`. Ponto único: todo lead (popup, agendamento, vagas, contato, franquia,
  chatbot) flui para o painel.
- **Painéis FUNCIONAIS (estilo Wix Analytics):** menu lateral fixo com submenus + roteador
  por hash (`#view`), responsivo. `painel-core.js` tem TODAS as telas com conteúdo (sem "em
  construção"):
  - **Visão Geral:** KPIs do mês (leads + variação %, hoje "ao vivo", agendamentos, taxa de
    conversão, unidades ativas 24h), gráfico de linha leads/dia (30d), donuts de tipo e
    origem, barras top procedimentos, ranking de unidades, atividade recente. (Chart.js via CDN.)
  - **Leads:** todos / pop-up / agendamento / recrutamento (tabela + filtros + status +
    detalhe + export CSV).
  - **Unidades:** ranking, distribuição por UF, cadastro (tabela das 70).
  - **Tráfego:** tempo real, origem, páginas, dispositivos.
  - **Demográfico:** idade, gênero.
  - **Promoções:** ativas, cadastrar, desempenho.
  - **Recrutamento:** vagas, candidatos.
  - **Configurações:** usuários, conta.
  - **Franqueado:** Visão Geral (próprios dados), Desempenho (procedimento/período/comparação
    com a rede), Equipe, Minha conta. Menu restrito (não vê unidades da rede, promoções nem
    seletor de temas).
  - **Seletor de temas (Aparência):** aplica o tema do site público via `localStorage`
    `laserco_base` (base) + `laserco_accent` (sazonal), combináveis, sem recolorir o painel.
- **Dados de demonstração:** `painel-seed.js` gera ~900 leads em 30 dias (volume ~60k visitas/mês). A integração real
  (dados ao vivo, CRUD que salva, mapa geográfico no painel) fica para o DESENVOLVEDOR na
  fase de sistema unificado. Cliente aprovou esse recorte.
- **Logins de teste:** `franqueador@laserco.com.br`, `vmariana@laserco.com.br`,
  `ipanema@laserco.com.br`, senha `laser2026`.
- **Testado no navegador (demo):** login, guard de acesso, filtro por papel, todas as telas
  dos dois painéis com gráficos/tabelas, troca de status, seletor de temas, lead do site
  aparecendo no painel. Sem erros de console.

---

## Imagens (estratégia atual)

O Antigravity gerou ~40 imagens via Pollinations que saíram TODAS como pinturas de tigre
(script do agente quebrado). Chamando o Pollinations direto com `?model=flux&nologo=true` +
prompt bom sai ótimo. Ferramenta: **`_gen.cjs`** (raiz, não versionado). Comandos:
`node _gen.cjs` (gera, pula os existentes, retry contra rate-limit 402), `--wire` (liga
`foto:`/`img:` no data.js), `--unwire-units` (remove `foto:` das unidades).

Estado por categoria:
- **Máquinas (5):** imagens de IA boas, no ar (`img:` nos `lasers` do `data.js`).
- **Recepção (Vagas):** o cliente trocou pela própria (`assets/img/equipe/recepcao.png`).
  `vagas.html` aponta pro `.png`.
- **Unidades:** placeholder (foto de IA de fachada foi recusada; tem que ser a real). Sem
  `foto:` no `data.js`.
- **Procedimentos (cards):** PENDENTE. Cliente quer ~43 imagens de IA (as sem foto), estilo
  das `proc-*.jpg`, SEM texto em cima. Fazer só quando ele pedir; hoje mostram o placeholder.
- **Antes/depois:** placeholder (só foto real com autorização).

Como o cliente troca uma foto: salvar com o mesmo nome/caminho que o código espera.

---

## Pendências (próximas etapas)

1. **Imagens dos ~43 procedimentos** via `_gen.cjs` (flux), sem texto em cima, depois `--wire`.
2. **Banco + senhas reais** para ativar o painel de verdade (ver `BACKEND.md`: Postgres no
   Marketplace, `DATABASE_URL`, `npm i pg`, criar tabela, `AUTH_SECRET`).
3. **Integração real do painel** (dados ao vivo, CRUD, mapa) com o desenvolvedor.
4. **Fotos reais** das fachadas de unidade e antes/depois (cliente fornece).

---

## Aprendizados técnicos

- Substituição em massa de texto acentuado: PowerShell .NET regex com UTF-8 sem BOM (o Edit
  `replace_all` comia o espaço).
- Deploy de produção: `vercel --prod` SEM `--yes` (o `--yes` é bloqueado pelo classificador).
- **Cache foi a causa de vários "bugs" fantasmas:** `vercel.json` tinha CSS/JS/assets
  `immutable` (1 ano); o cliente via versões velhas (placeholder quebrado, "bug" na entrada
  do painel). Corrigido para `max-age=0, must-revalidate`. Pede 1 Ctrl+Shift+R.
- **Pollinations funciona chamado direto** (flux + nologo + prompt bom); os tigres vieram do
  script quebrado do Antigravity. Rate-limit 402 sob carga: gerar com baixa concorrência +
  retry (é o que o `_gen.cjs` faz).
- **Preview headless:** o `_serve.cjs` precisa enviar `Cache-Control: no-store` (senão o
  navegador do preview cacheia e mostra código velho). Clicar "Entrar" é instável por timing;
  para testar o dashboard, setar a sessão via `eval` (`LaserAPI.login` + `LaserPainel.setSession`)
  e navegar direto pra `painel-franqueador.html`.
