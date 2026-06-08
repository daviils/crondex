# AGENTS.md

## Projeto

Nome: Crondex

Objetivo:
Criar uma ferramenta CLI para Linux que transforme prompts em tarefas agendadas.

Exemplo:

```bash
crondex exec "busque por noticias de IA" --schedule="23:30"
```

A ferramenta deve permitir que prompts sejam executados automaticamente usando um executor configurável.

---

# Papel do agente

Você atua como:

* Arquiteto de software
* Desenvolvedor TypeScript
* Revisor de código
* Mantenedor do projeto

Seu objetivo é gerar código de produção.

Prioridades:

1. Código simples
2. Extensibilidade
3. Testabilidade
4. Observabilidade
5. Baixa dependência externa

---

# Regras obrigatórias

## Arquitetura

Utilizar:

* Clean Architecture (leve)
* SOLID
* Dependency Injection simples
* Separação de domínio e infraestrutura

Evitar:

* Singleton global
* Classes com múltiplas responsabilidades
* Acoplamento com Codex
* Frameworks desnecessários

---

## Stack

Runtime:

* Node.js LTS

Linguagem:

* TypeScript

Bibliotecas permitidas:

* commander
* zod
* fs-extra
* execa
* vitest

Não adicionar dependências sem justificativa.

---

# Estrutura esperada

```txt
src/
 ├── cli/
 ├── scheduler/
 ├── executor/
 ├── jobs/
 ├── logs/
 ├── utils/
 └── main.ts
```

Cada pasta deve possuir responsabilidade única.

---

# Persistência

Persistir somente em arquivos.

Formato:

```txt
jobs/jobs.json
logs/
```

Não usar:

* Banco SQL
* Redis
* ORM

---

# Executor

Criar interface:

```ts
export interface Executor {
 execute(
  prompt: string
 ): Promise<ExecutionResult>;
}
```

Implementação inicial:

```txt
CodexExecutor
```

Executa:

```bash
codex "<prompt>"
```

Não implementar integração direta com APIs.

Tudo deve funcionar por terminal.

---

# Scheduler

Responsável apenas por:

* Criar timers
* Remover timers
* Ativar timers
* Executar timers

Usar:

systemd

Não usar:

cron

Gerar arquivos:

```txt
~/.config/systemd/user/
```

---

# CLI

Comandos obrigatórios:

```bash
crondex exec
crondex run
crondex list
crondex logs
crondex disable
crondex remove
```

Todos os comandos devem possuir:

```bash
--help
```

Exemplo:

```bash
crondex exec \
"buscar noticias IA" \
--schedule="23:30"
```

---

# Logging

Registrar:

* início
* término
* erro
* duração

Formato:

```txt
[2026-06-08 23:30:02]
START

[2026-06-08 23:30:15]
SUCCESS
```

---

# Testes

Cobertura mínima:

70%

Testar:

* parser
* scheduler
* executor
* persistência

Evitar testes frágeis.

---

# Convenções

Arquivos:

```txt
feature.type.ts
```

Exemplo:

```txt
timer.parser.ts
job.repository.ts
```

Classes:

PascalCase

Funções:

camelCase

Constantes:

UPPER_CASE

---

# Processo de desenvolvimento

Antes de alterar código:

1. Ler estrutura atual
2. Entender impacto
3. Propor alteração mínima
4. Implementar
5. Executar testes
6. Atualizar README

Nunca reescrever módulos sem necessidade.

---

# Entrega

Ao concluir uma tarefa:

Responder:

## Alterações

(lista)

## Arquivos criados

(lista)

## Como testar

## Próximos passos

Não deixar TODOs ocultos.
