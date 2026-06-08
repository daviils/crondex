# Crondex

CLI para Linux que transforma prompts em tarefas agendadas.

## Status

Fluxo inicial implementado:

- `crondex exec`: cria job, persiste em `jobs/jobs.json` e registra timer em systemd.
- `crondex run`: executa job persistido com `codex "<prompt>"` e registra logs.

## Comandos planejados

```bash
crondex exec
crondex run
crondex list
crondex logs
crondex disable
crondex remove
```

## Desenvolvimento

```bash
npm install
npm run build
```

## Uso

```bash
crondex exec "buscar noticias IA" --schedule="23:30"
crondex run "<jobId>"
```

## Estrutura

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
