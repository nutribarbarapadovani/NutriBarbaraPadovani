# Crescer — CRM para Nutrição Pediátrica

Protótipo funcional de CRM para gestão de pacientes, acompanhamento de longo prazo (1 a 2 anos), relacionamento, produtividade e experiência da família na jornada da criança — do primeiro contato até a alta.

![status](https://img.shields.io/badge/status-prot%C3%B3tipo%20funcional-7FAE86)
![stack](https://img.shields.io/badge/stack-React-16332E)

---

## Visão geral

O sistema funciona como um painel único de gestão clínica e relacionamento, cobrindo:

- **Painel** — métricas em tempo real (pacientes ativos, em pausa, concluídos, follow-ups pendentes, receita prevista/recebida/pendente, aniversariantes, pacientes sem contato) e gráficos de evolução de pacientes e receita mensal
- **Pacientes** — cadastro completo (criança, responsáveis, contato, dados médicos), timeline de eventos, evolução clínica (peso, altura, IMC com gráfico) e dados do acompanhamento contratado
- **Agenda** — consultas e retornos organizados por data
- **Follow-up** — quadro Kanban (A fazer → Hoje → Em andamento → Aguardando família → Concluído) com prioridade visual
- **Financeiro** — receita prevista, recebida e pendente por paciente, forma de pagamento e parcelamento

Busca global por nome, diagnóstico, responsável, telefone ou tag em qualquer tela.

Layout responsivo: menu lateral vira gaveta com botão hamburger, tabelas viram cartões empilhados e o cadastro/detalhe do paciente ocupam a tela cheia em telas de celular (abaixo de 860px).

## Stack

- React (componente único, hooks: `useState`, `useEffect`, `useMemo`)
- [Recharts](https://recharts.org/) — gráficos de evolução e receita
- [Lucide React](https://lucide.dev/) — ícones
- Fontes: Fraunces (display) + Inter (texto) + IBM Plex Mono (dados)

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
   npm install recharts lucide-react
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
