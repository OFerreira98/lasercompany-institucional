# Mudanças desde o briefing do novo responsável (22/05/2026)

Memória de trabalho do bloco de evolução do site institucional Laser & Co
**depois que o novo responsável pela área de marketing/site da Laser Company
mandou as "Considerações Site Laser Company, 22.05.2026"** (docx anexado pelo
cliente no nosso chat) com as sugestões de reforma visual.

Objetivo: consolidar tudo o que foi feito em ondas, em um único documento, pra
servir tanto de memória pra retomar quanto de relatório pro cliente conferir
o histórico.

> **Princípio que veio do cliente:** zero traços longos no site, padrão de cores
> da marca em qualquer elemento novo, comunicação concisa, painel sempre
> vinho/dourado, e as 5 ondas de mudanças do docx tratadas em sequência.

---

## ONDA 1, base do docx (22/05/2026), commit `166d867`

Foco: pegar as pontuações principais do docx do novo responsável e implementar
em sequência. Onda fundadora da reforma visual.

**Popup (`scripts/popup.js` reescrito)**
- Multi-step com nome + WhatsApp + UF + Cidade + Unidade (todos os selects
  filtrados em cascata).
- Botão "Usar minha localização" pega lat/lng via Geolocation e pré-seleciona
  a unidade mais próxima (distância euclidiana com `unidades[i].lat/lng`).
- Nova regra de persistência: continua insistindo até o usuário se inscrever,
  e a cada nova visita do navegador reaparece (até inscrever).
- `STORAGE_KEY=laserco_popup_state` no localStorage (cooldown de 2h depois
  de submitted) + `SESSION_KEY` no sessionStorage (dismiss da sessão).
- Constantes: `FIRST_DELAY_MS=6000`, `SUBMIT_COOLDOWN_MS=2h`.

**Header limpo (`scripts/layout.js`, `styles/layouts.css`)**
- Trocou a cápsula vinho fixa central por header `position: fixed` full-width
  branco com logo maior e botão SAC.
- Classe `.site-header-clean` reescreve a paleta do header pra cores escuras
  sobre fundo branco.
- Botão "Seja um franqueado" dourado entrou ao lado do "Agendar avaliação".

**Modal SAC (`scripts/layout.js`)**
- Modal lateral com form (nome, WhatsApp, e-mail, área, mensagem) +
  sidebar de contatos (WhatsApp central, e-mail expansão, e-mail SAC).
- Dispara `LaserAnalytics.trackLead('sac', payload)` no submit.
- Acessível via botão SAC no header, ESC fecha, click fora fecha.

**Home, backgrounds neutros**
- Seções alternam `section-light` (branco/creme com texto vinho) e
  `section-wine` (vinho com texto creme).
- Removidos os blocos antigos "Premium pra todo mundo" e "Sua vez agora"
  (a pedido do docx).
- `body:not(.painel-body) { background: #FFFFFF }` impede a faixa vermelha
  aparecendo atrás de qualquer seção.

**Rodapé "Saiu na mídia"**
- Bloco no fim do `<footer>` com 6 slots prontos pra logos (Exame, PEGN,
  Estadão, Folha de S.Paulo, ABF, Forbes). Texto + link "Ver matéria"
  preparado, esperando o cliente mandar as URLs.

---

## Hotfix entre ondas, `e0b049d`

**Bug crítico:** o `.sac-overlay` tinha `display: flex` no estado base, então
o overlay invisível com `z-index: 1100` ficava sobre toda a tela bloqueando
cliques. O cliente reportou "popup quando eu clico no nome não consigo
escrever, clico pra fechar e não fecha".

Fix: `display: none` + `pointer-events: none` por padrão, só ativa quando
o atributo `[hidden]` cai (via `.sac-overlay:not([hidden])`).

---

## Regra de cores oficial, `1a8a014`

**Cliente mandou um print** do popup mostrando os `<option>` do select
nativo aparecendo brancos com texto cinza ilegível.

Solução:
- Adicionado em `base.css` styles pra `select option` global (fundo
  `#2A0F0D` vinho escuro, texto `#F5EFE2` creme).
- Override pra contextos claros (`.sac-modal`, `.painel-content`,
  `.section-light`): `option` branco com texto vinho escuro.

