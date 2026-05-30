# Laser & Co. — Site Institucional (memória do projeto)

Site institucional estático (HTML/CSS/JS, sem framework de build) da **Laser & Company Brasil**,
rede de franquias de estética a laser. Hospedado no GitHub e publicado na Vercel.

> **AO RETOMAR (após `/clear`) ou quando o usuário disser "prosseguir"/"continuar":** leia a
> seção **"PROSSEGUIR / CONTINUAR"** no topo de `memoria.md`. É lá que está o estado atual e o
> próximo passo. Resumo rápido: cores + tema (base/acento) + refinos do painel + volume do seed
> já CONCLUÍDOS e commitados. Próximo: construir a página "Seja um franqueado" (`franqueado.html`)
> com a persona do Rafael (material em `Referência a site Rafael...`), depois montar 2 relatórios
> (cliente + devs).

- **Repositório:** `lasercompany-institucional` (conta `OFerreira98`)
- **Produção:** https://lasercompany-institucional.vercel.app
- **Deploy:** `vercel --prod` (SEM `--yes` — com `--yes` o classificador de auto-mode bloqueia)
- **Verificar:** `vercel ls lasercompany-institucional --prod`

---

## REGRAS PERMANENTES (não violar)

1. **ZERO traços longos.** Nunca usar em-dash (—) nem en-dash (–) em NENHUM texto visível
   ao usuário (endereços, footer, copy, popup, chatbot) — NEM nas respostas do chat com o cliente.
   Substituir sempre por vírgula ou ponto.
2. **Sem "#SemTabus".** Já removido; usar "Estética premium acessível a todos".
3. **Sem escrita "cara de IA"** (frases com travessão, tom robótico). Texto natural, direto.
4. **Unidades = SÓ foto REAL da franquia.** NUNCA usar imagem de IA/inventada de fachada
   (o cliente recusou: cada unidade precisa da foto verdadeira dela). Sem foto, usar o
   placeholder do monograma "Laser & Co". Antes/depois também precisa ser foto real (com
   autorização), nunca par gerado por IA.
5. **Imagem de IA só para genéricos** (máquinas, procedimentos, texturas, fundos). Gerar via
   `_gen.cjs` (Pollinations modelo flux) e CONFERIR cada uma. NUNCA escrever texto/aviso em
   cima da imagem (nada de "imagem em produção" nem "gerado por IA"). O cliente sabe que é
   provisório e troca depois.
6. **Página Vagas: NÃO mexer na estrutura** (o cliente ama a página). Só hero com foto de
   fundo (`assets/img/equipe/recepcao.png`) que se auto-remove se o arquivo não existir.
7. **Comunicação concisa** com o cliente, resumir o resultado, sem texto longo.
8. **Cache:** em `vercel.json`, CSS/JS/assets NUNCA `immutable`. Usar `max-age=0,
   must-revalidate` (CSS/JS) e curto nas imagens, senão o cliente fica preso na versão velha
   (já aconteceu: parecia "bug", era só cache; resolve com Ctrl+Shift+R + headers revalidando).
9. **Painéis sempre vinho/dourado** (`data-theme="default"` fixo), não trocam com o tema do site.
10. **TODA correção ou novo elemento segue o padrão de cores da marca.** Nada de cinza/branco
    aleatório do navegador (problema clássico: `<option>` nativo saindo branco/cinza ilegível).
    Cada novo componente ou ajuste tem que ser conferido no contexto em que aparece (fundo
    vinho → texto creme; fundo branco/creme → texto vinho escuro). Paleta oficial:

    **Vinho (escuro → médio):** `#1A0404`, `#1F0B0A`, `#2A0F0D`, `#481712`, `#5E211B`,
    `#74302A`, `#8E3B36`
    **Dourado (profundo → claro):** `#7A5418`, `#9A6B1E`, `#B57C0C`, `#C8A064`, `#D88F3F`,
    `#E8C088`
    **Creme / off-white:** `#F5EFE2`, `#FAF6EE`, `#F7EEDD`, `#F6F2EA`, `#FFFFFF`
    **Muted warm (texto secundário):** `#4E1A15`, `#6E4A3A`, `#8A6850`

    **Regra de contexto:**
    - Fundo vinho escuro → texto creme + acentos dourados
    - Fundo branco/creme (Versão Clara, painel-content, SAC, section-light) → texto vinho
      escuro + acentos dourados
    - **NUNCA** deixar elemento usando default do navegador (option, scrollbar, focus ring).

