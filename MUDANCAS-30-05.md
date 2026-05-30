# Mudanças do dia 30/05/2026

Sessão de polimento solicitada pelo cliente em sequência: heros consistentes
em todas as páginas, 3 plataformas reais no lugar das 5 tecnologias, redesign
do hero do agendamento (versão "foda" e depois versão leve), hero do
franqueado com foto da recepção, e correções de visibilidade/visual no
franqueado.

Commits da sessão (mais recente embaixo):

- `e7bb597` Onda I, hero overlay + 3 plataformas + agendamento cinematográfico
- `9e79c3f` Agendamento, refazendo leve (cliente não gostou da versão pesada)
- `5770e4b` `.vercelignore` (deploy estourava com 714MB de mídia draft)
- `13d1c42` Franqueado hero, fia o caminho da foto da recepção
- `55b3f07` Franqueado hero, adiciona o arquivo da foto
- `4ee70a8` Franqueado, texto legível + linha branca + portfólio sem IA

URL de produção: https://lasercompany-institucional.vercel.app

---

## 1. Header transparente em todas as páginas com hero escuro

**Pedido do cliente:** "do mesmo jeito que o menu está na página início,
deixe em todas as páginas".

Antes: só a home tinha header transparente sobre o hero (caía pra branco
depois do scroll). As outras páginas tinham header sempre branco no topo,
com a foto do hero começando ABAIXO da faixa branca.

Solução: generalizar a detecção. Em `scripts/layout.js`, o `bindHeaderScroll`
agora procura por qualquer hero escuro (`.hero` na home, `.page-hero-photo-bg`
em unidades/procedimentos/vagas, `.franqueado-hero` no franqueado) e adiciona
`page-has-dark-hero` no body. O CSS migrou de `body.page-home` para
`body.page-has-dark-hero` em 13 seletores de overlay + na regra de
`padding-top: 144px` do body.

Páginas afetadas (header overlay): home, unidades, procedimentos, franqueado,
vagas, e momentaneamente o agendamento (até a versão leve sair).

Páginas que mantiveram header branco fixo: contato, blog (heros claros em
creme; transparente ficaria ilegível).

**Bug encontrado e corrigido:** o Chrome resolve URLs dentro de
`var(--product)` em relação ao **arquivo CSS** (não ao documento), então
`url('assets/img/...')` virava `/styles/assets/img/...` e dava 404. Fix:
prefixar `/` no JS pra forçar URL absoluta.

Arquivos: `scripts/layout.js`, `scripts/page-procedimentos.js`,
`styles/layouts.css`.

## 2. Seção "Três frentes" da home com fotos reais

Cliente mandou 3 fotos na pasta `assets/img/3 frentes/`:
- `Estetica a Laser.jpg`
- `Depilação a Laser.jfif`
- `Ultrassom.jfif`

Plugadas nos cards de Estética, Depilação e Ultrassom em
`index.html` (linhas 111/122/133). As fotos antigas (`estetica.jpg`,
`depilacao.jpg`, `ultrassom.jpg`) deixaram de ser usadas pela home.

## 3. Tecnologias, de 5 modalidades para 3 plataformas reais

Cliente avisou: "só achei três máquinas". Realidade da rede: a Vydence Alex
One faz Alexandrite + ND-YAG na mesma plataforma, a Quanta Q Plus cobre
Q-Switched e rejuvenescimento, e o Ultracel Q+ é o ultrassom. Os 5 lasers
listados antes eram tecnologias, não máquinas.

Mudanças:
- `scripts/data.js`: 5 entradas → 3 plataformas reais com nomes corretos
  das máquinas (Vydence Alex One, Quanta Q Plus, Ultracel Q+).
- `procedimentos.html`: título "Os quatro lasers + ultrassom" → "As três
  plataformas premium".
- `styles/pages.css`: novo visual `.tech-card-media--product` pra PNGs
  transparentes das máquinas. Card vinho escuro com brilho dourado radial
  por trás do produto, `background-size: contain`, sombra "chão" sutil
  embaixo. PNGs novos em `assets/img/maquinas/Vydence Alex One.png`,
  `Quanta Q Plus.png`, `Ultracel Q+.png`.