**Regra salva no `memoria.md` e `CLAUDE.md` (rule #10):**

> Toda correção ou novo elemento segue o padrão de cores da marca. Nada de
> cinza/branco aleatório do navegador. Paleta oficial:
> - Vinho: `#1A0404` → `#8E3B36`
> - Dourado: `#7A5418` → `#E8C088`
> - Creme: `#F5EFE2` → `#FFFFFF`
> - Muted warm: `#4E1A15` → `#8A6850`
> - Fundo vinho → texto creme + acentos dourados
> - Fundo branco/creme → texto vinho escuro + acentos dourados

---

## ONDA 2 (docx + feedback de tela), commit `5912a8a`

Cliente reportou contraste em vários blocos e pediu mais funcionalidades
que estavam no docx mas tinham passado batido.

**Auditoria de contraste**
- `.section-light` agora escopo todas as `--color-*` pra cores escuras
  (texto vinho sobre fundo claro), em vez de herdar do dark theme global.
- `.section-light .unidade-card` reverte as variáveis pra cores escuras
  dentro do card (porque os cards de unidade são vinho escuro mesmo em
  seção light).
- Depoimentos, marquee, blocos de prova social, tudo passa pelo escopo
  novo.

**Mega-menu Procedimentos**
- Header ganha um mega-menu de 3 colunas no hover do item
  "Procedimentos": Estética a Laser, Depilação a Laser, Ultrassom
  Ultracel.
- Cada coluna lista os 6 primeiros procedimentos da categoria + link
  "Ver todos os tratamentos".
- `populateMegaMenu()` em `layout.js` puxa de `window.LaserData.procedimentos`
  com retry de 100ms até o data.js carregar.

**Hero carrossel (3-5 banners aleatórios)**
- `index.html` virou carrossel com 5 slides (premium, estética, depilação,
  ultrassom, avaliação grátis).
- `renderHero()` em `page-index.js` faz `shuffleSlides()` no load (premium
  primeiro, resto embaralhado).
- Auto-roda 4.5s entre slides, pausa quando a aba sai de foco (Page
  Visibility API).
- Setas e bullets de navegação, cross-fade com Ken Burns no background.

**Dinamismo geral**
- `.reveal` reescrito com `translateY(40px)` + `scale(0.98)` e cubic-bezier
  "snap".
- Microinterações: shimmer scan no `.btn-primary` no hover, underline animado
  nos links do footer, scroll-behavior smooth global.

**"Saiu na mídia" com logos reais**
- Inseridas as logos reais do site oficial nos 6 slots (Exame, PEGN, etc).

**Blog block na home (3 cards iniciais)**
- Seção "Conteúdo & Cuidados, Aprenda com nossas profissionais" criada
  com 3 cards placeholder (Cuidados pós-laser, Quantas sessões, Mitos da
  depilação).
- Cinza claro como o cliente pediu.

---

## ONDA 3, complementos do docx, commit `908ff56`

**Bloco "Siga a gente nas redes sociais"** (estilo Instagram)
- Seção `.section-wine` com grid de 6 cards (3x2 desktop, 2x3 tablet,
  1x6 mobile).
- Cada card tem foto + overlay com ícone do Instagram/play do vídeo +
  caption.
- Botão "Ver mais no Instagram" abaixo do grid.
- 6 imagens placeholder (geradas com IA) enquanto não tinha o feed real.

**Form curto de agendamento na home**
- Bloco `.section-wine` com mini-form (UF + cidade + unidade + WhatsApp
  + data preferida). Filtros em cascata.
- Submit salva no localStorage (`laserco_leads`) e dispara `trackLead`
  pro painel.

**Páginas Unidades + Vagas com tema clean**
- Hero superior das duas páginas com `.page-hero` (eyebrow + título +
  subtítulo).
- Vagas mantém estrutura como o cliente pediu, só ganhou foto de fundo
  no hero (`assets/img/equipe/recepcao.png`).

**Modal de procedimento, conteúdo expandido**
- `proc.indicado` (texto "Indicado para") por procedimento.
- `proc.sessoes` (número de sessões recomendadas).
- Bloco FAQ por procedimento (4-6 perguntas).
- URL deep-link `?proc=ID` abre o modal direto.

---

## Cards de unidade, fix de contraste, `7dacfe3`

Cliente mandou print mostrando o card vinho com texto creme ilegível
(meta info, botão "AGENDAR" gold-on-gold). Causa: `.section-light .unidade-card`
herdou as `--color-*` light em vez de re-escopar pra dark.

Fix: escopo manual de todas as variáveis dentro de
`.section-light .unidade-card` pra cores dark (`--color-text: #F5EFE2`,
`--color-accent-pale: #E8C088`, etc).

---

## Cards/movimento + faixa vermelha, `78295c3`

**Header esconde no scroll**
- Cliente: "ele tinha pedido pra o menu sumir quando rolo a página".
- Adicionado `bindHeaderScroll()` em `layout.js`: detecta direção do
  scroll, esconde com `transform: translateY(-105%)` ao rolar pra baixo,
  reaparece ao rolar pra cima ou voltar ao topo.

**Eliminar faixa vermelha entre header e hero**
- Cliente: "carrinho grosso dessa caixa vermelha".
- `body` agora tem `background: #FFFFFF` (não mais herdando do tema
  dark global).

**Microinterações tech**
- Pulse-ring no "12x sem juros" e nos cards genéricos `.stat-pulse`.
- Reveal animation mais pronunciado (com `scale(0.98)`).

**Carrossel autoplay garantido**
- Removido o `mouseenter` que pausava o carrossel se o cursor estivesse
  por cima na hora do load (estava parando o autoplay logo de saída).
- Mantida só pausa via Page Visibility API.

---

## Hero ocupando 100vh, `274456f`

Cliente: "Cara, ainda tem uma faixa branca ali, ocupa este espaço da do
menu pra baixo tudo com a foto".

Bug encontrado: regra ancestral `main { padding-top: 100px }` em
`layouts.css` estava criando o espaço branco.

Fix:
- Remove o `padding-top: 100px` global do `main`.
- Body ganha classe `.page-home` (só na home).
- `body:not(.page-home) { padding-top: 144px }` (compensa header em
  páginas internas).
- `.hero-carousel { min-height: 100vh }`.
- Hero-slide padding-block top vai de `clamp(7rem, 12vw, 9rem)` pra
  `clamp(9rem, 14vw, 11rem)` (acomoda o header de 140px).

---

## Logo do header maior e mais visível, `bbee462`

Cliente: "A logo ainda não está aparecendo, deixa ela bem maior".

- Logo de **88px → 120px** no desktop (+36%), **52px → 68px** no mobile.
- Drop-shadow, contraste (1.05 → 1.18) e saturação (1.25) reforçados
  pra o dourado "lavado" parar de sumir no fundo branco.
- Header agora tem ~140px de altura.
- Padding consequente das outras páginas e do hero-slide top ajustados.

---

## Blog completo, 40 matérias reais, `eb0ae6c`

Cliente mandou o HTML do blog do site oficial e pediu pra trazer todas
as matérias.

- `_extract_blog.cjs` (dev tool): parser do `Referencias 1/Laser & Company
  Brasil - blog.html`, extrai 40 posts (título, resumo, imagem, URL).
- 38 imagens copiadas pra `assets/img/blog/` com slug do post.
- `data.blog` reescrito com os 40 posts reais.
- Home: bloco "Conteúdo & Cuidados / Aprenda com nossas profissionais"
  mostra 4 cards embaralhados a cada page load + rotaciona a cada 9s
  (pausa quando aba sai de foco).
- Página nova `/blog.html` lista as 40 matérias em grid de 4 colunas
  com busca por palavra-chave (título + preview).
- Cada card linka pro post original em `lasercompany.com/blog/<slug>`.
- Footer ganhou link "Blog" no Mapa do site.

---

## Instagram real (Behold.so), `db4c146` + `dd29ec0`

Cliente perguntou se dava pra usar os 6 últimos posts reais do Instagram
em vez das imagens AI.

- Recomendado **Behold.so plano free** (5 min de setup, sem dev pesado).
- Cliente conectou a conta `@lasercompanybrasil` no Behold e gerou o feed
  com ID `4STJ1LI7bMsbBpcQIQxL`.
- Bloco "Siga a gente" agora usa o web component `<behold-widget>`,
  feed se auto-atualiza sempre que a Laser & Co postar algo novo.
- Marca d'água "Powered by Behold" pequena no canto (plano free, pode
  remover com upgrade Lite US$ 9/mês).