11. **"Saiu na mídia" mora SÓ no rodapé** (`scripts/layout.js`, `.footer-media-strip`). Texto
    puro (nome do veículo em itálico, sem logo). NÃO criar seção "Na mídia" / "Imprensa" em
    nenhuma página. NÃO inventar veículos (Exame, Estadão, Folha, Forbes etc. estavam fake e
    foram apagados). Os 4 reais: **Veja** (não "Veja Rio"), **ABF**, **Varejo** (= ACIRP),
    **Agenda Carioca**. Slots são `<a target="_blank" rel="noopener">` clicáveis.

12. **CEP nunca afirma "sua unidade é X" quando é em outra cidade longe.** Lógica em
    `scripts/cep.js findUnidade`: prefixo exato → mesma cidade → mesma UF marcado
    `_isDistant`. Caso de erro famoso: Cascavel (PR) recomendado pra Maringá (PR), 280km.
    Quando `result.isDistant`, chat/modal dizem "Ainda não temos unidade em <cidade>, a
    mais próxima é <X>". Não salva unidade distante no localStorage.

13. **Chatbot é AGENTE, não a marca.** Apresenta-se como "Agente de Atendimento da Laser
    & Co" (não como "atendimento da Laser & Co"). Header do chat também "Agente de
    Atendimento". Mensagem inicial: "Olá! Sou o Agente de Atendimento da Laser & Co.
    Como posso te chamar?". Os dois flutuantes (WhatsApp + agente) ficam no canto inferior
    direito lado a lado, ambos bolinhas redondas 56x56 (WhatsApp verde, agente vinho).

---

## Estrutura

- `index.html`, `procedimentos.html`, `unidades.html`, `agendamento.html`, `vagas.html`,
  `contato.html`, `franqueado.html`
- `styles/`: `tokens.css`, `base.css`, `components.css`, `layouts.css`, `pages.css`
- `scripts/`: `data.js` (fonte de dados), `layout.js`, `main.js`, `theme.js`, `popup.js`,
  `cep.js`, `analytics.js`, `chatbot.js`, `whatsapp.js`, `page-*.js`
- `assets/img/`: subpastas `unidades/`, `antes-depois/`, `maquinas/`, `equipe/` (+ `.gitkeep`)
- `assets/img/COMO-ADICIONAR-FOTOS.md`: guia para o cliente soltar fotos sem mexer no código

---

## Trabalho já concluído (entregue em produção)

Commits: `a07b3d1` (popup), `ee36ee0` (agendamento), `e2eebb4` (visual/traços). Todos no ar.

### Popup (`scripts/popup.js`)
- Persistente e insistente. Reaparece a cada nova visita e "incomoda" a cada **7s** se não houver
  inscrição. Após enviar, para de insistir e só volta após cooldown de **2h** (promoção relâmpago).
- Constantes: `FIRST_DELAY_MS=6000`, `NAG_INTERVAL_MS=7000`, `SUBMIT_COOLDOWN_MS=2h`,
  `STORAGE_KEY='laserco_popup_state'`. Cookie de supressão permanente foi REMOVIDO.
- `shouldShow()`: sem estado → mostra; `submitted` → só se passou o cooldown; `dismissed` → sempre.
- Copy: título sem "na sua unidade"; "GRÁTIS" em caixa alta; botão "Resgatar meu brinde";
  sucesso "Resgatar meu brinde agora".

### Agendamento (`agendamento.html`, `scripts/page-agendamento.js`)
- Passo 3 do stepper renomeado de "WhatsApp da unidade" para **"Agendamento"**.
- Tela final entrega RESULTADO: "Enviamos sua solicitação de avaliação para a unidade <nome>
  (<cidade>/<uf>). Para garantir seu horário, confirme agora pelo WhatsApp..." + botão
  "Confirmar agendamento no WhatsApp".
- Lead salvo em `localStorage` (`laserco_leads`) no fim do passo 2 — pronto para o painel
  futuro ("BQ quente"). Ponto de troca para `POST /api/leads` marcado.
- Scroll corrigido: cada passo rola até o topo do step ativo (offset 90px), não para o topo da página.

### Procedimentos (`procedimentos.html`, `scripts/page-procedimentos.js`, `styles/pages.css`)
- Cards com `procMediaStyle(p)`: usa `p.img` se existir, senão gradiente da marca.
- Badge "Popular" não corta mais o nome (badge sobre a área de mídia + padding no título).
- Modal de detalhe abre com bloco **antes/depois** no TOPO (`antesDepoisHTML`): usa
  `proc.antes`/`proc.depois` se houver, senão "Foto em breve".
