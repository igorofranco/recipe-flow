<!--
PLANO.md — plano de construção e progresso do recipe-flow.
Este arquivo é o mapa do que falta para o demo ficar pronto para a entrevista técnica.
Contexto, domínio e regras de trabalho: AGENTS.md.
Marque os itens com [x] ao concluir. Texto em pt-BR.
-->

# Plano e progresso — recipe-flow

> Demo de "fluxo de execução de receita" para a entrevista técnica de React Sênior.
> Objetivo: provar React + TypeScript + Material UI + React Flow, com domínio MES/EBR, testes,
> CI/CD e deploy. Toda decisão deve ser explicável em voz alta.

Atualizado em 2026-09-14.

## Visão do que o demo precisa ser

Um operador abre o lote, percorre as etapas de produção de uma receita em um grafo React Flow e
avança etapa a etapa. O avanço só acontece com o registro obrigatório preenchido. Cada etapa tem
estado visível (pendente, ativa, concluída, erro) e todo evento entra numa trilha de auditoria
(quem fez o quê e quando), como um EBR exige.

## Fase 0 — Fundação (concluída)

- [x] Repositório Git iniciado
- [x] Vite + React 19 + TypeScript em modo strict
- [x] Material UI (`@mui/material` + Emotion) instalado
- [x] React Flow (`@xyflow/react`) instalado
- [x] Tema MUI com tokens claro/escuro (`src/theme/`)
- [x] Layout do lote com AppBar, status, ações e Stepper (`src/layouts/BatchExecutionLayout.tsx`)
- [x] Canvas React Flow estilizado pelo tema (`src/flow/flowStyles.ts`)
- [x] Vitest + Testing Library + MSW configurados (`src/test/`)
- [x] ESLint (flat) + Prettier configurados
- [x] Primeiros testes (App, layout, tema, exemplo MSW)

## Fase 1 — Modelo de domínio do fluxo (concluída)

- [x] Tipos do domínio: receita, etapa, lote, estado de etapa e evento de auditoria
      (`src/domain/types.ts`)
- [x] Dados de exemplo de uma receita com etapas reais (ordem e parâmetros)
      (`src/domain/recipe.ts`)
- [x] Campos obrigatórios por etapa (o que o operador precisa registrar)
      (`RecordField` em `src/domain/types.ts`)
- [x] Definir onde vive o estado do lote (hook/store no App, fora dos nós do grafo)
      (`useReducer` + Context em `src/state/`)
- [x] Documentar em voz alta por que o estado vive ali e não no custom node
      (nó é projeção; estado único garante validação e auditoria, e sobrevive a re-layout)

## Fase 2 — Grafo no React Flow (concluída)

- [x] Gerar nós a partir das etapas da receita (sem nó fixo no `App.tsx`)
- [x] Conectar etapas com arestas na ordem da receita
- [x] Custom node com Material UI (Card/Chip) e handles
- [x] Aplicar o estilo de cada nó conforme o estado da etapa
- [x] Painel lateral com os detalhes e o registro da etapa selecionada
- [x] Ações de zoom, controles e minimap funcionando com o tema

## Fase 3 — Estados por etapa (concluída)

- [x] Estado pendente
- [x] Estado ativa (etapa atual do lote)
- [x] Estado concluída
- [x] Estado erro (registro inválido ou incompleto)
- [x] Destaque visual claro da etapa atual e da próxima ação do operador

## Fase 4 — Validação de avanço (concluída)

- [x] Regra: não avançar sem o registro obrigatório preenchido
- [x] Bloquear avanço e mostrar o motivo quando faltar registro
- [x] Permitir corrigir/reabrir etapa conforme a regra definida
- [x] Testes cobrindo a regra de validação (avança e não avança)

## Fase 5 — Trilha de auditoria

- [ ] Registrar eventos (ator, ação, etapa, horário, detalhe)
- [ ] Exibir a trilha na interface
- [ ] Teste cobrindo o registro dos eventos (quem fez o quê e quando)

## Fase 6 — Tema MUI e design system

- [ ] Conferir o mapeamento do design system (`../cambiata-ui`) para o `createTheme`
- [ ] Revisar tokens claro/escuro e acessibilidade (contraste)
- [ ] Garantir que nenhuma cor esteja hardcoded (tudo pelo tema)

## Fase 7 — Testes

- [ ] Cobertura das regras de fluxo e validação
- [ ] Integração: avançar etapa, bloquear sem registro, ver trilha
- [ ] `npm run test:coverage` sem partes críticas descobertas
- [ ] Testes existentes atualizados quando o comportamento mudar

## Fase 8 — CI/CD

- [ ] GitHub Actions: lint + typecheck + test + build em push e pull request
- [ ] Badge de status no README
- [ ] Verificar o pipeline verde no repositório remoto

## Fase 9 — Deploy e README

- [ ] Publicar no ar (Vercel ou Netlify)
- [ ] Link do deploy acessível na entrevista
- [ ] README contando impacto primeiro e stack depois
- [ ] README com como rodar, decisões de arquitetura e link do demo

## Fase 10 — Preparação para a entrevista

- [ ] Revisar o glossário de domínio MES/EBR (ver `AGENTS.md`)
- [ ] Ensaiar a explicação do demo em voz alta (impacto > stack)
- [ ] Saber defender: por que MUI theme, onde vive o estado, como testei
- [ ] Preparar resposta para "como você integraria com o backend .NET"

## Critérios de pronto (definition of done)

- [ ] No ar e acessível
- [ ] README contando impacto > stack
- [ ] Testes passando no CI (lint + teste + build)
- [ ] Código limpo e versionado, com histórico de commits legível
- [ ] Decisões explicáveis sem consultar o código
