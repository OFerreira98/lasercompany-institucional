# Laser & Co., o que falta pro site ficar 100%

Tudo do documento de considerações já foi aplicado no site. O que falta pra ficar redondo depende de material que só o cliente/marketing tem. Lista abaixo, item por item.

---

## 1. Fotos para o site

A qualidade das fotos que estão hoje não veio boa. Precisamos das versões originais em alta (resolução mínima 2000px no maior lado, JPG ou PNG).

**Hero (carrossel da abertura), 5 fotos:**
- 1 foto da rede/marca em geral (atmosfera, ambiente premium)
- 1 foto de procedimento de **Estética a Laser** (rosto sendo tratado, em alta)
- 1 foto de procedimento de **Depilação a Laser** (área sendo tratada)
- 1 foto de procedimento de **Ultrassom** (equipamento em uso)
- 1 foto de cliente em **avaliação** (consultora atendendo)

**Sobre a Laser & Co, 1 foto:**
- Foto institucional (equipe, unidade ou ambiente da marca) em horizontal

**Procedimentos, 1 foto por procedimento:**
- Hoje temos 6 fotos cobrindo Rejuvenescimento Facial, Axila, Costas, Abdômen, Papada e Full Face
- Faltam **~43 procedimentos sem foto**. Lista completa por categoria está no `data.js`. Idealmente uma foto vertical (3:4) de cada, do procedimento sendo aplicado ou do antes/depois (com autorização)

**Unidades, 1 foto da fachada de cada:**
- **70 unidades** sem foto real hoje. Cliente já confirmou que NÃO podemos usar imagem gerada por IA, tem que ser foto da fachada de verdade. Sem foto, o card mostra o monograma da marca como placeholder

**Antes e depois, 2 fotos por procedimento (antes / depois):**
- Hoje, todos os procedimentos exibem placeholder "Foto em breve". Para cada caso real, **2 fotos com autorização escrita do cliente**

---

## 2. Quiz "Descubra seu Protocolo Ideal"

Está mapeado e o código está pronto pra montar. Precisamos do mapeamento de respostas para protocolos. Sugestão de questionário:

1. Sexo biológico (M / F)
2. Faixa etária (até 25 / 26-35 / 36-45 / 46-55 / 56+)
3. Área de interesse (Face / Corpo / Pelos)
4. Principal queixa (manchas / flacidez / acne / pelos / gordura localizada / outros)
5. Há quanto tempo tem essa queixa
6. Já fez algum tratamento antes? (Sim / Não / Não sei)

**Precisamos:**
- Confirmar essas perguntas ou ajustar
- Mapeamento **pergunta → protocolo recomendado**. Exemplo: mulher, 36-45, face, manchas → Renew Seven 7D + Melasma + PDRN
- 1 a 2 protocolos sugeridos por combinação (tabela ou planilha)
- Texto da oferta do popup de saída (ex: "20% off na 1ª sessão" ou "Avaliação grátis + brinde")

---

## 3. "Saiu na mídia" no rodapé

Hoje está com placeholders genéricos (Exame, PEGN, Estadão, Folha, ABF, Forbes) em formato de logo editorial. Precisamos:

- **Logos reais em PNG transparente** (de 4 a 8 veículos), com no mínimo 200px de altura
- **URLs das matérias** correspondentes em cada veículo (pra cada logo virar clicável)

---

## 4. Bloco "Siga-nos nas redes sociais"

Já implementei uma versão com 6 cards estilo Instagram, cada um clicando direto pro perfil @lasercompanybrasil. As imagens são placeholders. Veja como ficou no site e me diga se agrada.

Se quiser **puxar os posts reais automaticamente do Instagram**, dá pra fazer via Instagram Graph API. É mais complexo, exige:
- Conta business do Instagram
- App registrado na Meta for Developers
- Token de acesso de longa duração
- Backend pra renovar o token