- CSS customizado (`pages.css`) com as CSS variables do Behold:
  aspect 1/1 quadrado, raio 8px, hover vinho com texto creme e ícone
  dourado, spinner dourado.

---

## ONDA A, animações base (GSAP + ScrollTrigger + Lenis), `e13c40e`

Cliente: "Faltou movimento em geral no site, preciso de algo que tenha
mais dinamismo. Framer Motion / GSAP / ScrollTrigger / Lenis / Anime.js
/ Splide".

Decisão: como o site é HTML/CSS/JS sem bundler, **GSAP + ScrollTrigger
+ Lenis** via CDN cobrem 90% do que ele queria. Framer Motion não rola
(é React-only), Tailwind exige build, Lottie precisa de arquivos `.json`.

- `scripts/motion.js`: helpers GSAP (counter elegante, slideUp, stagger,
  drawLine, autoVideos) + Lenis smooth scroll global.
- `scripts/layout.js`: injeção automática via CDN dos 4 scripts no fim
  de cada page (paineis pulam).
- `base.css`: desliga `scroll-behavior: smooth` nativo quando Lenis
  ativo (evita briga).

Auto-aplica em elementos com:
- `data-counter="70"` (counter)
- `.motion-slide-up`
- `data-motion-stagger=".step-item"`
- `.motion-draw-line`
- `<video data-motion-autoplay>` (só toca dentro do viewport)

