<!--
AGENTS.md — instruções para agentes de IA (e humanos) que trabalharem neste repositório.
Este arquivo não é documentação do produto; é o "como trabalhar" do projeto.
-->

# AGENTS.md — recipe-flow

## Por que este projeto existe

`recipe-flow` é a **peça de portfólio** criada para a vaga da **levva (React Sênior)** e faz parte
do processo de busca ativa registrado no repositório **`carreira`** (`../carreira`).

O objetivo não é um produto real: é uma **"prova" a ser apresentada na entrevista técnica**,
demonstrando domínio da stack exata da vaga (React + TypeScript + Material UI + React Flow), boas
práticas (testes, CI/CD, organização de código) e entendimento do domínio (MES/EBR, produção
farmacêutica). Toda decisão de código deve ser **explicável em voz alta** na técnica.

> Regra de ouro: prefira clareza e explicabilidade à esperteza. O entrevistador vai ler e questionar
> este código — inclusive as decisões de arquitetura e o histórico de commits.

## Referências no repo `carreira` (ler antes de mudar o escopo)

- `../carreira/vagas/2026-09-05-levva-react-senior/vaga.md` — requisitos e responsabilidades da vaga.
- `../carreira/vagas/2026-09-05-levva-react-senior/prep-tecnica.md` — plano da prep, escopo do demo
  e checklist de entrega.
- `../carreira/vagas/2026-09-05-levva-react-senior/entrevista.md` — glossário MES/EBR e como falar.
- `../carreira/agenda/README.md` — calendário e prazos (o que fazer em cada bloco).

## Escopo funcional (o que o demo precisa provar)

Espelhar um **fluxo de execução de receita** de um lote (contexto MES/EBR):

- Grafo de etapas de produção de um lote, montado com React Flow (nós/arestas).
- Operador avança etapa a etapa, com **validação**: não avança sem o registro obrigatório.
- **Estados claros** por etapa: pendente, ativa, concluída, erro.
- **Trilha de auditoria simulada**: quem fez o quê e quando (o que um EBR exige da UI).
- Interface em **Material UI** com tema próprio (claro/escuro), tokens e componentes.
- **Impacto primeiro, stack depois** ao descrever o projeto (ver `prep-tecnica.md`).

Checklist de entrega (de `prep-tecnica.md`):

- [ ] No ar e acessível (deploy).
- [ ] README contando impacto > stack.
- [ ] Testes passando no CI (GitHub Actions: lint + teste + build).
- [ ] Código limpo e versionado; histórico de commits legível.
- [ ] Decisões explicáveis (por que MUI theme, onde vive o estado, como testei).

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
- Canvas React Flow estilizado pelo tema (`src/flow/flowStyles.ts`) com 1 nó fixo (`src/App.tsx`).
- Testes de App, layout e tema + exemplo com MSW.

## O que falta (a construir)

- Modelo real do fluxo: nós por etapa, arestas, estados e custom node.
- Regras de validação de avanço e onde vive o estado (App vs. nó).
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

## Regras de conteúdo (herdadas do repo `carreira`)

Valem para **README, textos da UI, descrições, commits e qualquer texto público**:

- Tudo em **português (pt-BR)**.
- **Impacto primeiro, stack depois** ao descrever o projeto.
- **Primeira pessoa** em textos de apresentação; sem começar todo bullet com verbo.
- Sem `~`, sem travessão no meio de frases, sem "cerca de" para anos.
- Sem copiar o anúncio; sem listar falhas/gaps ("não sei", "não tenho experiência com").
- Nunca "MEI" nem "Brasil" em texto público; contratação é "PJ" e localização é "Remoto".
- Premissas imutáveis da busca: remoto-BR e PJ; jamais sugerir presencial/híbrido/CLT.

## Verificação ao concluir uma edição

- [ ] `npm run lint`, `npm run test` e `npm run build` passam.
- [ ] Sem hardcode de cor: tudo pelo tema/tokens?
- [ ] Teste cobrindo a nova regra de fluxo/validação?
- [ ] Continua explicável em voz alta na entrevista técnica?
