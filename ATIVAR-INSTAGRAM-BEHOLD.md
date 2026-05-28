# Ativar feed real do Instagram (Behold.so, free)

O bloco "Siga a gente nas redes sociais" da home já está preparado pra puxar
o feed real do Instagram via Behold.so. Falta só plugar o ID do feed.

## Passo a passo (uma vez só, ~5 minutos)

### 1. Pré-requisito no Instagram
A conta `@lasercompanybrasil` precisa estar como **Conta Comercial** ou
**Conta de Criador de Conteúdo** (não Pessoal). Pra verificar/trocar:

- Instagram > Perfil > Menu (☰) > Configurações e privacidade
- Procura por "Tipo de conta e ferramentas"
- Se estiver "Pessoal", muda pra "Comercial" (não custa nada, não muda nada
  visualmente, só libera APIs)

A conta Comercial precisa estar vinculada a uma Página do Facebook.
Se ainda não tem, o próprio Instagram pede pra criar.

### 2. Criar a conta no Behold
- Abre **https://behold.so**
- Botão "Sign up free" (canto superior direito)
- Login com Google ou e-mail

### 3. Conectar o Instagram
- Dentro do painel do Behold, botão "**Create new feed**"
- Escolhe "Instagram Business"
- Vai abrir o login da Meta. Loga com a conta que administra a página
  vinculada ao `@lasercompanybrasil`
- Autoriza as permissões que a Meta pede (são as padrão pra ler o próprio
  feed: posts, mídia, informações públicas)

### 4. Copiar o ID do feed
Depois de conectado, o Behold mostra uma tela com um snippet de código.
Algo assim:

```html
<div data-behold-id="kRz12AbCdEf3GhIjKlMn"></div>
<script async src="https://w.behold.so/widget.js" type="module"></script>
```

O que importa é só o **ID**, o trecho `kRz12AbCdEf3GhIjKlMn` (vai ser
diferente no seu caso).

### 5. Plugar no site
Abre `index.html` e procura por:

```html
<div data-behold-id="PASTE_BEHOLD_ID_AQUI" id="behold-feed" hidden></div>
```

Troca `PASTE_BEHOLD_ID_AQUI` pelo ID real. Pronto. Salva, commita, push,
e em 1-2 min o feed real aparece em produção.

## O que vai acontecer no site

- O bloco placeholder com as 6 imagens AI **desaparece** automaticamente
- No lugar entra o widget do Behold puxando direto do Instagram
- Atualiza sozinho sempre que a conta postar algo novo (sem precisar
  mexer no site nunca mais)
- No rodapé do bloco aparece um "Powered by Behold" pequeno (marca d'água
  do plano free)

## Personalização do widget (opcional)

Dentro do painel do Behold dá pra escolher:
- Quantos posts mostrar (6 é o ideal pra ficar consistente com o resto)
- Layout (Grid, Masonry, Carousel)
- Mostrar/esconder curtidas, comentários, captions
- Cores dos botões
- Border radius dos posts

Recomendado pra Laser & Co: **Grid 3 colunas × 2 linhas, sem caption,
com hover mostrando curtidas/comentários, border radius 6px**.

## Tirar a marca d'água depois

Se quiser tirar o "Powered by Behold", o plano "Lite" do Behold custa
**US$ 9/mês** (~R$ 50). Ou migrar pro Instagram Graph API oficial,
gratuito mas precisa renovar token a cada 60 dias (mais código pra manter).
