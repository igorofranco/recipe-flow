<!--
AGENTS.md — instruções para agentes de IA (e humanos) que trabalharem neste repositório.
Este arquivo não é documentação do produto; é o "como trabalhar" do projeto.
-->

# AGENTS.md — recipe-flow

## Por que este projeto existe

`recipe-flow` é uma **peça de portfólio** criada para uma **entrevista técnica de React Sênior**.

O objetivo não é um produto real: é uma **"prova"**, demonstrando domínio da stack da vaga
(React + TypeScript + Material UI + React Flow), boas práticas (testes, CI/CD, organização de código)
e entendimento do domínio (MES/EBR, produção farmacêutica). Toda decisão de código deve ser
**explicável em voz alta** na entrevista.

> Regra de ouro: prefira clareza e explicabilidade à esperteza. O entrevistador vai ler e questionar
> este código — inclusive as decisões de arquitetura e o histórico de commits.

## Contexto de domínio (MES/EBR)

O demo simula a execução de uma receita na produção farmacêutica. Vocabulário mínimo:

- **MES (Manufacturing Execution System):** acompanha e controla a produção no chão de fábrica em
  tempo real, do início ao fim do lote.
- **EBR (Electronic Batch Record):** registro eletrônico do lote. Versão digital do registro em
  papel que documenta como um lote foi produzido, quem fez o quê e em que momento.
- **Receita (recipe):** passo a passo da execução de um lote (etapas, ordem, parâmetros) que o
  operador segue na tela.
- **Lote:** instância de produção que percorre as etapas da receita.
- **GMP:** boas práticas de fabricação; exigem rastreabilidade e auditoria.
- **Ambiente regulado (ex.: 21 CFR Part 11):** toda ação fica registrada; a UI não deixa avançar
  fora da regra. Erro de interface vira erro de produção.

## Escopo funcional (o que o demo precisa provar)

Espelhar um **fluxo de execução de receita** de um lote (contexto MES/EBR):

- Grafo de etapas de produção de um lote, montado com React Flow (nós/arestas).
- Operador avança etapa a etapa, com **validação**: não avança sem o registro obrigatório.
- **Estados claros** por etapa: pendente, ativa, concluída, erro.
- **Trilha de auditoria simulada**: quem fez o quê e quando (o que um EBR exige da UI).
- Interface em **Material UI** com tema próprio (claro/escuro), tokens e componentes.
- **Impacto primeiro, stack depois** ao descrever o projeto.

Plano detalhado por fases e progresso: `PLANO.md`.

## Stack

- Vite + React 19 + TypeScript (strict)
- MUI (`@mui/material` + Emotion) — tema em `src/theme/`
- React Flow (`@xyflow/react`) — grafo do fluxo
- Testes: Vitest + Testing Library + MSW (`src/test/mocks/`)
- ESLint (flat) + Prettier
- CI/CD: GitHub Actions (a configurar) + deploy (Vercel/Netlify)

## Estado atual

- Tema MUI com tokens claro/escuro (`src/theme/`), paleta custom (`accent`, `neutral`, `base`) e `radius`.
- Layout do lote (`src/layouts/BatchExecutionLayout.tsx`): AppBar, chip de status, botões
  Iniciar/Pausar/Finalizar e Stepper de etapas.
- Canvas React Flow estilizado pelo tema (`src/flow/flowStyles.ts`) com nós gerados a partir das
  etapas da receita, arestas na ordem, custom node MUI (`src/flow/StepNode.tsx`) e painel lateral
  de detalhes/registro (`src/flow/StepDetailsPanel.tsx`).
- Builder do grafo explicável e testável (`src/flow/buildFlowGraph.ts`): projeta receita + lote em
  nós/arestas, sem guardar estado no nó.
- Estados por etapa (pendente, ativa, concluída, erro) derivados do lote em `src/flow/buildFlowGraph.ts`;
  validação do registro em `src/domain/validation.ts` e transição em `stepCompleted`.
- Avanço bloqueado sem registro obrigatório, com motivo por campo e reabertura de etapa
  (`stepReopened` invalida as etapas seguintes).
- Testes de App, layout, tema, grafo, validação e painel + exemplo com MSW.

## O que falta (a construir)

- Trilha de auditoria (registro das ações/registros do operador).
- README do repo (impacto > stack).
- GitHub Actions (lint + test + build) e deploy.
- Mapear o design system (`../cambiata-ui`) para o `createTheme` do MUI, se ainda não coberto.

## Comandos

| Ação      | Comando                                             |
| --------- | --------------------------------------------------- |
| Dev       | `npm run dev`                                       |
| Build     | `npm run build`                                     |
| Typecheck | `npm run typecheck`                                 |
| Lint      | `npm run lint` (`lint:fix` para corrigir)           |
| Formatar  | `npm run format` (`format:check` para checar)       |
| Testes    | `npm run test` (`test:watch`, `test:coverage`)      |

**Ao concluir qualquer alteração:** rode `npm run lint`, `npm run test` e `npm run build`. Não
entregue com vermelho.

## Convenções de código

- Siga os arquivos vizinhos: nomes, organização por pasta (`theme/`, `layouts/`, `flow/`) e tipos.
- Use componentes do MUI; não recrie o que a lib entrega.
- **Nunca** hardcode cores/tokens: use `createTheme`/`theme.vars.palette` (o tema é a fonte da verdade).
- Tipagem estrita; evite `any`. `verbatimModuleSyntax` ligado — use `import type`.
- Não adicione comentários ao código.
- Toda regra de fluxo/validação relevante deve ter teste (Vitest + RTL); use MSW para API.
- Mantenha os testes existentes passando; atualize-os quando o comportamento mudar.

## Regras de conteúdo

Valem para **README, textos da UI, descrições e qualquer texto público**:

- Tudo em **português (pt-BR)**.
- **Impacto primeiro, stack depois** ao descrever o projeto.
- **Primeira pessoa** em textos de apresentação; sem começar todo bullet com verbo.
- Sem `~`, sem travessão no meio de frases, sem "cerca de" para anos.
- Sem copiar textos de terceiros; sem listar falhas/gaps ("não sei", "não tenho experiência com").

## Verificação ao concluir uma edição

- [ ] `npm run lint`, `npm run test` e `npm run build` passam.
- [ ] Sem hardcode de cor: tudo pelo tema/tokens?
- [ ] Teste cobrindo a nova regra de fluxo/validação?
- [ ] Continua explicável em voz alta na entrevista técnica?