**Decisão:** ficar com os cards estáticos (eu troco os placeholders por screenshots dos seus posts reais quando você enviar), ou ir pro fluxo via API?

---

## 5. Blog (3 posts iniciais)

Os 3 cards do bloco "Conteúdo & Cuidados" estão com **títulos placeholder**:
1. Cuidados pós-laser: o que fazer nos primeiros dias
2. Quantas sessões são necessárias
3. Mitos e verdades sobre depilação a laser

**Precisamos:**
- **Texto completo de cada artigo** (entre 600 e 1200 palavras cada), assinado por uma profissional da rede
- 1 foto extra por artigo (capa, horizontal)
- Confirmação se vamos publicar **3 posts iniciais** ou se a lista cresce

---

## 6. Página individual de cada procedimento

Hoje cada procedimento abre em **modal** na página de Procedimentos. Você pediu **página dedicada** com vídeo, passo a passo "como te ajuda", mais vendidos e formulário contextual.

**Precisamos pra cada procedimento:**
- **Vídeo curto (15 a 60 segundos)** explicando o tratamento (idealmente com uma das profissionais)
- **Passo a passo "como te ajuda"** (3 a 5 etapas, escrito)
- **Lista de "mais vendidos"** relacionados (sugestão: 2 a 3 procedimentos da mesma categoria)
- Texto longo (400 a 800 palavras) com benefícios, indicações, contraindicações

Sem isso, o modal atual continua funcionando como prévia.

---

## 7. Chatbot reformulado

Hoje o chatbot pergunta nome + CEP e indica a unidade mais próxima. Você pediu fluxo novo:

```
Saudação → Área de interesse → Queixa principal → 2 protocolos recomendados → "Quero agendar" ou "Quero saber o preço" → Coleta nome + WhatsApp + e-mail → Transfere pra humano
```

**Precisamos:**
- Confirmar o fluxo acima ou ajustar
- Mapeamento "queixa → 2 protocolos" (mesma lógica do quiz, dá pra reaproveitar)
- Texto de saudação e de transição entre etapas
- Mensagem que dispara após 15 segundos no site (sugestão atual: "Oi! Posso te ajudar a encontrar o tratamento ideal pra você?")

---

## 8. Brandbook tipografia

Aplicamos a paleta da marca em tudo (vinho, dourado, creme). Pra finalizar:

- Versão oficial do **logo em SVG ou PNG transparente** (claro e escuro)
- Manual de tipografia da marca (família principal, pesos permitidos, hierarquia)
- Cores oficiais da identidade (com códigos HEX, RGB e Pantone)

---

## 9. Material adicional opcional

- Endereço, telefone, horário e WhatsApp **atualizados** das 70 unidades (lista atual pode estar defasada)
- Áudio ou vídeo institucional pra usar no rodapé ou em uma seção "Quem somos"
- Fotos das máquinas (5 modelos) em alta, sem fundo, para a seção de Tecnologia

---

## Resumo do que enviar

| Item | Quantidade | Formato |
|---|---|---|
| Fotos hero | 5 | JPG, mín 2000px no maior lado |
| Foto institucional Sobre | 1 | JPG horizontal |
| Fotos de procedimentos | ~43 faltantes | JPG vertical (3:4) |
| Fotos de fachadas | 70 | JPG horizontal |
| Antes e depois | 2 por caso | JPG, com autorização |
| Logos "Saiu na mídia" | 4 a 8 | PNG transparente + URL da matéria |
| Quiz, perguntas e mapeamento | tabela | planilha ou texto |
| Blog, textos | 3 artigos | doc ou texto |
| Vídeos procedimentos | 1 por procedimento | MP4 vertical, até 60s |
| Logo oficial | 1 | SVG ou PNG transparente |
| Cores e tipografia | brandbook | PDF |

Quando esse material entrar, dou continuidade nos blocos pendentes (página individual de procedimento, chatbot novo, quiz funcional, logos reais, fotos reais).