- Linha de prova social acima das tabs (`.proc-prova-social`).
- Tecnologias (4 lasers + ultrassom): `renderTech` mostra `l.img` quando existir.

### Unidades (`scripts/page-unidades.js`)
- `unidadeCardStyle(u)` usa `u.foto` (foto de fachada) se existir, senão gradiente.
- São **70 unidades** no `data.js` (cliente achou que eram 30 porque via versão não publicada).

### Vagas (`vagas.html`)
- Só hero ganhou `<img class="page-hero-photo" src="assets/img/equipe/recepcao.jpg" onerror="this.remove()">`.

### Traços
- Todos os " — " trocados por ", " em `data.js` e demais arquivos (via PowerShell .NET regex
  UTF-8 sem BOM: `[regex]::Replace($txt, ',(?=\p{L})', ', ')`). Endereços agora ex.:
  "Rua Vergueiro, 1500, Vila Mariana, São Paulo/SP". Footer: "a unir laser e ultrassom,
  democratizando o acesso à estética premium".

---

## Imagens (estratégia atual)

Saga: o Antigravity gerou ~40 imagens via Pollinations que saíram TODAS como pinturas de
tigre (script do agente quebrado). Descobri que chamando o Pollinations direto com modelo
`flux` + prompt bom sai ótimo. Ferramenta: **`_gen.cjs`** (na raiz, NÃO versionado; tem
permissão em `.claude/settings.local.json`). Comandos: `node _gen.cjs` (gera), `--wire`
(liga `foto:`/`img:` no data.js), `--unwire-units` (remove `foto:` das unidades).

Estado por categoria:
- **Máquinas** (5): imagens de IA boas, JÁ no ar (`img:` nos `lasers` do `data.js`).
- **Recepção (Vagas)**: o cliente trocou pela própria (`assets/img/equipe/recepcao.png`,
  PNG). `vagas.html` aponta pro `.png`.
- **Unidades**: FORAM revertidas a placeholder (a foto de IA de fachada foi recusada pelo
  cliente, tem que ser a real). Sem `foto:` no `data.js`. As 19 fachadas de IA foram apagadas.
- **Procedimentos (cards)**: PENDENTE. O cliente quer ~43 imagens de IA (as que não têm foto),
  no mesmo estilo das `proc-*.jpg` existentes, SEM nenhum texto em cima. Fazer DEPOIS, quando
  ele pedir. Hoje mostram o placeholder do monograma.
- **Antes/depois**: placeholder. Só foto real com autorização (não gerar por IA).

Como o cliente troca uma foto: salvar com o mesmo nome/caminho que o código espera.

---

## Etapa 2/3 — Backend + painéis (concluído, modo demo; aguarda banco)

Construído de forma autônoma. Detalhes completos em `BACKEND.md`.

- **Páginas:** `painel.html` (login), `painel-franqueador.html` (vê toda a rede),
  `painel-franqueado.html` (vê só a própria unidade).
- **API (Vercel Functions, zero-dependência):** `api/auth/login.js`, `api/auth/me.js`,
  `api/leads.js` (GET lista + POST cria), `api/leads/[id].js` (PATCH status/notas),
  `api/stats.js`. Libs em `api/_lib/` (`auth.js` HMAC, `http.js`, `store.js`, `seed.js`).
- **Ponto de troca do banco:** `api/_lib/store.js`. Sem `DATABASE_URL` → memória/demo;
  com `DATABASE_URL` → Postgres (lazy require `pg`). DDL e passo a passo em `BACKEND.md`.
- **Cliente:** `scripts/api-client.js` (`LaserAPI`: login/listLeads/updateLead com fallback
  para localStorage), `scripts/painel-seed.js` (~112 leads demo em 30 dias p/ os gráficos),
  `scripts/painel-core.js` (`LaserPainel`), `scripts/page-painel-login.js`. Estilos em
  `styles/painel.css`. Chart.js via CDN nas páginas de painel.