---

## ONDA B, stats do "Sobre a Laser", `e13c40e`

Cliente: "Os números está com contagiro mas está muito rápido, tem que
centralizar, e o 5 tecnologias premium não está pulsando, 12x sem juros
sem transição".

- Counter desacelerado: **1.1s → 3s** com easing `expo.out` (sensação
  premium, não corrida).
- `data-counter` por elemento (70, 15, 5, 12) + `data-prefix="+"` e
  `data-suffix="x"`.
- Stat-block centralizado (número grande no meio, label embaixo,
  `text-align: center`).
- Número MAIOR (`clamp(2.6rem, 5.2vw, 3.4rem)`) com `font-variant-numeric:
  tabular-nums` (dígitos com mesma largura, sem "pular" durante a
  contagem).
- Linha dourada sutil que cresce no hover (sensação tech).
- **5 tecnologias premium** e **12x sem juros** com classe `.stat-pulse`
  (anel pulsante + shine dourado animado no número).
- Stagger entry pelos 4 stats via `data-motion-stagger`.

---

## ONDA C, "Três frentes, uma marca", `e13c40e`

Cliente: "Na seção três frentes, tecnologia premium não está aparecendo,
fundo branco mas as letras não estão ornando".

- Seção mudou de `.section` simples pra `.section section-wine` (fundo
  vinho garante contraste do título "Tecnologia premium em 3 frentes"
  e da subseção).
- Os 3 cards de segmento (Estética, Depilação, Ultrassom) entram com
  stagger via `data-motion-stagger=".segment-photo-card"`.

---

## ONDA D, 4 passos redesenhados, `e13c40e`

Cliente: "Os quatro passos cara, dá um tchan, está muito simples. Linha
no fundo conectando um do outro. Identidade pra cada passo".

Redesign completo:
- `data.js`: cada passo ganhou chave `icone` (spark, map-pin, whatsapp,
  calendar-check).
- `renderPassos()` em `page-index.js` injeta SVG do ícone, número como
  badge dourado sobreposto ao ícone, container `.steps-line` conectando
  os 4 visualmente.
- CSS:
  - Card sem fundo (não mais retângulo branco), ícone redondo grande creme
    com anel pulsante (delay escalonado entre os 4: 0s, 0.4s, 0.8s, 1.2s).
  - **Linha dourada animada conectando os 4 ícones**, desenhada via
    `.motion-draw-line` (escala 0→1 horizontal) no primeiro scroll, com
    `cubic-bezier(0.22, 0.95, 0.36, 1)`.
  - Hover-lift + glow + scale no ícone.
  - Número como pequeno badge dourado gradient no canto do ícone.

---

## ONDA E, procedimentos com vídeo + foto + antes/depois, `b1e5c60`

Cliente: "Baixei imagens e vídeos de todos os procedimentos pra pasta
assets/img/. Aproveita o que tem. Onde tem só vídeo, coloca vídeo no
lugar da imagem. Onde tem foto antes/depois (Axila, Costas) está numa
foto só, vê como fazer".

`_link_media.cjs` (dev tool): mapeamento manual id → arquivo, copia 58
arquivos de `assets/img/` (raiz, nomes com espaço e acento) pra
`assets/img/procedimentos/` com slug seguros. Atualiza `data.js` com
`img` / `video` / `antesDepois` em 38 procedimentos.

