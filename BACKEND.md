# Backend + Painéis (Etapas 2 e 3)

Este documento explica o que foi construído, **como testar agora** e **o que falta**
você fazer (banco, senhas, deploy). Escrito para ser seguido sem conhecimento técnico
profundo.

---

## O que foi construído

1. **Painel do Franqueador** (`painel-franqueador.html`) — vê os leads de TODAS as unidades,
   com filtro por unidade, tipo, status e data, KPIs da rede e exportação CSV.
2. **Painel do Franqueado** (`painel-franqueado.html`) — vê SÓ os leads da própria unidade.
   Pipeline de status (quente / morno / frio / contatado / convertido / perdido) e botão de
   WhatsApp para falar com o cliente na hora.
3. **Tela de login** (`painel.html`) — entrada única; manda cada um para o painel certo.
4. **API** (pasta `api/`) — recebe os leads do site e serve os painéis:
   - `POST /api/leads` (público) — o site grava cada lead aqui.
   - `GET /api/leads` (logado) — lista os leads (filtra por unidade conforme o perfil).
   - `PATCH /api/leads/:id` (logado) — muda status/anotações de um lead.
   - `POST /api/auth/login`, `GET /api/auth/me` — autenticação.
   - `GET /api/stats` — métricas agregadas.
5. **Integração com o site**: TODO formulário (popup do brinde, agendamento, vagas, contato,
   franquia, chatbot) já manda o lead para o backend automaticamente, sem mudar as páginas.

---

## Como testar AGORA (modo demonstração)

Funciona mesmo SEM banco. Abra o site publicado e vá em **`/painel.html`**
(ex.: `https://lasercompany-institucional.vercel.app/painel`).

**Logins de teste** (já aparecem na tela, é só clicar para preencher):

| Perfil | E-mail | Senha |
|---|---|---|
| Franqueador (vê tudo) | `franqueador@laserco.com.br` | `laser2026` |
| Franqueado, Vila Mariana | `vmariana@laserco.com.br` | `laser2026` |
| Franqueado, Ipanema | `ipanema@laserco.com.br` | `laser2026` |

No modo demo o painel mostra **leads de exemplo + os leads capturados naquele navegador**.
Aparece um aviso amarelo "Modo demonstração" no topo. É esperado: vira dados reais quando
o banco for ligado (próxima seção).

---

## O que falta você fazer para ir ao ar de verdade

### 1) Criar o banco de produção (uma vez, ~5 min)
1. No painel da Vercel do projeto, aba **Storage** → **Marketplace** → criar um **Postgres**
   (recomendo **Neon**, tem plano gratuito).
2. Conecte ao projeto. Isso cria a variável de ambiente da conexão. **Garanta que ela se
   chame `DATABASE_URL`** (se vier com outro nome, crie uma env `DATABASE_URL` com o mesmo valor).
3. Crie a tabela. No console SQL do banco, rode:
   ```sql
   CREATE TABLE IF NOT EXISTS leads (
     id text PRIMARY KEY,
     data jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   );
   ```
4. Instale o driver do Postgres no projeto (uma vez):
   ```
   npm i pg
   ```
   (Isso cria um `package.json`. Faça commit dele.)

Pronto. Como existe `DATABASE_URL`, o backend passa a gravar/ler no Postgres
automaticamente. **Você não precisa mudar nenhum código** — o ponto de troca já está
pronto em `api/_lib/store.js`.

### 2) Definir as senhas e usuários reais
Hoje os usuários são de teste e ficam em `api/_lib/auth.js` (lista `USERS`), com a senha
`laser2026`. Para produção:
- Gere o hash de cada senha nova rodando no terminal, dentro da pasta do projeto:
  ```
  node -e "console.log(require('./api/_lib/auth').gerarHash('SUA_SENHA_AQUI'))"
  ```
- Substitua o `senhaHash` de cada usuário em `api/_lib/auth.js` e cadastre um franqueado por
  unidade (campo `unidadeId` = id da unidade no `scripts/data.js`).
- Atualize também a lista `DEMO_USERS` em `scripts/api-client.js` **ou** remova o bloco
  "Acessos de teste" do `painel.html` e o fallback demo (quando o banco estiver no ar, o
  login real já funciona pela API).
- **Importante:** defina uma variável de ambiente `AUTH_SECRET` na Vercel com um texto longo
  e aleatório (isso protege os tokens de login).

### 3) Deploy
- Como o repositório está ligado à Vercel, **basta dar `git push`** que ele publica.
- Ou rode `vercel --prod` (sem `--yes`).

---

## Onde está o "ponto de troca" do banco

Tudo passa por **`api/_lib/store.js`**. Lá dentro:
- Sem `DATABASE_URL` → modo memória/demo.
- Com `DATABASE_URL` → Postgres.
Para trocar de banco no futuro (ex.: outro provedor), basta escrever outro adaptador nesse
único arquivo. O resto da aplicação não muda.

---

## Limitações conhecidas (para o refino quando você voltar)

- **Modo demo não persiste de verdade** entre dispositivos/instâncias (é só para teste).
  Tudo isso resolve sozinho ao ligar o banco.
- **Upload de currículo (vagas):** hoje guardamos só o NOME do arquivo. Subir o arquivo em si
  exige um armazenamento (ex.: Vercel Blob) — fica para o refino.
- **Gestão de conteúdo** (editar unidades/procedimentos/promoções pelo painel) ainda não
  existe; os painéis hoje focam em LEADS. Pode ser uma próxima etapa.
- **Segurança:** a autenticação atual é simples (suficiente para começar). Antes de uso
  intenso, vale endurecer (limite de tentativas, troca de senha, etc.).