PNGs antigos das máquinas (`alexandrite.jpg`, `erbium.jpg`, etc.) deletados.

## 4. Vagas, hero antes ilegível

Antes: `page-hero-photo-wrap` com foto da equipe em opacity 0.16 + blend
luminosity, sobre fundo creme. Texto vinho sobre creme com a foto sumindo
no meio = "praticamente não dá pra ver nada".

Fix: trocado pra `page-hero-photo-bg` (mesmo padrão de unidades e
procedimentos). Fundo vinho escuro + foto cover + texto creme. Alto
contraste, header automaticamente vira transparente.

## 5. Agendamento, hero refeito 2x

### Tentativa 1 (cinematográfica) — REJEITADA

Cliente havia pedido "uma transição do hero para os três passos bem foda".
Fiz versão pesada:
- Hero em vinho escuro com 3 feixes de laser sweepando, glows nos cantos,
  grid de pontos, 3 pílulas de confiança e 3 cards-preview dos passos.
- Transição SVG cinematográfica de 220px: gradiente vinho → creme, 3 raios
  dourados convergindo do topo do hero até 3 pontos pulsantes que iam
  "acendendo" o stepper.
- Stepper com glow pulsante de 56px em 3 camadas.

Cliente reagiu: "ficou muito escuro muito pesado e essa faixa vermelha eu
odiei". A "faixa vermelha" era a parte vinho do gradiente da transição que,
no preview, virava uma faixa vermelha bem destacada antes de virar creme.

### Tentativa 2 (leve) — APROVADA

Refeito 100% leve:
- Hero volta pro fundo creme `#FAF6EE` padrão. Header volta a ser branco.
- Decoração discreta: 2 arcos dourados translúcidos nos cantos (em vez de
  feixes de laser sweepando).
- Pílulas de confiança brancas com borda dourada sutil e ícones dourados
  (em vez de pílulas vinho escuro com texto creme).
- 3 cards-preview brancos com número dourado e conector horizontal dourado
  com ponto central (em vez de cards vinho escuro com seta vertical).
- Transição SVG cinematográfica + faixa vinho ELIMINADAS. Stepper recebe
  o usuário com gap natural em creme.
- Stepper com glow bem mais discreto: 3px halo + 14px de luz (era 7px +
  56px).

Saldo da segunda tentativa: 91 linhas adicionadas, 269 removidas (CSS pesado
foi embora).

## 6. `.vercelignore` salvou o deploy

Primeira tentativa de `vercel --prod` falhou com erro "Internal S..." da
API. Upload tentou subir 714MB. Causa: working tree acumulou ~536MB de
vídeos/imagens drafts (.mp4, .mov, .jfif) que o cliente colocou em
`assets/img/` mas que ainda não foram wirados em página nenhuma.

Criado `.vercelignore` excluindo:
- Geradores e tools de dev (`_*.cjs`, `_*.js`, `_*.html`, `_*.py`,
  `_*.json`, `generate_*`, `download.js`, `test_*`).
- Relatórios e pastas de referência local (`RELATORIO-CLIENTE.pdf`,
  `Referencias 1/`, `Referência a site Rafael .../`,
  `Roteiro-Site-LaserCo.*`).
- Vídeos drafts na raiz de `assets/img/` (`*.mp4`, `*.mov`).
- Sistema (`.DS_Store`, `Thumbs.db`), editor (`.vscode/`, `.idea/`),
  `node_modules/`, `.claude/`.

Upload caiu pra 178MB, deploy passa em ~24s. Versionei pra não recriar.

## 7. Franqueado hero, foto da recepção

Cliente mandou foto bonita da recepção real (mármore + emblema &CO. na
parede verde com tiras douradas + cadeiras vinho velvet). Salvou em
`Downloads\Franquias-hero.png`.

Copiado pra `assets/img/franqueado-recepcao.png` (2MB). CSS atualizado em
`styles/pages.css`:
- Aponta `url('../assets/img/franqueado-recepcao.png')`.
- Overlay vinho mais suave do lado direito (0.42 → 0.58, era 0.55 → 0.72)
  pra deixar a recepção respirar.
- Mantém mancha vinho densa do lado esquerdo onde fica o título "Invista
  no setor que mais cresce no Brasil" (leitura garantida).