`scripts/page-procedimentos.js`:
- `procMediaHTML(p)`: renderiza `<video autoplay muted loop>` quando o
  procedimento tem `video`, senão `<img>`, senão placeholder do monograma.
  Vídeos só tocam dentro do viewport (`setupAutoVideos` do motion.js).
- `antesDepoisHTML(p)` com 3 variantes:
  1. **Combo:** se `proc.antesDepois` existe (foto única com antes E
     depois lado a lado, caso de Axila e Costas), mostra full-width com
     badges "Antes" (esquerda) e "Depois" (direita) sobrepostos.
  2. **Vídeo:** se não tem antes/depois mas tem vídeo, usa o vídeo como
     hero (mostra o procedimento em movimento, melhor que placeholder).
  3. **Clássico:** split antes | depois.

CSS:
- `.procedimento-card-media-video`: posiciona `<video>` cobrindo o card
  + indicador "play" dourado pequeno no canto.
- `.proc-antes-depois-combo`: aspect 3/2 com badges nas pontas.
- `.proc-antes-depois-video`: aspect 16/9 com vídeo.

---

## ONDA F, 59 unidades reais com fotos, `aa3a8db`

Cliente: "Baixei o HTML da página unidades com todas as fotos. Sobe as
fotos pra cada unidade".

`_link_unidades.cjs` (dev tool): parser do `Referencias 1/UNIDADES.html`,
extrai 59 unidades com regex no formato `<div class="blog-item col-md-3
mb-5" data-uf="XX">`. Copia 59 fotos pra `assets/img/unidades/` com
slugs `<nome>-<cidade>-<uf>.<ext>`. Reescreve `window.LaserData.unidades`
em data.js.

Cada unidade ganha:
- `id` slug
- `nome`, `cidade`, `uf`
- `endereco` real (com CEP)
- `horario` de funcionamento
- `whatsapp` (formato `5511XXXXXXXXXXX` pra link wa.me)
- `whatsappFmt` (formato `(11) 99999-9999` pra exibir)
- `instagram` (handle, ex: `laserco.jatiuca`)
- `email` da unidade (ex: `jatiuca@lasercompany.com`)
- `foto`: `assets/img/unidades/<slug>.<ext>`

**Diferenças do estado anterior:**
- Antes eram 70 unidades fictícias, agora são 59 reais.
- Cards de unidade agora mostram a foto real da fachada (não mais
  placeholder do monograma).
- Os 11 antigos endereços fictícios sumiram (eram inventados).

---

## ONDA F.2, geocoding das 59 unidades, `7173de3`

`_geocode_unidades.cjs` (dev tool): pra cada unidade, chama
**Nominatim** (OSM, free, sem chave) com o endereço completo. Fallback
pra "cidade, UF, Brasil" quando o endereço exato não bate. Rate limit
de 1.1s por request (~1 min pras 59).

Resultado:
- 59/59 unidades com `lat` e `lng` reais.
- `cepPrefixos: [primeirosTresDigitos]` extraído do CEP do endereço.
- Mapa Leaflet em `/unidades` voltou a funcionar.
- Busca por CEP do cliente filtra unidades com prefixo equivalente.

**Limitação conhecida:** algumas unidades do RJ/SP centro caíram na
coordenada da cidade (Nominatim não achou o endereço exato e usou
fallback). Pra precisão total seria preciso Google Maps Geocoding
(paga). Suficiente pra dar uma noção geográfica no mapa.

---

## ONDA G, números da franquia (estilo Rafael Estevez), `e58d3b5`

Cliente: "Baixei o HTML do site do Rafael, tem cards de margem,
royalties, rentabilidade bem bonitos. Trocar os nossos por aqueles.
Eles estão mais bonitos".

Os 4 cards "O que esperar" em `franqueado.html` (Faturamento, Payback,
Margem, Royalties) ganharam o **mesmo visual dos cards "Por que
investir"** (que já são parecidos com os do site Rafael):

Antes: cards com ícone SVG no topo dourado + número pequeno + label
caixa-alta.

Agora:
- Número GIGANTE em gradiente dourado (`clamp(2.4rem, 4.6vw, 3.2rem)`).
- Sufixo "a 3MM", "a 24 meses", etc destacado em tamanho menor.
- Título elegante em serif.
- Parágrafo descritivo (explica o que cada métrica significa).
- Hover-lift com radial glow dourado no canto direito.
- Layout: 4 colunas no desktop, 2 colunas em tablet, 1 coluna no
  mobile. Stagger entry via `data-motion-stagger`.

---

## Estado atual do site, recap pro cliente

