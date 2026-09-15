# Bárbara Sales — CRM de Nutrição Materno-Infantil

Protótipo funcional de CRM para gestão de pacientes, acompanhamento de longo prazo (1 a 2 anos), relacionamento, produtividade e experiência da família na jornada da criança — do primeiro contato até a alta.

![status](https://img.shields.io/badge/status-prot%C3%B3tipo%20funcional-918567)
![stack](https://img.shields.io/badge/stack-React-867A6E)

Feito para **Bárbara Sales** (CRN 7168), nutricionista materno-infantil — [@nutri.maternoinf](https://instagram.com/nutri.maternoinf).

---

## Identidade visual

- **Cores**: `#918567` (khaki), `#867A6E` (marrom ink), `#AFA998` (sage neutro), `#A99790` (rosa antigo), `#F6F0E7` (fundo creme)
- **Tipografia**: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (títulos) + [Lato](https://fonts.google.com/specimen/Lato) (texto e dados)

---

## Visão geral

O sistema funciona como um painel único de gestão clínica e relacionamento, cobrindo:

- **Painel** — métricas em tempo real (pacientes ativos, em pausa, concluídos, follow-ups pendentes, receita prevista/recebida/pendente, aniversariantes, pacientes sem contato) e gráficos de evolução de pacientes e receita mensal
- **Pacientes** — cadastro rápido (só o nome é obrigatório, campos avançados ficam colapsados), máscara automática de telefone/WhatsApp, timeline de eventos, aba "Consultas" com o checklist de etapas do acompanhamento (o que foi feito e o que falta) e evolução de peso/altura, e dados do acompanhamento contratado. Botão de ação rápida "Registrar consulta hoje" direto na lista, sem precisar abrir o cadastro completo

### Tipos de acompanhamento

O CRM já vem com os 3 programas reais da Bárbara, cada um com suas etapas, faixa etária e duração mínima (todo acompanhamento tem prazo mínimo de 1 mês):

1. **Introdução Alimentar** (a partir de 6 meses, 6 meses de duração) — consulta preparatória → consulta prática de introdução → consulta de 9 meses → consulta de 1 ano (recusa alimentar)
2. **Seletividade Alimentar** (1 a 3 anos, 4 meses, encontros mensais) — avaliação e plano de ação → acompanhamento do plano → 2 atividades práticas de aproximação alimentar
3. **Trilhar** (4 a 10 anos, duração variável conforme os hábitos, encontros quinzenais) — avaliação inicial (fechamento) → encontros presenciais (atividade prática) e online (acompanhamento) alternados

Todos incluem conversa com a nutricionista pelo WhatsApp durante o acompanhamento. O tipo pode ser escolhido/alterado a qualquer momento na aba "Acompanhamento" do paciente, e o prazo final é recalculado automaticamente.
- **Agenda** — agendamentos reais: criar, editar, marcar como realizado e excluir consultas/retornos, com data, hora e tipo
- **Follow-up** — quadro Kanban (A fazer → Hoje → Em andamento → Aguardando família → Concluído) com prioridade visual
- **Financeiro** — registro de pagamentos por paciente (parcela do plano ou cobrança avulsa), histórico de pagamentos recentes, cálculo automático de recebido/pendente

Dentro do cadastro do paciente, um painel de **ações rápidas** permite registrar consulta, adicionar medição (peso/altura) e registrar pagamento sem navegar entre telas.

Busca global por nome, diagnóstico, responsável, telefone ou tag em qualquer tela.

Layout responsivo: menu lateral vira gaveta com botão hamburger, tabelas viram cartões empilhados e o cadastro/detalhe do paciente ocupam a tela cheia em telas de celular (abaixo de 860px).

## Stack

- React (componente único, hooks: `useState`, `useEffect`, `useMemo`)
- [Recharts](https://recharts.org/) — gráficos de evolução e receita
- [Lucide React](https://lucide.dev/) — ícones
- Fontes: Playfair Display (títulos) + Lato (texto e dados)

Sem dependência de backend para rodar — os dados ficam em memória/armazenamento local do ambiente onde for executado.

## Estrutura

```
/
├── crm-nutricionista-pediatrica.jsx   # componente principal (App)
└── README.md
```

## Como rodar localmente

1. Crie um projeto React (Vite é o mais rápido):
   ```bash
   npm create vite@latest crescer-crm -- --template react
   cd crescer-crm
   npm install
   npm install recharts lucide-react @supabase/supabase-js
   ```
2. Substitua o conteúdo de `src/App.jsx` pelo arquivo `crm-nutricionista-pediatrica.jsx` deste repositório.
3. Rode:
   ```bash
   npm run dev
   ```

## Limitações conhecidas (protótipo)

Este é um protótipo de **frontend**. Para virar produto em produção, falta implementar:

- [ ] Backend real (Supabase, Firebase ou similar) para persistência multiusuário
- [ ] Autenticação e permissões (nutricionista / secretária / administrador)
- [ ] Backup automático e histórico de auditoria
- [ ] Criptografia de dados sensíveis e conformidade com a LGPD
- [ ] Automações reais (regras de follow-up disparadas por eventos)
- [ ] Envio de mensagens (WhatsApp/e-mail) integrado

## Roadmap sugerido

1. Modelar o banco de dados (pacientes, acompanhamentos, follow-ups, financeiro) no Supabase
2. Trocar o armazenamento local por chamadas à API/Server Actions
3. Adicionar login e controle de permissões por perfil
4. Implementar motor de automações (ex.: paciente 60 dias sem consulta → cria tarefa)

---

Feito para acompanhar a criança e a família com visão de 360°, sem perder relacionamento em planilha.

### Integração com Google Agenda

Na tela **Integrações**, é possível conectar o CRM à conta Google da Bárbara. Depois de conectado, toda vez que um evento é criado/editado/excluído na Agenda, ou um follow-up é criado/concluído, o Google Agenda é atualizado automaticamente — com lembretes (1h antes e 1 dia antes para consultas; 1h antes para follow-ups).

**Configuração inicial (feita uma única vez, direto na tela Integrações do CRM):**
1. Criar um projeto gratuito no [Google Cloud Console](https://console.cloud.google.com)
2. Ativar a "Google Calendar API"
3. Configurar a tela de consentimento OAuth (Externo, com o e-mail da Bárbara como usuário de teste)
4. Criar uma credencial "ID do cliente OAuth" (tipo Aplicativo da Web), com a URL do CRM em "Origens JavaScript autorizadas"
5. Colar o Client ID gerado na tela Integrações e clicar em "Conectar com Google Agenda"

**Limitação técnica importante:** como este é um app 100% client-side (sem servidor próprio), a conexão usa o fluxo de autorização por token do Google (Google Identity Services) — o acesso dura algumas horas por sessão de navegador. Se a sincronização parar, um clique em "Conectar com Google Agenda" na tela Integrações restabelece o acesso (geralmente sem precisar autorizar de novo, se a Bárbara continuar logada na conta Google naquele navegador).

### Segurança, backup e produtividade (atualização mais recente)

- **Backup completo (.json)**: em Integrações, dá pra baixar um arquivo com todos os pacientes, agenda e follow-ups, e restaurar depois (útil se o navegador for limpo ou o aparelho trocar).
- **Filtros e paginação em Pacientes**: abas por status (Ativos/Em pausa/Concluídos/Prospecção) com contador, e "Carregar mais" em vez de listar tudo de uma vez — importante agora que a base passou de 150 pacientes.
- **Confirmação prévia** antes de criar follow-ups em massa para prospecções, mostrando quantos serão criados.
- **Mensagens de erro mais claras** quando a conexão com o Google Agenda expira, indicando exatamente o que fazer.
- **Classificação em massa por idade**: em Integrações, um botão sugere automaticamente o tipo de acompanhamento (Introdução Alimentar/Seletividade/Trilhar) para pacientes que já têm data de nascimento cadastrada e ainda não têm um tipo definido.

**Nota sobre acesso**: o CRM não tem senha de login — o link fica aberto para quem o acessar. Se no futuro isso precisar mudar (por exemplo, por exigência de proteção de dados de saúde), o caminho recomendado é migrar para um backend com autenticação de verdade (ex: Supabase), já que qualquer proteção puramente no navegador (sem servidor) pode ser contornada por alguém com conhecimento técnico.

### Melhorias clínicas e comerciais (atualização mais recente)

- **Curva de crescimento (referência OMS, aproximada)** — na aba "Consultas" do paciente, gráfico com P3/P50/P97 de peso-por-idade e altura-por-idade, por sexo, sobrepondo as medições reais do paciente. **Atenção**: os valores de referência usados são uma aproximação clinicamente razoável, não a tabela oficial completa da OMS (LMS) — a tela deixa isso explícito e recomenda conferir a curva oficial da OMS/Caderneta da Criança para decisões clínicas.
- **Origem do paciente** — campo (Instagram/Indicação/Grupo VIP/Google/WhatsApp/Outro) no cadastro e na ficha, para entender de onde vêm as prospecções.
- **Taxa de conversão (geral)** — novo card no Painel: % de todas as prospecções que já viraram pacientes.
- **Alerta visual de alergia** — banner vermelho destacado na ficha do paciente quando há alergia registrada.
- **Registro alimentar / recordatório** — nova aba "Alimentação" na ficha do paciente, com histórico de registros do que a criança comeu num dia típico.
- **Plano alimentar vigente** — campo de texto/link (ex: Google Drive) anexado à aba "Acompanhamento", para não precisar procurar o plano em outro lugar.

### Auditoria de usabilidade (todos os acessos funcionais)

- Botões de contato direto na ficha do paciente: Ligar, WhatsApp, E-mail, Ver no mapa.
- WhatsApp direto na lista de pacientes (ícone por linha).
- Cards do Painel agora navegam para a lista filtrada ou para o Financeiro.
- "Aniversariantes da semana" virou uma lista com botão "Parabenizar" (abre WhatsApp com mensagem pronta).
- Busca do cabeçalho navega automaticamente para Pacientes quando usada em outra tela.
- "Status da negociação" das prospecções agora é um campo editável (com sugestões automáticas), não só uma tag importada.

### Reformulação para Prontuário + Administração (atualização mais recente)

- **"Pacientes" renomeado para "Prontuário"** em todo o site, com status reorganizados em **Ativos / Inativos / Receberam alta / Prospecção**.
- **Novos campos no prontuário**: dificuldade alimentar, cor favorita, personagens favoritos — além dos já existentes (peso, altura, aniversário, tipo de acompanhamento, frequência), todos individuais por criança. Idade, peso e altura atuais agora aparecem automaticamente calculados na ficha.
- **Nova aba "Plano de Ação"** na ficha do paciente: texto do plano atual + 3 gráficos/evoluções — peso (reaproveitando a curva já existente), exames (com categorias Normal/Atenção/Alterado) e evolução alimentar (linha do tempo narrativa, ex: "passou a comer 5 legumes", "reduziu doces").
- **Nova aba "Administração"** no menu principal: modelos de contrato editáveis para cada um dos 4 tipos de acompanhamento (com campos que preenchem automaticamente ao gerar o contrato de um paciente específico) e uma lista de comprovantes (pagamentos registrados). **Atenção**: os contratos são um modelo de ponto de partida, não documento jurídico validado — recomendamos revisão por advogado antes do uso real.
- **Agenda sincronizada automaticamente**: ao registrar uma consulta na aba "Consultas", o CRM agenda sozinho a próxima etapa do plano de acompanhamento (se ainda não houver um agendamento futuro para aquele paciente).

**Pendente para uma próxima etapa** (depende do bot do WhatsApp estar confirmado funcionando): mensagem automática no dia da próxima consulta, e sequência de follow-up automático em 24h/2 dias/15 dias/30 dias com inativação automática de quem não responde.

### Ficha do paciente consolidada em uma única tela (atualização mais recente)

Depois de feedback direto sobre o fluxo real de trabalho, a ficha do paciente deixou de ter abas
(Dados / Timeline / Consultas / Alimentação / Plano de Ação / Acompanhamento) e virou **uma única
tela contínua**, sequencial, sem precisar clicar pra trocar de seção:

- **Removida a Timeline** (log de atividades) — não fazia parte do fluxo dela.
- **Removido "Registro alimentar" (recordatório)** e **"Plano alimentar" (link de documento)** — não é
  algo que ela usa; foram premissas erradas da minha parte.
- **Mantido apenas o que foi pedido de verdade**: dados básicos + contato → consultas e curva de
  crescimento → plano de ação (texto + evolução de exames + evolução alimentar) → acompanhamento e
  pagamentos, tudo em sequência numa rolagem só.

### Migração para banco de dados compartilhado — Supabase (atualização mais recente)

O CRM deixou de guardar dados só no navegador (localStorage) e passou a usar o **Supabase** como
fonte de dados real, compartilhada com o bot do WhatsApp. Na prática:

- Pacientes, agenda, follow-ups e configurações agora vivem no banco de dados do Supabase
  (projeto `vfclzwrmfzogdpeclxrx`), não mais isolados no navegador de cada aparelho.
- Toda ação no CRM (cadastrar paciente, registrar consulta, criar follow-up, etc.) grava direto
  no banco — o que ela faz no site aparece pro bot, e o que o bot faz (uma vez que os comandos
  automáticos estiverem prontos) aparece no site.
- **Antes de usar**, rode o script `supabase_migracao_colunas.sql` no SQL Editor do Supabase —
  ele adiciona colunas que foram criadas depois do banco original (dificuldade alimentar, cor
  favorita, personagens favoritos, plano de ação, exames, evolução alimentar).
- A chave usada no site é a chave pública ("anon"), protegida por políticas de acesso (RLS) —
  é segura de expor no código do site, ao contrário da chave "service_role".

**O que ainda falta** (próxima etapa): as mensagens automáticas do WhatsApp (lembrete de consulta
e sequência de follow-up 24h/2d/15d/30d) — essas dependem de uma tarefa agendada rodando no
Supabase, que ainda será construída.
