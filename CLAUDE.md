# Laser & Co. — Site Institucional (memória do projeto)

Site institucional estático (HTML/CSS/JS, sem framework de build) da **Laser & Company Brasil**,
rede de franquias de estética a laser. Hospedado no GitHub e publicado na Vercel.

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
4. **Cards de unidade e de procedimento NÃO usam imagens falsas/aleatórias.** Enquanto não
   houver foto real, usar os placeholders com gradiente da marca (hash do id).
5. **Página Vagas: NÃO mexer na estrutura** (o cliente ama a página). Só foi adicionada uma
   foto de fundo no hero que se auto-remove se o arquivo não existir.
6. **Comunicação concisa** com o cliente — resumir o resultado, sem texto longo.
7. Não gero imagens fotorrealistas com IA. Quando faltar foto, criar slot + placeholder +
   apontar a necessidade ao cliente.

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

## Pendente: fotos do cliente

O cliente vai enviar as fotos. Quando chegarem:
- **Máquinas** → `assets/img/maquinas/` (`alexandrite.jpg`, `nd-yag.jpg`, `erbium.jpg`,
  `q-switched.jpg`, `ultracel.jpg`) + adicionar `img:` em cada item de `lasers` no `data.js`.
- **Antes/depois** → `assets/img/antes-depois/` (`<id>-antes.jpg`/`<id>-depois.jpg`) +
  campos `antes:`/`depois:` no procedimento.
- **Fachadas** → `assets/img/unidades/` (nome = id da unidade) + campo `foto:` na unidade.
- **Equipe/recepção** → `assets/img/equipe/recepcao.jpg` (já referenciado pelo hero de Vagas).

---

## Aprendizados técnicos

- Edit `replace_all` de " — " → ", " removia o espaço final (virava ","). Usar PowerShell .NET
  regex com UTF-8 sem BOM para substituições em massa de texto acentuado.
- Deploy de produção: rodar `vercel --prod` SEM `--yes`.
- Placeholders de imagem com fallback gracioso: `<img onerror="this.remove()">` e
  `background-image` condicional a partir de campos do `data.js`.