- Ajusta `saturate(1.08) contrast(1.04)` pra realçar o dourado e o verde.

## 8. Franqueado, 3 bugs visuais resolvidos

Cliente apontou 3 problemas em screenshots:

### 8.1 Texto washed out em 4 seções

Sections "Por que investir", "Liderança", "Posicionamento único" e
"Portfólio de serviços" estavam usando só `class="section"` (sem
`.section-light`). Como o body é branco mas o root theme é dark
(`--color-text: #F5F0E6` creme), o título e subtítulo herdavam creme sobre
branco → quase invisível.

Fix: adicionado `.section-light` (variantes `section-light-soft` alternando)
nas 4 seções. Cards internos que precisavam manter visual vinho escuro
(`por-que-card`, `posicionamento-card`) receberam override pra forçar fundo
vinho mesmo dentro de `.section-light` (senão o `--color-bg-elevated`
viraria branco e os cards sumiriam no creme).

### 8.2 Linha branca nos cards "Os números do negócio"

Os 4 cards (Payback, Margem, Royalties, Rentabilidade) têm faixa dourada
no topo e corpo branco embaixo. Entre a faixa e o corpo aparecia uma linha
clara, parecendo um vinco mal acabado.

Causa: o `.numero-card-head::after` adicionava uma sombra escura
(`linear-gradient(180deg, transparent, rgba(0,0,0,0.18))`) nos 6px do
fundo da faixa dourada. O contraste dessa sombra escura com o branco do
body atrás dos cards criava a ilusão de linha. Removido.

### 8.3 Fotos de IA no portfólio

4 cards do portfólio usavam `assets/img/depilacao.jpg`,
`assets/img/proc-full-face.jpg`, `assets/img/estetica.jpg` e
`assets/img/proc-rejuv-facial.jpg` (procedimentos com cara de foto de IA).
Cliente não gostou.

Fix: substituídos por **4 cards temáticos vinho/dourado** sem foto:
- Número grande dourado (01, 02, 03, 04) com gradient
- Tag dourada em pílula (PORTA DE ENTRADA, TICKET ALTO, RECORRÊNCIA,
  VALOR PERCEBIDO)
- Título creme em serif
- Descrição em texto secundário
- Faixa dourada vertical sutil no canto esquerdo do card

Novas classes em `pages.css`: `.portfolio-grid-themed`,
`.portfolio-card-themed`, `.portfolio-card-num`, `.portfolio-card-tag`,
`.portfolio-card-title`, `.portfolio-card-desc`.

Arquivos antigos (`depilacao.jpg`, `proc-full-face.jpg`, etc.) ficaram no
disco porque são usados em outras páginas.

---

## Aprendizados desta sessão

- **Header transparente em todas as páginas com hero escuro** virou regra
  geral via detecção no JS. Detecção: `.hero` | `.page-hero-photo-bg` |
  `.franqueado-hero` → adiciona `page-has-dark-hero` no body.
- **Chrome resolve URLs dentro de CSS custom property em relação ao
  arquivo CSS**, não ao documento. Use URL absoluta com `/` quando setar
  inline.
- **Deploy do Vercel não tem `.vercelignore` por padrão**, então sobe TUDO
  do working tree, mesmo o que não está no git. Em projeto com muitos
  drafts de mídia local, vira gigabytes em poucos dias. `.vercelignore`
  resolve.
- **Imagens anexadas no chat não vão pro disco**: o `Write` tool só grava
  texto. Pra usar foto que o cliente manda em chat, ele precisa salvar
  manualmente no path que o CSS espera.
- **Quando o cliente diz "FODA", testa antes de gastar bateria**: a
  versão cinematográfica do agendamento deu trabalho e foi rejeitada.
  Conservador na próxima — duas variações simples > uma elaborada.
- **`.section-light` é obrigatório em qualquer `<section class="section">`
  que renderiza sobre o body branco**, senão o `--color-text` herdado é
  creme e some.
- **Sombra escura na base de uma faixa colorida + body branco atrás**
  cria ilusão de linha. Evitar `::after` com gradient escuro na base de
  elementos que ficam sobre corpo branco.