- **Painéis FUNCIONAIS (estilo Wix Analytics):** menu lateral fixo com submenus expansíveis +
  roteador por hash (`#view`), responsivo. `painel-core.js` tem TODAS as telas com conteúdo
  (sem "em construção"): Visão Geral (KPIs do mês com variação %, linha leads/dia, donuts de
  tipo e origem, barras top procedimentos, ranking de unidades, atividade recente), Leads
  (todos/popup/agendamento/recrutamento com tabela+filtros+status+detalhe+CSV), Unidades
  (ranking/distribuição por UF/cadastro), Tráfego (tempo real/origem/páginas/dispositivos),
  Demográfico (idade/gênero), Promoções (ativas/cadastrar/desempenho), Recrutamento (vagas/
  candidatos), Configurações (usuários/conta), e no Franqueado: Desempenho (procedimento/
  período/comparação com a rede) + Equipe. **Seletor de temas** (Aparência) aplica tema do
  site público via `localStorage['laserco_theme']` sem recolorir o painel.
- **Telas com dados de demonstração.** A integração real (dados ao vivo, CRUD que salva,
  mapa geográfico no painel) fica para o DESENVOLVEDOR na fase de integração com o sistema
  unificado. O cliente já sabe e aprovou esse recorte.
- **Integração com o site:** `scripts/analytics.js` → `trackLead()` faz POST fire-and-forget
  para `/api/leads`. Ponto único: todo lead (popup, agendamento, vagas, contato, franquia,
  chatbot) já flui para o painel.
- **Header:** botão "Seja um franqueado" (dourado, `.btn-franqueado`) ao lado do Agendar;
  no mobile entra no menu (`.nav-item-franqueado-mobile`).
- **Logins de teste:** franqueador@laserco.com.br / vmariana@laserco.com.br /
  ipanema@laserco.com.br, senha `laser2026` (em `auth.js` e `api-client.js`).
- **Testado em navegador (modo demo):** login, guard de acesso, filtro por papel, todas as
  telas dos dois painéis renderizam com gráficos/tabelas, troca de status, seletor de temas
  e lead capturado no site aparecendo no painel. Sem erros de console.
- **Falta o cliente fazer (ver BACKEND.md):** criar Postgres no Marketplace + `DATABASE_URL`,
  rodar `npm i pg`, criar a tabela, definir senhas reais + `AUTH_SECRET`, e dar `git push`.

## Pendências (próximas etapas)

1. **Imagens dos ~43 procedimentos** (cards sem foto): gerar via `_gen.cjs` (flux), estilo
   das `proc-*.jpg`, SEM texto em cima. Só quando o cliente pedir. Depois `--wire` no data.js.
2. **Banco + senhas reais** (ativa o painel de verdade): ver `BACKEND.md` (Postgres no
   Marketplace, `DATABASE_URL`, `npm i pg`, tabela, `AUTH_SECRET`).
3. **Integração real do painel** (dados ao vivo, CRUD que salva, mapa no painel): com o
   desenvolvedor, na fase de sistema unificado.
4. **Fotos reais** das fachadas de unidade e dos antes/depois (cliente fornece).

## Aprendizados técnicos

- Edit `replace_all` de " — " para ", " removia o espaço final. Usar PowerShell .NET regex
  com UTF-8 sem BOM para substituições em massa de texto acentuado.
- Deploy de produção: `vercel --prod` SEM `--yes` (o classificador bloqueia com `--yes`).
- **Cache foi a causa de vários "bugs" fantasmas:** `vercel.json` tinha CSS/JS/assets
  `immutable` (1 ano), então o cliente via versões velhas (placeholder quebrado, "bug" na
  entrada do painel). Corrigido para `max-age=0, must-revalidate`. Cliente precisa de um
  Ctrl+Shift+R uma vez.
- **Pollinations funciona bem chamado direto** com `?model=flux&nologo=true` e prompt bom
  (os tigres vieram do script quebrado do Antigravity). Tem rate-limit 402 sob carga: gerar
  com baixa concorrência + retry. `_gen.cjs` faz isso e pula os que já existem.
- **Testes no preview headless:** o servidor estático de teste (`_serve.cjs`) precisa enviar
  `Cache-Control: no-store`, senão o navegador do preview cacheia e mostra código velho. O
  fluxo de clicar "Entrar" é instável por timing; para testar o dashboard, setar a sessão via
  `eval` (`LaserAPI.login` + `LaserPainel.setSession`) e navegar direto.
- `_gen.cjs` e `_serve.cjs` são ferramentas de dev, NÃO versionadas (ficam na raiz).
  Permissão de `node _gen.cjs` está em `.claude/settings.local.json`.
