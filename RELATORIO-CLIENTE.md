# Laser & Co., relatório do que está pronto

Resumo do que já foi construído, da lógica por trás de cada parte e do que ainda falta para o site virar oficial.

**Site no ar (pré, produção temporária):** https://lasercompany-institucional.vercel.app
**Painel:** https://lasercompany-institucional.vercel.app/painel.html

Hoje o site está publicado em um endereço temporário (Vercel). O próximo passo é apontar o domínio oficial **lasercompany.com.br** para essa publicação, sem precisar reconstruir nada.

---

## A ideia central

O site não é só vitrine, é uma máquina de captar lead qualificado para a rede inteira.

Cada página tem uma função clara dentro do funil:

1. **Atrai** (Home, Procedimentos, Unidades, Vagas, Seja um Franqueado).
2. **Engaja** (popup de promoção, chatbot, WhatsApp flutuante).
3. **Converte** (Agendamento e formulários, que jogam o lead direto no painel da unidade certa).

Todo formulário do site, popup, agendamento, contato, vagas, franquia e chatbot, alimenta o mesmo painel. A franqueada recebe e o franqueador enxerga o todo.

---

## Páginas e o que cada uma faz

**Home.** Vitrine da marca, prova social, atalhos para Agendamento e para "Seja um franqueado".

**Procedimentos.** Catálogo completo em cards. Ao clicar em um procedimento, abre o detalhe em janela com bloco de antes/depois no topo, descrição, prova social e linha de tecnologia (4 lasers + ultrassom). Os cards têm filtro por frente (Estética, Depilação, Ultrassom).

**Unidades.** As 70 unidades cadastradas em **mapa real** (não é imagem estática), com busca por **CEP** que encontra a unidade mais próxima. Filtros por estado e cidade. Cada card traz endereço, telefone e WhatsApp da unidade.

**Agendamento.** Funil em **3 passos**:
1. Escolha do procedimento de interesse.
2. Escolha da unidade.
3. Dados do cliente (nome, telefone, e-mail).

A tela final entrega resultado: "Enviamos sua solicitação para a unidade X" + botão grande que abre direto o WhatsApp da unidade para confirmar. O lead, no mesmo segundo, já cai no painel.

**Vagas.** Página de recrutamento com hero da recepção (foto enviada pela rede).

**Seja um franqueado.** Página comercial dedicada. Conta a história do Rafael (fundador), mostra os números do negócio, perfil do investidor ideal, a faixa de Liderança (Franchising Factory, +150 marcas) e o formulário de captação. Esta página também tem botão dourado em destaque no topo, em todas as outras páginas, para o investidor sempre achar.

**Contato.** Dados oficiais, formulário e canais.

---

## As "regras" que rodam em background

**Popup de promoção (brinde de boas-vindas).** Aparece 6 segundos após a entrada do visitante, ou na hora em que ele tenta sair (exit intent). **Enquanto o visitante não preencher, o popup volta a cada 7 segundos** e reabre em toda nova visita (modo "promoção relâmpago, não dá pra perder"). **Assim que preenche, o popup pára** e só pode reaparecer 2 horas depois. É insistente de propósito, para forçar o primeiro contato.

**Chatbot.** Não é um chat livre, é uma **triagem guiada** com 4 etapas:
1. Cumprimenta e pede o nome.
2. Pede o CEP.
3. Mostra a unidade mais próxima do CEP + dois caminhos: "Falar com a unidade no WhatsApp" ou "Tirar uma dúvida".
4. Banco de perguntas frequentes (preço, sessões, dor, gestante, etc.), e em qualquer ponto oferece o WhatsApp da unidade como saída.

Ou seja: o bot existe para **transformar dúvida em lead**, não para responder por horas.

**WhatsApp flutuante.** Botão sempre visível em todas as páginas, conectado ao SAC central.

**Captura unificada de leads.** Popup, agendamento, formulário de vagas, formulário de contato, formulário de franquia e chatbot: todos batem na mesma "porta" que envia para o painel. Centralizado, sem unidade ficar perdida.

**Cores e tema.** O site tem o tema padrão (vinho/dourado) e uma **Versão Clara** (creme quente), além de acentos sazonais opcionais (Natal, Carnaval, etc.). O franqueador troca isso pelo painel, sem ninguém mexer no código.

