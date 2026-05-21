# Memória do projeto, Laser & Co. (atualizado 2026-05-21)

Memória completa do projeto para retomar do zero (sobrevive a `/clear`). Espelha o
`CLAUDE.md`. Site institucional estático (HTML/CSS/JS, sem framework de build) da
**Laser & Company Brasil**, rede de franquias de estética a laser.

- **Repositório:** `lasercompany-institucional` (conta `OFerreira98`)
- **Produção:** https://lasercompany-institucional.vercel.app
- **Deploy:** `git push` (a Vercel publica sozinha) ou `vercel --prod` SEM `--yes`.
- **Verificar deploy:** `vercel ls lasercompany-institucional --prod`

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
  - **Seletor de temas (Aparência):** aplica o tema do site público via
    `localStorage['laserco_theme']` (base claro/dark + 6 sazonais) sem recolorir o painel.
- **Dados de demonstração:** `painel-seed.js` gera ~112 leads em 30 dias. A integração real
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