- **Otimizar imagens SEM instalar nada:** usar `System.Drawing` via PowerShell (nativo
  Windows). Resize pra max 1600px + JPEG q82 derruba .jfif/.jpg de 3-5MB pra ~100KB.
  PNG de FOTO (sem transparência) → converter pra `.jpg` (atualizar refs). `rembg`,
  `ffmpeg`, `pip install` são BLOQUEADOS pelo classificador de auto-mode; pra remover
  fundo o cliente usa remove.bg. Funções prontas no histórico (memoria.md aponta).
- **Vídeos .mp4 dos procedimentos** (~270MB, 34 em `procedimentos/`) seguem pesados:
  recompressão precisa de `ffmpeg` (não instalado). Já usam `preload="metadata"` +
  autoplay só quando visível, então não pesam no load inicial. Os 33 da RAIZ de
  `assets/img` são backup e estão no `.gitignore`+`.vercelignore` (não sobem).
- **Instagram (home) = widget Behold** (`<behold-widget>` + `w.behold.so/widget.js`).
  Autoplay de vídeo é config do PAINEL Behold (não atributo HTML) e exige vídeo MUTED
  (política do browser). "Funcionava e parou" = provável estouro da cota free
  (1.200 views/mês). NÃO é o código do site. Ação do cliente no painel Behold.
- **Menu mobile, guerra de especificidade:** as regras `body.page-has-dark-hero
  .site-header-clean:not(.scrolled) .nav-link` são bem específicas. Pra sobrescrever
  cor/fundo no menu mobile aberto, usar `!important` + seletor `body .site-header-clean
  .header-nav.header-capsule ...`. Bug clássico: nav-link herdava `#1F0B0A` e sumia no
  fundo escuro; mega de Procedimentos abria sozinho (regra desktop `display:grid`
  vencia `display:none`).
- **Preview headless com cache podre:** nesta máquina o preview do `_serve.cjs` às vezes
  trava screenshots (UnknownVizError/timeout) e serve CSS cacheado mesmo com `?v=`.
  Quando suspeitar, validar direto no CSS/JS de PRODUÇÃO via `curl` (fonte da verdade).
- `.gitignore` alinhado ao `.vercelignore`: ignora `_*` (dev/mockups), `assets/img/*.mp4`,
  pastas de referência, `RELATORIO-CLIENTE.pdf`, `test_*`, `download.js`, `generate_images*`.

## Leva jun/2026 (entregue em produção, detalhes em memoria.md)

Sequência de pedidos do cliente, todos no ar:
1. **Hero da home**: 4 banners de IA → fotos reais de `procedimentos/` (campo `pos` p/
   background-position por slide).
2. **Saiu na mídia (rodapé)**: pool de 6 matérias reais (3 promo + 3 procedimento Veja Rio)
   em `data.js > naMidia`, sorteio aleatório de 3 por pageload (`layout.js renderFooterMedia`).
   Mini-cards CLAROS centralizados, pulsando, só a imagem da matéria (que já tem o título) +
   nome do veículo embaixo. Imagens em `assets/img/midia/`. NÃO repetir título (vem na imagem).
3. **Chats flutuantes**: WhatsApp + agente lado a lado no canto inf. direito, ambos bolinha
   redonda 56px. Agente se apresenta como "Agente de Atendimento" (regra 13).
4. **CEP honesto** (regra 12): não afirma "sua unidade é X" quando é cidade distante.
5. **Agendamento 50/50**: foto `hero.jpg` (2 mulheres) à esquerda com mask, form 3 passos à
   direita, fundo creme único. Variante A (mask) aprovada.
6. **Máquinas premium** (procedimentos > Tecnologia): 3 PNGs sem fundo em `maquinas/`, nome
   grande + tipo + benefícios curtos com check dourado.
7. **Performance**: imagens usadas ~101MB → ~13MB (System.Drawing); PNGs foto → JPEG.
8. **Mobile da home**: menu (links creme uniformes, franqueado = botão dourado, mega fechado,
   fundo vinho), hero sem setas, seções compactas (Como Funciona 2x2, blog 2 col, etc.),
   popup/ficha menores, rodapé sem o card franqueado (footer 2 col).

**Próximo provável:** cliente revisa o mobile da home, depois partimos pras OUTRAS páginas
(ele pediu pra fechar a home primeiro). Pendência herdada: imagens IA dos ~43 procedimentos,
banco real, integração do painel, fotos reais de fachada/antes-depois.