**No ar em** `https://lasercompany-institucional.vercel.app`

| Bloco | Estado |
|---|---|
| Header | Branco fixo, logo grande dourada, esconde no scroll, SAC + franqueado + agendamento |
| Hero | Carrossel de 5 banners, auto-roda 4.5s, embaralha a cada visit |
| Sobre, números | Counter 3s, centralizado, pulse no 5/12x, stagger entry |
| Três frentes | Vinho, 3 cards de segmento, stagger |
| Queridinhos | Marquee infinito de procedimentos populares |
| Como funciona | 4 passos com ícones, anel pulsante, linha dourada conectando |
| Redes sociais | Feed real do Instagram (Behold), 6 últimos posts |
| Depoimentos | 4 depoimentos placeholder (esperando reais) |
| Agendamento curto | Form na home com UF/cidade/unidade/WhatsApp |
| Blog | 4 cards rotativos a cada 9s, do pool de 40 matérias reais |
| Footer | "Saiu na mídia" + mapa do site + card franquia + acesso painel |

**Páginas internas**

| URL | Estado |
|---|---|
| `/procedimentos` | Cards com vídeo autoplay + foto + antes/depois combo |
| `/unidades` | 59 unidades reais com foto da fachada, mapa, busca por CEP |
| `/agendamento` | Stepper 3 passos com lead salvo no painel |
| `/blog` | Lista completa das 40 matérias, busca por palavra-chave |
| `/franqueado` | Persona do Rafael + 4 cards no estilo do site oficial |
| `/vagas` | Hero com foto + estrutura preservada |
| `/contato` | Foco em SAC e WhatsApp |
| `/painel` | Login + 2 dashboards (franqueador / franqueado) |

**Bibliotecas externas em uso (todas CDN free)**

- GSAP 3.12.5 + ScrollTrigger (animações)
- Lenis 1.0.42 (smooth scroll global)
- Behold.so widget (feed Instagram)
- Leaflet 1.9.4 + OSM tiles (mapa unidades)
- Chart.js (gráficos do painel)

---

## Pendências (esperando cliente ou desenvolvimento)

1. **Logos reais** dos veículos no "Saiu na mídia" (Exame, PEGN,
   Estadão, Folha, ABF, Forbes) + URLs das matérias publicadas.
2. **Fotos reais do hero** (5 banners) substituindo os placeholders.
3. **Depoimentos reais com foto/autorização** (hoje são 4 placeholders).
4. **Antes e depois reais** dos procedimentos (autorização dos clientes).
5. **Banco Postgres + AUTH_SECRET** pra ativar painel em produção
   (hoje painel roda em modo demo, ver `BACKEND.md`).
6. **Quiz "Descubra seu protocolo ideal"** (pediu o novo responsável,
   precisa de perguntas + mapeamento pra protocolo).
7. **Geocoding preciso das unidades do RJ/SP** (paga, opcional).

---

## Aprendizados técnicos desta fase

- **Behold.so funciona muito bem em sites estáticos**, com 1 web component
  e 1 script CDN. Plano free dá conta de 6-12 posts com marca d'água
  discreta.
- **Lenis + ScrollTrigger** precisa do `gsap.ticker.add(time => lenis.raf(time
  * 1000))` pra ficarem sincronizados (senão ScrollTrigger não detecta
  scroll do Lenis).
- **GSAP via CDN** funciona perfeito em HTML/CSS/JS sem bundler. O
  helper centralizado em `motion.js` evita poluir cada page-*.js.
- **Counter com `tabular-nums`** evita o "pulo" horizontal durante a
  contagem (cada dígito ocupa a mesma largura).
- **Foto antes/depois combo** (uma imagem só com os dois lados) é
  comum quando o cliente recebe do salão original. CSS com
  `aspect-ratio: 3/2` + 2 badges absolutas nas pontas é mais limpo que
  tentar cortar a imagem em 2.
- **Nominatim OSM** é free e dá conta de geocoding com baixo volume
  (rate 1 req/s, fallback "cidade, UF, Brasil" quando o endereço exato
  não bate).
- **Parser de HTML salvo do navegador** com regex captura grupos por
  classe e estrutura (`<div class="blog-item col-md-3 mb-5" data-uf="XX">`
  é estável o suficiente pra extrair 40 ou 59 itens sem DOM parser).

---

*Arquivo mantido como memória de trabalho. Atualizar quando uma nova
onda de mudanças entrar.*