---

## Painéis (prontos em modo demonstração)

Foram criados **dois painéis**, com login próprio.

- **Franqueador:** enxerga a rede inteira.
- **Franqueado:** enxerga só a própria unidade.

**Acesso:** https://lasercompany-institucional.vercel.app/painel.html
*(Já existe também um link discreto "Acesso Franqueados" no rodapé do site, para entrar direto.)*

O menu lateral de cada painel tem:

- **Visão Geral:** indicadores do mês (leads + variação %, leads "ao vivo" no dia, agendamentos, taxa de conversão, unidades ativas), gráfico de leads por dia, donuts por tipo e origem, ranking de procedimentos e de unidades, e atividade recente.
- **Leads:** lista filtrável (todos, popup, agendamento, recrutamento), status (novo, em contato, agendado, convertido, perdido), detalhe, anotações e exportação CSV.
- **Unidades:** ranking, distribuição por estado, cadastro das 70.
- **Tráfego:** tempo real, origem das visitas, páginas mais acessadas, dispositivos.
- **Demográfico:** faixa etária e gênero.
- **Promoções:** ativas, cadastro e desempenho.
- **Recrutamento:** vagas e candidatos.
- **Configurações:** usuários (convidar, dar/tirar permissão) e Minha conta (foto, telefone, cargo).
- **Aparência:** o franqueador troca o tema do site (padrão, claro, sazonais) sem mexer em código.

Hoje os painéis estão **funcionando com cerca de 900 leads simulados em 30 dias**, projetando o volume de uma rede que faz por volta de 60 mil visitas/mês. Serve para o cliente já navegar, ver todos os gráficos e telas como vão funcionar no dia a dia real.

**Logins de teste:**
- Franqueador: `franqueador@laserco.com.br`
- Franqueada Vila Mariana: `vmariana@laserco.com.br`
- Franqueada Ipanema: `ipanema@laserco.com.br`
- Senha (todos): `laser2026`

---

## O que ainda falta

1. **Apontar o domínio oficial.** Hoje o site está no endereço temporário da Vercel. Falta apontar a `lasercompany.com.br` para esse mesmo deploy.
2. **Subir as últimas alterações.** As mudanças mais recentes (cores ajustadas, página do franqueado enriquecida, ajustes do painel, link de Acesso Franqueados no rodapé) já estão prontas e sobem assim que aprovamos.
3. **Ligar o banco de dados real.** O painel hoje roda em modo demonstração. Falta criar o banco (passo técnico curto, já está tudo preparado para receber), definir as senhas reais dos franqueados e a chave de segurança. A partir daí o painel passa a salvar e ler dados de verdade.
4. **Integração final do painel.** Criar, editar e deletar que efetivamente persistem (leads, promoções, vagas) e o mapa geográfico real das visitas. Essa etapa é a fase do desenvolvedor do sistema unificado.
5. **Fotos reais das fachadas das 70 unidades.** Por orientação do próprio cliente, fachada **nunca** entra com imagem gerada por IA, é foto verdadeira ou placeholder do monograma da marca. A rede precisa enviar.
6. **Fotos reais de antes e depois.** Mesma regra: só foto verdadeira com autorização. Sem foto, o card mostra "Foto em breve".
7. **Imagens dos cards de procedimento.** Cerca de 43 procedimentos ainda aparecem com o placeholder da marca. Duas opções:
   - **Reaproveitar do site atual.** É possível, mas as imagens do site existente costumam ser pequenas e pesadas para web (não retina, mal recortadas). Vale tentar caso a caso, mas o resultado provavelmente fica abaixo do padrão visual do site novo.
   - **Gerar por IA no mesmo padrão** das outras imagens já em uso (as 5 das máquinas, por exemplo, são geradas por IA e ficaram bem). É o caminho recomendado.

   A decisão é do cliente. Aguardamos liberação.

---

## Status final

- **Site público:** no ar (em endereço temporário), pronto para receber o domínio oficial.
- **Painéis:** prontos em modo demonstração, esperando só a ligação do banco real para operar.
- **Captura de leads:** ativa em todos os formulários do site, indo direto para os painéis.
- **Estrutura:** preparada para receber os ajustes pedidos no último relatório do cliente.
